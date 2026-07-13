"""Tests for PDF validation and text extraction."""
import pytest

from app.core.exceptions import (
    InvalidFileTypeError,
    PdfExtractionFailedError,
    TextTooShortError,
)
from app.services.pdf_extractor import extract_text_from_pdf, validate_upload
from tests.conftest import complete_document_text, make_pdf_bytes


def test_extract_valid_pdf():
    pdf = make_pdf_bytes(complete_document_text())
    text = extract_text_from_pdf(pdf, min_length=50)
    assert "ABSTRAK" in text
    assert len(text) > 50


def test_invalid_file_type_rejected():
    with pytest.raises(InvalidFileTypeError):
        validate_upload(
            filename="notes.txt",
            content_type="text/plain",
            content=b"hello world",
            max_bytes=1024,
        )


def test_oversized_file_rejected():
    from app.core.exceptions import FileTooLargeError

    big = b"%PDF-" + b"0" * 2048
    with pytest.raises(FileTooLargeError):
        validate_upload(
            filename="big.pdf",
            content_type="application/pdf",
            content=big,
            max_bytes=1024,
        )


def test_empty_file_rejected():
    from app.core.exceptions import EmptyFileError

    with pytest.raises(EmptyFileError):
        validate_upload(
            filename="empty.pdf",
            content_type="application/pdf",
            content=b"",
            max_bytes=1024,
        )


def test_empty_pdf_extraction_fails():
    # A PDF with no text should trigger TextTooShort (never silent non-journal).
    pdf = make_pdf_bytes("")
    with pytest.raises((TextTooShortError, PdfExtractionFailedError)):
        extract_text_from_pdf(pdf, min_length=300)


def test_text_too_short_rejected():
    pdf = make_pdf_bytes("Teks singkat.")
    with pytest.raises(TextTooShortError):
        extract_text_from_pdf(pdf, min_length=300)
