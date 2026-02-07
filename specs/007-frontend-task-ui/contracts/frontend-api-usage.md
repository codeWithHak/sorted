# Frontend API Usage Contract

**Feature**: 007-frontend-task-ui
**Date**: 2026-02-07

This document defines how the frontend consumes the existing Task CRUD API. No new backend endpoints are created. All requests use the `apiFetch` helper which injects the JWT Bearer token.

## Endpoints Consumed

### List Tasks

```
GET /tasks?page={page}&per_page=20&completed={completed}
```

| Parameter | Type | Default | Notes |
|-----------|------|---------|-------|
| page | integer | 1 | 1-indexed |
| per_page | integer | 20 | Fixed at 20 for this UI |
| completed | boolean | (omitted) | Omit for "all", `true` for completed, `false` for active |

**Response** (200):
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string | null",
      "completed": false,
      "created_at": "2026-02-07T10:00:00Z",
      "updated_at": "2026-02-07T10:00:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "per_page": 20,
  "total_pages": 2
}
```

**Frontend behavior**: Called on page load, on page change, and on filter change. Pagination resets to page 1 when filter changes.

---

### Create Task

```
POST /tasks
Content-Type: application/json

{ "title": "string", "description": "string (optional)" }
```

**Response** (201): `TaskResponse` (the created task)

**Frontend behavior**: On success, prepend the new task to the list and reset the create form. If on a filtered view (e.g., "completed"), re-fetch the list since the new task may not match the filter.

---

### Toggle Completion / Update Task

```
PATCH /tasks/{task_id}
Content-Type: application/json

{ "completed": true }       // for toggle
{ "title": "new", ... }     // for edit
```

**Response** (200): `TaskResponse` (the updated task)

**Frontend behavior**:
- **Toggle**: Optimistic update — flip the checkbox immediately, debounce 300ms, send final state. On failure, revert.
- **Edit**: Loading state on save button. On success, update the task in the list and close the edit modal.

---

### Delete Task

```
DELETE /tasks/{task_id}
```

**Response** (204): No content

**Frontend behavior**: Remove the task from the local list after confirmation. If the current page is now empty and page > 1, navigate to page - 1.

---

## Error Handling

| Status | Meaning | Frontend Action |
|--------|---------|-----------------|
| 401 | JWT expired/invalid | Sign out and redirect to `/auth/signin` |
| 404 | Task not found or belongs to another user | Show "Task not found" error |
| 422 | Validation error | Show field-level error messages from `detail[].msg` |
| 500 | Server error | Show "Something went wrong. Please try again." |
| Network error | Backend unreachable | Show "Unable to connect. Check your connection." |

## Request Flow

```
User Action → Component State Change → apiFetch() → Next.js Proxy → FastAPI Backend
                                                ↓
                                        JWT injected via
                                        authClient.token()
```

The Next.js proxy (`next.config.ts`) rewrites `/api/:path((?!auth).*)` to `${API_BASE_URL}/:path*`, routing task API calls to FastAPI while preserving Better Auth routes.
