import platform
DEBUG = True  # Set to False in production

# Database configuration
SQLALCHEMY_TRACK_MODIFICATIONS = False

if platform.system() == "Darwin":
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:pass@localhost:5433/db'
else:
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:pass@db:5432/db'


# Secret key for session management and CSRF protection
SECRET_KEY = 'abc'
SESSION_TYPE = 'filesystem'
