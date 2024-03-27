from flask import jsonify, request, Blueprint

from sqlalchemy import text
from jsonschema import validate

import models
from models import db

from utilities import DBHelper

# our blueprint
db_api = Blueprint('db_api', __name__)
dbh = DBHelper(db)

@db_api.route('/create/resume', methods=['POST'])
def createResume():
    json_resume = request.get_json()
    try: validate(json_resume, models.resume_schema)
    except Exception as e: 
        return jsonify({'error': f'Failed to create resume, could not validate resume object. {e.message}'}), 500

    try:
        res = dbh.addNewResume(json_resume)
        db.session.commit()
    except Exception as e:
        return jsonify({'error': f'Failed to push resume, database error: {e}'}), 500

    return jsonify(dbh.getJsonResume(res)), 200
    
@db_api.route('/read/resume')
def readResume():
    user_id = request.args.get('user_id')
    resume_id = request.args.get('resume_id')

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
        
@db_api.route('/update/resume', methods=['PUT'])
def updateResume():
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
    

@db_api.route('/delete/resume', methods=['DELETE'])
def deleteResume():
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
    

@db_api.route('/connect')
def dbConnection():
    try:
        query = text("SELECT 1")
        result = db.session.execute(query)
        return "Database connection successful!"
    except Exception as e:
        return f"Database connection error: {str(e)}"
