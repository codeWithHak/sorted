---
id: 0006
title: How to run frontend
stage: explainer
date: 2026-01-15
surface: agent
model: claude-sonnet-4-5-20250929
feature: 002-web-scaffold
branch: 002-web-scaffold
user: hak
command: and how to run frontend?
labels: [dev,frontend,nextjs]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - None modified
tests:
  - None run
---

## Prompt

and how to run frontend?

## Response snapshot

Provided the minimal commands to install dependencies and run the Next.js dev server from `apps/web`, including setting `API_BASE_URL` and the URL to open in the browser.

## Outcome

- ✅ Impact: User can start the frontend dev server and access it at http://localhost:3000.
- 🧪 Tests: N/A.
- 📁 Files: None modified.
- 🔁 Next prompts: Optionally run API server and verify /api/health proxy.
- 🧠 Reflection: Keep instructions aligned with apps/web/README.md and the chosen env var rewrite pattern.

## Evaluation notes (flywheel)

- Failure modes observed: None.
- Graders run and results (PASS/FAIL): N/A.
- Prompt variant (if applicable): N/A.
- Next experiment (smallest change to try): N/A.
