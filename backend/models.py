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

#################### JSON SCHEMA ####################
bullet_schema = {
    "type": "object",
    "properties": {
        "bulletpoint_id" : {"type" : "integer"},
        "content" : {"type" : "string"}
    },
    "additionalProperties": False,
    "required" : ["bulletpoint_id"]
}

entry_schema = {
    "type" : "object",
    "properties" : {
        "title" : {"type" : "string"},
        "bullets" : {
            "type" : "array",
            "items" : bullet_schema
        }
    },
    "additionalProperties": False,
    "required" : ["entry_id"]
}

section_schema = {
    "type": "object",
    "properties": {
        "section_id" : {"type" : "integer"},
        "title" : {"type" : "string"},
        "order_number" : {"type" : "integer"},
        "entries" : {
            "type" : "array",
            "items" : entry_schema
        }
    },
    "additionalProperties": False,
    "required" : ["section_id"]
}
resume_schema = {
    "type" : "object",
    "properties" : {
        "user_id" : {"type" : "integer"},
        "resume_id" : {"type" : "integer"},
        "title" : {"type" : "string"},
        "sections" : {
            "type" : "array",
            "items" : section_schema
        }
    },
    "additionalProperties": False,
    "required": ["resume_id", "user_id"],
}
