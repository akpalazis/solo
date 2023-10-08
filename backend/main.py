from flask import Flask
from backend.websocket import Socket
from flask_login import LoginManager
import platform
import boto3
from botocore.exceptions import ClientError


def create_bucket(bucket_name):
    try:
        s3.head_bucket(Bucket=bucket_name)
    except ClientError:
        s3.create_bucket(Bucket=bucket_name)


app = Flask(__name__)
socket_io = Socket(app)

login_manager = LoginManager(app)

if platform.system() == "Darwin":
    port = "9001"
    end_point = f'http://localhost:{port}'
else:
    port = "9000"
    end_point = f'http://minio:{port}'

s3 = boto3.client('s3',
                  endpoint_url=end_point,
                  aws_access_key_id='admin',
                  aws_secret_access_key='password')

create_bucket("users")

