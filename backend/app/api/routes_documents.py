"""Document upload and analysis endpoint."""
import logging

from fastapi import APIRouter, Depends, File, UploadFile

from app.api.deps import get_model_service
from app.core.config import get_settings
from app.core.exceptions import EmptyFileError, ModelUnavailableError
from app.core.logging import sanitize_filename
from app.schemas.classification import AnalyzeResponse
from app.services.classification_service import analyze_text
from app.services.model_service import ModelService
from app.services.pdf_extractor import extract_text_from_pdf, validate_upload

logger = logging.getLogger("app")

router = APIRouter()


@router.post("/documents/analyze", response_model=AnalyzeResponse)
async def analyze_document(
    file: UploadFile = File(...),
    model_service: ModelService = Depends(get_model_service),
) -> AnalyzeResponse:
    settings = get_settings()

    # Model must be available before we accept work.
    if not model_service.is_loaded:
        raise ModelUnavailableError()

    content = await file.read()
    if not content:
        raise EmptyFileError()

    safe_name = sanitize_filename(file.filename)
    validate_upload(
        filename=file.filename or "",
        content_type=file.content_type or "",
        content=content,
        max_bytes=settings.max_upload_size_bytes,
    )

    text = extract_text_from_pdf(content, min_length=settings.MIN_TEXT_LENGTH)

    logger.info("Analyzing uploaded document '%s' (%d bytes).", safe_name, len(content))
    return analyze_text(text=text, filename=safe_name, model_service=model_service)
