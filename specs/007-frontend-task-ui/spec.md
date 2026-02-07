# Feature Specification: Frontend Task UI

**Feature Branch**: `007-frontend-task-ui`
**Created**: 2026-02-07
**Status**: Draft
**Input**: User description: "Transform the authenticated dashboard into a responsive task management interface, completing Phase II by making all Basic Level features — create, view, update, complete, and delete tasks — accessible through the browser."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View My Task List (Priority: P1)

An authenticated user navigates to the dashboard and sees their personal task list displayed immediately. Tasks appear ordered newest-first, each showing its title, a visual completion status indicator, and a truncated description. If the user has no tasks, an empty state message guides them to create their first task. The list is paginated with 20 tasks per page and navigation controls appear when needed.

**Why this priority**: Viewing tasks is the foundational interaction — every other action (create, edit, delete, complete) depends on the user being able to see their task list. Without this, no other feature delivers value.

**Independent Test**: Can be fully tested by signing in with a user account that has existing tasks and verifying the list renders correctly with titles, statuses, and descriptions. Delivers immediate value by surfacing backend data to the user.

**Acceptance Scenarios**:

1. **Given** an authenticated user with 5 tasks, **When** they visit the dashboard, **Then** all 5 tasks appear ordered newest-first, each showing title, completion indicator, and truncated description.
2. **Given** an authenticated user with 0 tasks, **When** they visit the dashboard, **Then** an empty state is displayed with guidance to create their first task.
3. **Given** an authenticated user with 25 tasks, **When** they visit the dashboard, **Then** 20 tasks appear on page 1 with pagination controls to navigate to page 2 showing the remaining 5.
4. **Given** an unauthenticated visitor, **When** they attempt to access the dashboard, **Then** they are redirected to the sign-in page.

---

### User Story 2 - Create a New Task (Priority: P1)

From the dashboard, the user can create a new task by providing a title (required, 1–200 characters) and an optional description (up to 2,000 characters). After submitting, the new task appears in the list without a full page refresh. Validation errors are shown before submission if constraints are violated.

**Why this priority**: Task creation is the primary write action and equally critical to viewing — without it, the task list remains empty and the application has no utility for new users.

**Independent Test**: Can be fully tested by signing in, creating a task with a title and description, and verifying it appears at the top of the task list. Also test submitting without a title to verify validation.

**Acceptance Scenarios**:

1. **Given** an authenticated user on the dashboard, **When** they enter a title and submit the create form, **Then** a new task appears at the top of the list without a full page refresh.
2. **Given** an authenticated user filling the create form, **When** they enter a title exceeding 200 characters, **Then** a validation error is displayed before submission.
3. **Given** an authenticated user filling the create form, **When** they submit without a title, **Then** a validation error indicates the title is required.
4. **Given** an authenticated user filling the create form, **When** the backend returns an error, **Then** a readable error message is displayed to the user.

---

### User Story 3 - Toggle Task Completion (Priority: P2)

The user can mark a task as completed or revert it to active with a single click on the completion indicator. The status change is reflected immediately in the UI. The user can also filter the task list to show all tasks, only active tasks, or only completed tasks.

**Why this priority**: Toggling completion is the most frequent interaction after viewing and directly corresponds to the core purpose of a task manager — tracking what's done.

**Independent Test**: Can be fully tested by signing in, clicking the completion indicator on an active task, and verifying it changes to completed. Then clicking again to revert. Test the filter toggle to verify correct narrowing of displayed tasks.

**Acceptance Scenarios**:

1. **Given** an active task in the list, **When** the user clicks its completion indicator, **Then** the task's status immediately changes to completed and the visual indicator updates.
2. **Given** a completed task in the list, **When** the user clicks its completion indicator, **Then** the task's status reverts to active and the visual indicator updates.
3. **Given** tasks with mixed completion statuses, **When** the user selects the "Active" filter, **Then** only incomplete tasks are displayed.
4. **Given** tasks with mixed completion statuses, **When** the user selects the "Completed" filter, **Then** only completed tasks are displayed.
5. **Given** the user has the "Active" filter selected, **When** they select "All", **Then** all tasks are displayed regardless of status.

---

### User Story 4 - Edit an Existing Task (Priority: P2)

The user can open a task to edit its title, description, or completion status. After saving, the changes persist and are reflected in the task list. The same validation constraints apply as during creation.

**Why this priority**: Editing is essential for correcting mistakes and updating task details, but is less frequent than viewing, creating, or completing tasks.

**Independent Test**: Can be fully tested by signing in, selecting a task, modifying its title, saving, and verifying the updated title appears in the list.

**Acceptance Scenarios**:

1. **Given** an existing task in the list, **When** the user opens it for editing and changes the title, **Then** the updated title is saved and reflected in the list.
2. **Given** a task open for editing, **When** the user clears the title and attempts to save, **Then** a validation error indicates the title is required.
3. **Given** a task open for editing, **When** the user modifies the description and saves, **Then** the updated description is persisted.
4. **Given** a task open for editing, **When** the backend returns an error on save, **Then** a readable error message is displayed and the edit form remains open with unsaved changes preserved.

---

### User Story 5 - Delete a Task (Priority: P3)

The user can delete a task from the list. A confirmation step prevents accidental deletion. After confirmation, the task is removed from the visible list (soft-deleted on the backend).

**Why this priority**: Deletion is a destructive action used infrequently. Users primarily create and complete tasks rather than delete them. However, it is necessary for list hygiene.

**Independent Test**: Can be fully tested by signing in, initiating deletion on a task, confirming the action, and verifying the task disappears from the list.

**Acceptance Scenarios**:

1. **Given** an existing task in the list, **When** the user initiates deletion, **Then** a confirmation prompt appears before the task is removed.
2. **Given** a deletion confirmation prompt, **When** the user confirms, **Then** the task is removed from the list.
3. **Given** a deletion confirmation prompt, **When** the user cancels, **Then** the task remains in the list unchanged.
4. **Given** a deletion that fails due to a backend error, **When** the error occurs, **Then** a readable error message is displayed and the task remains in the list.

---

### User Story 6 - Responsive Experience (Priority: P2)

All task management interactions — viewing, creating, editing, completing, deleting, filtering, and paginating — work correctly on mobile (360px+), tablet, and desktop viewports. Layout and controls adapt to the available screen width without horizontal scrolling or overlapping elements.

**Why this priority**: Mobile-friendly design is critical for a task manager since users frequently check and update tasks from their phones throughout the day.

**Independent Test**: Can be fully tested by performing each task operation at 360px, 768px, and 1024px viewport widths and verifying usability at each breakpoint.

**Acceptance Scenarios**:

1. **Given** a 360px-wide viewport, **When** the user views the task list, **Then** tasks are readable without horizontal scrolling and all controls are accessible.
2. **Given** a 360px-wide viewport, **When** the user creates, edits, or deletes a task, **Then** forms and confirmations are usable without overlap or truncated controls.
3. **Given** a desktop viewport, **When** the user views the task list, **Then** the layout makes effective use of available width without stretching uncomfortably.

---

### Edge Cases

- What happens when the user's session expires mid-interaction? The system receives a 401 response and redirects the user to the sign-in page.
- What happens when the user submits a task with exactly 200 characters in the title? It is accepted as valid.
- What happens when the user submits a description with exactly 2,000 characters? It is accepted as valid.
- What happens when the user is on page 2 and deletes the last task on that page? The user is navigated back to page 1.
- What happens when the backend is unreachable? An error message is displayed indicating the service is temporarily unavailable.
- What happens when the user rapidly clicks the completion toggle multiple times? Only the final state is persisted; intermediate clicks do not cause inconsistent state.
- What happens when a task title contains special characters or HTML? It is displayed as plain text without rendering as markup.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the authenticated user's task list on the dashboard, ordered by creation date (newest first).
- **FR-002**: System MUST show each task's title, completion status indicator, and a truncated description in the list view.
- **FR-003**: System MUST paginate the task list with a default of 20 tasks per page and provide navigation controls when tasks exceed one page.
- **FR-004**: System MUST provide filter controls to show all tasks, only active tasks, or only completed tasks.
- **FR-005**: System MUST provide a form for creating a new task with a required title (1–200 characters) and optional description (up to 2,000 characters).
- **FR-006**: System MUST enforce client-side validation matching backend constraints before form submission.
- **FR-007**: System MUST add newly created tasks to the list without requiring a full page refresh.
- **FR-008**: System MUST allow toggling a task's completion status with a single click and immediately update the visual indicator.
- **FR-009**: System MUST allow editing a task's title, description, and completion status, and persist changes to the backend.
- **FR-010**: System MUST require a confirmation step before deleting a task.
- **FR-011**: System MUST remove deleted tasks from the visible list after confirmed deletion.
- **FR-012**: System MUST display an empty state with guidance when the user has no tasks.
- **FR-013**: System MUST display readable error messages when any backend request fails.
- **FR-014**: System MUST redirect unauthenticated users to the sign-in page, including when a 401 response is received during any interaction.
- **FR-015**: System MUST provide loading feedback during all asynchronous operations (initial load, create, update, delete).
- **FR-016**: System MUST render correctly and be fully usable on viewports from 360px width and above.
- **FR-017**: System MUST display task titles containing special characters or HTML as plain text.

### Key Entities

- **Task**: Represents a unit of work belonging to a single user. Key attributes: title (text, 1–200 chars), description (optional text, up to 2,000 chars), completion status (boolean), creation timestamp, last-updated timestamp. Each task belongs to exactly one user and is only visible to its owner.
- **Task List**: A paginated, filterable view of a user's tasks. Supports ordering by newest-first, filtering by completion status, and page-based navigation. Defined by current page number, items per page, total count, and active filter.

## Scope *(mandatory)*

### In Scope

- Task list display with pagination and status filtering
- Task creation form with client-side validation
- Single-click completion toggling
- Task editing (title, description, completion status)
- Task deletion with confirmation
- Empty state for users with no tasks
- Loading and error states for all interactions
- Responsive layout (360px+ viewports)
- 401 redirect to sign-in

### Out of Scope

- Drag-and-drop reordering
- Bulk operations (multi-select, bulk delete, bulk complete)
- Real-time sync across browser tabs or devices
- Due dates, tags, priorities, or labels
- Search or text filtering within tasks
- Keyboard shortcuts for task management
- Offline support or service worker caching
- Any backend changes — this feature consumes the existing Task CRUD API only
- Any Phase III+ features

## Assumptions

- The existing Task CRUD API (feature 006) is fully operational and stable.
- The existing `apiFetch` helper correctly injects JWT tokens and returns standard fetch responses.
- The Next.js proxy rewrite correctly forwards `/api/tasks*` requests to the FastAPI backend.
- Better Auth session management (via `useSession` hook) reliably reports authentication state.
- The existing Tailwind CSS v4 setup with zinc color palette and dark mode support is the design foundation — no component library is needed.
- Description truncation in the list view uses a reasonable character limit (approximately 100 characters) with an ellipsis indicator.
- The "inline form or modal" for task creation and editing will use a modal pattern for cleaner UX on mobile, though the exact UI pattern is a design decision for planning phase.
- Pagination resets to page 1 when the active filter changes.

## Dependencies

- Feature 005 (Authentication): Provides Better Auth integration, JWT tokens, `useSession`, `signOut`, and route protection.
- Feature 006 (Task CRUD API): Provides the five RESTful endpoints consumed by this feature.
- `apiFetch` helper (`apps/web/src/lib/api-client.ts`): Handles JWT injection and request construction.
- Next.js proxy configuration (`apps/web/next.config.ts`): Routes `/api/tasks*` to FastAPI backend.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can see their task list within 1 second of the dashboard page loading.
- **SC-002**: Users can create a task and see it in the list without leaving or refreshing the page.
- **SC-003**: Users can toggle a task's completion status with a single click and see the change reflected instantly.
- **SC-004**: Users can edit a task's details and see the updated information in the list after saving.
- **SC-005**: Users can delete a task after confirmation and see it removed from the list immediately.
- **SC-006**: Users can navigate between pages of results when they have more than 20 tasks.
- **SC-007**: Users can filter their task list by completion status (all, active, completed) and see only matching tasks.
- **SC-008**: All task management interactions are fully usable on a 360px-wide mobile viewport.
- **SC-009**: Users who are not authenticated are redirected to the sign-in page when attempting to access the dashboard.
- **SC-010**: Users see readable, actionable error messages when any operation fails, rather than silent failures or raw error codes.
