/* =================================================================
   SUBNEτ TERMINAL — Power infrastructure source client
   Server-only. The ISO real-time feeds (EIA, GridStatus, the
   operators) sit behind free-but-keyed APIs, so this vertical runs
   on a researched seed for now — surfaced through the same
   {data, live} contract as every other source so a live ISO feed
   can drop in later untouched.
   ================================================================= */

import "server-only";
import { ISO_SEED, NODE_SEED, DATACENTER_SEED } from "@/data/seed/power";
import type {
  IsoSummary,
  IsoNode,
  DatacenterProject,
} from "@/lib/domain/power";

/** System-wide snapshot for each grid operator. */
export async function getIsos(): Promise<{ data: IsoSummary[]; live: boolean }> {
  return { data: ISO_SEED, live: false };
}

/** Priced hub / zone nodes across all ISOs. */
export async function getNodes(): Promise<{ data: IsoNode[]; live: boolean }> {
  return { data: NODE_SEED, live: false };
}

/** The datacenter buildout pipeline — announced through operating. */
export async function getDatacenters(): Promise<{
  data: DatacenterProject[];
  live: boolean;
}> {
  return { data: DATACENTER_SEED, live: false };
}
