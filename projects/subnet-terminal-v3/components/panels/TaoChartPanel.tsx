"use client";

import { useState } from "react";
import { useBittensor } from "@/lib/useBittensor";
import { Candles } from "@/components/charts/Candles";
import { usd, pct } from "@/lib/format";

const OVERLAYS = ["none", "emission", "validators"] as const;

/** Panel 001 — τ/USD candles with an emissions / validators overlay. */
export function TaoChartPanel() {
  const { network, candles, live } = useBittensor();
  const [overlay, setOverlay] = useState<(typeof OVERLAYS)[number]>("none");
  const up = network.taoChg24 >= 0;

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center gap-3 px-2.5 py-1.5 border-b border-hairline">
        <span className="tnum text-[15px] text-ink-1 leading-none">
          {usd(network.taoPrice)}
        </span>
        <span className={`tnum text-[11px] ${up ? "text-up" : "text-down"}`}>
          {up ? "▲" : "▼"} {pct(network.taoChg24)}
        </span>
        <div className="ml-auto flex">
          {OVERLAYS.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setOverlay(o)}
              className={`px-1.5 h-5 text-[9px] smallcaps border border-hairline-2 -ml-px first:ml-0 transition-colors ${
                overlay === o
                  ? "bg-red text-bg border-red"
                  : "text-ink-3 hover:text-ink-1"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
        <span className="text-[9px] text-ink-3 smallcaps">
          {live.network ? "live" : "seed"} · 180d
        </span>
      </div>
      <div className="relative flex-1 min-h-0">
        <Candles data={candles} overlay={overlay} />
      </div>
    </div>
  );
}
