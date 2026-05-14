/* =================================================================
   SUBNEτ TERMINAL — GPU infrastructure domain types
   The shapes the GPU vertical agrees on. Source clients (cloud
   pricing scrapes, earnings filings, seed) all normalize INTO these.
   ================================================================= */

export type GpuVendor = "nvidia" | "amd" | "google" | "aws";

/** A piece of accelerator silicon — the chip, not an offer. */
export interface GpuChip {
  /** slug id, e.g. "h100-sxm" */
  id: string;
  name: string;
  vendor: GpuVendor;
  /** HBM capacity, GB */
  vram: number;
  /** dense FP16/BF16 throughput, TFLOPS */
  fp16: number;
  /** memory bandwidth, GB/s */
  bandwidth: number;
  /** board power, watts */
  tdp: number;
  releaseYear: number;
}

/** One rentable offer — a chip, at a provider, in a region. */
export interface GpuListing {
  chipId: string;
  provider: string;
  region: string;
  /** $/GPU-hr, on-demand */
  onDemand: number;
  /** $/GPU-hr, spot / community tier (0 if not offered) */
  spot: number;
  /** rough availability, 0 scarce … 1 plentiful */
  availability: number;
}

/** A hyperscaler's capital-expenditure track. */
export interface CapexEntry {
  company: string;
  ticker: string;
  /** most recent quarter's capex, $B */
  latest: number;
  /** year-over-year change, % */
  yoy: number;
  /** trailing 8 quarters, $B, oldest → newest */
  trail: number[];
  /** label of the latest quarter, e.g. "Q1'26" */
  quarter: string;
}

export const VENDOR_ACCENT: Record<GpuVendor, string> = {
  nvidia: "#FF1E3C",
  amd: "#FF4D60",
  google: "#FF7A88",
  aws: "#FFB0BA",
};

export const VENDOR_LABEL: Record<GpuVendor, string> = {
  nvidia: "NVIDIA",
  amd: "AMD",
  google: "GOOGLE",
  aws: "AWS",
};

/** $/GPU-hr divided by FP16 TFLOPS — lower is more compute per dollar. */
export function dollarPerTflop(listing: GpuListing, chip: GpuChip): number {
  if (!chip.fp16) return 0;
  return (listing.onDemand / chip.fp16) * 1000;
}
