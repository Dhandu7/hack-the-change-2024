import os
import subprocess

import boto3
from dotenv import load_dotenv
from eventposting import eventpostingroutes
from flask import Flask, g
from flask_cors import CORS
from jobposting import jobpostingroutes
from organizationposting import organizationroutes

# Load environment variables
load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Load AWS configuration from environment variables
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
REGION_NAME = 'us-east-2'


@app.before_request
def before_request():
    # Initialize DynamoDB resource
    g.dynamodb = boto3.resource(
        'dynamodb',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=REGION_NAME
    )


# Register blueprints with URL prefixes
app.register_blueprint(jobpostingroutes)
app.register_blueprint(eventpostingroutes)
app.register_blueprint(organizationroutes)

if __name__ == '__main__':
    # Ensure the environment variables are loaded
    env = os.environ.copy()
    env['AWS_ACCESS_KEY_ID'] = os.getenv('AWS_ACCESS_KEY_ID')
    env['AWS_SECRET_ACCESS_KEY'] = os.getenv('AWS_SECRET_ACCESS_KEY')

    # Absolute path to Python in the virtual environment
    python_path = r"C:\Users\aarya\Desktop\hack-the-change-2024\backend\venv\Scripts\python.exe"
    #subprocess.Popen([python_path, "jobscraper.py"], env=env)
    # Run the subprocess with the absolute Python path
    subprocess.Popen([python_path, "json_monitor2.py"], env=env)

    # Start the Flask app
    app.run(debug=True)
