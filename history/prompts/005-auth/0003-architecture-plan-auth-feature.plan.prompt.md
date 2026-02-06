---
id: "0003"
title: "Architecture Plan Auth Feature"
stage: plan
date: 2026-02-06
surface: agent
model: claude-opus-4-6
feature: 005-auth
branch: 005-auth
user: hak
command: /sp.plan
labels: ["authentication", "plan", "phase-2", "better-auth", "jwt"]
links:
  spec: specs/005-auth/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/005-auth/plan.md
  - specs/005-auth/research.md
  - specs/005-auth/data-model.md
  - specs/005-auth/quickstart.md
  - specs/005-auth/contracts/auth-api.md
tests:
  - null
---

## Prompt

/sp.plan (no arguments — run against current feature 005-auth spec)

## Response snapshot

Generated complete implementation plan for 005-auth feature. Key architectural decisions: (1) JWKS-based asymmetric JWT verification instead of shared secret — Better Auth uses EdDSA key pairs, not BETTER_AUTH_SECRET for JWT signing; (2) Short-lived JWTs (15 min) with long-lived sessions (7 days); (3) Schema migration from 004 — add name/emailVerified/image/updatedAt to User, remove hashed_password, add account/session/verification/jwks tables; (4) Scrypt password hashing (Better Auth default); (5) Health check stays public. Research covered Better Auth JWT plugin, database schema, password hashing, token flow, CORS, Next.js integration, and Neon adapter. All constitution gates pass.

## Outcome

- ✅ Impact: Complete architecture plan with research, data model, API contracts, quickstart guide
- 🧪 Tests: No tests (plan phase)
- 📁 Files: plan.md, research.md, data-model.md, quickstart.md, contracts/auth-api.md
- 🔁 Next prompts: /sp.tasks 005-auth
- 🧠 Reflection: Major finding — Better Auth uses JWKS (asymmetric keys) not shared secrets for JWT. This is more secure but differs from original user description. Schema migration from 004 is unavoidable.

## Evaluation notes (flywheel)

- Failure modes observed: Original user description assumed shared secret (BETTER_AUTH_SECRET) for JWT signing, but Better Auth actually uses JWKS asymmetric keys. Research corrected this.
- Graders run and results (PASS/FAIL): Constitution check — PASS (all 5 principles)
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
