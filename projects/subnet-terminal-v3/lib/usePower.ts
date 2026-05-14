"use client";

import { useEffect, useState } from "react";
import { ISO_SEED, NODE_SEED, DATACENTER_SEED } from "@/data/seed/power";
import type {
  IsoSummary,
  IsoNode,
  DatacenterProject,
} from "@/lib/domain/power";

export interface PowerData {
  isos: IsoSummary[];
  nodes: IsoNode[];
  datacenters: DatacenterProject[];
  live: { isos: boolean; nodes: boolean; datacenters: boolean };
  asOf: number;
}

const SEED: PowerData = {
  isos: ISO_SEED,
  nodes: NODE_SEED,
  datacenters: DATACENTER_SEED,
  live: { isos: false, nodes: false, datacenters: false },
  asOf: Date.now(),
};

/* module-level cache so all power panels share one /api/power fetch */
let shared: PowerData | null = null;
const waiters: Array<(d: PowerData) => void> = [];
let inflight = false;

/** Shared power data: every panel renders the seed instantly, then
    upgrades together when /api/power answers. Mirrors useBittensor. */
export function usePower(): PowerData {
  const [data, setData] = useState<PowerData>(shared ?? SEED);

  useEffect(() => {
    if (shared) {
      setData(shared);
      return;
    }
    waiters.push(setData);
    if (!inflight) {
      inflight = true;
      fetch("/api/power")
        .then((r) => r.json())
        .then((d: PowerData) => {
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
