# Healthcare Management System - Frontend

A Next.js-based frontend application for managing healthcare professionals, clients, connections, and group activities.

## 🚀 Features

- **User Authentication**: Login and signup with role-based access (Professional/Client)
- **Dashboard**: View user information and active connections
- **Connection Management**: Send and manage connection requests
- **Group Activities**: Create and manage activities (Professionals) or respond to invitations (Clients)
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Responsive Design**: Clean, modern UI with Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Backend API running (see backend README)

## 🛠️ Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api
   ```

   For production, update the API URL to your backend server.

## 🏃 Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── dashboard/         # Dashboard page
│   │   ├── requests/           # Connection requests page
│   │   ├── activities/         # Activities page
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── Navbar.tsx          # Navigation bar
│   │   └── ProtectedRoute.tsx  # Route protection wrapper
│   ├── hooks/                  # Custom React hooks
│   │   └── useAuth.ts          # Authentication hook
│   └── lib/                    # Utilities
│       ├── api.ts              # Axios API client
│       └── utils.ts             # Helper functions
├── public/                     # Static assets
├── package.json
├── next.config.ts
└── .env.local                  # Environment variables (create this)
```

## 🎯 Pages & Routes

### Public Routes

- `/` - Home page
- `/login` - Login page
- `/signup` - Signup page

### Protected Routes (Require Authentication)

- `/dashboard` - User dashboard with connections
- `/requests` - Manage connection requests and invitations
- `/activities` - View and manage group activities

## 🔐 Authentication

The application uses JWT tokens stored in cookies for authentication. The `useAuth` hook manages authentication state:

```typescript
const { user, loading, login, signup, logout } = useAuth();
```

Protected routes automatically redirect to `/login` if the user is not authenticated.

## 🎨 Features by Role

### Professional Features
- Invite clients via email
- Create group activities
- Invite clients to activities
- View outgoing connection requests
- Manage created activities

### Client Features
- Request to connect with professionals
- Accept/reject connection requests
- View and respond to activity invitations
- View incoming connection requests

## 🔌 API Integration

The frontend communicates with the backend API through the `api.ts` client. All API calls include:

- JWT token in Authorization header (automatically added)
- Proper error handling
- Automatic redirect to login on 401 errors

### API Base URL

Configure the API base URL via environment variable:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api
```

## 🛠️ Building for Production

```bash
npm run build
npm start
```

Or deploy to Vercel (recommended for Next.js):
1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

## 📦 Key Dependencies

- **Next.js 16.1.1** - React framework
- **React 19.2.3** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **React Hot Toast** - Toast notifications
- **js-cookie** - Cookie management

## 🎨 Styling

The application uses Tailwind CSS for styling. The design is:
- Clean and minimal
- Responsive (mobile-friendly)
- Light theme
- Consistent color scheme (Indigo primary)

## 🔒 Security Features

- Protected routes with automatic redirect
- JWT token stored in httpOnly cookies (via js-cookie)
- Automatic token refresh handling
- CORS-aware API client

## 🐛 Troubleshooting

### API Connection Issues
- Ensure the backend server is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS settings in backend

### Authentication Issues
- Clear browser cookies and try again
- Check browser console for errors
- Verify backend JWT configuration

### Build Issues
- Delete `.next` folder and rebuild
- Clear `node_modules` and reinstall dependencies
- Check Node.js version (18+ required)

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://127.0.0.1:5000/api` |
| `NODE_ENV` | Node environment | `development` |

## 🚀 Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the frontend directory
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📄 License

This project is part of a test assignment.

## 👤 Author

Healthcare Management System - Frontend
