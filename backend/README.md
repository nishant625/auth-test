# Backend API

Express + Prisma backend. Validates requests using JWT verification against Sentinel's JWKS endpoint.

## Prerequisites

- Node.js 18+
- Docker

## Environment Variables

Create `backend/.env`:

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
AUTH_SERVER_URL=http://localhost:4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/backend_db
```


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

## Setup

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Server runs on `http://localhost:3001`.

## Authentication

Routes are protected by `requireAuth` middleware (`middleware/auth.js`). It:

1. Fetches Sentinel's public key from `AUTH_SERVER_URL/.well-known/jwks.json` (cached in memory)
2. Verifies the Bearer JWT using RS256 + issuer check
3. Attaches decoded payload to `req.user` (`{ sub, email, aud, scope, exp, iat }`)
4. Clears key cache on `JsonWebTokenError` (handles Sentinel restarts in dev)

## API Endpoints

All routes require `Authorization: Bearer <token>`.

### Products

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create — body: `{ name, price, stock }` |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Users

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create — body: `{ name, email }` |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Orders

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/orders` | Get all orders (includes user + product) |
| GET | `/api/orders/:id` | Get order by ID |
| POST | `/api/orders` | Create — body: `{ userId, productId, quantity }` |
| DELETE | `/api/orders/:id` | Delete order |

## Database Schema

```
User     — id, name, email, createdAt
Product  — id, name, price, stock, createdAt
Order    — id, userId, productId, quantity, createdAt
```

Deleting a User or Product cascades to related Orders.

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with nodemon |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |
