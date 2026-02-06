# Implementation Plan: Authentication

**Branch**: `005-auth` | **Date**: 2026-02-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-auth/spec.md`

## Summary

Implement email/password authentication using Better Auth (with JWT plugin) on the Next.js frontend and JWKS-based JWT verification on the FastAPI backend. Better Auth manages user registration, login, sessions, and JWT issuance. The FastAPI backend verifies JWTs by fetching public keys from Better Auth's JWKS endpoint — no shared secret needed between services. The existing User table schema (from 004-database-setup) will be migrated to match Better Auth's requirements. Five new database tables are added (account, session, verification, jwks).

## Technical Context

**Language/Version**: TypeScript (Next.js 16+, frontend), Python 3.13+ (FastAPI, backend)
**Primary Dependencies**:
- Frontend: better-auth, pg (PostgreSQL client)
- Backend: PyJWT[crypto] (JWT verification via JWKS)
**Storage**: Neon Serverless PostgreSQL (shared between frontend auth and backend API)
**Testing**: Jest/Vitest (frontend), pytest (backend)
**Target Platform**: Web (Linux server for backend, Vercel for frontend)
**Project Type**: Web application (monorepo: apps/web + services/api)
**Performance Goals**: Sign-up/sign-in under 30s end-to-end, JWT verification under 50ms
**Constraints**: JWKS public key cached to avoid per-request network calls; JWT expiry 15 minutes; session expiry 7 days
**Scale/Scope**: Phase II MVP — single-user development, no horizontal scaling requirements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| Readability Over Cleverness | PASS | Standard auth patterns, no clever abstractions |
| Async-First Design | PASS | FastAPI async middleware, async session operations |
| Security by Default | PASS | Password hashing (scrypt), JWT with asymmetric keys, no shared secrets in code, env vars for config |
| Phase-Based Evolution | PASS | Phase II feature, builds on 004-database-setup |
| Spec-Driven Development | PASS | Spec complete, clarified, now planning |

**Post-Phase 1 Re-check**:

| Principle | Status | Notes |
|-----------|--------|-------|
| Readability Over Cleverness | PASS | Middleware pattern is straightforward; auth config is declarative |
| Async-First Design | PASS | All DB operations async, JWT verification is synchronous (CPU-bound, acceptable) |
| Security by Default | PASS | JWKS rotation, short-lived JWTs (15 min), scrypt password hashing, no secrets in code |
| Phase-Based Evolution | PASS | Schema migration extends 004 without breaking existing structure |
| Spec-Driven Development | PASS | All artifacts trace back to spec requirements |

## Project Structure

### Documentation (this feature)

```text
specs/005-auth/
├── plan.md              # This file
├── research.md          # Phase 0 output — technology decisions
├── data-model.md        # Phase 1 output — entity schemas
├── quickstart.md        # Phase 1 output — setup guide
├── contracts/
│   └── auth-api.md      # Phase 1 output — API contracts
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
apps/web/
├── src/
│   ├── app/
│   │   ├── api/auth/[...all]/
│   │   │   └── route.ts          # Better Auth catch-all handler
│   │   ├── auth/
│   │   │   ├── signin/
│   │   │   │   └── page.tsx      # Sign-in page
│   │   │   └── signup/
│   │   │       └── page.tsx      # Sign-up page
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Protected dashboard (redirect target)
│   │   ├── layout.tsx            # Root layout (existing)
│   │   └── page.tsx              # Landing page (existing)
│   └── lib/
│       ├── auth.ts               # Better Auth server config
│       └── auth-client.ts        # Better Auth client config
├── .env                          # BETTER_AUTH_SECRET, DATABASE_URL, etc.
└── package.json                  # + better-auth, pg dependencies

services/api/
├── src/api/
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── jwt.py                # JWT verification (JWKS-based)
│   │   └── dependencies.py       # get_current_user dependency
│   ├── config.py                 # + JWKS_URL, CORS_ORIGINS settings
│   ├── database.py               # Unchanged
│   ├── main.py                   # + CORS middleware
│   └── models/
│       ├── __init__.py           # Unchanged
│       ├── user.py               # Modified — Better Auth schema
│       └── task.py               # Unchanged
├── .env                          # + JWKS_URL, CORS_ORIGINS
└── pyproject.toml                # + PyJWT[crypto] dependency
```

**Structure Decision**: Follows existing monorepo layout (apps/web for frontend, services/api for backend). Auth-specific code is organized into `src/lib/` (frontend) and `src/api/auth/` (backend). No new top-level directories.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BROWSER                                       │
│                                                                      │
│  1. User fills sign-up/sign-in form                                 │
│  2. Better Auth client sends credentials to /api/auth/*              │
│  3. On success: session cookie set, redirect to dashboard            │
│  4. For API calls: client fetches JWT via authClient.token()         │
│  5. JWT attached as Authorization: Bearer <token> to backend calls   │
└───────┬──────────────────────────────────┬──────────────────────────┘
        │                                  │
        ▼                                  ▼
┌───────────────────┐           ┌───────────────────────┐
│  Next.js Frontend │           │   FastAPI Backend      │
│  (localhost:3000)  │           │   (localhost:8000)     │
│                   │           │                       │
│  Better Auth      │           │  JWT Middleware        │
│  - Sign-up/in/out │           │  - Fetch JWKS from    │
│  - Session mgmt   │◄──JWKS───│    frontend endpoint   │
│  - JWT issuance   │           │  - Verify signature   │
│  - JWKS endpoint  │           │  - Extract user_id    │
│                   │           │  - Inject into request │
└───────┬───────────┘           └───────────┬───────────┘
        │                                   │
        └──────────┬────────────────────────┘
                   ▼
         ┌─────────────────┐
         │  Neon PostgreSQL │
         │                 │
         │  user           │
         │  account        │
         │  session        │
         │  verification   │
         │  jwks           │
         │  task           │
         └─────────────────┘
```

### Key Design Decisions

1. **JWKS over shared secret**: Better Auth signs JWTs with asymmetric keys (EdDSA/Ed25519). The backend verifies using the public key fetched from `/api/auth/jwks`. No BETTER_AUTH_SECRET sharing needed — this is more secure than HMAC shared secrets.

2. **Short-lived JWTs (15 min) + long-lived sessions (7 days)**: JWTs expire quickly to limit token theft risk. The session cookie (managed by Better Auth) lasts 7 days. The frontend transparently fetches new JWTs using the active session.

3. **Schema migration**: The existing User table from 004 is modified (add columns, remove hashed_password). Better Auth owns user/account/session tables. The Task table's user_id FK remains valid.

4. **Password hashing**: Scrypt (Better Auth default, built into Node.js). No additional dependencies needed.

5. **Health check stays public**: The `/health` endpoint does not require authentication, allowing monitoring tools to function.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Schema migration (modify User table from 004) | Better Auth requires specific schema with password in `account` table | Keeping hashed_password in User table is incompatible with Better Auth's multi-provider architecture |
| 5 new/modified tables for auth | Better Auth requires account, session, verification, jwks tables | Minimum tables for the library to function; cannot reduce without abandoning Better Auth |
