# Implementation Plan: Database Setup

**Branch**: `004-database-setup` | **Date**: 2026-02-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-database-setup/spec.md`

## Summary

Establish persistent data layer for the sorted todo application by integrating Neon PostgreSQL through SQLModel with async session management. Creates User and Task models with UUID primary keys, soft-delete support, and FastAPI dependency injection for database sessions.

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**: FastAPI, SQLModel, SQLAlchemy 2.0+, asyncpg
**Storage**: Neon Serverless PostgreSQL (with connection pooling)
**Testing**: Manual verification via quickstart.md (automated tests optional)
**Target Platform**: Linux server (containerized)
**Project Type**: Web application (monorepo: apps/web + services/api)
**Performance Goals**: 100ms session acquisition, 100ms simple queries
**Constraints**: Max 5 pool connections for dev, SSL required for Neon
**Scale/Scope**: Single database, 2 tables (users, tasks)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| Readability Over Cleverness | ✅ PASS | Simple patterns, no magic |
| Async-First Design | ✅ PASS | asyncpg + async sessions |
| Security by Default | ✅ PASS | Env vars for secrets, SSL required |
| Phase-Based Evolution | ✅ PASS | Phase II feature, no premature optimization |
| Spec-Driven Development | ✅ PASS | Full spec created before plan |

**Phase II Constraints**:
- ✅ Backend: FastAPI with Python
- ✅ ORM: SQLModel for database operations
- ✅ Database: Neon Serverless PostgreSQL

## Project Structure

### Documentation (this feature)

```text
specs/004-database-setup/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Technology research and decisions
├── data-model.md        # Entity definitions and relationships
├── quickstart.md        # Developer setup guide
├── contracts/           # Schema contracts
│   └── database.openapi.yaml
└── checklists/
    └── requirements.md  # Spec quality validation
```

### Source Code (repository root)

```text
services/api/
├── src/
│   └── api/
│       ├── __init__.py
│       ├── main.py          # FastAPI app + lifespan events
│       ├── config.py        # Settings from environment (NEW)
│       ├── database.py      # Engine, session factory, dependency (NEW)
│       └── models/          # SQLModel entities (NEW)
│           ├── __init__.py
│           ├── user.py
│           └── task.py
├── .env.example             # Environment template (NEW)
└── pyproject.toml           # Updated dependencies
```

**Structure Decision**: Extends existing FastAPI scaffold at `services/api/`. New files for config, database, and models. Minimal changes to existing `main.py`.

## Key Technical Decisions

### 1. Async PostgreSQL Driver

**Decision**: asyncpg via SQLAlchemy async engine
**Rationale**: Fastest Python async driver, native SQLAlchemy support
**Alternative Rejected**: psycopg3 (less production usage)

### 2. Connection Pooling

**Decision**: Neon pooled endpoint + conservative pool sizing
**Configuration**:
```python
pool_size=5
max_overflow=10
pool_pre_ping=True
pool_recycle=3600
```
**Rationale**: Serverless cold starts require validation; small pools prevent exhaustion

### 3. UUID Primary Keys

**Decision**: Client-side UUID v4 with PostgreSQL native type
**Rationale**: No DB round-trip, privacy-preserving, distributed-friendly

### 4. Soft Delete

**Decision**: Boolean `is_deleted` field with query filtering
**Rationale**: Simple, matches spec, easy to extend later

### 5. Session Lifecycle

**Decision**: Async generator dependency with context manager
**Rationale**: Auto-cleanup, single session per request, handles errors

## Implementation Approach

### Phase 1: Configuration
1. Create `config.py` with pydantic-settings for DATABASE_URL
2. Create `.env.example` template
3. Update `pyproject.toml` with new dependencies

### Phase 2: Database Infrastructure
1. Create `database.py` with async engine and session factory
2. Implement `get_session` dependency
3. Add lifespan events for table creation and cleanup

### Phase 3: Models
1. Create base model with UUID and timestamps
2. Create User model with email unique constraint
3. Create Task model with soft delete and user relationship

### Phase 4: Integration
1. Update `main.py` with lifespan handler
2. Verify health endpoint still works
3. Run quickstart verification

## Dependencies to Add

```toml
[project.dependencies]
fastapi = ">=0.115.0"
sqlmodel = ">=0.0.22"
sqlalchemy = {extras = ["asyncio"], version = ">=2.0.35"}
asyncpg = ">=0.30.0"
uvicorn = {extras = ["standard"], version = ">=0.32.0"}
pydantic-settings = ">=2.6.0"
```

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `services/api/src/api/config.py` | CREATE | Environment settings |
| `services/api/src/api/database.py` | CREATE | Engine, sessions, dependency |
| `services/api/src/api/models/__init__.py` | CREATE | Model exports |
| `services/api/src/api/models/user.py` | CREATE | User entity |
| `services/api/src/api/models/task.py` | CREATE | Task entity |
| `services/api/src/api/main.py` | MODIFY | Add lifespan handler |
| `services/api/.env.example` | CREATE | Environment template |
| `services/api/pyproject.toml` | MODIFY | Add dependencies |

## Complexity Tracking

> No violations - all decisions align with constitution.

| Check | Status |
|-------|--------|
| Max 3 new abstractions | ✅ 3 (config, database, models) |
| No premature patterns | ✅ Simple direct approach |
| Justifies complexity | ✅ N/A - minimal complexity |

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Neon cold start latency | Medium | pool_pre_ping validates connections |
| Connection exhaustion | Low | Conservative pool sizing (5+10) |
| SSL configuration errors | Medium | Explicit sslmode in connection string |

## Next Steps

After this plan is approved:
1. Run `/sp.tasks` to generate implementation tasks
2. Implement tasks in order
3. Verify with quickstart.md checklist
