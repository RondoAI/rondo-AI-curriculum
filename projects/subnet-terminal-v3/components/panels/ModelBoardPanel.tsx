"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAi } from "@/lib/useAi";
import { compact } from "@/lib/format";
import { TASK_ACCENT, TASK_LABEL, type ModelEntry } from "@/lib/domain/ai";

type Col = { id: keyof ModelEntry; label: string; num: boolean };
const COLS: Col[] = [
  { id: "name", label: "Model", num: false },
  { id: "task", label: "Task", num: false },
  { id: "downloads", label: "30d DL", num: true },
  { id: "likes", label: "Likes", num: true },
  { id: "license", label: "Licence", num: false },
];

/** Panel 061 — the open-model leaderboard. HuggingFace `downloads`
    is the trailing-30d count, so the default sort is the live
    trending board. Click a row → model detail. */
export function ModelBoardPanel() {
  const { models } = useAi();
  const [sort, setSort] = useState<keyof ModelEntry>("downloads");
  const [dir, setDir] = useState(-1);

  const rows = useMemo(() => {
    const r = [...models];
    r.sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
    return r;
  }, [models, sort, dir]);

  function clickCol(id: keyof ModelEntry) {
    if (sort === id) setDir((d) => -d);
    else {
      setSort(id);
      setDir(id === "downloads" || id === "likes" ? -1 : 1);
    }
  }

  return (
    <div className="absolute inset-0 overflow-auto">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 z-10 bg-elev-2">
          <tr>
            {COLS.map((c) => (
              <th
                key={c.id}
                onClick={() => clickCol(c.id)}
                className={`px-2 py-1.5 text-[9px] smallcaps text-ink-3 cursor-pointer hover:text-ink-1 border-b border-hairline whitespace-nowrap ${
                  c.num ? "text-right" : "text-left"
                } ${sort === c.id ? "text-rose" : ""}`}
              >
                {c.label}
                {sort === c.id ? (dir === 1 ? " ▲" : " ▼") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => (
            <tr
              key={m.id}
              className="border-b border-hairline/60 hover:bg-elev-2 transition-colors"
            >
              <td className="px-2 py-1 max-w-[150px]">
                <Link
                  href={`/m/${encodeURIComponent(m.id)}`}
                  className="flex items-center gap-1.5"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: TASK_ACCENT[m.task] }}
                  />
                  <span className="min-w-0">
                    <span className="block text-[11px] text-ink-1 truncate">{m.name}</span>
                    <span className="block text-[9px] text-ink-3 truncate">{m.org}</span>
                  </span>
                </Link>
              </td>
              <td className="px-2 py-1">
                <span
                  className="text-[8px] smallcaps px-1 py-0.5 border whitespace-nowrap"
                  style={{
                    color: TASK_ACCENT[m.task],
                    borderColor: TASK_ACCENT[m.task] + "55",
                  }}
                >
                  {TASK_LABEL[m.task]}
                </span>
              </td>
              <td className="px-2 py-1 text-right tnum text-[11px] text-ink-1">
                {compact(m.downloads)}
              </td>
              <td className="px-2 py-1 text-right tnum text-[11px] text-ink-2">
                {compact(m.likes)}
              </td>
              <td className="px-2 py-1 text-right tnum text-[10px] text-ink-3 truncate max-w-[90px]">
                {m.license}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
