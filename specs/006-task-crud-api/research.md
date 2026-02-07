# Research: Task CRUD API with User Isolation

**Feature**: 006-task-crud-api | **Date**: 2026-02-07

## Research Summary

No NEEDS CLARIFICATION items were identified in the Technical Context. The feature uses well-established patterns (FastAPI CRUD, SQLModel/SQLAlchemy async queries, Pydantic validation) with existing infrastructure already in place. Research focused on best practices and confirming technical decisions.

---

## R1: APIRouter Pattern for FastAPI

**Decision**: Use `APIRouter(prefix="/tasks", tags=["tasks"])` in a dedicated `routers/tasks.py` module, registered via `app.include_router()`.

**Rationale**: This is the standard FastAPI pattern for organizing endpoints by resource. The existing `main.py` has only 2 endpoints (`/health`, `/auth/me`); adding 5 more directly would create clutter. The router pattern also establishes the convention for all future features.

**Alternatives considered**:
- Keeping endpoints in `main.py` — rejected because it doesn't scale and mixes concerns
- Class-based views — rejected as non-idiomatic for FastAPI

---

## R2: Pydantic Schemas vs SQLModel for Request/Response

**Decision**: Separate Pydantic `BaseModel` schemas in `schemas/task.py`, distinct from the SQLModel entity in `models/task.py`.

**Rationale**: SQLModel entities include database-internal fields (`user_id`, `is_deleted`, relationship objects) that must not appear in API responses. Separate schemas provide clean input validation (different create vs update shapes) and output serialization (omitting internal fields). Using `from_attributes=True` allows direct construction from SQLModel instances.

**Alternatives considered**:
- Using SQLModel's built-in read models — rejected because SQLModel's class hierarchy makes it awkward to have different create/update/response shapes while excluding specific fields
- Using `response_model_exclude` on endpoints — rejected as fragile and repetitive across 5 endpoints

---

## R3: Pagination Strategy

**Decision**: Offset-based pagination with `page` and `per_page` query parameters.

**Rationale**: Task lists are per-user (small cardinality). Offset-based pagination is simpler, allows direct page jumps, and is widely understood by frontend developers. The spec explicitly calls for page-number style.

**Alternatives considered**:
- Cursor-based pagination — rejected as over-engineering for small, single-user lists; adds complexity without meaningful benefit at this scale

---

## R4: Soft Delete Query Pattern

**Decision**: Every query includes `WHERE is_deleted == False` as a base filter. The `_get_user_task` helper applies this along with `user_id` scoping for single-resource lookups.

**Rationale**: Consistent exclusion prevents soft-deleted tasks from leaking into any response. A shared helper ensures the pattern is never forgotten.

**Alternatives considered**:
- SQLAlchemy event listener to auto-filter — rejected as too clever and harder to understand/debug
- Custom query method on the model — rejected as SQLModel doesn't support custom managers well

---

## R5: Test Infrastructure

**Decision**: Use `aiosqlite` with in-memory SQLite for fast unit tests, with auth dependency override.

**Rationale**: Tests must be fast and not require external infrastructure. SQLite supports basic CRUD operations identically to PostgreSQL for this feature's needs. Auth override (`get_current_user` returns a fixed `TokenPayload`) isolates endpoint logic from JWT verification.

**Alternatives considered**:
- Test against real Neon PostgreSQL — rejected for unit tests (slow, requires network); appropriate for integration tests in a future CI pipeline
- Using `TestClient` (sync) — rejected because the app uses async endpoints and async database sessions

---

## R6: `updated_at` Column Addition

**Decision**: Add `updated_at` field to Task model; handle existing table via `ALTER TABLE` or drop/recreate in dev.

**Rationale**: `CREATE TABLE IF NOT EXISTS` (used by `create_tables()`) won't add columns to existing tables. Since there is no production data and no migration tool (Alembic), the simplest approach for dev is to drop and recreate the tasks table.

**Alternatives considered**:
- Setting up Alembic now — rejected as out of scope for this feature; worth doing as a separate infrastructure task
- Ignoring `updated_at` — rejected because the spec requires timestamp tracking on mutations (FR-008)
