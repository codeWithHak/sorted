# Tasks: Database Setup

**Input**: Design documents from `/specs/004-database-setup/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Tests are NOT explicitly requested for this feature. Manual verification via quickstart.md is sufficient.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (monorepo)**: `services/api/src/api/`, `apps/web/`
- Paths shown below use the actual project structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency configuration

- [x] T001 [P] Update services/api/pyproject.toml with SQLModel, asyncpg, pydantic-settings dependencies
- [x] T002 [P] Create services/api/.env.example with DATABASE_URL template
- [x] T003 [P] Create services/api/src/api/models/ directory with __init__.py

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create services/api/src/api/config.py with Settings class using pydantic-settings for DATABASE_URL
- [x] T005 Create services/api/src/api/database.py with async engine, session factory, and pool configuration

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Application Starts with Database Connection (Priority: P1) 🎯 MVP

**Goal**: FastAPI application connects to Neon PostgreSQL on startup and creates tables automatically

**Independent Test**: Start application with valid DATABASE_URL, verify tables created in Neon console

### Implementation for User Story 1

- [x] T006 [US1] Add lifespan context manager in services/api/src/api/database.py with create_all on startup
- [x] T007 [US1] Update services/api/src/api/main.py to use lifespan handler from database.py
- [x] T008 [US1] Add startup validation to fail fast if DATABASE_URL is missing in services/api/src/api/config.py
- [x] T009 [US1] Add connection error handling with actionable error messages in services/api/src/api/database.py

**Checkpoint**: Application starts, connects to Neon, and creates tables. Fails gracefully if misconfigured.

---

## Phase 4: User Story 2 - Database Session Available per Request (Priority: P1)

**Goal**: Async database sessions injectable into FastAPI route handlers via dependency injection

**Independent Test**: Create test endpoint that uses session dependency and executes simple query

### Implementation for User Story 2

- [x] T010 [US2] Create get_session async generator dependency in services/api/src/api/database.py
- [x] T011 [US2] Add session cleanup and rollback handling on exceptions in services/api/src/api/database.py
- [x] T012 [US2] Export get_session in services/api/src/api/database.py for use by route handlers
- [x] T013 [US2] Update /health endpoint in services/api/src/api/main.py to verify database connectivity using session

**Checkpoint**: Route handlers can inject async sessions. Sessions auto-cleanup after requests.

---

## Phase 5: User Story 3 - User and Task Models Persist Data (Priority: P2)

**Goal**: User and Task SQLModel entities with relationships, constraints, and soft-delete support

**Independent Test**: Programmatically create User, create Task for that User, query back with relationship intact

### Implementation for User Story 3

- [x] T014 [P] [US3] Create User model in services/api/src/api/models/user.py with UUID pk, email unique, hashed_password, created_at
- [x] T015 [P] [US3] Create Task model in services/api/src/api/models/task.py with UUID pk, title, description, completed, is_deleted, user_id FK, created_at
- [x] T016 [US3] Add string length constraints to Task model (title max 200, description max 2000) in services/api/src/api/models/task.py
- [x] T017 [US3] Add relationship from Task to User in services/api/src/api/models/task.py
- [x] T018 [US3] Export User and Task models in services/api/src/api/models/__init__.py
- [x] T019 [US3] Import models in services/api/src/api/database.py so SQLModel.metadata includes them for create_all

**Checkpoint**: User and Task tables created with correct constraints. Relationships work.

---

## Phase 6: Polish & Verification

**Purpose**: Final validation and documentation

- [x] T020 [P] Add .env to services/api/.gitignore if not already present
- [x] T021 Run quickstart.md verification checklist (start app, check health, verify tables in Neon)
- [x] T022 Verify all functional requirements (FR-001 through FR-010) are satisfied

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - establishes connection
- **User Story 2 (Phase 4)**: Depends on Foundational - can run in parallel with US1
- **User Story 3 (Phase 5)**: Depends on Foundational - can run in parallel with US1/US2
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories - core connection functionality
- **User Story 2 (P1)**: No dependencies on other stories - session injection is independent
- **User Story 3 (P2)**: Depends on US1 (needs create_all to work) but can be developed in parallel

### Within Each User Story

- Config before database module
- Database module before models
- Models before main.py integration

### Parallel Opportunities

```bash
# Phase 1 - All can run in parallel:
T001 (pyproject.toml)
T002 (.env.example)
T003 (models directory)

# Phase 5 - Models can be created in parallel:
T014 (User model)
T015 (Task model)
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T005)
3. Complete Phase 3: User Story 1 (T006-T009)
4. Complete Phase 4: User Story 2 (T010-T013)
5. **STOP and VALIDATE**: App starts, connects, sessions work
6. Deploy/demo if ready

### Full Implementation

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test connection and table creation
3. Add User Story 2 → Test session injection
4. Add User Story 3 → Test model persistence
5. Polish → Final verification

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story is independently testable via quickstart.md scenarios
- Commit after each phase or logical group
- Stop at any checkpoint to validate independently
- All file paths are relative to repository root
