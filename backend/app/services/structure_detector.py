"""Rule-based detection of required scientific-document structures.

Detects four required sections (abstract, methodology, results, references)
by scanning for their headings at the start of a line. Indonesian and English
variants are supported, along with numbered, roman-numeral and ``BAB`` style
prefixes. Detection is case-insensitive.
"""
import re
from typing import Dict, List, Optional

# Required structures in fixed order. Keys are the response field names.
REQUIRED_STRUCTURES: List[str] = ["abstrak", "metodologi", "hasil", "daftar_pustaka"]

# Heading variants per structure. Longer / more specific phrases are listed
# first so the matched heading is the most descriptive one available.
_HEADING_VARIANTS: Dict[str, List[str]] = {
    "abstrak": [
        "abstrak",
        "abstract",
    ],
    "metodologi": [
        "metode penelitian dan pengembangan",
        "metode penelitian",
        "metode dan bahan",
        "bahan dan metode",
        "materials and methods",
        "research methodology",
        "research methods",
        "research method",
        "methodology",
        "methods",
        "method",
        "metodologi",
        "metode",
    ],
    "hasil": [
        "hasil dan pembahasan",
        "pembahasan dan hasil",
        "results and discussion",
        "findings and discussion",
        "hasil penelitian",
        "findings",
        "results",
        "result",
        "temuan",
        "hasil",
    ],
    "daftar_pustaka": [
        "daftar pustaka",
        "bibliography",
        "references",
        "referensi",
        "rujukan",
    ],
}

# Optional numbering / chapter prefix allowed before a heading. Examples:
#   "1. ", "2 ", "III. ", "BAB III ", "BAB 3 "
_PREFIX = r"(?:bab\s+)?(?:[0-9]+|[ivxlcdm]+)?[\.\)]?\s*"

_EXCERPT_LEN = 160


def _build_pattern(variant: str) -> re.Pattern:
    """Compile a line-anchored, case-insensitive pattern for one heading."""
    # Allow flexible whitespace between words inside a multi-word heading.
    words = r"\s+".join(re.escape(w) for w in variant.split())
    # Anchor at the beginning of a line, allow an optional numbering prefix,
    # and require the heading to be followed by a boundary (end of line,
    # whitespace, colon or dash) so it is not matched mid-word.
    pattern = rf"^{_PREFIX}{words}\b[\s:\-]*"
    return re.compile(pattern, re.IGNORECASE | re.MULTILINE)


# Pre-compile all patterns once at import time.
_COMPILED: Dict[str, List[tuple]] = {
    key: [(variant, _build_pattern(variant)) for variant in variants]
    for key, variants in _HEADING_VARIANTS.items()
}


def _make_excerpt(text: str, start: int) -> str:
    """Return a short single-line excerpt starting at the heading."""
    snippet = text[start : start + _EXCERPT_LEN]
    snippet = " ".join(snippet.split())
    return snippet


def detect_structure(text: str, key: str) -> Dict[str, Optional[str]]:
    """Detect a single required structure within ``text``.

    Returns a dict with ``found``, ``matched_heading`` and ``excerpt``.
    """
    normalized = text.replace("\r\n", "\n").replace("\r", "\n")
    for variant, pattern in _COMPILED[key]:
        match = pattern.search(normalized)
        if match:
            matched_heading = match.group(0).strip(" :-\n").strip()
            excerpt = _make_excerpt(normalized, match.start())
            return {
                "found": True,
                "matched_heading": matched_heading or variant.upper(),
                "excerpt": excerpt,
            }
    return {"found": False, "matched_heading": None, "excerpt": None}


def detect_structures(text: str) -> Dict[str, Dict[str, Optional[str]]]:
    """Detect all required structures. Returns a dict keyed by structure name."""
    return {key: detect_structure(text, key) for key in REQUIRED_STRUCTURES}


def missing_structures(structures: Dict[str, Dict]) -> List[str]:
    """Return the list of required structures that were not found."""
    return [key for key in REQUIRED_STRUCTURES if not structures[key]["found"]]
