import boto3
from botocore.exceptions import ClientError

from helpers import config


def create_bucket(bucket_name):
    try:
        s3.head_bucket(Bucket=bucket_name)
    except ClientError:
        s3.create_bucket(Bucket=bucket_name)


s3 = boto3.client('s3',
                  endpoint_url=config.MINIO_SERVER,
                  aws_access_key_id='admin',
                  aws_secret_access_key='password')

create_bucket("users")
create_bucket("flags")
