/* =================================================================
   SUBNEτ TERMINAL — Open-source AI seed
   Realistic recent values (May 2026). Renders whenever the live HF /
   arXiv / GitHub clients can't be reached — the wire is never empty.
   Replaced item-for-item by live data when available.
   ================================================================= */

import type { ModelEntry, WireItem } from "@/lib/domain/ai";

const DAY = 86_400_000;
const now = Date.UTC(2026, 4, 14, 12, 0, 0);

/* id, org, name, task, downloads, likes, license, updatedDaysAgo, ageDays */
function m(
  id: string,
  task: ModelEntry["task"],
  downloads: number,
  likes: number,
  license: string,
  updatedDaysAgo: number,
  ageDays: number
): ModelEntry {
  const [org, ...rest] = id.split("/");
  return {
    id,
    org,
    name: rest.join("/") || org,
    task,
    downloads,
    likes,
    license,
    updated: now - updatedDaysAgo * DAY,
    createdAt: now - ageDays * DAY,
  };
}

export const MODEL_SEED: ModelEntry[] = [
  m("meta-llama/Llama-4-Scout-17B-16E-Instruct", "image-text-to-text", 4_120_000, 3840, "llama4", 6, 38),
  m("Qwen/Qwen3-235B-A22B-Instruct", "text-generation", 3_280_000, 2910, "apache-2.0", 3, 27),
  m("deepseek-ai/DeepSeek-V3.1", "text-generation", 2_940_000, 4210, "mit", 9, 61),
  m("mistralai/Mistral-Large-2503", "text-generation", 1_870_000, 1620, "apache-2.0", 12, 70),
  m("google/gemma-3-27b-it", "image-text-to-text", 1_640_000, 2180, "gemma", 4, 44),
  m("black-forest-labs/FLUX.2-dev", "text-to-image", 1_410_000, 5870, "flux-2-dev", 7, 33),
  m("Qwen/Qwen3-30B-A3B", "text-generation", 1_290_000, 1340, "apache-2.0", 3, 27),
  m("openai/whisper-large-v3-turbo", "automatic-speech-recognition", 1_180_000, 1490, "apache-2.0", 22, 240),
  m("meta-llama/Llama-3.3-70B-Instruct", "text-generation", 980_000, 2360, "llama3.3", 18, 190),
  m("microsoft/Phi-4-multimodal", "image-text-to-text", 870_000, 980, "mit", 14, 96),
  m("BAAI/bge-m3", "feature-extraction", 760_000, 1120, "mit", 30, 410),
  m("stabilityai/stable-diffusion-3.5-large", "text-to-image", 690_000, 2740, "stabilityai-community", 25, 210),
  m("nvidia/Nemotron-4-340B-Instruct", "text-generation", 540_000, 760, "nvidia-open", 16, 130),
  m("hexgrad/Kokoro-82M", "text-to-speech", 480_000, 3110, "apache-2.0", 11, 120),
  m("allenai/OLMo-2-32B-Instruct", "text-generation", 310_000, 540, "apache-2.0", 8, 58),
  m("HuggingFaceTB/SmolLM3-3B", "text-generation", 270_000, 690, "apache-2.0", 5, 41),
];

/* source, title, author, daysAgo, hoursOffset, metric, url, tags */
function w(
  source: WireItem["source"],
  title: string,
  author: string,
  hoursAgo: number,
  metric: string,
  url: string,
  tags: string[]
): WireItem {
  return {
    id: `${source}:${url}`,
    source,
    title,
    author,
    url,
    at: now - hoursAgo * 3_600_000,
    metric,
    tags,
  };
}

export const WIRE_SEED: WireItem[] = [
  w("huggingface", "Qwen3-235B-A22B-Instruct", "Qwen", 5, "3.28M downloads",
    "https://huggingface.co/Qwen/Qwen3-235B-A22B-Instruct", ["text-generation", "moe"]),
  w("arxiv", "Scaling Sparse Attention to Million-Token Context", "Chen, Park, Volkov", 9,
    "cs.CL", "https://arxiv.org/abs/2505.10042", ["cs.CL", "cs.LG"]),
  w("github", "vllm-project/vllm", "vllm-project", 14, "★ 48.2k",
    "https://github.com/vllm-project/vllm", ["inference", "cuda"]),
  w("huggingface", "FLUX.2-dev", "black-forest-labs", 18, "5.87k likes",
    "https://huggingface.co/black-forest-labs/FLUX.2-dev", ["text-to-image", "diffusion"]),
  w("arxiv", "Reinforcement Learning from Verifiable Rewards at Scale", "Okafor, Lindqvist", 26,
    "cs.LG", "https://arxiv.org/abs/2505.09817", ["cs.LG", "cs.AI"]),
  w("huggingface", "Llama-4-Scout-17B-16E-Instruct", "meta-llama", 31, "4.12M downloads",
    "https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E-Instruct", ["image-text-to-text", "moe"]),
  w("github", "ggml-org/llama.cpp", "ggml-org", 39, "★ 81.7k",
    "https://github.com/ggml-org/llama.cpp", ["inference", "ggml"]),
  w("arxiv", "Distillation Beats Pretraining for Small Reasoning Models", "Haddad, Mwangi, Reyes", 44,
    "cs.LG", "https://arxiv.org/abs/2505.08930", ["cs.LG"]),
  w("huggingface", "Kokoro-82M", "hexgrad", 52, "3.11k likes",
    "https://huggingface.co/hexgrad/Kokoro-82M", ["text-to-speech"]),
  w("github", "huggingface/transformers", "huggingface", 61, "★ 142k",
    "https://github.com/huggingface/transformers", ["library", "pytorch"]),
  w("arxiv", "On the Token Economics of Mixture-of-Experts Serving", "Castellano, Ng", 70,
    "cs.DC", "https://arxiv.org/abs/2505.07744", ["cs.DC", "cs.LG"]),
  w("huggingface", "SmolLM3-3B", "HuggingFaceTB", 78, "270k downloads",
    "https://huggingface.co/HuggingFaceTB/SmolLM3-3B", ["text-generation", "small"]),
];
