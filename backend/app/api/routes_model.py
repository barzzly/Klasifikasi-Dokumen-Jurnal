"""Model information endpoint."""
from fastapi import APIRouter, Depends

from app.api.deps import get_model_service
from app.schemas.model import ModelInfoResponse
from app.services.model_service import ModelService
from app.services.structure_detector import REQUIRED_STRUCTURES

router = APIRouter()


@router.get("/model/info", response_model=ModelInfoResponse)
def model_info(
    model_service: ModelService = Depends(get_model_service),
) -> ModelInfoResponse:
    return ModelInfoResponse(
        name="TF-IDF + LinearSVC",
        task="Klasifikasi jurnal dan non-jurnal",
        classes=model_service.classes,
        required_structures=REQUIRED_STRUCTURES,
        decision_margin_is_probability=False,
        model_loaded=model_service.is_loaded,
    )
