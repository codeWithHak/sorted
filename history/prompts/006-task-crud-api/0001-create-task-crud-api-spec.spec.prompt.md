---
id: "0001"
title: "Create Task CRUD API Spec"
stage: spec
date: 2026-02-07
surface: agent
model: claude-opus-4-6
feature: 006-task-crud-api
branch: 006-task-crud-api
user: hak
command: /sp.specify
labels: ["task-crud", "api", "user-isolation", "spec"]
links:
  spec: specs/006-task-crud-api/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/006-task-crud-api/spec.md
  - specs/006-task-crud-api/checklists/requirements.md
tests:
  - none
---

## Prompt

/sp.specify 006-task-crud-api This feature introduces the core task management API — five RESTful endpoints on the FastAPI backend that let authenticated users create, list, retrieve, update, and soft-delete their tasks. It combines what was originally scoped as separate CRUD and user-isolation features because isolation is not an add-on; every query is inherently scoped to the authenticated user's identity extracted from the JWT Bearer token via the existing get_current_user dependency. The Task SQLModel entity, its user_id foreign key to the users table, and the is_deleted soft-delete flag already exist; this feature wires them into live endpoints behind a new APIRouter module and adds an updated_at timestamp field to the Task model.

A user authenticates through Better Auth on the Next.js frontend, receives a JWT, and includes it as a Bearer token on every API call. POST /tasks accepts a title (required, 1–200 characters) and an optional description (up to 2,000 characters), returns the created task with status 201. GET /tasks returns a paginated list of the user's non-deleted tasks, accepting page (default 1, minimum 1), per_page (default 20, minimum 1, maximum 100), and an optional completed boolean filter; the response wraps the task array in an envelope containing total, page, per_page, and total_pages, ordered by created_at descending. GET /tasks/{task_id} returns a single task by UUID. PATCH /tasks/{task_id} performs a partial update — any combination of title, description, and completed — and sets updated_at on mutation. DELETE /tasks/{task_id} sets is_deleted to true and returns 204 with no body. In every case, attempting to access a task that does not exist or belongs to another user produces a 404 with {"detail": "Task not found"}; the API never returns 403 for ownership mismatches to avoid leaking task existence. Soft-deleted tasks are excluded from all query results and are treated as nonexistent. Out of scope: hard-delete or purge endpoints, bulk operations, sorting options beyond the default, search or full-text queries, tags, priorities, due dates, and any frontend integration.

Request and response validation uses dedicated Pydantic schemas separate from the SQLModel entity. The response schema exposes id, title, description, completed, created_at, and updated_at but omits user_id and is_deleted as internal-only fields. The TokenPayload.sub field is a string and must be converted to uuid.UUID before use in queries against the user_id column. All database I/O is async using the existing get_session dependency and SQLAlchemy async select statements. Endpoints must respond within 200 ms for single-resource operations and 500 ms for paginated list queries. The router is registered on the FastAPI app via include_router with a /tasks prefix, establishing the module pattern for all future route groups.

Acceptance criteria: all five endpoints return correct status codes and response shapes; creating a task with an empty or over-length title returns 422; listing tasks for a user with no tasks returns an empty data array with total of 0; pagination with 25 tasks and per_page=10 returns three pages with the final page containing five items; a user cannot retrieve, update, or delete another user's task (404 returned); deleting a task is idempotent only on first call (second DELETE returns 404); the completed filter correctly partitions results; soft-deleted tasks never appear in list or get responses; every mutation sets updated_at to the current time; and all endpoints return 401 when called without a valid JWT.

## Response snapshot

Created feature branch `006-task-crud-api` from main. Wrote comprehensive spec with 5 user stories (Create P1, List P1, View P2, Update P2, Delete P3), 13 functional requirements, 5 edge cases, 7 success criteria, and clear out-of-scope boundaries. Quality checklist passed all 16 validation items with no clarification markers needed.

## Outcome

- Impact: Feature spec created — establishes contract for Task CRUD API with user isolation baked in
- Tests: none (spec phase)
- Files: spec.md, checklists/requirements.md
- Next prompts: /sp.clarify or /sp.plan
- Reflection: User description was thorough enough to avoid all clarification markers; combined 006+007 into single feature

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): Quality checklist 16/16 PASS
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
