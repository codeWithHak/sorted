"""Chat models for conversation persistence."""

import uuid
from datetime import datetime

from sqlalchemy import Column, ForeignKey, Index, String, Text
from sqlalchemy.types import JSON
from sqlmodel import Field, Relationship, SQLModel

from src.api.models.types import GUID


class ChatThread(SQLModel, table=True):
    """A conversation thread scoped to a single user."""

    __tablename__ = "chat_threads"
    __table_args__ = (
        Index("ix_chat_threads_user_updated", "user_id", "updated_at"),
    )

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(GUID, primary_key=True),
    )
    user_id: uuid.UUID = Field(
        sa_column=Column(GUID, ForeignKey("users.id"), nullable=False)
    )
    title: str = Field(
        default="New conversation",
        sa_column=Column(String(200), nullable=False),
    )
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    messages: list["ChatMessage"] = Relationship(back_populates="thread")


class ChatMessage(SQLModel, table=True):
    """An individual message within a conversation thread."""

    __tablename__ = "chat_messages"
    __table_args__ = (
        Index("ix_chat_messages_thread_created", "thread_id", "created_at"),
    )

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(GUID, primary_key=True),
    )
    thread_id: uuid.UUID = Field(
        sa_column=Column(GUID, ForeignKey("chat_threads.id"), nullable=False)
    )
    role: str = Field(sa_column=Column(String(20), nullable=False))
    content: str = Field(sa_column=Column(Text, nullable=False))
    tool_calls: dict | None = Field(default=None, sa_column=Column(JSON, nullable=True))
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    thread: ChatThread | None = Relationship(back_populates="messages")
