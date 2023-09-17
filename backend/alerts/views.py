from flask import Blueprint, jsonify
from flask_login import current_user
from backend.models import User, db, Notification
from backend.main import socket_io
alert_blueprint = Blueprint('alert_blueprint', __name__)


@alert_blueprint.route('/notifications', methods=['GET'])
def notification():
    user = current_user
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


@alert_blueprint.route('/markasread/<int:notification_id>', methods=['PUT'])
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
    return jsonify({'': ""}), 201
