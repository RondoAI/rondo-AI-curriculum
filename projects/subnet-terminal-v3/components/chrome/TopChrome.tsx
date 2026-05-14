"use client";

import { TaoMark } from "@/components/TaoMark";
import { TickerTape } from "@/components/chrome/TickerTape";
import { Clock } from "@/components/chrome/Clock";

const PRESETS = ["macro", "subnets", "gpu", "power", "news"] as const;
export type Preset = (typeof PRESETS)[number];

/** The sticky 56px top chrome: wordmark + command bar on the left,
    the scrolling tape in the centre, clock / status / layout
    switcher on the right. */
export function TopChrome({
  preset,
  onPreset,
}: {
  preset: Preset;
  onPreset: (p: Preset) => void;
}) {
  return (
    <header className="sticky top-0 z-40 h-14 shrink-0 grid grid-cols-[minmax(300px,1fr)_minmax(0,2.4fr)_minmax(280px,1fr)] items-stretch bg-elev-1 border-b border-hairline">
      {/* left — wordmark + command bar */}
      <div className="flex items-center gap-3 px-4 border-r border-hairline">
        <span className="flex items-baseline gap-[1px] font-serif text-[19px] leading-none text-ink-1">
          Subne
          <span className="text-amber translate-y-[2px]">
            <TaoMark size={17} weight={2.4} />
          </span>
          <span className="ml-[2px]">Terminal</span>
        </span>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("sbnt:command"))}
          className="ml-auto flex items-center gap-2 px-2.5 h-7 border border-hairline-2 text-ink-3 hover:text-ink-1 hover:bg-elev-2 transition-colors"
        >
          <span className="text-[11px] smallcaps">search</span>
          <kbd className="text-[10px] border border-hairline-2 px-1 leading-[14px] text-ink-3">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* centre — scrolling tape */}
      <div className="min-w-0 bg-elev-1">
        <TickerTape />
      </div>

      {/* right — clock, status, layout switcher */}
      <div className="flex items-center justify-end gap-4 px-4 border-l border-hairline">
        <Clock />
        <span className="flex items-center gap-1.5 text-[10px] text-ink-3 smallcaps">
          <span className="w-1.5 h-1.5 rounded-full bg-up animate-pulse" />
          live
        </span>
        <div className="flex">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPreset(p)}
              className={`px-2 h-6 text-[10px] smallcaps border border-hairline-2 -ml-px first:ml-0 transition-colors ${
                preset === p
                  ? "bg-amber text-bg border-amber"
                  : "text-ink-3 hover:text-ink-1 hover:bg-elev-2"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
