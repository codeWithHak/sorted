---
id: "0004"
title: Implement Task CRUD API
stage: green
date: 2026-02-07
surface: agent
model: claude-opus-4-6
feature: 006-task-crud-api
branch: 005-auth
user: hak
command: /sp.implement
labels: ["crud", "fastapi", "testing", "user-isolation", "uuid"]
links:
  spec: specs/006-task-crud-api/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - services/api/src/api/models/types.py (created)
  - services/api/src/api/models/task.py (modified)
  - services/api/src/api/models/user.py (modified)
  - services/api/src/api/schemas/__init__.py (created)
  - services/api/src/api/schemas/task.py (created)
  - services/api/src/api/routers/__init__.py (created)
  - services/api/src/api/routers/tasks.py (created)
  - services/api/src/api/main.py (modified)
  - services/api/tests/__init__.py (created)
  - services/api/tests/conftest.py (created)
  - services/api/tests/test_tasks.py (created)
  - services/api/pyproject.toml (modified)
tests:
  - tests/test_tasks.py::TestCreateTask (7 tests)
  - tests/test_tasks.py::TestListTasks (7 tests)
  - tests/test_tasks.py::TestGetTask (5 tests)
  - tests/test_tasks.py::TestUpdateTask (9 tests)
  - tests/test_tasks.py::TestDeleteTask (6 tests)
---

## Prompt

/sp.implement — Execute the implementation plan for feature 006-task-crud-api (Task CRUD API with User Isolation). Process all tasks T001–T018 from tasks.md, implementing 5 REST endpoints (POST, GET list, GET single, PATCH, DELETE) with user isolation, test infrastructure, and 34 test cases.

## Response snapshot

Implemented all 5 Task CRUD endpoints with user isolation in `services/api/src/api/routers/tasks.py`. Key implementation work:

**Phase 1 (Setup):** Added test dev dependencies (pytest, pytest-asyncio, httpx, aiosqlite). Added `updated_at` field to Task model. Created Pydantic schemas (TaskCreate, TaskUpdate, TaskResponse, TaskListResponse). Created router module structure.

**Phase 2 (Foundational):** Created router with `_get_user_task` helper for user-scoped queries (returns 404 for not-found AND wrong-owner). Created test infrastructure with in-memory SQLite, auth overrides, and multi-user fixtures. Registered router in main.py.

**Phase 3–7 (User Stories 1–5):** Implemented all 5 endpoints: POST /tasks (201), GET /tasks (paginated, filterable), GET /tasks/{id}, PATCH /tasks/{id} (partial update), DELETE /tasks/{id} (soft delete, 204). Wrote 34 tests covering happy paths, validation, auth, user isolation, soft delete, and pagination.

**Critical bugs fixed:**
1. UUID/SQLite incompatibility — `PGUUID(as_uuid=True)` fails with SQLite. Created `GUID` TypeDecorator in `src/api/models/types.py` that uses native PG UUID or CHAR(32) for SQLite.
2. Multi-user test fixture conflict — `app.dependency_overrides` is global, so separate auth overrides for client/other_client clobber each other. Fixed by using header-based auth override (`X-Test-User-Id`) so each client sends its own identity.

## Outcome

- ✅ Impact: All 5 CRUD endpoints operational with user isolation. 34/34 tests passing.
- 🧪 Tests: 34 passed, 0 failed (7 create + 7 list + 5 get + 9 update + 6 delete)
- 📁 Files: 7 created, 4 modified
- 🔁 Next prompts: T018 manual E2E validation with real JWT tokens, then git commit
- 🧠 Reflection: Two cross-cutting infrastructure issues (UUID types, test fixtures) required non-trivial fixes. The GUID TypeDecorator pattern should be used for all future UUID columns. Header-based auth override is more robust than per-fixture dependency overrides for multi-user tests.

## Evaluation notes (flywheel)

- Failure modes observed: PGUUID incompatible with SQLite (3 test failures); global dependency_overrides caused 4 user isolation test failures
- Graders run and results (PASS/FAIL): pytest 34/34 PASS
- Prompt variant (if applicable): /sp.implement with context restoration after compaction
- Next experiment (smallest change to try): Pre-check database dialect compatibility in task planning phase
