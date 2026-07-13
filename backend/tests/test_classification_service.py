"""Tests for the two-stage classification orchestration."""
from tests.conftest import (
    MockModel,
    MockModelService,
    complete_document_text,
    incomplete_document_text,
)

from app.services.classification_service import analyze_text


def test_incomplete_structure_returns_non_jurnal():
    service = MockModelService(model=MockModel())
    result = analyze_text(
        text=incomplete_document_text(),
        filename="dok.pdf",
        model_service=service,
    )
    assert result.final_label == "non_jurnal"
    assert result.decision_stage == "validasi_struktur"
    assert "daftar_pustaka" in result.missing_structures


def test_incomplete_structure_does_not_call_model():
    model = MockModel()
    service = MockModelService(model=model)
    analyze_text(
        text=incomplete_document_text(),
        filename="dok.pdf",
        model_service=service,
    )
    # The model must NOT be invoked when the structure is incomplete.
    assert model.predict_called is False
    assert model.predict_calls == 0


def test_complete_structure_calls_model():
    model = MockModel(label="jurnal")
    service = MockModelService(model=model)
    result = analyze_text(
        text=complete_document_text(),
        filename="dok.pdf",
        model_service=service,
    )
    assert model.predict_called is True
    assert result.decision_stage == "text_classification"
    assert result.model.used is True
    assert result.final_label == "jurnal"


def test_model_result_contains_decision_margin():
    service = MockModelService(model=MockModel())
    result = analyze_text(
        text=complete_document_text(),
        filename="dok.pdf",
        model_service=service,
    )
    assert result.model.decision_margin is not None
    assert isinstance(result.model.decision_margin, float)


def test_predicted_label_comes_from_predict_not_margin_sign():
    # Margin is negative (-0.4281) but predict says "jurnal" -> label follows
    # predict(), never an assumption about the margin sign.
    model = MockModel(label="jurnal")
    service = MockModelService(model=model)
    result = analyze_text(
        text=complete_document_text(),
        filename="dok.pdf",
        model_service=service,
    )
    assert result.model.decision_margin < 0
    assert result.final_label == "jurnal"
