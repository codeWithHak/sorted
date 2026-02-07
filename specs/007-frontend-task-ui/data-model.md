# Data Model: Frontend Task UI

**Feature**: 007-frontend-task-ui
**Date**: 2026-02-07

## Frontend TypeScript Types

This feature is frontend-only. No new backend models or database changes are needed. The following TypeScript interfaces mirror the backend API contract defined in `specs/006-task-crud-api/contracts/tasks-api.yaml`.

### Task (read model)

| Field | Type | Description |
|-------|------|-------------|
| id | `string` | UUID assigned by backend |
| title | `string` | Task title (1–200 chars) |
| description | `string \| null` | Optional description (up to 2,000 chars) |
| completed | `boolean` | Whether the task is marked complete |
| created_at | `string` | ISO 8601 datetime from backend |
| updated_at | `string` | ISO 8601 datetime from backend |

### TaskCreateInput (write model — POST)

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| title | `string` | Yes | 1–200 characters |
| description | `string` | No | 0–2,000 characters |

### TaskUpdateInput (write model — PATCH)

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| title | `string` | No | 1–200 characters if provided |
| description | `string` | No | 0–2,000 characters if provided |
| completed | `boolean` | No | — |

### TaskListResponse (paginated list response)

| Field | Type | Description |
|-------|------|-------------|
| data | `Task[]` | Array of tasks for the current page |
| total | `number` | Total number of tasks matching filter |
| page | `number` | Current page number (1-indexed) |
| per_page | `number` | Items per page |
| total_pages | `number` | Total pages available |

### Filter State (client-only)

| Field | Type | Description |
|-------|------|-------------|
| filter | `"all" \| "active" \| "completed"` | Current filter selection |
| page | `number` | Current page (1-indexed) |

### Relationships

- Each `Task` belongs to one user (enforced by backend; frontend never sees or sends `user_id`)
- `TaskListResponse` contains zero or more `Task` objects
- Filter state maps to the `completed` query parameter: `"all"` → omitted, `"active"` → `false`, `"completed"` → `true`

### State Transitions

```
Task states: Active ↔ Completed (toggle via PATCH {completed: true/false})
Task lifecycle: Created → Active/Completed → Soft-deleted (removed from UI)
```

No new database tables, columns, or migrations are required.
