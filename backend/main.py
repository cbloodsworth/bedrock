import json
import os
from flask import Flask, jsonify, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from flask_oauthlib.client import OAuth
from sqlalchemy import text 
from dotenv import load_dotenv  

load_dotenv()

app = Flask(__name__)

# Database 
database_uri = os.getenv('DATABASE_URL')

app.config['SQLALCHEMY_DATABASE_URI'] = database_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

@app.route('/dbConnect')
def dbConnection():
    try:
        # Use SQLAlchemy's text function to explicitly declare the SQL expression
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
        'scope': 'email',
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

@app.route('/login')
def login():
    return google.authorize(callback=url_for('authorized', _external=True))

@app.route('/logout')
def logout():
    session.pop('google_token', None)
    return 'Logged out successfully!'

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
    return 'Logged in as: ' + me.data['email']

@google.tokengetter
def get_google_oauth_token():
    return session.get('google_token')

# @app.route("/backend", methods = ['GET'])
# def backend_api():
#     employees = [ { 'basic backend' : 'is working'} ]
#     if request.method == 'GET':
#         response = jsonify(employees)
#         response.headers.add('Access-Control-Allow-Origin', '*')
#         return response


if __name__ == '__main__':
    app.run(debug=True)
