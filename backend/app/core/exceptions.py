"""Application error types and exception handlers.

All user-facing errors are emitted as a consistent envelope::

    {"error": {"code": "...", "message": "...", "details": null}}

Internal stack traces are never returned to the client.
"""
import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

logger = logging.getLogger("app")


class AppError(Exception):
    """Base class for all handled application errors."""

    code = "INTERNAL_SERVER_ERROR"
    message = "Terjadi kesalahan internal pada server."
    status_code = 500

    def __init__(self, message: str | None = None, details=None):
        self.message = message or self.message
        self.details = details
        super().__init__(self.message)

    def to_dict(self) -> dict:
        return {
            "error": {
                "code": self.code,
                "message": self.message,
                "details": self.details,
            }
        }


class InvalidFileTypeError(AppError):
    code = "INVALID_FILE_TYPE"
    message = "File yang diunggah harus berformat PDF."
    status_code = 415


class FileTooLargeError(AppError):
    code = "FILE_TOO_LARGE"
    message = "Ukuran file melebihi batas maksimum yang diizinkan."
    status_code = 413


class EmptyFileError(AppError):
    code = "EMPTY_FILE"
    message = "File yang diunggah kosong."
    status_code = 400


class PdfExtractionFailedError(AppError):
    code = "PDF_EXTRACTION_FAILED"
    message = (
        "Teks dokumen tidak dapat diekstrak. Dokumen mungkin berupa hasil "
        "pemindaian dan memerlukan pemeriksaan manual."
    )
    status_code = 422


class TextTooShortError(AppError):
    code = "TEXT_TOO_SHORT"
    message = (
        "Teks dokumen terlalu pendek untuk dianalisis. Dokumen mungkin berupa "
        "hasil pemindaian dan memerlukan pemeriksaan manual."
    )
    status_code = 422


class ModelUnavailableError(AppError):
    code = "MODEL_UNAVAILABLE"
    message = "Model klasifikasi tidak tersedia. Silakan coba lagi nanti."
    status_code = 503


class ClassificationFailedError(AppError):
    code = "CLASSIFICATION_FAILED"
    message = "Proses klasifikasi gagal dijalankan."
    status_code = 500


def _error_response(code: str, message: str, status_code: int, details=None) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"error": {"code": code, "message": message, "details": details}},
    )


def register_exception_handlers(app: FastAPI) -> None:
    """Attach consistent exception handlers to the FastAPI app."""

    @app.exception_handler(AppError)
    async def _handle_app_error(_: Request, exc: AppError):
        return _error_response(exc.code, exc.message, exc.status_code, exc.details)

    @app.exception_handler(RequestValidationError)
    async def _handle_validation_error(_: Request, exc: RequestValidationError):
        return _error_response(
            "VALIDATION_ERROR",
            "Data yang dikirim tidak valid.",
            422,
            details=exc.errors(),
        )

    @app.exception_handler(Exception)
    async def _handle_unexpected(_: Request, exc: Exception):
        # Log the real error internally; never leak the trace to the client.
        logger.exception("Unhandled server error: %s", type(exc).__name__)
        return _error_response(
            "INTERNAL_SERVER_ERROR",
            "Terjadi kesalahan internal pada server.",
            500,
        )
