"""Text analysis endpoint for development and manual testing."""
from fastapi import APIRouter, Depends

from app.api.deps import get_model_service
from app.core.config import get_settings
from app.core.exceptions import ModelUnavailableError, TextTooShortError
from app.schemas.classification import AnalyzeResponse, TextAnalyzeRequest
from app.services.classification_service import analyze_text
from app.services.model_service import ModelService
from app.services.text_normalizer import normalize_text

router = APIRouter()


@router.post("/texts/analyze", response_model=AnalyzeResponse)
def analyze_text_endpoint(
    payload: TextAnalyzeRequest,
    model_service: ModelService = Depends(get_model_service),
) -> AnalyzeResponse:
    settings = get_settings()

    if not model_service.is_loaded:
        raise ModelUnavailableError()

    normalized = normalize_text(payload.text)
    if len(normalized) < settings.MIN_TEXT_LENGTH:
        raise TextTooShortError()

    return analyze_text(
        text=normalized,
        filename="input_teks.txt",
        model_service=model_service,
    )
