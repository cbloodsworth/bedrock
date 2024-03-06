import json
import os
from flask import Flask, jsonify, request, redirect, url_for, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_oauthlib.client import OAuth
from sqlalchemy import text 
from dotenv import load_dotenv  

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.secret_key = os.getenv('SECRET_KEY')

# Database 
database_uri = os.getenv('DATABASE_URL')

app.config['SQLALCHEMY_DATABASE_URI'] = database_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

@app.route('/dbConnect')
def dbConnection():
    try:
        query = text("SELECT 1")
        result = db.session.execute(query)
        return "Database connection successful!"
    except Exception as e:
        return f"Database connection error: {str(e)}"


# Authentication

oauth = OAuth(app)

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

@app.route('/')
def index():
    if 'google_token' in session:
        me = google.get('userinfo')
        return 'Logged in as: ' + me.data['email']
    return 'You are not logged in.'

@app.route('/logoutGoogle')
def logout():
    session.pop('google_token', None)
    host = request.host
    redirect_url = f'http://localhost:5173/'
    return redirect(redirect_url)

@app.route('/loginGoogle')
def login():
    return google.authorize(callback=url_for('authorized', _external=True))

@app.route('/login/google/callback')
def authorized():
    resp = google.authorized_response()
    if resp is None or resp.get('access_token') is None:
        return 'Access denied: reason={} error={}'.format(
            request.args['error_reason'],
            request.args['error_description']
        )

    session['google_token'] = (resp['access_token'], '')
    me = google.get('userinfo')
    redirect_url = f'http://localhost:5173/'
    return redirect(redirect_url)

@google.tokengetter
def get_google_oauth_token():
    return session.get('google_token')

@app.route('/userInfo', methods=['GET'])
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
