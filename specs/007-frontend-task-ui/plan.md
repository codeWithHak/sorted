# Implementation Plan: Frontend Task UI

**Branch**: `007-frontend-task-ui` | **Date**: 2026-02-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/007-frontend-task-ui/spec.md`

## Summary

Build the frontend task management UI that transforms the authenticated dashboard into a fully functional CRUD interface. The frontend consumes the existing Task CRUD API (feature 006) via the `apiFetch` helper. The implementation adds TypeScript types mirroring the API contract, replaces the dashboard placeholder with a paginated/filterable task list, and provides modal-based create/edit forms — all styled with Tailwind CSS v4 and responsive from 360px+. No backend changes required.

## Technical Context

**Language/Version**: TypeScript (Next.js 16+, React 19)
**Primary Dependencies**: Next.js 16.1.2, React 19.2.3, better-auth ^1.4.18, Tailwind CSS 4
**Storage**: N/A (frontend-only; backend handles persistence)
**Testing**: Manual browser testing at 360px, 768px, 1024px viewports; Playwright E2E in future
**Target Platform**: Web browser (desktop + mobile, 360px+)
**Project Type**: Web application (monorepo: `apps/web/`)
**Performance Goals**: Task list renders within 1 second of page load
**Constraints**: No new npm dependencies; Tailwind CSS only (no component library); no backend changes
**Scale/Scope**: Single page (dashboard) with ~8 new component files and 1 type definition file

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| Readability Over Cleverness | PASS | Simple useState/useEffect patterns; no complex abstractions |
| Async-First Design | PASS | All API calls async via apiFetch; completion toggle uses debounce |
| Security by Default | PASS | JWT auth via apiFetch; 401 → sign-out; no user input rendered as HTML |
| Phase-Based Evolution | PASS | Phase II frontend; no Phase III+ features (search, tags, etc.) |
| Spec-Driven Development | PASS | All implementation references spec.md requirements |
| Code Style (PEP8/ESLint) | PASS | TypeScript strict mode; follows existing patterns |
| Error Handling | PASS | All async ops have error handling; user-friendly messages |
| Performance (200ms simple, 500ms complex) | PASS | Single API call per interaction; no complex queries |

**Post-design re-check**: PASS — no violations introduced during Phase 1 design.

## Project Structure

### Documentation (this feature)

```text
specs/007-frontend-task-ui/
├── spec.md
├── plan.md                  # This file
├── research.md              # Phase 0 output
├── data-model.md            # Phase 1 output
├── quickstart.md            # Phase 1 output
├── checklists/
│   └── requirements.md      # Spec quality checklist
├── contracts/
│   └── frontend-api-usage.md # How frontend consumes the Task API
└── tasks.md                 # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
apps/web/src/
├── app/
│   ├── dashboard/
│   │   ├── layout.tsx              # Existing — no changes
│   │   └── page.tsx                # MODIFIED — replace placeholder with task list
│   └── ...                         # Other routes unchanged
├── components/
│   └── tasks/
│       ├── TaskList.tsx            # NEW — paginated list container
│       ├── TaskItem.tsx            # NEW — single task row (title, status, actions)
│       ├── TaskForm.tsx            # NEW — create/edit form fields + validation
│       ├── TaskModal.tsx           # NEW — modal wrapper for create/edit
│       ├── DeleteConfirm.tsx       # NEW — inline delete confirmation
│       ├── Pagination.tsx          # NEW — page navigation controls
│       ├── FilterBar.tsx           # NEW — all/active/completed toggle
│       └── EmptyState.tsx          # NEW — empty list guidance
└── lib/
    └── types/
        └── task.ts                 # NEW — TypeScript types for API contract
```

**Structure Decision**: Components live in `apps/web/src/components/tasks/` following co-location pattern. Types go in `apps/web/src/lib/types/` alongside existing lib files. The dashboard page (`page.tsx`) is the only modified file — it becomes the task list orchestrator. The dashboard layout (`layout.tsx`) is unchanged (header/sign-out already correct).

## Component Architecture

### Data Flow

```
Dashboard Page (page.tsx)
  ├── State: tasks[], page, filter, loading, error
  ├── Effects: fetch tasks on mount / page change / filter change
  │
  ├── FilterBar → sets filter state, resets page to 1
  ├── TaskList
  │   ├── TaskItem (for each task)
  │   │   ├── Checkbox → PATCH toggle (optimistic, debounced)
  │   │   ├── Edit button → opens TaskModal (edit mode)
  │   │   └── Delete button → shows DeleteConfirm inline
  │   │       └── Confirm/Cancel → DELETE or dismiss
  │   └── EmptyState (when tasks.length === 0)
  ├── Pagination → sets page state
  └── "New Task" button → opens TaskModal (create mode)
      └── TaskForm → POST /tasks
```

### Component Responsibilities

| Component | Props | Responsibility |
|-----------|-------|----------------|
| `page.tsx` | — | Orchestrates state, fetches data, handles 401 |
| `FilterBar` | filter, onFilterChange | Renders All/Active/Completed toggle buttons |
| `TaskList` | tasks, onToggle, onEdit, onDelete | Maps tasks to TaskItem components |
| `TaskItem` | task, onToggle, onEdit, onDelete | Renders one task row with title, description snippet, checkbox, action buttons |
| `TaskModal` | mode (create/edit), task?, onSave, onClose | Modal overlay with TaskForm inside |
| `TaskForm` | mode, task?, onSubmit, error, loading | Title + description fields with validation |
| `DeleteConfirm` | taskTitle, onConfirm, onCancel | Inline "Delete [title]? Confirm / Cancel" |
| `Pagination` | page, totalPages, onPageChange | Previous/Next buttons + "Page X of Y" |
| `EmptyState` | onCreateClick | "No tasks yet" message + create button |

### State Shape (page.tsx)

```typescript
// API data
tasks: Task[]
total: number
totalPages: number

// UI state
page: number              // current page (1-indexed)
filter: "all" | "active" | "completed"
loading: boolean          // initial load + refetch
error: string             // API error message

// Modal state
modalMode: "create" | "edit" | null
editingTask: Task | null  // task being edited (null for create)
modalLoading: boolean     // form submission in progress
modalError: string        // form-level API error

// Delete state
deletingTaskId: string | null  // task showing delete confirmation
deleteLoading: boolean
```

## Key Design Decisions

### 1. Dashboard IS the Task List
The existing dashboard page (`/dashboard`) is replaced — not augmented with sub-routes. The task list is the primary authenticated experience for Phase II. See [research.md](research.md) §4.

### 2. Modal for Create/Edit
Both create and edit use a modal overlay. This keeps the user on the task list page and works well on mobile. The same `TaskForm` component handles both modes, pre-populated with task data in edit mode. See [research.md](research.md) §1.

### 3. Optimistic Toggle, Loading for Everything Else
Completion toggle updates the UI immediately and debounces the API call (300ms). Create, edit, and delete show loading indicators while the request is in flight. See [research.md](research.md) §3.

### 4. Inline Delete Confirmation
Delete confirmation replaces the delete button with "Confirm / Cancel" text within the task row. No additional modal. See [research.md](research.md) §6.

### 5. Centralized 401 Handling
All API responses are checked for 401 in the dashboard page. On 401, the user is signed out and redirected to `/auth/signin`. See [research.md](research.md) §8.

### 6. No New Dependencies
No component library, no state management library, no form library. All UI built with Tailwind CSS utility classes and React useState/useEffect. Matches the existing codebase pattern.

## Styling Approach

Follows existing codebase conventions exactly:

| Element | Classes |
|---------|---------|
| Container | `mx-auto max-w-3xl p-8` (matches dashboard) |
| Input | `rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400` |
| Primary button | `rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200` |
| Secondary button | `rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800` |
| Error text | `text-sm text-red-600 dark:text-red-400` |
| Card/row border | `border-b border-zinc-200 dark:border-zinc-800` |
| Muted text | `text-sm text-zinc-500 dark:text-zinc-400` |
| Modal backdrop | `fixed inset-0 bg-black/50 flex items-center justify-center` |
| Modal content | `mx-4 w-full max-w-lg rounded-lg bg-white p-6 dark:bg-zinc-900` |
| Checkbox | `h-5 w-5 rounded border-zinc-300 accent-zinc-900 dark:accent-zinc-100` |
| Filter active | `bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900` |
| Filter inactive | `text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100` |

### Responsive Breakpoints

- **Mobile (360px+)**: Single column, full-width task rows, stacked form fields, modal fills width
- **Tablet (640px+)**: Same as mobile (content is narrow enough)
- **Desktop (1024px+)**: Centered max-w-3xl container with comfortable margins

No explicit breakpoint media queries needed — the `max-w-3xl` centered layout works across all sizes. Modal uses `mx-4` on mobile for edge spacing.

## Complexity Tracking

No constitution violations. No complexity justifications needed.

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| New files | 9 (8 components + 1 type def) | Each component has a single responsibility |
| Modified files | 1 (dashboard page.tsx) | Minimal blast radius |
| New dependencies | 0 | Constitution: no unnecessary dependencies |
| New routes | 0 | Dashboard IS the task list |
| Backend changes | 0 | Frontend-only feature |
