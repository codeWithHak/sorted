---
id: "0001"
title: "Create Frontend Task UI Spec"
stage: spec
date: 2026-02-07
surface: agent
model: claude-opus-4-6
feature: 007-frontend-task-ui
branch: 007-frontend-task-ui
user: hak
command: /sp.specify
labels: ["frontend", "task-ui", "specification", "dashboard"]
links:
  spec: specs/007-frontend-task-ui/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/007-frontend-task-ui/spec.md
  - specs/007-frontend-task-ui/checklists/requirements.md
tests:
  - none
---

## Prompt

007-frontend-task-ui This feature transforms the existing authenticated dashboard into a responsive task management interface, completing the Phase II web application by making all Basic Level features — create, view, update, complete, and delete tasks — accessible through the browser. The Next.js 16+ frontend already provides Better Auth signup/signin, JWT-injected API calls via apiFetch, route-protected dashboard layout, and Tailwind CSS v4 styling. The backend Task CRUD API (feature 006) is fully operational with five RESTful endpoints behind JWT bearer auth and user isolation. This feature closes the gap between that API and the end user by building the UI layer that calls it.

An authenticated user lands on the dashboard and sees their task list, ordered newest-first, with each task showing its title, completion status indicator, and a truncated description. The list is paginated (default 20 per page) with navigation controls and a filter toggle for all/active/completed tasks. From this view the user can: create a new task via an inline form or modal providing title (required, 1–200 chars) and optional description (up to 2,000 chars); toggle a task's completion status with a single click; open a task for editing to modify its title, description, or completion status; and delete a task with a confirmation step that triggers soft-delete. An empty state is shown when no tasks exist, guiding the user to create their first task. All mutations provide immediate optimistic or loading feedback and handle API errors gracefully with user-visible messages. Out of scope: drag-and-drop reordering, bulk operations, real-time sync across tabs, due dates, tags, priorities, search, and any Phase III+ features.

The UI must be fully responsive — usable on mobile (360px+), tablet, and desktop viewports. All API calls go through the existing apiFetch helper which handles JWT token injection and the Next.js proxy rewrites non-auth /api/* requests to the FastAPI backend. The frontend must handle 401 responses by redirecting to signin. Form validation mirrors the backend constraints (title min 1 / max 200 chars, description max 2,000 chars) and is enforced client-side before submission. No new backend changes are required; the frontend consumes the existing contract defined in specs/006-task-crud-api/contracts/tasks-api.yaml. The implementation uses Tailwind CSS v4 utility classes consistent with the existing codebase — no component library is introduced unless explicitly decided.

Acceptance criteria: the dashboard displays the user's tasks within 1 second of page load; creating a task shows it in the list without a full page refresh; toggling completion updates the status indicator immediately; editing a task persists changes and reflects them in the list; deleting a task removes it from the list after confirmation; pagination controls appear when tasks exceed the per-page limit; the completed/active filter correctly narrows the displayed list; all interactions work on a 360px-wide viewport; unauthenticated access redirects to signin; and API errors surface as readable messages rather than silent failures.

## Response snapshot

Generated feature specification for 007-frontend-task-ui with 6 user stories (View Task List, Create Task, Toggle Completion, Edit Task, Delete Task, Responsive Experience), 17 functional requirements, 7 edge cases, 10 measurable success criteria, and clear scope boundaries. Created quality checklist — all items pass. No clarifications needed; user description was comprehensive. Branch created and checked out.

## Outcome

- ✅ Impact: Feature spec defines the complete UI layer for Phase II task management
- 🧪 Tests: none (spec phase — no code written)
- 📁 Files: 2 created (spec.md, checklists/requirements.md)
- 🔁 Next prompts: /sp.clarify or /sp.plan
- 🧠 Reflection: User description was thorough enough to avoid all [NEEDS CLARIFICATION] markers. The spec focuses on WHAT without leaking HOW. UI pattern choice (modal vs inline) deferred to planning phase.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): quality checklist PASS (all items checked)
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
