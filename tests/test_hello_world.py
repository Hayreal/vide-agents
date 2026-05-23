import os
import subprocess
import pathlib

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML_PATH = REPO_ROOT / "index.html"


def test_hello_world_html_exists():
    assert HTML_PATH.exists(), f"Expected frontend file {HTML_PATH} does not exist"


def test_hello_world_html_contains_hello():
    if not HTML_PATH.exists():
        return
    html = HTML_PATH.read_text(encoding="utf-8")
    assert "hello" in html.lower(), "index.html should contain 'hello' text"


def test_hello_world_html_is_valid_html():
    if not HTML_PATH.exists():
        return
    html = HTML_PATH.read_text(encoding="utf-8")
    html = html.strip()
    assert html.startswith("<!DOCTYPE html>") or html.startswith("<html"), \
        "index.html should be a valid HTML document"
