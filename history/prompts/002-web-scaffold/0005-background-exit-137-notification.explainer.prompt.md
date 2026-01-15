---
id: 0005
title: Background exit 137 notification
stage: explainer
date: 2026-01-15
surface: agent
model: claude-sonnet-4-5-20250929
feature: 002-web-scaffold
branch: 002-web-scaffold
user: hak
command: task-notification
labels: [debug,processes,devserver]
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

<task-notification>
<task-id>be74574</task-id>
<output-file>/tmp/claude/-home-hak-projects-sorted/tasks/be74574.output</output-file>
<status>failed</status>
<summary>Background command "Run FastAPI dev server with src.api.main module" failed with exit code 137</summary>
</task-notification>
Read the output file to retrieve the result: /tmp/claude/-home-hak-projects-sorted/tasks/be74574.output
<task-notification>
<task-id>b7bc6d2</task-id>
<output-file>/tmp/claude/-home-hak-projects-sorted/tasks/b7bc6d2.output</output-file>
<status>failed</status>
<summary>Background command "Run Next.js dev server" failed with exit code 137</summary>
</task-notification>
Read the output file to retrieve the result: /tmp/claude/-home-hak-projects-sorted/tasks/b7bc6d2.output

## Response snapshot

Read both output files.

- `be74574.output` shows Uvicorn started successfully, served multiple 200 responses for `/health`, `/docs`, and `/openapi.json`.
- `b7bc6d2.output` shows Next.js started successfully, served `GET / 200` responses, and compiled routes.

Explained that exit code 137 typically means the process received SIGKILL (often because it was terminated externally). In this session the dev servers were intentionally stopped after validation, so the CLI surface reported them as "failed" even though they ran correctly.

## Outcome

- ✅ Impact: Clarified that the services did run successfully; the 137 status reflects termination of long-running dev servers, not an implementation failure.
- 🧪 Tests: N/A.
- 📁 Files: None modified.
- 🔁 Next prompts: If needed, re-run both servers manually to confirm behavior persists.
- 🧠 Reflection: Background task lifecycle reporting can mislead for dev servers; rely on output logs and smoke-test results.

## Evaluation notes (flywheel)

- Failure modes observed: Misleading "failed" status for long-running processes that were killed intentionally.
- Graders run and results (PASS/FAIL): N/A.
- Prompt variant (if applicable): N/A.
- Next experiment (smallest change to try): When running dev servers in background, explicitly note they will be killed after smoke tests.
