from utilities import db
from flask_login import UserMixin

class User(UserMixin, db.Model):
    # Keys
    user_id = db.Column(db.Integer, primary_key=True, unique=True)

    # Other attributes
    username = db.Column(db.String(250), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)
    google_id = db.Column(db.String(250), unique=True)
    github_id = db.Column(db.String(250), unique=True)

    # Relationships (one-to-many)
    resumes = db.relationship('Resume', backref='user', lazy=True)


class Resume(db.Model):
    # Keys
    resume_id = db.Column(db.Integer, unique=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))

    # Other attributes
    title = db.Column(db.String(250));

    # Relationships (one-to-many)
    sections = db.relationship('Section', backref='resume', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Resume {self.id} (user_id: {self.user_id})>'

class Section(db.Model):
    # Keys
    section_id = db.Column(db.Integer, unique=True, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resume.resume_id'))

    # Other attributes
    title = db.Column(db.String(250))
    order_number = db.Column(db.Integer)

    # Relationships (one-to-many)
    entries = db.relationship('Entry', backref='section', cascade='all, delete-orphan')

class Entry(db.Model):
    # Keys
    entry_id = db.Column(db.Integer, unique=True, primary_key=True)
    section_id = db.Column(db.Integer, db.ForeignKey('section.section_id'))
    
    # Other attributes
    title = db.Column(db.String(250))
    order_number = db.Column(db.Integer)

    # Relationships (one-to-many)
    bullets = db.relationship('BulletPoint', backref='entry', cascade='all, delete-orphan')

class BulletPoint(db.Model):
    # Keys
    bulletpoint_id = db.Column(db.Integer, unique=True, primary_key=True)
    entry_id = db.Column(db.Integer, db.ForeignKey('entry.entry_id'))

    # Other attributes
    content = db.Column(db.Text)