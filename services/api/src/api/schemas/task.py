"""Pydantic schemas for Task API request/response validation."""

import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    """Schema for creating a new task."""

    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=2000)


class TaskUpdate(BaseModel):
    """Schema for partially updating a task. All fields optional."""

    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=2000)
    completed: bool | None = None


class TaskResponse(BaseModel):
    """Schema for a single task in API responses."""

    id: uuid.UUID
    title: str
    description: str | None
    completed: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TaskListResponse(BaseModel):
    """Paginated list of tasks."""

    data: list[TaskResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
