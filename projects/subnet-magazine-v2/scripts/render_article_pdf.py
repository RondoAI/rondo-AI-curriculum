#!/usr/bin/env python3
"""
ORACLE ARTICLE PDF RENDERER
-----------------------------------------------------------------
Renders one Oracle article (as a dict matching the shape used in
src/data/oracle-articles.js) to a dark-mode PDF in
oracle-articles/{id}.pdf. Same visual grammar as the rest of the
site: black background, red accent, mono captions.

Called by scripts/daily-research.py after each article is composed,
and can be run standalone:
  python scripts/render-article-pdf.py <article-id>

Public entry point: render_article_pdf(article_dict) -> Path
"""

from __future__ import annotations

from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
)

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "oracle-articles"

# ---------- colors, matching the site's design tokens ----------
C_BG       = HexColor("#080203")  # near-black
C_BG_2     = HexColor("#0E0405")  # one tick lighter
C_RED      = HexColor("#FF1E3C")
C_RED_1    = HexColor("#FF4D60")
C_AMBER    = HexColor("#FFB85C")
C_INK_1    = HexColor("#F5E5E8")  # primary text
C_INK_2    = HexColor("#C8A8AD")  # secondary text
C_INK_3    = HexColor("#8B6B70")  # muted
C_INK_4    = HexColor("#6B4D52")  # very muted
C_RULE     = HexColor("#3A1419")

# ---------- styles ----------
def _styles():
    """Build paragraph styles once per render. Helvetica is the
    portable default; we keep things consistent so the PDFs look like
    a magazine, not a slide."""
    return {
        "badge": ParagraphStyle(
            "badge", fontName="Helvetica-Bold", fontSize=8.5,
            leading=11, textColor=C_RED,
            spaceAfter=4,
        ),
        "kind": ParagraphStyle(
            "kind", fontName="Helvetica-Bold", fontSize=10,
            leading=14, textColor=C_RED_1,
            spaceAfter=8,
        ),
        "title": ParagraphStyle(
            "title", fontName="Helvetica-Bold", fontSize=22,
            leading=27, textColor=C_INK_1,
            spaceAfter=10,
        ),
        "dek": ParagraphStyle(
            "dek", fontName="Helvetica-Oblique", fontSize=12,
            leading=18, textColor=C_INK_2,
            spaceAfter=14,
            leftIndent=8, borderColor=C_RED_1, borderWidth=0,
        ),
        "attr": ParagraphStyle(
            "attr", fontName="Helvetica-Bold", fontSize=8,
            leading=11, textColor=C_RED_1,
            spaceAfter=18,
        ),
        "section_h": ParagraphStyle(
            "section_h", fontName="Helvetica-Bold", fontSize=14,
            leading=18, textColor=C_RED_1,
            spaceBefore=10, spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "body", fontName="Helvetica", fontSize=10.5,
            leading=16, textColor=C_INK_1,
            spaceAfter=8,
        ),
        "src_label": ParagraphStyle(
            "src_label", fontName="Helvetica-Bold", fontSize=9,
            leading=12, textColor=C_INK_3,
            spaceBefore=14, spaceAfter=4,
        ),
        "src": ParagraphStyle(
            "src", fontName="Helvetica", fontSize=8.5,
            leading=12, textColor=C_RED_1,
            leftIndent=12, spaceAfter=2,
        ),
        "foot": ParagraphStyle(
            "foot", fontName="Helvetica-Bold", fontSize=7.5,
            leading=10, textColor=C_INK_4,
        ),
    }


def _draw_chrome(canvas, doc):
    """Paint the dark background, red accent rail, and the header /
    footer chrome on every page. Called by reportlab once per page."""
    w, h = letter

    # Fill the entire page black
    canvas.saveState()
    canvas.setFillColor(C_BG)
    canvas.rect(0, 0, w, h, fill=1, stroke=0)

    # Top brand bar
    canvas.setStrokeColor(C_RED)
    canvas.setLineWidth(2)
    canvas.line(0.5 * inch, h - 0.5 * inch, w - 0.5 * inch, h - 0.5 * inch)

    canvas.setFillColor(C_RED)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(0.5 * inch, h - 0.4 * inch, "⊕ SUBNET ORACLE RESEARCH")
    canvas.setFillColor(C_INK_3)
    canvas.setFont("Helvetica", 8)
    canvas.drawRightString(w - 0.5 * inch, h - 0.4 * inch, "Subneτ Magazine · AI-filed")

    # Left accent rail, the AI-attribution marker
    canvas.setFillColor(C_RED)
    canvas.rect(0.4 * inch, 0.6 * inch, 3, h - 1.2 * inch, fill=1, stroke=0)

    # Footer
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.5)
    canvas.line(0.5 * inch, 0.55 * inch, w - 0.5 * inch, 0.55 * inch)
    canvas.setFillColor(C_INK_4)
    canvas.setFont("Helvetica", 7.5)
    canvas.drawString(0.5 * inch, 0.4 * inch, "Filed by the AI Oracle (Claude Opus 4.7). Dry, mechanism-aware, hedged.")
    canvas.drawRightString(w - 0.5 * inch, 0.4 * inch, f"Page {doc.page}")
    canvas.restoreState()


def _esc(s: str) -> str:
    """Escape for reportlab Paragraph XML."""
    return (
        str(s or "")
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def render_article_pdf(article: dict) -> Path:
    """Render one Oracle article to a dark-mode PDF.
    Returns the relative path (from project root) of the written file."""
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / f"{article['id']}.pdf"

    doc = BaseDocTemplate(
        str(out_path),
        pagesize=letter,
        leftMargin=0.7 * inch,
        rightMargin=0.6 * inch,
        topMargin=0.85 * inch,
        bottomMargin=0.75 * inch,
        title=article.get("title", "Oracle Article"),
        author="Subneτ Magazine, Subnet Oracle Research",
    )
    frame = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        doc.width,
        doc.height,
        showBoundary=0,
    )
    doc.addPageTemplates([PageTemplate(id="dark", frames=[frame], onPage=_draw_chrome)])

    s = _styles()
    flow = []

    # ===== HEADER =====
    flow.append(Paragraph("⊕ SUBNET ORACLE RESEARCH", s["badge"]))
    if article.get("kind") == "subnet-spotlight":
        sn_id = article.get("subnetId", "?")
        sn_nm = article.get("subnetName", "")
        kind_text = f"SUBNET SPOTLIGHT &nbsp; · &nbsp; SN{sn_id} {_esc(sn_nm)}"
    else:
        kind_text = "ECOSYSTEM STATE"
    flow.append(Paragraph(kind_text, s["kind"]))

    flow.append(Paragraph(_esc(article.get("title", "")), s["title"]))
    flow.append(Paragraph(_esc(article.get("dek", "")), s["dek"]))

    filer = (
        "the AI Oracle (Claude Opus 4.7)"
        if article.get("generatedBy") == "claude-opus-4-7"
        else "the editorial desk (seed)"
    )
    date_str = article.get("date", "")
    flow.append(Paragraph(f"⊕ {date_str} &nbsp; · &nbsp; filed by {filer}", s["attr"]))

    # ===== SECTIONS =====
    for sec in article.get("sections", []) or []:
        flow.append(Paragraph(_esc(sec.get("h", "")), s["section_h"]))
        # Split on double-newlines so the body's paragraph breaks survive
        for para in str(sec.get("body", "")).split("\n\n"):
            para = para.strip()
            if not para:
                continue
            # Replace single newlines with <br/> so line breaks in the
            # source survive Paragraph rendering
            para_html = _esc(para).replace("\n", "<br/>")
            flow.append(Paragraph(para_html, s["body"]))

    # ===== SOURCES =====
    sources = article.get("sources") or []
    if sources:
        flow.append(Spacer(1, 8))
        flow.append(Paragraph("SOURCES", s["src_label"]))
        for src in sources:
            label = _esc(src.get("label", ""))
            url = _esc(src.get("url", ""))
            flow.append(
                Paragraph(
                    f'<link href="{url}" color="#FF4D60">↗ {label}</link>',
                    s["src"],
                )
            )

    doc.build(flow)
    return out_path


# ---------- standalone usage ----------
def _cli():
    """Render every article in src/data/oracle-articles.js. Cheap and
    deterministic, no API call needed. Useful for batch regeneration
    after style changes."""
    import json
    import re
    src = (ROOT / "src" / "data" / "oracle-articles.js").read_text("utf-8")

    # extract the array literal
    m = re.search(r"export const ORACLE_ARTICLES = Object\.freeze\(\[(.*?)\]\);", src, re.DOTALL)
    if not m:
        print("could not parse ORACLE_ARTICLES")
        return 1
    body = m.group(1)

    # very lightweight JS-object-literal parser by way of regex; we
    # only need to pull id/date/kind/subnetId/subnetName/title/dek/
    # sections/sources for the render. For anything more complex this
    # would need a real parser, but the file is generated by us so
    # the shape is stable.
    entries = []
    for entry_match in re.finditer(r"\{\s*id:\s*'([^']+)'.*?\n\s*\},", body, re.DOTALL):
        entry = entry_match.group(0)
        eid = re.search(r"id:\s*'([^']+)'", entry).group(1)
        edate = re.search(r"date:\s*'([^']+)'", entry).group(1)
        ekind = re.search(r"kind:\s*'([^']+)'", entry).group(1)
        title = re.search(r"title:\s*'(.+?)',\s*\n", entry).group(1).replace("\\'", "'")
        dek = re.search(r"dek:\s*'(.+?)',\s*\n", entry).group(1).replace("\\'", "'")
        sn_id_m = re.search(r"subnetId:\s*(\d+)", entry)
        sn_nm_m = re.search(r"subnetName:\s*'([^']+)'", entry)

        # sections: list of { h: '...', body: '...' }
        sections = []
        for sec in re.finditer(
            r"\{\s*h:\s*'((?:[^'\\]|\\.)*)',\s*\n\s*body:\s*'((?:[^'\\]|\\.)*)'\s*\}",
            entry, re.DOTALL,
        ):
            sections.append({
                "h":    sec.group(1).replace("\\'", "'").replace("\\\\", "\\"),
                "body": sec.group(2).replace("\\'", "'").replace("\\\\", "\\").replace("\\n", "\n"),
            })

        sources = []
        for src_m in re.finditer(
            r"\{\s*label:\s*'((?:[^'\\]|\\.)*)',\s*url:\s*'((?:[^'\\]|\\.)*)'\s*\}",
            entry, re.DOTALL,
        ):
            sources.append({
                "label": src_m.group(1).replace("\\'", "'"),
                "url":   src_m.group(2).replace("\\'", "'"),
            })

        gen_m = re.search(r"generatedBy:\s*'([^']+)'", entry)

        article = {
            "id": eid, "date": edate, "kind": ekind,
            "title": title, "dek": dek,
            "sections": sections, "sources": sources,
            "generatedBy": gen_m.group(1) if gen_m else "editorial-seed",
        }
        if sn_id_m: article["subnetId"]   = int(sn_id_m.group(1))
        if sn_nm_m: article["subnetName"] = sn_nm_m.group(1)
        entries.append(article)

    for a in entries:
        path = render_article_pdf(a)
        print(f"[ok] {a['id']} -> {path.relative_to(ROOT)}")

    return 0


if __name__ == "__main__":
    import sys
    sys.exit(_cli())
