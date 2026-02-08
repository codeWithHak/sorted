# Agent Tools Contract

**Feature**: 009-ai-todo-chatbot
**Date**: 2026-02-08

## Tool Interface Specification

All tools are registered as `@function_tool` on the Jett agent. Each tool receives `RunContextWrapper[ChatContext]` as its first parameter (hidden from the LLM) and returns `str`.

---

### add_task

**Purpose**: Create a new task for the authenticated user.

```
Parameters:
  title: str (required) — Task title, 1-200 characters
  description: str | None (optional) — Task description, max 2000 characters

Returns: str — JSON with created task details
  Success: '{"id": "uuid", "title": "...", "completed": false, "created_at": "..."}'
  Error: '{"error": "VALIDATION_ERROR", "message": "...", "suggestion": "..."}'
```

---

### list_tasks

**Purpose**: List the user's active tasks with optional filtering.

```
Parameters:
  completed: bool | None (optional) — Filter: true=completed, false=pending, omit=all

Returns: str — JSON array of tasks
  Success: '{"tasks": [...], "total": 5}'
  Empty: '{"tasks": [], "total": 0}'
```

---

### complete_task

**Purpose**: Mark a task as completed.

```
Parameters:
  task_id: str (required) — UUID of the task to complete

Returns: str — JSON with updated task
  Success: '{"id": "uuid", "title": "...", "completed": true}'
  Error: '{"error": "NOT_FOUND", "message": "No task found with that ID.", "suggestion": "Use list_tasks to find valid task IDs."}'
```

---

### update_task

**Purpose**: Update a task's title or description.

```
Parameters:
  task_id: str (required) — UUID of the task to update
  title: str | None (optional) — New title, 1-200 characters
  description: str | None (optional) — New description, max 2000 characters

Returns: str — JSON with updated task
  Success: '{"id": "uuid", "title": "...", "description": "..."}'
  Error: '{"error": "NOT_FOUND", "message": "...", "suggestion": "..."}'
```

---

### delete_task

**Purpose**: Soft-delete a task.

```
Parameters:
  task_id: str (required) — UUID of the task to delete

Returns: str — JSON confirmation
  Success: '{"status": "deleted", "task_id": "uuid", "title": "..."}'
  Error: '{"error": "NOT_FOUND", "message": "No task found with that ID.", "suggestion": "The task may have already been deleted. Try listing your tasks."}'
```

---

## Error Response Format

All tool errors follow this structure for agent recovery:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable description of what went wrong.",
  "suggestion": "What the agent should do next or tell the user."
}
```

Error codes: `NOT_FOUND`, `VALIDATION_ERROR`, `INVALID_ID`, `DATABASE_ERROR`

## Context Object

```python
@dataclass
class ChatContext:
    user_id: str              # Authenticated user's UUID
    thread_id: str            # Current conversation thread ID
    tasks_modified: bool      # Set to True when a tool modifies tasks
    modified_tasks: list      # List of (action_type, task_id, task_title) tuples
```
