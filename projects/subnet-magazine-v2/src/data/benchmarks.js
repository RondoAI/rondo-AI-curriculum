/* =================================================================
   SUBNET MAGAZINE, AI BENCHMARKS
   -----------------------------------------------------------------
   A curated set of the benchmarks that actually drive the
   conversation in frontier AI as of May 2026. Each benchmark has:

     id          slug
     name        short display label (board uses this)
     full        long form
     category    'text' | 'vision' | 'training' | 'agents' | 'audio'
                 | 'video' | 'multimodal' | 'science' | 'robotics'
     unit        '%' | 'pts' | 'ELO' | 'pass@1' …
     description plain-English explainer
     leaders     [{ model, org, region, score, date, open? }]

   Leader scores are best-effort current values; date stamps when
   the score was published. open=true marks open-weight models so
   the SubnetDetail page can call out the open-source landscape
   (the part of the field where Bittensor subnets compete most
   directly).

   The list is intentionally Asia-aware: DeepSeek, Qwen, Yi,
   Moonshot, Zhipu, MiniMax, StepFun, Naver, Sakana, and others
   appear alongside US/EU frontier labs.
   ================================================================= */

/** @typedef {'US'|'CN'|'KR'|'JP'|'TW'|'EU'|'UK'|'DE'|'IN'|'NO'|'CA'} Region */

/**
 * @typedef {Object} BenchmarkLeader
 * @prop {string} model
 * @prop {string} org
 * @prop {Region} region
 * @prop {number} score
 * @prop {string} date      e.g. '2026-04'
 * @prop {boolean} [open]   open-weight model
 */

/**
 * @typedef {Object} Benchmark
 * @prop {string} id
 * @prop {string} name
 * @prop {string} full
 * @prop {string} category
 * @prop {string} unit
 * @prop {string} description
 * @prop {BenchmarkLeader[]} leaders
 */

/** @type {readonly Benchmark[]} */
export const BENCHMARKS = Object.freeze([
  {
    id:'mmlu-pro',
    name:'MMLU-Pro',
    full:'Massive Multitask Language Understanding (Pro)',
    category:'text',
    unit:'%',
    description:'Broad knowledge benchmark across 14 disciplines (STEM, humanities, professional). Pro version harder than original MMLU.',
    leaders:[
      { model:'Claude Opus 4.7',     org:'Anthropic',     region:'US', score:84.3, date:'2026-03' },
      { model:'GPT-5.1',             org:'OpenAI',        region:'US', score:83.7, date:'2026-02' },
      { model:'Gemini 3 Pro',        org:'Google DeepMind', region:'US', score:82.4, date:'2026-01' },
      { model:'DeepSeek-R3',         org:'DeepSeek',      region:'CN', score:80.6, date:'2026-03', open:true },
      { model:'Qwen 3 Max',          org:'Alibaba',       region:'CN', score:79.8, date:'2026-02', open:true },
      { model:'Llama 5 405B',        org:'Meta',          region:'US', score:79.2, date:'2026-04', open:true },
      { model:'Yi-Large 2',          org:'01.AI',         region:'CN', score:75.4, date:'2026-02', open:true },
      { model:'Mistral Large 2',     org:'Mistral',       region:'EU', score:74.9, date:'2026-01', open:true },
    ],
  },
  {
    id:'gpqa-diamond',
    name:'GPQA Diamond',
    full:'Graduate-level Physics, Biology, Chemistry (Diamond set)',
    category:'text',
    unit:'%',
    description:'PhD-level science questions written by domain experts. Diamond set is the hardest 198 questions, Google-resistant.',
    leaders:[
      { model:'Claude Opus 4.7',     org:'Anthropic',     region:'US', score:76.4, date:'2026-03' },
      { model:'GPT-5.1 (reasoning)', org:'OpenAI',        region:'US', score:75.1, date:'2026-02' },
      { model:'Gemini 3 Pro',        org:'Google DeepMind', region:'US', score:71.8, date:'2026-01' },
      { model:'DeepSeek-R3',         org:'DeepSeek',      region:'CN', score:69.2, date:'2026-03', open:true },
      { model:'Qwen 3 Max',          org:'Alibaba',       region:'CN', score:64.6, date:'2026-02', open:true },
      { model:'Llama 5 405B',        org:'Meta',          region:'US', score:62.4, date:'2026-04', open:true },
      { model:'Zhipu GLM-5',         org:'Zhipu',         region:'CN', score:58.1, date:'2026-04', open:true },
    ],
  },
  {
    id:'swe-bench',
    name:'SWE-bench Verified',
    full:'Real GitHub issues, agentic code fix',
    category:'agents',
    unit:'%',
    description:'500 real GitHub issues from popular Python projects. Model has to actually fix the bug, verified by maintainers.',
    leaders:[
      { model:'Claude Opus 4.7',     org:'Anthropic',     region:'US', score:78.4, date:'2026-03' },
      { model:'GPT-5.1 (agent)',     org:'OpenAI',        region:'US', score:71.3, date:'2026-02' },
      { model:'Gemini 3 Pro (agent)', org:'Google DeepMind', region:'US', score:64.9, date:'2026-01' },
      { model:'DeepSeek-R3-Coder',   org:'DeepSeek',      region:'CN', score:58.2, date:'2026-04', open:true },
      { model:'Qwen 3 Coder',        org:'Alibaba',       region:'CN', score:53.7, date:'2026-03', open:true },
      { model:'Llama 5 Code',        org:'Meta',          region:'US', score:48.4, date:'2026-04', open:true },
    ],
  },
  {
    id:'aime-2025',
    name:'AIME 2025',
    full:'American Invitational Mathematics Examination',
    category:'science',
    unit:'%',
    description:'30 hard high-school competition math problems. Pure reasoning, no Python, no search.',
    leaders:[
      { model:'GPT-5.1 (reasoning)', org:'OpenAI',        region:'US', score:96.3, date:'2026-02' },
      { model:'Claude Opus 4.7',     org:'Anthropic',     region:'US', score:94.1, date:'2026-03' },
      { model:'Gemini 3 Pro',        org:'Google DeepMind', region:'US', score:91.7, date:'2026-01' },
      { model:'DeepSeek-R3',         org:'DeepSeek',      region:'CN', score:88.4, date:'2026-03', open:true },
      { model:'Qwen 3 Max-Math',     org:'Alibaba',       region:'CN', score:82.9, date:'2026-02', open:true },
      { model:'Llama 5 405B',        org:'Meta',          region:'US', score:78.6, date:'2026-04', open:true },
    ],
  },
  {
    id:'arc-agi',
    name:'ARC-AGI v2',
    full:'Abstraction and Reasoning Corpus',
    category:'text',
    unit:'%',
    description:'François Chollet\'s benchmark. Tiny grid puzzles a child can solve, brutally hard for LLMs. The "real intelligence" test, depending on who you ask.',
    leaders:[
      { model:'GPT-5.1 (reasoning)', org:'OpenAI',        region:'US', score:72.4, date:'2026-02' },
      { model:'Claude Opus 4.7',     org:'Anthropic',     region:'US', score:68.1, date:'2026-03' },
      { model:'Gemini 3 Pro',        org:'Google DeepMind', region:'US', score:60.5, date:'2026-01' },
      { model:'DeepSeek-R3',         org:'DeepSeek',      region:'CN', score:52.8, date:'2026-03', open:true },
      { model:'Llama 5 405B',        org:'Meta',          region:'US', score:41.3, date:'2026-04', open:true },
    ],
  },
  {
    id:'humaneval',
    name:'HumanEval',
    full:'Hand-written Python coding tasks',
    category:'agents',
    unit:'pass@1',
    description:'164 hand-written Python coding problems. The original LLM coding benchmark, mostly saturated but still cited.',
    leaders:[
      { model:'Claude Opus 4.7',     org:'Anthropic',     region:'US', score:96.8, date:'2026-03' },
      { model:'GPT-5.1',             org:'OpenAI',        region:'US', score:96.1, date:'2026-02' },
      { model:'DeepSeek-R3-Coder',   org:'DeepSeek',      region:'CN', score:95.7, date:'2026-04', open:true },
      { model:'Qwen 3 Coder',        org:'Alibaba',       region:'CN', score:94.9, date:'2026-03', open:true },
      { model:'Gemini 3 Pro',        org:'Google DeepMind', region:'US', score:94.2, date:'2026-01' },
      { model:'Llama 5 Code',        org:'Meta',          region:'US', score:92.4, date:'2026-04', open:true },
    ],
  },
  {
    id:'lmsys-arena',
    name:'LMSYS Arena',
    full:'Chatbot Arena (human preference)',
    category:'text',
    unit:'ELO',
    description:'Pairwise blind human-preference ratings. The most honest benchmark, vibes-checked by tens of thousands of users.',
    leaders:[
      { model:'Claude Opus 4.7',     org:'Anthropic',     region:'US', score:1418, date:'2026-04' },
      { model:'GPT-5.1',             org:'OpenAI',        region:'US', score:1411, date:'2026-04' },
      { model:'Gemini 3 Pro',        org:'Google DeepMind', region:'US', score:1397, date:'2026-04' },
      { model:'DeepSeek-R3',         org:'DeepSeek',      region:'CN', score:1369, date:'2026-04', open:true },
      { model:'Qwen 3 Max',          org:'Alibaba',       region:'CN', score:1342, date:'2026-04', open:true },
      { model:'Llama 5 405B',        org:'Meta',          region:'US', score:1331, date:'2026-04', open:true },
      { model:'Mistral Large 2',     org:'Mistral',       region:'EU', score:1289, date:'2026-04', open:true },
      { model:'Kimi K2',             org:'Moonshot',      region:'CN', score:1271, date:'2026-04' },
    ],
  },
  {
    id:'mmmu',
    name:'MMMU',
    full:'Massive Multi-discipline Multimodal Understanding',
    category:'multimodal',
    unit:'%',
    description:'College-level multimodal questions across 30 subjects, image + text. The vision-language SAT.',
    leaders:[
      { model:'Gemini 3 Pro',        org:'Google DeepMind', region:'US', score:79.4, date:'2026-01' },
      { model:'GPT-5.1',             org:'OpenAI',        region:'US', score:78.6, date:'2026-02' },
      { model:'Claude Opus 4.7',     org:'Anthropic',     region:'US', score:77.2, date:'2026-03' },
      { model:'Qwen-VL 3',           org:'Alibaba',       region:'CN', score:71.8, date:'2026-02', open:true },
      { model:'DeepSeek-VL2',        org:'DeepSeek',      region:'CN', score:68.4, date:'2026-03', open:true },
      { model:'Llama 5 Vision',      org:'Meta',          region:'US', score:67.2, date:'2026-04', open:true },
    ],
  },
  {
    id:'gaia',
    name:'GAIA',
    full:'General AI Assistant benchmark',
    category:'agents',
    unit:'%',
    description:'Real-world tasks an assistant should handle: web research, file reading, multi-step planning. Built by Meta + Hugging Face.',
    leaders:[
      { model:'GPT-5.1 (agent)',     org:'OpenAI',        region:'US', score:67.4, date:'2026-02' },
      { model:'Claude Opus 4.7',     org:'Anthropic',     region:'US', score:64.8, date:'2026-03' },
      { model:'Gemini 3 Pro (agent)', org:'Google DeepMind', region:'US', score:59.2, date:'2026-01' },
      { model:'DeepSeek-R3',         org:'DeepSeek',      region:'CN', score:48.6, date:'2026-04', open:true },
      { model:'Llama 5 405B',        org:'Meta',          region:'US', score:42.1, date:'2026-04', open:true },
    ],
  },
  {
    id:'imageval',
    name:'ImageGen Eval',
    full:'Image generation human preference',
    category:'vision',
    unit:'ELO',
    description:'Blind pairwise human preference on text-to-image. FLUX, Midjourney v7, DALL-E 4, Stable Diffusion 4, Hunyuan Image, Wanxiang.',
    leaders:[
      { model:'Midjourney v7',       org:'Midjourney',    region:'US', score:1342, date:'2026-03' },
      { model:'FLUX 2 Pro',          org:'Black Forest Labs', region:'DE', score:1311, date:'2026-02', open:true },
      { model:'Tencent Hunyuan',     org:'Tencent',       region:'CN', score:1284, date:'2026-03', open:true },
      { model:'Alibaba Wanxiang',    org:'Alibaba',       region:'CN', score:1271, date:'2026-02', open:true },
      { model:'DALL-E 4',            org:'OpenAI',        region:'US', score:1262, date:'2026-02' },
      { model:'SD 4 XL',             org:'Stability',     region:'UK', score:1218, date:'2026-04', open:true },
    ],
  },
  {
    id:'videoeval',
    name:'VideoGen Eval',
    full:'Video generation human preference',
    category:'video',
    unit:'ELO',
    description:'Pairwise human preference on text-to-video. Sora 2 vs Kling vs Hailuo vs Runway Gen-4 vs Veo 3.',
    leaders:[
      { model:'Veo 3',               org:'Google DeepMind', region:'US', score:1294, date:'2026-04' },
      { model:'Sora 2',              org:'OpenAI',        region:'US', score:1281, date:'2026-02' },
      { model:'Kling 2',             org:'Kuaishou',      region:'CN', score:1267, date:'2026-03' },
      { model:'Hailuo (MiniMax)',    org:'MiniMax',       region:'CN', score:1242, date:'2026-03' },
      { model:'Runway Gen-4',        org:'Runway',        region:'US', score:1218, date:'2026-04' },
    ],
  },
  {
    id:'humanoid',
    name:'Robot Skills Bench',
    full:'Humanoid robot dexterity + manipulation',
    category:'robotics',
    unit:'%',
    description:'Standardized indoor manipulation tasks for humanoid platforms. Pick-and-place, folding, assembly. Sim-to-real.',
    leaders:[
      { model:'Figure 02',           org:'Figure',        region:'US', score:84.2, date:'2026-04' },
      { model:'Unitree G1',          org:'Unitree',       region:'CN', score:79.4, date:'2026-03' },
      { model:'NEO Gen 2',           org:'1X',            region:'NO', score:76.8, date:'2026-02' },
      { model:'Xpeng Iron',          org:'Xpeng',         region:'CN', score:72.1, date:'2026-03' },
      { model:'Optimus Gen 3',       org:'Tesla',         region:'US', score:68.4, date:'2026-04' },
    ],
  },
]);

/** Index by category for quick filtering. */
export function benchmarksFor(category){
  if (!category) return BENCHMARKS;
  return BENCHMARKS.filter(b => b.category === category);
}

/** Top N leaders across all benchmarks (deduped by model), used as a
    headline "frontier scoreboard". */
export function flagshipLeaderboard(){
  const map = new Map();
  for (const b of BENCHMARKS){
    for (const l of b.leaders){
      const key = l.model;
      const entry = map.get(key) || { model: l.model, org: l.org, region: l.region, open: !!l.open, count: 0 };
      entry.count += 1;
      map.set(key, entry);
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}
