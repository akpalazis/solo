from flask import Blueprint
from flask import jsonify
from flask_login import current_user
from flask_login import login_required

from db.models import Notification
from db.models import db
from helpers.app_helpers import socket_io

notifications_blueprint = Blueprint('auth', __name__)


@notifications_blueprint.route('/notifications', methods=['GET'])
@login_required
def notification():
    total = []
    for alert in current_user.notifications:
        total.append({
            "id": alert.id,
            "user_id": alert.user_id,
            "destination": alert.destination,
            "message": alert.message,
            "is_read": alert.is_read
        })
    return jsonify(json_list=total)


@notifications_blueprint.route('/markasread/<int:notification_id>', methods=['PUT'])
@login_required
def update_notification(notification_id):
    notification = db.session.get(Notification, notification_id)
    if not notification:
        return jsonify({'error': 'Notification not found'}), 404

    # Update the notification record
    notification.is_read = True

    # Save the changes to the database
    db.session.commit()
    # Optionally, you can return a response to the frontend to indicate the update was successful
    socket_io.new_alert()
    return jsonify({'': ""}), 201
