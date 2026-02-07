# Feature Specification: Task CRUD API with User Isolation

**Feature Branch**: `006-task-crud-api`
**Created**: 2026-02-07
**Status**: Draft
**Input**: User description: "Task CRUD API — five RESTful endpoints for create, list, get, update, soft-delete tasks, with user isolation enforced on every query"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a Task (Priority: P1)

An authenticated user creates a new task by providing a title and an optional description. The system persists the task, associates it with the authenticated user, and returns the newly created task with a generated identifier and timestamps.

**Why this priority**: Task creation is the foundational action — without it, no other CRUD operation has data to operate on.

**Independent Test**: Can be fully tested by sending an authenticated request with a title and verifying the returned task contains the correct fields, a generated identifier, and a creation timestamp.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they submit a task with a title of "Buy groceries", **Then** the system returns the created task with a unique identifier, the submitted title, completion status of false, and a creation timestamp (status 201).
2. **Given** an authenticated user, **When** they submit a task with a title and a description, **Then** both fields are persisted and returned in the response.
3. **Given** an authenticated user, **When** they submit a task with an empty title, **Then** the system rejects the request with a validation error (status 422).
4. **Given** an authenticated user, **When** they submit a task with a title exceeding 200 characters, **Then** the system rejects the request with a validation error (status 422).
5. **Given** an authenticated user, **When** they submit a task with a description exceeding 2,000 characters, **Then** the system rejects the request with a validation error (status 422).
6. **Given** an unauthenticated request, **When** the user attempts to create a task, **Then** the system returns an authentication error (status 401).

---

### User Story 2 - List My Tasks (Priority: P1)

An authenticated user retrieves a paginated list of their own tasks. The list excludes soft-deleted tasks and can be filtered by completion status. Results are ordered by creation date, newest first.

**Why this priority**: Listing tasks is the primary read operation and the entry point for all subsequent interactions (viewing, updating, completing, deleting).

**Independent Test**: Can be fully tested by creating several tasks for a user, then requesting the list and verifying only that user's non-deleted tasks appear in the correct order with proper pagination metadata.

**Acceptance Scenarios**:

1. **Given** a user with 5 tasks, **When** they request their task list, **Then** the system returns all 5 tasks ordered newest-first, wrapped in a paginated envelope showing total of 5, page 1, and correct total pages.
2. **Given** a user with no tasks, **When** they request their task list, **Then** the system returns an empty list with total of 0.
3. **Given** a user with 25 tasks, **When** they request page 1 with 10 items per page, **Then** the system returns 10 tasks, total of 25, and total pages of 3.
4. **Given** a user with 25 tasks, **When** they request page 3 with 10 items per page, **Then** the system returns the remaining 5 tasks.
5. **Given** a user with 3 completed and 2 incomplete tasks, **When** they filter by completed status true, **Then** only the 3 completed tasks are returned.
6. **Given** a user with a soft-deleted task, **When** they request their task list, **Then** the deleted task does not appear in the results.
7. **Given** two users each with tasks, **When** user A requests their list, **Then** only user A's tasks are returned — user B's tasks are never visible.

---

### User Story 3 - View a Single Task (Priority: P2)

An authenticated user retrieves the full details of one of their tasks by its identifier.

**Why this priority**: Viewing a single task provides detail access needed before editing or completing a task.

**Independent Test**: Can be fully tested by creating a task and then retrieving it by identifier, verifying all fields match.

**Acceptance Scenarios**:

1. **Given** a user who owns a task, **When** they request that task by identifier, **Then** the system returns the complete task details.
2. **Given** a user, **When** they request a task identifier that does not exist, **Then** the system returns a "Task not found" error (status 404).
3. **Given** two users, **When** user A requests a task owned by user B, **Then** the system returns a "Task not found" error (status 404) — not a permission error.
4. **Given** a user with a soft-deleted task, **When** they request that task by identifier, **Then** the system returns "Task not found" (status 404).

---

### User Story 4 - Update a Task (Priority: P2)

An authenticated user partially updates one of their tasks — changing the title, description, completion status, or any combination thereof. Only the provided fields are modified; omitted fields remain unchanged.

**Why this priority**: Updating tasks (especially marking them complete) is the core interaction that makes the task list useful beyond a static record.

**Independent Test**: Can be fully tested by creating a task, sending a partial update with one field changed, and verifying only that field was modified while others remain unchanged.

**Acceptance Scenarios**:

1. **Given** a user who owns a task titled "Buy groceries", **When** they update the title to "Buy organic groceries", **Then** the title changes but description and completion status remain the same, and the last-modified timestamp is updated.
2. **Given** a user who owns an incomplete task, **When** they update the completion status to true, **Then** the task is marked complete and the last-modified timestamp is updated.
3. **Given** a user who owns a task, **When** they send an update with no fields changed, **Then** the system returns the task unchanged (no-op is acceptable).
4. **Given** a user, **When** they attempt to update a task they do not own, **Then** the system returns "Task not found" (status 404).
5. **Given** a user, **When** they attempt to update a task with an empty title, **Then** the system rejects the request with a validation error (status 422).
6. **Given** a user, **When** they attempt to update a soft-deleted task, **Then** the system returns "Task not found" (status 404).

---

### User Story 5 - Delete a Task (Priority: P3)

An authenticated user deletes one of their tasks. The task is soft-deleted (marked as deleted but retained in the database) and becomes invisible in all subsequent queries.

**Why this priority**: Deletion is the least-used CRUD operation but necessary for list hygiene. Soft delete preserves data for potential recovery.

**Independent Test**: Can be fully tested by creating a task, deleting it, and verifying it no longer appears in list or get operations.

**Acceptance Scenarios**:

1. **Given** a user who owns a task, **When** they delete that task, **Then** the system confirms deletion with no response body (status 204).
2. **Given** a user who has deleted a task, **When** they attempt to delete it again, **Then** the system returns "Task not found" (status 404).
3. **Given** a user who has deleted a task, **When** they attempt to retrieve it, **Then** the system returns "Task not found" (status 404).
4. **Given** a user, **When** they attempt to delete a task owned by another user, **Then** the system returns "Task not found" (status 404).

---

### Edge Cases

- What happens when a user provides a non-UUID value as a task identifier? The system returns a validation error (status 422).
- What happens when a user requests a page number beyond the total pages? The system returns an empty data array with the correct total and total pages metadata.
- What happens when per_page exceeds 100 or is less than 1? The system returns a validation error (status 422).
- What happens when page is less than 1? The system returns a validation error (status 422).
- What happens when a user submits unexpected fields in a create or update request? Extra fields are ignored; only recognized fields are processed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow authenticated users to create tasks with a required title (1–200 characters) and optional description (up to 2,000 characters).
- **FR-002**: System MUST return newly created tasks with a unique identifier, the submitted fields, a default completion status of false, and creation/modification timestamps.
- **FR-003**: System MUST provide a paginated list of the authenticated user's non-deleted tasks, defaulting to 20 items per page with a maximum of 100.
- **FR-004**: System MUST support filtering the task list by completion status (completed or incomplete).
- **FR-005**: System MUST order task lists by creation date, newest first.
- **FR-006**: System MUST allow authenticated users to retrieve a single task by its unique identifier.
- **FR-007**: System MUST allow authenticated users to partially update their own tasks — modifying any combination of title, description, and completion status.
- **FR-008**: System MUST update the last-modified timestamp on every task mutation (update or delete).
- **FR-009**: System MUST allow authenticated users to soft-delete their own tasks, making them invisible in all subsequent queries.
- **FR-010**: System MUST return a "Task not found" error for any task that does not exist, is soft-deleted, or belongs to another user — using identical responses to prevent information leakage.
- **FR-011**: System MUST reject all requests without a valid authentication token with an authentication error.
- **FR-012**: System MUST validate all input data and return clear validation errors for invalid requests.
- **FR-013**: System MUST never expose internal fields (ownership identifier, deletion flag) in any response.

### Key Entities

- **Task**: Represents a todo item. Attributes: unique identifier, title, optional description, completion status, creation timestamp, last-modified timestamp. Each task belongs to exactly one user. Tasks support soft deletion — a deleted task is retained but excluded from all user-facing queries.

### Assumptions

- Only one user role exists (standard user). There are no admin or shared-task scenarios.
- Tasks are strictly single-owner; there is no concept of shared or collaborative tasks.
- The default sort order (newest first by creation date) is fixed; custom sorting is out of scope.
- Pagination uses page-number style (page + per_page), not cursor-based pagination.
- No rate limiting is applied to these endpoints in this feature scope.

### Out of Scope

- Hard-delete or data purge endpoints
- Bulk operations (batch create, update, or delete)
- Custom sort orders beyond creation-date descending
- Full-text search or keyword filtering
- Task metadata such as tags, priorities, due dates, or categories
- Frontend UI integration
- Real-time notifications or event streaming on task changes

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a task and see it in their list within 1 second of submission.
- **SC-002**: Users can retrieve their task list with up to 100 items in under 1 second.
- **SC-003**: A user's tasks are never visible to any other user under any combination of operations.
- **SC-004**: All five task operations (create, list, view, update, delete) return correct responses matching their documented status codes and response shapes.
- **SC-005**: 100% of invalid inputs (empty titles, oversized fields, missing authentication) are rejected with appropriate error messages before reaching the data layer.
- **SC-006**: Deleted tasks are permanently invisible in all user-facing operations immediately after deletion.
- **SC-007**: Every task mutation (create, update, delete) records the exact time of the change, verifiable by comparing timestamps before and after the operation.
