/* =================================================================
   SUBNEτ TERMINAL — GPU infrastructure source client
   Server-only. Cloud GPU pricing has no clean, free, public API the
   way TaoStats or HuggingFace do — the rates live behind per-provider
   scrapes and login walls. So this vertical runs on a researched
   seed for now, surfaced through the same {data, live} contract as
   every other source so a live scrape can drop in later untouched.
   ================================================================= */

import "server-only";
import { GPU_CHIPS, GPU_LISTINGS, CAPEX_SEED } from "@/data/seed/gpu";
import type { GpuChip, GpuListing, CapexEntry } from "@/lib/domain/gpu";

/** The accelerator catalogue — the silicon itself. */
export async function getChips(): Promise<{ data: GpuChip[]; live: boolean }> {
  return { data: GPU_CHIPS, live: false };
}

/** Rentable offers across the independent clouds + hyperscalers. */
export async function getListings(): Promise<{ data: GpuListing[]; live: boolean }> {
  return { data: GPU_LISTINGS, live: false };
}

/** Hyperscaler quarterly capex, straight from the earnings calls. */
export async function getCapex(): Promise<{ data: CapexEntry[]; live: boolean }> {
  return { data: CAPEX_SEED, live: false };
}
