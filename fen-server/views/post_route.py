from database import db
from flask import Blueprint, request, jsonify
from datetime import datetime
from util import post_util, util, profile_util
import os
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity

post_route = Blueprint("post_route", __name__, static_folder="static")

images_dir = os.path.join(os.getcwd(), 'static/posts')

@post_route.post('/create')
@jwt_required()
def create_post():
    print('Create post route!')
    user_id = get_jwt_identity()
    print(images_dir)
    data = request.form
    image = request.files['image']
    new_image = util.id_generator()
    image.filename = new_image + "." + image.filename.split('.')[1]
    if util.file_exists(os.path.join(images_dir, image.filename)):
        new_image = util.id_generator()
        image.filename = new_image + "." + image.filename.split('.')[1]
    else: 
        pass

    image.save(os.path.join(images_dir, image.filename))

    post = post_util.Post(content=data['content'],image_path=image.filename, user_id=user_id)
    db.session.add(post)
    db.session.commit()
    return jsonify('Post added sucessfully')

@post_route.post('/get')
@jwt_required()
def get_posts():
    user_id = get_jwt_identity()
    data = request.get_json()
    post_arr = []
    profile = profile_util.Profile.query.filter_by(profile_name=data['profile']).first()
    posts = post_util.Post.query.filter_by(user_id=profile.user_id).all()
    for p in posts:
        post_obj = {"id": p.id,"image_path": p.image_path, "likes": 875, "comments": 38, "creator": profile.profile_name}
        post_arr.append(post_obj)
    print(post_arr)
    return jsonify({"posts": post_arr})