"""
Command handlers for the sorted todo application.

Each function handles a specific user command.
"""

import sys

from src.lib import display
from src.services import task_service


def handle_add(user_input: str) -> None:
    """
    Handle the 'add' command to create a new task.

    Usage: add "Task Title" or add "Task Title" "Description"
    """
    parts = user_input.strip().split(maxsplit=2)
    title = parts[1] if len(parts) > 1 else None
    description = parts[2] if len(parts) > 2 else None

    if not title:
        print(display.format_error("Task title is required"))
        return

    try:
        task = task_service.create_task(title, description)
        print(f"\nTask {task.id} created successfully!")
    except ValueError as e:
        print(display.format_error(str(e)))


def handle_list(_user_input: str) -> None:
    """
    Handle the 'list' command to display all tasks.

    Usage: list
    """
    tasks = task_service.list_tasks()
    print(display.format_task_list(tasks))


def handle_complete(user_input: str) -> None:
    """
    Handle the 'complete' command to toggle task completion.

    Usage: complete <task_id>
    """
    parts = user_input.strip().split()

    if len(parts) < 2:
        print(display.format_error("Task ID is required"))
        return

    try:
        task_id = int(parts[1])
    except ValueError:
        print(display.format_error("Task ID must be a number"))
        return

    if not task_service.task_exists(task_id):
        print(display.format_error(f"Task {task_id} not found"))
        print(f"Available task IDs: {[t.id for t in task_service.list_tasks()]}")
        return

    task = task_service.toggle_complete(task_id)
    status = "completed" if task.completed else "uncompleted"
    print(f"\nTask {task_id} marked as {status}!")


def handle_update(user_input: str) -> None:
    """
    Handle the 'update' command to modify a task.

    Usage: update <task_id> "New Title" or update <task_id> "Title" "Description"
    """
    parts = user_input.strip().split(maxsplit=3)

    if len(parts) < 3:
        print(display.format_error("Task ID and new title are required"))
        return

    try:
        task_id = int(parts[1])
    except ValueError:
        print(display.format_error("Task ID must be a number"))
        return

    if not task_service.task_exists(task_id):
        print(display.format_error(f"Task {task_id} not found"))
        print(f"Available task IDs: {[t.id for t in task_service.list_tasks()]}")
        return

    new_title = parts[2]
    new_description = parts[3] if len(parts) > 3 else None

    task = task_service.update_task(task_id, new_title, new_description)
    print(f"\nTask {task_id} updated successfully!")


def handle_delete(user_input: str) -> None:
    """
    Handle the 'delete' command to remove a task.

    Usage: delete <task_id>
    """
    parts = user_input.strip().split()

    if len(parts) < 2:
        print(display.format_error("Task ID is required"))
        return

    try:
        task_id = int(parts[1])
    except ValueError:
        print(display.format_error("Task ID must be a number"))
        return

    if not task_service.task_exists(task_id):
        print(display.format_error(f"Task {task_id} not found"))
        print(f"Available task IDs: {[t.id for t in task_service.list_tasks()]}")
        return

    print(f"\nAre you sure you want to delete task {task_id}? (yes/no)")
    confirmation = input("> ").strip().lower()

    if confirmation in ("yes", "y"):
        task_service.delete_task(task_id)
        print(f"\nTask {task_id} deleted successfully!")
    else:
        print("\nDelete cancelled.")


def handle_help(_user_input: str) -> None:
    """
    Handle the 'help' command to display available commands.

    Usage: help
    """
    print(display.format_help())


def handle_exit(_user_input: str) -> None:
    """
    Handle the 'exit' or 'quit' command to close the application.

    Usage: exit or quit
    """
    print("\nExiting sorted. Goodbye!")
    sys.exit(0)


def handle_unknown(user_input: str) -> None:
    """
    Handle unknown commands.

    Args:
        user_input: The unknown user input
    """
    print(display.format_error(f"Unknown command: {user_input.strip()}"))
