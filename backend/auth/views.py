from flask import Blueprint, request, jsonify, session
from flask_bcrypt import Bcrypt
from backend.models import User, db  # You may need to adjust this import based on your project structure

auth_blueprint = Blueprint('auth', __name__)

bcrypt = Bcrypt()


@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()

    if user and bcrypt.check_password_hash(user.password, password):
        session['user'] = username
        session['user_id'] = user.id
        return jsonify({'message': 'Login successful', 'userId': session['user']}), 200
    else:
        return jsonify({'message': 'Login failed'}), 401


@auth_blueprint.route('/signup', methods=['POST'])
def signup():
    print("here")
    data = request.json
    username = data.get('username')
    password = data.get('password')

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'message': 'User already exists'}), 409
    else:
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = User(username=username, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'Account Created Successfully'}), 200


@auth_blueprint.route('/logout', methods=['POST'])
def logout():
    if 'user' in session:
        session.clear()
    return jsonify({'message': 'Logged Out Successfully'}), 200