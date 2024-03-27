from flask import jsonify, request, Blueprint

from sqlalchemy import text
from jsonschema import validate, ValidationError

import models

from instances import db
from utilities import dbh, validate_params

# our blueprint
db_entry_api = Blueprint('db_entry_api', __name__)

@db_entry_api.route('/create', methods=['POST'])
def createEntry():
    """ 
    Requires: 
        Params: user_id, resume_id, 
        JSON Body: entry 
    """

    json_entry = request.get_json()
    user_id = request.args.get('user_id')
    resume_id = request.args.get('resume_id')

    # Validate that user_id and resume_id are both not None
    if error := validate_params({'user_id':user_id, 'resume_id':resume_id}, "createEntry") is not None:
        return error

    # Validate that user_id is in the database
    if (db.session.query(models.User).filter_by(user_id=user_id).first()) is None:
        return jsonify({'error': f'Failed to create entry, could not find user by id {user_id}.'})

    # Validate that resume_id is in the database
    if (resume := db.session.query(models.Resume).filter_by(resume_id=resume_id).first()) is None:
        return jsonify({'error': f'Failed to create entry, could not find resume by id {resume_id}.'})

    # Put it in the uncategorized section by default
    json_entry['section_id'] = dbh.getDefaultSection(resume).section_id

    try:
        res = dbh.addNewEntry(json_entry)
        db.session.commit()
    except ValidationError as e:
        return jsonify({'error': f'Failed to create entry, could not validate entry object. {e.message}'}), 500
    except Exception as e:
        return jsonify({'error': f'Failed to push entry, database error: {e}'}), 500

    return jsonify(dbh.getJsonEntry(res)), 200
    
@db_entry_api.route('/read')
def readEntry():
    """ 
    Requires: 
        Params: user_id AND/OR entry_id
    """
    
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
    """ 
    Requires: 
        Params: entry_id
        JSON Body: entry
    """

    entry_id = request.args.get('entry_id')
    if error := validate_params({'entry_id':entry_id}, "updateEntry") is not None:
        return error

    if (entry := db.session.query(models.Entry).filter_by(entry_id=entry_id).first()) is None:
        return jsonify({'error': f'Failed to update entry, could not find entry with id {entry_id}.'}), 500

    # Get the resume that the existing entry belongs to
    # TODO: USE JOINS, NOT CONSECUTIVE QUERIES
    section = db.session.query(models.Section).filter_by(section_id=entry.section_id).first()
    resume = db.session.query(models.Resume).filter_by(resume_id=section.resume_id).first()

    json_entry = request.get_json()

    # Put it in the uncategorized section by default
    json_entry['section_id'] = dbh.getDefaultSection(resume).section_id

    try: validate(json_entry, models.entry_schema)
    except Exception as e: 
        return jsonify({'error': f'Failed to update entry, could not validate entry object. {e.message}'}), 500

    # Delete the entry
    dbh.deleteEntry(entry)
    db.session.commit()

    # Recreate it
    res = dbh.addNewEntry(json_entry)
    db.session.commit()

    return jsonify(dbh.getJsonEntry(res)), 200
    

@db_entry_api.route('/delete', methods=['DELETE'])
def deleteEntry():
    """ 
    Requires: 
        Params: entry_id
    """

    entry_id = request.args.get('entry_id')
    if (error := validate_params({'entry_id':entry_id}, "deleteEntry")) is not None:
        return error

    if (entry := db.session.query(models.Entry).filter_by(entry_id=entry_id).first()) is None:
        return jsonify({'error': 'Failed to fetch entry, invalid entry_id'}), 500

    dbh.deleteEntry(entry)
    db.session.commit()

    return jsonify({'success':"Entry deleted from database!"}), 200