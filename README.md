# Healthcare Management System

A full-stack healthcare management application built with Flask (backend) and Next.js (frontend) that allows healthcare professionals and clients to connect, manage relationships, and collaborate on group activities.

## 🏗️ Architecture

- **Backend**: Flask REST API with SQLAlchemy ORM, JWT authentication
- **Frontend**: Next.js 16 with React 19, TypeScript, Tailwind CSS
- **Database**: SQLite (development) / PostgreSQL (production)

## 📁 Project Structure

```
HealthCare/
├── backend/          # Flask API server
│   ├── app/         # Application code
│   ├── migrations/  # Database migrations
│   └── run.py       # Server entry point
│
└── frontend/         # Next.js frontend
    ├── src/
    │   ├── app/     # Next.js pages
    │   ├── components/  # React components
    │   └── lib/     # Utilities
    └── package.json
```

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm/yarn/pnpm

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create `.env` file:
   ```env
   SECRET_KEY=your-secret-key-here
   DATABASE_URL=sqlite:///healthcare.db
   JWT_SECRET_KEY=your-jwt-secret-key-here
   FLASK_ENV=development
   FLASK_DEBUG=True
   ```

6. Initialize database:
   ```bash
   python -c "from app import create_app; from app.extensions import db; app = create_app(); app.app_context().push(); db.create_all()"
   ```

7. Run the server:
   ```bash
   python run.py
   ```

Backend will run on `http://127.0.0.1:5000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

Frontend will run on `http://localhost:3000`

## 🎯 Features

### User Roles

- **Professional**: Healthcare providers who can invite clients and create activities
- **Client**: Patients/trainees who can request professionals and join activities

### Core Features

- ✅ User authentication (Signup/Login with JWT)
- ✅ Role-based access control
- ✅ Connection management (invite/request/accept/reject)
- ✅ Group activity creation and management
- ✅ Activity invitations and responses
- ✅ Protected routes with automatic redirects
- ✅ Responsive, modern UI

## 📚 Documentation

- [Backend API Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Connections
- `POST /api/connection/request-pro` - Client requests professional
- `POST /api/connection/invite-client` - Professional invites client
- `POST /api/connection/respond` - Accept/reject connection
- `GET /api/connection/list` - List all connections
- `DELETE /api/connection/<id>` - Remove connection

### Activities
- `POST /api/activities/` - Create activity (Professional)
- `POST /api/activities/invite` - Invite client to activity
- `POST /api/activities/respond` - Accept/decline invitation
- `GET /api/activities/list` - List activities/invitations
- `DELETE /api/activities/<id>` - Delete activity

See [Backend README](./backend/README.md) for detailed API documentation.

## 🧪 Testing

### Backend
Test API endpoints using:
- Postman
- cURL
- Test scripts in `backend/scripts/`

### Frontend
- Open browser DevTools to check console
- Test authentication flow
- Verify protected routes redirect properly

## 🐛 Troubleshooting

### Backend not connecting
- Ensure backend is running on port 5000
- Check CORS settings in `backend/app/__init__.py`
- Verify `.env` file exists with correct values

### Frontend API errors
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend server is running
- Check browser console for CORS errors

### Database issues
- Run migrations: `flask db upgrade`
- Check database file permissions
- Verify `DATABASE_URL` in `.env`

## 🚀 Deployment

### Backend
- Use Gunicorn or similar WSGI server
- Set `FLASK_ENV=production`
- Use PostgreSQL for production
- Configure proper CORS origins

### Frontend
- Deploy to Vercel (recommended)
- Or any platform supporting Next.js
- Set `NEXT_PUBLIC_API_URL` to production API URL

## 📝 Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///healthcare.db
JWT_SECRET_KEY=your-jwt-secret
FLASK_ENV=development
FLASK_DEBUG=True
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api
```

## 📄 License

This project is part of a test assignment.

## 👥 Contributing

This is a test project. For questions or issues, please refer to the individual README files in `backend/` and `frontend/` directories.

