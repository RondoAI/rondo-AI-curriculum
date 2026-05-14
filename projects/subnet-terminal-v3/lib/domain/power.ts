/* =================================================================
   SUBNEτ TERMINAL — Power infrastructure domain types
   The shapes the Power vertical agrees on. Source clients (EIA,
   GridStatus, ISO feeds, seed) all normalize INTO these. Power is
   the binding constraint on the whole AI buildout — this vertical
   is the constraint made legible.
   ================================================================= */

export type IsoId = "ERCOT" | "PJM" | "CAISO" | "MISO" | "NYISO" | "ISONE";

/** A grid operator, system-wide snapshot. */
export interface IsoSummary {
  iso: IsoId;
  name: string;
  /** system load right now, MW */
  load: number;
  /** seasonal peak load, MW */
  peakLoad: number;
  /** load-weighted average hub LMP, $/MWh */
  avgLmp: number;
  /** 24h change in average LMP, % */
  chg24: number;
  /** share of generation from renewables, 0..1 */
  renewablePct: number;
  /** stylized US-map position, 0..1 within the panel box */
  x: number;
  y: number;
}

/** A priced node — a hub or zone inside an ISO. */
export interface IsoNode {
  iso: IsoId;
  name: string;
  /** real-time locational marginal price, $/MWh */
  lmp: number;
  /** day-ahead LMP, $/MWh */
  dayAhead: number;
  /** zonal load, MW */
  load: number;
  /** 24h change in LMP, % */
  chg24: number;
}

export type ProjectStatus = "operating" | "construction" | "permitting" | "queue";

/** An announced or in-flight datacenter campus. */
export interface DatacenterProject {
  id: string;
  name: string;
  operator: string;
  region: string;
  iso: IsoId;
  /** announced capacity, MW */
  capacityMw: number;
  status: ProjectStatus;
  /** target online year */
  online: number;
}

export const STATUS_ACCENT: Record<ProjectStatus, string> = {
  operating: "#FF1E3C",
  construction: "#C11128",
  permitting: "#8B0F20",
  queue: "#4A2A30",
};

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  operating: "ONLINE",
  construction: "BUILDING",
  permitting: "PERMITTING",
  queue: "QUEUE",
};

/** LMP → colour. Cheap power is mint, scarce power is hot red — the
    same up/down semantics the rest of the terminal scans by. The
    whole point of the vertical: where is power cheap enough to
    compute. */
export function lmpColor(lmp: number): string {
  if (lmp < 25) return "#00E5A8";
  if (lmp < 45) return "#FFB0BA";
  if (lmp < 70) return "#FF7A88";
  if (lmp < 110) return "#FF4D60";
  return "#FF1E3C";
}
