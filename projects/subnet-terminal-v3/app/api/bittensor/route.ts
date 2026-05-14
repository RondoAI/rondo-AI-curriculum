/* =================================================================
   /api/bittensor — the Bittensor vertical's data, server-side.
   Holds the TaoStats key in process.env; clients fetch from here so
   the key never reaches the browser. Falls through to seed.
   ================================================================= */

import { NextResponse } from "next/server";
import {
  getNetwork,
  getSubnets,
  getValidators,
  getTaoCandles,
} from "@/lib/sources/taostats";

export const dynamic = "force-dynamic";

export async function GET() {
  const [network, subnets, validators, candles] = await Promise.all([
    getNetwork(),
    getSubnets(),
    getValidators(),
    getTaoCandles(),
  ]);
  return NextResponse.json(
    {
      network: network.data,
      subnets: subnets.data,
      validators: validators.data,
      candles: candles.data,
      live: {
        network: network.live,
        subnets: subnets.live,
        validators: validators.live,
        candles: candles.live,
      },
      asOf: Date.now(),
    },
    { headers: { "cache-control": "no-store" } }
  );
}
