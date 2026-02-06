"""
User model for the sorted todo application.

Represents an application user who can own and manage tasks.
"""

import uuid
from datetime import datetime

from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    """
    User entity representing an application user.

    Attributes:
        id: UUID primary key (client-generated)
        email: Unique email address for authentication
        hashed_password: Bcrypt-hashed password (never stored plain)
        created_at: Account creation timestamp
    """

    __tablename__ = "users"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(PGUUID(as_uuid=True), primary_key=True),
    )
    email: str = Field(
        sa_column=Column(String(255), unique=True, nullable=False, index=True)
    )
    hashed_password: str = Field(sa_column=Column(String(255), nullable=False))
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
