from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    trips = db.relationship('Trip', backref='user', lazy=True)
    discussions = db.relationship('Discussion', backref='user', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)
    authenticated = db.Column(db.Boolean, default=False)

    def is_authenticated(self):
        return self.authenticated

    def is_active(self):
        return True

    def get_id(self):
        return str(self.id)


trip_discussion_association = db.Table(
    'trip_discussion_association',
    db.Column('trip_id', db.Integer, db.ForeignKey('trip.id')),
    db.Column('discussion_id', db.Integer, db.ForeignKey('discussion.id'))
)


class Trip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    associated_discussions = db.relationship('Discussion', secondary=trip_discussion_association, backref='trips', lazy=True)


class Discussion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    destination = db.Column(db.String(100))


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    discussion_id = db.Column(db.Integer, db.ForeignKey('discussion.id'), nullable=False)
    message = db.Column(db.Text)


class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    destination = db.Column(db.String, db.ForeignKey('discussion.destination'), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    is_read = db.Column(db.Boolean, default=False)





def associate_trip_with_discussion(trip, discussion):
    trip.discussion = discussion
    trip.discussion_id = discussion.id
