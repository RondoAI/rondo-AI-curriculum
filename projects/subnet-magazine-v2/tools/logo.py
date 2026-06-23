"""
Rondo Research — logo generator.

Uses the canonical E8 (240-root Coxeter-plane projection from e8.py) as
the brand mark, paired with a serif "Rondo Research" wordmark.

Outputs:
  logo-horizontal-dark.{svg,png}   mark + wordmark, dark bg
  logo-horizontal-light.{svg,png}  same, light bg
  logo-stacked-dark.{svg,png}      mark above wordmark
  logo-mark.{svg,png}              E8 only, square — PFP / favicon

  python3 logo.py            # default 1600px wide
  python3 logo.py --size 3000
"""
import argparse
import numpy as np
from pathlib import Path
import drawsvg as dw
import cairosvg
from PIL import ImageFont

from e8 import geometry

# Font files used both for rendering hints and for precise width measurement
SERIF_TTF = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
MONO_TTF  = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"


def text_width(s, ttf, px, tracking=0.0):
    """Measure rendered width of `s` at font size `px`, plus letter-spacing.
    tracking is per-character extra space in px."""
    font = ImageFont.truetype(ttf, int(px))
    w = font.getlength(s)
    return w + tracking * max(0, len(s) - 1)

# Brand palette (locked — same hex as the magazine doctrine: black + red)
RED        = "#FF1E3C"
RED_SOFT   = "#FF4D60"
INK_DARK   = "#F5E5E8"
INK_LIGHT  = "#1a0a0e"
BG_DARK    = "#050203"
BG_LIGHT   = "#F5E5E8"
RULE_DARK  = "#3a121b"
RULE_LIGHT = "#d9b8bf"

_glow_n = 0


def draw_mark(d, cx, cy, r, pts, edges, *, edge_color, node_color, stroke=0.55, node_r=2.6):
    global _glow_n
    _glow_n += 1
    gid = f"glow{_glow_n}"
    f = dw.Filter(id=gid, x="-50%", y="-50%", width="200%", height="200%")
    f.append(dw.FilterItem('feGaussianBlur', stdDeviation=1.4, result='b'))
    m = dw.FilterItem('feMerge')
    m.append(dw.FilterItem('feMergeNode', in_='b'))
    m.append(dw.FilterItem('feMergeNode', in_='SourceGraphic'))
    f.append(m); d.append(f)
    g = dw.Group(stroke=edge_color, stroke_width=stroke, stroke_opacity=0.5, fill='none')
    for (i, j) in edges:
        x1, y1 = pts[i] * r; x2, y2 = pts[j] * r
        g.append(dw.Line(cx + x1, cy - y1, cx + x2, cy - y2))
    d.append(g)
    gn = dw.Group(fill=node_color, filter=f'url(#{gid})')
    for (x, y) in pts * r:
        gn.append(dw.Circle(cx + x, cy - y, node_r))
    d.append(gn)


def horizontal(pts, edges, *, size, ink, bg, rule, edge_color, node_color, stem):
    """Mark on the left, wordmark on the right. The wordmark + eyebrow are
    auto-fit: the font size is chosen so the longest line fills the text
    column to a target width, so nothing ever overflows the canvas."""
    W, H = size, int(size * 0.34)
    d = dw.Drawing(W, H, origin=(0, 0), style=f"background:{bg}")
    d.append(dw.Rectangle(0, 0, W, H, fill=bg))

    mr = H * 0.38
    mcx, mcy = H * 0.50, H * 0.50
    draw_mark(d, mcx, mcy, mr, pts, edges,
              edge_color=edge_color, node_color=node_color, stroke=0.55, node_r=mr * 0.034)

    sep = mcx + mr * 1.16
    d.append(dw.Line(sep, H * 0.24, sep, H * 0.76, stroke=rule, stroke_width=1.2))

    wx = sep + H * 0.14
    avail = W - wx - W * 0.04                      # right margin 4%

    # --- fit the serif wordmark to the available column ---
    word = "Rondo Research"
    word_track = -1.0
    word_px = H * 0.34
    w = text_width(word, SERIF_TTF, word_px, word_track)
    if w > avail:
        word_px *= avail / w                       # shrink to fit
    # baseline placed so the cap-height block centers in the upper band
    d.append(dw.Text(word, word_px, wx, H * 0.55,
                     font_family="Liberation Serif, Georgia, serif",
                     font_weight="800", letter_spacing=word_track, fill=ink))

    # --- eyebrow, fit to same column ---
    eyebrow = "DECENTRALIZED AI · RESEARCH LAB"
    eb_track = 3.0
    eb_px = H * 0.072
    ew = text_width(eyebrow, MONO_TTF, eb_px, eb_track)
    if ew > avail:
        eb_px *= avail / ew
        eb_track *= avail / ew
    d.append(dw.Text(eyebrow, eb_px, wx, H * 0.74,
                     font_family="Liberation Mono, monospace",
                     letter_spacing=eb_track, fill=ink, fill_opacity=0.55))

    p = Path(f"{stem}.svg"); d.save_svg(str(p)); return p


def stacked(pts, edges, *, size, ink, bg, rule, edge_color, node_color, stem):
    W = size; H = int(size * 1.04)
    d = dw.Drawing(W, H, origin=(0, 0), style=f"background:{bg}")
    d.append(dw.Rectangle(0, 0, W, H, fill=bg))
    mr = W * 0.30
    draw_mark(d, W / 2, H * 0.39, mr, pts, edges,
              edge_color=edge_color, node_color=node_color, stroke=0.55, node_r=mr * 0.030)
    d.append(dw.Line(W * 0.32, H * 0.76, W * 0.68, H * 0.76, stroke=rule, stroke_width=1.2))
    d.append(dw.Text("Rondo Research", W * 0.105, W / 2, H * 0.88,
                     font_family="Liberation Serif, Georgia, serif",
                     font_weight="800", letter_spacing=-1.0, text_anchor="middle", fill=ink))
    d.append(dw.Text("DECENTRALIZED AI · RESEARCH LAB", W * 0.027, W / 2, H * 0.95,
                     font_family="Liberation Mono, monospace",
                     letter_spacing=3.5, text_anchor="middle", fill=ink, fill_opacity=0.55))
    p = Path(f"{stem}.svg"); d.save_svg(str(p)); return p


def mark_only(pts, edges, *, size, bg, edge_color, node_color, stem):
    d = dw.Drawing(size, size, origin='center', style=f"background:{bg}")
    d.append(dw.Rectangle(-size/2, -size/2, size, size, fill=bg))
    r = size * 0.42
    draw_mark(d, 0, 0, r, pts, edges,
              edge_color=edge_color, node_color=node_color, stroke=0.6, node_r=r * 0.034)
    p = Path(f"{stem}.svg"); d.save_svg(str(p)); return p


def png(svg, *, w, bg):
    cairosvg.svg2png(url=str(svg), write_to=str(svg.with_suffix(".png")),
                     output_width=w, background_color=bg)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--size", type=int, default=1600)
    args = ap.parse_args()
    pts, edges = geometry()
    print(f"E8: 240 roots, {len(edges)} edges")

    s = horizontal(pts, edges, size=args.size, ink=INK_DARK, bg=BG_DARK,
                   rule=RULE_DARK, edge_color=RED, node_color=RED_SOFT,
                   stem="logo-horizontal-dark"); png(s, w=args.size, bg=BG_DARK)
    print(f"✓ {s.name} + png")

    s = horizontal(pts, edges, size=args.size, ink=INK_LIGHT, bg=BG_LIGHT,
                   rule=RULE_LIGHT, edge_color=RED, node_color=RED,
                   stem="logo-horizontal-light"); png(s, w=args.size, bg=BG_LIGHT)
    print(f"✓ {s.name} + png")

    s = stacked(pts, edges, size=int(args.size * 0.75), ink=INK_DARK, bg=BG_DARK,
                rule=RULE_DARK, edge_color=RED, node_color=RED_SOFT,
                stem="logo-stacked-dark"); png(s, w=int(args.size * 0.75), bg=BG_DARK)
    print(f"✓ {s.name} + png")

    s = mark_only(pts, edges, size=1024, bg=BG_DARK,
                  edge_color=RED, node_color=RED_SOFT, stem="logo-mark")
    png(s, w=1024, bg=BG_DARK)
    print(f"✓ {s.name} + png")


if __name__ == "__main__":
    main()
