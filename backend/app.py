import json
import os
from flask import Flask, jsonify, request, redirect, url_for, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv  

from database import db, login_manager  # database declaration
from models import *     # database table models
from routes import api   # used to connect to routes defined in routes.py

load_dotenv()

# Create and configure the app
app = Flask(__name__, instance_relative_config=True)

# Register the blueprints defined in routes.py
app.register_blueprint(api)
app.config.from_mapping(
    SECRET_KEY=os.getenv('SECRET_KEY'),
    SQLALCHEMY_DATABASE_URI=os.getenv('DATABASE_URL'),
    SQLALCHEMY_TRACK_MODIFICATIONS=False
)

# Load the instance config, if it exists, when not testing
app.config.from_pyfile('config.py', silent=True)

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

CORS(app, supports_credentials=True)
 
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
