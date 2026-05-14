"use client";

import { useGpu } from "@/lib/useGpu";
import { Sparkline } from "@/components/charts/Sparkline";
import { pct } from "@/lib/format";

/** Panel 071 — hyperscaler capex. The five companies bankrolling the
    buildout, latest quarter sized against the field, year-over-year
    move, and an eight-quarter trail. The demand curve behind every
    GPU price on board 070. */
export function CapexPanel() {
  const { capex } = useGpu();
  const max = Math.max(...capex.map((c) => c.latest), 1);
  const totalLatest = capex.reduce((s, c) => s + c.latest, 0);

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="shrink-0 flex items-baseline gap-2 px-3 py-1.5 border-b border-hairline">
        <span className="text-[9px] smallcaps text-ink-3">latest quarter, combined</span>
        <span className="ml-auto tnum text-[13px] text-coral">${totalLatest.toFixed(1)}B</span>
      </div>
      <ul className="flex-1 min-h-0 overflow-auto">
        {capex.map((c) => (
          <li
            key={c.ticker}
            className="flex items-center gap-2 px-3 py-2 border-b border-hairline/60 last:border-0"
          >
            <span className="w-[120px] shrink-0">
              <span className="block text-[11px] text-ink-1">{c.company}</span>
              <span className="block text-[9px] tnum text-ink-3">
                {c.ticker} · {c.quarter}
              </span>
            </span>
            <span className="flex-1 min-w-0 flex items-center gap-2">
              <span className="flex-1 h-2.5 bg-elev-2 overflow-hidden">
                <span
                  className="block h-full bg-coral/70"
                  style={{ width: `${(c.latest / max) * 100}%` }}
                />
              </span>
              <span className="tnum text-[11px] text-ink-1 w-[52px] text-right">
                ${c.latest.toFixed(1)}B
              </span>
            </span>
            <span
              className={`tnum text-[10px] w-[52px] text-right ${
                c.yoy >= 0 ? "text-up" : "text-down"
              }`}
            >
              {pct(c.yoy)}
            </span>
            <Sparkline data={c.trail} width={56} height={18} />
          </li>
        ))}
      </ul>
    </div>
  );
}
