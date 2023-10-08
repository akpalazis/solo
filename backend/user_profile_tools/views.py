import io

from PIL import Image
from flask import Blueprint
from flask import Response

from backend.main import s3

user_profile_tools_blueprint = Blueprint('user_profile_tools_blueprint', __name__)


@user_profile_tools_blueprint.route('/get-profile-picture/<username>', methods=['GET'])
def get_profile_picture(username):
    user_s3_object_key = f'{username}/profile_picture.jpg'  # Replace with the actual key
    s3_response = s3.get_object(Bucket='users', Key=user_s3_object_key)
    image_data = s3_response['Body'].read()
    # Set the content type based on the image file type (e.g., 'image/jpeg', 'image/png')
    content_type = s3_response['ContentType']
    return Response(image_data, content_type=content_type)


def save_profile_picture(username, image):
    bucket_name = "users"
    if image:
        img = Image.open(image)
    else:
        img = Image.open("/Users/Palazis/PycharmProjects/solo/imgs/blank_profile_picture.png")
    resized_img = img.resize((200, 200))
    img_buffer = io.BytesIO()
    resized_img.save(img_buffer, format=img.format)
    img_buffer.seek(0)
    s3.upload_fileobj(img_buffer, bucket_name, f'{username}/profile_picture.jpg')

