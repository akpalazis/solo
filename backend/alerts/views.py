from flask import Blueprint
from flask import jsonify
from flask_login import current_user

from backend.db.models import Notification
from backend.db.models import db
from backend.app_helpers import socket_io

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