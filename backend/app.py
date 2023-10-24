from flask_cors import CORS
from flask_graphql import GraphQLView

from backend.app_helpers import app
from backend.app_helpers import login_manager
from backend.app_helpers import schema
from backend.app_helpers import socket_io
from backend.auth.views import auth_blueprint
from backend.db.models import User
from backend.db.models import db
from backend.discussions.views import discussions_blueprint
from backend.notifications.views import notifications_blueprint
from backend.trips.views import trips_blueprint
from backend.user_profile_tools.views import user_profile_tools_blueprint

app.config.from_pyfile('config.py')
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
db.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.filter_by(id=user_id).first()


with app.app_context():
    db.create_all()
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(trips_blueprint)
    app.register_blueprint(discussions_blueprint)
    app.register_blueprint(notifications_blueprint)
    app.register_blueprint(user_profile_tools_blueprint)
    app.add_url_rule('/graphql', view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))

if __name__ == '__main__':
    socket_io.run(app, host="0.0.0.0", debug=True)
