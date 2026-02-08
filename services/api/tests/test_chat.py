"""Integration tests for chat endpoints."""

import uuid

import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from tests.conftest import TEST_USER_ID, OTHER_USER_ID, _test_session_factory
from src.api.models.chat import ChatThread, ChatMessage


@pytest_asyncio.fixture
async def thread_with_messages(session: AsyncSession):
    """Create a thread with messages for the test user."""
    thread = ChatThread(
        user_id=uuid.UUID(TEST_USER_ID),
        title="Test conversation",
    )
    session.add(thread)
    await session.commit()
    await session.refresh(thread)

    messages = []
    for role, content in [
        ("user", "Hello Jett"),
        ("assistant", "Hey! How can I help?"),
        ("user", "Add buy milk"),
        ("assistant", "Done! Created a task for you."),
    ]:
        msg = ChatMessage(
            thread_id=thread.id,
            role=role,
            content=content,
        )
        session.add(msg)
        messages.append(msg)

    await session.commit()
    for m in messages:
        await session.refresh(m)
    return thread, messages


@pytest_asyncio.fixture
async def other_user_thread(session: AsyncSession):
    """Create a thread owned by another user."""
    thread = ChatThread(
        user_id=uuid.UUID(OTHER_USER_ID),
        title="Other user thread",
    )
    session.add(thread)
    await session.commit()
    await session.refresh(thread)
    return thread


# ── GET /chat/threads ──


class TestListThreads:
    @pytest.mark.asyncio
    async def test_empty_threads(self, client: AsyncClient):
        res = await client.get("/chat/threads")
        assert res.status_code == 200
        data = res.json()
        assert data["total"] == 0
        assert data["data"] == []

    @pytest.mark.asyncio
    async def test_lists_user_threads(self, client: AsyncClient, thread_with_messages):
        res = await client.get("/chat/threads")
        assert res.status_code == 200
        data = res.json()
        assert data["total"] == 1
        assert data["data"][0]["title"] == "Test conversation"
        assert data["data"][0]["message_count"] == 4

    @pytest.mark.asyncio
    async def test_excludes_other_user_threads(
        self, client: AsyncClient, other_user_thread, thread_with_messages
    ):
        res = await client.get("/chat/threads")
        assert res.status_code == 200
        data = res.json()
        assert data["total"] == 1  # Only own thread, not other user's

    @pytest.mark.asyncio
    async def test_pagination(self, client: AsyncClient, session: AsyncSession):
        # Create 3 threads
        for i in range(3):
            t = ChatThread(user_id=uuid.UUID(TEST_USER_ID), title=f"Thread {i}")
            session.add(t)
        await session.commit()

        res = await client.get("/chat/threads?page=1&per_page=2")
        data = res.json()
        assert data["total"] == 3
        assert len(data["data"]) == 2
        assert data["total_pages"] == 2


# ── GET /chat/threads/{id}/messages ──


class TestGetThreadMessages:
    @pytest.mark.asyncio
    async def test_returns_messages_in_order(
        self, client: AsyncClient, thread_with_messages
    ):
        thread, _ = thread_with_messages
        res = await client.get(f"/chat/threads/{thread.id}/messages")
        assert res.status_code == 200
        data = res.json()
        assert data["total"] == 4
        assert data["data"][0]["role"] == "user"
        assert data["data"][0]["content"] == "Hello Jett"
        assert data["data"][1]["role"] == "assistant"

    @pytest.mark.asyncio
    async def test_404_for_other_user_thread(
        self, client: AsyncClient, other_user_thread
    ):
        res = await client.get(f"/chat/threads/{other_user_thread.id}/messages")
        assert res.status_code == 404

    @pytest.mark.asyncio
    async def test_404_for_nonexistent_thread(self, client: AsyncClient):
        fake_id = uuid.uuid4()
        res = await client.get(f"/chat/threads/{fake_id}/messages")
        assert res.status_code == 404

    @pytest.mark.asyncio
    async def test_pagination(
        self, client: AsyncClient, thread_with_messages
    ):
        thread, _ = thread_with_messages
        res = await client.get(
            f"/chat/threads/{thread.id}/messages?page=1&per_page=2"
        )
        data = res.json()
        assert data["total"] == 4
        assert len(data["data"]) == 2
        assert data["total_pages"] == 2


# ── POST /chat validation ──


class TestChatValidation:
    @pytest.mark.asyncio
    async def test_rejects_empty_message(self, client: AsyncClient):
        res = await client.post("/chat", json={"message": ""})
        assert res.status_code == 422

    @pytest.mark.asyncio
    async def test_rejects_too_long_message(self, client: AsyncClient):
        res = await client.post("/chat", json={"message": "x" * 2001})
        assert res.status_code == 422

    @pytest.mark.asyncio
    async def test_404_for_nonexistent_thread(self, client: AsyncClient):
        fake_id = str(uuid.uuid4())
        res = await client.post(
            "/chat", json={"message": "hello", "thread_id": fake_id}
        )
        assert res.status_code == 404
