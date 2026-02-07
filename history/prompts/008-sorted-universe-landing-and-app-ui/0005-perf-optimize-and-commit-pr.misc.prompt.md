---
id: "0005"
title: "Performance optimize and commit PR"
stage: misc
date: 2026-02-08
surface: agent
model: claude-opus-4-6
feature: 008-sorted-universe-landing-and-app-ui
branch: 008-sorted-universe-landing-and-app-ui
user: hak
command: /sp.git.commit_pr
labels: ["performance", "optimistic-ui", "postgres", "commit", "pr"]
links:
  spec: specs/008-sorted-universe-landing-and-app-ui/spec.md
  ticket: null
  adr: null
  pr: https://github.com/codeWithHak/sorted/pull/5
files:
  - services/api/src/api/auth/jwt.py
  - services/api/src/api/database.py
  - services/api/src/api/models/task.py
  - services/api/src/api/routers/tasks.py
  - apps/web/src/hooks/useTasks.ts
  - apps/web/src/components/tasks/TaskCard.tsx
  - apps/web/src/components/tasks/TaskPanel.tsx
  - apps/web/src/components/tasks/TaskSection.tsx
  - apps/web/src/app/dashboard/page.tsx
tests:
  - services/api/tests/test_tasks.py (34/34 pass)
  - apps/web tsc --noEmit (clean)
---

## Prompt

User reported 10+ second delays on task CRUD operations, sometimes requiring page reload. Asked to analyze using supabase-postgres-best-practices, next-best-practices, vercel-react-best-practices, and evaluation skills. Then implement all fixes and commit with PR.

## Response snapshot

Performed full-stack performance analysis identifying 9 bottlenecks across backend (Neon cold starts, pool_pre_ping, missing indexes, dual queries, short JWKS cache) and frontend (no optimistic UI, full refetch after mutations, stale closures, hardcoded loading/error, 300ms debounce). Implemented all 9 fixes plus discovered and fixed Framer Motion variant propagation bug (new items invisible) and added delete confirmation UX. Created 2 commits (feature UI + perf fixes) and PR #5.

## Outcome

- ✅ Impact: Task operations now feel instant — optimistic UI updates immediately, backend queries optimized with composite index and window function
- 🧪 Tests: 34/34 backend tests pass, TypeScript clean
- 📁 Files: 14 files changed (4 backend, 10 frontend)
- 🔁 Next prompts: Consider adding SWR for stale-while-revalidate caching; Neon connection pooler for production
- 🧠 Reflection: Framer Motion variant propagation is a subtle bug — parent variants only trigger child animations on state transition, not when new children mount into an already-animated container. Must use explicit initial/animate on dynamically added list items.

## Evaluation notes (flywheel)

- Failure modes observed: Window function COUNT(*) OVER() returns 0 rows when page offset exceeds total — needed fallback COUNT query for edge case
- Graders run and results (PASS/FAIL): pytest PASS (34/34), tsc PASS
- Prompt variant (if applicable): null
- Next experiment: Add SWR with optimistic mutation support to replace manual useState caching
