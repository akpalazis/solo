import io
from urllib.parse import urlparse

from PIL import Image
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
