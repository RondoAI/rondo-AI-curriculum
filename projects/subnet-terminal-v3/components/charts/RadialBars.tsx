"use client";

import { useSize } from "@/lib/useSize";

export interface RadialDatum {
  label: string;
  /** 0..1 — bar length */
  value: number;
  color: string;
}

/** Polar bar chart — each datum is a wedge whose radius encodes
    `value`. Used for the consensus-skew pulse: subnets around the
    ring, bar length = weight-distribution Gini. */
export function RadialBars({ data }: { data: RadialDatum[] }) {
  const { ref, w, h } = useSize<HTMLDivElement>();
  const size = Math.min(w, h);
  const cx = w / 2;
  const cy = h / 2;
  const rInner = size * 0.16;
  const rOuter = size * 0.46;
  const n = data.length || 1;

  return (
    <div ref={ref} className="absolute inset-0">
      <svg
        width={w}
        height={h}
        className="block"
        role="img"
        aria-label={`Polar bar chart of ${data.length} items: ${data
          .map((d) => `${d.label} ${(d.value * 100).toFixed(0)} percent`)
          .join(", ")}.`}
      >
        {/* reference rings */}
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <circle
            key={t}
            cx={cx}
            cy={cy}
            r={rInner + (rOuter - rInner) * t}
            fill="none"
            stroke="rgba(255,30,60,.07)"
          />
        ))}
        {size > 40 &&
          data.map((d, i) => {
            const a0 = (i / n) * Math.PI * 2 - Math.PI / 2;
            const a1 = ((i + 0.84) / n) * Math.PI * 2 - Math.PI / 2;
            const r = rInner + (rOuter - rInner) * Math.max(0.04, Math.min(1, d.value));
            const am = (a0 + a1) / 2;
            const arc = (rad: number, a: number) =>
              `${(cx + rad * Math.cos(a)).toFixed(1)} ${(cy + rad * Math.sin(a)).toFixed(1)}`;
            const path = [
              `M ${arc(rInner, a0)}`,
              `L ${arc(r, a0)}`,
              `A ${r} ${r} 0 0 1 ${arc(r, a1)}`,
              `L ${arc(rInner, a1)}`,
              `A ${rInner} ${rInner} 0 0 0 ${arc(rInner, a0)}`,
              "Z",
            ].join(" ");
            const lr = rOuter + 9;
            const lx = cx + lr * Math.cos(am);
            const ly = cy + lr * Math.sin(am);
            const anchor = Math.cos(am) > 0.2 ? "start" : Math.cos(am) < -0.2 ? "end" : "middle";
            return (
              <g key={d.label}>
                <path d={path} fill={d.color} fillOpacity={0.85} />
                {size > 150 && (
                  <text
                    x={lx}
                    y={ly}
                    fill="#C8A8AD"
                    fontSize={8}
                    textAnchor={anchor}
                    dominantBaseline="middle"
                    style={{ fontFamily: "var(--font-jbmono), monospace" }}
                  >
                    {d.label}
                  </text>
                )}
              </g>
            );
          })}
      </svg>
    </div>
  );
}
