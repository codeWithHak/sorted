---
id: 0005
title: Research Better Auth Imports and API Surface
stage: misc
date: 2026-02-07
surface: agent
model: claude-opus-4-6
feature: 005-auth
branch: 004-database-setup
user: hak
command: research
labels: ["better-auth", "imports", "jwt", "next.js", "api-surface", "configuration"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - history/prompts/005-auth/0005-research-better-auth-imports-api.misc.prompt.md
tests:
  - none (research task)
---

## Prompt

Research the latest Better Auth library (better-auth npm package) and answer these specific questions:

1. What is the correct import path for creating a Better Auth server instance? (e.g., `import { betterAuth } from "better-auth"` or something else?)
2. What is the import path for the JWT plugin? (e.g., `import { jwt } from "better-auth/plugins/jwt"` or `import { jwt } from "better-auth/plugins"`)
3. What is the correct import for creating the auth client? (e.g., `import { createAuthClient } from "better-auth/react"` or `"better-auth/client"`)
4. What is the JWT client plugin import? (e.g., `import { jwtClient } from "better-auth/client/plugins"`)
5. What does the `toNextJsHandler` function look like for creating the catch-all route.ts? What's the import path?
6. What does the auth.ts server configuration look like with the JWT plugin, email/password provider, and pg database adapter? Show the complete config.
7. What does the auth-client.ts look like with the jwtClient plugin?
8. How does the `authClient.token()` work? What method name is it exactly? Is it `authClient.$fetch` or `authClient.token` or something else?
9. What does the `getSession` server-side call look like for route protection in Next.js App Router?
10. Does the pg adapter need the `pg` package or `@neondatabase/serverless`?
11. What's the proper way to configure JWT expiry and payload in Better Auth?

Use web search and the Better Auth docs site (https://www.better-auth.com) to find accurate, current information. Do NOT guess - verify from docs or source.

## Response snapshot

All 11 questions answered with verified imports and code examples from Better Auth documentation:

1. `import { betterAuth } from "better-auth"` - correct
2. `import { jwt } from "better-auth/plugins"` - all server plugins from this path
3. `import { createAuthClient } from "better-auth/react"` for React/Next.js; `"better-auth/client"` for vanilla
4. `import { jwtClient } from "better-auth/client/plugins"` - all client plugins from this path
5. `import { toNextJsHandler } from "better-auth/next-js"` at `app/api/auth/[...all]/route.ts`
6. Full config with Pool from "pg", emailAndPassword: { enabled: true }, jwt() plugin with definePayload, nextCookies()
7. createAuthClient with jwtClient() in plugins array
8. Exactly `authClient.token()` - returns `{ data: { token: "ey..." }, error }`
9. `auth.api.getSession({ headers: await headers() })` using next/headers
10. Official docs show `pg` package; `@neondatabase/serverless` has known issues with drizzle (resolved in drizzle-orm 0.40.1+); safest to use `pg` with Neon pooled connection string
11. Configure via `jwt({ jwt: { expirationTime: "15m", definePayload: ({user}) => ({...}), issuer, audience } })`

## Outcome

- Impact: Verified all Better Auth import paths and API surface for 005-auth implementation
- Tests: none (research task)
- Files: PHR created
- Next prompts: Begin implementation of auth feature using verified imports and configuration
- Reflection: Key discovery that emailAndPassword is a top-level config option not a plugin. The pg package with Neon pooled connection strings is the safest database approach. The nextCookies() plugin from "better-auth/next-js" is important for server action cookie handling.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A (research task)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Implement auth files using these verified imports
