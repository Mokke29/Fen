from database import db
from flask import Blueprint, request, jsonify
from datetime import datetime
from util import post_util, util, profile_util, user_util
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

@post_route.post('/details')
@jwt_required()
def get_post_details():
    user_id = get_jwt_identity()
    data = request.get_json()
    post = post_util.Post.query.filter_by(id=data["id"]).first()
    user = user_util.get_by_id(post.user_id)
    profile = profile_util.Profile.query.filter_by(user_id=user.user_id).first()
    post_obj = {"content": post.content, "image_path": post.image_path, "likes": 875, "comments": 38, "creator": profile.profile_name, "creator_avatar": profile.avatar_path}
    return jsonify(post_obj)

@post_route.post('/comment')
@jwt_required()
def create_new_comment():
    user_id = get_jwt_identity()
    data = request.get_json()

    comment = post_util.create_comment(content=data.get("content"), post_id=data.get("post_id"), user_id=user_id)
    return jsonify('Post commented sucessfully')

@post_route.post('/comment/get')
@jwt_required()
def get_comments_all():
    user_id = get_jwt_identity()
    data = request.get_json()
    comment_arr = []
    comments = post_util.Comment.query.filter_by(post_id=data.get('post_id')).all()
    for c in comments:
        profile = profile_util.Profile.query.filter_by(user_id=c.user_id).first()
        comment_obj = {'content': c.content, 'pub_date': c.pub_date, 'creator': profile.profile_name, "avatar_path": profile.avatar_path}
        comment_arr.append(comment_obj)
    print(comment_arr)
    return jsonify({"comments": comment_arr})

@post_route.post('/delete')
@jwt_required()
def delete_post():
    user_id = get_jwt_identity()
    data = request.get_json()
    post = post_util.Post.query.filter_by(id=data["post_id"]).first()
    user = user_util.get_by_id(post.user_id)
    if user.user_id == post.user_id:
        db.session.delete(post)
        db.session.commit()
        post_obj = {"message": "Post deleted!"}
    else: 
        post_obj = {"message": "Something went wrong!"}
    return jsonify(post_obj)