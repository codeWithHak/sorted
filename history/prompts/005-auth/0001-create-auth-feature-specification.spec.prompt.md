---
id: "0001"
title: "Create Auth Feature Specification"
stage: spec
date: 2026-02-06
surface: agent
model: claude-opus-4-6
feature: 005-auth
branch: 005-auth
user: hak
command: /sp.specify
labels: ["authentication", "spec", "phase-2"]
links:
  spec: specs/005-auth/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/005-auth/spec.md
  - specs/005-auth/checklists/requirements.md
tests:
  - null
---

## Prompt

/sp.specify 005-auth This feature introduces email-and-password authentication to the sorted todo application, bridging the Next.js frontend and FastAPI backend so that every API request is tied to a verified user identity. Better Auth (with its JWT plugin) runs on the Next.js side and owns signup, signin, sign-out, and token issuance; the FastAPI backend never manages sessions directly but instead verifies the JWT on every inbound request using a shared secret (BETTER_AUTH_SECRET) configured identically in both services. The User table already exists in Neon PostgreSQL (id UUID, email unique, hashed_password, created_at) from the 004-database-setup feature, so this feature wires authentication logic on top of that existing schema without altering its structure.

A new visitor navigates to the signup page, enters an email and a password of at least eight characters, and submits. Better Auth creates the user record (hashing the password), issues a JWT containing the user's id and email with a seven-day expiry, and redirects the visitor to the task dashboard. A returning user follows the same flow on the signin page; on success a JWT is issued identically. On failure the frontend displays a generic "Invalid email or password" message regardless of whether the email exists, preventing account enumeration. Sign-out clears the token and session on the frontend and redirects to the signin page. If an unauthenticated visitor tries to access any protected route, the frontend redirects them to signin and, after successful authentication, returns them to the originally requested page. Scope is strictly email-and-password: no email verification, no password reset, no OAuth or social providers, no multi-factor authentication, no rate limiting on auth endpoints, and no account deletion or profile management.

On the backend, a middleware layer runs before every protected endpoint. It reads the Authorization: Bearer header, verifies the JWT signature against BETTER_AUTH_SECRET, checks expiry, and extracts the user's id and email into the request context. Requests with a missing, expired, or tampered token receive a 401 Unauthorized response with a JSON body indicating the reason (missing token, expired token, or invalid token) without leaking internal details. The backend must refuse to start if BETTER_AUTH_SECRET is not set, failing fast with a clear configuration error. The frontend API client must attach the Bearer token to every request automatically. CORS must be configured to allow the frontend origin (localhost:3000 in development) to reach the backend (localhost:8000). Both services read BETTER_AUTH_SECRET from environment variables exclusively; it is never hardcoded or logged.

Acceptance is met when: signup and signin each complete in under thirty seconds end-to-end; one hundred percent of requests without a valid token are rejected with 401; one hundred percent of requests with a valid token correctly resolve the user identity; sign-out renders subsequent requests unauthorized; protected pages redirect unauthenticated visitors within one second; the backend refuses to start without BETTER_AUTH_SECRET; and error messages on signin never reveal whether a given email is registered.

## Response snapshot

Created technology-agnostic feature specification for 005-auth. The spec covers 5 user stories (3x P1: signup, signin, credential verification; 2x P2: sign-out, route protection), 19 functional requirements, 5 security requirements, 8 measurable success criteria, 6 edge cases, and clear out-of-scope boundaries. Spec uses abstract language ("credentials" instead of "JWT", "shared secret" instead of "BETTER_AUTH_SECRET") to remain implementation-agnostic. Validation checklist created with all items passing. No [NEEDS CLARIFICATION] markers — the user description was comprehensive.

## Outcome

- ✅ Impact: Feature specification created; ready for planning phase
- 🧪 Tests: No tests (spec phase)
- 📁 Files: specs/005-auth/spec.md, specs/005-auth/checklists/requirements.md
- 🔁 Next prompts: /sp.clarify or /sp.plan 005-auth
- 🧠 Reflection: User description was highly detailed, covering all flows, edge cases, and constraints. No clarifications needed.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Quality checklist — PASS (all 16 items)
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
