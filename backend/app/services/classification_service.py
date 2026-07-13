"""Two-stage classification orchestration.

Stage 1 - rule-based structural validation. If any required structure is
missing the document is immediately labelled ``non_jurnal`` and the model is
NOT called.

Stage 2 - text classification with the trained pipeline, only when all four
required structures are present.
"""
from typing import Dict

from app.schemas.classification import (
    AnalyzeResponse,
    ModelResult,
    StructureItem,
)
from app.services.model_service import ModelService
from app.services.structure_detector import (
    detect_structures,
    missing_structures,
)
from app.services.text_normalizer import normalize_text

STAGE_STRUCTURE = "validasi_struktur"
STAGE_TEXT = "text_classification"

LABEL_JURNAL = "jurnal"
LABEL_NON_JURNAL = "non_jurnal"

_REASON_INCOMPLETE = "Dokumen tidak memenuhi seluruh struktur wajib."
_REASON_COMPLETE = (
    "Dokumen memenuhi struktur wajib dan dianalisis menggunakan model "
    "TF-IDF dan LinearSVC."
)


def _to_structure_items(raw: Dict[str, Dict]) -> Dict[str, StructureItem]:
    return {key: StructureItem(**value) for key, value in raw.items()}


def analyze_text(
    text: str,
    filename: str,
    model_service: ModelService,
) -> AnalyzeResponse:
    """Run the full two-stage pipeline on already-extracted text."""
    normalized = normalize_text(text)
    text_length = len(normalized)

    raw_structures = detect_structures(normalized)
    structures = _to_structure_items(raw_structures)
    missing = missing_structures(raw_structures)

    # Stage 1: structural validation gate.
    if missing:
        return AnalyzeResponse(
            filename=filename,
            final_label=LABEL_NON_JURNAL,
            decision_stage=STAGE_STRUCTURE,
            reason=_REASON_INCOMPLETE,
            structures=structures,
            missing_structures=missing,
            text_length=text_length,
            model=ModelResult(used=False, predicted_label=None, decision_margin=None),
        )

    # Stage 2: text classification with the trained model.
    predicted_label, margin = model_service.predict(normalized)

    return AnalyzeResponse(
        filename=filename,
        final_label=predicted_label,
        decision_stage=STAGE_TEXT,
        reason=_REASON_COMPLETE,
        structures=structures,
        missing_structures=[],
        text_length=text_length,
        model=ModelResult(
            used=True,
            predicted_label=predicted_label,
            decision_margin=margin,
        ),
    )
