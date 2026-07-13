"""Shared API dependencies."""
from app.services.model_service import ModelService, model_service


def get_model_service() -> ModelService:
    """Return the shared model service.

    Overridden in tests via FastAPI dependency overrides so a lightweight mock
    model can be injected without loading the real joblib artifact.
    """
    return model_service
