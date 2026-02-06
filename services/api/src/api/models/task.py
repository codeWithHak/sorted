"""
Task model for the sorted todo application.

Represents a todo item owned by a specific user.
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from src.api.models.user import User


class Task(SQLModel, table=True):
    """
    Task entity representing a todo item.

    Attributes:
        id: UUID primary key (client-generated)
        title: Task title (required, max 200 chars)
        description: Optional task description (max 2000 chars)
        completed: Task completion status (default False)
        is_deleted: Soft delete flag (default False)
        user_id: Foreign key reference to owning User
        created_at: Task creation timestamp
        user: Relationship to User entity
    """

    __tablename__ = "tasks"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(PGUUID(as_uuid=True), primary_key=True),
    )
    title: str = Field(sa_column=Column(String(200), nullable=False))
    description: str | None = Field(
        default=None, sa_column=Column(String(2000), nullable=True)
    )
    completed: bool = Field(default=False, nullable=False)
    is_deleted: bool = Field(default=False, nullable=False, index=True)
    user_id: uuid.UUID = Field(
        sa_column=Column(
            PGUUID(as_uuid=True),
            ForeignKey("users.id"),
            nullable=False,
        )
    )
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationship to User
    user: "User" = Relationship()
