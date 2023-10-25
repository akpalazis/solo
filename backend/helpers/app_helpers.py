from flask import Flask
from flask_login import LoginManager
from graphene import Schema

from ql.views import Query
from websocket import Socket

app = Flask(__name__)

socket_io = Socket(app)

login_manager = LoginManager(app)

schema = Schema(query=Query)

