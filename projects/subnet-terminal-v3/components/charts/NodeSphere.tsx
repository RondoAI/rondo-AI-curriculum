"use client";

import { useEffect, useRef } from "react";

/* =================================================================
   SUBNEτ TERMINAL — NODE SPHERE
   The brand mark, shared with Subnet Magazine: a slowly rotating
   wireframe sphere of red nodes wired into a dense network, with
   data packets flowing along random edges so it reads as a working
   network, not a static graphic. Canvas + rAF; honours
   prefers-reduced-motion by rendering a single still frame.
   ================================================================= */

type Pt = { x: number; y: number; z: number };
type Edge = { a: number; b: number; d2: number };
type Packet = { e: number; t: number; speed: number };

function buildPoints(n: number): Pt[] {
  const pts: Pt[] = [];
  const phi = Math.PI * (Math.sqrt(5) - 1);
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
  }
  return pts;
}

function buildEdges(points: Pt[], k: number, cap: number): Edge[] {
  const seen = new Set<string>();
  const out: Edge[] = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const d: Array<{ j: number; d2: number }> = [];
    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;
      const b = points[j];
      const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
      d.push({ j, d2: dx * dx + dy * dy + dz * dz });
    }
    d.sort((u, v) => u.d2 - v.d2);
    for (let n = 0; n < k; n++) {
      const j = d[n].j;
      const key = i < j ? `${i}:${j}` : `${j}:${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ a: i, b: j, d2: d[n].d2 });
    }
  }
  out.sort((u, v) => u.d2 - v.d2);
  return out.slice(0, cap);
}

/** Rotating red node-sphere brand mark. Sizes to a square `size`. */
export function NodeSphere({
  size = 40,
  nodes = 90,
  k = 5,
  edgeCap = 200,
  packets = 8,
  speed = 0.32,
}: {
  size?: number;
  nodes?: number;
  k?: number;
  edgeCap?: number;
  packets?: number;
  speed?: number;
}) {
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cv.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const points = buildPoints(nodes);
    const edges = buildEdges(points, k, edgeCap);
    const pkts: Packet[] = Array.from({ length: packets }, () => ({
      e: Math.floor(Math.random() * edges.length),
      t: Math.random(),
      speed: 0.18 + Math.random() * 0.35,
    }));

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const w = size, h = size;
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.42;

    function frame(tMs: number) {
      const ctx2 = ctx!;
      const t = tMs / 1000;
      ctx2.clearRect(0, 0, w, h);

      const ax = t * speed * 0.55;
      const ay = t * speed;
      const cosX = Math.cos(ax), sinX = Math.sin(ax);
      const cosY = Math.cos(ay), sinY = Math.sin(ay);

      /* atmospheric halo */
      const grad = ctx2.createRadialGradient(cx, cy, R * 0.4, cx, cy, R * 1.35);
      grad.addColorStop(0, "rgba(255,30,60,.12)");
      grad.addColorStop(1, "rgba(255,30,60,0)");
      ctx2.fillStyle = grad;
      ctx2.beginPath();
      ctx2.arc(cx, cy, R * 1.35, 0, Math.PI * 2);
      ctx2.fill();

      /* project */
      const p = points.map((pt) => {
        const x1 = pt.x * cosY + pt.z * sinY;
        const z1 = -pt.x * sinY + pt.z * cosY;
        const y2 = pt.y * cosX - z1 * sinX;
        const z2 = pt.y * sinX + z1 * cosX;
        return { sx: cx + x1 * R, sy: cy + y2 * R, d: (z2 + 1) / 2 };
      });

      /* edges, back to front */
      const eSorted = edges
        .map((e) => ({ e, mid: (p[e.a].d + p[e.b].d) / 2 }))
        .sort((u, v) => u.mid - v.mid);
      for (const { e, mid } of eSorted) {
        const a = p[e.a], b = p[e.b];
        ctx2.strokeStyle = `rgba(255,30,60,${0.06 + mid * 0.5})`;
        ctx2.lineWidth = 0.3 + mid * 0.6;
        ctx2.beginPath();
        ctx2.moveTo(a.sx, a.sy);
        ctx2.lineTo(b.sx, b.sy);
        ctx2.stroke();
      }

      /* packets */
      for (const pk of pkts) {
        if (!reduce) {
          pk.t += pk.speed * 0.016;
          if (pk.t >= 1) {
            pk.t = 0;
            pk.e = Math.floor(Math.random() * edges.length);
          }
        }
        const e = edges[pk.e];
        const a = p[e.a], b = p[e.b];
        ctx2.fillStyle = "rgba(255,128,148,.9)";
        ctx2.beginPath();
        ctx2.arc(
          a.sx + (b.sx - a.sx) * pk.t,
          a.sy + (b.sy - a.sy) * pk.t,
          1,
          0,
          Math.PI * 2
        );
        ctx2.fill();
      }

      /* nodes, back to front */
      const pSorted = [...p].sort((u, v) => u.d - v.d);
      for (const q of pSorted) {
        const r = 0.5 + q.d * 1.3;
        ctx2.fillStyle = `rgba(255,${30 + q.d * 100},${60 + q.d * 90},${0.3 + q.d * 0.7})`;
        ctx2.beginPath();
        ctx2.arc(q.sx, q.sy, r, 0, Math.PI * 2);
        ctx2.fill();
      }

      if (!reduce) raf = requestAnimationFrame(frame);
    }

    let raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [size, nodes, k, edgeCap, packets, speed]);

  return (
    <canvas
      ref={cv}
      style={{ width: size, height: size, display: "block" }}
      role="img"
      aria-label="Subneτ network mark"
    />
  );
}
