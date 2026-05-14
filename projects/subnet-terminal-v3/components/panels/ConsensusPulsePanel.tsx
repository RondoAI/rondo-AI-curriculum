"use client";

import { useBittensor } from "@/lib/useBittensor";
import { RadialBars, type RadialDatum } from "@/components/charts/RadialBars";
import { CATEGORY_ACCENT } from "@/lib/domain/bittensor";

/** Panel 051 — consensus pulse. Each wedge is a subnet; its radius
    is the weight-distribution skew (Gini): a long bar means a few
    validators dominate that subnet's scoring. */
export function ConsensusPulsePanel() {
  const { subnets } = useBittensor();
  const data: RadialDatum[] = [...subnets]
    .sort((a, b) => b.emission - a.emission)
    .slice(0, 18)
    .map((s) => ({
      label: `SN${s.netuid}`,
      value: s.gini,
      color: CATEGORY_ACCENT[s.category],
    }));
  return (
    <div className="absolute inset-0">
      <RadialBars data={data} />
      <div className="absolute left-2 bottom-1.5 text-[9px] text-ink-3 smallcaps">
        bar = weight-distribution gini · longer = more skewed
      </div>
    </div>
  );
}
