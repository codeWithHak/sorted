# Research: 005-auth Authentication

**Date**: 2026-02-06
**Feature**: 005-auth
**Status**: Complete

## Research Topics

### 1. Better Auth JWT Integration Pattern

**Decision**: Use Better Auth with JWT plugin using JWKS-based asymmetric key verification (not shared secret).

**Rationale**: The research reveals that Better Auth's JWT plugin uses **asymmetric key pairs** (not the shared BETTER_AUTH_SECRET) for JWT signing. The private key is stored encrypted in a `jwks` database table, and the public key is exposed via a standard JWKS endpoint (`/api/auth/jwks`). This means the FastAPI backend verifies tokens by fetching the public key from the JWKS endpoint — no shared secret needs to be passed to Python.

**Alternatives considered**:
- Shared secret (HMAC-SHA256) for JWT: Not how Better Auth works. BETTER_AUTH_SECRET is used for session cookies and encryption, not JWT signing.
- Session-only auth without JWT: Would require the backend to call the frontend to verify sessions on every request — poor architecture.

**Key finding**: BETTER_AUTH_SECRET is needed only by the Next.js frontend. The FastAPI backend needs the JWKS URL instead. This is a deviation from the original user description which assumed a shared secret model, but it's the correct architectural pattern for Better Auth.

### 2. Database Schema Compatibility

**Decision**: Migrate the existing User table to match Better Auth's expected schema. Add three new tables (account, session, verification) plus one JWT plugin table (jwks).

**Rationale**: Better Auth requires a specific schema with 4 core tables. Our existing User table (id, email, hashed_password, created_at) is partially compatible but needs modifications:
- Add columns: `name` (string, required), `email_verified` (boolean), `image` (string, nullable), `updated_at` (timestamp)
- Remove column: `hashed_password` (Better Auth stores passwords in the `account` table)
- New tables: `account`, `session`, `verification`, `jwks`

**Alternatives considered**:
- Keep existing schema and configure Better Auth around it: Not feasible — Better Auth stores passwords in the `account` table, not the `user` table. This is fundamental to how it supports multiple auth providers.
- Use a different auth library that matches our schema: Would violate the constitution's tech stack mandate (Better Auth is specified).

### 3. Password Hashing Algorithm

**Decision**: Use Better Auth's default scrypt algorithm.

**Rationale**: Better Auth uses scrypt by default, which is built into Node.js and requires no additional dependencies. While the existing data model mentions `hashed_password`, no users have been created yet (this is the first auth feature). Scrypt is industry-standard and recommended by OWASP alongside bcrypt and Argon2.

**Alternatives considered**:
- bcrypt: Requires an additional npm dependency. No existing passwords to migrate, so no compatibility concern.
- Argon2: Excellent but requires native bindings. Unnecessary complexity for Phase II.

### 4. JWT Token Flow

**Decision**: Use `authClient.token()` on the frontend to fetch JWT, attach as Bearer token to FastAPI requests. FastAPI verifies via JWKS endpoint.

**Rationale**: Better Auth's JWT plugin provides a `token()` method on the client that returns a signed JWT. The default algorithm is EdDSA (Ed25519). The FastAPI backend fetches the public key from `/api/auth/jwks` and verifies the signature and claims.

**Token configuration**:
- Algorithm: EdDSA (Ed25519) — default, most secure option
- Expiry: 15 minutes (JWT best practice; session handles refresh)
- Payload: user id and email (custom via `definePayload`)

**Key insight**: JWT expiry should be short (15 min), not 7 days as originally specified. The Better Auth session (stored in cookies, 7-day expiry) handles the "remember me" functionality. When the JWT expires, the frontend fetches a new one using the still-valid session. This is industry best practice — short-lived JWTs with session-based refresh.

### 5. FastAPI JWT Verification

**Decision**: Use the `PyJWT` library with `PyJWKClient` to verify tokens via JWKS endpoint.

**Rationale**: PyJWT is the standard Python JWT library. Its `PyJWKClient` class can fetch and cache JWKS keys from the Better Auth endpoint. This approach is stateless, standard, and well-documented.

**Dependencies needed**:
- `PyJWT[crypto]>=2.8.0` (includes cryptography backend for EdDSA support)

### 6. CORS Configuration

**Decision**: Configure FastAPI CORS middleware to allow the Next.js frontend origin.

**Rationale**: Frontend (localhost:3000) and backend (localhost:8000) run on different ports. FastAPI's built-in CORSMiddleware handles this.

**Configuration**:
- Allow origins: `http://localhost:3000` (dev), configurable via environment variable for production
- Allow credentials: true (for cookie-based requests if needed)
- Allow methods: GET, POST, PUT, DELETE, PATCH
- Allow headers: Authorization, Content-Type

### 7. Next.js App Router Integration

**Decision**: Use Better Auth's built-in Next.js integration with catch-all API route handler.

**Rationale**: Better Auth provides `toNextJsHandler()` that creates GET and POST handlers for a catch-all route at `/api/auth/[...all]/route.ts`. This handles all auth endpoints (sign-up, sign-in, sign-out, session, JWKS, etc.) automatically.

**Key patterns**:
- Server-side session check: `auth.api.getSession({ headers: await headers() })`
- Client-side auth: `createAuthClient()` with React hooks
- Route protection: Next.js middleware or layout-level session checks

### 8. Database Adapter for Neon PostgreSQL

**Decision**: Use Better Auth's `pg` adapter with the existing Neon connection string.

**Rationale**: Better Auth supports PostgreSQL directly via the `pg` package. The Next.js frontend will maintain its own database connection to Neon for auth operations, separate from the FastAPI backend's asyncpg connection.

**Dependencies needed (frontend)**:
- `better-auth` (core library)
- `pg` (PostgreSQL client for Node.js)

**Schema migration**: Use `npx @better-auth/cli generate` to generate SQL migration files, then apply to Neon.
