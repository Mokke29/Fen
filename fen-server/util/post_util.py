from database import db
from datetime import datetime

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    pub_date = db.Column(db.DateTime, default=datetime.utcnow)
    image_path = db.Column(db.String(100))

    #Foreign key that links User with the Post
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))

    comment= db.relationship("Comment", backref='comment', foreign_keys='Comment.post_id')

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    pub_date = db.Column(db.DateTime, default=datetime.utcnow)
    reply_to = db.Column(db.Integer)

    post_id = db.Column(db.Integer, db.ForeignKey('post.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))

    
def create_comment(content, post_id, user_id):
    try:
        new_comment = Comment(content=content, post_id=post_id, user_id=user_id)
        db.session.add_all([new_comment])
        db.session.commit()
        return True
    except Exception as e:
        print(f"Database error... {e}")
        return False

def create_reply(content, post_id, user_id, comment_id):
    try:
        new_reply = Comment(content=content, post_id=post_id, user_id=user_id, reply_to = comment_id)
        db.session.add_all([new_reply])
        db.session.commit()
        return True
    except Exception as e:
        print(f"Database error... {e}")
        return False