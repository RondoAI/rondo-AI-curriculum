"use client";

import { useEffect, useState } from "react";
import { GPU_CHIPS, GPU_LISTINGS, CAPEX_SEED } from "@/data/seed/gpu";
import type { GpuChip, GpuListing, CapexEntry } from "@/lib/domain/gpu";

export interface GpuData {
  chips: GpuChip[];
  listings: GpuListing[];
  capex: CapexEntry[];
  live: { chips: boolean; listings: boolean; capex: boolean };
  asOf: number;
}

const SEED: GpuData = {
  chips: GPU_CHIPS,
  listings: GPU_LISTINGS,
  capex: CAPEX_SEED,
  live: { chips: false, listings: false, capex: false },
  asOf: Date.now(),
};

/* module-level cache so all GPU panels share one /api/gpu fetch */
let shared: GpuData | null = null;
const waiters: Array<(d: GpuData) => void> = [];
let inflight = false;

/** Shared GPU data: every panel renders the seed instantly, then
    upgrades together when /api/gpu answers. Mirrors useBittensor. */
export function useGpu(): GpuData {
  const [data, setData] = useState<GpuData>(shared ?? SEED);

  useEffect(() => {
    if (shared) {
      setData(shared);
      return;
    }
    waiters.push(setData);
    if (!inflight) {
      inflight = true;
      fetch("/api/gpu")
        .then((r) => r.json())
        .then((d: GpuData) => {
          shared = d;
          waiters.splice(0).forEach((fn) => fn(d));
        })
        .catch(() => {
          waiters.splice(0).forEach((fn) => fn(SEED));
        });
    }
    return () => {
      const i = waiters.indexOf(setData);
      if (i >= 0) waiters.splice(i, 1);
    };
  }, []);

  return data;
}
