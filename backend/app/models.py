from .extensions import db
from datetime import datetime

# Association table for Many-to-Many relationship between Professional and Client
# However, the requirements say "Connection Mechanism" with status. 
# So it's better to make Connection a model itself to store status.

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False) # 'professional' or 'client'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    # A professional has many connections (as pro)
    # A client has many connections (as client)
    # This will be handled by the Connection model queries

class Connection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    professional_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default='pending') # pending, accepted, rejected, disconnected
    initiated_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    professional = db.relationship('User', foreign_keys=[professional_id], backref='pro_connections')
    client = db.relationship('User', foreign_keys=[client_id], backref='client_connections')

class GroupActivity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    creator = db.relationship('User', backref='created_activities')

class ActivityInvite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    activity_id = db.Column(db.Integer, db.ForeignKey('group_activity.id'), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default='pending') # pending, accepted, declined

    activity = db.relationship('GroupActivity', backref='invites')
    client = db.relationship('User', backref='activity_invites')
