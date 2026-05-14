import { TICKER_SEED, type TickerItem } from "@/data/seed/ticker";
import { usd, mwh, pct, alpha } from "@/lib/format";

const ACCENT: Record<TickerItem["vertical"], string> = {
  bittensor: "text-amber",
  ai: "text-magenta",
  gpu: "text-cyan",
  power: "text-lime",
  macro: "text-ink-2",
};

function priceText(it: TickerItem) {
  if (it.unit === "usd") return usd(it.price);
  if (it.unit === "mwh") return mwh(it.price);
  if (it.unit === "tao") return "τ" + it.price.toFixed(2);
  return alpha(it.price); // raw — alpha tokens, 6dp
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

/** Top-chrome scrolling tape. CSS marquee — the track is duplicated
    so the loop is seamless. Seed data in Phase 1; live in Phase 2+. */
export function TickerTape() {
  const items = TICKER_SEED;
  return (
    <div className="relative overflow-hidden h-full flex items-center">
      <div className="tape-track inline-flex items-center" style={{ width: "max-content" }}>
        {items.map((it, i) => (
          <Cell key={`a${i}`} it={it} />
        ))}
        {items.map((it, i) => (
          <Cell key={`b${i}`} it={it} />
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-elev-1 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-elev-1 to-transparent" />
    </div>
  );
}
