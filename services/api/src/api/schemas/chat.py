"""Pydantic schemas for Chat API request/response validation."""

import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Request body for POST /chat."""

    message: str = Field(..., min_length=1, max_length=2000)
    thread_id: uuid.UUID | None = None


class ChatThreadResponse(BaseModel):
    """A single conversation thread in API responses."""

    id: uuid.UUID
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int = 0

    model_config = {"from_attributes": True}


class ChatThreadListResponse(BaseModel):
    """Paginated list of conversation threads."""

    data: list[ChatThreadResponse]
    total: int
    page: int
    per_page: int
    total_pages: int


class ChatMessageResponse(BaseModel):
    """A single message in API responses."""

    id: uuid.UUID
    role: str
    content: str
    action_card: dict | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatMessageListResponse(BaseModel):
    """Paginated list of messages."""

    data: list[ChatMessageResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
