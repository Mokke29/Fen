from flask import Blueprint, make_response
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity

refresh_route = Blueprint("refresh_route", __name__, static_folder="static")

@refresh_route.get('/token')
@jwt_required(refresh=True)
def token_refresh():
    user_id = get_jwt_identity()
    response = make_response({'msg': 'Tokens refreshed!'})
    access_token = create_access_token(identity=user_id)
    refresh_token = create_refresh_token(user_id)
    response.set_cookie('access_token_cookie', access_token, secure=True, samesite='None')
    response.set_cookie('refresh_token_cookie', refresh_token, secure=True, samesite='None')
    response.headers.add('Access-Control-Allow-Headers', 'x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization')
    return response