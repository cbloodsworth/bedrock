from flask import jsonify, request, Blueprint

from sqlalchemy import text
from jsonschema import validate, ValidationError

import models

from instances import db
from utilities import dbh, validate_params

# our blueprint
db_resume_api = Blueprint('db_resume_api', __name__)

@db_resume_api.route('/create', methods=['POST'])
def createResume():
    """ 
    Requires: 
        Params: user_id
        JSON Body: resume

    Purpose:
        Pushes a resume to the database under the user referenced by user_id.
        Does not require resume_id, one is generated.
        Returns the json representation of inserted resume on success. This representation will 
            contain generated IDs for every child object (sections, entries, bullet points.)
        Not idempotent: does not check for duplicates in any way, will always add a new resume on success.
    """

    json_resume = request.get_json()
    user_id = request.args.get('user_id')

    if error := validate_params({'user_id':user_id}, "createResume") is not None:
        return error

    try:
        res = dbh.addNewResume(json_resume)
        db.session.commit()
    except ValidationError as e:
        return jsonify({'error': f'Failed to create resume, could not validate resume object. {e.message}'}), 500
    except Exception as e:
        return jsonify({'error': f'Failed to push resume, database error: {e}'}), 500

    return jsonify(dbh.getJsonResume(res)), 200
    
@db_resume_api.route('/read')
def readResume():
    """ 
    Requires: 
        Params: user_id AND/OR resume_id

    Purpose:
        Returns a resume or array of resumes based on input.
        If a resume id is provided, then a json representation of that resume is returned.
        If a user id is provided but not a resume id, then it will return *all* resumes
            associated with that user.
        This operation is idempotent and has no side-effects.
    """
    user_id = request.args.get('user_id')
    resume_id = request.args.get('resume_id')

    # Gets that specific resume
    if resume_id:
        if (resume := db.session.query(models.Resume).filter_by(resume_id=resume_id).first()) is None:
            return jsonify({'error': f'Failed to retrieve entry, no matching entry_id.'}), 500
        else:
            return jsonify(dbh.getJsonResume(resume)), 200

    # Gets all resumes matching user id
    elif user_id:
        if (resumes := db.session.query(models.Resume).filter_by(user_id=user_id)) is None:
            return jsonify({'error': 'Failed to fetch resume, unknown user_id'}), 500
        else:
            return jsonify({resume.resume_id : dbh.getJsonResume(resume) for resume in resumes})

    # No info given: can't return anything
    else:
        return jsonify({'error': f'Failed to retrieve resume, no resume_id or user_id given.'}), 500
        
@db_resume_api.route('/update', methods=['PUT'])
def updateResume():
    """ 
    Requires: 
        Params: resume_id
        JSON Body: resume

    Purpose:
        Updates a resume in the database to the provided json body.
        A resume_id is required -- whatever resume this refers to is deleted, with the new
            resume inserted in its place.
        Not technically idempotent since new IDs are generated every time. If you are using
            this route, make sure to take note of the new IDs for the resume, sections, 
            entries, and bullet points -- the new json representation is returned on success.
        >>NOTE THAT THIS ROUTE IS NOT PERFORMANT - It may take anywhere from 3-12 seconds per run.
            If an update is required on a resource, prefer updating that specific resource
            through its own route: e.g., /db/entry/update for entries.
    """
    resume_id = request.args.get('resume_id')
    if (error := validate_params({'resume_id':resume_id}, "deleteResume")) is not None:
        return error

    json_resume = request.get_json()
    try: validate(json_resume, models.resume_schema)
    except Exception as e: 
        return jsonify({'error': f'Failed to create resume, could not validate resume object. {e.message}'}), 500

    if (resume := db.session.query(models.Resume).filter_by(resume_id=resume_id).first()) is None:
        return jsonify({'error': 'Failed to fetch resume, invalid resume_id'}), 500

    # Delete the resume
    dbh.deleteResume(resume)
    db.session.commit()

    # Recreate it
    res = dbh.addNewResume(json_resume)
    db.session.commit()

    return jsonify(dbh.getJsonResume(res)), 200
    

@db_resume_api.route('/delete', methods=['DELETE'])
def deleteResume():
    """ 
    Requires: 
        Params: resume_id

    Purpose:
        Deletes the resume associated with the provided resume_id.
        If no resume in the database has the provided resume_id, an error is thrown.
        Not idempotent.
    """
    resume_id = request.args.get('resume_id')

    if (error := validate_params({'resume_id':resume_id}, "deleteResume")) is not None:
        return error

    resume = db.session.query(models.Resume).filter_by(resume_id=resume_id).first()
    if resume is None:
        return jsonify({'error': 'Failed to fetch resume, invalid resume_id'}), 500

    dbh.deleteResume(resume)
    db.session.commit()

    return jsonify({'success':"Resume deleted from database!"}), 200
    