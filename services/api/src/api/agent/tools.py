"""Agent tools for task CRUD operations."""

import json
import uuid
from datetime import datetime

from agents import RunContextWrapper, function_tool
from sqlalchemy import select

from src.api.agent.context import ChatContext
from src.api.database import get_session_factory
from src.api.models.task import Task


def _get_tool_session_factory():
    """Get session factory — separated for test monkeypatching."""
    return get_session_factory()


def _error(code: str, message: str, suggestion: str) -> str:
    # Return user-friendly error message instead of JSON
    return f"{message} {suggestion}"


async def _add_task_impl(
    ctx: RunContextWrapper[ChatContext], title: str, description: str | None
) -> str:
    if not title or not title.strip():
        return _error("VALIDATION_ERROR", "Title cannot be empty.", "Provide a task title.")
    if len(title) > 200:
        return _error(
            "VALIDATION_ERROR",
            "Title too long (max 200 characters).",
            "Shorten the task title.",
        )

    user_id = uuid.UUID(ctx.context.user_id)
    factory = _get_tool_session_factory()
    async with factory() as session:
        task = Task(
            title=title.strip(),
            description=description.strip() if description else None,
            user_id=user_id,
        )
        session.add(task)
        await session.commit()
        await session.refresh(task)

        ctx.context.tasks_modified = True
        ctx.context.modified_tasks.append(("created", str(task.id), task.title))

        return f"Added task '{task.title}' successfully!"


@function_tool
async def add_task(
    ctx: RunContextWrapper[ChatContext], title: str, description: str | None = None
) -> str:
    """Create a new task for the user.

    Args:
        title: Task title, 1-200 characters.
        description: Optional task description, max 2000 characters.
    """
    return await _add_task_impl(ctx, title, description)


async def _list_tasks_impl(
    ctx: RunContextWrapper[ChatContext], completed: bool | None
) -> str:
    user_id = uuid.UUID(ctx.context.user_id)
    factory = _get_tool_session_factory()
    async with factory() as session:
        conditions = [
            Task.user_id == user_id,
            Task.is_deleted == False,  # noqa: E712
        ]
        if completed is not None:
            conditions.append(Task.completed == completed)

        result = await session.execute(
            select(Task).where(*conditions).order_by(Task.created_at.desc())
        )
        tasks = result.scalars().all()

        if not tasks:
            return "You have no tasks right now. Would you like to add one?"

        task_list = []
        for i, task in enumerate(tasks, 1):
            status = "✓" if task.completed else "○"
            task_list.append(f"{i}. [{status}] {task.title} (id: {task.id})")

        return f"Here are your tasks:\n" + "\n".join(task_list)


@function_tool
async def list_tasks(
    ctx: RunContextWrapper[ChatContext], completed: bool | None = None
) -> str:
    """List the user's tasks with optional filtering.

    Args:
        completed: Filter by completion status. True=completed only, False=pending only, omit=all tasks.
    """
    return await _list_tasks_impl(ctx, completed)


async def _complete_task_impl(
    ctx: RunContextWrapper[ChatContext], task_id: str
) -> str:
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        return _error("INVALID_ID", "Invalid task ID format.", "Use list_tasks to find valid task IDs.")

    user_id = uuid.UUID(ctx.context.user_id)
    factory = _get_tool_session_factory()
    async with factory() as session:
        result = await session.execute(
            select(Task).where(
                Task.id == task_uuid,
                Task.user_id == user_id,
                Task.is_deleted == False,  # noqa: E712
            )
        )
        task = result.scalar_one_or_none()
        if task is None:
            return _error(
                "NOT_FOUND",
                "No task found with that ID.",
                "Use list_tasks to find valid task IDs.",
            )

        task.completed = True
        task.updated_at = datetime.utcnow()
        await session.commit()
        await session.refresh(task)

        ctx.context.tasks_modified = True
        ctx.context.modified_tasks.append(("completed", str(task.id), task.title))

        return f"Great job! I've marked '{task.title}' as completed. 🎉"


@function_tool
async def complete_task(ctx: RunContextWrapper[ChatContext], task_id: str) -> str:
    """Mark a task as completed.

    Args:
        task_id: UUID of the task to complete.
    """
    return await _complete_task_impl(ctx, task_id)


async def _update_task_impl(
    ctx: RunContextWrapper[ChatContext],
    task_id: str,
    title: str | None,
    description: str | None,
) -> str:
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        return _error("INVALID_ID", "Invalid task ID format.", "Use list_tasks to find valid task IDs.")

    if title is not None and not title.strip():
        return _error("VALIDATION_ERROR", "Title cannot be empty.", "Provide a non-empty title.")
    if title is not None and len(title) > 200:
        return _error("VALIDATION_ERROR", "Title too long (max 200 characters).", "Shorten the title.")
    if description is not None and len(description) > 2000:
        return _error(
            "VALIDATION_ERROR",
            "Description too long (max 2000 characters).",
            "Shorten the description.",
        )

    user_id = uuid.UUID(ctx.context.user_id)
    factory = _get_tool_session_factory()
    async with factory() as session:
        result = await session.execute(
            select(Task).where(
                Task.id == task_uuid,
                Task.user_id == user_id,
                Task.is_deleted == False,  # noqa: E712
            )
        )
        task = result.scalar_one_or_none()
        if task is None:
            return _error(
                "NOT_FOUND",
                "No task found with that ID.",
                "Use list_tasks to find valid task IDs.",
            )

        if title is not None:
            task.title = title.strip()
        if description is not None:
            task.description = description.strip()
        task.updated_at = datetime.utcnow()
        await session.commit()
        await session.refresh(task)

        ctx.context.tasks_modified = True
        ctx.context.modified_tasks.append(("updated", str(task.id), task.title))

        return f"Task updated successfully! '{task.title}' is now up to date."


@function_tool
async def update_task(
    ctx: RunContextWrapper[ChatContext],
    task_id: str,
    title: str | None = None,
    description: str | None = None,
) -> str:
    """Update a task's title or description.

    Args:
        task_id: UUID of the task to update.
        title: New title, 1-200 characters.
        description: New description, max 2000 characters.
    """
    return await _update_task_impl(ctx, task_id, title, description)


async def _delete_task_impl(
    ctx: RunContextWrapper[ChatContext], task_id: str
) -> str:
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        return _error("INVALID_ID", "Invalid task ID format.", "Use list_tasks to find valid task IDs.")

    user_id = uuid.UUID(ctx.context.user_id)
    factory = _get_tool_session_factory()
    async with factory() as session:
        result = await session.execute(
            select(Task).where(
                Task.id == task_uuid,
                Task.user_id == user_id,
                Task.is_deleted == False,  # noqa: E712
            )
        )
        task = result.scalar_one_or_none()
        if task is None:
            return _error(
                "NOT_FOUND",
                "No task found with that ID.",
                "The task may have already been deleted. Try listing your tasks.",
            )

        task.is_deleted = True
        task.updated_at = datetime.utcnow()
        await session.commit()

        ctx.context.tasks_modified = True
        ctx.context.modified_tasks.append(("deleted", str(task.id), task.title))

        return f"Task '{task.title}' has been removed from your list."


@function_tool
async def delete_task(ctx: RunContextWrapper[ChatContext], task_id: str) -> str:
    """Soft-delete a task.

    Args:
        task_id: UUID of the task to delete.
    """
    return await _delete_task_impl(ctx, task_id)


@function_tool
async def delete_all_tasks(ctx: RunContextWrapper[ChatContext]) -> str:
    """Delete ALL of the user's tasks at once. Use when the user asks to clear or delete everything."""
    user_id = uuid.UUID(ctx.context.user_id)
    factory = _get_tool_session_factory()
    async with factory() as session:
        result = await session.execute(
            select(Task).where(
                Task.user_id == user_id,
                Task.is_deleted == False,  # noqa: E712
            )
        )
        tasks = result.scalars().all()

        if not tasks:
            return "You don't have any tasks to delete."

        for task in tasks:
            task.is_deleted = True
            task.updated_at = datetime.utcnow()
            ctx.context.modified_tasks.append(("deleted", str(task.id), task.title))

        ctx.context.tasks_modified = True
        await session.commit()

        return f"All {len(tasks)} tasks have been deleted."
