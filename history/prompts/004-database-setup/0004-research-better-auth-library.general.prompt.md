---
id: 0004
title: Research Better Auth Library for Next.js Integration
stage: general
date: 2026-02-06
surface: agent
model: claude-opus-4-6
feature: 004-database-setup
branch: 004-database-setup
user: hak
command: research
labels: ["better-auth", "jwt", "authentication", "next.js", "fastapi", "neon"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - history/prompts/004-database-setup/0004-research-better-auth-library.general.prompt.md
tests:
  - none (research task)
---

## Prompt

Research Better Auth library for Next.js integration. I need to understand:

1. How Better Auth's JWT plugin works - specifically for issuing JWT tokens that a separate backend (FastAPI/Python) can verify
2. Better Auth's expected database schema for users - what columns/tables does it require? (We have an existing User table with: id UUID, email unique, hashed_password, created_at)
3. How Better Auth handles the BETTER_AUTH_SECRET - is it used for JWT signing? What algorithm?
4. Better Auth client-side usage in Next.js App Router - how to get the JWT token on the client to attach to API requests
5. Better Auth's sign-up and sign-in API routes
6. Whether Better Auth can work with an external PostgreSQL database (Neon) and how to configure the database adapter

Search the web for the latest Better Auth documentation (2025-2026), specifically:
- better-auth.com documentation
- Better Auth JWT plugin docs
- Better Auth database adapters
- Better Auth Next.js integration guide

Return detailed findings with code examples where available.

## Response snapshot

Comprehensive research completed across all six areas. Key findings:

1. **JWT Plugin**: Uses asymmetric key pairs (default EdDSA/Ed25519) stored in a `jwks` database table. Exposes `/api/auth/jwks` endpoint for external verification. FastAPI can verify using PyJWT's PyJWKClient.

2. **Database Schema**: Requires 4 core tables (user, account, session, verification) plus a `jwks` table for the JWT plugin. Passwords stored in the `account` table, not the `user` table. Schema differs from our existing User table.

3. **BETTER_AUTH_SECRET**: Used for session cookie signing (HMAC-SHA256), session encryption, and encrypting the JWT private key at rest. NOT used for JWT token signing itself.

4. **Client-side JWT**: Use `authClient.token()` to fetch JWT, then attach as `Authorization: Bearer <token>` to FastAPI requests. Also available via `set-auth-jwt` response header on getSession calls.

5. **Sign-up/Sign-in**: `POST /api/auth/sign-up/email` and `POST /api/auth/sign-in/email`. Password hashing uses scrypt by default (not bcrypt). Custom hash functions supported.

6. **Neon PostgreSQL**: Fully supported via `pg` Pool with standard Neon connection string. CLI migration tools available.

## Outcome

- Impact: Research informs auth architecture decisions for Next.js + FastAPI integration
- Tests: none (research task)
- Files: PHR created
- Next prompts: Create auth feature spec incorporating Better Auth findings; decide on schema migration strategy; create ADR for auth library choice
- Reflection: Better Auth's schema is significantly different from our existing User table. The separation of passwords into the account table and the requirement for additional columns (name, emailVerified, image, updatedAt) will require schema migration planning. The JWT plugin's asymmetric key approach is well-suited for our decoupled Next.js + FastAPI architecture.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A (research task)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Use these findings to draft the 005-auth spec with concrete Better Auth configuration
