# Quickstart: 005-auth Authentication

**Date**: 2026-02-06
**Feature**: 005-auth

## Prerequisites

- Node.js 18+ (for Next.js frontend)
- Python 3.13+ (for FastAPI backend)
- UV package manager (for Python dependencies)
- Neon PostgreSQL database (from 004-database-setup)
- BETTER_AUTH_SECRET environment variable (min 32 characters)

## Environment Variables

### Frontend (apps/web/.env)
```env
# Existing
API_BASE_URL=http://localhost:8000

# Better Auth
BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000

# Database (same Neon connection as backend, but for pg client — standard pg format, NOT asyncpg)
AUTH_DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Backend API URL (for client-side API calls)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (services/api/.env)
```env
# Existing
DATABASE_URL=postgresql+asyncpg://user:pass@host/db?sslmode=require

# New for auth
JWKS_URL=http://localhost:3000/api/auth/jwks
CORS_ORIGINS=http://localhost:3000
```

## Setup Steps

### 1. Install Frontend Dependencies
```bash
cd apps/web
npm install better-auth pg
```

### 2. Install Backend Dependencies
```bash
cd services/api
uv add "PyJWT[crypto]>=2.8.0"
```

### 3. Apply Auth Database Migration
```bash
# Apply the migration SQL to your Neon database
# Migration file: apps/web/migrations/001-better-auth.sql
# Use psql, Neon console, or your preferred SQL client
psql $AUTH_DATABASE_URL -f apps/web/migrations/001-better-auth.sql
```

### 4. Start Both Services
```bash
# Terminal 1: Frontend
cd apps/web && npm run dev

# Terminal 2: Backend
cd services/api && uv run uvicorn main:app --reload --port 8000
```

## Verification

1. Open http://localhost:3000/auth/signup — create an account
2. Verify redirect to dashboard
3. Open http://localhost:3000/api/auth/jwks — confirm JWKS endpoint returns keys
4. Make authenticated API request to backend:
   ```bash
   # Get JWT token (via browser or curl with session cookie)
   curl -H "Authorization: Bearer <token>" http://localhost:8000/auth/me
   # Should return: {"id": "uuid", "email": "user@example.com"}
   ```

## Key File Locations

### Frontend (apps/web/)
- `src/lib/auth.ts` — Better Auth server configuration
- `src/lib/auth-client.ts` — Better Auth client configuration
- `src/app/api/auth/[...all]/route.ts` — Auth API route handler
- `src/app/auth/signin/page.tsx` — Sign-in page
- `src/app/auth/signup/page.tsx` — Sign-up page

### Backend (services/api/)
- `src/api/auth/jwt.py` — JWT verification middleware
- `src/api/auth/dependencies.py` — Auth dependency injection
- `src/api/config.py` — Updated with JWKS_URL and CORS_ORIGINS
