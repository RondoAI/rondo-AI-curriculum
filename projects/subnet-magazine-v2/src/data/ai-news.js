/* =================================================================
   SUBNET MAGAZINE — CENTRALIZED AI READINGS
   -----------------------------------------------------------------
   The Centralized Desk's curated feed: notable developments in the
   centralized AI world — model releases, compute build-outs,
   capital moves, policy. This is the "what's happening outside
   Bittensor" surface, so the magazine can frame decentralized AI
   against the centralized race.

   These are curated editorial items, not a live news API. Each is
   a real, public development; bodies are kept general and factual.
   The card art is generated (src/lib/art.js) — no image assets.

   Each item:
     - id        slug
     - source    subject company / lab (display)
     - sourceId  centralized.js player id when one exists
     - headline  one line
     - body      1–2 sentence summary
     - date      ISO 'YYYY-MM-DD'
     - category  'model' | 'compute' | 'capital' | 'policy' | 'research'
     - region    matches centralized.js Region codes
     - impact    'up' | 'down' | 'flat'  — editorial read on what it
                 means for the decentralized-AI thesis
     - tickers   [{ symbol, chg }] — the ticker(s) the story touches.
                 Public names use the real exchange symbol; private
                 names use the ".PVT" convention. `chg` is the
                 desk's editorial momentum read tied to the story,
                 NOT a live market quote.
     - tags      string[]
   ================================================================= */

export const NEWS_CATEGORY = Object.freeze({
  model:    'MODEL RELEASE',
  compute:  'COMPUTE',
  capital:  'CAPITAL',
  policy:   'POLICY',
  research: 'RESEARCH',
});

/** @type {readonly object[]} */
export const AI_NEWS = Object.freeze([
  {
    id: 'llama-5-405b',
    source: 'Meta AI', sourceId: 'meta-ai',
    headline: 'Llama 5 ships at 405B — the open-weights flagship resets the bar',
    body: 'Meta releases Llama 5 with open weights, narrowing the gap to the closed frontier and handing every subnet a stronger free base model to build on.',
    date: '2026-04-08', category: 'model', region: 'US', impact: 'up',
    tickers: [{ symbol: 'META', chg: '+3.4%' }],
    tags: ['open-weights', 'frontier', 'Llama'],
  },
  {
    id: 'deepseek-r3',
    source: 'DeepSeek', sourceId: 'deepseek',
    headline: 'DeepSeek-R3 lands — open reasoning at a fraction of the inference cost',
    body: 'DeepSeek\'s third reasoning model continues the open-source, cheap-inference playbook out of China, pressuring closed-lab pricing worldwide.',
    date: '2026-03-28', category: 'model', region: 'CN', impact: 'up',
    tickers: [{ symbol: 'DEEP.PVT', chg: '+9.1%' }, { symbol: 'NVDA', chg: '-1.8%' }],
    tags: ['open-weights', 'reasoning', 'Asia', 'inference-cost'],
  },
  {
    id: 'claude-opus-4-7',
    source: 'Anthropic', sourceId: 'anthropic',
    headline: 'Anthropic ships Claude Opus 4.7',
    body: 'The latest Opus tightens agentic coding and long-horizon reasoning — the centralized benchmark every Bittensor agent subnet is measured against.',
    date: '2026-03-11', category: 'model', region: 'US', impact: 'flat',
    tickers: [{ symbol: 'ANTH.PVT', chg: '+2.2%' }],
    tags: ['frontier', 'agents', 'Claude'],
  },
  {
    id: 'gpt-5-1',
    source: 'OpenAI', sourceId: 'openai',
    headline: 'GPT-5.1 — incremental, but the moat is the distribution',
    body: 'OpenAI\'s point release is modest on capability; the real story stays the consumer distribution and the compute commitments behind it.',
    date: '2026-02-04', category: 'model', region: 'US', impact: 'flat',
    tickers: [{ symbol: 'OPEN.PVT', chg: '+0.6%' }],
    tags: ['frontier', 'GPT', 'distribution'],
  },
  {
    id: 'gemini-3-pro',
    source: 'Google DeepMind', sourceId: 'deepmind',
    headline: 'Gemini 3 Pro folds the model deeper into search',
    body: 'DeepMind ships Gemini 3 Pro with tighter search integration — a reminder that centralized AI\'s edge is the surrounding product, not just the weights.',
    date: '2026-01-15', category: 'model', region: 'US', impact: 'flat',
    tickers: [{ symbol: 'GOOGL', chg: '+1.9%' }],
    tags: ['frontier', 'Gemini', 'search'],
  },
  {
    id: 'nvidia-rubin-sampling',
    source: 'NVIDIA', sourceId: 'nvidia',
    headline: 'NVIDIA begins sampling Rubin as Blackwell B200 stays sold out',
    body: 'The next architecture starts sampling while demand outstrips supply — compute scarcity is the structural backdrop to every decentralized-compute subnet.',
    date: '2026-05-02', category: 'compute', region: 'US', impact: 'up',
    tickers: [{ symbol: 'NVDA', chg: '+4.7%' }, { symbol: 'TSM', chg: '+1.3%' }],
    tags: ['GPU', 'Rubin', 'scarcity'],
  },
  {
    id: 'tsmc-n2-ramp',
    source: 'TSMC', sourceId: 'tsmc',
    headline: 'TSMC ramps N2 — the whole AI stack waits on one fab',
    body: 'TSMC\'s 2nm ramp concentrates the frontier\'s fate in Taiwan, sharpening the case for sovereign-stack efforts in China, Korea, and Japan.',
    date: '2026-04-22', category: 'compute', region: 'TW', impact: 'flat',
    tickers: [{ symbol: 'TSM', chg: '+2.1%' }],
    tags: ['foundry', 'N2', 'supply-chain', 'Asia'],
  },
  {
    id: 'huawei-ascend-910c',
    source: 'Huawei · Ascend', sourceId: 'huawei',
    headline: 'Huawei pushes Ascend 910C as China builds a sovereign compute lane',
    body: 'Export limits keep accelerating domestic silicon in China — Ascend, Biren, Cambricon and Moore Threads are quietly building an alternative compute base.',
    date: '2026-04-14', category: 'compute', region: 'CN', impact: 'up',
    tickers: [{ symbol: 'HUAW.PVT', chg: '+6.0%' }, { symbol: '688256.SS', chg: '+8.4%' }],
    tags: ['GPU', 'sovereign', 'Asia', 'export-controls'],
  },
  {
    id: 'softbank-stargate',
    source: 'SoftBank · Stargate AI', sourceId: 'softbank',
    headline: 'SoftBank deepens the Stargate compute buildout',
    body: 'Another tranche of capital into centralized data-center capacity — the bet that intelligence is gated by power and GPUs, not algorithms.',
    date: '2026-03-30', category: 'capital', region: 'JP', impact: 'flat',
    tickers: [{ symbol: '9984.T', chg: '+1.1%' }],
    tags: ['datacenter', 'capital', 'Asia'],
  },
  {
    id: 'sk-hynix-hbm4',
    source: 'SK Hynix', sourceId: 'sk-hynix',
    headline: 'SK Hynix locks HBM4 supply — memory is the new bottleneck',
    body: 'High-bandwidth memory, not logic, is increasingly the binding constraint on AI training — and Korea\'s memory makers hold the leverage.',
    date: '2026-04-29', category: 'compute', region: 'KR', impact: 'up',
    tickers: [{ symbol: '000660.KS', chg: '+5.2%' }],
    tags: ['memory', 'HBM4', 'Asia', 'bottleneck'],
  },
  {
    id: 'mistral-large-open',
    source: 'Mistral AI', sourceId: 'mistral',
    headline: 'Mistral keeps the European open-weights lane alive',
    body: 'Mistral ships another efficient open model — proof the open-weights movement is not only an Asian story, and a tailwind for permissionless subnets.',
    date: '2026-04-02', category: 'model', region: 'EU', impact: 'up',
    tickers: [{ symbol: 'MIST.PVT', chg: '+3.0%' }],
    tags: ['open-weights', 'Europe', 'efficiency'],
  },
  {
    id: 'qwen-3-multimodal',
    source: 'Alibaba · Qwen', sourceId: 'qwen',
    headline: 'Qwen 3 goes broadly multimodal — and stays open',
    body: 'Alibaba\'s Qwen line keeps shipping open-weights multimodal models, cementing China as the center of gravity for downloadable frontier-class AI.',
    date: '2026-03-18', category: 'model', region: 'CN', impact: 'up',
    tickers: [{ symbol: 'BABA', chg: '+4.3%' }],
    tags: ['open-weights', 'multimodal', 'Asia', 'Qwen'],
  },
  {
    id: 'scale-ai-data-moat',
    source: 'Scale AI', sourceId: 'scale',
    headline: 'The data-labeling moat tightens around a few vendors',
    body: 'RLHF and evaluation data stays concentrated in a handful of centralized vendors — exactly the kind of bottleneck decentralized data subnets aim to break.',
    date: '2026-04-19', category: 'research', region: 'US', impact: 'down',
    tickers: [{ symbol: 'SCAL.PVT', chg: '-2.4%' }],
    tags: ['data', 'RLHF', 'concentration'],
  },
  {
    id: 'isomorphic-drug-discovery',
    source: 'Isomorphic Labs', sourceId: 'isomorphic',
    headline: 'Isomorphic pushes AI drug discovery deeper into the clinic',
    body: 'The AlphaFold spinoff keeps advancing centralized AI-for-science — the same frontier METANOVA (SN68) is opening up permissionlessly on Bittensor.',
    date: '2026-05-06', category: 'research', region: 'UK', impact: 'flat',
    tickers: [{ symbol: 'ISOM.PVT', chg: '+1.4%' }],
    tags: ['science', 'drug-discovery', 'DeSci'],
  },
]);

/** Newest first. */
export function newsByDate(){
  return AI_NEWS.slice().sort((a, b) => (b.date < a.date ? -1 : 1));
}
