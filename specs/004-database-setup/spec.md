# Feature Specification: Database Setup

**Feature Branch**: `004-database-setup`
**Created**: 2026-02-05
**Status**: Draft
**Input**: User description: "Set up Neon PostgreSQL database connection with SQLModel for the sorted todo app. Create Task and User models with proper relationships (user owns tasks). Configure async database sessions with environment variables (DATABASE_URL). Use SQLModel create_all for table creation (no migration tool). This is Phase II foundation - enables auth and CRUD features that follow."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Application Starts with Database Connection (Priority: P1)

As a developer, I can start the FastAPI application and have it automatically connect to the Neon PostgreSQL database, creating necessary tables if they don't exist.

**Why this priority**: Without a working database connection, no other features (auth, CRUD) can function. This is the foundational capability.

**Independent Test**: Can be fully tested by starting the application with a valid DATABASE_URL and verifying tables are created in the database.

**Acceptance Scenarios**:

1. **Given** DATABASE_URL is set correctly, **When** the application starts, **Then** the app connects to Neon PostgreSQL and creates users and tasks tables if they don't exist.
2. **Given** DATABASE_URL is missing, **When** the application attempts to start, **Then** it fails immediately with a clear error message indicating the missing configuration.
3. **Given** DATABASE_URL points to an unreachable database, **When** the application starts, **Then** it fails with an actionable connection error message.

---

### User Story 2 - Database Session Available per Request (Priority: P1)

As a developer building API endpoints, I can inject an async database session into any FastAPI route handler to perform database operations.

**Why this priority**: All future CRUD endpoints depend on having database sessions available via dependency injection.

**Independent Test**: Can be fully tested by creating a test endpoint that receives an injected session and performs a simple query.

**Acceptance Scenarios**:

1. **Given** a FastAPI endpoint with session dependency, **When** a request is made, **Then** an isolated async session is provided for that request only.
2. **Given** a request completes successfully, **When** the response is sent, **Then** the session is properly closed and returned to the pool.
3. **Given** a request fails with an exception, **When** the error is raised, **Then** the session is rolled back and closed without leaking connections.

---

### User Story 3 - User and Task Models Persist Data (Priority: P2)

As a developer, I can create User and Task records in the database and retrieve them with their relationships intact.

**Why this priority**: Validates that the data model is correct and relationships work before building full CRUD APIs.

**Independent Test**: Can be fully tested by programmatically creating a user, creating a task for that user, and querying the task back with user relationship.

**Acceptance Scenarios**:

1. **Given** a valid User object, **When** saved to the database, **Then** the user is persisted with a UUID primary key and created_at timestamp.
2. **Given** a valid Task object with user_id, **When** saved to the database, **Then** the task is persisted with soft-delete flag defaulting to false.
3. **Given** a user with multiple tasks, **When** querying tasks for that user, **Then** only non-deleted tasks (is_deleted=false) are returned by default.

---

### Edge Cases

- What happens when two users try to register with the same email? (Unique constraint violation - handled gracefully)
- What happens when creating a task with a non-existent user_id? (Foreign key violation - handled gracefully)
- What happens when the connection pool is exhausted? (New requests wait or fail with timeout - configurable)
- What happens when a task title exceeds 200 characters? (Database constraint rejects the insert)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST read database connection string from DATABASE_URL environment variable
- **FR-002**: System MUST fail fast on startup if DATABASE_URL is missing or invalid
- **FR-003**: System MUST create users and tasks tables on startup if they do not exist
- **FR-004**: System MUST provide async database sessions via FastAPI dependency injection
- **FR-005**: System MUST enforce unique constraint on User.email at the database level
- **FR-006**: System MUST enforce NOT NULL constraints on required fields (User.email, User.hashed_password, Task.title, Task.user_id)
- **FR-007**: System MUST enforce string length limits at database level (Task.title max 200 chars, Task.description max 2000 chars)
- **FR-008**: System MUST default Task.is_deleted to false for soft-delete support
- **FR-009**: System MUST default Task.completed to false
- **FR-010**: System MUST limit connection pool size to avoid overwhelming Neon serverless (max 5 connections for development)

### Security Requirements

- **SR-001**: DATABASE_URL MUST NOT be logged or exposed in error responses
- **SR-002**: Database credentials MUST only be read from environment variables, never hardcoded

### Performance Requirements

- **PR-001**: Acquiring a database session and executing a simple SELECT MUST complete within 100ms under normal conditions

### Key Entities

- **User**: Represents an application user. Attributes: id (UUID, primary key), email (unique, indexed), hashed_password (string), created_at (timestamp, auto-generated).
- **Task**: Represents a todo item owned by a user. Attributes: id (UUID, primary key), title (string, required, max 200 chars), description (string, optional, max 2000 chars), completed (boolean, default false), is_deleted (boolean, default false), user_id (foreign key to User), created_at (timestamp, auto-generated).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Application starts successfully within 5 seconds when DATABASE_URL is correctly configured
- **SC-002**: Application fails within 2 seconds with actionable error when DATABASE_URL is missing
- **SC-003**: A User record can be created and retrieved within 100ms
- **SC-004**: A Task record with user relationship can be created and retrieved within 100ms
- **SC-005**: Database tables (users, tasks) are created automatically on first startup
- **SC-006**: Soft-deleted tasks (is_deleted=true) are excluded from standard queries

## Assumptions

- Neon PostgreSQL account and database are already provisioned (out of scope for this feature)
- DATABASE_URL follows standard PostgreSQL connection string format
- No database migrations tool needed - SQLModel's create_all is sufficient for initial setup
- User deletion and cascade behavior will be handled in a future auth/account management feature

## Out of Scope

- User authentication logic (005-auth feature)
- Task CRUD API endpoints (006-task-api feature)
- Database migrations and schema versioning
- User account deletion and cascade delete of tasks
- Production connection pool tuning (dev settings only)
