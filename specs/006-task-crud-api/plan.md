# Implementation Plan: Task CRUD API with User Isolation

**Branch**: `006-task-crud-api` | **Date**: 2026-02-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-task-crud-api/spec.md`

## Summary

Deliver five RESTful endpoints (POST, GET list, GET single, PATCH, DELETE) for task management on the existing FastAPI backend. Every query is scoped to the authenticated user via the existing `get_current_user` JWT dependency. The Task SQLModel entity already exists with `user_id` FK and `is_deleted` soft-delete flag. This feature adds an `updated_at` field to the Task model, creates Pydantic request/response schemas, introduces the `APIRouter` pattern, and wires endpoints into the application.

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**: FastAPI >=0.115.0, SQLModel >=0.0.22, SQLAlchemy[asyncio] >=2.0.35, asyncpg >=0.30.0, pydantic-settings >=2.6.0, PyJWT[crypto] >=2.8.0
**Storage**: Neon Serverless PostgreSQL (existing, via asyncpg)
**Testing**: pytest + pytest-asyncio + httpx (new dev dependencies)
**Target Platform**: Linux server (WSL2 dev environment)
**Project Type**: Web (monorepo — `apps/web/` frontend, `services/api/` backend)
**Performance Goals**: <200ms p95 for single-resource ops, <500ms for paginated list
**Constraints**: All I/O async; user isolation at query level; soft delete only
**Scale/Scope**: Single-user task lists (no shared tasks); Phase II scope

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Evidence |
|------|--------|----------|
| Readability Over Cleverness | PASS | Straightforward CRUD with no clever abstractions; private helper `_get_user_task` for DRY without over-abstraction |
| Async-First Design | PASS | All endpoints use `async def`; database queries via `AsyncSession`; no blocking I/O |
| Security by Default | PASS | JWT auth on every endpoint via `get_current_user`; user isolation via `WHERE user_id =`; 404 for foreign tasks (no info leakage); Pydantic validation at boundary |
| Phase-Based Evolution | PASS | Phase II feature only; no Phase III+ concerns (no AI, no K8s) |
| Spec-Driven Development | PASS | Spec exists at `specs/006-task-crud-api/spec.md` with 13 FRs and 5 user stories |
| Performance (200ms/500ms) | PASS | Simple indexed queries; offset pagination; no N+1 issues |
| Testing | PASS | pytest + httpx test suite planned; unit + integration coverage |

No violations. No complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/006-task-crud-api/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI)
│   └── tasks-api.yaml
└── tasks.md             # Phase 2 output (/sp.tasks)
```

### Source Code (repository root)

```text
services/api/
├── src/api/
│   ├── main.py                    # MODIFY: register tasks_router
│   ├── config.py                  # existing (no changes)
│   ├── database.py                # existing (no changes)
│   ├── auth/
│   │   ├── __init__.py            # existing (exports get_current_user, TokenPayload)
│   │   ├── jwt.py                 # existing (TokenPayload.sub is str)
│   │   └── dependencies.py        # existing (get_current_user dependency)
│   ├── models/
│   │   ├── __init__.py            # existing (exports Task, User)
│   │   ├── task.py                # MODIFY: add updated_at field
│   │   └── user.py                # existing (no changes)
│   ├── schemas/                   # NEW directory
│   │   ├── __init__.py            # NEW: exports task schemas
│   │   └── task.py                # NEW: TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
│   └── routers/                   # NEW directory
│       ├── __init__.py            # NEW: exports tasks router
│       └── tasks.py               # NEW: 5 CRUD endpoints + _get_user_task helper
├── tests/                         # NEW directory
│   ├── __init__.py                # NEW
│   ├── conftest.py                # NEW: fixtures (async session, auth mock, client)
│   └── test_tasks.py              # NEW: endpoint tests
└── pyproject.toml                 # MODIFY: add dev dependencies
```

**Structure Decision**: Backend-only feature within existing `services/api/` monorepo layout. New `schemas/` and `routers/` directories establish patterns for future features. No frontend changes.

## Key Implementation Details

### 1. Model Change: Add `updated_at` to Task

The Task model (`services/api/src/api/models/task.py:53`) currently has `created_at` but no `updated_at`. Add it following the User model pattern (`services/api/src/api/models/user.py:47`):

```python
updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
```

**Migration note**: `create_tables()` uses `CREATE TABLE IF NOT EXISTS` which won't add columns to existing tables. Since this is dev (no prod data), the `tasks` table must be dropped and recreated, or manually altered via `ALTER TABLE tasks ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT NOW()`.

### 2. Pydantic Schemas (separate from SQLModel)

- `TaskCreate(BaseModel)`: `title` (str, min=1, max=200), `description` (str|None, max=2000)
- `TaskUpdate(BaseModel)`: all optional — `title`, `description`, `completed`
- `TaskResponse(BaseModel)`: `id`, `title`, `description`, `completed`, `created_at`, `updated_at` — omits `user_id`, `is_deleted` — uses `from_attributes=True`
- `TaskListResponse(BaseModel)`: `data` (list[TaskResponse]), `total`, `page`, `per_page`, `total_pages`

### 3. Router Pattern

New `APIRouter(prefix="/tasks", tags=["tasks"])` in `routers/tasks.py`, registered in `main.py` via `app.include_router(tasks_router)`.

### 4. User Isolation Helper

Private `_get_user_task(session, task_id, user_id)` used by GET single, PATCH, DELETE:
- `WHERE id = :id AND user_id = :uid AND is_deleted = False`
- Returns 404 for not-found AND wrong-owner (prevents existence leakage)

### 5. UUID Type Conversion

`TokenPayload.sub` is `str` (from JWT). `Task.user_id` is `uuid.UUID`. Convert with `uuid.UUID(current_user.sub)` in all queries.

### 6. Pagination

Offset-based: `page` (default 1, min 1), `per_page` (default 20, min 1, max 100). Default sort: `created_at DESC`. Response includes `total_pages = ceil(total / per_page)`.

### 7. Test Infrastructure

Add dev dependencies to `pyproject.toml`: `pytest>=8.0`, `pytest-asyncio>=0.24`, `httpx>=0.27`, `aiosqlite>=0.20`. Tests use in-memory SQLite via `aiosqlite` for speed, with auth dependency overridden to return a fixed `TokenPayload`.

## Existing Code to Reuse

| What | Location | Usage |
|------|----------|-------|
| `get_current_user` dependency | `services/api/src/api/auth/dependencies.py:17` | Inject into all 5 endpoints |
| `TokenPayload` dataclass | `services/api/src/api/auth/jwt.py:35` | Type annotation for user identity |
| `get_session` dependency | `services/api/src/api/database.py:92` | Inject into all 5 endpoints |
| `Task` SQLModel | `services/api/src/api/models/task.py:19` | ORM entity for all queries |
| `lifespan` context manager | `services/api/src/api/database.py:141` | Already imports Task/User models |
