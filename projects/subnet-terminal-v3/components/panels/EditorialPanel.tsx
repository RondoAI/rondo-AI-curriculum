"use client";

import Link from "next/link";
import { ARTICLES } from "@/data/seed/editorial";
import { VERTICAL_ACCENT, VERTICAL_LABEL } from "@/lib/panels";

/** Panel 900 — editorial. The magazine DNA: long-form argument from
    the desk, each piece tagged to the vertical it reasons about.
    A horizontal rail of cards; click through to the reader. */
export function EditorialPanel() {
  return (
    <div className="absolute inset-0 overflow-x-auto overflow-y-hidden">
      <div className="flex h-full gap-px bg-hairline" style={{ width: "max-content" }}>
        {ARTICLES.map((a) => {
          const accent = VERTICAL_ACCENT[a.vertical];
          return (
            <Link
              key={a.slug}
              href={`/editorial/${a.slug}`}
              className="group flex flex-col gap-1.5 w-[300px] h-full p-3 bg-elev-1 hover:bg-elev-2 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-[8px] smallcaps px-1 py-0.5 border"
                  style={{ color: accent, borderColor: accent + "55" }}
                >
                  {VERTICAL_LABEL[a.vertical]}
                </span>
                <span className="tnum text-[9px] text-ink-3">{a.date}</span>
                <span className="tnum text-[9px] text-ink-3 ml-auto">{a.readMins} min</span>
              </div>
              <h3 className="font-serif text-[15px] leading-tight text-ink-1 group-hover:text-ink-1">
                {a.title}
              </h3>
              <p className="text-[11px] leading-snug text-ink-3 line-clamp-3">{a.deck}</p>
              <span className="mt-auto text-[10px] smallcaps text-ink-3 group-hover:text-ink-1">
                {a.author} · read ›
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
