"""Tests for heading / structure detection."""
from app.services.structure_detector import (
    detect_structures,
    missing_structures,
)


def test_detect_indonesian_headings():
    text = (
        "ABSTRAK\nIsi abstrak.\n\n"
        "METODE PENELITIAN\nIsi metode.\n\n"
        "HASIL DAN PEMBAHASAN\nIsi hasil.\n\n"
        "DAFTAR PUSTAKA\nDaftar rujukan."
    )
    s = detect_structures(text)
    assert s["abstrak"]["found"]
    assert s["metodologi"]["found"]
    assert s["hasil"]["found"]
    assert s["daftar_pustaka"]["found"]
    assert missing_structures(s) == []


def test_detect_english_headings():
    text = (
        "Abstract\nThis paper studies...\n\n"
        "Methodology\nWe used...\n\n"
        "Results and Discussion\nThe results...\n\n"
        "References\n[1] Author..."
    )
    s = detect_structures(text)
    assert s["abstrak"]["found"]
    assert s["metodologi"]["found"]
    assert s["hasil"]["found"]
    assert s["daftar_pustaka"]["found"]


def test_detect_uppercase_headings():
    text = "ABSTRACT\nX\n\nMETHODS\nY\n\nRESULTS\nZ\n\nBIBLIOGRAPHY\nW"
    s = detect_structures(text)
    assert all(s[k]["found"] for k in s)


def test_detect_numbered_and_bab_headings():
    text = (
        "1. Abstrak\nIsi.\n\n"
        "BAB III METODE PENELITIAN\nIsi.\n\n"
        "4. Hasil dan Pembahasan\nIsi.\n\n"
        "III. Daftar Pustaka\nIsi."
    )
    s = detect_structures(text)
    assert s["abstrak"]["found"]
    assert s["metodologi"]["found"]
    assert s["hasil"]["found"]
    assert s["daftar_pustaka"]["found"]


def test_word_inside_paragraph_not_falsely_detected():
    # "hasil" appearing mid-sentence must not count as a heading.
    text = "Pendahuluan\nKami membahas hasil dari studi terdahulu di sini."
    s = detect_structures(text)
    assert not s["hasil"]["found"]


def test_missing_structures_listed():
    text = "ABSTRAK\nX\n\nMETODE PENELITIAN\nY\n\nHASIL\nZ"
    s = detect_structures(text)
    assert missing_structures(s) == ["daftar_pustaka"]


def test_excerpt_returned_for_found_heading():
    text = "ABSTRAK Penelitian ini bertujuan untuk menguji sistem."
    s = detect_structures(text)
    assert s["abstrak"]["found"]
    assert s["abstrak"]["excerpt"]
    assert "ABSTRAK" in s["abstrak"]["excerpt"].upper()
