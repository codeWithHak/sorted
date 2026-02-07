# Tasks: Task CRUD API with User Isolation

**Input**: Design documents from `/specs/006-task-crud-api/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/tasks-api.yaml

**Tests**: Included — constitution mandates testing (unit + integration), plan includes test infrastructure, and spec provides detailed acceptance scenarios.

**Organization**: Tasks grouped by user story. Each story adds one endpoint to `services/api/src/api/routers/tasks.py`.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)
- All paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add dependencies, modify Task model, create schemas and router scaffolding

- [x] T001 Add test dev dependencies (pytest>=8.0, pytest-asyncio>=0.24, httpx>=0.27, aiosqlite>=0.20) to `services/api/pyproject.toml` and run `uv sync`
- [x] T002 Add `updated_at` field to Task model in `services/api/src/api/models/task.py` — follow User model pattern (`Field(default_factory=datetime.utcnow, nullable=False)`). Handle existing `tasks` table by adding `ALTER TABLE tasks ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT NOW()` or dropping/recreating the table (dev only, no prod data)
- [x] T003 [P] Create `services/api/src/api/schemas/__init__.py` and `services/api/src/api/schemas/task.py` with four Pydantic schemas: `TaskCreate` (title: str min=1 max=200, description: str|None max=2000), `TaskUpdate` (all optional: title, description, completed), `TaskResponse` (id, title, description, completed, created_at, updated_at — from_attributes=True — omits user_id and is_deleted), `TaskListResponse` (data: list[TaskResponse], total, page, per_page, total_pages). See contracts/tasks-api.yaml for exact shapes
- [x] T004 [P] Create `services/api/src/api/routers/__init__.py` (empty module init)

**Checkpoint**: Dependencies installed, Task model has `updated_at`, schemas and router module structure ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Router scaffolding, test infrastructure, and main.py registration

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create `services/api/src/api/routers/tasks.py` with `router = APIRouter(prefix="/tasks", tags=["tasks"])` and the private `_get_user_task(session: AsyncSession, task_id: uuid.UUID, user_id: str) -> Task` helper that queries `WHERE id = :id AND user_id = uuid.UUID(user_id) AND is_deleted == False` and raises `HTTPException(404, detail="Task not found")` if not found. Import `get_current_user`, `TokenPayload`, `get_session`, `Task`, and all schemas. Register router in `services/api/src/api/main.py` via `app.include_router(tasks_router)`
- [x] T006 [P] Create test infrastructure: `services/api/tests/__init__.py`, `services/api/tests/conftest.py` with fixtures — async SQLite engine via `aiosqlite` (in-memory), `create_all` for table setup, `async_session` fixture yielding `AsyncSession`, `auth_user` fixture overriding `get_current_user` to return `TokenPayload(sub="11111111-1111-1111-1111-111111111111", email="test@example.com")`, `other_user` fixture returning `TokenPayload(sub="22222222-2222-2222-2222-222222222222", email="other@example.com")`, `client` fixture using `httpx.AsyncClient` with `ASGITransport(app=app)`. Ensure `app.dependency_overrides[get_current_user]` is set per fixture. Create empty `services/api/tests/test_tasks.py`

**Checkpoint**: Foundation ready — router registered, test client functional, user story implementation can begin

---

## Phase 3: User Story 1 — Create a Task (Priority: P1) MVP

**Goal**: Authenticated users can create tasks with title and optional description

**Independent Test**: POST to `/tasks` with valid JWT returns 201 with task object containing id, title, completed=false, created_at, updated_at

### Implementation for User Story 1

- [x] T007 [US1] Implement `POST /tasks` endpoint in `services/api/src/api/routers/tasks.py` — accepts `TaskCreate` body, creates `Task(title=body.title, description=body.description, user_id=uuid.UUID(current_user.sub))`, commits, refreshes, returns `TaskResponse.model_validate(task)` with `status_code=201`. Uses `Depends(get_current_user)` and `Depends(get_session)`

### Tests for User Story 1

- [x] T008 [US1] Write create task tests in `services/api/tests/test_tasks.py` — test cases: (1) create with title only → 201, returns id/title/completed=false/created_at/updated_at; (2) create with title + description → 201, both fields present; (3) empty title → 422; (4) title > 200 chars → 422; (5) description > 2000 chars → 422; (6) no auth token → 401; (7) response omits user_id and is_deleted

**Checkpoint**: User Story 1 complete — task creation works independently

---

## Phase 4: User Story 2 — List My Tasks (Priority: P1)

**Goal**: Authenticated users retrieve a paginated, filterable list of their own non-deleted tasks

**Independent Test**: Create several tasks, GET `/tasks` returns paginated envelope with correct total, page metadata, and only the authenticated user's tasks

### Implementation for User Story 2

- [x] T009 [US2] Implement `GET /tasks` endpoint in `services/api/src/api/routers/tasks.py` — query params: `page: int = Query(default=1, ge=1)`, `per_page: int = Query(default=20, ge=1, le=100)`, `completed: bool | None = Query(default=None)`. Build base query `select(Task).where(Task.user_id == uuid.UUID(current_user.sub), Task.is_deleted == False)`. If `completed` is not None, add `.where(Task.completed == completed)`. Count total via `select(func.count()).select_from(subquery)`. Apply `.order_by(Task.created_at.desc()).offset((page - 1) * per_page).limit(per_page)`. Compute `total_pages = math.ceil(total / per_page) if total > 0 else 0`. Return `TaskListResponse`

### Tests for User Story 2

- [x] T010 [US2] Write list tasks tests in `services/api/tests/test_tasks.py` — test cases: (1) empty list → 200, data=[], total=0; (2) 5 tasks → returns all 5 newest-first; (3) pagination: 25 tasks, per_page=10, page=1 → 10 tasks, total=25, total_pages=3; (4) page=3 → 5 tasks; (5) completed=true filter → only completed tasks; (6) completed=false filter → only incomplete tasks; (7) soft-deleted tasks excluded; (8) user isolation: user A sees only user A's tasks, not user B's; (9) page beyond total → empty data with correct metadata

**Checkpoint**: User Stories 1 & 2 complete — users can create and list tasks

---

## Phase 5: User Story 3 — View a Single Task (Priority: P2)

**Goal**: Authenticated users retrieve full details of a single task by UUID

**Independent Test**: Create a task, GET `/tasks/{id}` returns the task; GET with another user's task returns 404

### Implementation for User Story 3

- [x] T011 [US3] Implement `GET /tasks/{task_id}` endpoint in `services/api/src/api/routers/tasks.py` — path param `task_id: uuid.UUID`, use `_get_user_task(session, task_id, current_user.sub)` to fetch, return `TaskResponse.model_validate(task)`

### Tests for User Story 3

- [x] T012 [US3] Write get task tests in `services/api/tests/test_tasks.py` — test cases: (1) get own task → 200 with all fields; (2) non-existent UUID → 404; (3) another user's task → 404 (not 403); (4) soft-deleted task → 404; (5) invalid UUID format → 422

**Checkpoint**: User Stories 1–3 complete — create, list, and view tasks

---

## Phase 6: User Story 4 — Update a Task (Priority: P2)

**Goal**: Authenticated users partially update their own tasks (title, description, completed)

**Independent Test**: Create a task, PATCH with `{"completed": true}` → 200 with completed=true, updated_at changed, other fields unchanged

### Implementation for User Story 4

- [x] T013 [US4] Implement `PATCH /tasks/{task_id}` endpoint in `services/api/src/api/routers/tasks.py` — path param `task_id: uuid.UUID`, body `TaskUpdate`. Use `_get_user_task` to fetch. Extract set fields via `body.model_dump(exclude_unset=True)`. If non-empty, apply with `setattr(task, key, value)` for each field, set `task.updated_at = datetime.utcnow()`, commit and refresh. Return `TaskResponse.model_validate(task)`

### Tests for User Story 4

- [x] T014 [US4] Write update task tests in `services/api/tests/test_tasks.py` — test cases: (1) update title only → 200, title changed, description/completed unchanged, updated_at changed; (2) update completed to true → 200; (3) update description only → 200; (4) update multiple fields → 200; (5) empty body (no fields set) → 200, task unchanged; (6) another user's task → 404; (7) soft-deleted task → 404; (8) empty title string → 422; (9) response omits user_id/is_deleted

**Checkpoint**: User Stories 1–4 complete — full CRUD except delete

---

## Phase 7: User Story 5 — Delete a Task (Priority: P3)

**Goal**: Authenticated users soft-delete their own tasks (set is_deleted=true, return 204)

**Independent Test**: Create a task, DELETE → 204, subsequent GET → 404, subsequent list excludes it

### Implementation for User Story 5

- [x] T015 [US5] Implement `DELETE /tasks/{task_id}` endpoint in `services/api/src/api/routers/tasks.py` — path param `task_id: uuid.UUID`. Use `_get_user_task` to fetch. Set `task.is_deleted = True`, `task.updated_at = datetime.utcnow()`, commit. Return `Response(status_code=204)`

### Tests for User Story 5

- [x] T016 [US5] Write delete task tests in `services/api/tests/test_tasks.py` — test cases: (1) delete own task → 204, no body; (2) subsequent GET → 404; (3) subsequent DELETE → 404 (already deleted); (4) deleted task excluded from list; (5) another user's task → 404; (6) non-existent task → 404

**Checkpoint**: All 5 user stories complete — full Task CRUD API with user isolation

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: End-to-end validation and final checks

- [x] T017 Run full test suite (`cd services/api && uv run pytest tests/ -v`) and verify all tests pass
- [ ] T018 Run quickstart.md manual E2E validation — start server, authenticate via Better Auth, hit all 5 endpoints with real JWT tokens, verify user isolation (create as user A, attempt access as user B → 404)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **User Stories (Phase 3–7)**: All depend on Phase 2 completion
  - US1 and US2 are both P1 but sequential (same router file)
  - US3 and US4 are both P2 but sequential (same router file)
  - US5 is P3, depends on Phase 2 only
- **Polish (Phase 8)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (Create)**: Phase 2 only — no story dependencies
- **US2 (List)**: Phase 2 only — no story dependencies (can test independently by creating tasks in test setup)
- **US3 (View)**: Phase 2 only — uses `_get_user_task` helper (defined in Phase 2)
- **US4 (Update)**: Phase 2 only — uses `_get_user_task` helper
- **US5 (Delete)**: Phase 2 only — uses `_get_user_task` helper

All stories are independently testable. No story depends on another story's implementation.

### Within Each User Story

- Implementation before tests (endpoint must exist for tests to call it)
- Each story adds to `services/api/src/api/routers/tasks.py` and `services/api/tests/test_tasks.py`

### Parallel Opportunities

- T003 and T004 can run in parallel (different directories)
- T005 and T006 can run in parallel (router vs test infrastructure)
- Within each story: implementation and tests are sequential (test needs the endpoint)
- Stories touch the same files, so they're best done sequentially in priority order

---

## Parallel Example: Setup Phase

```bash
# These can run in parallel (different files):
Task T003: "Create schemas module in services/api/src/api/schemas/"
Task T004: "Create routers __init__.py in services/api/src/api/routers/"
```

## Parallel Example: Foundational Phase

```bash
# These can run in parallel (different directories):
Task T005: "Create router with helper in services/api/src/api/routers/tasks.py"
Task T006: "Create test infrastructure in services/api/tests/"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (T001–T004)
2. Complete Phase 2: Foundational (T005–T006)
3. Complete Phase 3: US1 — Create (T007–T008)
4. Complete Phase 4: US2 — List (T009–T010)
5. **STOP and VALIDATE**: Users can create and list tasks — functional MVP
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Create) → Test → First endpoint live
3. Add US2 (List) → Test → Create + List MVP
4. Add US3 (View) → Test → Single task detail
5. Add US4 (Update) → Test → Task editing
6. Add US5 (Delete) → Test → Full CRUD
7. Polish → E2E validation → Feature complete

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- All 5 endpoints live in one file (`routers/tasks.py`) — stories are sequential
- All tests live in one file (`tests/test_tasks.py`) — test classes/functions per story
- `_get_user_task` helper in Phase 2 enables US3, US4, US5 without duplication
- `uuid.UUID(current_user.sub)` conversion needed in every endpoint (TokenPayload.sub is str)
- Commit after each completed user story for clean git history
