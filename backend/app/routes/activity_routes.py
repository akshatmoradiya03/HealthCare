from flask import Blueprint, request, jsonify
from app.models import GroupActivity, ActivityInvite, User
from app.extensions import db
from app.schemas.activity_schema import activity_schema, activities_schema, invite_schema, invites_schema
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

activity_bp = Blueprint('activity', __name__)

@activity_bp.route('/', methods=['POST'])
@jwt_required()
def create_activity():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    if claims.get('role') != 'professional':
        return jsonify({'message': 'Only professionals can create activities'}), 403
        
    data = request.get_json()
    if not data.get('title'):
        return jsonify({'message': 'Title is required'}), 400
        
    activity = GroupActivity(
        title=data['title'],
        description=data.get('description', ''),
        created_by=current_user_id
    )
    
    db.session.add(activity)
    db.session.commit()
    
    return jsonify({
        'message': 'Activity created',
        'activity': activity_schema.dump(activity)
    }), 201

@activity_bp.route('/invite', methods=['POST'])
@jwt_required()
def invite_to_activity():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    if claims.get('role') != 'professional':
        return jsonify({'message': 'Only professionals can invite to activities'}), 403
        
    data = request.get_json()
    activity_id = data.get('activity_id')
    client_id = data.get('client_id')
    
    if not activity_id or not client_id:
        return jsonify({'message': 'Activity ID and Client ID are required'}), 400
        
    activity = GroupActivity.query.get(activity_id)
    if not activity or str(activity.created_by) != str(current_user_id):
        return jsonify({'message': 'Activity not found or unauthorized'}), 404
        
    # Check if invite exists
    existing = ActivityInvite.query.filter_by(activity_id=activity_id, client_id=client_id).first()
    if existing:
        return jsonify({'message': 'Invite already exists'}), 400
        
    invite = ActivityInvite(
        activity_id=activity_id,
        client_id=client_id,
        status='pending'
    )
    
    db.session.add(invite)
    db.session.commit()
    
    return jsonify({
        'message': 'Client invited to activity',
        'invite': invite_schema.dump(invite)
    }), 201

@activity_bp.route('/respond', methods=['POST'])
@jwt_required()
def respond_invite():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    invite_id = data.get('invite_id')
    action = data.get('action') # accept, decline
    
    if not invite_id or not action:
        return jsonify({'message': 'Missing required fields'}), 400
        
    invite = ActivityInvite.query.get(invite_id)
    if not invite:
        return jsonify({'message': 'Invite not found'}), 404
        
    if str(invite.client_id) != str(current_user_id):
        return jsonify({'message': 'Unauthorized'}), 403
        
    if action == 'accept':
        invite.status = 'accepted'
    elif action == 'decline':
        invite.status = 'declined'
    else:
        return jsonify({'message': 'Invalid action'}), 400
        
    db.session.commit()
    
    return jsonify({
        'message': f'Invite {action}ed',
        'invite': invite_schema.dump(invite)
    }), 200

@activity_bp.route('/list', methods=['GET'])
@jwt_required()
def list_activities():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get('role')
    
    if role == 'professional':
        activities = GroupActivity.query.filter_by(created_by=current_user_id).all()
        return jsonify(activities_schema.dump(activities)), 200
    else:
        # Client sees activities they are invited to
        invites = ActivityInvite.query.filter_by(client_id=current_user_id).all()
        return jsonify(invites_schema.dump(invites)), 200


@activity_bp.route('/<int:activity_id>', methods=['DELETE'])
@jwt_required()
def delete_activity(activity_id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    if claims.get('role') != 'professional':
        return jsonify({'message': 'Only professionals can delete activities'}), 403

    activity = GroupActivity.query.get(activity_id)
    if not activity:
        return jsonify({'message': 'Activity not found'}), 404

    if str(activity.created_by) != str(current_user_id):
        return jsonify({'message': 'Unauthorized'}), 403

    # Remove any invites for this activity first
    ActivityInvite.query.filter_by(activity_id=activity_id).delete()
    db.session.delete(activity)
    db.session.commit()

    return jsonify({'message': 'Activity deleted'}), 200
