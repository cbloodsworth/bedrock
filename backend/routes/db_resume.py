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
        Params: user_id AND/OR entry_id
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
    