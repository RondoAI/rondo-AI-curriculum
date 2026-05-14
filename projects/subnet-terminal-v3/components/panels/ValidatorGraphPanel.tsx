"use client";

import { useBittensor } from "@/lib/useBittensor";
import { HubGraph, type HubNode } from "@/components/charts/HubGraph";

/** Panel 050 — validator delegation graph. Inner orbit: the top
    validators, sized by stake. Outer ring: the subnets they
    validate. Edges weight with stake. */
export function ValidatorGraphPanel() {
  const { validators } = useBittensor();
  const top = validators.slice(0, 12);
  const maxStake = Math.max(1, ...top.map((v) => v.stake));
  const nodes: HubNode[] = top.map((v) => ({
    id: v.hotkey,
    label: v.name,
    weight: v.stake / maxStake,
    links: v.subnets.slice(0, 5),
  }));
  const rings = [...new Set(nodes.flatMap((n) => n.links))].sort((a, b) => a - b);
  return (
    <div className="absolute inset-0">
      <HubGraph nodes={nodes} rings={rings} />
      <div className="absolute left-2 bottom-1.5 text-[9px] text-ink-3 smallcaps">
        {top.length} validators · {rings.length} subnets
      </div>
    </div>
  );
}
