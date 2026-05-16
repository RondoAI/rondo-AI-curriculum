/* =================================================================
   SUBNET MAGAZINE, BRAND MONOGRAMS + LOGOS
   -----------------------------------------------------------------
   Editorial-use brand chips for centralized incumbents we cite
   across the magazine. Each entry carries:
     m    2-character monogram (uppercase), fallback
     c    canonical brand colour (hex), chip background
     ink  optional text colour override, defaults to #fff
     s    simple-icons slug, real logo, served
          via cdn.simpleicons.org (CC0 licensed,
          editorial use is fine; we host nothing)

   brandChip() renders both an <img> (real logo from CDN) AND the
   monogram <span> as fallback. If the image fails to load (offline,
   blocked, slug missing) the onerror swaps to the monogram. So the
   chip is always populated.
   ================================================================= */

/**
 * @typedef {Object} BrandMark
 * @prop {string} m  2-character monogram fallback
 * @prop {string} c  hex colour (brand primary)
 * @prop {string=} ink  optional text colour, defaults to white
 * @prop {string=} s  simple-icons slug (https://simpleicons.org)
 */

/** @type {Object<string,BrandMark>} */
const BRANDS = {
  //, model labs (all verified against simple-icons.org)
  openai:      { m: 'OA', c: '#10A37F', s: 'openai' },
  anthropic:   { m: 'AC', c: '#D97757', s: 'anthropic' },
  google:      { m: 'G',  c: '#4285F4', s: 'google' },
  googleai:    { m: 'G',  c: '#4285F4', s: 'googlegemini' },
  gemini:      { m: 'Gm', c: '#4285F4', s: 'googlegemini' },
  meta:        { m: 'M',  c: '#0866FF', s: 'meta' },
  deepseek:    { m: 'DS', c: '#4D6BFE', s: 'deepseek' },
  mistral:     { m: 'M',  c: '#FA520F', s: 'mistralai' },
  xai:         { m: 'X',  c: '#000000', ink: '#fff', s: 'x' },
  huggingface: { m: 'HF', c: '#FFD21E', ink: '#000', s: 'huggingface' },
  cohere:      { m: 'Co', c: '#39594D', s: 'cohere' },
  databricks:  { m: 'Db', c: '#FF3621', s: 'databricks' },

  //, agents / dev tools
  cursor:      { m: 'Cu', c: '#0d0d0d', ink: '#fff', s: 'cursor' },
  cognition:   { m: 'Co', c: '#6E59A5' },
  devin:       { m: 'Dv', c: '#6E59A5' },
  perplexity:  { m: 'Pp', c: '#1FB8CD', s: 'perplexity' },
  claudecode:  { m: 'CC', c: '#D97757', s: 'anthropic' },
  operator:    { m: 'Op', c: '#10A37F', s: 'openai' },
  salesforce:  { m: 'SF', c: '#00A1E0', s: 'salesforce' },
  agentforce:  { m: 'AF', c: '#00A1E0', s: 'salesforce' },
  windsurf:    { m: 'Wd', c: '#3DBE99' },
  github:      { m: 'GH', c: '#181717', ink: '#fff', s: 'github' },
  vercel:      { m: 'Vc', c: '#000000', ink: '#fff', s: 'vercel' },

  //, inference platforms (simple-icons coverage varies)
  together:    { m: 'TG', c: '#1A75FF', s: 'togetherai' },
  fireworks:   { m: 'FW', c: '#FF6B35' },
  replicate:   { m: 'Rp', c: '#000000', ink: '#fff', s: 'replicate' },
  groq:        { m: 'Gq', c: '#F55036', s: 'groq' },
  modal:       { m: 'Md', c: '#7FEE64', ink: '#000', s: 'modal' },
  runpod:      { m: 'Rp', c: '#673AB7', s: 'runpod' },
  vllm:        { m: 'vL', c: '#7c1ea8' },

  //, data labelling / ETL
  scale:       { m: 'SC', c: '#000000', ink: '#fff' },
  scaleai:     { m: 'SC', c: '#000000', ink: '#fff' },
  surge:       { m: 'Su', c: '#FF6720' },
  snorkel:     { m: 'Sn', c: '#FFD43B', ink: '#000' },
  commoncrawl: { m: 'CC', c: '#222a35', ink: '#fff' },

  //, compute / cloud
  aws:         { m: 'AW', c: '#FF9900', ink: '#000', s: 'amazonwebservices' },
  azure:       { m: 'Az', c: '#0078D4', s: 'microsoftazure' },
  gcp:         { m: 'GC', c: '#4285F4', s: 'googlecloud' },
  microsoft:   { m: 'MS', c: '#00BCF2', s: 'microsoft' },
  apple:       { m: 'Ap', c: '#000000', ink: '#fff', s: 'apple' },
  amazon:      { m: 'Az', c: '#FF9900', ink: '#000', s: 'amazon' },
  coreweave:   { m: 'CW', c: '#10AB55' },
  lambda:      { m: 'Lm', c: '#7B61FF' },
  nvidia:      { m: 'Nv', c: '#76B900', ink: '#000', s: 'nvidia' },
  amd:         { m: 'AM', c: '#ED1C24', s: 'amd' },
  intel:       { m: 'In', c: '#0071C5', s: 'intel' },
  tsmc:        { m: 'TS', c: '#FFCC00', ink: '#000' },
  broadcom:    { m: 'Bc', c: '#CC092F', s: 'broadcom' },

  //, crypto / bittensor adjacent
  taostats:    { m: 'TS', c: '#FF1E3C', ink: '#fff' },
  coinbase:    { m: 'Cb', c: '#0052FF', s: 'coinbase' },
  kraken:      { m: 'Kr', c: '#5741D9', s: 'kraken' },
  binance:     { m: 'Bn', c: '#F0B90B', ink: '#000', s: 'binance' },
  bittensor:   { m: 'τ',  c: '#FF1E3C', ink: '#fff' },

  // — bittensor-ecosystem funds + capital fallbacks (used when an
  //   X profile photo fails to load and we paint a coloured chip)
  stillcore:   { m: 'SC', c: '#FF1E3C', ink: '#fff' },
  osscapital:  { m: 'OS', c: '#0d0d0d', ink: '#fff' },
  dcg:         { m: 'DC', c: '#0052FF' },
  polychain:   { m: 'PC', c: '#000000', ink: '#fff' },
  multicoin:   { m: 'MC', c: '#FF6720' },
  galaxy:      { m: 'GX', c: '#1E59A3' },
  a16z:        { m: 'AZ', c: '#FF6B35' },
  pantera:     { m: 'Pn', c: '#000000', ink: '#fff' },
  coinfund:    { m: 'CF', c: '#5741D9' },
  borderless:  { m: 'BC', c: '#10A37F' },
  foundry:     { m: 'Fd', c: '#000000', ink: '#fff' },
  brevan:      { m: 'BH', c: '#001F3F', ink: '#fff' },
  yuma:        { m: 'Y',  c: '#FF1E3C', ink: '#fff' },
  opentensor:  { m: 'OT', c: '#FF1E3C', ink: '#fff' },
  templar:     { m: 'Tp', c: '#000000', ink: '#fff' },
  rayonlabs:   { m: 'RL', c: '#FF1E3C', ink: '#fff' },
  macrocosmos: { m: 'Mc', c: '#7c1ea8', ink: '#fff' },
  manifold:    { m: 'Mf', c: '#000000', ink: '#fff' },
  taoshi:      { m: 'Ts', c: '#FF1E3C', ink: '#fff' },
  nous:        { m: 'No', c: '#000000', ink: '#fff' },
  datura:      { m: 'Dt', c: '#7c1ea8', ink: '#fff' },
  hippius:     { m: 'Hp', c: '#FF1E3C', ink: '#fff' },
  affine:      { m: 'Af', c: '#10A37F', ink: '#fff' },
  ridges:      { m: 'Rg', c: '#000000', ink: '#fff' },
  latent:      { m: 'Lt', c: '#FF9900', ink: '#000' },

  //, neutral
  none:        { m: '·',  c: '#3a1419', ink: '#FF4D60' },
};

/**
 * Given a free-form display string like "OpenAI Operator", try to
 * detect which brand key it maps to.
 * @param {string} label
 * @returns {string|null}
 */
export function inferBrandKey(label){
  if (!label) return null;
  const t = label.toLowerCase();
  const order = [
    'claudecode', 'operator', 'agentforce',
    'anthropic', 'openai', 'deepseek', 'mistral', 'xai',
    'gemini', 'googleai', 'huggingface', 'cohere', 'databricks',
    'cursor', 'cognition', 'devin', 'perplexity', 'salesforce',
    'windsurf', 'github', 'vercel',
    'together', 'fireworks', 'replicate', 'groq', 'modal', 'runpod', 'vllm',
    'scaleai', 'scale', 'surge', 'snorkel', 'commoncrawl',
    'aws', 'azure', 'gcp', 'microsoft', 'apple', 'amazon',
    'coreweave', 'lambda', 'nvidia', 'amd', 'intel', 'tsmc', 'broadcom',
    'coinbase', 'kraken', 'binance', 'taostats', 'bittensor',
    'google', 'meta',
  ];
  const niceMap = {
    claudecode: 'claude code',
    operator: 'openai operator',
    agentforce: 'agentforce',
    commoncrawl: 'common crawl',
    googleai: 'google ai',
    huggingface: 'hugging face',
  };
  for (const key of order){
    const probe = niceMap[key] || key;
    if (t.includes(probe)) return key;
  }
  return null;
}

/**
 * Resolve a brand record. Accepts either an explicit key or a
 * display string we can sniff. Synthesises a generic chip for
 * unknown inputs.
 * @param {string} input
 * @returns {BrandMark}
 */
export function brandFor(input){
  if (!input) return BRANDS.none;
  const direct = BRANDS[input.toLowerCase()];
  if (direct) return direct;
  const inferred = inferBrandKey(input);
  if (inferred && BRANDS[inferred]) return BRANDS[inferred];
  const m = input.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || '?';
  return { m, c: '#221216', ink: '#FF4D60' };
}

/**
 * Render the brand chip as inline HTML.
 *   - <img> first with the simple-icons CDN URL (real logo, white)
 *     against a coloured circular background, the canonical brand
 *     colour, so the mark reads as the actual company
 *   - <span> monogram fallback hidden by default; onerror reveals it
 *     if the image fails to load (offline, slug missing, etc.)
 * @param {string} input  brand key OR display string
 * @param {{size?: number}} [opts]
 * @returns {string}
 */
export function brandChip(input, opts = {}){
  const size = opts.size || 18;
  const b = brandFor(input);
  const monoFs = Math.round(size * 0.5);
  /* image fills the disc with ~12% inset; tighter inset reads as
     a more confident logo at small sizes */
  const inner = Math.round(size * 0.78);
  const logoImg = b.s
    ? `<img class="brand-chip__img"
            src="https://cdn.simpleicons.org/${b.s}/white"
            alt=""
            width="${inner}" height="${inner}"
            loading="lazy" decoding="async"
            onerror="this.style.display='none';this.nextElementSibling.style.display='grid';">`
    : '';
  /* a faint coloured glow that matches the brand, gives each
     chip a hint of identity even at thumb size */
  const glow = `box-shadow: 0 0 0 1px rgba(255,255,255,.06) inset, 0 0 10px ${b.c}55;`;
  return `<span class="brand-chip" aria-hidden="true" style="width:${size}px;height:${size}px;background:${b.c};${glow}">${logoImg}<span class="brand-chip__mono" style="display:${b.s ? 'none' : 'grid'};font-size:${monoFs}px;color:${b.ink || '#fff'};">${b.m}</span></span>`;
}

