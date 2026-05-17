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

# ---------- font embedding ----------
# The site's brand wordmark "Subneτ Magazine" is rendered on the
# web in Archivo (var(--f-serif)). Helvetica's tau glyph (U+03C4)
# is visibly different from Archivo's, so a PDF set in Helvetica
# would show a wrong-looking τ in the header band. Register the
# real Archivo Regular + Bold TTF that ship in assets/fonts/ so
# every PDF the site serves uses the same wordmark glyph as the
# web pages. Falls back silently to Helvetica if the files are
# missing (e.g. fresh clone before the asset is fetched).
_FONTS_DIR = ROOT / "assets" / "fonts"
BRAND_FONT = "Helvetica-Bold"            # default fallback
BRAND_FONT_REG = "Helvetica"
try:
    pdfmetrics.registerFont(TTFont("Archivo", str(_FONTS_DIR / "Archivo-Regular.ttf")))
    pdfmetrics.registerFont(TTFont("Archivo-Bold", str(_FONTS_DIR / "Archivo-Bold.ttf")))
    BRAND_FONT = "Archivo-Bold"
    BRAND_FONT_REG = "Archivo"
except Exception:
    pass

# Two output trees, the same renderer feeds both. Articles authored
# by the Subnet Oracle (Claude Opus 4.7) land in oracle-articles/.
# Team / human-authored Subneτ Magazine articles land in articles/
# so every PDF the reader can open from anywhere on the site
# follows one consistent dark-mode visual language. The article
# dict's "article_type" field ('oracle' default, or 'team') picks
# the destination and toggles a handful of strings in the chrome.
OUT_DIRS = {
    "oracle": ROOT / "oracle-articles",
    "team":   ROOT / "articles",
}
OUT_DIR = OUT_DIRS["oracle"]  # back-compat default for existing callers

# Display labels for team-article categories, used as the kicker
# under the "SUBNEτ MAGAZINE" badge. Mirrors src/data/articles.js
# Article.category union.
CATEGORY_LABELS = {
    "reporting":   "REPORTING",
    "profile":     "SUBNET PROFILE",
    "op-ed":       "OP-ED",
    "fund-letter": "FUND LETTER",
    "primer":      "PRIMER",
    "interview":   "INTERVIEW",
}

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
    """Build paragraph styles once per render. Every style uses the
    embedded Archivo font so the τ glyph (and the whole wordmark)
    is identical to what the web pages render in their masthead.
    Falls back to Helvetica silently via BRAND_FONT_* if the .ttf
    files aren't present (covered by the registration in the module
    header, which only swaps the names if the load succeeded)."""
    body_font = BRAND_FONT_REG
    bold_font = BRAND_FONT
    return {
        "badge": ParagraphStyle(
            "badge", fontName=bold_font, fontSize=8.5,
            leading=11, textColor=C_RED,
            spaceAfter=4,
        ),
        "kind": ParagraphStyle(
            "kind", fontName=bold_font, fontSize=10,
            leading=14, textColor=C_RED_1,
            spaceAfter=8,
        ),
        "title": ParagraphStyle(
            "title", fontName=bold_font, fontSize=22,
            leading=27, textColor=C_INK_1,
            spaceAfter=10,
        ),
        "dek": ParagraphStyle(
            "dek", fontName=body_font, fontSize=12,
            leading=18, textColor=C_INK_2,
            spaceAfter=14,
            leftIndent=8, borderColor=C_RED_1, borderWidth=0,
        ),
        "attr": ParagraphStyle(
            "attr", fontName=bold_font, fontSize=8,
            leading=11, textColor=C_RED_1,
            spaceAfter=18,
        ),
        "section_h": ParagraphStyle(
            "section_h", fontName=bold_font, fontSize=14,
            leading=18, textColor=C_RED_1,
            spaceBefore=10, spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "body", fontName=body_font, fontSize=10.5,
            leading=16, textColor=C_INK_1,
            spaceAfter=8,
        ),
        "src_label": ParagraphStyle(
            "src_label", fontName=bold_font, fontSize=9,
            leading=12, textColor=C_INK_3,
            spaceBefore=14, spaceAfter=4,
        ),
        "src": ParagraphStyle(
            "src", fontName=body_font, fontSize=8.5,
            leading=12, textColor=C_RED_1,
            leftIndent=12, spaceAfter=2,
        ),
        "foot": ParagraphStyle(
            "foot", fontName=bold_font, fontSize=7.5,
            leading=10, textColor=C_INK_4,
        ),
    }


def _draw_node_sphere(canvas, cx, cy, radius, seed=0):
    """A static snapshot of the Subnet Oracle's neural-network mark,
    rendered into PDF space. Deterministic from seed so each article
    has its own distinct mark while the visual language stays
    consistent. Nodes on a sphere projected to 2D, edges between
    nearest neighbors below a distance threshold, drawn in the same
    red accent as the rest of the chrome."""
    import math, random
    rng = random.Random(seed)
    n_nodes = 36
    # Generate points on a sphere via golden-angle spiral, perturb a
    # touch so each article's mark is slightly different.
    pts = []
    phi = math.pi * (3.0 - math.sqrt(5.0))
    for i in range(n_nodes):
        y = 1 - (i / max(1, n_nodes - 1)) * 2
        r = math.sqrt(max(0.0, 1 - y * y))
        theta = phi * i + rng.uniform(-0.15, 0.15)
        x = math.cos(theta) * r
        z = math.sin(theta) * r
        pts.append((x, y, z))
    # Rotate the sphere slightly per seed so two articles don't share
    # the same silhouette.
    ry = rng.uniform(0, 2 * math.pi)
    cos_y, sin_y = math.cos(ry), math.sin(ry)
    rotated = [(x * cos_y + z * sin_y, y, -x * sin_y + z * cos_y) for (x, y, z) in pts]
    # Project to 2D, with depth-based alpha for the back hemisphere
    proj = [(cx + p[0] * radius, cy + p[1] * radius, p[2]) for p in rotated]

    canvas.saveState()
    # Edges between nodes whose 3D distance is short
    canvas.setLineWidth(0.35)
    for i in range(len(rotated)):
        for j in range(i + 1, len(rotated)):
            dx = rotated[i][0] - rotated[j][0]
            dy = rotated[i][1] - rotated[j][1]
            dz = rotated[i][2] - rotated[j][2]
            d = math.sqrt(dx * dx + dy * dy + dz * dz)
            if d < 0.55:
                depth = (rotated[i][2] + rotated[j][2]) / 2.0
                alpha = 0.18 + (depth + 1) * 0.30
                alpha = max(0.10, min(0.85, alpha))
                canvas.setStrokeColorRGB(1.0, 30 / 255.0, 60 / 255.0, alpha=alpha)
                canvas.line(proj[i][0], proj[i][1], proj[j][0], proj[j][1])
    # Nodes
    for x, y, z in proj:
        alpha = 0.35 + (z + 1) * 0.30
        alpha = max(0.30, min(1.0, alpha))
        r = 0.9 + (z + 1) * 0.6
        canvas.setFillColorRGB(1.0, 77 / 255.0, 96 / 255.0, alpha=alpha)
        canvas.circle(x, y, r, fill=1, stroke=0)
    canvas.restoreState()


def _draw_chrome(canvas, doc):
    """Paint the dark background, red accent rail, header/footer chrome,
    and, on the first page only, the Subnet Oracle node-sphere mark.
    Called by reportlab once per page. Header/footer text switches on
    doc._article_type, so the same chrome serves both Oracle research
    and team-authored Subneτ Magazine articles, one unified dark-mode
    template across the whole site."""
    w, h = letter
    article_type = getattr(doc, "_article_type", "oracle")
    is_team = article_type == "team"

    # Fill the entire page black
    canvas.saveState()
    canvas.setFillColor(C_BG)
    canvas.rect(0, 0, w, h, fill=1, stroke=0)

    # Top brand bar
    canvas.setStrokeColor(C_RED)
    canvas.setLineWidth(2)
    canvas.line(0.5 * inch, h - 0.5 * inch, w - 0.5 * inch, h - 0.5 * inch)

    canvas.setFillColor(C_RED)
    # Use Archivo for the brand wordmark in the header band so the
    # "Subneτ MAGAZINE" τ glyph matches the site's masthead exactly.
    # Falls back to Helvetica-Bold transparently if Archivo wasn't
    # registered. Oracle's "SUBNET ORACLE RESEARCH" band has no τ
    # but stays in the same font for cross-template consistency.
    canvas.setFont(BRAND_FONT, 9)
    badge = "⊕ SUBNEτ MAGAZINE" if is_team else "⊕ SUBNET ORACLE RESEARCH"
    canvas.drawString(0.5 * inch, h - 0.4 * inch, badge)
    canvas.setFillColor(C_INK_3)
    canvas.setFont(BRAND_FONT_REG, 8)
    right_label = (
        getattr(doc, "_top_right", None) or
        ("Subneτ Magazine · Editorial Desk" if is_team
         else "Subneτ Magazine · Filed by Subnet Oracle")
    )
    canvas.drawRightString(w - 0.5 * inch, h - 0.4 * inch, right_label)

    # Left accent rail, the brand-attribution marker
    canvas.setFillColor(C_RED)
    canvas.rect(0.4 * inch, 0.6 * inch, 3, h - 1.2 * inch, fill=1, stroke=0)

    # First-page neural-network signature, watermarked behind the
    # text. Sized large enough to read as the brand mark, subtle
    # enough that body text remains legible above it.
    if doc.page == 1:
        seed = hash(getattr(doc, '_oracle_article_id', 'subnet-oracle')) & 0xFFFFFFFF
        _draw_node_sphere(canvas, w - 1.6 * inch, h - 2.2 * inch,
                          radius=0.7 * inch, seed=seed)
        canvas.setFillColor(C_INK_4)
        canvas.setFont("Helvetica-Bold", 6.5)
        # Watermark caption also goes through Archivo so its τ glyph
        # matches the header band above it.
        canvas.setFont(BRAND_FONT, 6.5)
        watermark = "SUBNEτ MAGAZINE · LIVE" if is_team else "SUBNET ORACLE · LIVE"
        canvas.drawCentredString(w - 1.6 * inch, h - 3.05 * inch, watermark)

    # Footer
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.5)
    canvas.line(0.5 * inch, 0.55 * inch, w - 0.5 * inch, 0.55 * inch)
    canvas.setFillColor(C_INK_4)
    # Footer also uses Archivo so the τ in "Subneτ Magazine"
    # there matches everywhere else.
    canvas.setFont(BRAND_FONT_REG, 7.5)
    foot_line = (
        getattr(doc, "_footer_line", None) or
        ("Filed by Subneτ Magazine. Editorial standard: long-form, mechanism-aware, sourced."
         if is_team
         else "Filed by the Subnet Oracle (Claude Opus 4.7). Dry, mechanism-aware, hedged.")
    )
    canvas.drawString(0.5 * inch, 0.4 * inch, foot_line)
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
    """Render one article to a dark-mode PDF.
    Returns the relative path (from project root) of the written file.

    Article type is selected by article["article_type"]:
      - "oracle" (default): SUBNET ORACLE RESEARCH header, files into
        oracle-articles/, attribution to the Subnet Oracle.
      - "team": SUBNEτ MAGAZINE header, files into articles/,
        attribution to the article's authors[], shows category +
        issue line in the kicker."""
    article_type = article.get("article_type", "oracle")
    out_dir = OUT_DIRS.get(article_type, OUT_DIRS["oracle"])
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{article['id']}.pdf"
    is_team = article_type == "team"

    pdf_author = (
        ", ".join(article.get("authors") or ["Subneτ Magazine"])
        if is_team else "Subneτ Magazine, Subnet Oracle Research"
    )

    doc = BaseDocTemplate(
        str(out_path),
        pagesize=letter,
        leftMargin=0.7 * inch,
        rightMargin=0.6 * inch,
        topMargin=0.85 * inch,
        bottomMargin=0.75 * inch,
        title=article.get("title", "Article"),
        author=pdf_author,
    )
    frame = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        doc.width,
        doc.height,
        showBoundary=0,
    )
    # Stash per-document context on the doc object so the chrome
    # callback can pick header/footer text and seed the node-sphere.
    doc._oracle_article_id = article.get("id", "subnet-oracle")
    doc._article_type = article_type
    if is_team:
        issue = article.get("issue") or ""
        doc._footer_line = (
            f"Subneτ Magazine. {issue}" if issue
            else "Subneτ Magazine. Editorial desk."
        )
        doc._top_right = "Subneτ Magazine · Editorial Desk"
    doc.addPageTemplates([PageTemplate(id="dark", frames=[frame], onPage=_draw_chrome)])

    s = _styles()
    flow = []

    # ===== HEADER =====
    if is_team:
        flow.append(Paragraph("⊕ SUBNEτ MAGAZINE", s["badge"]))
        cat = article.get("category", "")
        cat_label = CATEGORY_LABELS.get(cat, cat.upper() if cat else "FEATURE")
        issue = article.get("issue", "")
        kind_text = f"{cat_label} &nbsp; · &nbsp; {_esc(issue)}" if issue else cat_label
    else:
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

    if is_team:
        authors_str = ", ".join(article.get("authors") or ["Subneτ Magazine"])
        filer = authors_str
    else:
        filer = (
            "the Subnet Oracle (Claude Opus 4.7)"
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
