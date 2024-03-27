from flask_login import LoginManager

import models
login_manager = LoginManager()

class DBHelper:
    """ Helper class to provide basic functionality for interacting with the database in
        the context of our app (Resumes, Entries, etc.) 

        Really just a wrapper to make things easier to follow.
    """
    def __init__(self, db):
        self.db = db

    def addNewBullet(self, json_bullet):
        """ Given a json representation, adds a bullet to the database session, does not commit. """
        bullet = models.BulletPoint(
            entry_id=json_bullet.get('entry_id'),
            content=json_bullet.get('content')
        )
        self.db.session.add(bullet)

        return bullet

    def addNewEntry(self, json_entry):
        """ Given a json representation, adds an entry to the database session, does not commit. """
        entry = models.Entry(
            section_id=json_entry.get('section_id'),
            title=json_entry.get('title')
        )

        self.db.session.add(entry)
        self.db.session.flush()

        for json_bullet in json_entry.get('bullets'):
            json_bullet['entry_id'] = entry.entry_id
            self.addNewBullet(json_bullet)

        return entry
            
    def addNewSection(self, json_section):
        """ Given a json representation, adds a section to the database session, does not commit. """
        section = models.Section(
            resume_id=json_section.get('resume_id'),
            title=json_section.get('title'),
        )
        
        self.db.session.add(section)
        self.db.session.flush()

        for json_entry in json_section.get('entries'):
            json_entry['section_id'] = section.section_id
            self.addNewEntry(json_entry)

        return section

    def addNewResume(self, json_resume):
        """ Given a json representation, adds a resume to the database session, does not commit. """
        resume = models.Resume(
            user_id=json_resume.get('user_id'),
            title=json_resume.get('title')
        )

        self.db.session.add(resume)
        self.db.session.flush()

        for json_section in json_resume.get('sections'):
            json_section['resume_id'] = resume.resume_id
            self.addNewSection(json_section)

        return resume

    def deleteBullet(self, bullet: models.BulletPoint):
        """ Given a BulletPoint model, deletes it from the database. """
        self.db.session.delete(bullet)

    def deleteEntry(self, entry: models.Entry):
        """ Given an Entry model, deletes it from the database, AS WELL AS ITS CHILDREN BULLETPOINTS. """
        for bullet in self.db.session.query(models.BulletPoint).filter_by(entry_id=entry.entry_id).all():
            self.deleteBullet(bullet)

    def deleteSection(self, section: models.Section):
        """ Given a Section model, deletes it from the database, AS WELL AS ITS CHILD ENTRIES. """
        for entry in self.db.session.query(models.Entry).filter_by(section_id=section.section_id).all():
            self.deleteEntry(entry)

        self.db.session.delete(section)

    def deleteResume(self, resume: models.Resume):
        """ Given a Resume model, recursively deletes itself and all its children (sections, entries, bullets.) """
        for section in self.db.session.query(models.Section).filter_by(resume_id=resume.resume_id).all():
            self.deleteSection(section)

        self.db.session.delete(resume)