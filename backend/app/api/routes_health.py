"""Health endpoint."""
from fastapi import APIRouter, Depends

from app.api.deps import get_model_service
from app.schemas.model import HealthResponse
from app.services.model_service import ModelService

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health(model_service: ModelService = Depends(get_model_service)) -> HealthResponse:
    loaded = model_service.is_loaded
    return HealthResponse(
        status="ok" if loaded else "degraded",
        model_loaded=loaded,
        model_classes=model_service.classes if loaded else [],
    )
