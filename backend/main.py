from flask import Flask
from backend.websocket import Socket
from flask_login import LoginManager
app = Flask(__name__)
socket_io = Socket(app)

login_manager = LoginManager(app)