"""
Database configuration and session management.

Provides async engine, session factory, and dependency injection for FastAPI.
"""

import logging
import ssl as ssl_module
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlmodel import SQLModel

from src.api.config import get_settings

logger = logging.getLogger(__name__)

# Lazy initialization - engine created on first use
_engine = None
_async_session_factory = None


def _prepare_async_url(database_url: str) -> tuple[str, dict]:
    """
    Prepare a database URL and connect_args for asyncpg.

    asyncpg does not accept libpq query parameters (sslmode, channel_binding, etc.).
    This function strips all query params from the URL, converts ``sslmode`` into the
    ``ssl`` connect_arg that asyncpg understands, and drops the rest.
    """
    parsed = urlparse(database_url)
    query_params = parse_qs(parsed.query)
    connect_args: dict = {}

    # Convert sslmode to asyncpg's ssl connect_arg
    sslmode = query_params.get("sslmode", [None])[0]
    if sslmode == "verify-full":
        ssl_ctx = ssl_module.create_default_context()
        connect_args["ssl"] = ssl_ctx
    elif sslmode in ("require", "verify-ca", "prefer"):
        connect_args["ssl"] = True

    # Strip ALL query params — they are libpq-specific and unsupported by asyncpg
    parsed = parsed._replace(query="")
    database_url = urlunparse(parsed)

    return database_url, connect_args


def get_engine():
    """
    Get or create the async database engine.

    Uses conservative pool settings for Neon serverless:
    - pool_size=5: Base connections
    - max_overflow=10: Burst capacity
    - pool_pre_ping=True: Validate connections before use
    - pool_recycle=3600: Reconnect hourly
    """
    global _engine
    if _engine is None:
        settings = get_settings()
        url, connect_args = _prepare_async_url(settings.database_url)
        _engine = create_async_engine(
            url,
            echo=False,
            pool_size=5,
            max_overflow=10,
            pool_pre_ping=True,
            pool_recycle=3600,
            connect_args=connect_args,
        )
    return _engine


def get_session_factory():
    """Get or create the async session factory."""
    global _async_session_factory
    if _async_session_factory is None:
        _async_session_factory = async_sessionmaker(
            get_engine(),
            class_=AsyncSession,
            expire_on_commit=False,
            autocommit=False,
            autoflush=False,
        )
    return _async_session_factory


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency that provides an async database session.

    Yields an isolated session for each request.
    Automatically handles cleanup and rollback on exceptions.

    Usage:
        @app.get("/items")
        async def get_items(session: AsyncSession = Depends(get_session)):
            ...
    """
    session_factory = get_session_factory()
    async with session_factory() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def create_tables() -> None:
    """
    Create all database tables from SQLModel metadata.

    Called during application startup to ensure tables exist.
    """
    engine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    logger.info("Database tables created successfully")


async def close_engine() -> None:
    """
    Dispose of the database engine and close all connections.

    Called during application shutdown.
    """
    global _engine, _async_session_factory
    if _engine is not None:
        await _engine.dispose()
        _engine = None
        _async_session_factory = None
        logger.info("Database connections closed")


@asynccontextmanager
async def lifespan(app):
    """
    Application lifespan context manager.

    Handles database initialization on startup and cleanup on shutdown.

    Usage:
        app = FastAPI(lifespan=lifespan)
    """
    # Import models to register them with SQLModel.metadata
    from src.api.models import Task, User  # noqa: F401

    logger.info("Starting database initialization...")
    try:
        await create_tables()
        logger.info("Application startup complete")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise RuntimeError(
            f"Database initialization failed. Check your DATABASE_URL. Error: {e}"
        ) from e

    yield

    logger.info("Shutting down application...")
    await close_engine()
    logger.info("Application shutdown complete")
