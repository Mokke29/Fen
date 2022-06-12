from urllib import response
from database import db
from flask import Blueprint, request, jsonify, make_response
from util import user_util as user, profile_util as profile
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from werkzeug.security import safe_str_cmp

auth_route = Blueprint("auth_route", __name__, static_folder="static")

@auth_route.post('/login')
def login():
    data = request.get_json()
    found_user = user.get_by_username(data["username"])
    if found_user and safe_str_cmp(found_user.password, data["password"]): 
        access_token = create_access_token(identity=found_user.user_id,fresh=True)
        refresh_token = create_refresh_token(found_user.user_id)
        response = make_response({'msg': 'Logged in!'})
        response.set_cookie('access_token_cookie', access_token, secure=True, samesite='None')
        response.set_cookie('refresh_token_cookie', refresh_token, secure=True, samesite='None')
        response.headers.add('Access-Control-Allow-Headers', 'x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization')
        return response
    else:
        return jsonify({'error': 'Wrong username or password', "status": "unauthorized"}), 200


@auth_route.get('/protected')
@jwt_required()
def protected():
    user_id = get_jwt_identity()
    usr = user.get_by_id(user_id)
    return jsonify({'msg':'protected route 200', 'user_id': user_id})

@auth_route.post('/token/refresh')
@jwt_required(refresh=True)
def token_refresh():
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=user_id)
    return jsonify({'access_token': access_token}), 200