from flask import jsonify, request, redirect, url_for, session, Blueprint
from dotenv import load_dotenv

from sqlalchemy import text
from jsonschema import validate, ValidationError

import models
from utilities import db, login_manager

# our blueprint
db_api = Blueprint('db_api', __name__)
load_dotenv()

def getBullet(db, bullet: models.BulletPoint):
    json_bullet = {
        'bulletpoint_id' : bullet.bulletpoint_id,
        'content' : bullet.content
    }
    validate(json_bullet, models.bullet_schema)
    return json_bullet


def getEntry(db, entry: models.Entry):
    json_entry = {
        'entry_id': entry.entry_id,
        'title': entry.title, 
        'bullets': [getBullet(db, bullet) for bullet in db.session.query(models.BulletPoint).filter_by(entry_id=entry.entry_id).all()]
    }
    validate(json_entry, models.entry_schema)
    return json_entry

def getSection(db, section: models.Section):
    json_section = {
        'section_id': section.section_id,
        'title': section.title,
        'entries': [getEntry(db, entry) for entry in db.session.query(models.Entry).filter_by(section_id=section.section_id).all()]
    }
    validate(json_section, models.section_schema)
    return json_section

def getResume(db, resume: models.Resume):
    json_resume = {
        'user_id' : resume.user_id,
        'resume_id': resume.resume_id,
        'title': resume.title, 
        'sections': [getSection(db, section) for section in db.session.query(models.Section).filter_by(resume_id=resume.resume_id).all()]
    }

    # Validates this against our schema before returning
    validate(json_resume, models.resume_schema)
    return json_resume

# Adds a bullet to the database session, does not commit
def putBullet(db, json_bullet):
    bullet = models.BulletPoint(
        bulletpoint_id=json_bullet.get('bulletpoint_id'),
        content=json_bullet.get('content')
    )
    db.session.add(bullet)

# Adds an entry to the database session, does not commit
def putEntry(db, json_entry):
    entry = models.Entry(
        entry_id=json_entry.get('entry_id'),
        title=json_entry.get('title')
    )

    for json_bullet in json_entry.get('bullets'):
        putBullet(db, json_bullet)

    db.session.add(entry)
        
# Adds a section to the database session, does not commit
def putSection(db, json_section):
    section = models.Section(
        section_id=json_section.get('section_id'),
        title=json_section.get('title'),
    )
    
    for json_entry in json_section.get('entries'):
        putEntry(db, json_entry)

    db.session.add(section)

# Adds a resume to the database session, does not commit
def putResume(db, json_resume):
    resume = models.Resume(
        user_id=json_resume.get('user_id'),
        resume_id=json_resume.get('resume_id'),
        title=json_resume.get('title')
    )

    for json_section in json_resume.get('sections'):
        putSection(db, json_section)

    db.session.add(resume)
    
@db_api.route('/read/resume')
def readResume():
    user_id = request.args.get('user_id')
    resume_id = request.args.get('resume_id')

    # Attempt to grab list of resumes based on user id, fails if invalid user_id
    if (resumes := db.session.query(models.Resume).filter_by(user_id=user_id)) is None:
        return jsonify({'error': 'Failed to fetch resume, unknown user_id'}), 500

    # If user_id is good but we weren't given resume_id, just return list of resumes
    if resume_id is None:
        return jsonify({resume.resume_id : getResume(db, resume) for resume in resumes})

    # Attempt to grab a resume based on that id, fails if invalid resume_id
    if (resume := resumes.filter_by(resume_id=resume_id).first()) is None:
        return jsonify({'error': 'Failed to fetch resume, unknown resume_id'}), 500

    # Returns the resume that was found
    return jsonify(getResume(db, resume))
        

@db_api.route('/create/resume', methods=['POST'])
def create():
    json_resume = request.get_json()
    try: validate(json_resume, models.resume_schema)
    except Exception as e: 
        return jsonify({'error': f'Failed to create resume, could not validate resume object. {e.message}'}), 500

    try:
        putResume(db, json_resume)
        db.session.commit()
    except Exception as e:
        return jsonify({'error': f'Failed to push resume, database error: {e}'}), 500

    return jsonify({"Resume inserted into database!"}), 200



@db_api.route('/read/section')
def readSection():
    section_id = 3  # replace with the actual section_id



@db_api.route('/connect')
def dbConnection():
    try:
        query = text("SELECT 1")
        result = db.session.execute(query)
        return "Database connection successful!"
    except Exception as e:
        return f"Database connection error: {str(e)}"
