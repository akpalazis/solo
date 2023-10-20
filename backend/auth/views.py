from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_login import current_user, login_user, logout_user, login_required
from backend.models import User, db
from backend.user_profile_tools.views import save_profile_picture

b_crypt = Bcrypt()

auth_blueprint = Blueprint('auth_blueprint', __name__)


@auth_blueprint.route('/home', methods=['GET'])
def home():
    if current_user.is_authenticated:
        return jsonify({'message': 'Access granted',
                        'username': current_user.username}), 200
    else:
        return jsonify({'message': 'Access denied'}), 401


@auth_blueprint.route('/login', methods=['POST'])
def login():
    if request.method == "POST":
        data = request.json
        username = data.get('username')
        password = data.get('password')
        user = User.query.filter_by(username=username).first()
        if user and b_crypt.check_password_hash(user.password, password):
            user.authenticated = True
            db.session.add(user)
            db.session.commit()
            login_user(user, remember=True)
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'message': 'Login failed'}), 401


def check_username_availability(username):
    user = User.query.filter_by(username=username).first()
    return user is None


@auth_blueprint.route('/check-username', methods=['POST'])
def api_check_username_availability():
    username = request.args.get('username')
    if username is None:
        return jsonify({"error": "Username parameter is missing"}), 400

    is_available = check_username_availability(username)

    return jsonify({"isAvailable": is_available})


@auth_blueprint.route('/signup', methods=['POST'])
def sing_up():
    data = request.form
    username = data.get('username')
    password = data.get('password')
    image = request.files.get("picture")
    existing_user = User.query.filter_by(username=username).first()

    if existing_user:
        return jsonify({'message': 'User already exists'}), 409

    else:
        hashed_password = b_crypt.generate_password_hash(password).decode('utf-8')

        user = User(username=username,
                    password=hashed_password)

        db.session.add(user)
        db.session.commit()
        save_profile_picture(username, image)

        return jsonify({'message': 'Account Created Successfully'}), 200


@auth_blueprint.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged Out Successfully'}), 200
