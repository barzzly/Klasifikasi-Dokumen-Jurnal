"""Tests for the document and text analysis routes."""
from tests.conftest import (
    complete_document_text,
    incomplete_document_text,
    make_pdf_bytes,
)


def test_analyze_document_complete_calls_model(client):
    pdf = make_pdf_bytes(complete_document_text())
    resp = client.post(
        "/api/v1/documents/analyze",
        files={"file": ("dok.pdf", pdf, "application/pdf")},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["decision_stage"] == "text_classification"
    assert body["model"]["used"] is True
    assert body["model"]["decision_margin"] is not None
    assert client.mock_service.model.predict_called is True


def test_analyze_document_incomplete_skips_model(client):
    pdf = make_pdf_bytes(incomplete_document_text())
    resp = client.post(
        "/api/v1/documents/analyze",
        files={"file": ("dok.pdf", pdf, "application/pdf")},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["final_label"] == "non_jurnal"
    assert body["decision_stage"] == "validasi_struktur"
    assert body["model"]["used"] is False
    # Model was never called for an incomplete document.
    assert client.mock_service.model.predict_called is False


def test_analyze_document_invalid_type(client):
    resp = client.post(
        "/api/v1/documents/analyze",
        files={"file": ("notes.txt", b"hello world text", "text/plain")},
    )
    assert resp.status_code == 415
    body = resp.json()
    assert body["error"]["code"] == "INVALID_FILE_TYPE"


def test_analyze_document_model_unavailable(unloaded_client):
    pdf = make_pdf_bytes(complete_document_text())
    resp = unloaded_client.post(
        "/api/v1/documents/analyze",
        files={"file": ("dok.pdf", pdf, "application/pdf")},
    )
    assert resp.status_code == 503
    assert resp.json()["error"]["code"] == "MODEL_UNAVAILABLE"


def test_texts_analyze_complete(client):
    resp = client.post(
        "/api/v1/texts/analyze",
        json={"text": complete_document_text()},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["decision_stage"] == "text_classification"
    assert body["model"]["used"] is True


def test_texts_analyze_incomplete_skips_model(client):
    resp = client.post(
        "/api/v1/texts/analyze",
        json={"text": incomplete_document_text()},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["final_label"] == "non_jurnal"
    assert body["decision_stage"] == "validasi_struktur"
    assert body["model"]["used"] is False


def test_texts_analyze_too_short(client):
    resp = client.post("/api/v1/texts/analyze", json={"text": "pendek"})
    assert resp.status_code == 422
    assert resp.json()["error"]["code"] == "TEXT_TOO_SHORT"


def test_error_response_shape_is_consistent(client):
    resp = client.post(
        "/api/v1/documents/analyze",
        files={"file": ("notes.txt", b"hello world text", "text/plain")},
    )
    body = resp.json()
    assert set(body.keys()) == {"error"}
    assert set(body["error"].keys()) == {"code", "message", "details"}


def test_decision_margin_not_labelled_probability(client):
    # The response must not present the margin as a probability/percentage.
    resp = client.post(
        "/api/v1/texts/analyze",
        json={"text": complete_document_text()},
    )
    body = resp.json()
    assert "probability" not in body["model"]
    assert "confidence" not in body["model"]
    assert "decision_margin" in body["model"]
