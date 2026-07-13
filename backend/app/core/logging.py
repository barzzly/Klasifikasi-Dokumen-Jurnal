"""Structured logging setup and filename sanitisation helpers."""
import logging
import os
import re

_SAFE_CHARS = re.compile(r"[^A-Za-z0-9._-]")


def configure_logging(level: str = "INFO") -> None:
    """Configure root logging with a simple structured format."""
    logging.basicConfig(
        level=getattr(logging, level.upper(), logging.INFO),
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )


def sanitize_filename(filename: str | None) -> str:
    """Return a log-safe filename.

    Strips directory components and replaces unusual characters so that
    untrusted upload names cannot break log lines or expose paths.
    """
    if not filename:
        return "unknown"
    base = os.path.basename(filename)
    base = _SAFE_CHARS.sub("_", base)
    return base[:120] or "unknown"
