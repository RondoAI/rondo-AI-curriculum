"use client";

import { TICKER_SEED, type TickerItem } from "@/data/seed/ticker";
import { useBittensor } from "@/lib/useBittensor";
import { usd, mwh, pct, alpha, usdCompact } from "@/lib/format";

const ACCENT: Record<TickerItem["vertical"], string> = {
  bittensor: "text-red",
  ai: "text-rose",
  gpu: "text-coral",
  power: "text-ember",
  macro: "text-ink-2",
};

function priceText(it: TickerItem) {
  if (it.unit === "usd") return usd(it.price);
  if (it.unit === "mwh") return mwh(it.price);
  if (it.unit === "tao") return "τ" + it.price.toFixed(2);
  return alpha(it.price);
}

function Cell({ it }: { it: TickerItem }) {
  const up = it.chg >= 0;
  return (
    <span className="inline-flex items-baseline gap-1.5 px-3 border-r border-hairline whitespace-nowrap">
      <span className={`${ACCENT[it.vertical]} smallcaps text-[11px]`}>{it.sym}</span>
      <span className="tnum text-ink-1 text-[11px]">{priceText(it)}</span>
      <span className={`tnum text-[10px] ${up ? "text-up" : "text-down"}`}>
        {up ? "▲" : "▼"} {pct(it.chg)}
      </span>
    </span>
  );
}

/** One full pass of the tape: live TAO price + market cap lead,
    then the seed instruments. */
function Track({
  items,
  mcap,
  live,
}: {
  items: TickerItem[];
  mcap: number;
  live: boolean;
}) {
  return (
    <>
      {items.map((it, i) =>
        it.sym === "TAO" ? (
          <span key={i} className="inline-flex">
            <Cell it={it} />
            <span className="inline-flex items-baseline gap-1.5 px-3 border-r border-hairline whitespace-nowrap">
              <span className="text-red smallcaps text-[11px]">TAO·MCAP</span>
              <span className="tnum text-ink-1 text-[11px]">{usdCompact(mcap)}</span>
              <span className="tnum text-[10px] text-ink-3">
                {live ? "live" : "seed"}
              </span>
            </span>
          </span>
        ) : (
          <Cell key={i} it={it} />
        )
      )}
    </>
  );
}

/** Top-chrome scrolling tape. The TAO rows are live from
    /api/bittensor (price, 24h move, market cap); the rest stay on
    seed until their verticals' feeds land. CSS marquee, duplicated
    track for a seamless loop. */
export function TickerTape() {
  const { network, live } = useBittensor();
  const items: TickerItem[] = [
    {
      sym: "TAO",
      price: network.taoPrice,
      chg: network.taoChg24,
      unit: "usd",
      vertical: "bittensor",
    },
    ...TICKER_SEED.filter((t) => t.sym !== "TAO"),
  ];

  return (
    <div className="relative overflow-hidden h-full flex items-center">
      <div className="tape-track inline-flex items-center" style={{ width: "max-content" }}>
        <Track items={items} mcap={network.marketCap} live={live.network} />
        <Track items={items} mcap={network.marketCap} live={live.network} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-elev-1 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-elev-1 to-transparent" />
    </div>
  );
}
