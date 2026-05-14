/* =================================================================
   SUBNEτ TERMINAL — Open-source AI source client
   Server-only. Pulls the open-model leaderboard from HuggingFace and
   the release wire from HuggingFace + arXiv + GitHub. Typed, cached,
   retried. No keys required — all three are public endpoints — but
   every call still falls back to the seed so the wire is never empty.
   ================================================================= */

import "server-only";
import { MODEL_SEED, WIRE_SEED } from "@/data/seed/ai";
import {
  asTask,
  type ModelEntry,
  type WireItem,
} from "@/lib/domain/ai";

/* tiny in-memory TTL cache — one process, fine for a research desk */
type Entry = { value: unknown; exp: number };
const cache = new Map<string, Entry>();

async function fetchWith(
  url: string,
  ttlMs: number,
  parse: (res: Response) => Promise<unknown>,
  headers: Record<string, string> = {}
): Promise<unknown> {
  const hit = cache.get(url);
  if (hit && hit.exp > Date.now()) return hit.value;
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 9000);
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: { "user-agent": "subnet-terminal/1.0", ...headers },
        cache: "no-store",
      });
      clearTimeout(to);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const value = await parse(res);
      cache.set(url, { value, exp: Date.now() + ttlMs });
      return value;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  throw lastErr;
}

const json = (r: Response) => r.json();
const text = (r: Response) => r.text();

/** licence lives in HF tags as `license:apache-2.0` — pull it out. */
function licenseFromTags(tags: string[]): string {
  const t = tags.find((x) => x.startsWith("license:"));
  return t ? t.slice(8) : "—";
}

const ms = (iso: unknown): number => {
  const n = Date.parse(String(iso ?? ""));
  return Number.isNaN(n) ? Date.now() : n;
};

/* ---- HuggingFace ------------------------------------------------- */

type HFModel = {
  id?: string;
  likes?: number;
  downloads?: number;
  tags?: string[];
  pipeline_tag?: string;
  createdAt?: string;
  lastModified?: string;
};

function toModel(r: HFModel): ModelEntry {
  const id = r.id ?? "unknown/unknown";
  const [org, ...rest] = id.split("/");
  const tags = Array.isArray(r.tags) ? r.tags : [];
  return {
    id,
    org,
    name: rest.join("/") || org,
    task: asTask(r.pipeline_tag),
    downloads: Number(r.downloads) || 0,
    likes: Number(r.likes) || 0,
    license: licenseFromTags(tags),
    createdAt: ms(r.createdAt),
    updated: ms(r.lastModified ?? r.createdAt),
  };
}

/** The open-model leaderboard — HF `downloads` is the trailing-30d
    count, so a sort by it is exactly the trending board we want. */
export async function getModels(): Promise<{ data: ModelEntry[]; live: boolean }> {
  try {
    const raw = (await fetchWith(
      "https://huggingface.co/api/models?sort=downloads&direction=-1&limit=40",
      30 * 60_000,
      json
    )) as HFModel[];
    if (!Array.isArray(raw) || !raw.length) throw new Error("empty");
    return { data: raw.map(toModel), live: true };
  } catch {
    return { data: MODEL_SEED, live: false };
  }
}

/** HF slice of the wire — the trending board. `trendingScore` is
    HuggingFace's own momentum signal, so it surfaces real model
    drops, not the long tail of empty repos. */
async function hfWire(): Promise<WireItem[]> {
  const raw = (await fetchWith(
    "https://huggingface.co/api/models?sort=trendingScore&direction=-1&limit=16",
    20 * 60_000,
    json
  )) as HFModel[];
  if (!Array.isArray(raw)) throw new Error("empty");
  return raw
    .map((r) => {
      const id = r.id ?? "unknown/unknown";
      const dl = Number(r.downloads) || 0;
      const likes = Number(r.likes) || 0;
      return {
        id: `huggingface:${id}`,
        source: "huggingface" as const,
        title: id.split("/").slice(1).join("/") || id,
        author: id.split("/")[0],
        url: `https://huggingface.co/${id}`,
        at: ms(r.createdAt),
        metric: dl >= likes * 1000 ? `${compact(dl)} downloads` : `${compact(likes)} likes`,
        tags: [r.pipeline_tag ?? "model"].filter(Boolean),
      };
    });
}

/* ---- arXiv ------------------------------------------------------- */

/** Lightweight Atom parse — arXiv's feed is small and regular, so a
    dependency-free regex pass beats pulling an XML library in. */
function parseArxiv(xml: string): WireItem[] {
  const out: WireItem[] = [];
  const entries = xml.split("<entry>").slice(1);
  for (const e of entries) {
    const pick = (tag: string) =>
      e.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1]?.trim();
    const id = pick("id") ?? "";
    const title = (pick("title") ?? "").replace(/\s+/g, " ");
    const published = pick("published") ?? "";
    const author = e.match(/<author>\s*<name>([\s\S]*?)<\/name>/)?.[1]?.trim() ?? "arXiv";
    const cat = e.match(/<arxiv:primary_category term="([^"]+)"/)?.[1] ?? "cs.LG";
    if (!id || !title) continue;
    const authorsCount = (e.match(/<name>/g) ?? []).length;
    out.push({
      id: `arxiv:${id}`,
      source: "arxiv",
      title,
      author: authorsCount > 1 ? `${author} +${authorsCount - 1}` : author,
      url: id.replace("http://", "https://"),
      at: ms(published),
      metric: cat,
      tags: [cat],
    });
  }
  return out;
}

async function arxivWire(): Promise<WireItem[]> {
  const xml = (await fetchWith(
    "https://export.arxiv.org/api/query?search_query=cat:cs.LG+OR+cat:cs.CL+OR+cat:cs.AI&sortBy=submittedDate&sortOrder=descending&max_results=14",
    20 * 60_000,
    text
  )) as string;
  return parseArxiv(xml);
}

/* ---- GitHub ------------------------------------------------------ */

type GHRepo = {
  full_name?: string;
  html_url?: string;
  description?: string;
  stargazers_count?: number;
  created_at?: string;
  owner?: { login?: string };
  language?: string;
};

/** GitHub slice — genuinely new repos, not commit churn. We window
    on `created_at` (last ~120d) and rank by stars, so a fast-rising
    new project surfaces rather than every push to an old one. */
async function githubWire(): Promise<WireItem[]> {
  const since = new Date(Date.now() - 120 * 86_400_000).toISOString().slice(0, 10);
  const url =
    `https://api.github.com/search/repositories?q=topic:llm+created:%3E${since}` +
    `&sort=stars&order=desc&per_page=12`;
  const raw = (await fetchWith(url, 30 * 60_000, json, {
    Accept: "application/vnd.github+json",
  })) as { items?: GHRepo[] };
  const items = Array.isArray(raw.items) ? raw.items : [];
  return items.map((r) => ({
    id: `github:${r.full_name}`,
    source: "github" as const,
    title: r.full_name ?? "unknown/repo",
    author: r.owner?.login ?? (r.full_name ?? "/").split("/")[0],
    url: r.html_url ?? `https://github.com/${r.full_name}`,
    at: ms(r.created_at),
    metric: `★ ${compact(Number(r.stargazers_count) || 0)}`,
    tags: [r.language ?? "repo"].filter(Boolean),
  }));
}

/* ---- compose ----------------------------------------------------- */

function compact(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "k";
  return String(Math.round(n));
}

/** The release wire — three independent feeds merged newest-first.
    Each source degrades on its own: a GitHub rate-limit doesn't take
    HuggingFace down with it. If all three fail, the seed carries. */
export async function getWire(): Promise<{ data: WireItem[]; live: boolean }> {
  const results = await Promise.allSettled([hfWire(), arxivWire(), githubWire()]);
  const merged: WireItem[] = [];
  let anyLive = false;
  for (const r of results) {
    if (r.status === "fulfilled" && r.value.length) {
      merged.push(...r.value);
      anyLive = true;
    }
  }
  if (!anyLive) return { data: WIRE_SEED, live: false };
  merged.sort((a, b) => b.at - a.at);
  /* de-dupe by id, keep first (newest) */
  const seen = new Set<string>();
  const data = merged.filter((w) => !seen.has(w.id) && seen.add(w.id));
  return { data: data.slice(0, 60), live: true };
}
