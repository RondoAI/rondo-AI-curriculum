"use client";

import type { ComponentType } from "react";
import { TaoChartPanel } from "./TaoChartPanel";
import { SubnetHeatPanel } from "./SubnetHeatPanel";
import { SubnetBoardPanel } from "./SubnetBoardPanel";
import { ValidatorGraphPanel } from "./ValidatorGraphPanel";
import { ConsensusPulsePanel } from "./ConsensusPulsePanel";
import { AiWirePanel } from "./AiWirePanel";
import { ModelBoardPanel } from "./ModelBoardPanel";

/** panel id → body component. Panels without an entry render their
    in-voice empty state until their phase lands. */
export const PANEL_CONTENT: Record<string, ComponentType> = {
  "tao-chart": TaoChartPanel,
  "subnet-heat": SubnetHeatPanel,
  "subnet-board": SubnetBoardPanel,
  "validator-graph": ValidatorGraphPanel,
  "consensus-pulse": ConsensusPulsePanel,
  "ai-wire": AiWirePanel,
  "model-board": ModelBoardPanel,
};
