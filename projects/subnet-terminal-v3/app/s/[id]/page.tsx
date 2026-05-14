"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useBittensor } from "@/lib/useBittensor";
import { DetailHeader, StatCell } from "@/components/chrome/DetailHeader";
import { AreaChart } from "@/components/charts/AreaChart";
import { Sparkline, seedSeries } from "@/components/charts/Sparkline";
import { usdCompact, pct, int } from "@/lib/format";
import { CATEGORY_ACCENT } from "@/lib/domain/bittensor";

const RANGES = ["1D", "7D", "30D", "90D", "1Y", "ALL"] as const;
const RANGE_N: Record<string, number> = { "1D": 24, "7D": 56, "30D": 90, "90D": 140, "1Y": 220, ALL: 300 };

export default function SubnetDetail() {
  const params = useParams<{ id: string }>();
  const netuid = Number(params.id);
  const { subnets, validators, live } = useBittensor();
  const subnet = subnets.find((s) => s.netuid === netuid);
  const [range, setRange] = useState<(typeof RANGES)[number]>("90D");

  const priceSeries = useMemo(
    () => (subnet ? seedSeries(subnet.name + range, subnet.chg30, RANGE_N[range]) : []),
    [subnet, range]
  );
  const emitSeries = useMemo(
    () => (subnet ? seedSeries(subnet.name + "e", subnet.chg7, 60) : []),
    [subnet]
  );
  const minerSeries = useMemo(
    () => (subnet ? seedSeries(subnet.name + "m", subnet.chg24 * 0.4, 60) : []),
    [subnet]
  );
  const linkedVals = useMemo(
    () => validators.filter((v) => v.subnets.includes(netuid)).slice(0, 8),
    [validators, netuid]
  );

  if (!subnet) {
    return (
      <>
        <DetailHeader kind="subnet" crumb={`SN${params.id}`} />
        <div className="flex-1 flex items-center justify-center text-ink-3 text-[13px]">
          No subnet at netuid {params.id}. It may be deregistered, or never existed.
        </div>
      </>
    );
  }

  const accent = CATEGORY_ACCENT[subnet.category];
  const up = subnet.chg24 >= 0;

  return (
    <>
      <DetailHeader kind="subnet" crumb={`SN${subnet.netuid} · ${subnet.name}`} />
      <main className="flex-1 min-h-0 overflow-y-auto p-3 flex flex-col gap-3">
        {/* identity + key-stat strip */}
        <section className="border border-hairline bg-elev-1">
          <div className="flex items-center gap-3 px-3 py-2.5 border-b border-hairline">
            <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
            <span className="font-serif text-[20px] text-ink-1">
              SN{subnet.netuid} · {subnet.name}
            </span>
            <span className="text-[10px] smallcaps px-1.5 py-0.5 border border-hairline-2 text-ink-2">
              {subnet.category}
            </span>
            <span className="text-[11px] text-ink-3">{subnet.owner}</span>
            <span className={`ml-auto tnum text-[15px] ${up ? "text-up" : "text-down"}`}>
              {up ? "▲" : "▼"} {pct(subnet.chg24)}
            </span>
          </div>
          <div className="flex flex-wrap">
            <StatCell label="α-price" value={"$" + subnet.alphaPrice.toFixed(6)} accent={accent} />
            <StatCell label="market cap" value={usdCompact(subnet.marketCap)} />
            <StatCell label="emission / 24h" value={"τ" + int(subnet.emission)} />
            <StatCell label="net share" value={subnet.emissionShare.toFixed(1) + "%"} />
            <StatCell label="miners" value={int(subnet.miners)} />
            <StatCell label="validators" value={int(subnet.validators)} />
            <StatCell label="reg cost" value={"τ" + subnet.regCost.toFixed(1)} />
            <StatCell label="age" value={int(subnet.ageDays) + "d"} />
            <StatCell label="7d" value={pct(subnet.chg7)} accent={subnet.chg7 >= 0 ? "var(--color-up)" : "var(--color-down)"} />
            <StatCell label="30d" value={pct(subnet.chg30)} accent={subnet.chg30 >= 0 ? "var(--color-up)" : "var(--color-down)"} />
            <StatCell label="weight gini" value={subnet.gini.toFixed(2)} />
            <StatCell label="source" value={live.subnets ? "taostats" : "seed"} />
          </div>
        </section>

        {/* primary chart */}
        <section className="border border-hairline bg-elev-1 h-[320px] flex flex-col">
          <div className="flex items-center gap-2 px-3 h-8 border-b border-hairline">
            <span className="text-[11px] smallcaps text-ink-1">α-price</span>
            <div className="ml-auto flex">
              {RANGES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`px-1.5 h-5 text-[9px] smallcaps border border-hairline-2 -ml-px first:ml-0 ${
                    range === r ? "bg-red text-bg border-red" : "text-ink-3 hover:text-ink-1"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="relative flex-1 min-h-0">
            <AreaChart data={priceSeries} color={accent} fmt={(n) => n.toFixed(1)} />
          </div>
        </section>

        {/* secondary charts */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="border border-hairline bg-elev-1 h-[180px] flex flex-col">
            <span className="px-3 h-7 flex items-center text-[10px] smallcaps text-ink-2 border-b border-hairline">
              emissions trend
            </span>
            <div className="relative flex-1 min-h-0">
              <AreaChart data={emitSeries} color="#FF4D60" fmt={(n) => Math.round(n) + ""} />
            </div>
          </div>
          <div className="border border-hairline bg-elev-1 h-[180px] flex flex-col">
            <span className="px-3 h-7 flex items-center text-[10px] smallcaps text-ink-2 border-b border-hairline">
              active miners
            </span>
            <div className="relative flex-1 min-h-0">
              <AreaChart data={minerSeries} color="#FF7A88" fmt={(n) => Math.round(n) + ""} />
            </div>
          </div>
        </section>

        {/* linked entities */}
        <section className="border border-hairline bg-elev-1">
          <span className="px-3 h-7 flex items-center text-[10px] smallcaps text-ink-2 border-b border-hairline">
            validators on this subnet · {linkedVals.length}
          </span>
          <ul>
            {linkedVals.length === 0 && (
              <li className="px-3 py-3 text-[11px] text-ink-3">
                No tracked validators register weights here yet.
              </li>
            )}
            {linkedVals.map((v) => (
              <li
                key={v.hotkey}
                className="flex items-center gap-3 px-3 py-1.5 border-b border-hairline/60 last:border-0"
              >
                <Link
                  href={`/v/${encodeURIComponent(v.hotkey)}`}
                  className="text-[12px] text-ink-1 hover:text-red w-[180px] truncate"
                >
                  {v.name}
                </Link>
                <span className="tnum text-[11px] text-ink-2">τ{int(v.stake)}</span>
                <span className="tnum text-[11px] text-ink-3">{int(v.nominators)} noms</span>
                <span className="tnum text-[11px] text-up ml-auto">{v.apr.toFixed(1)}%</span>
                <Sparkline data={seedSeries(v.name, v.stakeChg24 / 100, 16)} width={56} height={16} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
