/* =================================================================
   SUBNEτ TERMINAL — Bittensor seed
   Realistic recent values (May 2026). Renders whenever the live
   TaoStats client has no key or can't be reached — panels are
   never empty. Replaced row-for-row by live data when available.
   ================================================================= */

import type {
  Subnet,
  Validator,
  NetworkStat,
  Candle,
} from "@/lib/domain/bittensor";

export const NETWORK_SEED: NetworkStat = {
  taoPrice: 300.94,
  taoChg24: 0.58,
  marketCap: 3.29e9,
  emission: 7200,
  totalStaked: 6.24e6,
  stakedPct: 63,
  blockHeight: 8_180_082,
  activeSubnets: 92,
  activeValidators: 6184,
  activeMiners: 32_850,
};

/* netuid, name, owner, category, alphaPrice, mcap, emission, share%,
   miners, validators, regCost, ageDays, chg24, chg7, chg30, gini */
export const SUBNET_SEED: Subnet[] = [
  s(64, "Chutes", "Rayon Labs", "compute", 0.0421, 41.0e6, 612, 8.5, 1840, 64, 1.9, 410, 6.4, 11.2, 18.4, 0.34),
  s(4, "Targon", "Manifold Labs", "inference", 0.0388, 33.4e6, 488, 6.8, 1220, 58, 1.4, 690, -2.1, 4.0, 9.1, 0.41),
  s(1, "Apex", "Macrocosmos", "text", 0.0512, 38.6e6, 372, 5.2, 940, 64, 2.6, 720, 3.7, 6.1, 14.5, 0.29),
  s(51, "Celium", "Datura", "compute", 0.0297, 21.7e6, 296, 4.1, 760, 51, 1.2, 280, 1.2, 2.4, 7.7, 0.38),
  s(9, "Pretraining", "Macrocosmos", "training", 0.0644, 52.1e6, 354, 4.9, 410, 48, 3.1, 880, -0.9, 1.8, 11.0, 0.52),
  s(8, "PTN", "Taoshi", "finance", 0.0233, 9.4e6, 188, 2.6, 144, 36, 1.0, 760, 4.8, 7.3, -3.2, 0.61),
  s(56, "Gradients", "Rayon Labs", "training", 0.0181, 14.2e6, 242, 3.4, 520, 42, 1.5, 210, 9.1, 14.8, 22.6, 0.44),
  s(5, "OpenKaito", "Kaito", "data", 0.0274, 18.9e6, 210, 2.9, 680, 44, 1.3, 540, -1.6, 3.2, 6.4, 0.36),
  s(18, "Cortex.t", "Corcel", "inference", 0.0356, 24.8e6, 268, 3.7, 980, 56, 1.6, 600, 2.2, 5.0, 8.8, 0.33),
  s(6, "Nous", "Nous Research", "text", 0.0419, 27.6e6, 198, 2.8, 320, 38, 1.8, 700, -0.4, 2.1, 4.9, 0.47),
  s(68, "Metanova", "Metanova Labs", "science", 0.0156, 11.2e6, 164, 2.3, 240, 32, 0.9, 220, 2.4, 8.1, 13.7, 0.55),
  s(75, "Hippius", "Hippius", "data", 0.0142, 8.6e6, 132, 1.8, 300, 30, 0.8, 175, 5.5, 10.4, 16.2, 0.49),
  s(19, "Vision", "Inference Labs", "vision", 0.0227, 13.4e6, 176, 2.4, 540, 40, 1.1, 580, -2.8, -1.0, 3.3, 0.40),
  s(27, "Compute", "Neural Internet", "compute", 0.0312, 19.8e6, 214, 3.0, 410, 36, 1.4, 760, 1.0, 4.4, 9.6, 0.42),
  s(13, "Dataverse", "Macrocosmos", "data", 0.0188, 10.1e6, 142, 2.0, 360, 34, 1.0, 540, 0.6, 2.8, 5.1, 0.43),
  s(11, "Dippy", "Dippy AI", "text", 0.0167, 7.9e6, 118, 1.6, 280, 28, 0.9, 620, 3.0, 6.7, -1.4, 0.58),
  s(21, "Storb", "Storb", "data", 0.0131, 6.2e6, 96, 1.3, 220, 26, 0.7, 190, 4.1, 9.0, 12.8, 0.51),
  s(23, "NicheImage", "Toilaluan", "vision", 0.0204, 11.8e6, 138, 1.9, 470, 38, 1.0, 510, -1.2, 1.6, 4.0, 0.39),
  s(25, "Protein", "Macrocosmos", "science", 0.0173, 9.7e6, 124, 1.7, 190, 24, 0.9, 480, 1.8, 5.5, 10.1, 0.53),
  s(77, "Liquidity", "Taoshi", "finance", 0.0119, 5.4e6, 84, 1.2, 130, 22, 0.6, 150, 6.8, 13.1, 19.0, 0.62),
  s(3, "MyShell", "MyShell", "text", 0.0241, 14.9e6, 156, 2.2, 420, 40, 1.2, 660, -0.7, 2.0, 6.3, 0.37),
  s(48, "NextPlace", "NextPlace", "finance", 0.0098, 4.1e6, 68, 0.9, 110, 20, 0.5, 240, 2.9, 7.8, 11.4, 0.59),
];

function s(
  netuid: number, name: string, owner: string,
  category: Subnet["category"],
  alphaPrice: number, marketCap: number, emission: number,
  emissionShare: number, miners: number, validators: number,
  regCost: number, ageDays: number,
  chg24: number, chg7: number, chg30: number, gini: number
): Subnet {
  return { netuid, name, owner, category, alphaPrice, marketCap, emission,
    emissionShare, miners, validators, regCost, ageDays, chg24, chg7, chg30, gini };
}

/* hotkey(masked), name, stake, ownStake, nominators, dominance%,
   take%, apr%, subnets[], stakeChg24 */
export const VALIDATOR_SEED: Validator[] = [
  v("5F4tQyW…root", "Opentensor Foundation", 286_400, 142_000, 1240, 13.4, 9.0, 13.4, [0,1,4,9,64], 1820),
  v("5DAAnrj…PtVP", "Datura", 128_600, 38_200, 842, 14.2, 9.0, 14.2, [4,51,18,1,64], -1240),
  v("5HEo565…Wkt8", "Polychain Capital", 118_200, 71_000, 412, 11.8, 12.0, 11.8, [1,9,5,8], 980),
  v("5Hddm3i…TAOY", "TAOYNO", 104_800, 22_400, 1080, 14.6, 7.0, 14.6, [4,1,18,64,56], 2140),
  v("5GcW21t…R21x", "RoundTable21", 92_400, 41_800, 218, 11.4, 14.0, 11.4, [1,9,68], 410),
  v("5CXRfP2…Crcb", "Crucible Capital", 86_100, 33_900, 124, 11.2, 13.0, 11.2, [4,5,8], -260),
  v("5Yuma9G…ymG0", "Yuma Group", 78_900, 52_000, 298, 13.0, 10.0, 13.0, [1,4,9,64], 720),
  v("5MaCrco…sm0s", "Macrocosmos", 72_600, 60_100, 512, 14.0, 8.0, 14.0, [1,9,13,25], 1310),
  v("5RaYon1…Labs", "Rayon Labs", 64_200, 48_700, 466, 13.8, 8.5, 13.8, [64,56], 1880),
  v("5C0rce1…rcel", "Corcel", 58_400, 26_300, 312, 13.6, 11.0, 13.6, [18,4,1], -180),
  v("5Ta0sh1…shi0", "Taoshi", 51_900, 39_400, 188, 12.8, 12.0, 12.8, [8,77], 340),
  v("5N0us00…0us0", "Nous Research", 44_200, 31_000, 142, 11.9, 13.0, 11.9, [6,1], 90),
  v("5F1rst0…nsor", "FirstTensor", 39_700, 14_200, 904, 14.4, 6.0, 14.4, [4,64,18,1], 1560),
  v("5Tao00m…0com", "Tao.com", 36_100, 18_900, 388, 13.2, 10.5, 13.2, [1,9,5], 220),
  v("5F0undr…ndry", "Foundry", 31_400, 20_100, 96, 11.0, 14.5, 11.0, [9,1], -410),
];

function v(
  hotkey: string, name: string, stake: number, ownStake: number,
  nominators: number, dominance: number, take: number, apr: number,
  subnets: number[], stakeChg24: number
): Validator {
  return { hotkey, name, stake, ownStake, nominators, dominance, take, apr, subnets, stakeChg24 };
}

/** Deterministic ~180-day τ/USD candle history, reverse-engineered
    from the current price so the overlays have something real to
    ride. Seeded RNG → stable across reloads. */
export function taoCandles(days = 180): Candle[] {
  let seed = 0x5bd7a3 >>> 0;
  const rng = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 0xffffffff);
  const today = Date.now();
  const dayMs = 86_400_000;
  const end = NETWORK_SEED.taoPrice;
  const start = end / 8.5; // ~+750% over the window
  const out: Candle[] = [];
  let c = start;
  for (let i = days - 1; i >= 0; i--) {
    const u = (days - 1 - i) / (days - 1);
    const eased = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    const base = start + (end - start) * eased;
    const drift = (rng() - 0.48) * base * 0.06;
    const o = c;
    c = Math.max(1, base + drift);
    const hi = Math.max(o, c) * (1 + rng() * 0.04);
    const lo = Math.min(o, c) * (1 - rng() * 0.04);
    out.push({
      t: today - i * dayMs,
      o, h: hi, l: lo, c,
      emission: 7200,
      validators: Math.round(4200 + u * 1984 + (rng() - 0.5) * 120),
    });
  }
  return out;
}
