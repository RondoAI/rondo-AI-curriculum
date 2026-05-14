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
  {
    id: 'xai-grok-4-colossus',
    source: 'xAI', sourceId: 'xai',
    headline: 'xAI scales Grok on the Colossus 2 cluster',
    body: 'xAI pushes Grok 4 forward on its expanding Memphis compute — frontier capability is once again gated by who can stand up the most GPUs fastest.',
    date: '2026-05-09', category: 'compute', region: 'US', impact: 'flat',
    tickers: [{ symbol: 'XAI.PVT', chg: '+5.5%' }, { symbol: 'NVDA', chg: '+1.1%' }],
    tags: ['frontier', 'Grok', 'compute', 'scale'],
  },
  {
    id: 'amd-mi400-ramp',
    source: 'AMD', sourceId: 'amd',
    headline: 'AMD ramps MI400 — a credible second source for AI silicon',
    body: 'AMD\'s MI400 line and ROCm 7 give hyperscalers a real alternative to NVIDIA. More competition at the metal layer is, indirectly, a tailwind for open and decentralized compute.',
    date: '2026-05-08', category: 'compute', region: 'US', impact: 'up',
    tickers: [{ symbol: 'AMD', chg: '+6.2%' }, { symbol: 'NVDA', chg: '-1.0%' }],
    tags: ['GPU', 'MI400', 'competition'],
  },
  {
    id: 'google-tpu-v7',
    source: 'Google Cloud · TPU', sourceId: 'gcp',
    headline: 'Google opens TPU v7 capacity to outside labs',
    body: 'Google widens external access to its TPU fleet — a reminder that the largest training substrate sits inside a handful of vertically-integrated clouds.',
    date: '2026-04-30', category: 'compute', region: 'US', impact: 'flat',
    tickers: [{ symbol: 'GOOGL', chg: '+2.0%' }],
    tags: ['TPU', 'cloud', 'training'],
  },
  {
    id: 'samsung-2nm-foundry',
    source: 'Samsung Foundry', sourceId: 'samsung',
    headline: 'Samsung 2nm tapes out its first AI accelerator customers',
    body: 'Samsung\'s 2nm node gives the AI supply chain a second leading-edge foundry beyond TSMC — easing, slightly, the single-point-of-failure in Taiwan.',
    date: '2026-04-25', category: 'compute', region: 'KR', impact: 'up',
    tickers: [{ symbol: '005930.KS', chg: '+3.7%' }],
    tags: ['foundry', '2nm', 'Asia', 'supply-chain'],
  },
  {
    id: 'elevenlabs-voice',
    source: 'ElevenLabs', sourceId: 'elevenlabs',
    headline: 'ElevenLabs consolidates the centralized voice stack',
    body: 'ElevenLabs keeps locking up the TTS and dubbing market — a concentrated audio layer that decentralized speech subnets are positioned to contest.',
    date: '2026-04-27', category: 'model', region: 'UK', impact: 'down',
    tickers: [{ symbol: 'ELEV.PVT', chg: '+2.9%' }],
    tags: ['audio', 'TTS', 'concentration'],
  },
  {
    id: 'runway-gen5',
    source: 'Runway', sourceId: 'runway',
    headline: 'Runway ships Gen-5 — cinematic video keeps centralizing',
    body: 'Runway\'s latest video model raises the bar on controllable generation. Compute-heavy video remains one of the hardest surfaces for a permissionless network to match.',
    date: '2026-04-21', category: 'model', region: 'US', impact: 'flat',
    tickers: [{ symbol: 'RNWY.PVT', chg: '+4.1%' }],
    tags: ['video', 'generation', 'frontier'],
  },
  {
    id: 'figure-humanoid',
    source: 'Figure', sourceId: 'figure',
    headline: 'Figure puts its humanoid into paid industrial pilots',
    body: 'Figure 03 moves from demo to deployment — embodied AI is becoming a real market, and the policy-training behind it is exactly what RL-style subnets target.',
    date: '2026-05-04', category: 'research', region: 'US', impact: 'up',
    tickers: [{ symbol: 'FIGU.PVT', chg: '+8.3%' }],
    tags: ['robotics', 'humanoid', 'embodied'],
  },
  {
    id: 'perplexity-search',
    source: 'Perplexity', sourceId: 'perplexity',
    headline: 'Perplexity pushes the answer engine past search',
    body: 'Perplexity keeps eating query share from classic search — a centralized retrieval layer that on-chain search and retrieval subnets aim to decentralize.',
    date: '2026-04-18', category: 'model', region: 'US', impact: 'flat',
    tickers: [{ symbol: 'PERP.PVT', chg: '+3.4%' }],
    tags: ['search', 'retrieval', 'answer-engine'],
  },
  {
    id: 'coreweave-buildout',
    source: 'CoreWeave', sourceId: 'coreweave',
    headline: 'CoreWeave\'s GPU-cloud buildout keeps compounding',
    body: 'CoreWeave expands its specialized GPU cloud — the centralized rental layer that decentralized compute subnets like Chutes and Celium are built to undercut.',
    date: '2026-05-01', category: 'capital', region: 'US', impact: 'down',
    tickers: [{ symbol: 'CRWV', chg: '+4.6%' }],
    tags: ['GPU-cloud', 'compute', 'capital'],
  },
  {
    id: 'sakana-evolution',
    source: 'Sakana AI', sourceId: 'sakana',
    headline: 'Sakana AI advances evolutionary model merging',
    body: 'Sakana\'s research keeps showing capability gains without frontier-scale compute — the efficiency thesis that makes a decentralized training market viable.',
    date: '2026-04-12', category: 'research', region: 'JP', impact: 'up',
    tickers: [{ symbol: 'SAKA.PVT', chg: '+3.1%' }],
    tags: ['research', 'efficiency', 'Asia', 'open-weights'],
  },
  {
    id: 'cohere-enterprise',
    source: 'Cohere', sourceId: 'cohere',
    headline: 'Cohere doubles down on private enterprise deployment',
    body: 'Cohere leans into on-prem, data-sovereign enterprise AI — a niche where verifiable, permissionless inference has a credible long-term opening.',
    date: '2026-04-09', category: 'capital', region: 'CA', impact: 'flat',
    tickers: [{ symbol: 'COHR.PVT', chg: '+1.2%' }],
    tags: ['enterprise', 'private', 'deployment'],
  },
]);

/** Newest first. */
export function newsByDate(){
  return AI_NEWS.slice().sort((a, b) => (b.date < a.date ? -1 : 1));
}
