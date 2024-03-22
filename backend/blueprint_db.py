from flask import jsonify, request, redirect, url_for, session, Blueprint
from dotenv import load_dotenv

from sqlalchemy import text

import models
from utilities import db, login_manager

# our blueprint
db_api = Blueprint('db_api', __name__)

load_dotenv()

@db_api.route('/create', methods=['POST'])
def create():
    # data = request.get_json()
    # match data.get('type'):
    #     case 'user':
    #         pass
    #     case 'resume':
    #         if (user_id := data.get('user_id')) == None:
    #             return jsonify({"error": "user id not valid"}), 400

    #         db.session.add(models.Resume(user_id=user_id))
    #         db.session.commit()
    #     case 'section':
    #         pass
    #     case 'entry':
    #         section_id = data.get('section_id')
    #         title = data.get('title')
    #         order_number = data.get('order_number')
    #         entry = models.Entry(section_id=section_id, title=title, order_number=order_number)
    #         db.session.add(entry)
    #         db.session.commit()
    #     case 'bullet_point':
    #         entry_id = data.get('entry_id')
    #         content = data.get('content')
    #         bullet_point = models.BulletPoint(entry_id=entry_id, content=content)
    #         db.session.add(bullet_point)
    #         db.session.commit()
    #     case _:
    #         print("Error in /create: Unknown object type")
    pass

def getEntry(db, entry):
    return {
        'title': entry.title, 
        'bullets': [bullet.content for bullet in db.session.query(models.BulletPoint).filter_by(entry_id=entry.entry_id).all()]
    }

def getSection(db, section):
    return {
        'title': section.title,
        'entries': [getEntry(db, entry) for entry in db.session.query(models.Entry).filter_by(section_id=section.section_id).all()]
    }

def getResume(db, resume):
    return {
        'title': resume.title, 
        'sections': [getSection(db, section) for section in db.session.query(models.Section).filter_by(resume_id=resume.resume_id).all()]
    }
    
@db_api.route('/read/resume')
def readResume():
    user_id = request.args.get('user_id')
    resume = db.session.query(models.Resume).filter_by(user_id=user_id).first()

    if resume is None:
        return jsonify({'error': 'Failed to fetch resume given user_id'}), 500
    else:
        return getResume(db, resume)

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
