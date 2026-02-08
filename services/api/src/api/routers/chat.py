"""Chat endpoints with SSE streaming for the AI agent."""

import json
import logging
import math
import uuid
from datetime import datetime

from agents import Runner, RunContextWrapper
from agents.stream_events import RawResponsesStreamEvent, RunItemStreamEvent
from agents.items import MessageOutputItem, ToolCallItem, ToolCallOutputItem
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sse_starlette.sse import EventSourceResponse

from src.api.agent.context import ChatContext
from src.api.agent.jett import jett_agent
from src.api.auth import TokenPayload, get_current_user
from src.api.database import get_session
from src.api.models.chat import ChatMessage, ChatThread
from src.api.schemas.chat import (
    ChatMessageListResponse,
    ChatMessageResponse,
    ChatRequest,
    ChatThreadListResponse,
    ChatThreadResponse,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/chat", tags=["chat"])


def _extract_title(text: str) -> tuple[str | None, str]:
    """Extract TITLE: prefix from first agent response."""
    if text.startswith("TITLE:"):
        parts = text.split("\n", 1)
        title = parts[0].replace("TITLE:", "").strip()[:200]
        remaining = parts[1].strip() if len(parts) > 1 else ""
        return title, remaining
    return None, text


@router.post("")
async def chat(
    body: ChatRequest,
    current_user: TokenPayload = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Send a message and receive a streaming SSE response."""
    user_id = current_user.sub

    # Load or create thread
    if body.thread_id:
        result = await session.execute(
            select(ChatThread).where(
                ChatThread.id == body.thread_id,
                ChatThread.user_id == uuid.UUID(user_id),
            )
        )
        thread = result.scalar_one_or_none()
        if thread is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Thread not found")
    else:
        thread = ChatThread(user_id=uuid.UUID(user_id))
        session.add(thread)
        await session.commit()
        await session.refresh(thread)

    thread_id = str(thread.id)
    is_new_thread = body.thread_id is None

    # Save user message
    user_msg = ChatMessage(
        thread_id=thread.id,
        role="user",
        content=body.message,
    )
    session.add(user_msg)
    thread.updated_at = datetime.utcnow()
    await session.commit()
    await session.refresh(user_msg)

    # Load last 50 messages for context
    msg_result = await session.execute(
        select(ChatMessage)
        .where(ChatMessage.thread_id == thread.id)
        .order_by(ChatMessage.created_at.desc())
        .limit(50)
    )
    db_messages = list(reversed(msg_result.scalars().all()))

    # Convert to OpenAI message format
    openai_messages = [
        {"role": m.role, "content": m.content}
        for m in db_messages
    ]

    # Create agent context
    chat_ctx = ChatContext(user_id=user_id, thread_id=thread_id)

    async def event_generator():
        assistant_message_id = str(uuid.uuid4())
        full_text = ""
        token_index = 0
        finish_reason = "stop"

        # Emit stream_start immediately
        yield {
            "event": "stream_start",
            "data": json.dumps({
                "thread_id": thread_id,
                "message_id": assistant_message_id,
                "timestamp": datetime.utcnow().isoformat() + "Z",
            }),
        }

        try:
            result = Runner.run_streamed(
                jett_agent,
                input=openai_messages,
                context=chat_ctx,
            )

            async for event in result.stream_events():
                if isinstance(event, RawResponsesStreamEvent):
                    if hasattr(event.data, "delta") and event.data.delta:
                        token = event.data.delta
                        full_text += token
                        yield {
                            "event": "text_token",
                            "data": json.dumps({"token": token, "index": token_index}),
                        }
                        token_index += 1

                elif isinstance(event, RunItemStreamEvent):
                    item = event.item
                    if isinstance(item, ToolCallOutputItem):
                        # Check if task was modified
                        if chat_ctx.tasks_modified:
                            for action_type, task_id, task_title in chat_ctx.modified_tasks:
                                yield {
                                    "event": "task_action",
                                    "data": json.dumps({
                                        "action_type": action_type,
                                        "task_id": task_id,
                                        "task_title": task_title,
                                        "task_count": 1,
                                    }),
                                }
                            # Reset for potential further tool calls
                            chat_ctx.modified_tasks.clear()
                            chat_ctx.tasks_modified = False

        except Exception as e:
            logger.error(f"Agent error: {type(e).__name__}: {e}")
            finish_reason = "error"
            error_message = "I'm having trouble right now. Please try again in a moment."

            # Check for rate limit
            try:
                import openai
                if isinstance(e, openai.RateLimitError):
                    error_message = "I'm a bit busy right now. Please try again in a moment."
            except ImportError:
                pass

            yield {
                "event": "error",
                "data": json.dumps({
                    "code": "AGENT_ERROR",
                    "message": error_message,
                    "retryable": True,
                }),
            }

        # Handle title extraction for new threads
        display_text = full_text
        if is_new_thread:
            title, display_text = _extract_title(full_text)
            if title:
                # Update thread title in a separate session scope
                try:
                    thread.title = title
                    session.add(thread)
                    await session.commit()
                except Exception:
                    logger.warning("Failed to update thread title")

        # Save assistant message
        if display_text.strip():
            try:
                tool_calls_data = None
                if chat_ctx.modified_tasks:
                    tool_calls_data = [
                        {"action": a, "task_id": tid, "title": t}
                        for a, tid, t in chat_ctx.modified_tasks
                    ]

                assistant_msg = ChatMessage(
                    id=uuid.UUID(assistant_message_id),
                    thread_id=uuid.UUID(thread_id),
                    role="assistant",
                    content=display_text.strip(),
                    tool_calls=tool_calls_data,
                )
                session.add(assistant_msg)
                thread.updated_at = datetime.utcnow()
                await session.commit()
            except Exception:
                logger.warning("Failed to persist assistant message")

        yield {
            "event": "stream_end",
            "data": json.dumps({
                "message_id": assistant_message_id,
                "finish_reason": finish_reason,
                "full_text": display_text.strip(),
            }),
        }

    return EventSourceResponse(event_generator())


@router.get("/threads", response_model=ChatThreadListResponse)
async def list_threads(
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=20, ge=1, le=50),
    current_user: TokenPayload = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """List the authenticated user's conversation threads."""
    user_id = uuid.UUID(current_user.sub)

    # Count total threads
    count_q = select(func.count()).select_from(ChatThread).where(ChatThread.user_id == user_id)
    total = (await session.execute(count_q)).scalar_one()

    # Fetch page with message counts
    msg_count = (
        select(func.count())
        .where(ChatMessage.thread_id == ChatThread.id)
        .correlate(ChatThread)
        .scalar_subquery()
    )
    q = (
        select(ChatThread, msg_count.label("message_count"))
        .where(ChatThread.user_id == user_id)
        .order_by(ChatThread.updated_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    rows = (await session.execute(q)).all()

    total_pages = math.ceil(total / per_page) if total > 0 else 0
    return ChatThreadListResponse(
        data=[
            ChatThreadResponse(
                id=row.ChatThread.id,
                title=row.ChatThread.title,
                created_at=row.ChatThread.created_at,
                updated_at=row.ChatThread.updated_at,
                message_count=row.message_count,
            )
            for row in rows
        ],
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages,
    )


@router.get("/threads/{thread_id}/messages", response_model=ChatMessageListResponse)
async def get_thread_messages(
    thread_id: uuid.UUID,
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=50, ge=1, le=100),
    current_user: TokenPayload = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get messages for a specific conversation thread."""
    user_id = uuid.UUID(current_user.sub)

    # Verify thread ownership
    result = await session.execute(
        select(ChatThread).where(
            ChatThread.id == thread_id,
            ChatThread.user_id == user_id,
        )
    )
    thread = result.scalar_one_or_none()
    if thread is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Thread not found")

    # Count total messages
    count_q = (
        select(func.count())
        .select_from(ChatMessage)
        .where(ChatMessage.thread_id == thread_id)
    )
    total = (await session.execute(count_q)).scalar_one()

    # Fetch page
    q = (
        select(ChatMessage)
        .where(ChatMessage.thread_id == thread_id)
        .order_by(ChatMessage.created_at.asc())
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    messages = (await session.execute(q)).scalars().all()

    total_pages = math.ceil(total / per_page) if total > 0 else 0
    return ChatMessageListResponse(
        data=[
            ChatMessageResponse(
                id=m.id,
                role=m.role,
                content=m.content,
                action_card=m.tool_calls,
                created_at=m.created_at,
            )
            for m in messages
        ],
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages,
    )
