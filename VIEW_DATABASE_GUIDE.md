# How to View Database Contents

## Method 1: Using the Python Script (Recommended)

I've created a comprehensive script to view all database contents. Run it from the project root:

```bash
cd backend
python scripts/view_db_complete.py
```

Or from the project root:
```bash
python backend/scripts/view_db_complete.py
```

## Method 2: Using SQLite Command Line

You can use SQLite's command-line tool directly:

```bash
cd backend
sqlite3 healthcare.db
```

Then use SQL commands:
```sql
-- List all tables
.tables

-- View Users table
SELECT * FROM user;

-- View Connections table
SELECT * FROM connection;

-- View Activities table
SELECT * FROM group_activity;

-- View Activity Invites table
SELECT * FROM activity_invite;

-- Exit
.exit
```

## Method 3: Using a GUI Tool (DB Browser for SQLite)

1. Download DB Browser for SQLite: https://sqlitebrowser.org/
2. Open the application
3. Click "Open Database"
4. Navigate to `backend/healthcare.db` (or `backend/instance/healthcare.db`)
5. Browse tables and data visually

## Method 4: Using Python Interactively

```bash
cd backend
python
```

Then in Python:
```python
from app import create_app
from app.extensions import db
from app.models import User, Connection, GroupActivity, ActivityInvite

app = create_app()
with app.app_context():
    # View all users
    users = User.query.all()
    for user in users:
        print(f"ID: {user.id}, Name: {user.name}, Email: {user.email}, Role: {user.role}")
    
    # View all connections
    connections = Connection.query.all()
    for conn in connections:
        print(f"Connection ID: {conn.id}, Pro: {conn.professional_id}, Client: {conn.client_id}, Status: {conn.status}")
    
    # View all activities
    activities = GroupActivity.query.all()
    for activity in activities:
        print(f"Activity ID: {activity.id}, Title: {activity.title}, Created by: {activity.created_by}")
    
    # View all activity invites
    invites = ActivityInvite.query.all()
    for invite in invites:
        print(f"Invite ID: {invite.id}, Activity: {invite.activity_id}, Client: {invite.client_id}, Status: {invite.status}")
```

## Database Location

The database file is typically located at:
- `backend/healthcare.db` (default)
- `backend/instance/healthcare.db` (Flask instance folder)

## Quick View Commands

### View Table Structure
```bash
sqlite3 backend/healthcare.db ".schema user"
sqlite3 backend/healthcare.db ".schema connection"
```

### View Row Counts
```bash
sqlite3 backend/healthcare.db "SELECT 'Users:', COUNT(*) FROM user; SELECT 'Connections:', COUNT(*) FROM connection; SELECT 'Activities:', COUNT(*) FROM group_activity; SELECT 'Invites:', COUNT(*) FROM activity_invite;"
```

### View All Data
```bash
sqlite3 backend/healthcare.db "SELECT * FROM user;"
sqlite3 backend/healthcare.db "SELECT * FROM connection;"
```

## Database Tables

1. **user** - Stores user accounts (professionals and clients)
   - Columns: id, name, email, password_hash, role, created_at

2. **connection** - Stores professional-client connections
   - Columns: id, professional_id, client_id, status, initiated_by, created_at

3. **group_activity** - Stores group activities created by professionals
   - Columns: id, title, description, created_by, created_at

4. **activity_invite** - Stores activity invitations
   - Columns: id, activity_id, client_id, status

5. **alembic_version** - Stores database migration version (if using migrations)

