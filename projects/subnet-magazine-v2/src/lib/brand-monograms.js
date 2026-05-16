/* =================================================================
   SUBNET MAGAZINE — BRAND MONOGRAMS
   -----------------------------------------------------------------
   Tiny in-house brand chips for the centralized incumbents we
   reference across the Money Map and elsewhere. Each entry returns
   a 2-character monogram (initials) plus the canonical brand
   colour, so we can paint a recognisable badge without shipping
   third-party logo art (which carries trademark questions across
   editorial reuse).

   To use:
     import { brandChip, brandFor } from '../lib/brand-monograms.js';
     const html = brandChip('openai');
     // -> <span class="brand-chip" style="background:#10A37F"...>OAI</span>

   Unknown keys fall back to a neutral grey chip with the first
   two characters of the brand name supplied at call time.
   ================================================================= */

/**
 * @typedef {Object} BrandMark
 * @prop {string} m  2-character monogram (uppercase)
 * @prop {string} c  hex colour (brand's primary)
 * @prop {string=} ink optional text colour override (defaults to white)
 */

/** @type {Object<string,BrandMark>} */
const BRANDS = {
  // — model labs
  openai:      { m: 'OA', c: '#10A37F' },
  anthropic:   { m: 'AC', c: '#D97757' },
  google:      { m: 'G',  c: '#4285F4' },
  googleai:    { m: 'G',  c: '#4285F4' },
  meta:        { m: 'M',  c: '#0866FF' },
  deepseek:    { m: 'DS', c: '#4D6BFE' },
  mistral:     { m: 'M',  c: '#FA520F' },
  xai:         { m: 'X',  c: '#000000', ink: '#fff' },

  // — agents / dev tools
  cursor:      { m: 'Cu', c: '#0d0d0d', ink: '#fff' },
  cognition:   { m: 'Co', c: '#6E59A5' },
  devin:       { m: 'Dv', c: '#6E59A5' },
  perplexity:  { m: 'Pp', c: '#1FB8CD' },
  claudecode:  { m: 'CC', c: '#D97757' },
  operator:    { m: 'Op', c: '#10A37F' },
  salesforce:  { m: 'SF', c: '#00A1E0' },
  agentforce:  { m: 'AF', c: '#00A1E0' },

  // — inference platforms
  together:    { m: 'TG', c: '#1A75FF' },
  fireworks:   { m: 'FW', c: '#FF6B35' },
  replicate:   { m: 'Rp', c: '#000000', ink: '#fff' },
  groq:        { m: 'Gq', c: '#F55036' },

  // — data labelling / ETL
  scale:       { m: 'SC', c: '#000000', ink: '#fff' },
  scaleai:     { m: 'SC', c: '#000000', ink: '#fff' },
  surge:       { m: 'Su', c: '#FF6720' },
  snorkel:     { m: 'Sn', c: '#FFD43B', ink: '#000' },
  commoncrawl: { m: 'CC', c: '#222a35', ink: '#fff' },

  // — compute / cloud
  aws:         { m: 'AW', c: '#FF9900', ink: '#000' },
  azure:       { m: 'Az', c: '#0078D4' },
  gcp:         { m: 'GC', c: '#4285F4' },
  microsoft:   { m: 'MS', c: '#00BCF2' },
  coreweave:   { m: 'CW', c: '#10AB55' },
  lambda:      { m: 'Lm', c: '#7B61FF' },
  nvidia:      { m: 'Nv', c: '#76B900', ink: '#000' },

  // — neutral
  none:        { m: '—',  c: '#3a1419', ink: '#FF4D60' },
};

/**
 * Given a free-form display string like "OpenAI Operator", try to
 * detect which brand key it maps to. Falls back to the literal
 * first key match. Returns null if nothing matches.
 * @param {string} label
 * @returns {string|null}
 */
export function inferBrandKey(label){
  if (!label) return null;
  const t = label.toLowerCase();
  // ordered most-specific first so "claude code" wins over "claude"
  const order = [
    'claudecode', 'operator', 'agentforce',
    'anthropic', 'openai', 'deepseek', 'mistral', 'xai',
    'cursor', 'cognition', 'devin', 'perplexity', 'salesforce',
    'together', 'fireworks', 'replicate', 'groq',
    'scaleai', 'scale', 'surge', 'snorkel', 'commoncrawl',
    'aws', 'azure', 'gcp', 'microsoft', 'coreweave', 'lambda', 'nvidia',
    'google', 'meta',
  ];
  for (const key of order){
    const niceMap = {
      claudecode: 'claude code',
      operator: 'openai operator',
      agentforce: 'agentforce',
      commoncrawl: 'common crawl',
      googleai: 'google ai',
    };
    const probe = niceMap[key] || key;
    if (t.includes(probe)) return key;
  }
  return null;
}

/**
 * Resolve a brand record. Accepts either an explicit key or a
 * display string we can sniff. Returns a synthesized record for
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
  /* synthesize: first two non-space chars, neutral chip colour */
  const m = input.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || '?';
  return { m, c: '#221216', ink: '#FF4D60' };
}

/**
 * Render the monogram badge as inline HTML.
 * @param {string} input  brand key OR display string
 * @param {{size?: number}} [opts]
 * @returns {string}
 */
export function brandChip(input, opts = {}){
  const size = opts.size || 18;
  const b = brandFor(input);
  return `<span class="brand-chip" aria-hidden="true" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.55)}px;background:${b.c};color:${b.ink || '#fff'};">${b.m}</span>`;
}
