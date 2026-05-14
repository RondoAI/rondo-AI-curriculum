/* =================================================================
   /api/gpu — the GPU infrastructure vertical's data, server-side.
   Seed-backed for now (no clean public pricing API), but served
   through the same route + {live} contract as the rest so a live
   scrape can slot in without touching the client.
   ================================================================= */

import { NextResponse } from "next/server";
import { getChips, getListings, getCapex } from "@/lib/sources/gpu";

export const dynamic = "force-dynamic";

export async function GET() {
  const [chips, listings, capex] = await Promise.all([
    getChips(),
    getListings(),
    getCapex(),
  ]);
  return NextResponse.json(
    {
      chips: chips.data,
      listings: listings.data,
      capex: capex.data,
      live: { chips: chips.live, listings: listings.live, capex: capex.live },
      asOf: Date.now(),
    },
    { headers: { "cache-control": "no-store" } }
  );
}
