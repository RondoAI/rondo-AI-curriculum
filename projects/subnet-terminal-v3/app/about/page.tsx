import Link from "next/link";
import type { Metadata } from "next";
import { DetailHeader } from "@/components/chrome/DetailHeader";
import { VERTICAL_ACCENT, VERTICAL_LABEL } from "@/lib/panels";

export const metadata: Metadata = {
  title: "About — Subneτ Terminal",
  description:
    "What Subneτ Terminal is, how it sources its data, and the thesis behind reading four verticals on one screen.",
};

const VERTICALS: Array<{
  key: keyof typeof VERTICAL_ACCENT;
  line: string;
  source: string;
}> = [
  {
    key: "bittensor",
    line: "Subnet markets, validator delegation, consensus skew, τ/USD with emission overlays.",
    source: "Live — TaoStats API, server-side, seed fallback.",
  },
  {
    key: "ai",
    line: "The open-model leaderboard and a release wire merging HuggingFace, arXiv and GitHub.",
    source: "Live — three public APIs, merged server-side, seed fallback.",
  },
  {
    key: "gpu",
    line: "Spot vs on-demand GPU pricing across the independent clouds, and hyperscaler capex.",
    source: "Researched seed — cloud pricing has no clean public API yet.",
  },
  {
    key: "power",
    line: "Hub LMPs and load headroom across the six US ISOs, and the datacenter buildout pipeline.",
    source: "Researched seed — ISO feeds need keyed access; wired later.",
  },
];

export default function AboutPage() {
  return (
    <>
      <DetailHeader kind="terminal" crumb="about" />
      <main className="flex-1 min-h-0 overflow-y-auto">
        <article className="max-w-[680px] mx-auto px-5 py-8 flex flex-col gap-4">
          <h1 className="font-serif text-[34px] leading-[1.15] text-ink-1">
            A research terminal for decentralized intelligence
          </h1>
          <p className="font-serif text-[17px] leading-snug text-ink-3 italic">
            Four markets that used to be read on four screens, on one — because
            they are, increasingly, one market.
          </p>

          <div className="flex flex-col gap-3 pt-2 border-t border-hairline">
            <p className="text-[14px] leading-relaxed text-ink-2">
              Subneτ Terminal is a Bloomberg-grade workstation for the
              infrastructure layer of AI. The thesis is simple: a Bittensor
              compute subnet&apos;s viability is a GPU-price question and a
              power-price question wearing a token ticker. You cannot value the
              amber line without reading the cyan one and the lime one next to
              it — so the terminal puts them on the same screen.
            </p>
            <p className="text-[14px] leading-relaxed text-ink-2">
              The workstation is a resizable, persisted panel grid — drag,
              resize, and switch layout presets; the arrangement is saved to
              your browser. Press{" "}
              <kbd className="text-[11px] border border-hairline-2 px-1 text-ink-3">
                ⌘K
              </kbd>{" "}
              for the command palette to jump to any panel or preset.
            </p>
          </div>

          <h2 className="font-serif text-[19px] text-ink-1 mt-3">The four verticals</h2>
          <ul className="flex flex-col gap-3">
            {VERTICALS.map((v) => (
              <li
                key={v.key}
                className="border-l-2 pl-4 flex flex-col gap-1"
                style={{ borderColor: VERTICAL_ACCENT[v.key] }}
              >
                <span
                  className="text-[10px] smallcaps"
                  style={{ color: VERTICAL_ACCENT[v.key] }}
                >
                  {VERTICAL_LABEL[v.key]}
                </span>
                <span className="text-[14px] leading-relaxed text-ink-2">{v.line}</span>
                <span className="text-[11px] text-ink-3">{v.source}</span>
              </li>
            ))}
          </ul>

          <h2 className="font-serif text-[19px] text-ink-1 mt-3">On the data</h2>
          <p className="text-[14px] leading-relaxed text-ink-2">
            Every source is normalized into a typed domain shape, fetched
            server-side, cached, and retried — and every one falls back to a
            researched seed so a panel is never empty and an API key never
            reaches the browser. Each panel and detail page marks whether it is
            showing a live feed or the seed. Where a vertical runs on seed
            today, it is because the data is not yet publicly addressable — the
            client contract is identical, so a live feed drops in without a
            rewrite.
          </p>

          <h2 className="font-serif text-[19px] text-ink-1 mt-3">On the build</h2>
          <p className="text-[14px] leading-relaxed text-ink-2">
            Next.js App Router, React, TypeScript, Tailwind. No charting
            library — the candlesticks, treemap, polar bars, delegation graph,
            ISO map and area charts are all hand-built SVG and canvas, sized to
            their panels by a resize observer. The design language is a
            phosphor terminal: true-black ground, hairline borders, tabular
            numerals, one accent per vertical, and no drop shadows anywhere.
          </p>

          <div className="mt-5 pt-4 border-t border-hairline flex items-center gap-3">
            <Link
              href="/"
              className="text-[12px] smallcaps text-red hover:text-ink-1"
            >
              ‹ open the terminal
            </Link>
            <Link
              href="/wire"
              className="text-[12px] smallcaps text-ink-3 hover:text-ink-1"
            >
              the release wire
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
