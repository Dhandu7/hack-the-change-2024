import os

import boto3
from dotenv import load_dotenv
from eventposting import eventpostingroutes
from flask import Flask, g
from flask_cors import CORS
from jobposting import jobpostingroutes
from organizationposting import organizationroutes

load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Load AWS configuration from environment variables
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
REGION_NAME = 'us-east-2'  # os.getenv('REGION_NAME')


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
app.register_blueprint(organizationroutes, url_prefix='/Organizations')


if __name__ == '__main__':
    app.run(debug=True)
