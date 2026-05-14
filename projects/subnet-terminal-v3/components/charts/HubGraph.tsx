"use client";

import { useMemo } from "react";
import { useSize } from "@/lib/useSize";

export interface HubNode {
  id: string;
  label: string;
  /** 0..1 — node size weight */
  weight: number;
  /** ids of the subnet rings this node connects to */
  links: number[];
}

/** A radial delegation graph: validators on an inner orbit sized by
    stake, the subnets they validate as an outer ring, edges drawn
    validator → subnet. A deterministic layout (stable in
    screenshots) standing in for a full force sim. */
export function HubGraph({
  nodes,
  rings,
  accent = "#FF1E3C",
}: {
  nodes: HubNode[];
  /** the subnet ids that form the outer ring */
  rings: number[];
  accent?: string;
}) {
  const { ref, w, h } = useSize<HTMLDivElement>();

  const layout = useMemo(() => {
    const cx = w / 2;
    const cy = h / 2;
    const size = Math.min(w, h);
    const rNode = size * 0.27;
    const rRing = size * 0.46;
    const ringPos = new Map<number, { x: number; y: number }>();
    rings.forEach((id, i) => {
      const a = (i / Math.max(1, rings.length)) * Math.PI * 2 - Math.PI / 2;
      ringPos.set(id, { x: cx + rRing * Math.cos(a), y: cy + rRing * Math.sin(a) });
    });
    const nodePos = nodes.map((nd, i) => {
      const a = (i / Math.max(1, nodes.length)) * Math.PI * 2 - Math.PI / 2;
      return { ...nd, x: cx + rNode * Math.cos(a), y: cy + rNode * Math.sin(a) };
    });
    return { cx, cy, size, ringPos, nodePos };
  }, [w, h, nodes, rings]);

  if (w < 8 || h < 8) return <div ref={ref} className="absolute inset-0" />;
  const { ringPos, nodePos } = layout;

  return (
    <div ref={ref} className="absolute inset-0">
      <svg
        width={w}
        height={h}
        className="block"
        role="img"
        aria-label={`Delegation graph: ${nodes.length} validators on an inner orbit linked to ${rings.length} subnets on the outer ring.`}
      >
        {/* edges */}
        {nodePos.map((nd) =>
          nd.links.map((sid) => {
            const r = ringPos.get(sid);
            if (!r) return null;
            return (
              <line
                key={`${nd.id}-${sid}`}
                x1={nd.x}
                y1={nd.y}
                x2={r.x}
                y2={r.y}
                stroke={accent}
                strokeOpacity={0.12 + nd.weight * 0.22}
                strokeWidth={0.5 + nd.weight * 1.6}
              />
            );
          })
        )}
        {/* subnet ring nodes */}
        {rings.map((id) => {
          const p = ringPos.get(id)!;
          return (
            <g key={`r${id}`}>
              <circle cx={p.x} cy={p.y} r={3} fill="#4A2A30" stroke={accent} strokeOpacity={0.5} />
              <text
                x={p.x}
                y={p.y - 7}
                fill="#8B6B70"
                fontSize={8}
                textAnchor="middle"
                style={{ fontFamily: "var(--font-jbmono), monospace" }}
              >
                SN{id}
              </text>
            </g>
          );
        })}
        {/* validator nodes */}
        {nodePos.map((nd) => {
          const r = 4 + nd.weight * 12;
          return (
            <g key={nd.id}>
              <circle cx={nd.x} cy={nd.y} r={r} fill={accent} fillOpacity={0.9} />
              <circle cx={nd.x} cy={nd.y} r={r} fill="none" stroke="#000" strokeWidth={1} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
