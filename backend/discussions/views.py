from flask import Blueprint
from flask import jsonify
from flask_login import current_user
from flask_login import login_required

from backend.db.models import Discussion

discussions_blueprint = Blueprint('discussions_blueprint', __name__)


@discussions_blueprint.route('/userdiscussion', methods=['GET'])
@login_required
def get_user_dic():
    user = current_user
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
