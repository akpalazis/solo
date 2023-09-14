from flask import Flask
from backend.websocket import Socket
app = Flask(__name__)
socket_io = Socket(app)