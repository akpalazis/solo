from graphene import Field
from graphene import ObjectType
from graphene import String

# Define the ProfilePictureType
from user_profile_tools.views import get_profile


class ProfilePictureType(ObjectType):
    base64_image_data = String()


class ImageUrl(ObjectType):
    image_url = String()


# Define the Query type
class Query(ObjectType):
    get_url = Field(ImageUrl)

    def resolve_get_url(self, info):
        send_url = get_profile()
        return ImageUrl(image_url=send_url)
