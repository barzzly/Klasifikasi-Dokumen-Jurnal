"""FastAPI application entry point.

Loads the trained model once at startup, wires up routers under the
``/api/v1`` prefix, configures CORS from the environment and registers
consistent exception handlers.
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import (
    routes_documents,
    routes_health,
    routes_model,
    routes_texts,
)
from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging
from app.services.model_service import model_service

API_PREFIX = "/api/v1"


@asynccontextmanager
async def lifespan(_: FastAPI):
    settings = get_settings()
    configure_logging(settings.LOG_LEVEL)
    logger = logging.getLogger("app")

    model_service.load(settings.MODEL_PATH)
    if not model_service.is_loaded:
        logger.error(
            "Model is NOT loaded. Classification endpoints will return "
            "MODEL_UNAVAILABLE until a valid model is present."
        )
    yield


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="Klasifikasi Dokumen Jurnal",
        description=(
            "Prototipe pendukung keputusan untuk mengklasifikasikan dokumen "
            "ilmiah sebagai jurnal atau non-jurnal."
        ),
        version="1.0.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)

    app.include_router(routes_health.router, prefix=API_PREFIX, tags=["health"])
    app.include_router(routes_model.router, prefix=API_PREFIX, tags=["model"])
    app.include_router(routes_documents.router, prefix=API_PREFIX, tags=["documents"])
    app.include_router(routes_texts.router, prefix=API_PREFIX, tags=["texts"])

    return app


app = create_app()
