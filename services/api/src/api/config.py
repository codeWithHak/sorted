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
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    database_url: str

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.database_url:
            raise ValueError(
                "DATABASE_URL environment variable is required. "
                "Set it in .env file or export it directly. "
                "Example: postgresql+asyncpg://user:pass@host/db?sslmode=verify-full"
            )


def get_settings() -> Settings:
    """
    Get application settings.

    Returns:
        Settings instance with validated configuration.

    Raises:
        ValueError: If required configuration is missing.
    """
    return Settings()
