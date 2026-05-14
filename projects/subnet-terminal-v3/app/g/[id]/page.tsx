"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGpu } from "@/lib/useGpu";
import { DetailHeader, StatCell } from "@/components/chrome/DetailHeader";
import { int } from "@/lib/format";
import {
  VENDOR_ACCENT,
  VENDOR_LABEL,
  dollarPerTflop,
} from "@/lib/domain/gpu";

export default function GpuDetail() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const { chips, listings, live } = useGpu();
  const chip = chips.find((c) => c.id === id);

  const offers = useMemo(
    () =>
      listings
        .filter((l) => l.chipId === id)
        .sort((a, b) => a.onDemand - b.onDemand),
    [listings, id]
  );

  const compare = useMemo(() => {
    const byId = new Map(chips.map((c) => [c.id, c]));
    const cheapest = new Map<string, number>();
    for (const l of listings) {
      const cur = cheapest.get(l.chipId);
      if (cur == null || l.onDemand < cur) cheapest.set(l.chipId, l.onDemand);
    }
    return [...cheapest.entries()]
      .map(([cid, price]) => {
        const c = byId.get(cid);
        const perTflop = c && c.fp16 ? (price / c.fp16) * 1000 : 0;
        return { chip: c, price, perTflop };
      })
      .filter((x): x is { chip: NonNullable<typeof x.chip>; price: number; perTflop: number } =>
        Boolean(x.chip)
      )
      .sort((a, b) => a.perTflop - b.perTflop);
  }, [chips, listings]);

  if (!chip) {
    return (
      <>
        <DetailHeader kind="gpu" crumb={id} />
        <div className="flex-1 flex items-center justify-center text-ink-3 text-[13px]">
          No accelerator with that id in the current catalogue.
        </div>
      </>
    );
  }

  const accent = VENDOR_ACCENT[chip.vendor];
  const cheapest = offers[0];
  const maxOnDemand = Math.max(...offers.map((o) => o.onDemand), 1);
  const maxPerTflop = Math.max(...compare.map((c) => c.perTflop), 1);

  return (
    <>
      <DetailHeader kind="gpu" crumb={chip.name} />
      <main className="flex-1 min-h-0 overflow-y-auto p-3 flex flex-col gap-3">
        <section className="border border-hairline bg-elev-1">
          <div className="flex items-center gap-3 px-3 py-2.5 border-b border-hairline">
            <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
            <span className="font-serif text-[20px] text-ink-1">{chip.name}</span>
            <span
              className="text-[10px] smallcaps px-1.5 py-0.5 border"
              style={{ color: accent, borderColor: accent + "55" }}
            >
              {VENDOR_LABEL[chip.vendor]}
            </span>
            <span className="text-[11px] text-ink-3">{chip.releaseYear}</span>
            {cheapest && (
              <span className="ml-auto tnum text-[15px] text-cyan">
                from ${cheapest.onDemand.toFixed(2)}/hr
              </span>
            )}
          </div>
          <div className="flex flex-wrap">
            <StatCell label="vram" value={chip.vram + " GB"} accent={accent} />
            <StatCell label="fp16" value={int(chip.fp16) + " TF"} />
            <StatCell label="bandwidth" value={int(chip.bandwidth) + " GB/s"} />
            <StatCell label="board power" value={chip.tdp + " W"} />
            <StatCell label="offers" value={int(offers.length)} />
            <StatCell
              label="$/tflop·hr"
              value={cheapest ? "$" + dollarPerTflop(cheapest, chip).toFixed(3) : "—"}
              accent="var(--color-cyan)"
            />
            <StatCell label="source" value={live.listings ? "live" : "seed"} />
          </div>
        </section>

        <section className="border border-hairline bg-elev-1">
          <span className="px-3 h-7 flex items-center text-[10px] smallcaps text-ink-2 border-b border-hairline">
            available at · {offers.length}
          </span>
          <ul>
            {offers.length === 0 && (
              <li className="px-3 py-3 text-[11px] text-ink-3">
                No tracked cloud lists this accelerator yet.
              </li>
            )}
            {offers.map((o, i) => (
              <li
                key={`${o.provider}-${i}`}
                className="flex items-center gap-3 px-3 py-2 border-b border-hairline/60 last:border-0"
              >
                <span className="w-[150px] shrink-0">
                  <span className="block text-[12px] text-ink-1">{o.provider}</span>
                  <span className="block text-[9px] text-ink-3">{o.region}</span>
                </span>
                <span className="flex-1 min-w-0 h-2.5 bg-elev-2 overflow-hidden">
                  <span
                    className="block h-full bg-cyan/60"
                    style={{ width: `${(o.onDemand / maxOnDemand) * 100}%` }}
                  />
                </span>
                <span className="tnum text-[12px] text-ink-1 w-[64px] text-right">
                  ${o.onDemand.toFixed(2)}
                </span>
                <span className="tnum text-[11px] text-cyan w-[58px] text-right">
                  {o.spot > 0 ? "$" + o.spot.toFixed(2) : "—"}
                </span>
                <span className="w-[44px] text-right">
                  <span className="inline-block w-9 h-1 bg-elev-2 overflow-hidden align-middle">
                    <span
                      className="block h-full"
                      style={{
                        width: `${Math.round(o.availability * 100)}%`,
                        background:
                          o.availability > 0.6
                            ? "var(--color-up)"
                            : o.availability > 0.3
                              ? "var(--color-cyan)"
                              : "var(--color-down)",
                      }}
                    />
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div className="px-3 py-1.5 text-[9px] text-ink-3 smallcaps border-t border-hairline">
            bar = on-demand $/hr · then spot · then availability
          </div>
        </section>

        <section className="border border-hairline bg-elev-1">
          <span className="px-3 h-7 flex items-center text-[10px] smallcaps text-ink-2 border-b border-hairline">
            compute economics · cheapest $/tflop·hr across the catalogue
          </span>
          <ul>
            {compare.map((c) => {
              const isThis = c.chip.id === chip.id;
              return (
                <li
                  key={c.chip.id}
                  className={`flex items-center gap-3 px-3 py-1.5 border-b border-hairline/60 last:border-0 ${
                    isThis ? "bg-elev-2" : ""
                  }`}
                >
                  <Link
                    href={`/g/${c.chip.id}`}
                    className={`w-[130px] shrink-0 text-[12px] truncate ${
                      isThis ? "text-cyan" : "text-ink-1 hover:text-cyan"
                    }`}
                  >
                    {c.chip.name}
                  </Link>
                  <span className="flex-1 min-w-0 h-2 bg-elev-2 overflow-hidden">
                    <span
                      className="block h-full"
                      style={{
                        width: `${(c.perTflop / maxPerTflop) * 100}%`,
                        background: isThis ? "var(--color-cyan)" : VENDOR_ACCENT[c.chip.vendor],
                        opacity: isThis ? 1 : 0.55,
                      }}
                    />
                  </span>
                  <span className="tnum text-[11px] text-ink-2 w-[64px] text-right">
                    ${c.perTflop.toFixed(3)}
                  </span>
                  <span className="tnum text-[10px] text-ink-3 w-[52px] text-right">
                    ${c.price.toFixed(2)}/hr
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </>
  );
}
