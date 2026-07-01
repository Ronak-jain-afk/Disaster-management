# Emergency Alerts & Disaster Management System

A full-stack TypeScript platform connecting volunteers, coordinators, and the public during crises. Provides real-time alerts, shelter maps, volunteer task management, and resource tracking.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite 5, Tailwind CSS 3, Redux Toolkit, Leaflet |
| Backend | Node.js, Express 4, TypeScript, Mongoose 8, Socket.IO 4 |
| Database | MongoDB (with in-memory fallback) |
| Validation | Zod 4 |
| Auth | JWT with role-based access (admin, coordinator, volunteer) |
| Notifications | Socket.IO (real-time) + Nodemailer (email) + Twilio (SMS) |
| Testing | Jest + ts-jest + Supertest |
| Deployment | Vercel |

## Project Structure

```
Disaster-management/
├── client/          # React SPA (Vite + Tailwind)
│   ├── src/
│   │   ├── pages/       # 8 page components
│   │   ├── components/  # Layout, Navbar, NotificationBell, etc.
│   │   ├── store/       # Redux Toolkit (auth, alerts)
│   │   ├── services/    # Axios API wrappers + Socket.IO client
│   │   ├── types/       # Shared TypeScript enums & interfaces
│   │   └── hooks/       # Typed Redux hooks
│   └── ...
├── server/          # Express REST API + Socket.IO
│   ├── src/
│   │   ├── models/      # 6 Mongoose schemas
│   │   ├── controllers/ # 8 controller modules
│   │   ├── routes/      # 8 route files
│   │   ├── services/    # Socket.IO, email, SMS, notifications
│   │   ├── middleware/  # JWT auth + error handler
│   │   ├── validators/  # Zod schemas
│   │   └── config/      # Env config + MongoDB connection
│   └── tests/           # Integration tests
└── package.json     # Monorepo root
```

## Getting Started

```bash
# Install dependencies
npm install && cd client && npm install && cd ../server && npm install && cd ..

# Start development (client + server concurrently)
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:5000

No external MongoDB required — the server falls back to an in-memory instance automatically.

## API Overview

All endpoints are prefixed with `/api`. Protected endpoints require `Authorization: Bearer <token>`.

| Group | Key Endpoints |
|-------|--------------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Disasters | CRUD at `/api/disasters` (paginated, filterable) |
| Alerts | CRUD + `PUT /:id/read` — creates broadcast via Socket.IO + email + SMS |
| Shelters | `GET /api/shelters`, `GET /api/shelters/nearby` (geospatial) |
| Resources | CRUD + allocate + status update at `/api/resources` |
| Tasks | CRUD + status transitions + progress updates |
| Volunteers | `POST /api/volunteers/register`, `GET /:id/tasks` |
| Stats | `GET /api/stats/dashboard` |

## Roles

- **Admin** — Full system access
- **Coordinator** — Create/update disasters, tasks, resources, alerts
- **Volunteer** — View and update assigned tasks

## Real-Time Features

- Socket.IO with JWT authentication
- User-scoped and role-scoped rooms
- Live alert broadcasting (Socket.IO + Email + SMS)
- Task update notifications

## Testing

```bash
npm test
```

## Deployment

Deploys to Vercel. The Express server serves the built client static files from `server/dist/public/` with SPA fallback.
