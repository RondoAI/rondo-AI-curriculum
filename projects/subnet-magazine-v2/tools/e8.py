"""
TRUE E8 root system -> 2D Coxeter plane projection.

E8 has exactly 240 root vectors in 8 dimensions. The canonical 2D image
(the iconic "petal flower") is obtained by projecting onto the Coxeter
plane: the eigenvector of the Coxeter element with eigenvalue e^(2*pi*i/h),
where h = 30 is E8's Coxeter number.

This module is the single source of truth for the E8 mark geometry. Both
e8.py (standalone render) and logo.py (brand lockups) import from it.

  python3 e8.py                 # writes e8.svg + e8.png in cwd
  python3 e8.py --size 2000
"""
import argparse
import numpy as np
from itertools import combinations, product as iproduct
from pathlib import Path

RED      = "#FF1E3C"
RED_SOFT = "#FF4D60"
BG       = "#050203"


def build_roots():
    """112 vectors (+-1,+-1,0^6) all perms + 128 vectors (+-1/2)^8 with
    an even number of minus signs. Total 240."""
    roots = []
    for i, j in combinations(range(8), 2):
        for si, sj in iproduct([1, -1], [1, -1]):
            v = np.zeros(8); v[i] = si; v[j] = sj
            roots.append(v)
    for signs in iproduct([0.5, -0.5], repeat=8):
        if sum(1 for s in signs if s < 0) % 2 == 0:
            roots.append(np.array(signs))
    R = np.array(roots)
    assert R.shape == (240, 8), f"got {R.shape}"
    return R


def simple_roots():
    e = np.eye(8)
    return np.array([
        e[0] - e[1], e[1] - e[2], e[2] - e[3], e[3] - e[4],
        e[4] - e[5], e[5] - e[6], e[6] + e[7], -0.5 * np.ones(8),
    ])


def coxeter_element(alphas):
    M = np.eye(8)
    for a in alphas:
        R = np.eye(8) - 2 * np.outer(a, a) / np.dot(a, a)
        M = M @ R
    return M


def coxeter_plane(C):
    """(real, imag) of the eigenvector with eigenvalue e^(2*pi*i/30)."""
    eigvals, eigvecs = np.linalg.eig(C)
    idx = np.argmin(np.abs(eigvals - np.exp(2j * np.pi / 30)))
    v = eigvecs[:, idx]
    u_re = np.real(v); u_re /= np.linalg.norm(u_re)
    u_im = np.imag(v); u_im /= np.linalg.norm(u_im)
    return u_re, u_im


def edges_of(R):
    """Roots adjacent iff inner product == 1 (E8 roots have squared norm 2)."""
    edges = []
    for i in range(len(R)):
        for j in range(i + 1, len(R)):
            if abs(np.dot(R[i], R[j]) - 1.0) < 1e-9:
                edges.append((i, j))
    return edges


def geometry():
    """Compute normalized (pts2d, edges) once. pts2d scaled to unit max radius."""
    R = build_roots()
    u, v = coxeter_plane(coxeter_element(simple_roots()))
    pts = np.column_stack([R @ u, R @ v])
    pts = pts / np.max(np.linalg.norm(pts, axis=1))
    return pts, edges_of(R)


def emit_svg(pts, edges, out_path, *, size=1500, stroke=0.45, node_r=3.0,
             edge_color=RED, node_color=RED_SOFT, bg=BG):
    import drawsvg as dw
    half = size / 2
    scale = half - size * 0.06
    d = dw.Drawing(size, size, origin='center', style=f"background:{bg}")
    f = dw.Filter(id="glow", x="-50%", y="-50%", width="200%", height="200%")
    f.append(dw.FilterItem('feGaussianBlur', stdDeviation=1.6, result='b'))
    m = dw.FilterItem('feMerge')
    m.append(dw.FilterItem('feMergeNode', in_='b'))
    m.append(dw.FilterItem('feMergeNode', in_='SourceGraphic'))
    f.append(m); d.append(f)
    g = dw.Group(stroke=edge_color, stroke_width=stroke, stroke_opacity=0.45, fill='none')
    for (i, j) in edges:
        x1, y1 = pts[i] * scale; x2, y2 = pts[j] * scale
        g.append(dw.Line(x1, -y1, x2, -y2))
    d.append(g)
    gn = dw.Group(fill=node_color, filter='url(#glow)')
    for (x, y) in pts * scale:
        gn.append(dw.Circle(x, -y, node_r))
    d.append(gn)
    d.save_svg(str(out_path))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--size", type=int, default=1500)
    ap.add_argument("--stroke", type=float, default=0.45)
    ap.add_argument("--node-r", type=float, default=3.0)
    ap.add_argument("--out", type=str, default="e8")
    args = ap.parse_args()
    pts, edges = geometry()
    print(f"roots: 240   edges: {len(edges)}   Coxeter h = 30")
    svg = Path(args.out + ".svg")
    emit_svg(pts, edges, svg, size=args.size, stroke=args.stroke, node_r=args.node_r)
    import cairosvg
    cairosvg.svg2png(url=str(svg), write_to=str(svg.with_suffix(".png")),
                     output_width=args.size, output_height=args.size, background_color=BG)
    print(f"wrote {svg} + {svg.with_suffix('.png')}")


if __name__ == "__main__":
    main()
