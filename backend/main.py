import json
from flask import Flask, jsonify, request
app = Flask(__name__)
@app.route("/backend", methods = ['GET'])
def backend_api():
    employees = [ { 'basic backend' : 'is working'} ]
    if request.method == 'GET':
        response = jsonify(employees)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response



