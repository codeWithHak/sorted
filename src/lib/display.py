"""
Display utilities for the sorted todo application.

Provides formatted output for task lists and messages.
"""

from src.models.task import Task


def format_task(task: Task) -> str:
    """
    Format a single task for display.

    Args:
        task: The Task to format

    Returns:
        Formatted string representation of the task
    """
    status = "[✓]" if task.completed else "[ ]"
    description_text = f": {task.description}" if task.description else ""
    return f"{status} {task.id}: {task.title}{description_text}"


def format_task_list(tasks: list[Task]) -> str:
    """
    Format all tasks for display.

    Args:
        tasks: List of tasks to format

    Returns:
        Formatted string representation of all tasks
    """
    if not tasks:
        return "\nNo tasks found. Use 'add' to create a task."

    lines = ["\nYour Tasks:"]
    for task in tasks:
        lines.append(format_task(task))
    lines.append("")
    return "\n".join(lines)


def format_help() -> str:
    """
    Display help information with all available commands.

    Returns:
        Formatted help string
    """
    return """
Available Commands:
  add "Task Title"                    Add a new task
  add "Task Title" "Description"        Add a task with description
  list                               Display all tasks
  complete <task_id>                  Toggle task completion
  update <task_id> "New Title"        Update task title
  update <task_id> "Title" "Desc"     Update task title and description
  delete <task_id>                    Delete a task
  help                               Show this help message
  exit / quit                         Exit the application
"""


def format_error(message: str) -> str:
    """
    Format an error message.

    Args:
        message: The error message to format

    Returns:
        Formatted error string
    """
    return f"\nError: {message}\nType 'help' for available commands.\n"
