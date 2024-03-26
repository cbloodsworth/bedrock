from flask import jsonify, request, redirect, url_for, session, Blueprint
from dotenv import load_dotenv

from sqlalchemy import text
from jsonschema import validate, ValidationError

import models
from utilities import db, login_manager

# our blueprint
db_api = Blueprint('db_api', __name__)
load_dotenv()

class DBHelper:
    def getBullet(self, bullet: models.BulletPoint):
        json_bullet = {
            'bulletpoint_id' : bullet.bulletpoint_id,
            'content' : bullet.content
        }
        validate(json_bullet, models.bullet_schema)
        return json_bullet

    def getEntry(self, entry: models.Entry):
        json_entry = {
            'entry_id': entry.entry_id,
            'title': entry.title, 
            'bullets': [self.getBullet(bullet) for bullet in db.session.query(models.BulletPoint).filter_by(entry_id=entry.entry_id).all()]
        }
        validate(json_entry, models.entry_schema)
        return json_entry

    def getSection(self, section: models.Section):
        json_section = {
            'section_id': section.section_id,
            'title': section.title,
            'entries': [self.getEntry(entry) for entry in db.session.query(models.Entry).filter_by(section_id=section.section_id).all()]
        }
        validate(json_section, models.section_schema)
        return json_section

    def getResume(self, resume: models.Resume):
        json_resume = {
            'user_id' : resume.user_id,
            'resume_id': resume.resume_id,
            'title': resume.title, 
            'sections': [self.getSection(section) for section in db.session.query(models.Section).filter_by(resume_id=resume.resume_id).all()]
        }

        # Validates this against our schema before returning
        validate(json_resume, models.resume_schema)
        return json_resume

    # Adds a bullet to the database session, does not commit
    def putBullet(self, json_bullet):
        bullet = models.BulletPoint(
            entry_id=json_bullet.get('entry_id'),
            content=json_bullet.get('content')
        )
        db.session.add(bullet)

        return bullet

    # Adds an entry to the database session, does not commit
    def putEntry(self, json_entry):
        entry = models.Entry(
            section_id=json_entry.get('section_id'),
            title=json_entry.get('title')
        )

        db.session.add(entry)
        db.session.flush()

        for json_bullet in json_entry.get('bullets'):
            json_bullet['entry_id'] = entry.entry_id
            self.putBullet(json_bullet)

        return entry
            
    # Adds a section to the database session, does not commit
    def putSection(self, json_section):
        section = models.Section(
            resume_id=json_section.get('resume_id'),
            title=json_section.get('title'),
        )
        
        db.session.add(section)
        db.session.flush()

        for json_entry in json_section.get('entries'):
            json_entry['section_id'] = section.section_id
            self.putEntry(json_entry)

        return section

    # Adds a resume to the database session, does not commit
    def putResume(self, json_resume):
        resume = models.Resume(
            user_id=json_resume.get('user_id'),
            title=json_resume.get('title')
        )

        db.session.add(resume)
        db.session.flush()

        for json_section in json_resume.get('sections'):
            json_section['resume_id'] = resume.resume_id
            self.putSection(json_section)

        return resume

    def delBullet(self, bullet: models.BulletPoint):
        db.session.delete(bullet)

    def delEntry(self, entry: models.Entry):
        for bullet in db.session.query(models.BulletPoint).filter_by(entry_id=entry.entry_id).all():
            self.delBullet(bullet)

    def delSection(self, section: models.Section):
        for entry in db.session.query(models.Entry).filter_by(section_id=section.section_id).all():
            self.delEntry(entry)

        db.session.delete(section)

    def delResume(self, resume: models.Resume):
        for section in db.session.query(models.Section).filter_by(resume_id=resume.resume_id).all():
            self.delSection(section)

        db.session.delete(resume)

dbh = DBHelper()

@db_api.route('/create/resume', methods=['POST'])
def createResume():
    json_resume = request.get_json()
    try: validate(json_resume, models.resume_schema)
    except Exception as e: 
        return jsonify({'error': f'Failed to create resume, could not validate resume object. {e.message}'}), 500

    try:
        res = dbh.putResume(json_resume)
        db.session.commit()
    except Exception as e:
        return jsonify({'error': f'Failed to push resume, database error: {e}'}), 500

    return jsonify(dbh.getResume(res)), 200
    
@db_api.route('/read/resume')
def readResume():
    user_id = request.args.get('user_id')
    resume_id = request.args.get('resume_id')

    # Attempt to grab list of resumes based on user id, fails if invalid user_id
    if (resumes := db.session.query(models.Resume).filter_by(user_id=user_id)) is None:
        return jsonify({'error': 'Failed to fetch resume, unknown user_id'}), 500

    # If user_id is good but we weren't given resume_id, just return list of resumes
    if resume_id is None:
        return jsonify({resume.resume_id : dbh.getResume(resume) for resume in resumes})

    # Attempt to grab a resume based on that id, fails if invalid resume_id
    if (resume := resumes.filter_by(resume_id=resume_id).first()) is None:
        return jsonify({'error': 'Failed to fetch resume, unknown resume_id'}), 500

    # Returns the resume that was found
    return jsonify(dbh.getResume(resume)), 200
        
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
    dbh.delResume(resume)
    db.session.commit()

    # Recreate it
    res = dbh.putResume(json_resume)
    db.session.commit()

    return jsonify(dbh.getResume(res)), 200
    

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

    dbh.delResume(resume)
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
