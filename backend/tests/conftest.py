"""Shared pytest fixtures.

A lightweight mock model is used so the real joblib artifact is not required
for unit tests. The mock records whether ``predict`` was called, allowing tests
to assert that the model is never invoked for structurally incomplete
documents.
"""
import fitz  # PyMuPDF
import pytest
from fastapi.testclient import TestClient

from app.api.deps import get_model_service
from app.main import create_app


class MockModel:
    """Minimal stand-in for the trained scikit-learn pipeline."""

    def __init__(self, label="jurnal", classes=("jurnal", "non_jurnal")):
        self.classes_ = list(classes)
        self._label = label
        self.predict_called = False
        self.predict_calls = 0

    def predict(self, texts):
        self.predict_called = True
        self.predict_calls += 1
        return [self._label for _ in texts]

    def decision_function(self, texts):
        # Return a deterministic margin per input; NOT a probability.
        return [-0.4281 for _ in texts]


class MockModelService:
    """Wraps :class:`MockModel` with the ModelService interface."""

    def __init__(self, model=None, loaded=True):
        self.model = model if model is not None else MockModel()
        self._loaded = loaded

    @property
    def is_loaded(self):
        return self._loaded

    @property
    def classes(self):
        return list(self.model.classes_) if self._loaded else []

    def predict(self, text):
        label = self.model.predict([text])[0]
        margin = round(float(self.model.decision_function([text])[0]), 4)
        return str(label), margin


@pytest.fixture
def mock_model():
    return MockModel()


@pytest.fixture
def loaded_service(mock_model):
    return MockModelService(model=mock_model, loaded=True)


@pytest.fixture
def client(loaded_service):
    """TestClient with a loaded mock model injected."""
    app = create_app()
    app.dependency_overrides[get_model_service] = lambda: loaded_service
    with TestClient(app) as c:
        c.mock_service = loaded_service  # expose for assertions
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def unloaded_client():
    """TestClient with an unavailable model."""
    service = MockModelService(loaded=False)
    app = create_app()
    app.dependency_overrides[get_model_service] = lambda: service
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


# ---- helpers to build in-memory PDFs --------------------------------------

def make_pdf_bytes(text: str) -> bytes:
    """Create a simple digital PDF containing ``text``."""
    doc = fitz.open()
    page = doc.new_page()
    # Insert as a text box so multi-line content is preserved.
    page.insert_textbox(fitz.Rect(36, 36, 559, 800), text, fontsize=11)
    data = doc.tobytes()
    doc.close()
    return data


def complete_document_text() -> str:
    """Return document text containing all four required structures."""
    return (
        "ABSTRAK\n"
        "Penelitian ini bertujuan untuk menguji sistem klasifikasi dokumen. "
        + ("Kalimat pengisi untuk memenuhi panjang minimum teks. " * 8)
        + "\n\nMETODE PENELITIAN\n"
        "Penelitian ini menggunakan pendekatan kuantitatif dengan eksperimen. "
        + ("Uraian metode penelitian yang cukup panjang. " * 8)
        + "\n\nHASIL DAN PEMBAHASAN\n"
        "Berdasarkan hasil pengujian diperoleh temuan sebagai berikut. "
        + ("Pembahasan hasil penelitian secara menyeluruh. " * 8)
        + "\n\nDAFTAR PUSTAKA\n"
        "Penulis, A. (2020). Judul artikel. Jurnal Ilmiah, 1(1), 1-10.\n"
    )


def incomplete_document_text() -> str:
    """Document text missing the references section."""
    return (
        "ABSTRAK\n"
        "Penelitian ini bertujuan untuk menguji sistem klasifikasi dokumen. "
        + ("Kalimat pengisi untuk memenuhi panjang minimum teks. " * 8)
        + "\n\nMETODE PENELITIAN\n"
        "Penelitian ini menggunakan pendekatan kuantitatif dengan eksperimen. "
        + ("Uraian metode penelitian yang cukup panjang. " * 8)
        + "\n\nHASIL DAN PEMBAHASAN\n"
        "Berdasarkan hasil pengujian diperoleh temuan sebagai berikut. "
        + ("Pembahasan hasil penelitian secara menyeluruh. " * 8)
    )
