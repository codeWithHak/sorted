"""
FastAPI application for the sorted todo API.

Provides REST endpoints for task management with PostgreSQL persistence.
"""

from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.database import get_session, lifespan

app = FastAPI(
    title="Sorted API",
    description="Todo application API with PostgreSQL persistence",
    version="0.1.0",
    lifespan=lifespan,
)


@app.get("/health")
async def health(session: AsyncSession = Depends(get_session)) -> dict[str, str]:
    """
    Health check endpoint.

    Verifies database connectivity by executing a simple query.

    Returns:
        {"status": "ok"} if database is reachable
    """
    await session.execute(text("SELECT 1"))
    return {"status": "ok"}
