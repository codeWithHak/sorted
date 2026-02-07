---
id: 0006
title: Research Neon pg ETIMEDOUT AggregateError
stage: misc
date: 2026-02-07
surface: agent
model: claude-opus-4-6
feature: 006-task-crud-api
branch: 006-task-crud-api
user: hak
command: research
labels: ["neon", "pg", "ETIMEDOUT", "AggregateError", "Happy Eyeballs", "SSL", "cold-start", "Node.js"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - none (research only)
tests:
  - none (research only)
---

## Prompt

Research why a Node.js `pg` Pool connecting to Neon Serverless PostgreSQL keeps getting `ETIMEDOUT` with `AggregateError` even with `connectionTimeoutMillis: 30000`.

The SSL warning is:
```
SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics
```

Key context:
- Connection string format: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`
- Using `new Pool({ connectionString, connectionTimeoutMillis: 30000 })`
- Neon free tier (auto-suspends after inactivity)
- The request only took 6.5s total, NOT 30s — suggesting the timeout config may not be taking effect or there's a different issue

Research:
1. What does Neon officially recommend for Node.js `pg` driver connections? Do they recommend `@neondatabase/serverless` instead?
2. Does the `sslmode=require` → `verify-full` aliasing cause connection failures on some environments?
3. What's the correct SSL configuration for pg + Neon?
4. Why would AggregateError ETIMEDOUT happen in only 6.5s when timeout is set to 30s?
5. Is there a known issue with pg Pool and Neon cold starts?

Search the web for "neon postgresql node pg ETIMEDOUT AggregateError" and "neon serverless postgresql node.js connection guide 2025 2026". Also check Neon's official docs at neon.tech.

Return specific, actionable recommendations with code examples.

## Response snapshot

Identified five contributing factors to the ETIMEDOUT AggregateError:

1. **Primary cause: Node.js 20+ Happy Eyeballs algorithm** -- Node's `net.connect()` uses a 250ms per-candidate timeout for dual-stack (IPv4/IPv6) connections. Neon endpoints resolve to both A and AAAA records. When IPv6 is unreachable, the IPv4 attempt is cancelled prematurely. This explains the 6.5s total (aggregate of multiple short timeouts across DNS candidates), completely bypassing `connectionTimeoutMillis`.

2. **`connectionTimeoutMillis` known limitation** -- pg#3197 (still open): the timeout does not cover the TCP/DNS layer. It applies after socket establishment, not during `net.connect()`.

3. **SSL warning is informational only** -- `sslmode=require` being treated as `verify-full` does NOT cause connection failures with Neon (their certs are valid). Fix by using `sslmode=verify-full` explicitly.

4. **Neon cold starts** compound the issue -- free tier suspends after 5min inactivity, reactivation takes 500ms-several seconds, exceeding the 250ms Happy Eyeballs window.

5. **Neon recommends `@neondatabase/serverless`** for serverless environments -- uses HTTP/fetch instead of TCP, eliminating all connection pooling and Happy Eyeballs issues.

Provided three immediate fixes: (A) increase Happy Eyeballs timeout via `NODE_OPTIONS`, (B) add retry logic with exponential backoff, (C) use `sslmode=verify-full`. Medium-term: switch to `@neondatabase/serverless` HTTP mode.

## Outcome

- Impact: Research-only, no code changes. Identified root cause and actionable fixes for Neon connection issues.
- Tests: none (research only)
- Files: none (research only)
- Next prompts: Apply Happy Eyeballs fix to Next.js config; evaluate switching Better Auth from pg to @neondatabase/serverless
- Reflection: The Happy Eyeballs algorithm issue is a non-obvious Node.js 20+ behavior that makes `connectionTimeoutMillis` appear broken. The 6.5s timeout (vs expected 30s) was the key clue pointing to a lower-level network stack issue rather than a pg driver bug.

## Evaluation notes (flywheel)

- Failure modes observed: None (research task)
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Apply `--network-family-autoselection-attempt-timeout=5000` to Next.js dev/start scripts and verify ETIMEDOUT is resolved
