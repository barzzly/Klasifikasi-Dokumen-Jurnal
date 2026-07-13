"""Schemas for health and model-info endpoints."""
from typing import List

from pydantic import BaseModel, ConfigDict


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_classes: List[str]

    # Allow the ``model_`` prefixed field names above.
    model_config = ConfigDict(protected_namespaces=())


class ModelInfoResponse(BaseModel):
    name: str
    task: str
    classes: List[str]
    required_structures: List[str]
    decision_margin_is_probability: bool
    model_loaded: bool

    model_config = ConfigDict(protected_namespaces=())
