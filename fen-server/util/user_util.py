from tkinter import EXCEPTION
from sqlalchemy import ForeignKey, PrimaryKeyConstraint
from database import db
from util import profile_util as util_profile, util
import os
#User model
class User(db.Model):
    user_id = db.Column("user_id", db.Integer, primary_key=True)
    username = db.Column("username", db.String(100), nullable=False)
    password = db.Column("password", db.String(100), nullable=False)

    posts = db.relationship("Post", backref='created_by' )
    profile = db.relationship("Profile", backref='profile_owner' )

    followed_by= db.relationship("Following", backref='user', foreign_keys='Following.user_id')
    followers= db.relationship("Following", backref='follower', foreign_keys='Following.follower_id')
    
    def __init__(self, username, password):
        self.username = username
        self.password = password

#Following model
class Following(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    follower_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))

    def __init__(self, user_id, follower_id):
        self.user_id = user_id
        self.follower_id = follower_id


images_dir = os.path.join(os.getcwd(), 'static/avatar')

def create(username, password):
    try:
        if User.query.filter_by(username=username).first():
            print(f"User already exists #{username}")
            return False
        else:
            new_user = User(username=username, password=password)
            print(f"New user .. -> {new_user}")
            print(new_user.user_id)
            db.session.add_all([new_user])
            db.session.commit()
            created_user = get_by_username(new_user.username)
            new_profile = util_profile.Profile(description="",avatar_path="user.png", profile_name=username, user_id=created_user.user_id)
            db.session.add_all([new_profile])
            db.session.commit()
            return new_user.username
    except Exception as e:
        print(f"Database error... {e}")
        return False

def delete(id):
    try:
        user = get_by_id(id)
        db.session.delete(user)
        db.session.commit()
        return True
    except:
        return False

def update():
    print('update')

def get_by_id(id):
    user = User.query.get(id)
    return user

def get_by_username(username):
    user = User.query.filter_by(username=username).first()
    return user

def edit_profile(data, id, image=False ):
    try:
        if image != False:
            new_image = util.id_generator()
            image.filename = new_image + "." + image.filename.split('.')[1]
            if util.file_exists(os.path.join(images_dir, image.filename)):
                new_image = util.id_generator()
                image.filename = new_image + "." + image.filename.split('.')[1]
            else: 
                pass

            image.save(os.path.join(images_dir, image.filename))

        edited_profile = util_profile.Profile.query.filter_by(user_id=id).first()
        if data['profile_name'] != '':
            edited_profile.profile_name = data['profile_name'] 
        if data['description'] != '': 
            edited_profile.description = data['description']
        if image != False:
            edited_profile.avatar_path = image.filename
        
        db.session.commit()
        return {"err": False}
    except Exception as e:
        print(f"Exception -> {e}")
        return {"err": True}
        
def follow(user_id, profile_to_follow):
    is_followed = False
    user_to_follow = get_by_id(profile_to_follow.user_id)
    for follower in user_to_follow.followed_by:
        
        if user_id == follower.follower.user_id:
            is_followed = True
            break
        else: 
            print(f"User logged in id:{user_id}")
            print(f"User that follows this account id:{follower.follower.user_id}")
    if is_followed == False:
        new_following_action = Following(user_id=profile_to_follow.user_id, follower_id=user_id)
        db.session.add_all([new_following_action])
        db.session.commit()
        print(f"User {user_to_follow.profile[0].profile_name} followed successfully!")
    else:
        print("you cannot follow same person twice")
    
    if len(user_to_follow.followed_by) == 0:
        new_following_action = Following(user_id=profile_to_follow.user_id, follower_id=user_id)
        db.session.add_all([new_following_action])
        db.session.commit()
        print(f"User {user_to_follow.profile[0].profile_name} has his/her first follower!!!!")

def unfollow(user_id, profile_to_unfollow):
    user_to_follow = get_by_id(profile_to_unfollow.user_id)
    for following in user_to_follow.followed_by:
        if user_id == following.follower.user_id:
            print(following)
            #following = Following.query.get(id)
            #user = get_by_id(id)
            db.session.delete(following)
            db.session.commit()
            print("unfollow")
            break
        else:
            print('else')
           # new_following_action = Following(user_id=profile_to_follow.user_id, follower_id=user_id)
            #db.session.add_all([new_following_action])
            #db.session.commit()
            #print(f"User {user_to_follow.profile[0].profile_name} followed successfully!")
    
def check_if_followed(user_id, profile_to_check):
    user_to_check = get_by_id(profile_to_check.user_id)
    for follower in user_to_check.followed_by:
        if user_id == follower.follower.user_id:
            return True
    return False

def get_followers(profile):
    user_to_check = get_by_id(profile.user_id)
    return len(user_to_check.followed_by)

def search_profile(profile):
    profiles_found = []
    profiles = util_profile.Profile.query.filter(util_profile.Profile.profile_name.startswith(f'{profile}')).all()
    for prof in profiles:
        profiles_found.append(prof.profile_name)
    return profiles_found