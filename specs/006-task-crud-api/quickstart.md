# Quickstart: Task CRUD API

**Feature**: 006-task-crud-api | **Date**: 2026-02-07

## Prerequisites

- Python 3.13+ with UV package manager
- Neon PostgreSQL database (existing from feature 004)
- Better Auth configured (existing from feature 005)
- `.env` file in `services/api/` with `DATABASE_URL`

## Setup

```bash
# Navigate to backend
cd services/api

# Install dependencies (including new dev dependencies)
uv sync --all-groups

# Handle updated_at migration (dev only — no prod data)
# Option A: Drop and recreate tasks table
# Option B: ALTER TABLE tasks ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT NOW();

# Start the API server
uv run uvicorn src.api.main:app --reload --port 8000
```

## Run Tests

```bash
cd services/api
uv run pytest tests/ -v
```

## Verify Endpoints

### 1. Authenticate (via Better Auth)

Get a JWT token by signing in through the Next.js frontend or directly:

```bash
# Start Next.js frontend
cd apps/web && npm run dev

# Sign in at http://localhost:3000/sign-in
# Extract JWT from browser cookies/headers
TOKEN="your-jwt-token-here"
```

### 2. Create a Task

```bash
curl -s -X POST http://localhost:8000/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs, bread"}' | jq
```

Expected: 201 with task object containing `id`, `title`, `description`, `completed=false`, `created_at`, `updated_at`.

### 3. List Tasks

```bash
curl -s http://localhost:8000/tasks \
  -H "Authorization: Bearer $TOKEN" | jq
```

Expected: 200 with `{"data": [...], "total": N, "page": 1, "per_page": 20, "total_pages": N}`.

### 4. Get Single Task

```bash
TASK_ID="uuid-from-create-response"
curl -s http://localhost:8000/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN" | jq
```

Expected: 200 with task object.

### 5. Update Task

```bash
curl -s -X PATCH http://localhost:8000/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}' | jq
```

Expected: 200 with updated task, `completed=true`, `updated_at` changed.

### 6. Delete Task

```bash
curl -s -X DELETE http://localhost:8000/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN" -w "\n%{http_code}\n"
```

Expected: 204 with no body.

### 7. Verify Deletion

```bash
curl -s http://localhost:8000/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN" | jq
```

Expected: 404 `{"detail": "Task not found"}`.
