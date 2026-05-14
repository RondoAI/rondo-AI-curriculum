"use client";

import { useState } from "react";
import { TopChrome, type Preset } from "@/components/chrome/TopChrome";
import { Workstation } from "@/components/grid/Workstation";
import { CommandPalette } from "@/components/cmd/CommandPalette";

/** The workstation. Phase 1: chrome + scrolling tape + an empty
    resizable, persisted grid + the ⌘K command palette. */
export default function TerminalPage() {
  const [preset, setPreset] = useState<Preset>("macro");
  return (
    <>
      <TopChrome preset={preset} onPreset={setPreset} />
      <Workstation preset={preset} />
      <CommandPalette onPreset={setPreset} />
    </>
  );
}
