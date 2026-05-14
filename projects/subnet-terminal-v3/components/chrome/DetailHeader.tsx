import Link from "next/link";
import { TaoMark } from "@/components/TaoMark";

/** Minimal sticky header for entity detail pages — wordmark, a
    breadcrumb, and a route back to the workstation. */
export function DetailHeader({ kind, crumb }: { kind: string; crumb: string }) {
  return (
    <header className="sticky top-0 z-40 h-12 shrink-0 flex items-center gap-3 px-4 bg-elev-1 border-b border-hairline">
      <Link
        href="/"
        className="flex items-baseline gap-[1px] font-serif text-[15px] text-ink-1"
      >
        Subne
        <span className="text-amber translate-y-[2px]">
          <TaoMark size={13} weight={2.4} />
        </span>
        <span className="ml-[2px]">Terminal</span>
      </Link>
      <span className="text-ink-3">/</span>
      <span className="text-[11px] text-ink-3 smallcaps">{kind}</span>
      <span className="text-ink-3">/</span>
      <span className="text-[12px] text-ink-1 smallcaps">{crumb}</span>
      <Link
        href="/"
        className="ml-auto text-[10px] text-ink-3 hover:text-ink-1 smallcaps"
      >
        ‹ back to terminal
      </Link>
    </header>
  );
}

/** A tabular key-stat cell for the detail header strip. */
export function StatCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 px-3 py-2 border-r border-hairline last:border-r-0 min-w-[96px]">
      <span className="text-[9px] smallcaps text-ink-3">{label}</span>
      <span
        className="tnum text-[13px]"
        style={{ color: accent ?? "var(--color-ink-1)" }}
      >
        {value}
      </span>
    </div>
  );
}
