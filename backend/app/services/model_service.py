"""Model loading and inference service.

The trained TF-IDF + LinearSVC pipeline is loaded exactly once at application
startup. The service never retrains, never rebuilds the vectoriser and never
fabricates predictions. If the model cannot be loaded the service reports it as
unavailable and callers must return a service-unavailable error.
"""
import logging
import os
from typing import List, Optional, Tuple

import joblib

from app.core.exceptions import ClassificationFailedError

logger = logging.getLogger("app")


class ModelService:
    """Holds the loaded pipeline and exposes safe inference helpers."""

    def __init__(self) -> None:
        self._model = None
        self._classes: List[str] = []
        self._loaded = False

    def load(self, model_path: str) -> None:
        """Load the joblib pipeline from ``model_path`` once.

        On any failure the service stays in the unavailable state and logs a
        clear error. It never falls back to a fake model.
        """
        if self._loaded:
            return

        if not os.path.exists(model_path):
            logger.error("Model file not found at configured path.")
            self._loaded = False
            return

        try:
            model = joblib.load(model_path)
        except Exception:  # noqa: BLE001 - log and stay unavailable
            logger.exception("Failed to load model from configured path.")
            self._model = None
            self._loaded = False
            return

        # Validate the loaded object supports the required interface.
        if not (hasattr(model, "predict") and hasattr(model, "decision_function")):
            logger.error(
                "Loaded object does not support predict()/decision_function()."
            )
            self._model = None
            self._loaded = False
            return

        self._model = model
        self._classes = [str(c) for c in getattr(model, "classes_", [])]
        self._loaded = True
        logger.info("Model loaded successfully. classes=%s", self._classes)

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    @property
    def classes(self) -> List[str]:
        return list(self._classes)

    def predict(self, text: str) -> Tuple[str, Optional[float]]:
        """Predict the label for ``text``.

        Returns ``(predicted_label, decision_margin)``. The label always comes
        from ``predict()``; the margin is a diagnostic value from
        ``decision_function()`` and is never treated as a probability.
        """
        if not self._loaded or self._model is None:
            raise ClassificationFailedError()

        try:
            predicted = self._model.predict([text])[0]
            margin = self._safe_margin(text)
        except Exception as exc:  # noqa: BLE001
            logger.exception("Prediction failed.")
            raise ClassificationFailedError() from exc

        return str(predicted), margin

    def _safe_margin(self, text: str) -> Optional[float]:
        """Return a scalar decision margin, or ``None`` if unavailable."""
        try:
            raw = self._model.decision_function([text])
        except Exception:  # noqa: BLE001 - margin is optional diagnostics only
            return None
        try:
            value = raw[0]
            # Multiclass returns an array per sample; take the first score.
            if hasattr(value, "__len__"):
                value = value[0]
            return round(float(value), 4)
        except (TypeError, IndexError, ValueError):
            return None


# Module-level singleton shared across the application.
model_service = ModelService()
