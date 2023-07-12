from datetime import datetime
from flask_bcrypt import Bcrypt
from flask import Flask, request, jsonify, session

from models import db, User, Trip, Discussion, Comment

bcrypt = Bcrypt()

app = Flask(__name__)
app.config.from_pyfile('config.py')

# Initialize the database
db.init_app(app)

with app.app_context():
    db.create_all()


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


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "GET":
        if 'user' in session:
            return jsonify({'message': 'Access granted'})
        else:
            return jsonify({'message': 'Access denied'}), 401
    if request.method == "POST":
        data = request.json
        username = data.get('username')
        password = data.get('password')
        user = User.query.filter_by(username=username).first()
        if user and bcrypt.check_password_hash(user.password, password):
            session['user'] = username
            return jsonify({'message': 'Login successful'}), 200
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
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

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

    else:
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
        # Check if a discussion already exists for the destination
        discussion = Discussion.query.filter_by(destination=destination).first()
        if discussion:
            # If a discussion exists, associate the trip with the existing discussion
            new_trip = Trip(
                user_id=user.id,
                destination=destination,
                discussion_id=discussion.id
            )
        else:
            # If no discussion exists, create a new discussion and associate the trip with it
            new_discussion = Discussion(destination=destination)
            db.session.add(new_discussion)
            db.session.commit()
            new_trip = Trip(
                user_id=user.id,
                destination=destination,
                discussion_id=new_discussion.id
            )

        db.session.add(new_trip)  # Add the new trip to the session
        db.session.commit()  # Commit the changes to the database

        return jsonify({'message': 'Trip added successful'}), 200

    return jsonify({'message': 'User not Found'}), 401


@app.route('/usertrips', methods=['GET'])
def get_user_dic():
    user = User.query.filter_by(username=session['user']).first()
    if user:
        trips = user.trips  # Retrieve the trips associated with the user
        trip_data = []

        for trip in trips:
            discussion = trip.discussion
            if discussion:
                users = User.query.join(Trip).filter(Trip.discussion_id == discussion.id).all()
                users_count = len(users)
                comments = Comment.query.filter_by(discussion_id=discussion.id).all()
                if users_count > 1:
                    trip_data.append({
                        'id': trip.id,
                        'destination': trip.destination,
                        'comments': [{"id": c.id, "msg": c.message} for c in comments]
                    })
        return jsonify(json_list=trip_data), 200

    return jsonify({'message': 'User not found'}), 404


@app.route('/deletetrip/<int:trip_id>', methods=['DELETE'])
def delete_trip(trip_id):
    trip = Trip.query.get(trip_id)

    if trip:
        db.session.delete(trip)
        db.session.commit()
        return jsonify({'message': 'Trip deleted successfully'}), 200
    else:
        return jsonify({'message': 'Trip not found'}), 404


if __name__ == '__main__':
    app.run()
