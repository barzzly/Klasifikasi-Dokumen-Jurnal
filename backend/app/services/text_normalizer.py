"""Safe text normalisation.

Only light normalisation is applied. The trained pipeline already performs
its own TF-IDF preprocessing, so aggressive steps (stemming, lemmatisation,
stop-word or punctuation removal) are intentionally avoided to keep inference
consistent with training.
"""
import re

_MULTISPACE = re.compile(r"[ \t\f\v]+")
_MULTINEWLINE = re.compile(r"\n{3,}")


def normalize_text(text: str) -> str:
    """Apply only safe normalisation before prediction.

    - Normalise line endings.
    - Remove null characters.
    - Collapse repeated spaces into one.
    - Collapse excessive blank lines.
    - Strip leading/trailing whitespace.
    """
    if not text:
        return ""
    # Remove null characters.
    text = text.replace("\x00", "")
    # Normalise line endings.
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    # Collapse repeated inline whitespace.
    text = _MULTISPACE.sub(" ", text)
    # Collapse excessive blank lines.
    text = _MULTINEWLINE.sub("\n\n", text)
    # Trim trailing spaces on each line.
    text = "\n".join(line.strip() for line in text.split("\n"))
    return text.strip()
