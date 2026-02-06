# API Contracts: Authentication

**Date**: 2026-02-06
**Feature**: 005-auth

## Frontend Auth Routes (Better Auth — auto-generated)

These routes are handled automatically by Better Auth via the catch-all route handler at `/api/auth/[...all]`. Listed here for reference.

### POST /api/auth/sign-up/email

Create a new user account.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "User Name"
}
```

**Response (201)**:
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "User Name",
    "emailVerified": false,
    "image": null,
    "createdAt": "2026-02-06T12:00:00Z",
    "updatedAt": "2026-02-06T12:00:00Z"
  },
  "session": {
    "id": "session-id",
    "userId": "uuid-string",
    "token": "session-token",
    "expiresAt": "2026-02-13T12:00:00Z"
  }
}
```

**Error (422)**: Invalid email or password too short.
**Error (409)**: Email already registered.

---

### POST /api/auth/sign-in/email

Authenticate an existing user.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200)**: Same shape as sign-up response.

**Error (401)**: Invalid credentials (generic message).

---

### POST /api/auth/sign-out

Terminate the current session.

**Request**: No body. Session identified by cookie.

**Response (200)**:
```json
{ "success": true }
```

---

### GET /api/auth/get-session

Get the current user's session.

**Request**: No body. Session identified by cookie.

**Response (200)**:
```json
{
  "user": { "id": "...", "email": "...", "name": "..." },
  "session": { "id": "...", "expiresAt": "..." }
}
```

**Response (401)**: No valid session.

---

### GET /api/auth/jwks

Public JWKS endpoint for JWT verification.

**Response (200)**:
```json
{
  "keys": [
    {
      "kty": "OKP",
      "crv": "Ed25519",
      "x": "base64url-encoded-public-key",
      "kid": "key-id",
      "use": "sig",
      "alg": "EdDSA"
    }
  ]
}
```

---

### GET /api/auth/token

Get a signed JWT token for the current session.

**Request**: No body. Session identified by cookie.

**Response (200)**:
```json
{
  "token": "eyJhbGciOiJFZERTQSIs..."
}
```

**JWT Payload**:
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "iss": "http://localhost:3000",
  "aud": "http://localhost:8000",
  "iat": 1738800000,
  "exp": 1738800900
}
```

**Response (401)**: No valid session.

---

## Backend Protected Endpoints (FastAPI)

All existing and future FastAPI endpoints that require authentication must include JWT verification middleware.

### Common Auth Headers

**Request Header** (required on all protected endpoints):
```
Authorization: Bearer <jwt-token>
```

### Common Error Responses

**401 Unauthorized — Missing Token**:
```json
{
  "detail": "Authentication required"
}
```

**401 Unauthorized — Expired Token**:
```json
{
  "detail": "Token has expired"
}
```

**401 Unauthorized — Invalid Token**:
```json
{
  "detail": "Invalid authentication token"
}
```

### GET /health (public — no auth required)

Health check endpoint remains public for monitoring.

**Response (200)**:
```json
{ "status": "ok" }
```

---

## CORS Configuration

**Allowed Origins**: `CORS_ORIGINS` environment variable (default: `http://localhost:3000`)
**Allowed Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS
**Allowed Headers**: Authorization, Content-Type
**Allow Credentials**: true
