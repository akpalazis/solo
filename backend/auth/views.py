from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_login import current_user, login_user, logout_user, login_required
from backend.main import login_manager, s3
from backend.models import User, db
import os
from PIL import Image

b_crypt = Bcrypt()

auth_blueprint = Blueprint('auth_blueprint', __name__)


@auth_blueprint.route('/home', methods=['GET'])
def home():
    if current_user.is_authenticated:
        return jsonify({'message': 'Access granted'}), 200
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
        bucket_name = "users"
        try:
            # Use the head_bucket method to check if the bucket exists
            s3.head_bucket(Bucket=bucket_name)
        except Exception as e:
            s3.create_bucket(Bucket=bucket_name)
        image.save(image.filename)
        img = Image.open(image.filename)
        resized_img = img.resize((200, 200))
        resized_img.save(image.filename)
        image_type = os.path.basename(image.filename).split(".")[-1]
        file_name = f"{username}.{image_type}"
        s3.upload_file(image.filename, bucket_name, f'profile_pictures/{file_name}')
        return jsonify({'message': 'Account Created Successfully'}), 200


@auth_blueprint.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged Out Successfully'}), 200


@auth_blueprint.route('/get-profile-picture/<username>', methods=['GET'])
def get_profile_picture(username):
    user_s3_object_key = f'profile_pictures/{username}.jpg'  # Replace with the actual key
    signed_url = s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': 'users', 'Key': user_s3_object_key},
        ExpiresIn=3000
    )
    return {'url': signed_url}
