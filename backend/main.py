import base64
import os
from urllib.parse import urlparse

from flask import Flask
from flask_graphql import GraphQLView
from flask_login import current_user

from backend import config
from backend.websocket import Socket
from flask_login import LoginManager
import platform
import boto3
from botocore.exceptions import ClientError
from graphene import ObjectType, String, Field, Schema


def create_bucket(bucket_name):
    try:
        s3.head_bucket(Bucket=bucket_name)
    except ClientError:
        s3.create_bucket(Bucket=bucket_name)


app = Flask(__name__)
socket_io = Socket(app)

login_manager = LoginManager(app)

s3 = boto3.client('s3',
                  endpoint_url=config.MINIO_SERVER,
                  aws_access_key_id='admin',
                  aws_secret_access_key='password')

create_bucket("users")


# Define the ProfilePictureType
class ProfilePictureType(ObjectType):
    base64_image_data = String()


class ImageUrl(ObjectType):
    image_url = String()


# Define the Query type
class Query(ObjectType):
    get_profile = Field(ProfilePictureType)
    get_url = Field(ImageUrl)

    def resolve_get_profile(self, info):
        username = current_user.username
        user_s3_object_key = f'{username}/profile_picture.jpg'
        response = s3.get_object(Bucket="users", Key=user_s3_object_key)
        image_data = response['Body'].read()
        base64_string = base64.b64encode(image_data).decode('utf-8')
        return ProfilePictureType(base64_image_data=base64_string)

    def resolve_get_url(self, info):
        username = current_user.username
        user_s3_object_key = f'{username}/profile_picture.jpg'
        url = s3.generate_presigned_url('get_object',
                                        Params={'Bucket': "users", 'Key': user_s3_object_key},
                                        ExpiresIn=3600)
        parsed_url = urlparse(url)
        send_url = f"{parsed_url.path}?{parsed_url.query}"
        return ImageUrl(image_url=send_url)


# Create a GraphQL schema with the Query type
schema = Schema(query=Query)

app.add_url_rule('/graphql', view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))
