# Tasks: Frontend Task UI

**Input**: Design documents from `/specs/007-frontend-task-ui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested — no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (monorepo)**: `apps/web/src/` for frontend source

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the TypeScript types and directory structure needed by all user stories

- [x] T001 Create TypeScript type definitions for the Task API contract (Task, TaskCreateInput, TaskUpdateInput, TaskListResponse) in `apps/web/src/lib/types/task.ts` — mirror the backend contract from `specs/006-task-crud-api/contracts/tasks-api.yaml` and the data-model.md. Include: `Task` (id, title, description, completed, created_at, updated_at), `TaskCreateInput` (title required, description optional), `TaskUpdateInput` (all optional: title, description, completed), `TaskListResponse` (data, total, page, per_page, total_pages), and `TaskFilter` type (`"all" | "active" | "completed"`).

- [x] T002 Create the `apps/web/src/components/tasks/` directory structure. No file content yet — just ensure the directory exists for subsequent component tasks.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the reusable UI components that all user stories depend on — EmptyState, Pagination, modal wrapper, and the form component. These are building blocks used across multiple stories.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 [P] Build the EmptyState component in `apps/web/src/components/tasks/EmptyState.tsx`. Props: `onCreateClick: () => void`. Renders a centered message ("No tasks yet — create your first one!") with a "Create Task" primary button that calls `onCreateClick`. Use Tailwind classes matching existing codebase: `text-zinc-500 dark:text-zinc-400` for message text, primary button styling from plan.md. Component must be a client component (`"use client"`).

- [x] T004 [P] Build the Pagination component in `apps/web/src/components/tasks/Pagination.tsx`. Props: `page: number`, `totalPages: number`, `onPageChange: (page: number) => void`. Renders Previous/Next buttons with "Page X of Y" text. Previous disabled when `page === 1`, Next disabled when `page === totalPages`. Hide entirely when `totalPages <= 1`. Use secondary button styling from plan.md. Client component.

- [x] T005 [P] Build the TaskModal component in `apps/web/src/components/tasks/TaskModal.tsx`. Props: `isOpen: boolean`, `onClose: () => void`, `title: string`, `children: React.ReactNode`. Renders a fixed-position backdrop (`fixed inset-0 bg-black/50 flex items-center justify-center z-50`) with a content panel (`mx-4 w-full max-w-lg rounded-lg bg-white p-6 dark:bg-zinc-900`). Includes a header with the title and an X close button. Close on backdrop click and Escape key. Renders `children` inside the panel. Return `null` when `isOpen` is false. Client component.

- [x] T006 [P] Build the TaskForm component in `apps/web/src/components/tasks/TaskForm.tsx`. Props: `mode: "create" | "edit"`, `initialTitle?: string`, `initialDescription?: string`, `onSubmit: (data: TaskCreateInput) => void`, `onCancel: () => void`, `loading: boolean`, `error: string`. Renders a form with: title input (required, maxLength 200, with character counter showing `X/200`), description textarea (optional, maxLength 2000, with character counter), inline validation error below each field, server error banner from `error` prop, Cancel (secondary) and Save/Create (primary, disabled when loading or invalid) buttons. Client-side validation: title must be 1–200 chars, description must be 0–2000 chars. Pre-populate fields from `initialTitle`/`initialDescription` in edit mode. Use input/button styling from plan.md. Client component. Import `TaskCreateInput` from `@/lib/types/task`.

- [x] T007 [P] Build the FilterBar component in `apps/web/src/components/tasks/FilterBar.tsx`. Props: `filter: TaskFilter`, `onFilterChange: (filter: TaskFilter) => void`. Renders three toggle buttons in a row: "All", "Active", "Completed". Active button uses filter-active styling (`bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-md px-3 py-1 text-sm font-medium`), inactive buttons use filter-inactive styling. Import `TaskFilter` from `@/lib/types/task`. Client component.

**Checkpoint**: All reusable UI building blocks ready — user story implementation can begin.

---

## Phase 3: User Story 1 — View My Task List (Priority: P1) MVP

**Goal**: Authenticated user sees their paginated task list on the dashboard with empty state, loading state, and error handling.

**Independent Test**: Sign in → visit `/dashboard` → see task list (or empty state if no tasks). Verify newest-first ordering, pagination with 20+ tasks, loading spinner on initial load, and 401 redirect.

### Implementation for User Story 1

- [x] T008 [P] [US1] Build the TaskItem component in `apps/web/src/components/tasks/TaskItem.tsx`. Props: `task: Task`, `onToggle: (taskId: string) => void`, `onEdit: (task: Task) => void`, `onDelete: (taskId: string) => void`, `isDeleting: boolean` (show delete confirm), `onDeleteConfirm: () => void`, `onDeleteCancel: () => void`, `deleteLoading: boolean`. Renders a single task row with: checkbox/completion indicator (calls `onToggle`), title (plain text, no HTML rendering — use `textContent` not `innerHTML`), truncated description (first 100 chars + "..." if longer, in muted text), Edit button (secondary style), and Delete button (danger text — `text-red-600 dark:text-red-400`). When `isDeleting` is true, replace the action buttons with the DeleteConfirm component. Completed tasks show a strikethrough on the title (`line-through text-zinc-400`). Use `border-b border-zinc-200 dark:border-zinc-800 py-3` for row styling. Import `Task` from `@/lib/types/task`. Client component.

- [x] T009 [P] [US1] Build the DeleteConfirm component in `apps/web/src/components/tasks/DeleteConfirm.tsx`. Props: `onConfirm: () => void`, `onCancel: () => void`, `loading: boolean`. Renders inline text "Delete this task?" with two buttons: "Yes, delete" (danger button — `text-red-600 font-medium text-sm`) and "Cancel" (secondary text button), both disabled when `loading` is true. Shows a loading indicator text when `loading`. Client component.

- [x] T010 [P] [US1] Build the TaskList component in `apps/web/src/components/tasks/TaskList.tsx`. Props: `tasks: Task[]`, `onToggle: (taskId: string) => void`, `onEdit: (task: Task) => void`, `onDelete: (taskId: string) => void`, `deletingTaskId: string | null`, `onDeleteConfirm: () => void`, `onDeleteCancel: () => void`, `deleteLoading: boolean`. Maps `tasks` array to `TaskItem` components. Passes `isDeleting={task.id === deletingTaskId}` to each item. If `tasks` is empty, this component is not rendered (EmptyState is shown instead by the parent). Client component. Import `Task` from `@/lib/types/task`.

- [x] T011 [US1] Replace the dashboard page in `apps/web/src/app/dashboard/page.tsx` with the task list orchestrator. This is the core integration task. The page must:
  1. Be a `"use client"` component.
  2. Use `useSession()` from `@/lib/auth-client` for auth state.
  3. Manage state: `tasks: Task[]`, `total: number`, `totalPages: number`, `page: number` (default 1), `filter: TaskFilter` (default "all"), `loading: boolean`, `error: string`.
  4. Implement a `fetchTasks` function that calls `apiFetch("/api/tasks?page=${page}&per_page=20${completedParam}")` where `completedParam` maps filter: "all" → omit, "active" → `&completed=false`, "completed" → `&completed=true`. Parse response as `TaskListResponse`. On 401: call `signOut()` from `@/lib/auth-client` and redirect to `/auth/signin` via `router.push()`. On other errors: set error state with readable message. On success: set tasks, total, totalPages.
  5. Call `fetchTasks` in a `useEffect` on `[page, filter]` dependencies.
  6. Reset `page` to 1 when `filter` changes.
  7. Render: error banner (if error, dismissible), loading spinner (if loading and no tasks yet), FilterBar, TaskList (when tasks exist) or EmptyState (when no tasks and not loading), Pagination (when totalPages > 1).
  8. Include a "New Task" button in the header area (primary button styling) that opens the create modal (wired in US2).
  9. Use `mx-auto max-w-3xl` container matching existing layout.
  10. Import all types from `@/lib/types/task` and components from `@/components/tasks/`.
  For this task (US1 only): wire up fetchTasks, loading, error, empty state, pagination, and filter. Leave modal/create/edit/delete handlers as stubs (`// TODO: implement in US2/US3/US4/US5`) that will be filled in subsequent story phases.

**Checkpoint**: Dashboard displays paginated, filterable task list with empty state and error handling. MVP is functional — user can view their tasks.

---

## Phase 4: User Story 2 — Create a New Task (Priority: P1)

**Goal**: User can create a task via a modal form with client-side validation, and it appears in the list without page refresh.

**Independent Test**: Sign in → click "New Task" → fill in title → submit → new task appears at top of list. Test empty title validation and max-length validation.

### Implementation for User Story 2

- [x] T012 [US2] Wire up task creation in `apps/web/src/app/dashboard/page.tsx`. Add state: `modalMode: "create" | "edit" | null` (default null), `modalLoading: boolean` (default false), `modalError: string` (default ""). Implement `handleCreate` function: call `apiFetch("/api/tasks", { method: "POST", body: JSON.stringify(data) })`, parse response as `Task`, on success close modal and re-fetch task list (call `fetchTasks`), on 401 redirect, on 422 extract validation error from `detail[].msg`, on other errors set modalError. Connect the "New Task" button to set `modalMode = "create"`. Render `TaskModal` (title: "New Task") wrapping `TaskForm` (mode: "create") when `modalMode === "create"`. Pass `modalLoading`, `modalError`, `handleCreate`, and close handler (resets modalMode to null, clears modalError). After successful create, if filter is "completed", re-fetch since new tasks are active by default.

**Checkpoint**: Users can create tasks and see them appear in the list. Combined with US1, this delivers a functional MVP.

---

## Phase 5: User Story 3 — Toggle Task Completion (Priority: P2)

**Goal**: Single-click completion toggle with optimistic UI update, 300ms debounce, and revert on failure.

**Independent Test**: Sign in → click checkbox on an active task → checkbox updates immediately → task marked completed on backend. Click again → reverts to active. Rapidly click → only final state persists.

### Implementation for User Story 3

- [x] T013 [US3] Implement completion toggle in `apps/web/src/app/dashboard/page.tsx`. Add a `handleToggle(taskId: string)` function that:
  1. Immediately updates the task's `completed` field in the local `tasks` state (optimistic update).
  2. Debounces the API call by 300ms using a `useRef` to store a timeout ID per task. If toggle is called again within 300ms for the same task, clear the previous timeout and set a new one.
  3. After debounce: call `apiFetch(\`/api/tasks/${taskId}\`, { method: "PATCH", body: JSON.stringify({ completed: newValue }) })`.
  4. On failure: revert the task's `completed` field in local state to its previous value. Set error message.
  5. On 401: sign out and redirect.
  Pass `handleToggle` as `onToggle` prop to `TaskList` → `TaskItem`. The checkbox in `TaskItem` should call `onToggle(task.id)` on change. Visual: completed tasks show strikethrough title (already styled in T008).

**Checkpoint**: Completion toggle works with instant feedback, debounce, and failure revert.

---

## Phase 6: User Story 4 — Edit an Existing Task (Priority: P2)

**Goal**: User can open a task for editing, modify title/description/status, save changes, and see them reflected in the list.

**Independent Test**: Sign in → click Edit on a task → modal opens with pre-filled data → change title → save → updated title appears in list. Test empty-title validation on edit.

### Implementation for User Story 4

- [x] T014 [US4] Wire up task editing in `apps/web/src/app/dashboard/page.tsx`. Add state: `editingTask: Task | null` (default null). Implement `handleEdit(task: Task)` to set `modalMode = "edit"` and `editingTask = task`. Implement `handleUpdate(data: TaskCreateInput)` function: call `apiFetch(\`/api/tasks/${editingTask.id}\`, { method: "PATCH", body: JSON.stringify(data) })`, parse response as `Task`, on success close modal and re-fetch task list, on 401 redirect, on 422 extract validation error, on other errors set modalError. Render `TaskModal` (title: "Edit Task") wrapping `TaskForm` (mode: "edit", initialTitle: editingTask.title, initialDescription: editingTask.description) when `modalMode === "edit"`. Pass `modalLoading`, `modalError`, `handleUpdate`, and close handler. Connect the Edit button in `TaskItem` via `onEdit` prop through `TaskList`.

**Checkpoint**: Users can edit task details via modal. All CRUD operations except delete now work.

---

## Phase 7: User Story 5 — Delete a Task (Priority: P3)

**Goal**: User can delete a task with an inline confirmation step. Deleted tasks are removed from the list.

**Independent Test**: Sign in → click Delete on a task → inline confirmation appears → click "Yes, delete" → task disappears from list. Test cancel to verify task remains. Test that deleting last task on page 2 navigates back to page 1.

### Implementation for User Story 5

- [x] T015 [US5] Wire up task deletion in `apps/web/src/app/dashboard/page.tsx`. Add state: `deletingTaskId: string | null` (default null), `deleteLoading: boolean` (default false). Implement `handleDeleteInit(taskId: string)` to set `deletingTaskId = taskId`. Implement `handleDeleteConfirm()` function: set `deleteLoading = true`, call `apiFetch(\`/api/tasks/${deletingTaskId}\`, { method: "DELETE" })`, on success (204): remove task from local state, reset `deletingTaskId` to null, if the current page has no tasks left and `page > 1` then set `page = page - 1` (triggers re-fetch), otherwise re-fetch. On 401: redirect. On error: set error message, reset `deletingTaskId`. Always set `deleteLoading = false`. Implement `handleDeleteCancel()` to reset `deletingTaskId` to null. Pass `deletingTaskId`, `deleteLoading`, `handleDeleteInit` (as `onDelete`), `handleDeleteConfirm`, `handleDeleteCancel` through `TaskList` to `TaskItem` → `DeleteConfirm`.

**Checkpoint**: Full CRUD complete. All five task operations (view, create, toggle, edit, delete) work end-to-end.

---

## Phase 8: User Story 6 — Responsive Experience (Priority: P2)

**Goal**: All interactions work correctly on mobile (360px+), tablet, and desktop viewports.

**Independent Test**: Open browser at 360px width → verify: task list readable without horizontal scroll, create modal fills width with mx-4 margin, filter buttons wrap if needed, pagination controls accessible, edit/delete actions usable with touch targets.

### Implementation for User Story 6

- [x] T016 [US6] Responsive audit and fixes across all components. Review each component at 360px, 768px, and 1024px viewport widths and fix any issues:
  - `apps/web/src/app/dashboard/page.tsx`: Ensure container uses `px-4 sm:px-8` instead of fixed `p-8` for mobile edge spacing. "New Task" button and FilterBar should stack vertically on very narrow viewports if they overflow.
  - `apps/web/src/components/tasks/TaskItem.tsx`: Ensure task row layout doesn't overflow at 360px. Action buttons (Edit, Delete) should be accessible — consider placing them below the title/description on mobile using `flex-wrap` or a stacked layout. Touch targets must be at least 44x44px.
  - `apps/web/src/components/tasks/TaskModal.tsx`: Verify modal content doesn't overflow on 360px. Ensure `mx-4` provides edge spacing. Consider `max-h-[90vh] overflow-y-auto` for content that exceeds viewport height.
  - `apps/web/src/components/tasks/TaskForm.tsx`: Verify title input and description textarea are full-width. Buttons should be full-width on mobile (`w-full sm:w-auto`).
  - `apps/web/src/components/tasks/FilterBar.tsx`: Verify filter buttons don't overflow at 360px. Use `flex-wrap gap-2` if needed.
  - `apps/web/src/components/tasks/Pagination.tsx`: Verify Previous/Next buttons and page indicator fit at 360px.

**Checkpoint**: All interactions usable at 360px+ viewports.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final quality improvements that span multiple user stories

- [x] T017 [P] Add loading skeleton/spinner for initial task list fetch in `apps/web/src/app/dashboard/page.tsx`. Show a simple "Loading..." text or spinner animation during the first fetch (when tasks array is empty and loading is true). Use `animate-pulse` Tailwind class for a subtle skeleton effect on 3–4 placeholder rows.

- [x] T018 [P] Add error banner dismiss functionality in `apps/web/src/app/dashboard/page.tsx`. The error message should be dismissible — add an X button that clears the error state. Auto-dismiss after 5 seconds using `setTimeout` in a `useEffect` triggered by error state changes.

- [ ] T019 Run quickstart.md validation: start backend and frontend, sign in, verify all 10 verification steps from `specs/007-frontend-task-ui/quickstart.md` pass (empty state, create, toggle, edit, delete, pagination with 21+ tasks, filter, 360px viewport, 401 redirect on expired token, error messages on backend failure).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on T001 (types) — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 completion — MVP
- **US2 (Phase 4)**: Depends on US1 (needs dashboard page + TaskModal + TaskForm)
- **US3 (Phase 5)**: Depends on US1 (needs dashboard page + TaskItem)
- **US4 (Phase 6)**: Depends on US2 (needs modal infrastructure from create flow)
- **US5 (Phase 7)**: Depends on US1 (needs dashboard page + DeleteConfirm)
- **US6 (Phase 8)**: Depends on US1–US5 (responsive audit of all components)
- **Polish (Phase 9)**: Depends on US1–US6 completion

### User Story Dependencies

- **US1 (View Task List)**: Foundation only — no other story dependencies. **This is the MVP.**
- **US2 (Create Task)**: Depends on US1 (dashboard page must exist with modal state)
- **US3 (Toggle Completion)**: Depends on US1 (dashboard page must exist with task items)
- **US4 (Edit Task)**: Depends on US2 (reuses modal/form infrastructure)
- **US5 (Delete Task)**: Depends on US1 (dashboard page must exist with delete confirm)
- **US6 (Responsive)**: Depends on all prior stories (audit requires complete UI)

### Within Each User Story

- Components before page integration
- Page state before event handlers
- Core flow before error handling

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run in parallel
- **Phase 2**: T003, T004, T005, T006, T007 can ALL run in parallel (different files, no dependencies)
- **Phase 3**: T008, T009, T010 can run in parallel (different component files), then T011 integrates them
- **Phase 5 & 7**: US3 (toggle) and US5 (delete) could theoretically run in parallel since they modify different parts of page.tsx, but sequential is safer due to shared state
- **Phase 9**: T017 and T018 can run in parallel (different concerns in same file, but non-overlapping edits)

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Launch all foundational components in parallel (all different files):
Task: T003 "Build EmptyState component in apps/web/src/components/tasks/EmptyState.tsx"
Task: T004 "Build Pagination component in apps/web/src/components/tasks/Pagination.tsx"
Task: T005 "Build TaskModal component in apps/web/src/components/tasks/TaskModal.tsx"
Task: T006 "Build TaskForm component in apps/web/src/components/tasks/TaskForm.tsx"
Task: T007 "Build FilterBar component in apps/web/src/components/tasks/FilterBar.tsx"
```

## Parallel Example: Phase 3 (User Story 1)

```bash
# Launch US1 components in parallel:
Task: T008 "Build TaskItem component in apps/web/src/components/tasks/TaskItem.tsx"
Task: T009 "Build DeleteConfirm component in apps/web/src/components/tasks/DeleteConfirm.tsx"
Task: T010 "Build TaskList component in apps/web/src/components/tasks/TaskList.tsx"

# Then sequentially:
Task: T011 "Integrate all components into dashboard page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup (types + directory)
2. Complete Phase 2: Foundational components (EmptyState, Pagination, Modal, Form, Filter)
3. Complete Phase 3: User Story 1 (view task list on dashboard)
4. Complete Phase 4: User Story 2 (create tasks)
5. **STOP and VALIDATE**: Users can view and create tasks — functional MVP
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Building blocks ready
2. Add US1 (View) → Test independently → MVP (read-only)
3. Add US2 (Create) → Test independently → MVP (read + write)
4. Add US3 (Toggle) → Test independently → Core workflow complete
5. Add US4 (Edit) → Test independently → Full edit capability
6. Add US5 (Delete) → Test independently → Full CRUD
7. Add US6 (Responsive) → Audit and fix → Mobile-ready
8. Polish → Loading skeletons, error dismiss → Production quality

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No backend changes required — all tasks are frontend-only in `apps/web/src/`
- All components are `"use client"` (React client components)
- Styling follows existing codebase patterns exactly (zinc palette, Tailwind v4, dark mode)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
