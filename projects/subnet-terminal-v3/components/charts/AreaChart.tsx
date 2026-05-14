"use client";

import { useSize } from "@/lib/useSize";

/** A clean SVG area chart with a right-edge value scale and a
    time-ish x baseline. Used as the primary chart on detail pages. */
export function AreaChart({
  data,
  color = "#FFB000",
  fmt = (n: number) => n.toFixed(2),
}: {
  data: number[];
  color?: string;
  fmt?: (n: number) => string;
}) {
  const { ref, w, h } = useSize<HTMLDivElement>();
  const padL = 4, padR = 52, padT = 10, padB = 16;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  let lo = Infinity, hi = -Infinity;
  for (const v of data) {
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  const span = hi - lo || 1;
  lo -= span * 0.12;
  hi += span * 0.12;
  const x = (i: number) => padL + (i / Math.max(1, data.length - 1)) * plotW;
  const y = (v: number) => padT + plotH - ((v - lo) / (hi - lo)) * plotH;

  const ready = w > 8 && h > 8 && data.length > 1;
  const linePts = ready ? data.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`) : [];

  const last = data.length ? data[data.length - 1] : 0;
  const first = data.length ? data[0] : 0;

  return (
    <div ref={ref} className="absolute inset-0">
      {ready && (
        <svg
          width={w}
          height={h}
          className="block"
          role="img"
          aria-label={`Area chart, ${data.length} points, from ${fmt(first)} to ${fmt(
            last
          )}, range ${fmt(lo)} to ${fmt(hi)}.`}
        >
          {[0, 1, 2, 3, 4].map((i) => {
            const v = lo + (i / 4) * (hi - lo);
            const yy = y(v);
            return (
              <g key={i}>
                <line
                  x1={padL}
                  x2={padL + plotW}
                  y1={yy}
                  y2={yy}
                  stroke="rgba(255,176,0,.06)"
                />
                <text
                  x={padL + plotW + 6}
                  y={yy}
                  fill="#57534E"
                  fontSize={10}
                  dominantBaseline="middle"
                  style={{ fontFamily: "var(--font-jbmono), monospace" }}
                >
                  {fmt(v)}
                </text>
              </g>
            );
          })}
          <polygon
            points={`${padL},${padT + plotH} ${linePts.join(" ")} ${
              padL + plotW
            },${padT + plotH}`}
            fill={color}
            fillOpacity={0.12}
          />
          <polyline
            points={linePts.join(" ")}
            fill="none"
            stroke={color}
            strokeWidth={1.75}
            strokeLinejoin="round"
          />
          <circle
            cx={x(data.length - 1)}
            cy={y(data[data.length - 1])}
            r={2.5}
            fill={color}
          />
        </svg>
      )}
    </div>
  );
}
