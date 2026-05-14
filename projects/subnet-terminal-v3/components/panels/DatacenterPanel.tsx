"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePower } from "@/lib/usePower";
import { capacity } from "@/lib/format";
import { STATUS_ACCENT, STATUS_LABEL, type ProjectStatus } from "@/lib/domain/power";

const FILTERS: Array<{ id: ProjectStatus | "all"; label: string }> = [
  { id: "all", label: "ALL" },
  { id: "construction", label: "BUILDING" },
  { id: "permitting", label: "PERMIT" },
  { id: "queue", label: "QUEUE" },
];

/** Panel 081 — the datacenter buildout pipeline. Announced GW of
    capacity by operator and ISO, ranked, with a status read. The
    demand the power vertical is bracing for. */
export function DatacenterPanel() {
  const { datacenters } = usePower();
  const [status, setStatus] = useState<ProjectStatus | "all">("all");

  const rows = useMemo(() => {
    const r =
      status === "all"
        ? [...datacenters]
        : datacenters.filter((d) => d.status === status);
    return r.sort((a, b) => b.capacityMw - a.capacityMw);
  }, [datacenters, status]);

  const totalGw = useMemo(
    () => rows.reduce((s, d) => s + d.capacityMw, 0) / 1000,
    [rows]
  );
  const max = Math.max(...rows.map((d) => d.capacityMw), 1);

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="shrink-0 flex items-center gap-1 px-2 py-1 border-b border-hairline">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setStatus(f.id)}
            className={`px-1.5 h-5 text-[9px] smallcaps border border-hairline-2 ${
              status === f.id ? "bg-lime text-bg border-lime" : "text-ink-3 hover:text-ink-1"
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto tnum text-[10px] text-lime">{totalGw.toFixed(1)} GW</span>
      </div>
      <ul className="flex-1 min-h-0 overflow-auto">
        {rows.map((d) => (
          <li
            key={d.id}
            className="border-b border-hairline/60 last:border-0 hover:bg-elev-2 transition-colors"
          >
            <Link href={`/iso/${d.iso}`} className="block px-2.5 py-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-ink-1 truncate flex-1">{d.name}</span>
                <span className="tnum text-[11px] text-ink-1 shrink-0">
                  {capacity(d.capacityMw)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex-1 h-1.5 bg-elev-2 overflow-hidden">
                  <span
                    className="block h-full"
                    style={{
                      width: `${(d.capacityMw / max) * 100}%`,
                      background: STATUS_ACCENT[d.status],
                    }}
                  />
                </span>
                <span
                  className="text-[8px] smallcaps shrink-0"
                  style={{ color: STATUS_ACCENT[d.status] }}
                >
                  {STATUS_LABEL[d.status]}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] text-ink-3 truncate">{d.operator}</span>
                <span className="text-[9px] text-ink-3">·</span>
                <span className="tnum text-[9px] text-ink-3">{d.iso}</span>
                <span className="tnum text-[9px] text-ink-3 ml-auto">{d.online}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
