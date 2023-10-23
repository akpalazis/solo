from dotenv import load_dotenv
import os


load_dotenv()

DEBUG = bool(os.getenv("DEBUG"))
SQLALCHEMY_TRACK_MODIFICATIONS = bool(os.getenv("SQLALCHEMY_TRACK_MODIFICATIONS"))
SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
SECRET_KEY = os.getenv("SECRET_KEY")
SESSION_TYPE = os.getenv("SESSION_TYPE")
MINIO_SERVER = os.getenv("MINIO")
print(MINIO_SERVER)