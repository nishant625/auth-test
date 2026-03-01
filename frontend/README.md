# Frontend

React + Vite frontend with PKCE OAuth2 flow against Sentinel.

## Prerequisites

- Node.js 18+

## Environment Variables

Create `frontend/.env`:

```env
VITE_AUTH_SERVER_URL=http://localhost:4000
VITE_REDIRECT_URI=http://localhost:3000/callback
VITE_CLIENT_ID=test-client
VITE_API_BASE_URL=http://localhost:3001/api
```

## Setup

```bash
npm install
npm run dev
```

App runs on `http://localhost:3000`.

## OAuth Flow

### 1. Login (`/login`)

- Generates `code_verifier` (32 random bytes, base64url)
- Computes `code_challenge = BASE64URL(SHA256(verifier))`
- Generates `state` for CSRF protection
- Saves `pkce_verifier` and `oauth_state` to `sessionStorage`
- Redirects to Sentinel's `/oauth/authorize`

### 2. Callback (`/callback`)

- Verifies `state` from URL matches `sessionStorage` (CSRF check)
- POSTs to `/oauth/token` with `code` + `code_verifier`
- Stores `access_token` and `refresh_token` in localStorage
- Clears PKCE/state from sessionStorage
- Redirects to `/`

### 3. Token Refresh

On 401 from the backend, the axios interceptor:
1. POSTs to `/oauth/token` with `grant_type=refresh_token`
2. Stores the new `access_token` (and `refresh_token` if rotated)
3. Retries the original request
4. If refresh fails, clears tokens and redirects to `/login`

## Token Details

| Field | Value |
|-------|-------|
| expires_in | 900s (15 min) |
| refresh_token | stored in localStorage |

## Routes

- `/login` — initiates OAuth flow
- `/callback` — handles Sentinel redirect
- `/` — Product Manager (protected)

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Dev Caveat

Every Sentinel restart generates a new RSA key pair, invalidating existing JWTs. Re-login after restarting Sentinel.
