"""
Task dataclass for the sorted todo application.

Represents a todo item in the in-memory task list.
"""

from dataclasses import dataclass


@dataclass
class Task:
    """
    Represents a todo item.

    Attributes:
        id: Unique sequential integer identifier
        title: Task title (1-200 characters, required)
        description: Optional task description (0-1000 characters)
        completed: Whether the task is completed (defaults to False)
    """
    id: int
    title: str
    description: str | None = None
    completed: bool = False
