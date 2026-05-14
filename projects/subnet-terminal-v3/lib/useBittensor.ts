"use client";

import { useEffect, useState } from "react";
import {
  NETWORK_SEED,
  SUBNET_SEED,
  VALIDATOR_SEED,
  taoCandles,
} from "@/data/seed/bittensor";
import type {
  NetworkStat,
  Subnet,
  Validator,
  Candle,
} from "@/lib/domain/bittensor";

export interface BittensorData {
  network: NetworkStat;
  subnets: Subnet[];
  validators: Validator[];
  candles: Candle[];
  live: {
    network: boolean;
    subnets: boolean;
    validators: boolean;
    candles: boolean;
  };
  asOf: number;
}

const SEED: BittensorData = {
  network: NETWORK_SEED,
  subnets: SUBNET_SEED,
  validators: VALIDATOR_SEED,
  candles: taoCandles(180),
  live: { network: false, subnets: false, validators: false, candles: false },
  asOf: Date.now(),
};

/* module-level cache so all panels share one /api/bittensor fetch */
let shared: BittensorData | null = null;
const waiters: Array<(d: BittensorData) => void> = [];
let inflight = false;

/** Shared Bittensor data: every panel renders the seed instantly,
    then upgrades together when /api/bittensor answers. */
export function useBittensor(): BittensorData {
  const [data, setData] = useState<BittensorData>(shared ?? SEED);

  useEffect(() => {
    if (shared) {
      setData(shared);
      return;
    }
    waiters.push(setData);
    if (!inflight) {
      inflight = true;
      fetch("/api/bittensor")
        .then((r) => r.json())
        .then((d: BittensorData) => {
          shared = d;
          waiters.splice(0).forEach((fn) => fn(d));
        })
        .catch(() => {
          /* keep the seed — never empty */
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
