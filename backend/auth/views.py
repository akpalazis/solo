from flask import Blueprint, request, session, jsonify
from flask_bcrypt import Bcrypt

from backend.models import User, db

b_crypt = Bcrypt()

auth_blueprint = Blueprint('auth_blueprint', __name__)


@auth_blueprint.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "GET":
        if 'user' in session:
            return jsonify({'message': 'Access granted', 'userId': session['user']}), 200
        else:
            return jsonify({'message': 'Access denied'}), 401
    if request.method == "POST":
        data = request.json
        username = data.get('username')
        password = data.get('password')
        user = User.query.filter_by(username=username).first()
        if user and b_crypt.check_password_hash(user.password, password):
            session['user'] = username
            session['user_id'] = user.id
            return jsonify({'message': 'Login successful', 'userId': session['user']}), 200
        else:
            # User does not exist or incorrect credentials, login failed
            return jsonify({'message': 'Login failed'}), 401


@auth_blueprint.route('/signup', methods=['POST'])
def sing_up():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    existing_user = User.query.filter_by(username=username).first()

    if existing_user:
        return jsonify({'message': 'User already exists'}), 409

    else:
        hashed_password = b_crypt.generate_password_hash(password).decode('utf-8')

        user = User(username=username,
                    password=hashed_password)

        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'Account Created Successfully'}), 200


@auth_blueprint.route('/logout', methods=['POST'])
def logout():
    if 'user' in session:
        session.clear()
    return jsonify({'message': 'Logged Out Successfully'}), 200
