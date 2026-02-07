# Data Model: Task CRUD API

**Feature**: 006-task-crud-api | **Date**: 2026-02-07

## Entities

### Task (existing — requires modification)

Represents a todo item owned by a single user.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, auto-generated (uuid4) | Server-generated, immutable |
| title | string | NOT NULL, max 200 chars, min 1 char | Required on create |
| description | string | nullable, max 2000 chars | Optional |
| completed | boolean | NOT NULL, default false | Toggle via update |
| is_deleted | boolean | NOT NULL, default false, indexed | Soft delete flag — internal only, never exposed in API |
| user_id | UUID | NOT NULL, FK → users.id | Ownership — internal only, never exposed in API |
| created_at | datetime | NOT NULL, auto-set on create | Immutable after creation |
| updated_at | datetime | NOT NULL, auto-set on create/update | **NEW FIELD** — set on every mutation |

**Relationships**:
- `Task.user_id` → `User.id` (many-to-one, cascading via FK constraint)

**State Transitions**:
- `completed`: false → true → false (togglable via PATCH)
- `is_deleted`: false → true (one-way; no undelete endpoint in scope)

### Modification Required

The existing Task model (`services/api/src/api/models/task.py`) is missing the `updated_at` field. This must be added to match the User model pattern.

## Validation Rules (from spec)

| Field | Create | Update |
|-------|--------|--------|
| title | required, 1–200 chars | optional, 1–200 chars if provided |
| description | optional, max 2000 chars | optional, max 2000 chars if provided |
| completed | not accepted (defaults to false) | optional boolean |

## Query Invariants

Every query against the `tasks` table MUST include:
1. `WHERE user_id = :authenticated_user_id` — user isolation
2. `WHERE is_deleted = false` — soft delete exclusion

These two conditions are combined in all operations (list, get, update, delete).

## Indexes

| Column(s) | Type | Purpose |
|-----------|------|---------|
| id | PK (unique, btree) | Primary key lookup |
| is_deleted | btree | Filter soft-deleted tasks |
| user_id | FK (no auto-index in PostgreSQL) | User isolation queries — consider adding explicit index |
| created_at | none currently | Sort order for list — consider adding if performance requires |

**Note**: PostgreSQL does not automatically create indexes on FK columns. For this feature's query patterns (`WHERE user_id = X AND is_deleted = false ORDER BY created_at DESC`), a composite index on `(user_id, is_deleted, created_at)` would be optimal but is not required at current scale.
