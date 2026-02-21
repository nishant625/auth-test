# Auth Test Project

Full-stack application with React frontend, Express + Prisma backend, and OAuth2 PKCE authentication.

## Project Structure

```
auth-test/
├── frontend/        (React + Vite - Port 3000)
├── backend/         (Express + Prisma - Port 3001)
└── [auth-server]    (OAuth2 Server - Port 4000, external)
```

## Prerequisites

- Node.js 18+
- Docker
- OAuth2 Server running on port 4000

## Database Setup (Docker)

### Application Database (backend_db — Port 5432)

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

### Auth Database (auth_db — Port 5433)

```bash
docker run -d \
  --name auth-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=auth_db \
  -p 5433:5432 \
  -v auth-db-data:/var/lib/postgresql/data \
  postgres:16-alpine
```

## Quick Start

### 1. Start Databases

Run the Docker commands above, then wait a few seconds for the containers to be ready.

### 2. Backend Setup

```bash
cd backend
npm install
npm run db:migrate
npx prisma migrate dev --schema=prisma/auth.schema.prisma --name init
npm run db:seed
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/backend_db
AUTH_DATABASE_URL=postgresql://postgres:postgres@localhost:5433/auth_db
AUTH_SERVER_URL=http://localhost:4000
```

### Frontend

No `.env` file needed. Hardcoded config:
- Backend API: `http://localhost:3001`
- Auth Server: `http://localhost:4000`
- OAuth Client ID: `my-app`
- OAuth Redirect URI: `http://localhost:3000/callback`

## Architecture

### Authentication Flow

1. User visits frontend → redirected to `/login`
2. Login page generates PKCE parameters and redirects to OAuth server
3. OAuth server authenticates user and redirects to `/callback`
4. Callback exchanges authorization code for access token
5. Token stored in localStorage
6. Protected routes attach `Authorization: Bearer <token>` on every request

### Dual Database Architecture

| Database | Port | Purpose |
|----------|------|---------|
| backend_db | 5432 | Users, Products, Orders |
| auth_db | 5433 | Tokens |

### Authentication Methods

1. **Local Token Validation** — Auth middleware checks token directly in auth_db
2. **Remote Introspection** — `POST /api/introspect` forwards to auth server

## API Endpoints

All endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/:id` | Get order by ID |
| POST | `/api/orders` | Create order |
| DELETE | `/api/orders/:id` | Delete order |
| POST | `/api/introspect` | Introspect token via auth server |

## Features

- PKCE OAuth2 authorization code flow with state parameter
- Dual-database architecture (app data + auth tokens)
- Bearer token validation via local DB
- Token introspection endpoint proxied to auth server
- Auto-logout on 401
- Product Manager UI (add, edit, delete)
- Cascade delete for related records

## Development

See individual README files:
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
