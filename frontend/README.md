# Frontend Application

React + Vite frontend with PKCE OAuth2 authentication flow.

## Prerequisites

- Node.js 18+

## Environment

The application expects the following services:

- **Backend API**: `http://localhost:3001`
- **Auth Server**: `http://localhost:4000`

OAuth Configuration:
- `client_id`: `my-app`
- `redirect_uri`: `http://localhost:3000/callback`

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Application runs on `http://localhost:3000`

## OAuth Flow

### PKCE Authorization Code Flow

1. **Login** (`/login`)
   - Generates `code_verifier` and `code_challenge` using Web Crypto API
   - Generates `state` parameter for CSRF protection
   - Saves `pkce_verifier` and `oauth_state` to localStorage
   - Redirects to auth server: `http://localhost:4000/oauth/authorize`

2. **Callback** (`/callback`)
   - Receives authorization `code` from auth server
   - Retrieves `pkce_verifier` from localStorage
   - Exchanges code for access token at `http://localhost:4000/oauth/token`
   - Saves `access_token` to localStorage
   - Redirects to home page

3. **Protected Routes** (`/`)
   - Checks for `access_token` in localStorage
   - Redirects to `/login` if not authenticated

## API Authentication

All API requests include the Bearer token automatically via axios interceptors:

```
Authorization: Bearer <access_token>
```

On 401 response, the user is automatically logged out and redirected to `/login`.

## Routes

- `/login` - OAuth login initiation
- `/callback` - OAuth callback handler
- `/` - Product Manager (protected)

## Features

### Product Manager

- View all products in a table
- Add random products
- Edit product names
- Delete products
- Logout

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Security

- **PKCE Flow**: Uses Proof Key for Code Exchange (RFC 7636)
- **State Parameter**: CSRF protection via random state string
- **Token Storage**: Access tokens stored in localStorage
- **Auto Logout**: 401 responses trigger automatic logout
