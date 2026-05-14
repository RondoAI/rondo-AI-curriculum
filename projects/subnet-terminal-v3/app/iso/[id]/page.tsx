"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { usePower } from "@/lib/usePower";
import { DetailHeader, StatCell } from "@/components/chrome/DetailHeader";
import { AreaChart } from "@/components/charts/AreaChart";
import { seedSeries } from "@/components/charts/Sparkline";
import { int, pct, capacity } from "@/lib/format";
import { lmpColor, STATUS_ACCENT, STATUS_LABEL } from "@/lib/domain/power";

export default function IsoDetail() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id).toUpperCase();
  const { isos, nodes, datacenters, live } = usePower();
  const iso = isos.find((i) => i.iso === id);

  const isoNodes = useMemo(
    () => nodes.filter((n) => n.iso === id).sort((a, b) => a.lmp - b.lmp),
    [nodes, id]
  );
  const projects = useMemo(
    () => datacenters.filter((d) => d.iso === id).sort((a, b) => b.capacityMw - a.capacityMw),
    [datacenters, id]
  );
  const lmpSeries = useMemo(
    () => (iso ? seedSeries(iso.iso + "lmp", iso.chg24, 140) : []),
    [iso]
  );
  const loadSeries = useMemo(
    () => (iso ? seedSeries(iso.iso + "load", 4, 60) : []),
    [iso]
  );

  if (!iso) {
    return (
      <>
        <DetailHeader kind="iso" crumb={id} />
        <div className="flex-1 flex items-center justify-center text-ink-3 text-[13px]">
          No grid operator with that code. Try ERCOT, PJM, CAISO, MISO, NYISO or ISONE.
        </div>
      </>
    );
  }

  const accent = lmpColor(iso.avgLmp);
  const up = iso.chg24 >= 0;
  const headroom = ((iso.peakLoad - iso.load) / iso.peakLoad) * 100;
  const pipelineGw = projects.reduce((s, d) => s + d.capacityMw, 0) / 1000;

  return (
    <>
      <DetailHeader kind="iso" crumb={`${iso.iso} · ${iso.name}`} />
      <main className="flex-1 min-h-0 overflow-y-auto p-3 flex flex-col gap-3">
        <section className="border border-hairline bg-elev-1">
          <div className="flex items-center gap-3 px-3 py-2.5 border-b border-hairline">
            <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
            <span className="font-serif text-[20px] text-ink-1">{iso.iso}</span>
            <span className="text-[11px] text-ink-3">{iso.name}</span>
            <span className={`ml-auto tnum text-[15px] ${up ? "text-up" : "text-down"}`}>
              {up ? "▲" : "▼"} {pct(iso.chg24)} · 24h LMP
            </span>
          </div>
          <div className="flex flex-wrap">
            <StatCell label="avg lmp" value={"$" + iso.avgLmp.toFixed(2)} accent={accent} />
            <StatCell label="system load" value={capacity(iso.load)} />
            <StatCell label="seasonal peak" value={capacity(iso.peakLoad)} />
            <StatCell label="headroom" value={headroom.toFixed(0) + "%"} accent="var(--color-up)" />
            <StatCell label="renewables" value={(iso.renewablePct * 100).toFixed(0) + "%"} />
            <StatCell label="priced nodes" value={int(isoNodes.length)} />
            <StatCell label="dc pipeline" value={pipelineGw.toFixed(1) + " GW"} accent="var(--color-lime)" />
            <StatCell label="source" value={live.isos ? "iso feed" : "seed"} />
          </div>
        </section>

        <section className="border border-hairline bg-elev-1 h-[300px] flex flex-col">
          <span className="px-3 h-8 flex items-center text-[11px] smallcaps text-ink-1 border-b border-hairline">
            average hub LMP · $/MWh
          </span>
          <div className="relative flex-1 min-h-0">
            <AreaChart data={lmpSeries} color={accent} fmt={(n) => "$" + n.toFixed(0)} />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="border border-hairline bg-elev-1 flex flex-col">
            <span className="px-3 h-7 flex items-center text-[10px] smallcaps text-ink-2 border-b border-hairline">
              priced nodes · real-time vs day-ahead
            </span>
            <ul>
              {isoNodes.map((n) => {
                const nUp = n.chg24 >= 0;
                return (
                  <li
                    key={n.name}
                    className="flex items-center gap-3 px-3 py-1.5 border-b border-hairline/60 last:border-0"
                  >
                    <span className="text-[11px] text-ink-1 w-[150px] truncate">{n.name}</span>
                    <span
                      className="tnum text-[12px]"
                      style={{ color: lmpColor(n.lmp) }}
                    >
                      ${n.lmp.toFixed(2)}
                    </span>
                    <span className="tnum text-[10px] text-ink-3">
                      DA ${n.dayAhead.toFixed(2)}
                    </span>
                    <span
                      className={`tnum text-[10px] ml-auto ${nUp ? "text-up" : "text-down"}`}
                    >
                      {pct(n.chg24)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="border border-hairline bg-elev-1 h-[210px] flex flex-col">
            <span className="px-3 h-7 flex items-center text-[10px] smallcaps text-ink-2 border-b border-hairline">
              system load trend
            </span>
            <div className="relative flex-1 min-h-0">
              <AreaChart data={loadSeries} color="#84CC16" fmt={(n) => Math.round(n) + ""} />
            </div>
          </div>
        </section>

        <section className="border border-hairline bg-elev-1">
          <span className="px-3 h-7 flex items-center text-[10px] smallcaps text-ink-2 border-b border-hairline">
            datacenter pipeline in {iso.iso} · {pipelineGw.toFixed(1)} GW announced
          </span>
          <ul>
            {projects.length === 0 && (
              <li className="px-3 py-3 text-[11px] text-ink-3">
                No tracked datacenter projects in this ISO yet.
              </li>
            )}
            {projects.map((d) => (
              <li
                key={d.id}
                className="flex items-center gap-3 px-3 py-1.5 border-b border-hairline/60 last:border-0"
              >
                <span className="text-[12px] text-ink-1 w-[200px] truncate">{d.name}</span>
                <span className="text-[10px] text-ink-3 truncate flex-1">{d.operator}</span>
                <span className="text-[10px] text-ink-3">{d.region}</span>
                <span
                  className="text-[8px] smallcaps px-1 py-0.5 border"
                  style={{ color: STATUS_ACCENT[d.status], borderColor: STATUS_ACCENT[d.status] + "55" }}
                >
                  {STATUS_LABEL[d.status]}
                </span>
                <span className="tnum text-[11px] text-lime w-[64px] text-right">
                  {capacity(d.capacityMw)}
                </span>
                <span className="tnum text-[10px] text-ink-3 w-[36px] text-right">{d.online}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
