#!/usr/bin/env python3
"""
CONVERT TEAM ARTICLES → UNIFIED DARK-MODE PDF
-----------------------------------------------------------------
Takes every team-authored Subneτ Magazine article (those listed in
src/data/articles.js with a local pdf: path) and re-renders it
through scripts/render_article_pdf.py so all article PDFs across
the site share one consistent dark-mode visual language.

For each article:
  1. Read metadata (title, dek, authors, date, issue, category)
     from src/data/articles.js via a small node subprocess.
  2. Extract body text from the existing PDF with pdftotext -layout.
  3. Strip front-matter the renderer is going to re-emit from
     metadata (title, byline, kicker) plus running headers/footers
     that pdftotext captures verbatim from every page.
  4. Hand the cleaned (title + body) to render_article_pdf with
     article_type='team'. The output lands at
     projects/subnet-magazine-v2/articles/<id>.pdf, overwriting
     the previous version.

Run from project root:
  python projects/subnet-magazine-v2/scripts/convert_team_articles_to_dark_pdf.py
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).parent))
from render_article_pdf import render_article_pdf  # noqa: E402


# ---------- load metadata ----------
def load_articles() -> list[dict]:
    """Dump the ARTICLES export from articles.js to JSON via node."""
    js_path = ROOT / "src" / "data" / "articles.js"
    snippet = (
        f"import('{js_path.as_uri()}').then(m => "
        f"process.stdout.write(JSON.stringify(m.ARTICLES)))"
    )
    result = subprocess.run(
        ["node", "--input-type=module", "-e", snippet],
        capture_output=True, text=True, cwd=str(ROOT),
    )
    if result.returncode != 0:
        raise RuntimeError(
            f"failed to load articles.js: {result.stderr.strip()}"
        )
    return json.loads(result.stdout)


# ---------- extract + clean ----------
def extract_pdf_text(pdf_path: Path) -> str:
    result = subprocess.run(
        ["pdftotext", "-layout", str(pdf_path), "-"],
        capture_output=True, text=True,
    )
    return result.stdout


_norm_ws = re.compile(r"\s+")


def _normalize(s: str) -> str:
    return _norm_ws.sub(" ", s).strip().lower()


def clean_body(raw: str, article: dict) -> str:
    """Three-pass cleanup of the extracted text:

      1. Find where the article body actually starts. Articles.js
         carries the first paragraph of each piece in abstract[0],
         so we search for it in the extracted text and discard
         everything before it (the cover title block, tagline,
         byline, read-time, image captions, repeated metadata).
      2. Strip lines that pdftotext picked up from every page
         (running headers/footers) and from the common chrome
         pattern (issue lines, page numbers, twitter handles,
         bylines that survived step 1).
      3. De-wrap paragraphs. pdftotext -layout preserves the source
         PDF's narrow column wraps, which read as ragged when the
         Oracle template re-flows them into its wider single
         column. Join single-line breaks within a paragraph back
         into one line so reportlab can flow them naturally.
    """
    lines = [ln.rstrip() for ln in raw.split("\n")]

    # ----- pass 1: locate body start via abstract[0] -----
    abstract = article.get("abstract") or []
    body_start = 0
    if abstract:
        key = _normalize(abstract[0])[:40]
        if key:
            for i, ln in enumerate(lines):
                if key and key in _normalize(ln):
                    body_start = i
                    break
    body_lines = lines[body_start:]

    # ----- pass 2: strip running chrome -----
    counts = Counter(ln.strip() for ln in body_lines if ln.strip())
    repeated = {ln for ln, n in counts.items() if n >= 3}

    chrome_re = re.compile(
        r"^("
        r"(⊕\s*)?SUBNE.*MAGAZINE"               # running headers, with/without ⊕
        r"|.*SUBNE.*MAGAZINE.*Editorial.*Desk"  # combined-line running header
        r"|.*SUBNE.*MAGAZINE.*SN\d+"            # SN-tagged running header
        r"|@subnetmagazine|@subne"
        r"|#TAO|#SN\d+"
        r"|\d+\s+subnetmagazine\.com\s*$"        # page footer like "2 subnetmagazine.com"
        r"|subnetmagazine\.com\s*\d+\s*$"
        r"|Page\s+\d+(\s+of\s+\d+)?\s*$"
        r"|ISSUE\s+\d+|Issue\s+\d+|Vol\.|Volume\s+\d+"
        r"|Editor[:\s]|Edited by"
        r"|By\s+Subne|By\s+the\s+Subne|filed by"
        r"|~?\d+\s*minute\s*read\s*$"
        r"|©\s*\d{4}"
        r"|\d{1,2}\s+\w+\s+\d{4}\s*$"
        r")",
        re.IGNORECASE,
    )

    title = (article.get("title") or "").strip()
    title_key = _normalize(title)[:25]

    cleaned: list[str] = []
    for ln in body_lines:
        s = ln.strip()
        if not s:
            cleaned.append("")
            continue
        if s in repeated:
            continue
        if chrome_re.match(s):
            continue
        # Any line that contains a long prefix of the title is title
        # chrome (cover, running header), drop it. Length cap on s
        # avoids stripping a sentence in body that legitimately
        # quotes the title.
        if title_key and title_key in _normalize(s) and len(s) <= 90:
            continue
        if len(s) <= 2:
            continue
        cleaned.append(ln)

    body = "\n".join(cleaned)
    body = re.sub(r"\n{3,}", "\n\n", body).strip()

    # Strip uniform leading indent from pdftotext -layout
    out_lines = body.split("\n")
    indent = min(
        (len(ln) - len(ln.lstrip(" ")) for ln in out_lines if ln.strip()),
        default=0,
    )
    if indent:
        out_lines = [ln[indent:] if len(ln) >= indent else ln
                     for ln in out_lines]
    body = "\n".join(out_lines)

    # ----- pass 3: de-wrap paragraphs -----
    # Split into paragraph blocks (separated by blank lines), then
    # collapse single-line wraps within each block into one line.
    paragraphs = re.split(r"\n\s*\n", body)
    dewrapped = []
    for p in paragraphs:
        joined = " ".join(line.strip() for line in p.split("\n") if line.strip())
        joined = re.sub(r"\s{2,}", " ", joined).strip()
        if joined:
            dewrapped.append(joined)
    return "\n\n".join(dewrapped)


# ---------- driver ----------
def main() -> int:
    articles = load_articles()
    print(f"loaded {len(articles)} articles from articles.js")
    converted = skipped = 0

    for art in articles:
        pdf_rel = art.get("pdf")
        if not pdf_rel:
            print(f"  skip {art['id']}: no local pdf (likely external)")
            skipped += 1
            continue
        pdf_path = ROOT / pdf_rel
        if not pdf_path.exists():
            print(f"  skip {art['id']}: missing {pdf_path}")
            skipped += 1
            continue

        print(f"  convert {art['id']}", flush=True)
        body = clean_body(extract_pdf_text(pdf_path), art)

        article_dict = {
            "id":           art["id"],
            "title":        art.get("title", ""),
            "dek":          art.get("tagline", ""),
            "date":         art.get("date", ""),
            "article_type": "team",
            "category":     art.get("category", ""),
            "authors":      art.get("authors", []) or ["Subneτ Magazine"],
            "issue":        art.get("issue", ""),
            # Single section, the renderer's section_h is empty so the
            # body flows directly under the attribution line, faithful
            # to the source article without imposing artificial breaks
            # we cannot reliably detect from layout-stripped text.
            "sections":     [{"h": "", "body": body}],
        }
        out = render_article_pdf(article_dict)
        # The renderer writes to articles/{id}.pdf by convention,
        # but for one article (stillcore-capital-decentralized-ai)
        # the pdf path in articles.js does NOT match the id. Rename
        # the output to the path articles.js actually links to,
        # otherwise the site would still serve the old un-converted
        # file.
        desired = ROOT / pdf_rel
        if out.resolve() != desired.resolve():
            desired.parent.mkdir(parents=True, exist_ok=True)
            out.replace(desired)
            out = desired
        print(f"    -> {out.relative_to(ROOT)}")
        converted += 1

    print(f"done. converted {converted}, skipped {skipped}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
