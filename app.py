from flask_bcrypt import Bcrypt
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, leave_room
from models import db, User, Trip, Discussion, associate_trip_with_discussion, Notification

b_crypt = Bcrypt()

app = Flask(__name__)
app.config.from_pyfile('config.py')
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# Initialize the database
db.init_app(app)

with app.app_context():
    db.create_all()


class Socket(SocketIO):
    def __init__(self, flask_app):
        super().__init__(flask_app, cors_allowed_origins="*", manage_session=False)
        self.on_event('subscribe_alert', self.subscribe_alert)
        self.on_event('unsubscribe_alert', self.unsubscribe_alert)

    def subscribe_alert(self, room_name):
        _ = self
        join_room(room_name)

    def unsubscribe_alert(self, room_name):
        _ = self
        leave_room(room_name)

    def new_alert(self):
        _ = self
        socket_io.emit('new_alert', "new alert", room='alert')


socket_io = Socket(app)


def is_user_trip_exists(username, destination):
    existing_trip = Trip.query.join(Trip.user).filter(
        User.username == username,
        Trip.destination == destination,
    ).first()

    return existing_trip is not None


def is_trip_exists(destination, start_date, end_date):
    existing_trip = Trip.query.filter_by(
        destination=destination,
        start_date=start_date,
        end_date=end_date
    ).first()
    return existing_trip is not None


@app.route('/notifications', methods=['GET'])
def notification():
    user = User.query.filter_by(username=session['user']).first()
    alerts = user.notifications
    total = []
    for alert in alerts:
        total.append({
            "id": alert.id,
            "user_id": alert.user_id,
            "destination": alert.destination,
            "message": alert.message,
            "is_read": alert.is_read
        })
    return jsonify(json_list=total)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "GET":
        if 'user' in session:
            return jsonify({'message': 'Access granted', 'userId': session['user']})
        else:
            return jsonify({'message': 'Access denied'}), 401
    if request.method == "POST":
        data = request.json
        username = data.get('username')
        password = data.get('password')
        user = User.query.filter_by(username=username).first()
        if user and b_crypt.check_password_hash(user.password, password):
            session['user'] = username
            session['user_id'] = user.id
            return jsonify({'message': 'Login successful', 'userId': session['user']}), 200
        else:
            # User does not exist or incorrect credentials, login failed
            return jsonify({'message': 'Login failed'}), 401


@app.route('/singup', methods=['POST'])
def sing_up():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    existing_user = User.query.filter_by(username=username).first()

    if existing_user:
        return jsonify({'message': 'User already exists'}), 409

    else:
        hashed_password = b_crypt.generate_password_hash(password).decode('utf-8')

        user = User(username=username,
                    password=hashed_password)

        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'Account Created Successfully'}), 200


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
    return jsonify(message='User not found'), 404


@app.route('/logout', methods=['POST'])
def logout():
    if 'user' in session:
        session.pop('user')
    return jsonify({'message': 'Logged Out Successfully'}), 200


@app.route('/addtrip', methods=['POST'])
def add_trip():
    data = request.json
    destination = data.get("destination")

    if is_user_trip_exists(session['user'], destination):
        return jsonify({'message': 'Trip already exists'}), 409

    user = User.query.filter_by(username=session['user']).first()  # Retrieve the user by username
    if user:
        new_trip = Trip(
            user_id=user.id,
            destination=destination,
        )
        db.session.add(new_trip)  # Add the new trip to the session
        db.session.commit()  #
        new_discussion = Discussion(
            user_id=user.id,
            destination=destination
        )
        db.session.add(new_discussion)
        db.session.commit()
        associate_trip_with_discussion(new_trip, new_discussion)
        db.session.commit()
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
        return jsonify({'message': 'Trip added successful'}), 200

    return jsonify({'message': 'User not Found'}), 401


@app.route('/usertrips', methods=['GET'])
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
        socket_io.new_alert()
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


@app.route('/markasread/<int:notification_id>', methods=['PUT'])
def update_notification(notification_id):
    # Find the notification in the database
    notification = db.session.get(Notification, notification_id)
    if not notification:
        return jsonify({'error': 'Notification not found'}), 404

    # Update the notification record
    notification.is_read = True

    # Save the changes to the database
    db.session.commit()

    # Optionally, you can return a response to the frontend to indicate the update was successful
    socket_io.new_alert()
    return jsonify({'message': 'Notification updated successfully'})


if __name__ == '__main__':
    socket_io.run(app, debug=False)
