from flask import Blueprint, request, jsonify, make_response
from util import user_util as user
from flask_jwt_extended import create_access_token, create_refresh_token
from werkzeug.security import safe_str_cmp

auth_route = Blueprint("auth_route", __name__, static_folder="static")

@auth_route.post('/login')
def login():
    data = request.get_json()
    found_user = user.get_by_username(data.get("username"))
    if found_user and safe_str_cmp(found_user.password, data.get("password")): 
        access_token = create_access_token(identity=found_user.user_id,fresh=True)
        refresh_token = create_refresh_token(found_user.user_id)
        response = make_response({'msg': 'Logged in!'})
        response.set_cookie('access_token_cookie', access_token, secure=True, samesite='None')
        response.set_cookie('refresh_token_cookie', refresh_token, secure=True, samesite='None')
        response.headers.add('Access-Control-Allow-Headers', 'x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization')
        return response
    else:
        return jsonify({'error': 'Wrong username or password', "status": "unauthorized"}), 200