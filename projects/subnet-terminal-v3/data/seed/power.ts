/* =================================================================
   SUBNEτ TERMINAL — Power infrastructure seed
   Realistic recent values (May 2026). The ISO real-time feeds (EIA,
   GridStatus, the operators themselves) sit behind free-but-keyed
   APIs, so this vertical runs on a researched seed: representative
   hub LMPs, system loads, generation mix, and the datacenter
   buildout pipeline. Wired against a live ISO feed in a later pass.
   ================================================================= */

import type {
  IsoSummary,
  IsoNode,
  DatacenterProject,
} from "@/lib/domain/power";

/* iso, name, load, peakLoad, avgLmp, chg24, renewablePct, x, y */
function iso(
  id: IsoSummary["iso"], name: string, load: number, peakLoad: number,
  avgLmp: number, chg24: number, renewablePct: number, x: number, y: number
): IsoSummary {
  return { iso: id, name, load, peakLoad, avgLmp, chg24, renewablePct, x, y };
}

export const ISO_SEED: IsoSummary[] = [
  iso("ERCOT", "Texas", 58_400, 85_500, 32.4, -4.1, 0.41, 0.46, 0.74),
  iso("PJM", "Mid-Atlantic", 96_200, 165_500, 41.8, 2.6, 0.13, 0.74, 0.40),
  iso("CAISO", "California", 28_900, 52_000, 54.2, 6.8, 0.49, 0.07, 0.50),
  iso("MISO", "Midcontinent", 74_600, 127_000, 36.1, -1.2, 0.26, 0.58, 0.38),
  iso("NYISO", "New York", 18_300, 32_100, 47.5, 3.4, 0.29, 0.83, 0.30),
  iso("ISONE", "New England", 13_100, 25_800, 44.9, 1.1, 0.34, 0.90, 0.24),
];

/* iso, name, lmp, dayAhead, load, chg24 */
function node(
  isoId: IsoNode["iso"], name: string, lmp: number,
  dayAhead: number, load: number, chg24: number
): IsoNode {
  return { iso: isoId, name, lmp, dayAhead, load, chg24 };
}

export const NODE_SEED: IsoNode[] = [
  /* ERCOT — cheap, the reason the buildout is going to Texas */
  node("ERCOT", "HB_WEST", 18.9, 21.4, 9_200, -8.2),
  node("ERCOT", "HB_NORTH", 31.2, 33.0, 22_400, -3.6),
  node("ERCOT", "HB_HOUSTON", 38.7, 40.1, 18_900, -1.4),
  node("ERCOT", "HB_SOUTH", 34.0, 35.8, 7_900, -2.9),
  /* PJM */
  node("PJM", "WESTERN HUB", 39.4, 41.0, 41_000, 1.8),
  node("PJM", "AEP-DAYTON", 37.1, 38.2, 14_600, 0.6),
  node("PJM", "DOMINION", 46.8, 48.5, 22_100, 4.9),
  node("PJM", "NI HUB", 42.0, 43.1, 18_500, 2.2),
  /* CAISO */
  node("CAISO", "SP15", 51.3, 53.0, 12_400, 5.1),
  node("CAISO", "NP15", 56.8, 58.9, 13_900, 7.4),
  node("CAISO", "ZP26", 54.1, 55.2, 2_600, 6.0),
  /* MISO */
  node("MISO", "INDIANA HUB", 35.2, 36.4, 21_000, -1.8),
  node("MISO", "MICHIGAN HUB", 38.9, 39.7, 16_200, -0.4),
  node("MISO", "ARKANSAS HUB", 33.0, 34.1, 11_400, -2.1),
  /* NYISO */
  node("NYISO", "ZONE J (NYC)", 58.2, 60.4, 6_900, 5.8),
  node("NYISO", "ZONE A (WEST)", 39.1, 40.0, 4_100, 1.2),
  node("NYISO", "ZONE F (CAPITAL)", 44.6, 45.9, 3_300, 2.7),
  /* ISO-NE */
  node("ISONE", "MASS HUB", 45.9, 47.2, 7_400, 1.4),
  node("ISONE", "CONNECTICUT", 47.3, 48.1, 3_800, 1.9),
  node("ISONE", "MAINE", 38.2, 39.0, 1_500, -0.6),
];

/* id, name, operator, region, iso, capacityMw, status, online */
function dc(
  id: string, name: string, operator: string, region: string,
  isoId: DatacenterProject["iso"], capacityMw: number,
  status: DatacenterProject["status"], online: number
): DatacenterProject {
  return { id, name, operator, region, iso: isoId, capacityMw, status, online };
}

export const DATACENTER_SEED: DatacenterProject[] = [
  dc("stargate-abilene", "Stargate Abilene", "OpenAI · Oracle", "Abilene, TX", "ERCOT", 1_200, "construction", 2026),
  dc("amazon-newcarlisle", "New Carlisle Campus", "Amazon", "New Carlisle, IN", "MISO", 2_250, "construction", 2027),
  dc("meta-richland", "Richland Parish", "Meta", "Richland, LA", "MISO", 2_000, "construction", 2028),
  dc("msft-mountpleasant", "Mount Pleasant", "Microsoft", "Mt Pleasant, WI", "MISO", 1_000, "construction", 2027),
  dc("xai-memphis", "Colossus 2", "xAI", "Memphis, TN", "MISO", 1_100, "construction", 2026),
  dc("google-redoak", "Red Oak", "Google", "Ellis County, TX", "ERCOT", 900, "permitting", 2027),
  dc("crusoe-abilene", "Lancium Clean Campus", "Crusoe · Lancium", "Abilene, TX", "ERCOT", 1_500, "construction", 2027),
  dc("qts-fayetteville", "Fayetteville", "QTS · Blackstone", "Fayetteville, GA", "PJM", 750, "operating", 2025),
  dc("aws-loudoun", "Loudoun Expansion", "Amazon", "Loudoun, VA", "PJM", 1_400, "queue", 2028),
  dc("vantage-frontier", "Frontier", "Vantage", "Shackelford, TX", "ERCOT", 1_400, "permitting", 2028),
  dc("msft-mtelliott", "Mount Elliott", "Microsoft", "Atlanta, GA", "PJM", 800, "construction", 2026),
  dc("meta-eagle", "Eagle Mountain", "Meta", "El Paso, TX", "ERCOT", 1_000, "permitting", 2028),
  dc("equinix-hillsboro", "Hillsboro Campus", "Equinix", "Hillsboro, OR", "CAISO", 400, "operating", 2025),
  dc("coreweave-kenilworth", "Kenilworth", "CoreWeave", "Kenilworth, NJ", "PJM", 600, "construction", 2026),
];
