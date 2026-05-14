"use client";

import { useRouter } from "next/navigation";
import { usePower } from "@/lib/usePower";
import { IsoMap } from "@/components/charts/IsoMap";

/** Panel 080 — the ISO power map. Six grid operators placed by rough
    geography, sized by system load, coloured by average hub LMP.
    The map of where power is cheap enough to compute. */
export function IsoMapPanel() {
  const { isos } = usePower();
  const router = useRouter();
  return (
    <div className="absolute inset-0">
      <IsoMap isos={isos} onPick={(iso) => router.push(`/iso/${iso.iso}`)} />
      <div className="absolute left-2 bottom-1.5 flex items-center gap-2 text-[9px] text-ink-3 smallcaps">
        <span>node = load</span>
        <span className="text-red">·</span>
        <span>colour = $/MWh: cheap</span>
        <span className="inline-flex gap-px">
          <span className="w-2 h-2" style={{ background: "#00E5A8" }} />
          <span className="w-2 h-2" style={{ background: "#FF7A88" }} />
          <span className="w-2 h-2" style={{ background: "#FF1E3C" }} />
        </span>
        <span>scarce</span>
      </div>
    </div>
  );
}
