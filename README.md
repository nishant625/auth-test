# Auth Test Project

Full-stack app with React frontend, Express + Prisma backend, and OAuth2 PKCE authentication via Sentinel.

## Project Structure

```
auth-test/
├── frontend/    (React + Vite — Port 3000)
├── backend/     (Express + Prisma — Port 3001)
└── [sentinel]   (OAuth2 Server — Port 4000, external)
```

## Prerequisites

- Node.js 18+
- Docker
- Sentinel running on port 4000

## Database Setup (Docker)

```bash
docker run -d \
  --name backend-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=backend_db \
  -p 5432:5432 \
  -v backend-db-data:/var/lib/postgresql/data \
  postgres:16-alpine
```

## Quick Start

### Backend

```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
AUTH_SERVER_URL=http://localhost:4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/backend_db
```

### Frontend (`frontend/.env`)

```env
VITE_AUTH_SERVER_URL=http://localhost:4000
VITE_REDIRECT_URI=http://localhost:3000/callback
VITE_CLIENT_ID=test-client
VITE_API_BASE_URL=http://localhost:3001/api
```

## Architecture

### Authentication Flow

1. User visits `/login` → PKCE params generated, redirected to Sentinel
2. Sentinel authenticates user, redirects to `/callback` with `?code=&state=`
3. Callback verifies state, exchanges code for `access_token` + `refresh_token`
4. Tokens stored in localStorage
5. Every API request sends `Authorization: Bearer <access_token>`
6. Backend verifies JWT locally using Sentinel's public key from `/.well-known/jwks.json`
7. On 401, frontend attempts token refresh before redirecting to login

### Token Details

| Field | Value |
|-------|-------|
| Type | JWT (RS256) |
| expires_in | 900s (15 min) |
| refresh_token | included in token response |

## API Endpoints

All endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/:id` | Get order by ID |
| POST | `/api/orders` | Create order |
| DELETE | `/api/orders/:id` | Delete order |

## Dev Caveat

Every Sentinel restart generates a new RSA key pair. Existing JWTs will fail — re-login to get a new token. The backend middleware clears its key cache automatically on `JsonWebTokenError`.
