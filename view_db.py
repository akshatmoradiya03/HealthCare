"""Quick script to view database contents"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app import create_app
from app.extensions import db
from app.models import User, Connection, GroupActivity, ActivityInvite

app = create_app()

with app.app_context():
    print("\n" + "="*70)
    print("DATABASE CONTENTS")
    print("="*70)
    
    # Users
    print("\n" + "-"*70)
    print("USERS")
    print("-"*70)
    users = User.query.all()
    if users:
        print(f"\n{'ID':<5} {'Name':<20} {'Email':<30} {'Role':<15} {'Created At'}")
        print("-" * 85)
        for user in users:
            created = user.created_at.strftime('%Y-%m-%d %H:%M') if user.created_at else 'N/A'
            print(f"{user.id:<5} {user.name:<20} {user.email:<30} {user.role:<15} {created}")
        print(f"\nTotal: {len(users)} user(s)")
    else:
        print("\n(No users found)")
    
    # Connections
    print("\n" + "-"*70)
    print("CONNECTIONS")
    print("-"*70)
    connections = Connection.query.all()
    if connections:
        print(f"\n{'ID':<5} {'Pro ID':<8} {'Client ID':<10} {'Status':<12} {'Initiated By':<13} {'Created At'}")
        print("-" * 70)
        for conn in connections:
            created = conn.created_at.strftime('%Y-%m-%d %H:%M') if conn.created_at else 'N/A'
            print(f"{conn.id:<5} {conn.professional_id:<8} {conn.client_id:<10} {conn.status:<12} {conn.initiated_by:<13} {created}")
        print(f"\nTotal: {len(connections)} connection(s)")
    else:
        print("\n(No connections found)")
    
    # Activities
    print("\n" + "-"*70)
    print("GROUP ACTIVITIES")
    print("-"*70)
    activities = GroupActivity.query.all()
    if activities:
        print(f"\n{'ID':<5} {'Title':<20} {'Description':<30} {'Created By':<12} {'Created At'}")
        print("-" * 85)
        for activity in activities:
            desc = (activity.description[:27] + '...') if activity.description and len(activity.description) > 30 else (activity.description or '')
            created = activity.created_at.strftime('%Y-%m-%d %H:%M') if activity.created_at else 'N/A'
            print(f"{activity.id:<5} {activity.title:<20} {desc:<30} {activity.created_by:<12} {created}")
        print(f"\nTotal: {len(activities)} activity/activities")
    else:
        print("\n(No activities found)")
    
    # Activity Invites
    print("\n" + "-"*70)
    print("ACTIVITY INVITATIONS")
    print("-"*70)
    invites = ActivityInvite.query.all()
    if invites:
        print(f"\n{'ID':<5} {'Activity ID':<12} {'Client ID':<10} {'Status':<12}")
        print("-" * 45)
        for invite in invites:
            print(f"{invite.id:<5} {invite.activity_id:<12} {invite.client_id:<10} {invite.status:<12}")
        print(f"\nTotal: {len(invites)} invitation(s)")
    else:
        print("\n(No invitations found)")
    
    # Summary
    print("\n" + "="*70)
    print("SUMMARY")
    print("="*70)
    print(f"   Users:              {User.query.count():>4}")
    print(f"   Connections:        {Connection.query.count():>4}")
    print(f"   Activities:         {GroupActivity.query.count():>4}")
    print(f"   Activity Invites:   {ActivityInvite.query.count():>4}")
    print("="*70 + "\n")

