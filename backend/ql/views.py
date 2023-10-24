import base64
from urllib.parse import urlparse
from flask_login import current_user
from graphene import Field
from graphene import ObjectType
from graphene import String
from backend.s3.views import s3


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
