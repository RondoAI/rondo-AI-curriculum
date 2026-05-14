"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useBittensor } from "@/lib/useBittensor";
import { DetailHeader, StatCell } from "@/components/chrome/DetailHeader";
import { AreaChart } from "@/components/charts/AreaChart";
import { Sparkline, seedSeries } from "@/components/charts/Sparkline";
import { int, pct } from "@/lib/format";

const RANGES = ["7D", "30D", "90D", "1Y", "ALL"] as const;
const RANGE_N: Record<string, number> = { "7D": 56, "30D": 90, "90D": 140, "1Y": 220, ALL: 300 };

export default function ValidatorDetail() {
  const params = useParams<{ hotkey: string }>();
  const hotkey = decodeURIComponent(params.hotkey);
  const { validators, subnets, live } = useBittensor();
  const val = validators.find((v) => v.hotkey === hotkey);
  const [range, setRange] = useState<(typeof RANGES)[number]>("90D");

  const stakeSeries = useMemo(
    () => (val ? seedSeries(val.name + range, val.stakeChg24 / 50, RANGE_N[range]) : []),
    [val, range]
  );
  const nomSeries = useMemo(
    () => (val ? seedSeries(val.name + "n", 8, 60) : []),
    [val]
  );
  const aprSeries = useMemo(
    () => (val ? seedSeries(val.name + "a", 2, 60) : []),
    [val]
  );
  const linkedSubnets = useMemo(
    () => (val ? subnets.filter((s) => val.subnets.includes(s.netuid)) : []),
    [val, subnets]
  );

  if (!val) {
    return (
      <>
        <DetailHeader kind="validator" crumb={hotkey} />
        <div className="flex-1 flex items-center justify-center text-ink-3 text-[13px]">
          No validator with that hotkey in the current set.
        </div>
      </>
    );
  }

  const up = val.stakeChg24 >= 0;

  return (
    <>
      <DetailHeader kind="validator" crumb={val.name} />
      <main className="flex-1 min-h-0 overflow-y-auto p-3 flex flex-col gap-3">
        <section className="border border-hairline bg-elev-1">
          <div className="flex items-center gap-3 px-3 py-2.5 border-b border-hairline">
            <span className="font-serif text-[20px] text-ink-1">{val.name}</span>
            <span className="tnum text-[11px] text-ink-3">{val.hotkey}</span>
            <span className={`ml-auto tnum text-[14px] ${up ? "text-up" : "text-down"}`}>
              {up ? "▲" : "▼"} τ{int(Math.abs(val.stakeChg24))} · 24h
            </span>
          </div>
          <div className="flex flex-wrap">
            <StatCell label="stake" value={"τ" + int(val.stake)} accent="var(--color-red)" />
            <StatCell label="own stake" value={"τ" + int(val.ownStake)} />
            <StatCell label="nominators" value={int(val.nominators)} />
            <StatCell label="dominance" value={val.dominance.toFixed(2) + "%"} />
            <StatCell label="take" value={val.take.toFixed(1) + "%"} />
            <StatCell label="apr · 30d" value={val.apr.toFixed(1) + "%"} accent="var(--color-up)" />
            <StatCell label="subnets" value={int(val.subnets.length)} />
            <StatCell label="source" value={live.validators ? "taostats" : "seed"} />
          </div>
        </section>

        <section className="border border-hairline bg-elev-1 h-[320px] flex flex-col">
          <div className="flex items-center gap-2 px-3 h-8 border-b border-hairline">
            <span className="text-[11px] smallcaps text-ink-1">delegated stake</span>
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
            <AreaChart data={stakeSeries} color="#FF1E3C" fmt={(n) => Math.round(n) + ""} />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="border border-hairline bg-elev-1 h-[180px] flex flex-col">
            <span className="px-3 h-7 flex items-center text-[10px] smallcaps text-ink-2 border-b border-hairline">
              nominator count
            </span>
            <div className="relative flex-1 min-h-0">
              <AreaChart data={nomSeries} color="#FF4D60" fmt={(n) => Math.round(n) + ""} />
            </div>
          </div>
          <div className="border border-hairline bg-elev-1 h-[180px] flex flex-col">
            <span className="px-3 h-7 flex items-center text-[10px] smallcaps text-ink-2 border-b border-hairline">
              nominator apr
            </span>
            <div className="relative flex-1 min-h-0">
              <AreaChart data={aprSeries} color="#FF8C42" fmt={(n) => n.toFixed(1) + "%"} />
            </div>
          </div>
        </section>

        <section className="border border-hairline bg-elev-1">
          <span className="px-3 h-7 flex items-center text-[10px] smallcaps text-ink-2 border-b border-hairline">
            subnets validated · {linkedSubnets.length}
          </span>
          <ul>
            {linkedSubnets.length === 0 && (
              <li className="px-3 py-3 text-[11px] text-ink-3">
                This hotkey isn&apos;t registered on any tracked subnet.
              </li>
            )}
            {linkedSubnets.map((s) => (
              <li
                key={s.netuid}
                className="flex items-center gap-3 px-3 py-1.5 border-b border-hairline/60 last:border-0"
              >
                <Link
                  href={`/s/${s.netuid}`}
                  className="text-[12px] text-ink-1 hover:text-red w-[180px] truncate"
                >
                  SN{s.netuid} · {s.name}
                </Link>
                <span className="tnum text-[11px] text-ink-2">τ{int(s.emission)}</span>
                <span
                  className={`tnum text-[11px] ml-auto ${
                    s.chg24 >= 0 ? "text-up" : "text-down"
                  }`}
                >
                  {pct(s.chg24)}
                </span>
                <Sparkline data={seedSeries(s.name, s.chg7, 16)} width={56} height={16} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
