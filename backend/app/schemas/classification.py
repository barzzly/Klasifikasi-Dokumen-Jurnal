"""Schemas for classification requests and responses."""
from typing import Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field


class StructureItem(BaseModel):
    """Detection result for a single required structure."""

    found: bool
    matched_heading: Optional[str] = None
    excerpt: Optional[str] = None


class ModelResult(BaseModel):
    """Outcome of the machine learning stage (if it ran)."""

    used: bool
    predicted_label: Optional[str] = None
    decision_margin: Optional[float] = None

    model_config = ConfigDict(protected_namespaces=())


class AnalyzeResponse(BaseModel):
    """Full analysis result returned by document and text endpoints."""

    filename: str
    final_label: str
    decision_stage: str
    reason: str
    structures: Dict[str, StructureItem]
    missing_structures: List[str]
    text_length: int
    model: ModelResult

    model_config = ConfigDict(protected_namespaces=())


class TextAnalyzeRequest(BaseModel):
    """Request body for the text-analysis endpoint."""

    text: str = Field(..., description="Isi dokumen ilmiah yang akan dianalisis.")
