#set FLASK_ENV=development
from flask import Flask, jsonify
from flask_cors import CORS
import os
import json
from flask_jwt_extended import JWTManager
from datetime import timedelta
from database import db
from views import user_route, auth_route, post_route, refresh_route

app = Flask(__name__)
#CONFIG file
app.config.from_file("config.json", load=json.load)

app.config["CORS_SUPPORTS_CREDENTIALS"] = True
app.config["JWT_COOKIE_CSRF_PROTECT"] = False
app.config["CORS_ORIGINS"] = "http://localhost:3000"

CORS(app)

app.register_blueprint(user_route.user_route, url_prefix="/user")
app.register_blueprint(auth_route.auth_route, url_prefix="/auth")
app.register_blueprint(post_route.post_route, url_prefix="/post")
app.register_blueprint(refresh_route.refresh_route, url_prefix="/refresh")

db.init_app(app)

jwt = JWTManager(app)

#JWT Time Config
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(seconds=3600) #1 h
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=15) #15 days


#TEST
@app.get('/param/<string:profile>')
def test(profile):
    return jsonify(dict)

@app.get('/db')
def get_db():
    db.create_all()
    return jsonify("DB -> create_all")

if __name__ == '__main__':
    app.run(debug=True)
