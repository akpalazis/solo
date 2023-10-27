import io
import json
from urllib.parse import urlparse

import requests
from PIL import Image
from cairosvg import svg2png
from flask import Blueprint
from flask import request
from flask_login import current_user
from flask_login import login_required

from s3.views import s3

user_profile_tools_blueprint = Blueprint('user_profile_tools_blueprint', __name__)


@user_profile_tools_blueprint.route('/get-profile/', methods=['GET'])
@login_required
def get_profile():
    username = current_user.username
    user_s3_object_key = f'{username}/profile_picture.jpg'
    url = s3.generate_presigned_url('get_object',
                                    Params={'Bucket': "users", 'Key': user_s3_object_key},
                                    ExpiresIn=3600)
    parsed_url = urlparse(url)
    send_url = f"{parsed_url.path}?{parsed_url.query}"
    return send_url


@user_profile_tools_blueprint.route('/change-profile-picture', methods=['POST'])
@login_required
def change_profile_picture():
    image = request.files.get("picture")
    save_profile_picture(current_user.username, image)
    return {"url":get_profile()}, 200


@login_required
def save_profile_picture(username, image):
    bucket_name = "users"
    img = Image.open(image)
    save_to_s3(img, bucket_name, username)


def save_init_profile_picture(username):
    user_s3_object_key = f'{username}/profile_picture.jpg'
    bucket_name = "users"
    s3.copy_object(
        CopySource={'Bucket': bucket_name, 'Key': "blank_profile_picture.png"},
        Bucket=bucket_name,
        Key=user_s3_object_key
    )


def save_to_s3(img, bucket_name, username):
    resized_img = img.resize((200, 200))
    img_buffer = io.BytesIO()
    resized_img.save(img_buffer, format=img.format)
    img_buffer.seek(0)
    s3.upload_fileobj(img_buffer, bucket_name, f'{username}/profile_picture.jpg')


@login_required
def is_flag_exists(country):
    object_key = f"{country}.png"
    try:
        # Send a HEAD request to check if the object exists
        s3.head_object(Bucket="flags", Key=object_key)
        return True
    except Exception:
        return False


@login_required
def fetch_flag_from_s3(country):
    country = f"{country}.png"
    url = s3.generate_presigned_url('get_object',
                                    Params={'Bucket': "flags", 'Key': country},
                                    ExpiresIn=3600)
    parsed_url = urlparse(url)
    send_url = f"{parsed_url.path}?{parsed_url.query}"
    return send_url


@login_required
def download_flag_to_s3(country):
    url = "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/by-code.json"
    response = requests.get(url)
    data = json.loads(response.text)
    flag_url = data.get("CY").get("image")
    for c in data.values():
        if c.get("name") == country.capitalize():
            flag_url = c.get("image")
    flag_response = requests.get(flag_url)
    if flag_response.status_code == 200:
        img_buffer = io.BytesIO()
        svg2png(bytestring=flag_response.content, write_to=img_buffer)
        bucket_name = 'flags'
        img_buffer.seek(0)
        s3_key = f'{country.capitalize()}.png'  # Specify the S3 key where you want to store the image
        s3.upload_fileobj(img_buffer, bucket_name, s3_key)

