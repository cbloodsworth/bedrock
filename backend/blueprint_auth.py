import os
from flask import jsonify, request, redirect, url_for, session, Blueprint
from flask_bcrypt import Bcrypt
from flask_oauthlib.client import OAuth
from flask_login import login_user 
from dotenv import load_dotenv

from sqlalchemy import text

import models
from utilities import db, login_manager

# our blueprint
auth_api = Blueprint('auth_api', __name__)

load_dotenv()
bcrypt = Bcrypt()

def hash_password(password):
    return bcrypt.generate_password_hash(password).decode('utf-8')

@auth_api.route('/register', methods=["GET", "POST"])
def register():
    if request.method == "POST":
        data = request.json
        userN = data.get('username')
        passW = data.get('password')
        hashed_password = hash_password(passW)
        user = models.User(username = userN,
                     password= hashed_password )
        db.session.add(user)
        db.session.commit()
        return jsonify(success=True), 200

@auth_api.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        data = request.json
        userN = data.get('username')
        passW = data.get('password')
        user = models.User.query.filter_by(username=userN).first()
        if user:
        # Check if the provided password matches the hashed password in the database
            hashed_password = hash_password(passW)
            if bcrypt.check_password_hash(user.password, hashed_password):
                login_user(user)
                return jsonify({"message": "User logged in"}), 200
    
    # If the user doesn't exist or the password is incorrect, return an appropriate response
    return jsonify({"message": "Invalid username or password"}), 401

# Google Authentication
google = OAuth(auth_api).remote_app(
    'google',
    consumer_key=os.getenv('GOOGLE_CLIENT_ID'),
    consumer_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    request_token_params={
        'scope': ['profile', 'email']
    },
    base_url='https://www.googleapis.com/oauth2/v1/',
    request_token_url=None,
    access_token_method='POST',
    access_token_url='https://accounts.google.com/o/oauth2/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
)

# do we need this ?
# @api.route('/auth')
# def index():
#     if 'google_token' in session:
#         me = google.get('userinfo')
#         return 'Logged in as: ' + me.data['email']
#     return 'You are not logged in.'

@auth_api.route('/logoutGoogle')
def logout():
    session.pop('google_token', None)
    return 200

@auth_api.route('/loginGoogle')
def loginGoogle():
    return google.authorize(callback=url_for('auth_api.authorized', _external=True))

@auth_api.route('/login/google/callback')
def authorized():
    resp = google.authorized_response()
    if resp is None or resp.get('access_token') is None:
        return 'Access denied: reason={} error={}'.format(
            request.args['error_reason'],
            request.args['error_description']
        )

    session['google_token'] = (resp['access_token'], '')
    me = google.get('userinfo')
    redirect_url = os.getenv('REDIRECT_URL', 'http://localhost:5173')
    return redirect(redirect_url)

@google.tokengetter
def get_google_oauth_token():
    return session.get('google_token')

@auth_api.route('/userInfo', methods=['GET'])
def get_user_info():
    access_token = session.get('google_token')[0] if 'google_token' in session else None
    if access_token:
        user_info = google.get('userinfo').data
        if user_info:
            return user_info
        else:
            return jsonify({'error': 'Failed to fetch user information'}), 500
    else:
        return jsonify({'error': 'Access token not found'}), 401
    
def get_user_info_using_access_token(access_token):
    user_info_response = google.get('userinfo', token=(access_token, ''))

    if user_info_response.status != 200:
        return {'error': 'Failed to fetch user information'}

    user_info = user_info_response.data
    return user_info

# Github Auth
github = OAuth(auth_api).remote_app(
    'github',
    consumer_key=os.getenv('GITHUB_CLIENT_ID'),
    consumer_secret=os.getenv('GITHUB_CLIENT_SECRET'),
    request_token_params={'scope': 'user:email'},
    base_url='https://api.github.com/',
    request_token_url=None,
    access_token_method='POST',
    access_token_url='https://github.com/login/oauth/access_token',
    authorize_url='https://github.com/login/oauth/authorize',
)

@auth_api.route('/loginGithub')
def login_github():
    # Generate the callback URL for the OAuth flow
    callback_url = url_for('auth_api.github_callback', _external=True)

    # Redirect the user to GitHub's authorization page
    return github.authorize(callback=callback_url)

@auth_api.route('/login/github/callback')
def github_callback():
    # Check if the request contains 'code' parameter
    if 'code' not in request.args:
        return 'Access denied: Missing authorization code', 401

    # Get the authorization code from the request
    code = request.args.get('code')

    # Exchange the authorization code for an access token
    resp = github.authorized_response()
    if resp is None or 'access_token' not in resp:
        return 'Access denied: Error during token exchange', 401

    # Store the access token in the user's session
    session['github_token'] = (resp['access_token'], '')

    # Redirect the user to your application
    redirect_url = os.getenv('REDIRECT_URL', 'http://localhost:5173')
    return redirect(redirect_url)

    
@login_manager.user_loader
def loader_user(user_id):
    return models.User.query.get(user_id)