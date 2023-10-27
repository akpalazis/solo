from flask import Blueprint
from flask import jsonify
from flask import request
from flask_login import current_user
from flask_login import login_required

from db.models import Discussion
from db.models import Notification
from db.models import Trip
from db.models import associate_trip_with_discussion
from db.models import db
from helpers.app_helpers import socket_io
from helpers.db_helper import is_user_trip_exists
from user_profile_tools.views import download_flag_to_s3
from user_profile_tools.views import fetch_flag_from_s3
from user_profile_tools.views import is_flag_exists

trips_blueprint = Blueprint('trips_blueprint', __name__)


@login_required
def create_discussion(user_id, destination):
    new_discussion = Discussion(
        user_id=user_id,
        destination=destination
    )
    db.session.add(new_discussion)
    db.session.commit()
    return new_discussion


@trips_blueprint.route('/addtrip', methods=['POST'])
@login_required
def add_trip():
    data = request.json
    destination = data.get("destination")
    start_date = data.get("startDate")
    end_date = data.get("endDate")

    if is_user_trip_exists(current_user, destination):
        return jsonify({'message': 'Trip already exists'}), 409

    new_trip = Trip(
        user_id=current_user.id,
        destination=destination,
        start_date=start_date,
        end_date=end_date
    )
    db.session.add(new_trip)  # Add the new trip to the session
    db.session.commit()  #

    new_discussion = create_discussion(current_user.id, destination)

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
    return get_user_trips(), 201


@trips_blueprint.route('/deletetrip/<int:trip_id>', methods=['DELETE'])
@login_required
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
        return get_user_trips(), 200


@trips_blueprint.route('/trips', methods=['GET'])
@login_required
def get_user_trips():
    user = current_user
    trips = user.trips
    total = []
    for t in trips:
        total.append(
            {
                "id": t.id,
                "user": t.user_id,
                "destination": t.destination,
                "startDate": t.start_date,
                "endDate": t.end_date
            }
        )
    return jsonify(json_list=total)


@trips_blueprint.route("/getFlag/<string:country>", methods=['GET'])
@login_required
def get_country_flag(country):
    if is_flag_exists(country):
        flag = fetch_flag_from_s3(country)
        return {"Url": flag}
    else:
        download_flag_to_s3(country)
        flag = fetch_flag_from_s3(country)
        return {"Url": flag}