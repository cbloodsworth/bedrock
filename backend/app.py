import json
import os
from flask import Flask, jsonify, request, redirect, url_for, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user
from flask_oauthlib.client import OAuth
from sqlalchemy import text 
from dotenv import load_dotenv  
from flask_bcrypt import Bcrypt
from email_validator import validate_email, EmailNotValidError

load_dotenv()

db = SQLAlchemy()
login_manager = LoginManager()

bcrypt = Bcrypt()

# User entry
class Users(UserMixin, db.Model):
    user_id = db.Column(db.Integer, primary_key=True, unique=True)
    username = db.Column(db.String(250), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)
    google_id = db.Column(db.String(250), unique=True)
    github_id = db.Column(db.String(250), unique=True)

def hash_password(password):
    return bcrypt.generate_password_hash(password).decode('utf-8')

def create_app(test_config=None):
    # Create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY=os.getenv('SECRET_KEY'),
        SQLALCHEMY_DATABASE_URI=os.getenv('DATABASE_URL'),
        SQLALCHEMY_TRACK_MODIFICATIONS=False
    )

    if test_config is None:
        # Load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # Load the test config if passed in
        app.config.from_mapping(test_config)

    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Initialize extensions with app
    db.init_app(app)
    login_manager.init_app(app)

    with app.app_context():
        db.create_all()

    return app

app = create_app()
CORS(app, supports_credentials=True)

@app.route('/api/dbConnect')
def dbConnection():
    try:
        query = text("SELECT 1")
        result = db.session.execute(query)
        return "Database connection successful!"
    except Exception as e:
        return f"Database connection error: {str(e)}"


# Google Authentication
oauth = OAuth(app)

@login_manager.user_loader
def loader_user(user_id):
    return Users.query.get(user_id)
 
@app.route('/api/register', methods=["GET", "POST"])
def register():
    if request.method == "POST":
        data = request.json
        userN = data.get('username')
        passW = data.get('password')
        try:
        # Validate the username as an email address
            valid = validate_email(userN)
        except EmailNotValidError as e:
        # If the username is not a valid email address, return an error response
            return jsonify({"error": "email not valid"}), 400
        hashed_password = hash_password(passW)

        user = Users(username = userN,
                     password= hashed_password )
        db.session.add(user)
        db.session.commit()
        redirect_url = os.getenv('REDIRECT_URL', 'http://localhost:5173')
        return redirect(redirect_url)
 
@app.route("/api/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        data = request.json
        userN = data.get('username')
        passW = data.get('password')
        user = Users.query.filter_by(username=userN).first()
        if user:
        # Check if the provided password matches the hashed password in the database
            hashed_password = hash_password(passW)
            if bcrypt.check_password_hash(user.password, hashed_password):
                login_user(user)
                redirect_url = os.getenv('REDIRECT_URL', 'http://localhost:5173')
                return redirect(redirect_url)
    
    # If the user doesn't exist or the password is incorrect, return an appropriate response
    return jsonify({"message": "Invalid username or password"}), 401
 
# @app.route("/api/logout")
# def logout():
#     logout_user()
 
google = oauth.remote_app(
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

@app.route('/api')
def index():
    if 'google_token' in session:
        me = google.get('userinfo')
        return 'Logged in as: ' + me.data['email']
    return 'You are not logged in.'

@app.route('/api/logoutGoogle')
def logout():
    session.pop('google_token', None)
    host = request.host
    redirect_url = host
    return redirect(redirect_url)

@app.route('/api/loginGoogle')
def loginGoogle():
    return google.authorize(callback=url_for('authorized', _external=True))

@app.route('/api/login/google/callback')
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

@app.route('/api/userInfo', methods=['GET'])
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
