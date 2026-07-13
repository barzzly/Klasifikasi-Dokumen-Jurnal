"""Tests for the health and model-info endpoints."""


def test_health_model_loaded(client):
    resp = client.get("/api/v1/health")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    assert body["model_loaded"] is True
    assert body["model_classes"] == ["jurnal", "non_jurnal"]


def test_health_model_unavailable(unloaded_client):
    resp = unloaded_client.get("/api/v1/health")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "degraded"
    assert body["model_loaded"] is False
    assert body["model_classes"] == []


def test_model_info(client):
    resp = client.get("/api/v1/model/info")
    assert resp.status_code == 200
    body = resp.json()
    assert body["name"] == "TF-IDF + LinearSVC"
    assert body["classes"] == ["jurnal", "non_jurnal"]
    assert body["required_structures"] == [
        "abstrak",
        "metodologi",
        "hasil",
        "daftar_pustaka",
    ]
    # The decision margin must never be advertised as a probability.
    assert body["decision_margin_is_probability"] is False
    assert body["model_loaded"] is True
