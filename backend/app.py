from flask import jsonify
from flask_cors import CORS
from flask_login import current_user

from backend.models import db, User, Discussion
from backend.main import app, socket_io,login_manager
from backend.auth.views import auth_blueprint
from backend.alerts.views import alert_blueprint
from backend.trips.views import trips_blueprint

app.config.from_pyfile('config.py')
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# Initialize the database
db.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


with app.app_context():
    db.create_all()
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(alert_blueprint)
    app.register_blueprint(trips_blueprint)


@app.route('/userdiscussion', methods=['GET'])
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


if __name__ == '__main__':
    socket_io.run(app, debug=True)
