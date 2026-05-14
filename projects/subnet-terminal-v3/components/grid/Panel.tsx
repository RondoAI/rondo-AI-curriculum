import type { PanelDef } from "@/lib/panels";
import { VERTICAL_ACCENT, VERTICAL_LABEL } from "@/lib/panels";

/** Empty-state line per vertical — the desk's voice, not "Loading…". */
const EMPTY: Record<string, string> = {
  bittensor: "Reading the chain…",
  ai: "The labs are quiet. For now.",
  gpu: "Polling the GPU desks…",
  power: "Listening to the grid…",
  editorial: "The next piece is being set.",
};

/** A workstation panel shell — hairline border, header is the drag
    handle, body holds the chart/table once its phase lands. */
export function Panel({
  def,
  children,
}: {
  def: PanelDef;
  children?: React.ReactNode;
}) {
  const accent = VERTICAL_ACCENT[def.vertical];
  return (
    <section className="h-full flex flex-col bg-elev-1 border border-hairline overflow-hidden">
      {/* header — drag handle */}
      <header className="panel-drag shrink-0 flex items-center gap-2 h-7 px-2.5 border-b border-hairline cursor-grab active:cursor-grabbing select-none">
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: accent }}
        />
        <span className="tnum text-[10px] text-ink-3">{def.code}</span>
        <span className="text-[11px] text-ink-1 smallcaps truncate">{def.title}</span>
        <span
          className="ml-auto text-[9px] smallcaps shrink-0"
          style={{ color: accent }}
        >
          {VERTICAL_LABEL[def.vertical]}
        </span>
      </header>

      {/* body */}
      <div className="flex-1 min-h-0 relative">
        {children ?? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-3 text-center">
            <span className="text-[11px] text-ink-2">{EMPTY[def.vertical]}</span>
            <span className="text-[10px] text-ink-3 leading-relaxed max-w-[34ch]">
              {def.blurb}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
