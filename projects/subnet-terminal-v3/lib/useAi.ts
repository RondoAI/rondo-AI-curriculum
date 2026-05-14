"use client";

import { useEffect, useState } from "react";
import { MODEL_SEED, WIRE_SEED } from "@/data/seed/ai";
import type { ModelEntry, WireItem } from "@/lib/domain/ai";

export interface AiData {
  models: ModelEntry[];
  wire: WireItem[];
  live: { models: boolean; wire: boolean };
  asOf: number;
}

const SEED: AiData = {
  models: MODEL_SEED,
  wire: WIRE_SEED,
  live: { models: false, wire: false },
  asOf: Date.now(),
};

/* module-level cache so all AI panels share one /api/ai fetch */
let shared: AiData | null = null;
const waiters: Array<(d: AiData) => void> = [];
let inflight = false;

/** Shared AI data: every panel renders the seed instantly, then
    upgrades together when /api/ai answers. Mirrors useBittensor. */
export function useAi(): AiData {
  const [data, setData] = useState<AiData>(shared ?? SEED);

  useEffect(() => {
    if (shared) {
      setData(shared);
      return;
    }
    waiters.push(setData);
    if (!inflight) {
      inflight = true;
      fetch("/api/ai")
        .then((r) => r.json())
        .then((d: AiData) => {
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
