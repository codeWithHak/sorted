"""
Authentication module for the sorted API.

Exports auth dependencies for use in route handlers.
"""

from src.api.auth.dependencies import get_current_user
from src.api.auth.jwt import TokenPayload

__all__ = ["get_current_user", "TokenPayload"]
