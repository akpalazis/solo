DEBUG = True  # Set to False in production

# Database configuration
#SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:pass@localhost:5432/db'


# Secret key for session management and CSRF protection
SECRET_KEY = 'abc'
SESSION_TYPE = 'filesystem'
