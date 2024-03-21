import os
from flask import jsonify, request, redirect, url_for, session, Blueprint
from email_validator import validate_email, EmailNotValidError
from flask_bcrypt import Bcrypt
from flask_oauthlib.client import OAuth
from flask_login import login_user 
from dotenv import load_dotenv

from sqlalchemy import text

import models
from database import db, login_manager

# our blueprint
api = Blueprint('api', __name__)

load_dotenv()
bcrypt = Bcrypt()

def hash_password(password):
    return bcrypt.generate_password_hash(password).decode('utf-8')

@api.route('/api/register', methods=["GET", "POST"])
def register():
    if request.method == "POST":
        data = request.json
        userN = data.get('username')
        passW = data.get('password')
        if (userN == ""):
            return jsonify({"error": "email not valid"}), 400
        try:
        # Validate the username as an email address
            valid = validate_email(userN)
        except EmailNotValidError as e:
        # If the username is not a valid email address, return an error response
            return jsonify({"error": "email not valid"}), 400
        hashed_password = hash_password(passW)

        user = models.User(username = userN,
                     password= hashed_password )
        db.session.add(user)
        db.session.commit()
        redirect_url = os.getenv('REDIRECT_URL', 'http://localhost:5173')
        return redirect(redirect_url)

@api.route("/api/login", methods=["GET", "POST"])
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
                redirect_url = os.getenv('REDIRECT_URL', 'http://localhost:5173')
                return redirect(redirect_url)
    
    # If the user doesn't exist or the password is incorrect, return an appropriate response
    return jsonify({"message": "Invalid username or password"}), 401

# Google Authentication
google = OAuth(api).remote_app(
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

@api.route('/api')
def index():
    if 'google_token' in session:
        me = google.get('userinfo')
        return 'Logged in as: ' + me.data['email']
    return 'You are not logged in.'

@api.route('/api/logoutGoogle')
def logout():
    session.pop('google_token', None)
    host = request.host
    redirect_url = host
    return redirect(redirect_url)

@api.route('/api/loginGoogle')
def loginGoogle():
    return google.authorize(callback=url_for('api.authorized', _external=True))

@api.route('/api/login/google/callback')
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

@api.route('/api/userInfo', methods=['GET'])
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

@api.route('/api/dbConnect')
def dbConnection():
    try:
        query = text("SELECT 1")
        result = db.session.execute(query)
        return "Database connection successful!"
    except Exception as e:
        return f"Database connection error: {str(e)}"

@login_manager.user_loader
def loader_user(user_id):
    return models.User.query.get(user_id)