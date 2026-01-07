"""
Task storage and retrieval service for the sorted todo application.

All tasks are stored in memory during the application session.
"""

from typing import TYPE_CHECKING

from src.models.task import Task

if TYPE_CHECKING:
    from collections.abc import Callable

# Module-level in-memory storage
tasks: list[Task] = []
next_id: int = 1


def create_task(title: str, description: str | None = None) -> Task:
    """
    Create a new task and add it to the task list.

    Args:
        title: Task title (required)
        description: Optional task description

    Returns:
        The created Task object

    Raises:
        ValueError: If title is empty or whitespace-only
    """
    global tasks, next_id

    if not title or not title.strip():
        raise ValueError("Task title cannot be empty")

    task = Task(id=next_id, title=title.strip(), description=description)
    tasks.append(task)
    next_id += 1
    return task


def get_task(task_id: int) -> Task | None:
    """
    Find a task by its ID.

    Args:
        task_id: The task ID to search for

    Returns:
        The Task if found, None otherwise
    """
    for task in tasks:
        if task.id == task_id:
            return task
    return None


def update_task(
    task_id: int,
    title: str | None = None,
    description: str | None = None,
) -> Task | None:
    """
    Update a task's title and/or description.

    Args:
        task_id: The task ID to update
        title: New title (optional)
        description: New description (optional)

    Returns:
        The updated Task if found, None otherwise
    """
    task = get_task(task_id)
    if task is None:
        return None

    if title is not None:
        if not title or not title.strip():
            raise ValueError("Task title cannot be empty")
        task.title = title.strip()
    if description is not None:
        task.description = description

    return task


def toggle_complete(task_id: int) -> Task | None:
    """
    Toggle a task's completion status.

    Args:
        task_id: The task ID to toggle

    Returns:
        The updated Task if found, None otherwise
    """
    task = get_task(task_id)
    if task is None:
        return None

    task.completed = not task.completed
    return task


def delete_task(task_id: int) -> bool:
    """
    Delete a task from the task list.

    Args:
        task_id: The task ID to delete

    Returns:
        True if task was deleted, False if not found
    """
    global tasks

    for i, task in enumerate(tasks):
        if task.id == task_id:
            tasks.pop(i)
            return True
    return False


def list_tasks() -> list[Task]:
    """
    Get all tasks.

    Returns:
        List of all tasks in memory
    """
    return tasks.copy()


def task_exists(task_id: int) -> bool:
    """
    Check if a task with the given ID exists.

    Args:
        task_id: The task ID to check

    Returns:
        True if task exists, False otherwise
    """
    return get_task(task_id) is not None
