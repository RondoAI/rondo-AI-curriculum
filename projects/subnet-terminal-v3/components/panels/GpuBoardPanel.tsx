"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useGpu } from "@/lib/useGpu";
import { VENDOR_ACCENT, type GpuChip } from "@/lib/domain/gpu";

type Row = {
  chipId: string;
  chip: string;
  vendor: GpuChip["vendor"];
  provider: string;
  region: string;
  onDemand: number;
  spot: number;
  availability: number;
};

type Col = { id: keyof Row; label: string; num: boolean };
const COLS: Col[] = [
  { id: "chip", label: "GPU", num: false },
  { id: "provider", label: "Cloud", num: false },
  { id: "onDemand", label: "On-Dmd", num: true },
  { id: "spot", label: "Spot", num: true },
  { id: "availability", label: "Avail", num: true },
];

/** Panel 070 — the GPU price board. Every rentable offer across the
    independent clouds and hyperscalers, spot beside on-demand, with
    a coarse availability read. Click a chip → GPU detail. */
export function GpuBoardPanel() {
  const { chips, listings } = useGpu();
  const [sort, setSort] = useState<keyof Row>("onDemand");
  const [dir, setDir] = useState(1);

  const rows = useMemo<Row[]>(() => {
    const byId = new Map(chips.map((c) => [c.id, c]));
    const r: Row[] = listings.map((l) => {
      const chip = byId.get(l.chipId);
      return {
        chipId: l.chipId,
        chip: chip?.name ?? l.chipId,
        vendor: chip?.vendor ?? "nvidia",
        provider: l.provider,
        region: l.region,
        onDemand: l.onDemand,
        spot: l.spot,
        availability: l.availability,
      };
    });
    r.sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
    return r;
  }, [chips, listings, sort, dir]);

  function clickCol(id: keyof Row) {
    if (sort === id) setDir((d) => -d);
    else {
      setSort(id);
      setDir(id === "onDemand" || id === "spot" ? 1 : -1);
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
                } ${sort === c.id ? "text-coral" : ""}`}
              >
                {c.label}
                {sort === c.id ? (dir === 1 ? " ▲" : " ▼") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={`${r.chipId}-${r.provider}-${i}`}
              className="border-b border-hairline/60 hover:bg-elev-2 transition-colors"
            >
              <td className="px-2 py-1">
                <Link href={`/g/${r.chipId}`} className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: VENDOR_ACCENT[r.vendor] }}
                  />
                  <span className="text-[11px] text-ink-1 truncate max-w-[88px]">
                    {r.chip}
                  </span>
                </Link>
              </td>
              <td className="px-2 py-1">
                <span className="text-[11px] text-ink-2 truncate block max-w-[92px]">
                  {r.provider}
                </span>
                <span className="text-[9px] text-ink-3">{r.region}</span>
              </td>
              <td className="px-2 py-1 text-right tnum text-[11px] text-ink-1">
                ${r.onDemand.toFixed(2)}
              </td>
              <td className="px-2 py-1 text-right tnum text-[11px] text-coral">
                {r.spot > 0 ? "$" + r.spot.toFixed(2) : "—"}
              </td>
              <td className="px-2 py-1 text-right">
                <span className="inline-flex items-center gap-1 justify-end">
                  <span className="w-8 h-1 bg-elev-2 overflow-hidden">
                    <span
                      className="block h-full"
                      style={{
                        width: `${Math.round(r.availability * 100)}%`,
                        background:
                          r.availability > 0.6
                            ? "var(--color-up)"
                            : r.availability > 0.3
                              ? "var(--color-coral)"
                              : "var(--color-down)",
                      }}
                    />
                  </span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
