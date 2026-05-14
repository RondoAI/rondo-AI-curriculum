/* =================================================================
   SUBNET MAGAZINE — DOM HELPERS
   -----------------------------------------------------------------
   Tiny, dependency-free helpers used by every view. Three goals:

     1. `html` is a tagged-template that returns a DocumentFragment.
        Values are escaped by default; raw HTML must be wrapped in
        `raw()`. This is our XSS contract.

     2. `qs` / `qsa` / `on` shave the boilerplate off DOM lookups
        and event binding without introducing a framework.

     3. `mount(root, frag)` and `replace(root, frag)` give views one
        clear way to render into the DOM.

   Every public function here has a JSDoc type signature. No
   globals, no side effects on import.
   ================================================================= */

/** A sentinel that marks a string as already-safe HTML. */
const RAW = Symbol('raw');

/**
 * Mark a string as raw HTML — opt out of auto-escaping. Use only
 * when the source is known-safe (e.g. SVG you constructed locally).
 * @param {string} s
 * @returns {{[RAW]: true, s: string}}
 */
export function raw(s){ return { [RAW]: true, s: String(s) }; }

/**
 * Escape a value for safe HTML interpolation.
 * @param {unknown} v
 * @returns {string}
 */
function escapeValue(v){
  if (v == null) return '';
  if (v && typeof v === 'object' && v[RAW]) return v.s;
  if (Array.isArray(v)) return v.map(escapeValue).join('');
  return String(v).replace(/[&<>"']/g, ch => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]
  ));
}

/**
 * Tagged-template that returns an HTML string with values escaped
 * by default. Pass `raw(s)` to embed pre-trusted markup.
 * Example: html`<span>${userInput}${raw(svg)}</span>`
 * @returns {string}
 */
export function html(strings, ...values){
  let out = '';
  for (let i = 0; i < strings.length; i++){
    out += strings[i];
    if (i < values.length) out += escapeValue(values[i]);
  }
  return out;
}

/**
 * Parse an HTML string into a DocumentFragment.
 * @param {string} s
 * @returns {DocumentFragment}
 */
export function frag(s){
  const t = document.createElement('template');
  t.innerHTML = s;
  return t.content;
}

/** @template {Element} T @param {string} sel @param {ParentNode=} root @returns {T|null} */
export function qs(sel, root = document){ return /** @type {any} */ (root.querySelector(sel)); }

/** @template {Element} T @param {string} sel @param {ParentNode=} root @returns {T[]} */
export function qsa(sel, root = document){ return /** @type {any} */ (Array.from(root.querySelectorAll(sel))); }

/**
 * Attach an event listener. Returns a teardown function.
 * @template {keyof HTMLElementEventMap} K
 * @param {EventTarget} target
 * @param {K|string} type
 * @param {(e: Event) => void} fn
 * @param {AddEventListenerOptions=} opts
 * @returns {() => void}
 */
export function on(target, type, fn, opts){
  target.addEventListener(type, fn, opts);
  return () => target.removeEventListener(type, fn, opts);
}

/**
 * Replace the contents of `root` with `content`. Accepts an HTML
 * string, a Node, or a DocumentFragment.
 * @param {Element} root
 * @param {string|Node} content
 */
export function mount(root, content){
  root.replaceChildren();
  if (typeof content === 'string') root.append(frag(content));
  else root.append(content);
}

/**
 * Convenience: clamp a number into [min,max].
 * @param {number} n @param {number} min @param {number} max
 * @returns {number}
 */
export function clamp(n, min, max){ return n < min ? min : n > max ? max : n; }

/**
 * Read prefers-reduced-motion as a stable boolean snapshot.
 * @returns {boolean}
 */
export function prefersReducedMotion(){
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Throttle a function by requestAnimationFrame — perfect for
 * resize and scroll listeners.
 * @template {(...args:any[])=>any} F
 * @param {F} fn
 * @returns {F}
 */
export function rafThrottle(fn){
  let scheduled = false; let lastArgs;
  return /** @type {F} */ (function(...args){
    lastArgs = args;
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; fn.apply(this, lastArgs); });
  });
}
