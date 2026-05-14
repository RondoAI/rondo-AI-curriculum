"use client";

import { useEffect, useState } from "react";
import { clock } from "@/lib/format";

/** UTC + local clock, ticking every second. Mounts client-side only
    to avoid a hydration mismatch on the time string. */
export function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-3 tnum text-[10px] leading-none">
      <span className="flex flex-col items-end gap-0.5">
        <span className="text-ink-3 smallcaps">utc</span>
        <span className="text-ink-1">{now ? clock(now, true) : "··:··:··"}</span>
      </span>
      <span className="flex flex-col items-end gap-0.5">
        <span className="text-ink-3 smallcaps">local</span>
        <span className="text-ink-2">{now ? clock(now, false) : "··:··:··"}</span>
      </span>
    </div>
  );
}
