# Research: Frontend Task UI

**Feature**: 007-frontend-task-ui
**Date**: 2026-02-07

## Research Areas

### 1. UI Pattern: Modal vs Inline for Task Create/Edit

**Decision**: Modal dialog pattern for both create and edit.

**Rationale**: The dashboard is a single-page experience — the task list is the primary view and should never be fully obscured. A modal overlays the form while preserving list context. On mobile (360px+), modals naturally scale to near-fullscreen, avoiding the navigation complexity of separate pages. The existing codebase has no router-based sub-pages under `/dashboard`, so adding modal state is simpler than adding new routes.

**Alternatives considered**:
- **Separate pages** (`/dashboard/tasks/new`, `/dashboard/tasks/[id]`): More Next.js-idiomatic but introduces unnecessary navigation for a simple two-field form. Users lose list context during creation. Rejected for complexity.
- **Inline accordion/expand**: Visually cluttered when editing one task while viewing others. Harder to make responsive. Rejected for UX.

### 2. State Management: React useState vs External Library

**Decision**: React `useState` + `useEffect` with a custom `useTasks` hook. No external state library.

**Rationale**: The task list is a single-page client component. State is local to the dashboard page. There's no cross-page state sharing requirement (out of scope: real-time sync, multi-tab). The existing codebase uses only `useState`/`useEffect` — introducing a state library adds unnecessary dependencies. A custom hook encapsulates fetch logic, pagination state, and filter state in a reusable, testable unit.

**Alternatives considered**:
- **React Query / TanStack Query**: Powerful caching and mutation management, but adds a dependency and complexity for a straightforward CRUD UI. The app doesn't need optimistic updates across multiple views or cache invalidation strategies. Rejected for over-engineering.
- **Zustand / Jotai**: Global state is unnecessary when state is scoped to one page. Rejected.
- **useReducer**: Viable for complex state transitions but `useState` is sufficient for pagination + filter + task list. Can refactor later if state grows.

### 3. Optimistic Updates vs Loading States

**Decision**: Loading states (not optimistic updates) for create, edit, and delete. Immediate optimistic update only for completion toggle.

**Rationale**:
- **Completion toggle** is high-frequency and low-risk — the user expects instant feedback and the PATCH is nearly always successful. An optimistic update (toggle UI immediately, revert on failure) provides the best UX.
- **Create/edit/delete** involve form submissions where the user already expects a brief wait. A loading spinner on the submit button is sufficient. Optimistic updates for these operations add complexity (rollback logic, list re-ordering) without meaningful UX improvement.

**Alternatives considered**:
- **Full optimistic everywhere**: More complex error handling (undo inserted tasks, restore deleted tasks). Risk of confusing users if server rejects but UI already updated. Rejected for complexity vs value.
- **No optimistic anywhere**: Completion toggle feels sluggish. Rejected for poor UX.

### 4. Task List Architecture: Single Page vs Separate Route

**Decision**: Replace the existing dashboard page content with the task list UI directly on `/dashboard`.

**Rationale**: The current dashboard page is a placeholder (shows session info + backend verification). The spec says "an authenticated user lands on the dashboard and sees their task list." The task list IS the dashboard for Phase II. No need for a separate `/dashboard/tasks` route. The existing layout (header with branding + sign-out) remains unchanged.

**Alternatives considered**:
- **Add `/dashboard/tasks` route**: Creates unnecessary navigation. The user would land on an empty dashboard and need to click to tasks. Rejected — the task list is the main content.
- **Tab-based dashboard**: Over-engineering for Phase II which has only tasks. Could be introduced in later phases if more dashboard sections are needed.

### 5. Pagination UX

**Decision**: Page-number based navigation with Previous/Next buttons and current page indicator.

**Rationale**: The backend returns `page`, `total_pages`, `total`, `per_page` — a page-number scheme maps directly to the API. Simple Previous/Next with "Page X of Y" is accessible, responsive, and easy to implement. No need for infinite scroll (out of scope: search, real-time sync).

**Alternatives considered**:
- **Infinite scroll**: Better for social-feed UIs but inappropriate for a task manager where users want to see specific ranges. Also harder to implement correctly with filters.
- **Load-more button**: Loses the ability to jump to a specific page. Rejected.

### 6. Delete Confirmation Pattern

**Decision**: Inline confirmation within the task row — replace delete button with "Confirm delete? Yes / Cancel" text.

**Rationale**: A modal for deletion adds two layers of modals (if the user is already in an edit modal). Inline confirmation is lightweight, doesn't require a separate component, and is mobile-friendly. The task title is visible in context so the user knows which task they're confirming.

**Alternatives considered**:
- **Browser `confirm()` dialog**: Works but is not styled, looks jarring, and blocks the main thread. Rejected for UX quality.
- **Modal dialog**: Heavy for a simple yes/no decision. Risk of modal-on-modal if deleting from edit view. Rejected.

### 7. Error Display Pattern

**Decision**: Toast-style error banner at the top of the task list area. Field-level errors for form validation.

**Rationale**: API errors (network failures, 401, 500) are best shown as a non-blocking banner that auto-dismisses or can be manually dismissed. Form validation errors (empty title, max length) are shown inline below the specific field, matching the auth page pattern. This two-tier approach separates client validation from server errors.

**Alternatives considered**:
- **Alert() dialog**: Blocks interaction. Rejected.
- **Error state replacing content**: Too disruptive — a temporary network error shouldn't wipe the entire task list. Rejected.

### 8. 401 Handling

**Decision**: Centralized 401 detection in a wrapper around `apiFetch` or in the `useTasks` hook. On 401, call `signOut()` and redirect to `/auth/signin`.

**Rationale**: The existing `apiFetch` helper returns the raw Response — it doesn't handle 401. Rather than modifying `apiFetch` (which other features may depend on), 401 detection is handled in the `useTasks` hook. If any API call returns 401, the user's session has expired and they should be sent to sign-in. The middleware already protects server-side rendering, but client-side API calls can still receive 401 when the JWT expires (15-minute window).

**Alternatives considered**:
- **Modify `apiFetch` globally**: Risk of side effects for other features. Better Auth may handle token refresh automatically. Rejected for blast radius.
- **Per-call 401 checks**: Repetitive and error-prone. A centralized check in the hook is DRY.

### 9. Rapid Toggle Debouncing

**Decision**: Debounce completion toggle with a 300ms delay. Only send the final state to the backend.

**Rationale**: If a user rapidly clicks the checkbox, each click toggles local state immediately (optimistic) but the API call is debounced. Only the last toggle value is sent. This prevents race conditions where multiple PATCH requests arrive out of order.

**Alternatives considered**:
- **Disable button during request**: Feels unresponsive. Users expect instant toggles.
- **No debounce, let requests race**: Risk of final state being wrong if an earlier request completes after a later one. Rejected for correctness.
