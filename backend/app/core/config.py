"""Application configuration loaded from environment variables."""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime settings for the API.

    Values are read from environment variables or a local ``.env`` file.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        # Avoid clashing with Pydantic's protected "model_" namespace.
        protected_namespaces=(),
    )

    # Path to the trained joblib pipeline, relative to the backend working dir.
    MODEL_PATH: str = "linearsvc_model.joblib"
    MAX_UPLOAD_SIZE_MB: int = 15
    MIN_TEXT_LENGTH: int = 300
    CORS_ORIGINS: str = "http://localhost:5173"
    LOG_LEVEL: str = "INFO"

    @property
    def max_upload_size_bytes(self) -> int:
        return self.MAX_UPLOAD_SIZE_MB * 1024 * 1024

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    """Return a cached settings instance."""
    return Settings()
