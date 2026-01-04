# Healthcare Management System - Backend API

A Flask-based REST API for managing healthcare professionals, clients, connections, and group activities.

## 🚀 Features

- **User Authentication**: JWT-based authentication for Professionals and Clients
- **Connection Management**: Professionals can invite clients, clients can request professionals
- **Group Activities**: Professionals can create and manage group activities
- **Activity Invitations**: Professionals can invite clients to join activities

## 📋 Prerequisites

- Python 3.10 or higher
- pip (Python package manager)
- SQLite (default) or PostgreSQL (for production)

## 🛠️ Installation

1. **Clone the repository** (if applicable) or navigate to the backend directory:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**:
   Create a `.env` file in the `backend` directory:
   ```env
   SECRET_KEY=your-secret-key-here
   DATABASE_URL=sqlite:///healthcare.db
   JWT_SECRET_KEY=your-jwt-secret-key-here
   FLASK_ENV=development
   FLASK_DEBUG=True
   ```

6. **Initialize the database**:
   ```bash
   python -c "from app import create_app; from app.extensions import db; app = create_app(); app.app_context().push(); db.create_all()"
   ```

   Or use Flask-Migrate:
   ```bash
   flask db upgrade
   ```

## 🏃 Running the Server

```bash
python run.py
```

The server will start on `http://127.0.0.1:5000` by default.

## 📚 API Endpoints

### Authentication

#### Sign Up
- **POST** `/api/auth/signup`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "professional" // or "client"
  }
  ```
- **Response**: Returns user object and JWT token

#### Login
- **POST** `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: Returns user object and JWT token

### Users

#### List Users
- **GET** `/api/users?role=professional` (optional role filter)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: List of users

### Connections

#### Request Professional (Client only)
- **POST** `/api/connection/request-pro`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "professional_id": 1
  }
  ```

#### Invite Client (Professional only)
- **POST** `/api/connection/invite-client`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "client_email": "client@example.com"
  }
  ```

#### Respond to Connection Request
- **POST** `/api/connection/respond`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "connection_id": 1,
    "action": "accept" // or "reject"
  }
  ```

#### List Connections
- **GET** `/api/connection/list`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: List of all connections for the authenticated user

#### Disconnect/Remove Connection
- **DELETE** `/api/connection/<connection_id>`
- **Headers**: `Authorization: Bearer <token>`

### Activities

#### Create Activity (Professional only)
- **POST** `/api/activities/`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Morning Workout",
    "description": "30-minute cardio session"
  }
  ```

#### Invite Client to Activity (Professional only)
- **POST** `/api/activities/invite`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "activity_id": 1,
    "client_id": 2
  }
  ```

#### Respond to Activity Invite (Client only)
- **POST** `/api/activities/respond`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "invite_id": 1,
    "action": "accept" // or "decline"
  }
  ```

#### List Activities
- **GET** `/api/activities/list`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: 
  - For Professionals: List of activities they created
  - For Clients: List of activity invitations

#### Delete Activity (Professional only)
- **DELETE** `/api/activities/<activity_id>`
- **Headers**: `Authorization: Bearer <token>`

### Health Check

#### Health Check
- **GET** `/api/health/`
- **Response**: `{"status": "ok"}`

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

Tokens are obtained from `/api/auth/login` or `/api/auth/signup`.

## 🗄️ Database

The application uses SQLite by default for development. For production, update `DATABASE_URL` in `.env` to use PostgreSQL:

```env
DATABASE_URL=postgresql://user:password@localhost/healthcare_db
```

### Database Migrations

Using Flask-Migrate:

```bash
# Create a new migration
flask db migrate -m "Description of changes"

# Apply migrations
flask db upgrade

# Rollback migration
flask db downgrade
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── config.py             # Configuration
│   ├── extensions.py        # Flask extensions (db, jwt, etc.)
│   ├── models.py             # SQLAlchemy models
│   ├── routes/               # API routes
│   │   ├── auth_routes.py    # Authentication endpoints
│   │   ├── connection_routes.py  # Connection management
│   │   ├── activity_routes.py    # Activity management
│   │   └── user_routes.py         # User endpoints
│   └── schemas/              # Marshmallow schemas
│       ├── user_schema.py
│       ├── connection_schema.py
│       └── activity_schema.py
├── migrations/               # Database migrations
├── scripts/                  # Utility scripts
├── requirements.txt          # Python dependencies
├── run.py                    # Application entry point
└── .env                      # Environment variables (create this)
```

## 🧪 Testing

Test the API using tools like:
- Postman
- cURL
- The included test scripts in `scripts/` directory

Example cURL request:
```bash
curl -X POST http://127.0.0.1:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## 🐛 Troubleshooting

### Database Issues
- Ensure the database file has write permissions
- Check that migrations are up to date: `flask db upgrade`

### CORS Issues
- The backend is configured to allow requests from `http://localhost:3000` and `http://127.0.0.1:3000`
- Update CORS origins in `app/__init__.py` if using different ports

### Authentication Issues
- Verify JWT_SECRET_KEY is set in `.env`
- Check that tokens are being sent in the Authorization header
- Ensure tokens haven't expired

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Flask secret key | `you-will-never-guess` |
| `DATABASE_URL` | Database connection string | `sqlite:///healthcare.db` |
| `JWT_SECRET_KEY` | JWT token secret | `super-secret-jwt-key` |
| `FLASK_ENV` | Flask environment | `development` |
| `FLASK_DEBUG` | Enable debug mode | `True` |

## 🚀 Production Deployment

1. Set `FLASK_ENV=production` and `FLASK_DEBUG=False`
2. Use a strong `SECRET_KEY` and `JWT_SECRET_KEY`
3. Switch to PostgreSQL database
4. Use a production WSGI server (e.g., Gunicorn)
5. Set up proper CORS origins for your frontend domain
6. Use environment variables for sensitive data

## 📄 License

This project is part of a test assignment.

## 👤 Author

Healthcare Management System - Backend API

