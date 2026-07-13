"""PDF text extraction using PyMuPDF.

Uploads are validated (extension, MIME type, size, non-empty) and processed in
a secure temporary file that is always deleted afterwards. Only digital text
extraction is performed; OCR is intentionally not implemented in this version.
"""
import logging
import os
import tempfile

import fitz  # PyMuPDF

from app.core.exceptions import (
    EmptyFileError,
    FileTooLargeError,
    InvalidFileTypeError,
    PdfExtractionFailedError,
    TextTooShortError,
)
from app.core.logging import sanitize_filename
from app.services.text_normalizer import normalize_text

logger = logging.getLogger("app")

_ALLOWED_CONTENT_TYPES = {"application/pdf", "application/x-pdf", "application/octet-stream"}
_PDF_MAGIC = b"%PDF-"


def validate_upload(filename: str, content_type: str, content: bytes, max_bytes: int) -> None:
    """Validate an uploaded file before extraction.

    Raises the appropriate :class:`AppError` subclass on failure.
    """
    safe_name = sanitize_filename(filename)

    if not content:
        raise EmptyFileError()

    if len(content) > max_bytes:
        raise FileTooLargeError()

    # Validate extension.
    if not safe_name.lower().endswith(".pdf"):
        raise InvalidFileTypeError()

    # Validate MIME type (best-effort; browsers vary).
    if content_type and content_type.lower() not in _ALLOWED_CONTENT_TYPES:
        raise InvalidFileTypeError()

    # Validate the PDF magic bytes so a renamed file is rejected.
    if not content.lstrip()[:8].startswith(_PDF_MAGIC):
        raise InvalidFileTypeError()


def extract_text_from_pdf(content: bytes, min_length: int) -> str:
    """Extract and normalise text from PDF ``content`` bytes.

    The bytes are written to a secure temporary file, read page by page and the
    temporary file is deleted in a ``finally`` block. Raises
    :class:`PdfExtractionFailedError` on parse failure or
    :class:`TextTooShortError` when the extracted text is too short.
    """
    tmp_path = None
    try:
        fd, tmp_path = tempfile.mkstemp(suffix=".pdf")
        with os.fdopen(fd, "wb") as tmp:
            tmp.write(content)

        try:
            doc = fitz.open(tmp_path)
        except Exception as exc:  # noqa: BLE001
            logger.warning("PDF could not be opened: %s", type(exc).__name__)
            raise PdfExtractionFailedError() from exc

        parts = []
        try:
            for page in doc:
                parts.append(page.get_text("text"))
        finally:
            doc.close()

        text = normalize_text("\n".join(parts))

        if len(text) < min_length:
            # Empty or near-empty extraction is treated as an extraction error,
            # never silently classified as non-journal.
            raise TextTooShortError()

        return text
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except OSError:
                logger.warning("Temporary PDF file could not be removed.")
