import io

from PIL import Image
from flask import Blueprint
from flask import Response
from flask import request
from flask_login import current_user
from flask_login import login_required

from backend.main import s3

user_profile_tools_blueprint = Blueprint('user_profile_tools_blueprint', __name__)


@user_profile_tools_blueprint.route('/get-profile/', methods=['GET'])
@login_required
def get_profile():
    username = current_user.username
    user_s3_object_key = f'{username}/profile_picture.jpg'  # Replace with the actual key
    s3_response = s3.get_object(Bucket='users', Key=user_s3_object_key)
    image_data = s3_response['Body'].read()
    content_type = s3_response['ContentType']
    return Response(image_data, content_type=content_type)


@user_profile_tools_blueprint.route('/change-profile-picture', methods=['POST'])
@login_required
def change_profile_picture():
    image = request.files.get("picture")
    save_profile_picture(current_user.username, image)
    return get_profile(current_user.username), 200


@login_required
def save_profile_picture(username, image):
    bucket_name = "users"
    img = Image.open(image)
    save_to_s3(img, bucket_name, username)


def save_init_profile_picture(username):
    bucket_name = "users"
    img = Image.open("/Users/Palazis/PycharmProjects/solo/imgs/blank_profile_picture.png")
    save_to_s3(img, bucket_name, username)


def save_to_s3(img, bucket_name, username):
    resized_img = img.resize((200, 200))
    img_buffer = io.BytesIO()
    resized_img.save(img_buffer, format=img.format)
    img_buffer.seek(0)
    s3.upload_fileobj(img_buffer, bucket_name, f'{username}/profile_picture.jpg')
