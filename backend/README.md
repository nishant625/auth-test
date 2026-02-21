# Backend API

Node.js + Express + Prisma backend with dual-database architecture for application data and auth tokens.

## Prerequisites

- Node.js 18+
- Docker

## Environment Variables

Create a `.env` file in this directory:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/backend_db
AUTH_DATABASE_URL=postgresql://postgres:postgres@localhost:5433/auth_db
AUTH_SERVER_URL=http://localhost:4000
```

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

## Migrations

```bash
npm run db:migrate
npx prisma migrate dev --schema=prisma/auth.schema.prisma --name init
```

## Seed

```bash
npm run db:seed
```

Inserts 5 users, 10 products, and 15 orders.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Server runs on `http://localhost:3001`

## API Endpoints

All routes require `Authorization: Bearer <token>`.

### Users

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID (404 if not found) |
| POST | `/api/users` | Create user — body: `{ name, email }` |
| PUT | `/api/users/:id` | Update user — body: `{ name, email }` |
| DELETE | `/api/users/:id` | Delete user |

### Products

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID (404 if not found) |
| POST | `/api/products` | Create product — body: `{ name, price, stock }` |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product (cascades to orders) |

### Orders

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/orders` | Get all orders with user and product data |
| GET | `/api/orders/:id` | Get order by ID (404 if not found) |
| POST | `/api/orders` | Create order — body: `{ userId, productId, quantity }` |
| DELETE | `/api/orders/:id` | Delete order |

### Introspection

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/introspect` | Forward token to auth server introspection endpoint |

**Request:**
```json
{ "token": "your-access-token" }
```

**Response (valid):**
```json
{ "active": true, "scope": "openid", "client_id": "my-app", "user_id": 1, "username": "user@example.com" }
```

**Response (invalid):**
```json
{ "active": false }
```

## Authentication

Auth middleware validates every protected request by looking up the Bearer token in auth_db and checking expiry.

## Database Schema

### Application Database (backend_db)

```
User     — id, name, email, createdAt
Product  — id, name, price, stock, createdAt
Order    — id, userId, productId, quantity, createdAt
```

Deleting a User or Product cascades to related Orders.

### Auth Database (auth_db)

```
Token — id, token, userId, clientId, scope, expiresAt, createdAt
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with nodemon |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed application database |
| `npm run db:studio` | Open Prisma Studio |
