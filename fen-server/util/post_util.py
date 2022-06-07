from database import db
from datetime import datetime

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    pub_date = db.Column(db.DateTime, default=datetime.utcnow)
    image_path = db.Column(db.String(100))

    #Foreign key that links User with the Post
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))

# class Comment(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     body = db.Column(db.Text)
#     user_id = db.Column("user_id", db.Integer, db.ForeignKey('user.id'))
#     post_id = db.Column("post_id", db.Integer, db.ForeignKey('user.id'))

 
