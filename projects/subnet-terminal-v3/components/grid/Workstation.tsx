"use client";

import { useEffect, useMemo, useState } from "react";
// v2 ships a legacy wrapper with the stable v1 API (WidthProvider etc.).
// The legacy package types name things differently from @types/react-grid-layout,
// so we keep our own item type and treat the wrapped component loosely.
import GridLayout, { WidthProvider } from "react-grid-layout/legacy";
import { PANELS, LAYOUT_PRESETS } from "@/lib/panels";
import { Panel } from "@/components/grid/Panel";
import { PANEL_CONTENT } from "@/components/panels/registry";
import type { Preset } from "@/components/chrome/TopChrome";

type GItem = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Grid = WidthProvider(GridLayout) as unknown as React.ComponentType<any>;

const LS_KEY = "sbnt.layout.v1";
const COLS = 12;
const ROW_H = 28;

/** default layout, straight from the panel registry */
function defaultLayout(): GItem[] {
  return PANELS.map((p) => ({ i: p.id, ...p.layout, minW: 2, minH: 5 }));
}

/** The resizable, rearrangeable, persisted workstation grid. */
export function Workstation({ preset }: { preset: Preset }) {
  const [layout, setLayout] = useState<GItem[]>(defaultLayout);
  const [hydrated, setHydrated] = useState(false);

  /* load the persisted layout after mount (avoids an SSR hydration mismatch) */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as GItem[];
        const byId = new Map(saved.map((l) => [l.i, l]));
        setLayout(defaultLayout().map((d) => ({ ...d, ...(byId.get(d.i) ?? {}) })));
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  function onLayoutChange(next: GItem[]) {
    setLayout(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — non-fatal */
    }
  }

  /* which panels the active preset shows */
  const visibleIds = useMemo(
    () => new Set(LAYOUT_PRESETS[preset] ?? PANELS.map((p) => p.id)),
    [preset]
  );
  const shown = PANELS.filter((p) => visibleIds.has(p.id));
  const shownLayout = layout.filter((l) => visibleIds.has(l.i));

  return (
    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-bg p-2">
      <Grid
        layout={shownLayout}
        cols={COLS}
        rowHeight={ROW_H}
        margin={[8, 8]}
        containerPadding={[0, 0]}
        compactType="vertical"
        draggableHandle=".panel-drag"
        isBounded
        onLayoutChange={onLayoutChange}
        useCSSTransforms={hydrated}
      >
        {shown.map((p) => {
          const Content = PANEL_CONTENT[p.id];
          return (
            <div key={p.id} id={`panel-${p.id}`}>
              <Panel def={p}>{Content ? <Content /> : undefined}</Panel>
            </div>
          );
        })}
      </Grid>
    </div>
  );
}
