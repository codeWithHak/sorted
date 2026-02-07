# Quickstart: Frontend Task UI

**Feature**: 007-frontend-task-ui
**Branch**: `007-frontend-task-ui`

## Prerequisites

1. Backend API running on port 8000 (`services/api/`)
2. Frontend running on port 3000 (`apps/web/`)
3. Neon PostgreSQL database configured
4. At least one user account created via sign-up

## Setup

```bash
# Switch to the feature branch
git checkout 007-frontend-task-ui

# Install frontend dependencies (if needed)
cd apps/web && npm install

# Ensure .env is configured
# NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
# NEXT_PUBLIC_API_URL=http://localhost:8000
# API_BASE_URL=http://localhost:8000
# AUTH_DATABASE_URL=postgresql://...
# BETTER_AUTH_SECRET=...

# Start backend
cd ../../services/api && uv run uvicorn src.api.main:app --reload --port 8000

# Start frontend (separate terminal)
cd apps/web && npm run dev
```

## New Files Created

```
apps/web/src/
├── lib/
│   └── types/
│       └── task.ts            # TypeScript types for Task API contract
├── app/
│   └── dashboard/
│       └── page.tsx           # Replaced: task list + CRUD UI (was placeholder)
└── components/
    └── tasks/
        ├── TaskList.tsx        # Paginated task list with filter controls
        ├── TaskItem.tsx        # Single task row with toggle + actions
        ├── TaskForm.tsx        # Create/edit form (used in modal)
        ├── TaskModal.tsx       # Modal wrapper for create/edit
        ├── DeleteConfirm.tsx   # Inline delete confirmation
        ├── Pagination.tsx      # Page navigation controls
        ├── FilterBar.tsx       # All/Active/Completed filter toggle
        └── EmptyState.tsx      # Empty list guidance
```

## Files Modified

```
apps/web/src/app/dashboard/page.tsx    # Replaced placeholder with task list
```

## Verification

1. Sign in at `http://localhost:3000/auth/signin`
2. Navigate to `/dashboard`
3. Verify empty state appears if no tasks exist
4. Create a task — it should appear in the list
5. Toggle completion — checkbox should update immediately
6. Edit a task — changes should persist
7. Delete a task — confirmation should appear, then task removed
8. Create 21+ tasks — pagination controls should appear
9. Use filter toggle — list should narrow correctly
10. Resize browser to 360px — all controls should remain usable
