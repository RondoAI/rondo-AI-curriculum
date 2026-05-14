/* =================================================================
   SUBNEτ TERMINAL — Bittensor domain types
   The shapes the whole Bittensor vertical agrees on. Source clients
   (taostats, RPC, seed) all normalize INTO these.
   ================================================================= */

export type SubnetCategory =
  | "inference"
  | "compute"
  | "training"
  | "data"
  | "text"
  | "vision"
  | "science"
  | "finance"
  | "other";

export interface Subnet {
  netuid: number;
  name: string;
  /** short owner / team label */
  owner: string;
  category: SubnetCategory;
  /** α-token price in USD */
  alphaPrice: number;
  /** α market cap in USD */
  marketCap: number;
  /** τ emitted to this subnet per 24h */
  emission: number;
  /** % of total network emission */
  emissionShare: number;
  /** active miner count */
  miners: number;
  /** active validator count */
  validators: number;
  /** registration / lock cost in τ */
  regCost: number;
  /** age in days since registration */
  ageDays: number;
  chg24: number;
  chg7: number;
  chg30: number;
  /** consensus weight Gini (0 even … 1 skewed) */
  gini: number;
}

export interface Validator {
  hotkey: string;
  name: string;
  /** τ delegated to the hotkey */
  stake: number;
  /** τ the operator itself owns */
  ownStake: number;
  nominators: number;
  /** network stake dominance % */
  dominance: number;
  /** validator take % */
  take: number;
  /** trailing-30d nominator APR % */
  apr: number;
  /** subnets this hotkey validates on */
  subnets: number[];
  /** 24h stake change in τ */
  stakeChg24: number;
}

export interface NetworkStat {
  taoPrice: number;
  taoChg24: number;
  marketCap: number;
  /** τ minted per 24h, network-wide */
  emission: number;
  totalStaked: number;
  stakedPct: number;
  blockHeight: number;
  activeSubnets: number;
  activeValidators: number;
  activeMiners: number;
}

/** One OHLC candle for the τ/USD chart. */
export interface Candle {
  /** unix ms */
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  /** τ emitted that period — drives the overlay */
  emission: number;
  validators: number;
}

export const CATEGORY_ACCENT: Record<SubnetCategory, string> = {
  inference: "#FF1E3C",
  compute: "#FF4D60",
  training: "#FF7A88",
  data: "#FF8C42",
  text: "#FF7A88",
  vision: "#FFB0BA",
  science: "#C84368",
  finance: "#FF8C42",
  other: "#C8A8AD",
};
