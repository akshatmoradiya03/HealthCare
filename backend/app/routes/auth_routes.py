from flask import Blueprint, request, jsonify
from app.models import User
from app.extensions import db, jwt
from app.schemas.user_schema import user_schema
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('role'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists'}), 400
    
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        name=data.get('name', ''),
        email=data['email'],
        password_hash=hashed_password,
        role=data['role']
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # Create token immediately or ask to login? Requirements say "On login/signup, receive and store the JWT token"
    access_token = create_access_token(identity=str(new_user.id), additional_claims={'role': new_user.role})
    
    return jsonify({
        'message': 'User created successfully',
        'user': user_schema.dump(new_user),
        'token': access_token
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=str(user.id), additional_claims={'role': user.role})
    
    return jsonify({
        'message': 'Login successful',
        'user': user_schema.dump(user),
        'token': access_token
    }), 200
