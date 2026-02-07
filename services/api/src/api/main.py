"""
FastAPI application for the sorted todo API.

Provides REST endpoints for task management with PostgreSQL persistence.
"""

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.auth import TokenPayload, get_current_user
from src.api.config import get_settings
from src.api.database import get_session, lifespan
from src.api.routers.tasks import router as tasks_router

app = FastAPI(
    title="Sorted API",
    description="Todo application API with PostgreSQL persistence",
    version="0.1.0",
    lifespan=lifespan,
)

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(tasks_router)


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


@app.get("/auth/me")
async def auth_me(user: TokenPayload = Depends(get_current_user)) -> dict:
    """
    Protected endpoint that returns the authenticated user's identity.

    Requires a valid JWT Bearer token in the Authorization header.

    Returns:
        User id and email from the verified JWT.
    """
    return {"id": user.sub, "email": user.email}
