from flask import jsonify
from flask_cors import CORS
from flask_login import current_user

from backend.models import db, User, Discussion
from backend.main import app, socket_io,login_manager
from backend.auth.views import auth_blueprint
from backend.alerts.views import alert_blueprint
from backend.trips.views import trips_blueprint
from backend.discussions.views import discussions_blueprint
app.config.from_pyfile('config.py')
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
db.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.filter_by(id=user_id).first()


with app.app_context():
    db.create_all()
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(alert_blueprint)
    app.register_blueprint(trips_blueprint)
    app.register_blueprint(discussions_blueprint)


if __name__ == '__main__':
    socket_io.run(app, host="0.0.0.0", debug=True)
