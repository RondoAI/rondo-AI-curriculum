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
  operating: "#84CC16",
  construction: "#B7E04A",
  permitting: "#5C7A1E",
  queue: "#3F5214",
};

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  operating: "ONLINE",
  construction: "BUILDING",
  permitting: "PERMITTING",
  queue: "QUEUE",
};

/** LMP → colour. Cheap power is lime, scarce power is hot. The whole
    point of the vertical: where is power cheap enough to compute. */
export function lmpColor(lmp: number): string {
  if (lmp < 25) return "#84CC16";
  if (lmp < 45) return "#B7E04A";
  if (lmp < 70) return "#FFB000";
  if (lmp < 110) return "#FF8C42";
  return "#FF7A88";
}
