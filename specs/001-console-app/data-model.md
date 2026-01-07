# Data Model: Console Todo App

**Feature**: Console Todo App (Phase I)
**Date**: 2025-12-07
**Status**: Complete

## Entities

### Task

Represents a todo item in the in-memory task list.

**Attributes**:

| Attribute | Type | Required | Description | Validation Rules |
|-----------|------|----------|-------------|----------------|
| id | int | Yes | Positive integer, unique across all tasks, auto-incremented from 1 |
| title | str | Yes | 1-200 characters, not empty after stripping whitespace |
| description | str | No | 0-1000 characters, can be empty or None |
| completed | bool | Yes | False by default on creation |

**Validation Rules**:
- Title cannot be empty or whitespace-only
- Title maximum length: 200 characters
- Description maximum length: 1000 characters
- ID is unique and sequential starting from 1

## State Transitions

### Task Lifecycle

```
        [Created] → [Active] → [Completed]
                        ↓
                     [Active] (if completed toggled back)
```

**Transitions**:

| From State | To State | Trigger | Business Rule |
|------------|-----------|--------|--------------|
| None | Active | User creates task with valid title | Task gets next sequential ID |
| Active | Completed | User runs complete command on valid ID | completed flag set to True |
| Completed | Active | User runs complete command on valid ID | completed flag set to False |
| Active | None | User deletes task with confirmation | Task removed from list |
| Completed | None | User deletes task with confirmation | Task removed from list |

**Invalid Transitions** (prevent by validation):
- Cannot modify non-existent task ID
- Cannot complete non-existent task ID
- Cannot delete non-existent task ID
- Cannot create task with empty title

## Invariants

1. **ID Uniqueness**: No two tasks share the same ID at any time
2. **Sequential IDs**: New tasks always receive the next highest ID + 1
3. **Title Required**: All tasks have non-empty titles
4. **Default State**: New tasks are always created with completed = False
5. **Session Isolation**: Task list exists only in memory during application session

## Data Structures

### Python Implementation Guidance

**Recommended Structure**:

```python
from dataclasses import dataclass

@dataclass
class Task:
    id: int
    title: str
    description: str | None
    completed: bool = False
```

**In-Memory Storage**:

```python
# Module-level task list
tasks: list[Task] = []
next_id: int = 1

def create_task(title: str, description: str | None = None) -> Task:
    global tasks, next_id
    task = Task(id=next_id, title=title, description=description)
    tasks.append(task)
    next_id += 1
    return task

def get_task(task_id: int) -> Task | None:
    global tasks
    for task in tasks:
        if task.id == task_id:
            return task
    return None
```

**Rationale**:
- `dataclass` provides clean type hints and __init__ generation
- Global `tasks` list is simple, O(1) for append/iteration
- `next_id` counter ensures unique sequential IDs
- Functions are simple and follow KISS principle

## Relationships

No relationships exist in Phase I (single user, in-memory).
