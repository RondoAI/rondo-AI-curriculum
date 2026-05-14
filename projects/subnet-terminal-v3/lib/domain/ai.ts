/* =================================================================
   SUBNEτ TERMINAL — Open-source AI domain types
   The shapes the AI vertical agrees on. Source clients (HuggingFace,
   arXiv, GitHub, seed) all normalize INTO these.
   ================================================================= */

export type WireSource = "huggingface" | "arxiv" | "github";

/** One item on the AI release wire — a model drop, a paper, a repo. */
export interface WireItem {
  /** stable de-dupe key */
  id: string;
  source: WireSource;
  title: string;
  /** org / first author / repo owner */
  author: string;
  url: string;
  /** unix ms */
  at: number;
  /** source-specific headline metric, pre-formatted */
  metric: string;
  tags: string[];
}

export type ModelTask =
  | "text-generation"
  | "image-text-to-text"
  | "text-to-image"
  | "automatic-speech-recognition"
  | "text-to-speech"
  | "feature-extraction"
  | "other";

/** One row of the open-model leaderboard. */
export interface ModelEntry {
  /** org/name — the HuggingFace id */
  id: string;
  org: string;
  name: string;
  task: ModelTask;
  downloads: number;
  likes: number;
  /** short licence code: apache-2.0, mit, llama3.1, … */
  license: string;
  /** unix ms last touched */
  updated: number;
  /** unix ms first published */
  createdAt: number;
}

export interface AiStat {
  /** summed downloads across the tracked board */
  trackedDownloads: number;
  trackedLikes: number;
  modelsTracked: number;
  /** wire items inside the last 24h */
  newToday: number;
}

export const TASK_ACCENT: Record<ModelTask, string> = {
  "text-generation": "#F472B6",
  "image-text-to-text": "#FFB0BA",
  "text-to-image": "#C84368",
  "automatic-speech-recognition": "#FF7A88",
  "text-to-speech": "#FF8C42",
  "feature-extraction": "#A78BFA",
  other: "#A8A29E",
};

export const TASK_LABEL: Record<ModelTask, string> = {
  "text-generation": "TEXT GEN",
  "image-text-to-text": "VISION-LM",
  "text-to-image": "IMAGE GEN",
  "automatic-speech-recognition": "ASR",
  "text-to-speech": "TTS",
  "feature-extraction": "EMBED",
  other: "OTHER",
};

export const SOURCE_LABEL: Record<WireSource, string> = {
  huggingface: "HF",
  arxiv: "arXiv",
  github: "GH",
};

export const SOURCE_ACCENT: Record<WireSource, string> = {
  huggingface: "#F472B6",
  arxiv: "#FFB0BA",
  github: "#A78BFA",
};

/** Normalise any pipeline_tag string into our task enum. */
export function asTask(raw: string | null | undefined): ModelTask {
  const t = (raw ?? "").toLowerCase();
  if (t === "text-generation" || t === "conversational") return "text-generation";
  if (t === "image-text-to-text" || t === "visual-question-answering")
    return "image-text-to-text";
  if (t === "text-to-image") return "text-to-image";
  if (t === "automatic-speech-recognition") return "automatic-speech-recognition";
  if (t === "text-to-speech") return "text-to-speech";
  if (t === "feature-extraction" || t === "sentence-similarity")
    return "feature-extraction";
  return "other";
}
