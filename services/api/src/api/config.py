"""
Application configuration using pydantic-settings.

Reads configuration from environment variables with validation.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    Attributes:
        database_url: PostgreSQL connection string (required)
        jwks_url: Better Auth JWKS endpoint URL for JWT verification (required)
        cors_origins: Comma-separated list of allowed CORS origins
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    database_url: str
    jwks_url: str = "http://localhost:3000/api/auth/jwks"
    cors_origins: str = "http://localhost:3000"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.database_url:
            raise ValueError(
                "DATABASE_URL environment variable is required. "
                "Set it in .env file or export it directly. "
                "Example: postgresql+asyncpg://user:pass@host/db?sslmode=verify-full"
            )

    @property
    def cors_origin_list(self) -> list[str]:
        """Parse comma-separated CORS origins into a list."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


def get_settings() -> Settings:
    """
    Get application settings.

    Returns:
        Settings instance with validated configuration.

    Raises:
        ValueError: If required configuration is missing.
    """
    return Settings()
