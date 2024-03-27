from flask import jsonify, request, Blueprint

from sqlalchemy import text
from jsonschema import validate

import models

from instances import db
from utilities import dbh

# our blueprint
db_entry_api = Blueprint('db_entry_api', __name__)

@db_entry_api.route('/create', methods=['POST'])
def createEntry():
    json_entry = request.get_json()

    try: validate(json_entry, models.entry_schema)
    except Exception as e: 
        return jsonify({'error': f'Failed to create entry, could not validate entry object. {e.message}'}), 500

    try:
        res = dbh.addNewEntry(json_entry)
        db.session.commit()
    except Exception as e:
        return jsonify({'error': f'Failed to push entry, database error: {e}'}), 500

    return jsonify(dbh.getJsonEntry(res)), 200
    
@db_entry_api.route('/read')
def readEntry():
    user_id = request.args.get('user_id')
    entry_id = request.args.get('entry_id')

    if entry_id:
        if (entry := db.session.query(models.Entry).filter_by(entry_id=entry_id).first()) is None:
            return jsonify({'error': f'Failed to retrieve entry, no matching entry_id.'}), 500
        else:
            return jsonify(dbh.getJsonEntry(entry)), 200

    elif user_id:
        entries = db.session.query(models.Entry) \
            .join(models.Section, models.Entry.section_id == models.Section.section_id) \
            .join(models.Resume, models.Section.resume_id == models.Resume.resume_id) \
            .filter(models.Resume.user_id == user_id).all()


        return jsonify({entry.entry_id : dbh.getJsonEntry(entry) for entry in entries})

    else:
        return jsonify({'error': f'Failed to retrieve entry, no entry_id or user_id given.'}), 500


@db_entry_api.route('/update', methods=['PUT'])
def updateEntry():
    user_id = request.args.get('user_id')
    resume_id = request.args.get('resume_id')
    json_resume = request.get_json()
    try: validate(json_resume, models.resume_schema)
    except Exception as e: 
        return jsonify({'error': f'Failed to create resume, could not validate resume object. {e.message}'}), 500

    # Attempt to grab list of resumes based on user id, fails if invalid user_id
    if (resumes := db.session.query(models.Resume).filter_by(user_id=user_id)) is None:
        return jsonify({'error': 'Failed to fetch resume, unknown user_id'}), 500

    # Attempt to grab a resume based on that id, fails if invalid resume_id
    if (resume := resumes.filter_by(resume_id=resume_id).first()) is None:
        return jsonify({'error': 'Failed to fetch resume, unknown resume_id'}), 500

    # Delete the resume
    dbh.deleteResume(resume)
    db.session.commit()

    # Recreate it
    res = dbh.addNewResume(json_resume)
    db.session.commit()

    return jsonify(dbh.getJsonResume(res)), 200
    

@db_entry_api.route('/delete', methods=['DELETE'])
def deleteEntry():
    user_id = request.args.get('user_id')
    resume_id = request.args.get('resume_id')

    # Attempt to grab list of resumes based on user id, fails if invalid user_id
    if (resumes := db.session.query(models.Resume).filter_by(user_id=user_id)) is None:
        return jsonify({'error': 'Failed to fetch resume, unknown user_id'}), 500

    # Attempt to grab a resume based on that id, fails if invalid resume_id
    if (resume := resumes.filter_by(resume_id=resume_id).first()) is None:
        return jsonify({'error': 'Failed to fetch resume, unknown resume_id'}), 500

    dbh.deleteResume(resume)
    db.session.commit()

    return jsonify({'success':"Resume deleted from database!"}), 200