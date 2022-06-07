from database import db
from datetime import datetime

class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text)
    avatar_path = db.Column(db.String(100))
    profile_name = db.Column(db.String(100))

    #Foreign key that links User with the Post
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))