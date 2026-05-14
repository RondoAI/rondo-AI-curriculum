"use client";

import { useBittensor } from "@/lib/useBittensor";
import { Treemap, type TreeCell } from "@/components/charts/Treemap";

/** finviz-style heat ramp for a 24h % move — mint up, red down,
    diverging through a near-black neutral. */
function heat(chg: number): string {
  if (chg >= 8) return "#00E5A8";
  if (chg >= 3) return "#1f8f6e";
  if (chg > 0) return "#15463c";
  if (chg === 0) return "#2A1418";
  if (chg > -3) return "#7a2533";
  if (chg > -8) return "#c2243a";
  return "#FF4D6D";
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
