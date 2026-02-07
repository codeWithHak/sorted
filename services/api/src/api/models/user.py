"""
User model for the sorted todo application.

Represents an application user managed by Better Auth.
"""

import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, String
from sqlmodel import Field, SQLModel

from src.api.models.types import GUID


class User(SQLModel, table=True):
    """
    User entity representing an application user.

    Schema matches Better Auth's expected user table structure.
    Better Auth manages user creation via its sign-up flow.

    Attributes:
        id: UUID primary key
        name: User display name (required by Better Auth)
        email: Unique email address for authentication
        email_verified: Whether the user's email has been verified
        image: Optional profile image URL
        created_at: Account creation timestamp
        updated_at: Last update timestamp
    """

    __tablename__ = "users"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(GUID, primary_key=True),
    )
    name: str = Field(sa_column=Column(String(255), nullable=False, default=""))
    email: str = Field(
        sa_column=Column(String(255), unique=True, nullable=False, index=True)
    )
    email_verified: bool = Field(
        sa_column=Column(Boolean, nullable=False, default=False)
    )
    image: str | None = Field(default=None, sa_column=Column(String(500), nullable=True))
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
