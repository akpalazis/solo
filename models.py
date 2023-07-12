from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    trips = db.relationship('Trip', backref='user', lazy=True)


class Trip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    discussion_id = db.Column(db.Integer, db.ForeignKey('discussion.id'), nullable=True)


class Discussion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    destination = db.Column(db.String(100))
    trips = db.relationship('Trip', backref='discussion', lazy=True)


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    discussion_id = db.Column(db.Integer, db.ForeignKey('discussion.id'), nullable=False)
    message = db.Column(db.Text)
