"""
JWT verification using JWKS endpoint.

Fetches public keys from Better Auth's JWKS endpoint and verifies
JWT tokens signed with EdDSA (Ed25519) algorithm.
"""

import logging
from dataclasses import dataclass

import jwt
from jwt import PyJWKClient

from src.api.config import get_settings

logger = logging.getLogger(__name__)

_jwk_client: PyJWKClient | None = None


def get_jwk_client() -> PyJWKClient:
    """Get or create the JWKS client with key caching."""
    global _jwk_client
    if _jwk_client is None:
        settings = get_settings()
        _jwk_client = PyJWKClient(
            settings.jwks_url,
            cache_jwk_set=True,
            lifespan=300,  # Cache keys for 5 minutes
        )
    return _jwk_client


@dataclass
class TokenPayload:
    """Verified JWT token payload."""

    sub: str
    email: str


def verify_token(token: str) -> TokenPayload:
    """
    Verify a JWT token using the JWKS endpoint.

    Args:
        token: The raw JWT token string.

    Returns:
        TokenPayload with verified claims.

    Raises:
        jwt.InvalidTokenError: If the token is invalid, expired, or unverifiable.
    """
    jwk_client = get_jwk_client()
    signing_key = jwk_client.get_signing_key_from_jwt(token)

    payload = jwt.decode(
        token,
        signing_key.key,
        algorithms=["EdDSA"],
        options={
            "require": ["sub", "email", "exp", "iat"],
            "verify_aud": False,
        },
    )

    return TokenPayload(
        sub=payload["sub"],
        email=payload["email"],
    )
