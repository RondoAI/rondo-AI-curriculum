"use client";

import { useSize } from "@/lib/useSize";
import { lmpColor, type IsoSummary } from "@/lib/domain/power";

/** A stylized US grid map — the six ISOs placed by rough geography,
    each node sized by system load and coloured by average LMP.
    Cheap power is lime, scarce power is hot. Click → ISO detail. */
export function IsoMap({
  isos,
  onPick,
}: {
  isos: IsoSummary[];
  onPick?: (iso: IsoSummary) => void;
}) {
  const { ref, w, h } = useSize<HTMLDivElement>();
  const maxLoad = Math.max(...isos.map((i) => i.load), 1);
  const pad = 28;
  const iw = Math.max(0, w - pad * 2);
  const ih = Math.max(0, h - pad * 2);

  return (
    <div ref={ref} className="absolute inset-0">
      {w > 0 && h > 0 && (
        <svg width={w} height={h} className="block">
          {/* faint connective grid between adjacent ISOs */}
          {isos.map((a, i) =>
            isos.slice(i + 1).map((b) => {
              const dx = a.x - b.x;
              const dy = a.y - b.y;
              if (Math.hypot(dx, dy) > 0.45) return null;
              return (
                <line
                  key={`${a.iso}-${b.iso}`}
                  x1={pad + a.x * iw}
                  y1={pad + a.y * ih}
                  x2={pad + b.x * iw}
                  y2={pad + b.y * ih}
                  stroke="var(--color-hairline)"
                  strokeWidth={1}
                />
              );
            })
          )}
          {isos.map((iso) => {
            const cx = pad + iso.x * iw;
            const cy = pad + iso.y * ih;
            const r = 10 + (iso.load / maxLoad) * 22;
            const col = lmpColor(iso.avgLmp);
            return (
              <g
                key={iso.iso}
                transform={`translate(${cx},${cy})`}
                className="cursor-pointer"
                onClick={() => onPick?.(iso)}
              >
                <circle r={r} fill={col} fillOpacity={0.16} stroke={col} strokeWidth={1.5} />
                <circle r={3} fill={col} />
                <text
                  y={-r - 5}
                  textAnchor="middle"
                  className="tnum"
                  fontSize={10}
                  fill="var(--color-ink-1)"
                >
                  {iso.iso}
                </text>
                <text
                  y={r + 12}
                  textAnchor="middle"
                  className="tnum"
                  fontSize={10}
                  fill={col}
                >
                  ${iso.avgLmp.toFixed(0)}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
