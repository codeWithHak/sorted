"""Task CRUD endpoints with user isolation."""

import math
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.auth import TokenPayload, get_current_user
from src.api.database import get_session
from src.api.models.task import Task
from src.api.schemas.task import (
    TaskCreate,
    TaskListResponse,
    TaskResponse,
    TaskUpdate,
)

router = APIRouter(prefix="/tasks", tags=["tasks"])


async def _get_user_task(
    session: AsyncSession,
    task_id: uuid.UUID,
    user_id: str,
) -> Task:
    """Fetch a task owned by the given user, or raise 404."""
    result = await session.execute(
        select(Task).where(
            Task.id == task_id,
            Task.user_id == uuid.UUID(user_id),
            Task.is_deleted == False,  # noqa: E712
        )
    )
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return task


@router.post("", status_code=status.HTTP_201_CREATED, response_model=TaskResponse)
async def create_task(
    body: TaskCreate,
    current_user: TokenPayload = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """Create a new task for the authenticated user."""
    task = Task(
        title=body.title,
        description=body.description,
        user_id=uuid.UUID(current_user.sub),
    )
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return TaskResponse.model_validate(task)


@router.get("", response_model=TaskListResponse)
async def list_tasks(
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=20, ge=1, le=100),
    completed: bool | None = Query(default=None),
    current_user: TokenPayload = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> TaskListResponse:
    """List tasks for the authenticated user with pagination and filtering."""
    conditions = [
        Task.user_id == uuid.UUID(current_user.sub),
        Task.is_deleted == False,  # noqa: E712
    ]
    if completed is not None:
        conditions.append(Task.completed == completed)

    # Single query: fetch page + total count via window function
    total_col = func.count().over().label("total_count")
    q = (
        select(Task, total_col)
        .where(*conditions)
        .order_by(Task.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    rows = (await session.execute(q)).all()

    if rows:
        total = rows[0].total_count
        results = [row[0] for row in rows]
    else:
        # Page beyond total — count separately to still report correct total
        count_q = select(func.count()).select_from(Task).where(*conditions)
        total = (await session.execute(count_q)).scalar_one()
        results = []

    total_pages = math.ceil(total / per_page) if total > 0 else 0
    return TaskListResponse(
        data=[TaskResponse.model_validate(t) for t in results],
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages,
    )


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: uuid.UUID,
    current_user: TokenPayload = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """Get a single task by ID for the authenticated user."""
    task = await _get_user_task(session, task_id, current_user.sub)
    return TaskResponse.model_validate(task)


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: uuid.UUID,
    body: TaskUpdate,
    current_user: TokenPayload = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """Partially update a task for the authenticated user."""
    task = await _get_user_task(session, task_id, current_user.sub)
    updates = body.model_dump(exclude_unset=True)
    if updates:
        for key, value in updates.items():
            setattr(task, key, value)
        task.updated_at = datetime.utcnow()
        await session.commit()
        await session.refresh(task)
    return TaskResponse.model_validate(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: uuid.UUID,
    current_user: TokenPayload = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> Response:
    """Soft-delete a task for the authenticated user."""
    task = await _get_user_task(session, task_id, current_user.sub)
    task.is_deleted = True
    task.updated_at = datetime.utcnow()
    await session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
