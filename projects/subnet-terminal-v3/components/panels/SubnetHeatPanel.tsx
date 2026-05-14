"use client";

import { useBittensor } from "@/lib/useBittensor";
import { Treemap, type TreeCell } from "@/components/charts/Treemap";

/** finviz-style heat ramp for a 24h % move */
function heat(chg: number): string {
  if (chg >= 8) return "#10B981";
  if (chg >= 3) return "#15916a";
  if (chg > 0) return "#1f5e49";
  if (chg === 0) return "#3a2f33";
  if (chg > -3) return "#7a2533";
  if (chg > -8) return "#c2243a";
  return "#EF4444";
}

/** Panel 040 — every subnet a tile, area = emissions, colour = 24h
    alpha move. Click a tile → that subnet's detail page. */
export function SubnetHeatPanel() {
  const { subnets } = useBittensor();
  const cells: TreeCell[] = subnets.map((s) => ({
    key: String(s.netuid),
    label: `SN${s.netuid}`,
    sub: s.name,
    value: s.emission,
    color: heat(s.chg24),
  }));
  return (
    <Treemap
      cells={cells}
      onPick={(k) => {
        window.location.href = `/s/${k}`;
      }}
    />
  );
}
