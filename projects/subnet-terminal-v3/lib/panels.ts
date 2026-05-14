/* =================================================================
   SUBNEτ TERMINAL — panel registry
   The twelve workstation panels: id, title, the vertical it belongs
   to (drives its accent), and its default position on the 12-column
   react-grid-layout grid. Phase 1 ships the registry + the grid
   shell; panels fill in over phases 2–6.
   ================================================================= */

export type Vertical = "bittensor" | "ai" | "gpu" | "power" | "editorial";

export const VERTICAL_ACCENT: Record<Vertical, string> = {
  bittensor: "var(--color-red)",
  ai: "var(--color-rose)",
  gpu: "var(--color-coral)",
  power: "var(--color-ember)",
  editorial: "var(--color-ink-2)",
};

export const VERTICAL_LABEL: Record<Vertical, string> = {
  bittensor: "BITTENSOR",
  ai: "OPEN-SOURCE AI",
  gpu: "GPU INFRA",
  power: "POWER",
  editorial: "EDITORIAL",
};

export interface PanelDef {
  id: string;
  /** function code, Bloomberg-style */
  code: string;
  title: string;
  vertical: Vertical;
  /** one-line statement of what the panel reveals */
  blurb: string;
  /** default grid box on a 12-col grid */
  layout: { x: number; y: number; w: number; h: number };
}

/* 12-column grid, row height ~ 30px. Twelve panels, 4 wide × 3 tall. */
export const PANELS: PanelDef[] = [
  { id: "tao-chart", code: "001", title: "τ/USD · CANDLES + OVERLAYS", vertical: "bittensor",
    blurb: "Price with emissions, validators, MCAP and halving overlays.",
    layout: { x: 0, y: 0, w: 6, h: 9 } },
  { id: "subnet-heat", code: "040", title: "SUBNET HEAT", vertical: "bittensor",
    blurb: "Every subnet sized by emissions, coloured by 24h alpha move.",
    layout: { x: 6, y: 0, w: 3, h: 9 } },
  { id: "subnet-board", code: "041", title: "SUBNET LEADERBOARD", vertical: "bittensor",
    blurb: "Sortable alpha price, momentum, emissions, validators, age.",
    layout: { x: 9, y: 0, w: 3, h: 9 } },
  { id: "validator-graph", code: "050", title: "VALIDATOR CONSTELLATION", vertical: "bittensor",
    blurb: "Force-directed delegation flows across the top validators.",
    layout: { x: 0, y: 9, w: 3, h: 8 } },
  { id: "consensus-pulse", code: "051", title: "CONSENSUS PULSE", vertical: "bittensor",
    blurb: "Per-subnet weight-distribution skew over recent epochs.",
    layout: { x: 3, y: 9, w: 3, h: 8 } },
  { id: "ai-wire", code: "060", title: "AI RELEASE WIRE", vertical: "ai",
    blurb: "HuggingFace, arXiv and GitHub signal in one chronological stream.",
    layout: { x: 6, y: 9, w: 3, h: 8 } },
  { id: "model-board", code: "061", title: "MODEL LEADERBOARD", vertical: "ai",
    blurb: "Top open models by weekly downloads + stars, with licences.",
    layout: { x: 9, y: 9, w: 3, h: 8 } },
  { id: "gpu-board", code: "070", title: "GPU PRICE BOARD", vertical: "gpu",
    blurb: "H100 · H200 · B200 · MI300X spot vs on-demand across clouds.",
    layout: { x: 0, y: 17, w: 4, h: 8 } },
  { id: "capex", code: "071", title: "HYPERSCALER CAPEX", vertical: "gpu",
    blurb: "Quarterly capex for MSFT, GOOG, META, AMZN, ORCL.",
    layout: { x: 4, y: 17, w: 3, h: 8 } },
  { id: "iso-map", code: "080", title: "ISO POWER MAP", vertical: "power",
    blurb: "Real-time LMPs across ERCOT, PJM, CAISO, MISO, NYISO, ISO-NE.",
    layout: { x: 7, y: 17, w: 3, h: 8 } },
  { id: "datacenter", code: "081", title: "DATACENTER BUILDOUT", vertical: "power",
    blurb: "Announced GW of capacity by region, operator, interconnect queue.",
    layout: { x: 10, y: 17, w: 2, h: 8 } },
  { id: "editorial", code: "900", title: "EDITORIAL", vertical: "editorial",
    blurb: "Long-form research from the desk — the magazine DNA.",
    layout: { x: 0, y: 25, w: 12, h: 6 } },
];

/** Layout preset → which panel ids lead. Drives the layout switcher. */
export const LAYOUT_PRESETS: Record<string, string[]> = {
  macro: PANELS.map((p) => p.id),
  subnets: ["tao-chart", "subnet-heat", "subnet-board", "validator-graph", "consensus-pulse"],
  gpu: ["gpu-board", "capex"],
  power: ["iso-map", "datacenter"],
  news: ["ai-wire", "model-board", "editorial"],
};
