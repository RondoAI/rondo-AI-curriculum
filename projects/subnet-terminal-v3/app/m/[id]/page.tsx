"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAi } from "@/lib/useAi";
import { DetailHeader, StatCell } from "@/components/chrome/DetailHeader";
import { AreaChart } from "@/components/charts/AreaChart";
import { Sparkline, seedSeries } from "@/components/charts/Sparkline";
import { compact, ago } from "@/lib/format";
import { TASK_ACCENT, TASK_LABEL } from "@/lib/domain/ai";

const RANGES = ["7D", "30D", "90D", "1Y", "ALL"] as const;
const RANGE_N: Record<string, number> = { "7D": 56, "30D": 90, "90D": 140, "1Y": 220, ALL: 300 };

export default function ModelDetail() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const { models, wire, live } = useAi();
  const model = models.find((m) => m.id === id);
  const [range, setRange] = useState<(typeof RANGES)[number]>("90D");

  const dlSeries = useMemo(
    () => (model ? seedSeries(model.id + range, model.likes / 80, RANGE_N[range]) : []),
    [model, range]
  );
  const likeSeries = useMemo(
    () => (model ? seedSeries(model.id + "l", 6, 60) : []),
    [model]
  );
  const stable = useMemo(
    () => (model ? models.filter((m) => m.org === model.org && m.id !== model.id) : []),
    [models, model]
  );
  const mentions = useMemo(
    () =>
      model
        ? wire.filter(
            (w) =>
              w.author.toLowerCase() === model.org.toLowerCase() ||
              w.title.toLowerCase().includes(model.name.toLowerCase())
          )
        : [],
    [wire, model]
  );

  if (!model) {
    return (
      <>
        <DetailHeader kind="model" crumb={id} />
        <div className="flex-1 flex items-center justify-center text-ink-3 text-[13px]">
          No model with that id on the current board.
        </div>
      </>
    );
  }

  const accent = TASK_ACCENT[model.task];

  return (
    <>
      <DetailHeader kind="model" crumb={model.id} />
      <main className="flex-1 min-h-0 overflow-y-auto p-3 flex flex-col gap-3">
        <section className="border border-hairline bg-elev-1">
          <div className="flex items-center gap-3 px-3 py-2.5 border-b border-hairline">
            <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
            <span className="font-serif text-[20px] text-ink-1">{model.name}</span>
            <span
              className="text-[10px] smallcaps px-1.5 py-0.5 border"
              style={{ color: accent, borderColor: accent + "55" }}
            >
              {TASK_LABEL[model.task]}
            </span>
            <span className="text-[11px] text-ink-3">{model.org}</span>
            <a
              href={`https://huggingface.co/${model.id}`}
              target="_blank"
              rel="noreferrer"
              className="ml-auto text-[10px] text-ink-3 hover:text-rose smallcaps"
            >
              open on huggingface ›
            </a>
          </div>
          <div className="flex flex-wrap">
            <StatCell label="30d downloads" value={compact(model.downloads)} accent="var(--color-rose)" />
            <StatCell label="likes" value={compact(model.likes)} />
            <StatCell label="licence" value={model.license} />
            <StatCell label="task" value={TASK_LABEL[model.task]} />
            <StatCell label="published" value={ago(model.createdAt) + " ago"} />
            <StatCell label="updated" value={ago(model.updated) + " ago"} />
            <StatCell label="source" value={live.models ? "huggingface" : "seed"} />
          </div>
        </section>

        <section className="border border-hairline bg-elev-1 h-[320px] flex flex-col">
          <div className="flex items-center gap-2 px-3 h-8 border-b border-hairline">
            <span className="text-[11px] smallcaps text-ink-1">download trend</span>
            <div className="ml-auto flex">
              {RANGES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`px-1.5 h-5 text-[9px] smallcaps border border-hairline-2 -ml-px first:ml-0 ${
                    range === r ? "bg-rose text-bg border-rose" : "text-ink-3 hover:text-ink-1"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="relative flex-1 min-h-0">
            <AreaChart data={dlSeries} color={accent} fmt={(n) => Math.round(n) + ""} />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="border border-hairline bg-elev-1 h-[180px] flex flex-col">
            <span className="px-3 h-7 flex items-center text-[10px] smallcaps text-ink-2 border-b border-hairline">
              community likes
            </span>
            <div className="relative flex-1 min-h-0">
              <AreaChart data={likeSeries} color="#FF7A88" fmt={(n) => Math.round(n) + ""} />
            </div>
          </div>
          <div className="border border-hairline bg-elev-1 h-[180px] flex flex-col">
            <span className="px-3 h-7 flex items-center text-[10px] smallcaps text-ink-2 border-b border-hairline">
              wire mentions · {mentions.length}
            </span>
            <ul className="flex-1 min-h-0 overflow-auto">
              {mentions.length === 0 && (
                <li className="px-3 py-3 text-[11px] text-ink-3">
                  No release-wire activity tied to this model yet.
                </li>
              )}
              {mentions.map((w) => (
                <li
                  key={w.id}
                  className="flex items-center gap-2 px-3 py-1.5 border-b border-hairline/60 last:border-0"
                >
                  <a
                    href={w.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-ink-1 hover:text-rose truncate flex-1"
                  >
                    {w.title}
                  </a>
                  <span className="tnum text-[10px] text-ink-3">{ago(w.at)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border border-hairline bg-elev-1">
          <span className="px-3 h-7 flex items-center text-[10px] smallcaps text-ink-2 border-b border-hairline">
            more from {model.org} · {stable.length}
          </span>
          <ul>
            {stable.length === 0 && (
              <li className="px-3 py-3 text-[11px] text-ink-3">
                No other tracked models from this org.
              </li>
            )}
            {stable.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-3 px-3 py-1.5 border-b border-hairline/60 last:border-0"
              >
                <Link
                  href={`/m/${encodeURIComponent(m.id)}`}
                  className="text-[12px] text-ink-1 hover:text-rose w-[200px] truncate"
                >
                  {m.name}
                </Link>
                <span className="tnum text-[11px] text-ink-2">{compact(m.downloads)} dl</span>
                <span className="tnum text-[11px] text-ink-3 ml-auto">{m.license}</span>
                <Sparkline data={seedSeries(m.id, m.likes / 100, 16)} width={56} height={16} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
