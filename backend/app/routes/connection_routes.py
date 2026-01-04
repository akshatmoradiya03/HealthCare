from flask import Blueprint, request, jsonify
from app.models import Connection, User
from app.extensions import db
from app.schemas.connection_schema import connection_schema, connections_schema
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

connection_bp = Blueprint('connection', __name__)

@connection_bp.route('/request-pro', methods=['POST'])
@jwt_required()
def request_pro():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    if claims.get('role') != 'client':
        return jsonify({'message': 'Only clients can request professionals'}), 403
    
    data = request.get_json()
    professional_id = data.get('professional_id')
    
    if not professional_id:
        return jsonify({'message': 'Professional ID is required'}), 400
    
    # Check if connection already exists
    existing = Connection.query.filter_by(client_id=current_user_id, professional_id=professional_id).first()
    if existing:
        return jsonify({'message': 'Connection request already exists'}), 400
        
    connection = Connection(
        client_id=current_user_id,
        professional_id=professional_id,
        status='pending',
        initiated_by=current_user_id
    )
    
    db.session.add(connection)
    db.session.commit()
    
    return jsonify({
        'message': 'Connection request sent',
        'connection': connection_schema.dump(connection)
    }), 201

@connection_bp.route('/invite-client', methods=['POST'])
@jwt_required()
def invite_client():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    if claims.get('role') != 'professional':
        return jsonify({'message': 'Only professionals can invite clients'}), 403
    
    data = request.get_json()
    client_email = data.get('client_email')
    
    if not client_email:
        return jsonify({'message': 'Client email is required'}), 400
        
    client = User.query.filter_by(email=client_email, role='client').first()
    if not client:
        return jsonify({'message': 'Client not found'}), 404
        
    # Check if connection already exists
    existing = Connection.query.filter_by(client_id=client.id, professional_id=current_user_id).first()
    if existing:
        return jsonify({'message': 'Connection already exists'}), 400
        
    connection = Connection(
        client_id=client.id,
        professional_id=current_user_id,
        status='pending',
        initiated_by=current_user_id
    )
    
    db.session.add(connection)
    db.session.commit()
    
    return jsonify({
        'message': 'Invitation sent',
        'connection': connection_schema.dump(connection)
    }), 201

@connection_bp.route('/respond', methods=['POST'])
@jwt_required()
def respond_connection():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    connection_id = data.get('connection_id')
    action = data.get('action') # accept, reject
    
    if not connection_id or not action:
        return jsonify({'message': 'Missing required fields'}), 400
        
    connection = Connection.query.get(connection_id)
    if not connection:
        return jsonify({'message': 'Connection not found'}), 404
        
    # Verify user is part of connection
    if str(connection.client_id) != str(current_user_id) and str(connection.professional_id) != str(current_user_id):
        return jsonify({'message': 'Unauthorized'}), 403
        
    if action == 'accept':
        connection.status = 'accepted'
    elif action == 'reject':
        connection.status = 'rejected'
    else:
        return jsonify({'message': 'Invalid action'}), 400
        
    db.session.commit()
    
    return jsonify({
        'message': f'Connection {action}ed',
        'connection': connection_schema.dump(connection)
    }), 200

@connection_bp.route('/list', methods=['GET'])
@jwt_required()
def list_connections():
    current_user_id = get_jwt_identity()
    
    # Get all connections where user is either client or pro
    connections = Connection.query.filter(
        (Connection.client_id == current_user_id) | (Connection.professional_id == current_user_id)
    ).all()
    
    return jsonify(connections_schema.dump(connections)), 200


@connection_bp.route('/<int:connection_id>', methods=['DELETE'])
@jwt_required()
def remove_connection(connection_id):
    current_user_id = get_jwt_identity()

    connection = Connection.query.get(connection_id)
    if not connection:
        return jsonify({'message': 'Connection not found'}), 404

    # Only allow the client or professional involved to remove the connection
    if str(connection.client_id) != str(current_user_id) and str(connection.professional_id) != str(current_user_id):
        return jsonify({'message': 'Unauthorized'}), 403

    db.session.delete(connection)
    db.session.commit()

    return jsonify({'message': 'Connection removed'}), 200
