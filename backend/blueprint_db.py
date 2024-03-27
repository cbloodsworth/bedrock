from flask import jsonify, request, Blueprint
from dotenv import load_dotenv

from sqlalchemy import text
from jsonschema import validate

import models
from models import db
from utilities import DBHelper

# our blueprint
db_api = Blueprint('db_api', __name__)
dbh = DBHelper(db)

def getJsonBullet(bullet: models.BulletPoint) -> dict:
    """ Given a BulletPoint database model, return the json representation as a dict. """
    json_bullet = {
        'bulletpoint_id' : bullet.bulletpoint_id,
        'content' : bullet.content
    }
    validate(json_bullet, models.bullet_schema)
    return json_bullet

def getJsonEntry(entry: models.Entry) -> dict:
    """ Given an Entry database model, return the json representation as a dict. """
    json_entry = {
        'entry_id': entry.entry_id,
        'title': entry.title, 
        'bullets': [getJsonBullet(bullet) for bullet in db.session.query(models.BulletPoint).filter_by(entry_id=entry.entry_id).all()]
    }
    validate(json_entry, models.entry_schema)
    return json_entry

def getJsonSection(section: models.Section) -> dict:
    """ Given a Section database model, return the json representation as a dict. """
    json_section = {
        'section_id': section.section_id,
        'title': section.title,
        'entries': [getJsonEntry(entry) for entry in db.session.query(models.Entry).filter_by(section_id=section.section_id).all()]
    }
    validate(json_section, models.section_schema)
    return json_section

def getJsonResume(resume: models.Resume) -> dict:
    """ Given a Resume database model, return the json representation as a dict. """
    json_resume = {
        'user_id' : resume.user_id,
        'resume_id': resume.resume_id,
        'title': resume.title, 
        'sections': [getJsonSection(section) for section in db.session.query(models.Section).filter_by(resume_id=resume.resume_id).all()]
    }

    # Validates this against our schema before returning
    validate(json_resume, models.resume_schema)
    return json_resume


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

    return jsonify(getJsonResume(res)), 200
    
@db_api.route('/read/resume')
def readResume():
    user_id = request.args.get('user_id')
    resume_id = request.args.get('resume_id')

    # Attempt to grab list of resumes based on user id, fails if invalid user_id
    if (resumes := db.session.query(models.Resume).filter_by(user_id=user_id)) is None:
        return jsonify({'error': 'Failed to fetch resume, unknown user_id'}), 500

    # If user_id is good but we weren't given resume_id, just return list of resumes
    if resume_id is None:
        return jsonify({resume.resume_id : getJsonResume(resume) for resume in resumes})

    # Attempt to grab a resume based on that id, fails if invalid resume_id
    if (resume := resumes.filter_by(resume_id=resume_id).first()) is None:
        return jsonify({'error': 'Failed to fetch resume, unknown resume_id'}), 500

    # Returns the resume that was found
    return jsonify(getJsonResume(resume)), 200
        
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

    return jsonify(getJsonResume(res)), 200
    

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
