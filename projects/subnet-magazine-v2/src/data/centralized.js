/* =================================================================
   SUBNET MAGAZINE, CENTRALIZED AI LANDSCAPE
   -----------------------------------------------------------------
   Roster of centralized AI / compute companies the Subnet Magazine
   tracks as competitors and benchmarks. Strong Asian representation
   is intentional, China, Korea, Japan, and Taiwan together hold
   the most consequential half of the frontier-AI map.

   Each row carries:
     - id        slug (used in URLs)
     - name      display name
     - region    'US' | 'CN' | 'KR' | 'JP' | 'TW' | 'EU' | 'UK' | 'DE' | 'NO' | 'CA'
     - cat       matches our subnet categories ('text','vision',etc.)
     - subcat    finer grain (e.g. 'open-llm','gpu','foundry')
     - focus     1-line product description
     - valuation human-readable estimate
     - employees rough headcount
     - founded   year
     - openSource boolean (matters for the Asia open-source story)
     - url       homepage
   ================================================================= */

/** @typedef {'US'|'CN'|'KR'|'JP'|'TW'|'EU'|'UK'|'DE'|'NO'|'CA'} Region */

export const CENTRALIZED_PLAYERS = Object.freeze([
  /* ========== LLM / Text (Western) ========== */
  { id:'openai',     name:'OpenAI',              region:'US', cat:'text',     subcat:'frontier-llm', focus:'GPT-5 family, multimodal, agents',                valuation:'$340B', employees:1_800, founded:2015, openSource:false, url:'https://openai.com' },
  { id:'anthropic',  name:'Anthropic',           region:'US', cat:'text',     subcat:'frontier-llm', focus:'Claude Opus 4.7, constitutional methods',         valuation:'$170B', employees:1_100, founded:2021, openSource:false, url:'https://anthropic.com' },
  { id:'deepmind',   name:'Google DeepMind',     region:'US', cat:'text',     subcat:'frontier-llm', focus:'Gemini 3, multimodal, search-integrated',         valuation:'$2.1T (parent)', employees:5_000, founded:2010, openSource:false, url:'https://deepmind.google' },
  { id:'meta-ai',    name:'Meta AI',             region:'US', cat:'text',     subcat:'open-llm',     focus:'Llama 5 405B, open-weights flagship',             valuation:'$1.6T (parent)', employees:4_000, founded:2013, openSource:true,  url:'https://ai.meta.com' },
  { id:'xai',        name:'xAI',                 region:'US', cat:'text',     subcat:'frontier-llm', focus:'Grok 4, Colossus 2 compute',                       valuation:'$50B',  employees:600,   founded:2023, openSource:false, url:'https://x.ai' },
  { id:'mistral',    name:'Mistral AI',          region:'EU', cat:'text',     subcat:'open-llm',     focus:'Mistral Large, efficient open models',            valuation:'$6B',   employees:280,   founded:2023, openSource:true,  url:'https://mistral.ai' },
  { id:'cohere',     name:'Cohere',              region:'CA', cat:'text',     subcat:'enterprise-llm',focus:'Command-R, enterprise retrieval',                valuation:'$5B',   employees:500,   founded:2019, openSource:false, url:'https://cohere.com' },
  { id:'hf',         name:'Hugging Face',        region:'US', cat:'text',     subcat:'open-llm',     focus:'Model hub, the de-facto open-source registry',   valuation:'$4.5B', employees:300,   founded:2016, openSource:true,  url:'https://huggingface.co' },
  { id:'nous',       name:'Nous Research',       region:'US', cat:'text',     subcat:'open-llm',     focus:'Hermes models, open finetune research',          valuation:'$1B est.', employees:60,  founded:2023, openSource:true,  url:'https://nousresearch.com' },

  /* ========== LLM / Text (Asia, open-source heavy) ========== */
  { id:'deepseek',   name:'DeepSeek',            region:'CN', cat:'text',     subcat:'open-llm',     focus:'DeepSeek-R3, open reasoning, cheap inference',   valuation:'$10B',  employees:200,   founded:2023, openSource:true,  url:'https://deepseek.com' },
  { id:'qwen',       name:'Alibaba · Qwen',      region:'CN', cat:'text',     subcat:'open-llm',     focus:'Qwen 3, open-weights, multimodal',               valuation:'$200B (parent)', employees:25_000, founded:2023, openSource:true, url:'https://qwen.aliyun.com' },
  { id:'01ai',       name:'01.AI · Yi',          region:'CN', cat:'text',     subcat:'open-llm',     focus:'Yi-Large, founded by Kai-Fu Lee',                valuation:'$2B',   employees:300,   founded:2023, openSource:true,  url:'https://01.ai' },
  { id:'moonshot',   name:'Moonshot · Kimi',     region:'CN', cat:'text',     subcat:'frontier-llm', focus:'Kimi, long-context Chinese-first LLM',           valuation:'$3B',   employees:200,   founded:2023, openSource:false, url:'https://kimi.moonshot.cn' },
  { id:'baichuan',   name:'Baichuan',            region:'CN', cat:'text',     subcat:'open-llm',     focus:'Baichuan 4, open + enterprise',                  valuation:'$2B',   employees:300,   founded:2023, openSource:true,  url:'https://baichuan-ai.com' },
  { id:'zhipu',      name:'Zhipu · GLM',         region:'CN', cat:'text',     subcat:'open-llm',     focus:'GLM-5, open + enterprise',                       valuation:'$3B',   employees:400,   founded:2019, openSource:true,  url:'https://zhipuai.cn' },
  { id:'minimax',    name:'MiniMax',             region:'CN', cat:'text',     subcat:'frontier-llm', focus:'Abab, long-context + voice + video',             valuation:'$2.5B', employees:300,   founded:2021, openSource:false, url:'https://minimax.io' },
  { id:'stepfun',    name:'StepFun',             region:'CN', cat:'text',     subcat:'frontier-llm', focus:'Step-2, multimodal foundation models',           valuation:'$1B',   employees:200,   founded:2023, openSource:false, url:'https://stepfun.com' },
  { id:'naver',      name:'Naver · HyperCLOVA',  region:'KR', cat:'text',     subcat:'open-llm',     focus:'HyperCLOVA X, Korean-first',                     valuation:'$25B (parent)', employees:1_000, founded:2021, openSource:true,  url:'https://clovastudio.ncloud.com' },
  { id:'kakao',      name:'Kakao Brain · KoGPT', region:'KR', cat:'text',     subcat:'open-llm',     focus:'Korean LLMs + multimodal',                       valuation:'$15B (parent)', employees:400, founded:2017, openSource:true,  url:'https://kakaobrain.com' },
  { id:'sakana',     name:'Sakana AI',           region:'JP', cat:'text',     subcat:'research-llm', focus:'Evolutionary model merging, efficient research', valuation:'$1.5B', employees:50,    founded:2023, openSource:true,  url:'https://sakana.ai' },
  { id:'preferred',  name:'Preferred Networks',  region:'JP', cat:'text',     subcat:'enterprise-llm', focus:'Japan-focused enterprise LLM',                valuation:'$2B',   employees:300,   founded:2014, openSource:true,  url:'https://preferred.jp' },
  { id:'rinna',      name:'Rinna',               region:'JP', cat:'text',     subcat:'enterprise-llm', focus:'Japanese conversational AI',                  valuation:'$500M', employees:80,    founded:2016, openSource:false, url:'https://rinna.co.jp' },
  { id:'sarvam',     name:'Sarvam AI',           region:'IN', cat:'text',     subcat:'open-llm',     focus:'Indic-first foundation models',                  valuation:'$1B',   employees:120,   founded:2023, openSource:true,  url:'https://sarvam.ai' },
  { id:'krutrim',    name:'Krutrim · Ola',       region:'IN', cat:'text',     subcat:'enterprise-llm', focus:'Indic LLMs for consumer + cloud',             valuation:'$1B',   employees:200,   founded:2023, openSource:false, url:'https://krutrim.ai' },

  /* ========== Compute / Infrastructure (Western) ========== */
  { id:'nvidia',     name:'NVIDIA',              region:'US', cat:'infra',    subcat:'gpu',          focus:'Blackwell B200, Rubin sampling',                  valuation:'$3.9T',  employees:30_000, founded:1993, openSource:false, url:'https://nvidia.com' },
  { id:'amd',        name:'AMD',                 region:'US', cat:'infra',    subcat:'gpu',          focus:'MI400 series, ROCm 7',                            valuation:'$280B',  employees:26_000, founded:1969, openSource:false, url:'https://amd.com' },
  { id:'intel',      name:'Intel · Gaudi',       region:'US', cat:'infra',    subcat:'gpu',          focus:'Gaudi 4 accelerator, foundry pivot',              valuation:'$120B',  employees:120_000,founded:1968, openSource:false, url:'https://intel.com' },
  { id:'tsmc',       name:'TSMC',                region:'TW', cat:'infra',    subcat:'foundry',      focus:'N2 process, A16 roadmap',                         valuation:'$1.0T',  employees:80_000, founded:1987, openSource:false, url:'https://tsmc.com' },
  { id:'broadcom',   name:'Broadcom',            region:'US', cat:'infra',    subcat:'asic',         focus:'Custom AI ASICs, AI networking',                  valuation:'$960B',  employees:20_000, founded:1991, openSource:false, url:'https://broadcom.com' },
  { id:'marvell',    name:'Marvell',             region:'US', cat:'infra',    subcat:'asic',         focus:'Custom silicon for hyperscalers',                 valuation:'$75B',   employees:6_500,  founded:1995, openSource:false, url:'https://marvell.com' },
  { id:'aws',        name:'AWS',                 region:'US', cat:'infra',    subcat:'cloud',        focus:'Bedrock, Trainium 3, enterprise GPU',             valuation:'$2.0T (parent)', employees:1_500_000, founded:2006, openSource:false, url:'https://aws.amazon.com' },
  { id:'azure',      name:'Microsoft Azure',     region:'US', cat:'infra',    subcat:'cloud',        focus:'AI workloads, OpenAI partner cloud',              valuation:'$3.4T (parent)', employees:230_000,   founded:2010, openSource:false, url:'https://azure.microsoft.com' },
  { id:'gcp',        name:'Google Cloud · TPU',  region:'US', cat:'infra',    subcat:'cloud',        focus:'TPU v6, Gemini infrastructure',                   valuation:'$2.1T (parent)', employees:180_000,   founded:2008, openSource:false, url:'https://cloud.google.com' },
  { id:'coreweave',  name:'CoreWeave',           region:'US', cat:'infra',    subcat:'gpu-cloud',    focus:'GPU cloud, NVIDIA reseller leader',               valuation:'$23B',   employees:1_000,  founded:2017, openSource:false, url:'https://coreweave.com' },
  { id:'lambda',     name:'Lambda Labs',         region:'US', cat:'infra',    subcat:'gpu-cloud',    focus:'GPU instances, researcher-friendly',              valuation:'$1.5B',  employees:200,    founded:2012, openSource:false, url:'https://lambdalabs.com' },
  { id:'runpod',     name:'RunPod',              region:'US', cat:'infra',    subcat:'gpu-cloud',    focus:'Serverless GPU, spot market',                     valuation:'$500M',  employees:80,     founded:2022, openSource:false, url:'https://runpod.io' },
  { id:'vastai',     name:'vast.ai',             region:'US', cat:'infra',    subcat:'gpu-cloud',    focus:'P2P GPU marketplace',                             valuation:'$200M',  employees:30,     founded:2018, openSource:false, url:'https://vast.ai' },
  { id:'crusoe',     name:'Crusoe Energy',       region:'US', cat:'infra',    subcat:'gpu-cloud',    focus:'Off-grid GPU datacenters',                        valuation:'$2.8B',  employees:300,    founded:2018, openSource:false, url:'https://crusoe.ai' },
  { id:'akamai',     name:'Akamai',              region:'US', cat:'infra',    subcat:'edge',         focus:'Edge compute, CDN-native AI',                     valuation:'$13B',   employees:11_000, founded:1998, openSource:false, url:'https://akamai.com' },
  { id:'cloudflare', name:'Cloudflare · Workers AI', region:'US', cat:'infra', subcat:'edge',         focus:'Workers AI, serverless edge',                    valuation:'$50B',   employees:4_500,  founded:2009, openSource:false, url:'https://cloudflare.com' },

  /* ========== Compute / Infrastructure (Asia, sovereign stack) ========== */
  { id:'huawei',     name:'Huawei · Ascend',     region:'CN', cat:'infra',    subcat:'gpu',          focus:'Ascend 910C, Pangu LLM stack',                    valuation:'private', employees:200_000, founded:1987, openSource:false, url:'https://huawei.com' },
  { id:'biren',      name:'Biren',               region:'CN', cat:'infra',    subcat:'gpu',          focus:'BR100/BR104 domestic GPU',                        valuation:'$2B',     employees:1_000,  founded:2019, openSource:false, url:'https://birentech.com' },
  { id:'moore',      name:'Moore Threads',       region:'CN', cat:'infra',    subcat:'gpu',          focus:'Chinese GPU, CUDA-compatible stack',              valuation:'$3B',     employees:1_500,  founded:2020, openSource:false, url:'https://mthreads.com' },
  { id:'cambricon',  name:'Cambricon',           region:'CN', cat:'infra',    subcat:'asic',         focus:'AI accelerators, Siyuan series',                  valuation:'$15B (listed)', employees:1_500, founded:2016, openSource:false, url:'https://cambricon.com' },
  { id:'iluvatar',   name:'Iluvatar CoreX',      region:'CN', cat:'infra',    subcat:'gpu',          focus:'Tian Gai GPU + AI training stack',                valuation:'$1B',     employees:500,    founded:2015, openSource:false, url:'https://iluvatar.com' },
  { id:'alicloud',   name:'Alibaba Cloud',       region:'CN', cat:'infra',    subcat:'cloud',        focus:'Pangu compute, AI training, Qwen serving',        valuation:'$200B (parent)', employees:25_000, founded:2009, openSource:false, url:'https://aliyun.com' },
  { id:'tencent',    name:'Tencent Cloud',       region:'CN', cat:'infra',    subcat:'cloud',        focus:'AI clusters, enterprise',                         valuation:'$430B (parent)', employees:120_000, founded:2010, openSource:false, url:'https://cloud.tencent.com' },
  { id:'baidu-cloud',name:'Baidu Cloud · Qianfan',region:'CN',cat:'infra',    subcat:'cloud',        focus:'Ernie infra, MaaS platform',                      valuation:'$30B (parent)', employees:40_000, founded:2015, openSource:false, url:'https://cloud.baidu.com' },
  { id:'naver-cloud',name:'Naver Cloud',         region:'KR', cat:'infra',    subcat:'cloud',        focus:'GPU + HyperCLOVA serving',                        valuation:'$25B (parent)', employees:1_000, founded:2017, openSource:false, url:'https://ncloud.com' },
  { id:'sk-hynix',   name:'SK Hynix',            region:'KR', cat:'infra',    subcat:'memory',       focus:'HBM4, dominant NVIDIA supplier',                  valuation:'$120B',   employees:30_000, founded:1983, openSource:false, url:'https://skhynix.com' },
  { id:'samsung',    name:'Samsung Foundry',     region:'KR', cat:'infra',    subcat:'foundry',      focus:'2nm process, HBM3E supply',                       valuation:'$430B (parent)', employees:270_000, founded:1969, openSource:false, url:'https://samsungfoundry.com' },
  { id:'softbank',   name:'SoftBank · Stargate AI',region:'JP',cat:'infra',   subcat:'datacenter',   focus:'OpenAI co-investment in compute buildout',        valuation:'$120B (parent)', employees:65_000,  founded:1981, openSource:false, url:'https://softbank.jp' },
  { id:'rapidus',    name:'Rapidus',             region:'JP', cat:'infra',    subcat:'foundry',      focus:'2nm fab, MEXT/IBM-backed sovereign chip',         valuation:'public+private', employees:500, founded:2022, openSource:false, url:'https://rapidus.inc' },
  { id:'kioxia',     name:'Kioxia',              region:'JP', cat:'infra',    subcat:'memory',       focus:'NAND flash, HBM ambitions',                       valuation:'$8B',     employees:11_000, founded:2018, openSource:false, url:'https://kioxia.com' },

  /* ========== Vision / Image ========== */
  { id:'midjourney', name:'Midjourney',          region:'US', cat:'vision',   subcat:'image-gen',    focus:'v7, style consistency, imagery brand',            valuation:'$10B est.', employees:50,  founded:2021, openSource:false, url:'https://midjourney.com' },
  { id:'bfl',        name:'Black Forest Labs',   region:'DE', cat:'vision',   subcat:'image-gen',    focus:'FLUX 2, open-weight image gen',                   valuation:'$1B',     employees:30,    founded:2024, openSource:true,  url:'https://blackforestlabs.ai' },
  { id:'stability',  name:'Stability AI',        region:'UK', cat:'vision',   subcat:'image-gen',    focus:'SD 4, open ecosystem',                            valuation:'$1.5B',   employees:200,   founded:2020, openSource:true,  url:'https://stability.ai' },
  { id:'recraft',    name:'Recraft',             region:'US', cat:'vision',   subcat:'image-gen',    focus:'Brand-safe vector + image',                       valuation:'$500M',   employees:60,    founded:2022, openSource:false, url:'https://recraft.ai' },
  { id:'tencent-hy', name:'Tencent · Hunyuan',   region:'CN', cat:'vision',   subcat:'image-gen',    focus:'Hunyuan Image + Video',                           valuation:'$430B (parent)', employees:120_000, founded:2023, openSource:true, url:'https://hunyuan.tencent.com' },
  { id:'alibaba-ty', name:'Alibaba · Tongyi',    region:'CN', cat:'vision',   subcat:'image-gen',    focus:'Wanxiang image, Qwen-VL',                         valuation:'$200B (parent)', employees:25_000, founded:2023, openSource:true, url:'https://tongyi.aliyun.com' },

  /* ========== Video ========== */
  { id:'runway',     name:'Runway',              region:'US', cat:'video',    subcat:'video-gen',    focus:'Gen-4, cinematic video',                          valuation:'$3B',     employees:200,   founded:2018, openSource:false, url:'https://runwayml.com' },
  { id:'pika',       name:'Pika Labs',           region:'US', cat:'video',    subcat:'video-gen',    focus:'Short-form video gen',                            valuation:'$700M',   employees:50,    founded:2023, openSource:false, url:'https://pika.art' },
  { id:'luma',       name:'Luma AI',             region:'US', cat:'video',    subcat:'video-gen',    focus:'Dream Machine, Ray2',                             valuation:'$2B',     employees:80,    founded:2021, openSource:false, url:'https://lumalabs.ai' },
  { id:'kling',      name:'Kling · Kuaishou',    region:'CN', cat:'video',    subcat:'video-gen',    focus:'Kling 2, cinematic video gen',                    valuation:'$25B (parent)', employees:25_000, founded:2024, openSource:false, url:'https://kling.kuaishou.com' },
  { id:'hailuo',     name:'Hailuo · MiniMax',    region:'CN', cat:'video',    subcat:'video-gen',    focus:'Video gen + voice integration',                   valuation:'$2.5B (parent)', employees:300, founded:2023, openSource:false, url:'https://hailuoai.com' },

  /* ========== Audio / Speech ========== */
  { id:'elevenlabs', name:'ElevenLabs',          region:'UK', cat:'audio',    subcat:'tts',          focus:'Voice clone, TTS, dubbing',                       valuation:'$3.3B',   employees:200,   founded:2022, openSource:false, url:'https://elevenlabs.io' },
  { id:'suno',       name:'Suno',                region:'US', cat:'audio',    subcat:'music',        focus:'Music generation, v4',                            valuation:'$1B',     employees:50,    founded:2023, openSource:false, url:'https://suno.com' },
  { id:'udio',       name:'Udio',                region:'US', cat:'audio',    subcat:'music',        focus:'Music generation, Google-backed',                 valuation:'$500M',   employees:40,    founded:2023, openSource:false, url:'https://udio.com' },

  /* ========== Search / Retrieval ========== */
  { id:'perplexity', name:'Perplexity',          region:'US', cat:'search',   subcat:'answer-engine',focus:'Answer engine, search agent',                     valuation:'$9B',     employees:200,   founded:2022, openSource:false, url:'https://perplexity.ai' },
  { id:'baidu',      name:'Baidu',               region:'CN', cat:'search',   subcat:'answer-engine',focus:'Ernie, Chinese search + LLM',                     valuation:'$30B',    employees:40_000, founded:2000, openSource:false, url:'https://baidu.com' },
  { id:'kagi',       name:'Kagi',                region:'US', cat:'search',   subcat:'paid-search',  focus:'Paid search, privacy-first',                      valuation:'$50M',    employees:30,    founded:2018, openSource:false, url:'https://kagi.com' },

  /* ========== Robotics ========== */
  { id:'figure',     name:'Figure',              region:'US', cat:'robotics', subcat:'humanoid',     focus:'Figure 02, humanoid',                             valuation:'$2.6B',   employees:200,   founded:2022, openSource:false, url:'https://figure.ai' },
  { id:'1x',         name:'1X Technologies',     region:'NO', cat:'robotics', subcat:'humanoid',     focus:'NEO, home humanoid',                              valuation:'$1.1B',   employees:200,   founded:2014, openSource:false, url:'https://1x.tech' },
  { id:'unitree',    name:'Unitree',             region:'CN', cat:'robotics', subcat:'humanoid',     focus:'G1 humanoid, quadrupeds',                         valuation:'$1.5B',   employees:300,   founded:2016, openSource:false, url:'https://unitree.com' },
  { id:'xpeng-r',    name:'Xpeng · Iron',        region:'CN', cat:'robotics', subcat:'humanoid',     focus:'Iron humanoid, auto-spinoff',                     valuation:'$18B (parent)', employees:15_000, founded:2014, openSource:false, url:'https://xpeng.com' },
  { id:'boston-dyn', name:'Boston Dynamics',     region:'US', cat:'robotics', subcat:'industrial',   focus:'Atlas, Spot, industrial robotics',                valuation:'$1.1B',   employees:500,   founded:1992, openSource:false, url:'https://bostondynamics.com' },

  /* ========== Data / Labeling ========== */
  { id:'scale',      name:'Scale AI',            region:'US', cat:'data',     subcat:'labeling',     focus:'Human labeling, RLHF data',                       valuation:'$14B',    employees:1_000, founded:2016, openSource:false, url:'https://scale.com' },
  { id:'surge',      name:'Surge',               region:'US', cat:'data',     subcat:'labeling',     focus:'Expert RLHF labeling',                            valuation:'$1B',     employees:200,   founded:2020, openSource:false, url:'https://surgehq.ai' },

  /* ========== Science / Research ========== */
  { id:'isomorphic', name:'Isomorphic Labs',     region:'UK', cat:'science',  subcat:'biology',      focus:'AlphaFold spinoff, drug discovery',               valuation:'$5B est.', employees:300,   founded:2021, openSource:false, url:'https://isomorphiclabs.com' },
  { id:'inflection', name:'Inflection AI',       region:'US', cat:'science',  subcat:'research',     focus:'Enterprise AI agents (post-MSFT)',                valuation:'$1B',     employees:100,   founded:2022, openSource:false, url:'https://inflection.ai' },

  /* ========== Prediction / Finance ========== */
  { id:'numerai',    name:'Numerai',             region:'US', cat:'prediction', subcat:'finance-pred', focus:'Crowdsourced quant predictions',                valuation:'$500M est.', employees:30,  founded:2015, openSource:false, url:'https://numer.ai' },
]);

export const REGIONS = Object.freeze({
  US:'United States', UK:'United Kingdom', EU:'European Union', DE:'Germany',
  NO:'Norway', CA:'Canada',
  CN:'China',  KR:'South Korea', JP:'Japan',  TW:'Taiwan',  IN:'India',
});

/* Real exchange tickers for the publicly-listed players. Everyone
   else is private, they get a synthetic ".PVT" symbol (the markets-
   app convention) derived from their id. */
const PUBLIC_TICKERS = Object.freeze({
  nvidia:'NVDA', amd:'AMD', intel:'INTC', tsmc:'TSM', broadcom:'AVGO', marvell:'MRVL',
  'meta-ai':'META', aws:'AMZN', azure:'MSFT', gcp:'GOOGL', deepmind:'GOOGL',
  cloudflare:'NET', akamai:'AKAM', coreweave:'CRWV',
  alicloud:'BABA', 'alibaba-ty':'BABA', tencent:'0700.HK', 'tencent-hy':'0700.HK',
  baidu:'BIDU', 'baidu-cloud':'BIDU', naver:'035420.KS', 'naver-cloud':'035420.KS',
  kakao:'035720.KS', 'sk-hynix':'000660.KS', samsung:'005930.KS', softbank:'9984.T',
  kioxia:'285A.T', cambricon:'688256.SS', 'xpeng-r':'XPEV', kling:'1024.HK',
});

/**
 * The display ticker for a player, the real exchange symbol when
 * listed, otherwise a synthetic ".PVT" symbol. Mirrors how markets
 * apps surface private companies (e.g. "OPAI.PVT" for OpenAI).
 * @param {{id:string}} p
 * @returns {{ symbol: string, isPrivate: boolean }}
 */
export function tickerFor(p){
  if (!p) return { symbol: 'Â·', isPrivate: false };
  if (PUBLIC_TICKERS[p.id]) return { symbol: PUBLIC_TICKERS[p.id], isPrivate: false };
  const slug = String(p.id).replace(/[^a-z0-9]/gi, '').slice(0, 4).toUpperCase();
  return { symbol: `${slug}.PVT`, isPrivate: true };
}

/** Lookup helper. */
export function playerById(id){ return CENTRALIZED_PLAYERS.find(p => p.id === id) || null; }

/**
 * Centralized competitors for a given subnet category.
 * @param {string} cat
 * @param {{region?: string, openSourceOnly?: boolean}} [opts]
 */
export function competitorsForCategory(cat, opts = {}){
  let arr = CENTRALIZED_PLAYERS.filter(p => p.cat === cat);
  if (opts.region && opts.region !== 'ALL') arr = arr.filter(p => p.region === opts.region);
  if (opts.openSourceOnly) arr = arr.filter(p => p.openSource);
  return arr;
}

/** Asia-only convenience. */
export const ASIAN_REGIONS = new Set(['CN','KR','JP','TW','IN']);
export function asianCompetitorsForCategory(cat){
  return CENTRALIZED_PLAYERS.filter(p => p.cat === cat && ASIAN_REGIONS.has(p.region));
}
