/* =================================================================
   SUBNET MAGAZINE, AQUARIUM STATE
   -----------------------------------------------------------------
   URL-encoded persistence for the Neural Aquarium. The network the
   reader builds in the playground gets serialized into the address
   bar so it survives refresh, can be shared as a link, and can be
   deep-linked from articles ("here is the network that solves XOR").

   The encoding is intentionally tiny and human-readable.

     ?n=16-28-32-14-6&a=L-R-R-R-S&k=5

     n  comma-or-dash separated neuron counts, ordered IN..OUT
     a  one-letter activation per layer
          L = linear, R = ReLU, S = Sigmoid, T = Tanh, X = Softmax
     k  optional, number of killed neurons (just a counter the
        UI uses to show "you've killed N this session" — the
        identity of which specific neurons died is intentionally
        not persisted, since the architecture editor can rebuild
        the network and ruin neuron-index alignment)

   This file owns the contract end-to-end. Encoding mistakes here
   propagate into broken share links forever, so the decoder is
   strict about format and the encoder always round-trips.
   ================================================================= */

/** @typedef {'linear'|'ReLU'|'Sigmoid'|'Tanh'|'Softmax'} Activation */

/** @typedef {{ name: string, n: number, act: Activation }} LayerSpec */

/**
 * One-letter codes for activation functions. Stable forever, do not
 * rename codes already in the wild.
 * @type {Record<Activation, string>}
 */
const ACT_CODE = Object.freeze({
  linear:  'L',
  ReLU:    'R',
  Sigmoid: 'S',
  Tanh:    'T',
  Softmax: 'X',
});

/** @type {Record<string, Activation>} */
const CODE_ACT = Object.freeze({
  L: 'linear',
  R: 'ReLU',
  S: 'Sigmoid',
  T: 'Tanh',
  X: 'Softmax',
});

/** Hard limits the encoder enforces. Reader sees a sensible shape on
 *  weird URLs instead of a broken network. */
const LIMITS = Object.freeze({
  MIN_LAYERS:   2,
  MAX_LAYERS:   12,
  MIN_NEURONS:  1,
  MAX_NEURONS:  64,
});

/**
 * Encode a layer list into a URL-safe string fragment.
 * @param {LayerSpec[]} layers
 * @returns {string}  e.g. "n=16-28-32-14-6&a=L-R-R-R-S"
 */
export function encodeLayers(layers){
  if (!Array.isArray(layers) || layers.length < LIMITS.MIN_LAYERS) return '';
  const ns = [];
  const as = [];
  for (const l of layers){
    const n = clampInt(l.n, LIMITS.MIN_NEURONS, LIMITS.MAX_NEURONS);
    const a = ACT_CODE[l.act] || ACT_CODE.linear;
    ns.push(String(n));
    as.push(a);
  }
  return `n=${ns.join('-')}&a=${as.join('-')}`;
}

/**
 * Decode a URL fragment (or full search string) into a layer list.
 * Returns null on any parse failure so callers can fall back to
 * their default network without try/catching.
 *
 * @param {string} query  may be a "?key=val&..." or just "key=val&..."
 * @returns {LayerSpec[] | null}
 */
export function decodeLayers(query){
  if (typeof query !== 'string' || query.length === 0) return null;
  const trimmed = query.startsWith('?') ? query.slice(1) : query;
  const params = new URLSearchParams(trimmed);

  const nRaw = params.get('n');
  const aRaw = params.get('a');
  if (!nRaw || !aRaw) return null;

  const ns = nRaw.split(/[,\-]/).filter(Boolean);
  const as = aRaw.split(/[,\-]/).filter(Boolean);
  if (ns.length !== as.length) return null;
  if (ns.length < LIMITS.MIN_LAYERS || ns.length > LIMITS.MAX_LAYERS) return null;

  /** @type {LayerSpec[]} */
  const out = [];
  let hiddenIndex = 0;
  for (let i = 0; i < ns.length; i++){
    const n = parseInt(ns[i], 10);
    if (!Number.isFinite(n)) return null;
    const code = as[i] ? as[i][0].toUpperCase() : 'L';
    const act = CODE_ACT[code];
    if (!act) return null;
    const name = i === 0 ? 'IN'
              : i === ns.length - 1 ? 'OUT'
              : `H${++hiddenIndex}`;
    out.push({
      name,
      n: clampInt(n, LIMITS.MIN_NEURONS, LIMITS.MAX_NEURONS),
      act,
    });
  }
  return out;
}

/**
 * Push the current layers + kill count into the URL without
 * triggering a navigation. Uses replaceState so the back button
 * doesn't fill up with every slider tweak.
 *
 * @param {LayerSpec[]} layers
 * @param {number} [killCount=0]
 */
export function writeToURL(layers, killCount = 0){
  if (typeof window === 'undefined' || !window.history?.replaceState) return;
  const base = encodeLayers(layers);
  if (!base) return;
  const q = killCount > 0 ? `${base}&k=${killCount | 0}` : base;
  const url = `${window.location.pathname}?${q}${window.location.hash}`;
  window.history.replaceState(null, '', url);
}

/**
 * Read the URL on page load and return a layer list, or null if the
 * URL doesn't contain a valid encoding (so caller can pick its
 * default architecture).
 *
 * @returns {LayerSpec[] | null}
 */
export function readFromURL(){
  if (typeof window === 'undefined') return null;
  return decodeLayers(window.location.search);
}

/**
 * Build a sharable absolute URL for the given architecture, suitable
 * for copying to the clipboard. Always returns a full https:// URL
 * rooted at the current page.
 *
 * @param {LayerSpec[]} layers
 * @returns {string}
 */
export function shareableURL(layers){
  if (typeof window === 'undefined') return '';
  const base = encodeLayers(layers);
  if (!base) return window.location.href;
  return `${window.location.origin}${window.location.pathname}?${base}`;
}

/**
 * Read a friendly summary string of the architecture, suitable for
 * a tooltip or a copy-share-label. e.g. "6 layers, 124 neurons".
 *
 * @param {LayerSpec[]} layers
 * @returns {string}
 */
export function describeLayers(layers){
  if (!Array.isArray(layers) || layers.length === 0) return 'empty network';
  const totalN = layers.reduce((s, l) => s + (l.n | 0), 0);
  const hidden = Math.max(0, layers.length - 2);
  const layersWord = layers.length === 1 ? 'layer' : 'layers';
  return `${layers.length} ${layersWord} (${hidden} hidden), ${totalN} neurons`;
}

/* ---------- internals ---------- */

function clampInt(n, lo, hi){
  const v = (n | 0);
  return v < lo ? lo : v > hi ? hi : v;
}
