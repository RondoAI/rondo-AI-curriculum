"use client";

import { useMemo, useState } from "react";
import { useAi } from "@/lib/useAi";
import { DetailHeader } from "@/components/chrome/DetailHeader";
import { ago } from "@/lib/format";
import {
  SOURCE_LABEL,
  SOURCE_ACCENT,
  type WireSource,
} from "@/lib/domain/ai";

const FILTERS: Array<{ id: WireSource | "all"; label: string }> = [
  { id: "all", label: "ALL SOURCES" },
  { id: "huggingface", label: "HUGGINGFACE" },
  { id: "arxiv", label: "ARXIV" },
  { id: "github", label: "GITHUB" },
];

/** Day bucket label — Today / Yesterday / weekday. */
function dayLabel(t: number): string {
  const d = new Date(t);
  const today = new Date();
  const diff = Math.floor(
    (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())) /
      86_400_000
  );
  if (diff <= 0) return "TODAY";
  if (diff === 1) return "YESTERDAY";
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }).toUpperCase();
}

export default function WirePage() {
  const { wire, live } = useAi();
  const [src, setSrc] = useState<WireSource | "all">("all");

  const rows = useMemo(
    () => (src === "all" ? wire : wire.filter((w) => w.source === src)),
    [wire, src]
  );

  /* group consecutive items by day */
  const groups = useMemo(() => {
    const out: Array<{ day: string; items: typeof rows }> = [];
    for (const w of rows) {
      const day = dayLabel(w.at);
      const last = out[out.length - 1];
      if (last && last.day === day) last.items.push(w);
      else out.push({ day, items: [w] });
    }
    return out;
  }, [rows]);

  const counts = useMemo(() => {
    const c = { huggingface: 0, arxiv: 0, github: 0 };
    for (const w of wire) c[w.source]++;
    return c;
  }, [wire]);

  return (
    <>
      <DetailHeader kind="ai" crumb="release wire" />
      <main className="flex-1 min-h-0 overflow-y-auto">
        {/* control strip */}
        <div className="sticky top-0 z-30 flex items-center gap-2 px-4 h-10 bg-bg/95 backdrop-blur border-b border-hairline">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSrc(f.id)}
              className={`px-2 h-6 text-[10px] smallcaps border border-hairline-2 ${
                src === f.id ? "bg-magenta text-bg border-magenta" : "text-ink-3 hover:text-ink-1"
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto tnum text-[10px] text-ink-3">
            HF {counts.huggingface} · arXiv {counts.arxiv} · GH {counts.github} ·{" "}
            <span style={{ color: live.wire ? "var(--color-up)" : "var(--color-ink-3)" }}>
              {live.wire ? "live" : "seed"}
            </span>
          </span>
        </div>

        <div className="max-w-[920px] mx-auto px-4 py-4 flex flex-col gap-5">
          {groups.length === 0 && (
            <p className="text-[12px] text-ink-3 py-8 text-center">
              Nothing on this feed right now.
            </p>
          )}
          {groups.map((g) => (
            <section key={g.day} className="flex flex-col gap-1.5">
              <h2 className="text-[10px] smallcaps text-ink-3 tnum">{g.day}</h2>
              <ul className="border border-hairline bg-elev-1">
                {g.items.map((w) => (
                  <li
                    key={w.id}
                    className="border-b border-hairline/60 last:border-0 hover:bg-elev-2 transition-colors"
                  >
                    <a
                      href={w.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <span
                        className="shrink-0 w-12 text-center text-[9px] smallcaps tnum py-0.5 border"
                        style={{
                          color: SOURCE_ACCENT[w.source],
                          borderColor: SOURCE_ACCENT[w.source] + "55",
                        }}
                      >
                        {SOURCE_LABEL[w.source]}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] text-ink-1 truncate">{w.title}</span>
                        <span className="block text-[10px] text-ink-3">
                          {w.author}
                          {w.tags.length > 0 && (
                            <span className="text-ink-3"> · {w.tags.join(" · ")}</span>
                          )}
                        </span>
                      </span>
                      <span className="shrink-0 tnum text-[11px] text-ink-2">{w.metric}</span>
                      <span className="shrink-0 tnum text-[10px] text-ink-3 w-10 text-right">
                        {ago(w.at)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
