class Resume(db.Model):
    resume_id = db.Column(db.Integer, unique=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    # Relationships (one-to-many)
    sections = db.relationship('Section', backref='resume', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Resume {self.id} (user_id: {self.user_id})>'