"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useBittensor } from "@/lib/useBittensor";
import { Sparkline, seedSeries } from "@/components/charts/Sparkline";
import { usdCompact, pct, int } from "@/lib/format";
import { CATEGORY_ACCENT, type Subnet } from "@/lib/domain/bittensor";

type Col = { id: keyof Subnet; label: string; num: boolean };
const COLS: Col[] = [
  { id: "netuid", label: "SN", num: true },
  { id: "name", label: "Subnet", num: false },
  { id: "alphaPrice", label: "α-Price", num: true },
  { id: "chg24", label: "24h", num: true },
  { id: "chg7", label: "7d", num: true },
  { id: "emission", label: "Emit", num: true },
  { id: "validators", label: "Vals", num: true },
];

/** Panel 041 — the sortable subnet leaderboard with inline
    sparklines. Click a row → subnet detail. */
export function SubnetBoardPanel() {
  const { subnets } = useBittensor();
  const [sort, setSort] = useState<keyof Subnet>("emission");
  const [dir, setDir] = useState(-1);

  const rows = useMemo(() => {
    const r = [...subnets];
    r.sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
    return r;
  }, [subnets, sort, dir]);

  function clickCol(id: keyof Subnet) {
    if (sort === id) setDir((d) => -d);
    else {
      setSort(id);
      setDir(id === "name" ? 1 : -1);
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
                } ${sort === c.id ? "text-amber" : ""}`}
              >
                {c.label}
                {sort === c.id ? (dir === 1 ? " ▲" : " ▼") : ""}
              </th>
            ))}
            <th className="px-2 py-1.5 border-b border-hairline" />
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => {
            const up24 = s.chg24 >= 0;
            const up7 = s.chg7 >= 0;
            return (
              <tr
                key={s.netuid}
                className="border-b border-hairline/60 hover:bg-elev-2 transition-colors"
              >
                <td className="px-2 py-1 text-right">
                  <Link
                    href={`/s/${s.netuid}`}
                    className="tnum text-[11px] text-amber"
                  >
                    {s.netuid}
                  </Link>
                </td>
                <td className="px-2 py-1">
                  <Link href={`/s/${s.netuid}`} className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: CATEGORY_ACCENT[s.category] }}
                    />
                    <span className="text-[11px] text-ink-1 truncate max-w-[110px]">
                      {s.name}
                    </span>
                  </Link>
                </td>
                <td className="px-2 py-1 text-right tnum text-[11px] text-ink-1">
                  ${s.alphaPrice.toFixed(4)}
                </td>
                <td
                  className={`px-2 py-1 text-right tnum text-[11px] ${
                    up24 ? "text-up" : "text-down"
                  }`}
                >
                  {pct(s.chg24)}
                </td>
                <td
                  className={`px-2 py-1 text-right tnum text-[11px] ${
                    up7 ? "text-up" : "text-down"
                  }`}
                >
                  {pct(s.chg7)}
                </td>
                <td className="px-2 py-1 text-right tnum text-[11px] text-ink-2">
                  τ{int(s.emission)}
                </td>
                <td className="px-2 py-1 text-right tnum text-[11px] text-ink-2">
                  {s.validators}
                </td>
                <td className="px-2 py-1">
                  <Sparkline
                    data={seedSeries(s.name, s.chg7, 18)}
                    width={56}
                    height={16}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
