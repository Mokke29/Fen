from urllib import response
from database import db
from flask import Blueprint, request, jsonify, make_response
from util import user_util as user, profile_util
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
import os

user_route = Blueprint("user_route", __name__, static_folder="static")

@user_route.post('/search/profile')
@jwt_required()
def search_profile():
    data = request.get_json()
    print(data['profile'])
    profiles = user.search_profile(data['profile'])
    return jsonify({"profiles": profiles})

#User profile create
@user_route.post('/create')
def create_user():
    data = request.get_json()
    new_user = user.create(data['username'],data['password'])
    if new_user:
        usr = user.get_by_username(new_user)
        access_token = create_access_token(identity=usr.user_id,fresh=True)
        refresh_token = create_refresh_token(usr.user_id)
        response = make_response({"error": False, 'msg':f'New user created #{new_user}'})
        response.set_cookie('access_token_cookie', access_token, secure=True, samesite='None')
        response.set_cookie('refresh_token_cookie', refresh_token, secure=True, samesite='None')
        response.headers.add('Access-Control-Allow-Headers', 'x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization')
        return response
    else:
        return jsonify(error=True, msg='User already exists')

@user_route.post('/edit/profile')
@jwt_required()
def edit_user_profile():
    user_id = get_jwt_identity()
    data = request.form
    try:
        if request.files['file'].filename:
            image = request.files['file']
            edit_result = user.edit_profile(data=data,image=image, id=user_id)
        else:
            print("file not found")
            edit_result = user.edit_profile(data=data, id=user_id)
    except Exception as e:
        print("Exception! file not found")
        edit_result = user.edit_profile(data=data, id=user_id)
    if edit_result["err"] == False:
        return jsonify("Sucess")   
    else:
        return jsonify("Something went wrong")
    
    

#User profile delete
@user_route.delete('/delete')
@jwt_required()
def delete_profile():
    user_id = get_jwt_identity()
    if user.delete(user_id):
        return jsonify('User deleted successfully')
    else:
        return jsonify('Something went wrong, please try again later...')

#User profile info GET
@user_route.get('/account')
@jwt_required()
def get_info():
    user_id = get_jwt_identity()
    if user_id:
        profile = profile_util.Profile.query.filter_by(user_id=user_id).first()
        return jsonify({"description": profile.description, "avatar_path": profile.avatar_path, "profile_name": profile.profile_name})
    else:
        return jsonify('Something went wrong, please try again later...')
    
@user_route.post('/profile')
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    print(f"Logged user id:{user_id}")
    data = request.get_json()
    print(f"Viewed profile #{data['profile']}")
    profile = profile_util.Profile.query.filter_by(profile_name=data['profile']).first()
    followed = user.check_if_followed(user_id=user_id,profile_to_check=profile)
    followers = user.get_followers(profile=profile)
    if profile:
        return jsonify({"description": profile.description, "avatar_path": profile.avatar_path, "profile_name": profile.profile_name, "followed": followed, "followers": followers})
    else:
        return jsonify('Something went wrong, please try again later...')

@user_route.post('/follow')
@jwt_required()
def follow():
    user_id = get_jwt_identity()
    data = request.get_json()
    profile = profile_util.Profile.query.filter_by(profile_name=data['profile']).first()
    if profile: 
        user.follow(user_id=user_id, profile_to_follow=profile)
        return jsonify({"msg": f"You followed user #{profile.profile_name}"})
    else:
        return jsonify('Something went wrong, please try again later...')

@user_route.post('/unfollow')
@jwt_required()
def unfollow():
    user_id = get_jwt_identity()
    data = request.get_json()
    profile = profile_util.Profile.query.filter_by(profile_name=data['profile']).first()
    if profile: 
        user.unfollow(user_id=user_id, profile_to_unfollow=profile)
        return jsonify({"msg": f"You unfollowed user #{profile.profile_name}"})
    else:
        return jsonify('Something went wrong, please try again later...')

@user_route.get('/get')
@jwt_required()
def get_acc_name():
    user_id = get_jwt_identity()
    account = user.get_by_id(user_id)
    if account: 
        return jsonify({"account_name": account.profile[0].profile_name, "avatar_path": account.profile[0].avatar_path})
    else:
        return jsonify('Something went wrong, please try again later...')