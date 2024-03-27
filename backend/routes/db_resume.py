from flask import jsonify, request, Blueprint

from sqlalchemy import text
from jsonschema import validate, ValidationError

import models

from instances import db
from utilities import dbh

# our blueprint
db_resume_api = Blueprint('db_resume_api', __name__)

@db_resume_api.route('/create', methods=['POST'])
def createResume():
    json_resume = request.get_json()
    user_id = request.args.get('user_id')

    if user_id is None:
        return jsonify({'error': 'Failed to create resume, no user_id given'}), 500

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
    user_id = request.args.get('user_id')
    resume_id = request.args.get('resume_id')

    if user_id is None:
        return jsonify({'error': 'Failed to fetch resume, no user_id'}), 500

    # Attempt to grab list of resumes based on user id, fails if invalid user_id
    if (resumes := db.session.query(models.Resume).filter_by(user_id=user_id)) is None:
        return jsonify({'error': 'Failed to fetch resume, unknown user_id'}), 500

    # If user_id is good but we weren't given resume_id, just return list of resumes
    if resume_id is None:
        return jsonify({resume.resume_id : dbh.getJsonResume(resume) for resume in resumes})

    # Attempt to grab a resume based on that id, fails if invalid resume_id
    if (resume := resumes.filter_by(resume_id=resume_id).first()) is None:
        return jsonify({'error': 'Failed to fetch resume, unknown resume_id'}), 500

    # Returns the resume that was found
    return jsonify(dbh.getJsonResume(resume)), 200
        
@db_resume_api.route('/update', methods=['PUT'])
def updateResume():
    user_id = request.args.get('user_id')
    resume_id = request.args.get('resume_id')

    if user_id is None:
        return jsonify({'error': 'Failed to update resume, no user_id'}), 500

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
    

@db_resume_api.route('/delete', methods=['DELETE'])
def deleteResume():
    user_id = request.args.get('user_id')
    resume_id = request.args.get('resume_id')

    if user_id is None:
        return jsonify({'error': 'Failed to update resume, no user_id'}), 500

    # Attempt to grab list of resumes based on user id, fails if invalid user_id
    if (resumes := db.session.query(models.Resume).filter_by(user_id=user_id)) is None:
        return jsonify({'error': 'Failed to fetch resume, unknown user_id'}), 500

    # Attempt to grab a resume based on that id, fails if invalid resume_id
    if (resume := resumes.filter_by(resume_id=resume_id).first()) is None:
        return jsonify({'error': 'Failed to fetch resume, unknown resume_id'}), 500

    dbh.deleteResume(resume)
    db.session.commit()

    return jsonify({'success':"Resume deleted from database!"}), 200
    
@db_resume_api.route('/connect')
def dbConnection():
    try:
        query = text("SELECT 1")
        result = db.session.execute(query)
        return "Database connection successful!"
    except Exception as e:
        return f"Database connection error: {str(e)}"
