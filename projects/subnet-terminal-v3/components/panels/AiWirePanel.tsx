"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAi } from "@/lib/useAi";
import { ago } from "@/lib/format";
import {
  SOURCE_LABEL,
  SOURCE_ACCENT,
  type WireSource,
} from "@/lib/domain/ai";

const FILTERS: Array<{ id: WireSource | "all"; label: string }> = [
  { id: "all", label: "ALL" },
  { id: "huggingface", label: "HF" },
  { id: "arxiv", label: "arXiv" },
  { id: "github", label: "GH" },
];

/** Panel 060 — the AI release wire. HuggingFace model drops, arXiv
    papers and GitHub repo activity merged into one chronological
    stream, filterable by source. Click through to the original. */
export function AiWirePanel() {
  const { wire } = useAi();
  const [src, setSrc] = useState<WireSource | "all">("all");

  const rows = useMemo(
    () => (src === "all" ? wire : wire.filter((w) => w.source === src)),
    [wire, src]
  );

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="shrink-0 flex items-center gap-1 px-2 py-1 border-b border-hairline">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setSrc(f.id)}
            className={`px-1.5 h-5 text-[9px] smallcaps border border-hairline-2 ${
              src === f.id ? "bg-rose text-bg border-rose" : "text-ink-3 hover:text-ink-1"
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto tnum text-[9px] text-ink-3">{rows.length}</span>
        <Link
          href="/wire"
          className="text-[9px] smallcaps text-ink-3 hover:text-rose"
        >
          full wire ›
        </Link>
      </div>
      <ul className="flex-1 min-h-0 overflow-auto">
        {rows.length === 0 && (
          <li className="px-3 py-4 text-[11px] text-ink-3">
            Nothing on this feed right now.
          </li>
        )}
        {rows.map((w) => (
          <li
            key={w.id}
            className="border-b border-hairline/60 hover:bg-elev-2 transition-colors"
          >
            <a
              href={w.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2 px-2.5 py-1.5"
            >
              <span
                className="mt-0.5 shrink-0 w-7 text-center text-[8px] smallcaps tnum py-0.5 border"
                style={{
                  color: SOURCE_ACCENT[w.source],
                  borderColor: SOURCE_ACCENT[w.source] + "55",
                }}
              >
                {SOURCE_LABEL[w.source]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] text-ink-1 truncate">{w.title}</span>
                <span className="block text-[10px] text-ink-3 truncate">
                  {w.author} · {w.metric}
                </span>
              </span>
              <span className="shrink-0 tnum text-[10px] text-ink-3 mt-0.5">{ago(w.at)}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
