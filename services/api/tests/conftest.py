"""Test fixtures for the sorted API tests."""

from collections.abc import AsyncGenerator

import pytest_asyncio
from fastapi import Request
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlmodel import SQLModel

from src.api.auth import TokenPayload, get_current_user
from src.api.database import get_session
from src.api.main import app

# Fixed test user UUIDs
TEST_USER_ID = "11111111-1111-1111-1111-111111111111"
TEST_USER_EMAIL = "test@example.com"
OTHER_USER_ID = "22222222-2222-2222-2222-222222222222"
OTHER_USER_EMAIL = "other@example.com"

# User lookup for header-based auth override
_TEST_USERS = {
    TEST_USER_ID: TEST_USER_EMAIL,
    OTHER_USER_ID: OTHER_USER_EMAIL,
}

# In-memory SQLite async engine for tests
_test_engine = create_async_engine(
    "sqlite+aiosqlite://",
    echo=False,
)
_test_session_factory = async_sessionmaker(
    _test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


@pytest_asyncio.fixture(autouse=True)
async def setup_database():
    """Create tables before each test and drop after."""
    async with _test_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield
    async with _test_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)


@pytest_asyncio.fixture
async def session() -> AsyncGenerator[AsyncSession, None]:
    """Provide a test database session."""
    async with _test_session_factory() as session:
        yield session


async def _override_get_session() -> AsyncGenerator[AsyncSession, None]:
    """Override get_session to use test database."""
    async with _test_session_factory() as session:
        yield session


async def _override_get_current_user(request: Request) -> TokenPayload:
    """Auth override that reads user identity from X-Test-User-Id header."""
    user_id = request.headers.get("x-test-user-id")
    if not user_id:
        raise Exception("Missing X-Test-User-Id header in test request")
    email = _TEST_USERS.get(user_id, "unknown@test.com")
    return TokenPayload(sub=user_id, email=email)


@pytest_asyncio.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    """HTTP client authenticated as the default test user."""
    app.dependency_overrides[get_session] = _override_get_session
    app.dependency_overrides[get_current_user] = _override_get_current_user
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
        headers={"X-Test-User-Id": TEST_USER_ID},
    ) as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def other_client() -> AsyncGenerator[AsyncClient, None]:
    """HTTP client authenticated as a different user (for isolation tests)."""
    app.dependency_overrides[get_session] = _override_get_session
    app.dependency_overrides[get_current_user] = _override_get_current_user
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
        headers={"X-Test-User-Id": OTHER_USER_ID},
    ) as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def unauthed_client() -> AsyncGenerator[AsyncClient, None]:
    """HTTP client with no authentication (auth override removed)."""
    app.dependency_overrides[get_session] = _override_get_session
    app.dependency_overrides.pop(get_current_user, None)
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac
    app.dependency_overrides.clear()
