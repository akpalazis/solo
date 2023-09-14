from flask_bcrypt import Bcrypt
from flask import Flask, request, jsonify, session
from flask_cors import CORS

from backend.helpers.db_helper import is_user_trip_exists
from backend.models import db, User, Trip, Discussion, associate_trip_with_discussion, Notification
from backend.websocket import Socket
from auth.views import auth_blueprint

b_crypt = Bcrypt()

app = Flask(__name__)
app.config.from_pyfile('config.py')
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# Initialize the database
db.init_app(app)

with app.app_context():
    db.create_all()
    app.register_blueprint(auth_blueprint)

socket_io = Socket(app)


def create_trip(user_id, destination):
    new_trip = Trip(
        user_id=user_id,
        destination=destination,
    )
    db.session.add(new_trip)  # Add the new trip to the session
    db.session.commit()  #
    return new_trip


def create_discussion(user_id, destination):
    new_discussion = Discussion(
        user_id=user_id,
        destination=destination
    )
    db.session.add(new_discussion)
    db.session.commit()
    return new_discussion


@app.route('/trips', methods=['GET'])
def get_user_trips():
    if 'user' in session:
        user = User.query.filter_by(username=session['user']).first()
        if user:
            trips = user.trips
            total = []
            for t in trips:
                total.append(
                    {
                        "id": t.id,
                        "user": t.user_id,
                        "destination": t.destination,
                    }
                )
            return jsonify(json_list=total)
    return jsonify(message='User not found'), 404


@app.route('/addtrip', methods=['POST'])
def add_trip():
    data = request.json
    destination = data.get("destination")

    user = User.query.filter_by(username=session['user']).first()  # Retrieve the user by username

    if not user:
        return jsonify({'message': 'User not Found'}), 401

    if is_user_trip_exists(user, destination):
        return jsonify({'message': 'Trip already exists'}), 409

    new_trip = create_trip(user.id, destination)

    new_discussion = create_discussion(user.id,destination)

    associate_trip_with_discussion(new_trip, new_discussion)
    db.session.commit()

    # Create notification if more than 1 same destination exists
    discussions = Discussion.query.filter_by(destination=destination).all()
    if len(discussions) >= 2:
        for discussion in discussions:
            notification = Notification.query.filter_by(user_id=discussion.user_id,
                                                        destination=discussion.destination).first()
            if not notification:
                new_notification = Notification(
                    user_id=discussion.user_id,
                    destination=discussion.destination,
                    message="New discussion",
                    is_read=False
                )
                db.session.add(new_notification)
                db.session.commit()
        socket_io.new_alert()
    return jsonify({'': ""}), 201


@app.route('/userdiscussion', methods=['GET'])
def get_user_dic():
    user = User.query.filter_by(username=session['user']).first()
    if user:
        discussions = user.discussions  # Retrieve the trips associated with the user
        discussion_data = []

        for discussion in discussions:
            n_users = Discussion.query.filter_by(destination=discussion.destination).all()
            if len(n_users) > 1:
                discussion_data.append({
                    'id': discussion.id,
                    'destination': discussion.destination,
                })
        return jsonify(json_list=discussion_data), 200

    return jsonify({'message': 'User not found'}), 404


@app.route('/deletetrip/<int:trip_id>', methods=['DELETE'])
def delete_trip(trip_id):
    trip = db.session.get(Trip, trip_id)

    discussion = Discussion.query.filter_by(user_id=trip.user_id, destination=trip.destination).first()
    if trip:
        db.session.delete(trip)
        db.session.delete(discussion)
        alerts = Notification.query.filter_by(destination=trip.destination).all()
        if len(alerts) <= 2:
            for alert in alerts:
                db.session.delete(alert)
        else:
            alert = Notification.query.filter_by(user_id=trip.user_id).first()
            db.session.delete(alert)
        db.session.commit()
        socket_io.new_alert()
        return jsonify({'message': 'Trip deleted successfully'}), 200
    else:
        return jsonify({'message': 'Trip not found'}), 404


if __name__ == '__main__':
    socket_io.run(app, debug=True)
