"use client";

import { useMemo } from "react";
import { useSize } from "@/lib/useSize";

export interface TreeCell {
  key: string;
  label: string;
  sub?: string;
  /** area weight */
  value: number;
  /** fill colour */
  color: string;
  href?: string;
}

/* ---- squarified treemap (Bruls / Huijgen / van Wijk) ---- */
type Box = TreeCell & { x: number; y: number; w: number; h: number };

function worst(row: number[], side: number) {
  let max = -Infinity, min = Infinity, sum = 0;
  for (const r of row) {
    if (r > max) max = r;
    if (r < min) min = r;
    sum += r;
  }
  const s2 = sum * sum, side2 = side * side;
  return Math.max((side2 * max) / s2, s2 / (side2 * min));
}

function squarify(items: TreeCell[], W: number, H: number): Box[] {
  const total = items.reduce((a, v) => a + v.value, 0) || 1;
  const scale = (W * H) / total;
  const q = items.map((v) => ({ ...v, scaled: v.value * scale }));
  const out: Box[] = [];
  let area = { x: 0, y: 0, w: W, h: H };
  let row: typeof q = [];
  const flush = () => {
    const sum = row.reduce((a, v) => a + v.scaled, 0);
    const wide = area.w >= area.h;
    if (wide) {
      const rw = sum / area.h;
      let cy = area.y;
      for (const v of row) {
        const rh = v.scaled / rw;
        out.push({ ...v, x: area.x, y: cy, w: rw, h: rh });
        cy += rh;
      }
      area = { x: area.x + rw, y: area.y, w: area.w - rw, h: area.h };
    } else {
      const rh = sum / area.w;
      let cx = area.x;
      for (const v of row) {
        const rw = v.scaled / rh;
        out.push({ ...v, x: cx, y: area.y, w: rw, h: rh });
        cx += rw;
      }
      area = { x: area.x, y: area.y + rh, w: area.w, h: area.h - rh };
    }
    row = [];
  };
  while (q.length) {
    const v = q[0];
    const side = Math.min(area.w, area.h);
    const cur = row.map((r) => r.scaled);
    if (row.length === 0 || worst(cur.concat(v.scaled), side) <= worst(cur, side)) {
      row.push(v);
      q.shift();
    } else {
      flush();
    }
  }
  if (row.length) flush();
  return out;
}

/** SVG treemap — tiles sized by value, coloured by the caller.
    Big tiles get a label; small ones stay clean. */
export function Treemap({
  cells,
  onPick,
}: {
  cells: TreeCell[];
  onPick?: (key: string) => void;
}) {
  const { ref, w, h } = useSize<HTMLDivElement>();
  const boxes = useMemo(
    () => (w > 8 && h > 8 ? squarify([...cells].sort((a, b) => b.value - a.value), w, h) : []),
    [cells, w, h]
  );

  return (
    <div ref={ref} className="absolute inset-0">
      <svg width={w} height={h} className="block">
        {boxes.map((b) => {
          const big = b.w > 64 && b.h > 30;
          return (
            <g
              key={b.key}
              onClick={() => onPick?.(b.key)}
              className={onPick ? "cursor-pointer" : ""}
            >
              <rect
                x={b.x + 0.5}
                y={b.y + 0.5}
                width={Math.max(0, b.w - 1)}
                height={Math.max(0, b.h - 1)}
                fill={b.color}
                fillOpacity={0.9}
                stroke="#000"
                strokeWidth={1}
              />
              {big && (
                <>
                  <text
                    x={b.x + 6}
                    y={b.y + 15}
                    fill="#000"
                    fontSize={11}
                    fontWeight={600}
                    style={{ fontFamily: "var(--font-jbmono), monospace" }}
                  >
                    {b.label}
                  </text>
                  {b.sub && b.h > 46 && (
                    <text
                      x={b.x + 6}
                      y={b.y + 28}
                      fill="rgba(0,0,0,.62)"
                      fontSize={9}
                      style={{ fontFamily: "var(--font-jbmono), monospace" }}
                    >
                      {b.sub}
                    </text>
                  )}
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
