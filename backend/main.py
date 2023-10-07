from flask import Flask
from backend.websocket import Socket
from flask_login import LoginManager
import boto3
app = Flask(__name__)
socket_io = Socket(app)

login_manager = LoginManager(app)

s3 = boto3.client('s3',
                  endpoint_url='http://localhost:9000',
                  aws_access_key_id='admin',
                  aws_secret_access_key='password')

