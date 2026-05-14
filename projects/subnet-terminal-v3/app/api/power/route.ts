/* =================================================================
   /api/power — the Power infrastructure vertical's data, server-side.
   Seed-backed for now (the ISO feeds need free-but-keyed access),
   served through the same route + {live} contract as the rest so a
   live ISO feed can slot in without touching the client.
   ================================================================= */

import { NextResponse } from "next/server";
import { getIsos, getNodes, getDatacenters } from "@/lib/sources/power";

export const dynamic = "force-dynamic";

export async function GET() {
  const [isos, nodes, datacenters] = await Promise.all([
    getIsos(),
    getNodes(),
    getDatacenters(),
  ]);
  return NextResponse.json(
    {
      isos: isos.data,
      nodes: nodes.data,
      datacenters: datacenters.data,
      live: {
        isos: isos.live,
        nodes: nodes.live,
        datacenters: datacenters.live,
      },
      asOf: Date.now(),
    },
    { headers: { "cache-control": "no-store" } }
  );
}
