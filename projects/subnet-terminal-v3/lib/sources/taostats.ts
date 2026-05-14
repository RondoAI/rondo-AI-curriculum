/* =================================================================
   SUBNEτ TERMINAL — TaoStats source client
   Server-only. Typed, cached, retried. The API key lives in
   process.env.TAOSTATS_API_KEY (never the client, never the repo);
   without it — or on any failure — every call falls back to the
   seed so panels are never empty.
   ================================================================= */

import "server-only";
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

const KEY = process.env.TAOSTATS_API_KEY;
const BASE = "https://api.taostats.io/api";

/* tiny in-memory TTL cache — one process, fine for a research desk */
type Entry = { value: unknown; exp: number };
const cache = new Map<string, Entry>();

async function fetchJSON(path: string, ttlMs: number): Promise<unknown> {
  const hit = cache.get(path);
  if (hit && hit.exp > Date.now()) return hit.value;
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(BASE + path, {
        signal: ctrl.signal,
        headers: { Authorization: KEY as string },
        cache: "no-store",
      });
      clearTimeout(to);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      cache.set(path, { value: json, exp: Date.now() + ttlMs });
      return json;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  throw lastErr;
}

const num = (v: unknown, fb = 0) =>
  v == null || v === "" || isNaN(Number(v)) ? fb : Number(v);

/** taostats reports apr inconsistently — sometimes a fraction
    (0.17), sometimes already a percent. Normalise, then clamp the
    obvious bad-data outliers off tiny hotkeys. */
function normApr(raw: number): number {
  const p = raw > 2 ? raw : raw * 100;
  return Math.min(p, 250);
}

/** Whether the live source is configured at all. */
export const taostatsLive = Boolean(KEY);

/** Network-wide stats. taostats /price/latest covers the market
    side; chain-level counts stay on seed until wired. */
export async function getNetwork(): Promise<{ data: NetworkStat; live: boolean }> {
  if (!KEY) return { data: NETWORK_SEED, live: false };
  try {
    const raw = (await fetchJSON("/price/latest/v1?asset=tao", 45_000)) as {
      data?: Array<Record<string, unknown>>;
    };
    const d = raw.data?.[0];
    if (!d) throw new Error("empty");
    return {
      data: {
        ...NETWORK_SEED,
        taoPrice: num(d.price, NETWORK_SEED.taoPrice),
        taoChg24: num(d.percent_change_24h, NETWORK_SEED.taoChg24),
        marketCap: num(d.market_cap, NETWORK_SEED.marketCap),
      },
      live: true,
    };
  } catch {
    return { data: NETWORK_SEED, live: false };
  }
}

/** Validator leaderboard — taostats exposes this richly. */
export async function getValidators(): Promise<{ data: Validator[]; live: boolean }> {
  if (!KEY) return { data: VALIDATOR_SEED, live: false };
  try {
    const raw = (await fetchJSON(
      "/validator/latest/v1?limit=100&order=rank_asc",
      120_000
    )) as { data?: Array<Record<string, unknown>> };
    const rows = raw.data;
    if (!Array.isArray(rows) || !rows.length) throw new Error("empty");
    const RAO = 1e9;
    return {
      data: rows.map((r) => {
        const hk = (r.hotkey as { ss58?: string })?.ss58 ?? "";
        return {
          hotkey: hk ? `${hk.slice(0, 6)}…${hk.slice(-4)}` : "—",
          name: (r.name as string) || (hk ? hk.slice(0, 8) + "…" : "Unknown"),
          stake: num(r.stake) / RAO,
          ownStake: num(r.validator_stake) / RAO,
          nominators: num(r.nominators),
          dominance: num(r.dominance),
          take: num(r.take) * 100,
          apr: normApr(num(r.apr)),
          subnets: Array.isArray(r.registrations) ? (r.registrations as number[]) : [],
          stakeChg24: num(r.stake_24_hr_change) / RAO,
        };
      }),
      live: true,
    };
  } catch {
    return { data: VALIDATOR_SEED, live: false };
  }
}

/** Subnet table. taostats' subnet endpoint carries consensus params
    but not α-market data, so the rich market view stays on seed for
    now — wired against the market endpoint in a later pass. */
export async function getSubnets(): Promise<{ data: Subnet[]; live: boolean }> {
  return { data: SUBNET_SEED, live: false };
}

/** τ/USD candles — seed history until a price-history endpoint is wired. */
export async function getTaoCandles(): Promise<{ data: Candle[]; live: boolean }> {
  return { data: taoCandles(180), live: false };
}
