/* =================================================================
   SUBNEτ TERMINAL — GPU infrastructure seed
   Realistic recent values (May 2026). Cloud GPU pricing has no clean
   public API the way TaoStats or HuggingFace do, so this vertical
   runs on a researched seed: street-level on-demand / spot rates
   across the independent clouds, and hyperscaler capex straight from
   the earnings calls. Wired against a live scrape in a later pass.
   ================================================================= */

import type { GpuChip, GpuListing, CapexEntry } from "@/lib/domain/gpu";

export const GPU_CHIPS: GpuChip[] = [
  { id: "b200", name: "B200", vendor: "nvidia", vram: 192, fp16: 2250, bandwidth: 8000, tdp: 1000, releaseYear: 2025 },
  { id: "gb200", name: "GB200", vendor: "nvidia", vram: 384, fp16: 5000, bandwidth: 16000, tdp: 2700, releaseYear: 2025 },
  { id: "h200", name: "H200 SXM", vendor: "nvidia", vram: 141, fp16: 989, bandwidth: 4800, tdp: 700, releaseYear: 2024 },
  { id: "h100-sxm", name: "H100 SXM", vendor: "nvidia", vram: 80, fp16: 989, bandwidth: 3350, tdp: 700, releaseYear: 2023 },
  { id: "h100-pcie", name: "H100 PCIe", vendor: "nvidia", vram: 80, fp16: 756, bandwidth: 2000, tdp: 350, releaseYear: 2023 },
  { id: "a100-80", name: "A100 80G", vendor: "nvidia", vram: 80, fp16: 312, bandwidth: 2039, tdp: 400, releaseYear: 2020 },
  { id: "l40s", name: "L40S", vendor: "nvidia", vram: 48, fp16: 362, bandwidth: 864, tdp: 350, releaseYear: 2023 },
  { id: "mi300x", name: "MI300X", vendor: "amd", vram: 192, fp16: 1307, bandwidth: 5300, tdp: 750, releaseYear: 2023 },
  { id: "mi325x", name: "MI325X", vendor: "amd", vram: 256, fp16: 1307, bandwidth: 6000, tdp: 1000, releaseYear: 2025 },
  { id: "tpu-v6e", name: "TPU v6e", vendor: "google", vram: 32, fp16: 918, bandwidth: 1640, tdp: 400, releaseYear: 2024 },
  { id: "trainium2", name: "Trainium2", vendor: "aws", vram: 96, fp16: 667, bandwidth: 2900, tdp: 500, releaseYear: 2024 },
];

/* chipId, provider, region, onDemand, spot, availability */
function l(
  chipId: string, provider: string, region: string,
  onDemand: number, spot: number, availability: number
): GpuListing {
  return { chipId, provider, region, onDemand, spot, availability };
}

export const GPU_LISTINGS: GpuListing[] = [
  /* B200 — newest, scarce, premium */
  l("b200", "CoreWeave", "US-East", 5.99, 4.20, 0.18),
  l("b200", "Lambda", "US-West", 5.49, 0, 0.12),
  l("b200", "Crusoe", "US-Central", 5.75, 3.95, 0.22),
  l("b200", "Nebius", "EU-North", 5.40, 3.80, 0.30),
  /* GB200 — rack-scale, basically allocation-only */
  l("gb200", "CoreWeave", "US-East", 7.20, 0, 0.08),
  l("gb200", "Crusoe", "US-Central", 6.95, 0, 0.10),
  /* H200 */
  l("h200", "Lambda", "US-West", 3.79, 0, 0.34),
  l("h200", "CoreWeave", "US-East", 3.99, 2.75, 0.40),
  l("h200", "RunPod", "US-East", 3.59, 2.49, 0.55),
  l("h200", "Vast.ai", "Global", 2.95, 1.89, 0.62),
  l("h200", "Nebius", "EU-North", 3.50, 2.40, 0.48),
  /* H100 SXM — the workhorse, deeply liquid now */
  l("h100-sxm", "Lambda", "US-West", 2.49, 0, 0.66),
  l("h100-sxm", "CoreWeave", "US-East", 2.69, 1.85, 0.60),
  l("h100-sxm", "RunPod", "US-East", 2.39, 1.59, 0.74),
  l("h100-sxm", "Vast.ai", "Global", 1.85, 1.18, 0.81),
  l("h100-sxm", "AWS", "us-east-1", 4.10, 2.10, 0.52),
  l("h100-sxm", "Crusoe", "US-Central", 2.45, 1.65, 0.70),
  /* H100 PCIe */
  l("h100-pcie", "RunPod", "US-East", 1.99, 1.29, 0.78),
  l("h100-pcie", "Vast.ai", "Global", 1.55, 0.95, 0.85),
  l("h100-pcie", "Lambda", "US-West", 2.09, 0, 0.72),
  /* A100 80G — cheap and everywhere */
  l("a100-80", "RunPod", "US-East", 1.19, 0.79, 0.88),
  l("a100-80", "Vast.ai", "Global", 0.85, 0.55, 0.92),
  l("a100-80", "Lambda", "US-West", 1.29, 0, 0.84),
  l("a100-80", "AWS", "us-east-1", 2.45, 1.10, 0.70),
  /* L40S — inference-class */
  l("l40s", "RunPod", "US-East", 0.89, 0.59, 0.90),
  l("l40s", "Vast.ai", "Global", 0.69, 0.42, 0.94),
  /* MI300X — AMD's liquidity is improving */
  l("mi300x", "TensorWave", "US-Central", 2.49, 1.69, 0.58),
  l("mi300x", "RunPod", "US-East", 2.69, 1.79, 0.50),
  l("mi300x", "Vast.ai", "Global", 2.15, 1.40, 0.64),
  /* MI325X */
  l("mi325x", "TensorWave", "US-Central", 3.49, 2.35, 0.30),
  /* TPU v6e — GCP only */
  l("tpu-v6e", "Google Cloud", "us-central1", 2.70, 1.35, 0.56),
  /* Trainium2 — AWS only */
  l("trainium2", "AWS", "us-east-1", 1.34, 0.65, 0.68),
];

/* company, ticker, latest($B), yoy(%), quarter, trailing 8 quarters $B */
function c(
  company: string, ticker: string, latest: number, yoy: number,
  quarter: string, trail: number[]
): CapexEntry {
  return { company, ticker, latest, yoy, quarter, trail };
}

export const CAPEX_SEED: CapexEntry[] = [
  c("Microsoft", "MSFT", 38.4, 71, "Q1'26", [13.9, 14.4, 15.8, 19.0, 22.6, 28.2, 33.7, 38.4]),
  c("Amazon", "AMZN", 34.2, 64, "Q1'26", [14.2, 16.4, 17.6, 22.6, 26.3, 27.8, 31.4, 34.2]),
  c("Alphabet", "GOOGL", 25.1, 58, "Q1'26", [11.0, 12.0, 13.1, 14.3, 17.2, 19.5, 22.4, 25.1]),
  c("Meta", "META", 22.8, 79, "Q1'26", [6.4, 8.2, 9.2, 14.4, 16.4, 19.2, 21.0, 22.8]),
  c("Oracle", "ORCL", 9.6, 142, "Q3'26", [2.2, 2.8, 3.4, 4.0, 5.4, 6.8, 8.1, 9.6]),
];
