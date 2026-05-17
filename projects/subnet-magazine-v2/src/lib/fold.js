/* =================================================================
   SUBNET MAGAZINE, FOLD HELPERS
   -----------------------------------------------------------------
   Native <details>/<summary> with persistence. Each fold gets a
   `data-fold="<id>"` attribute; we read its current state from
   localStorage on render and write back on toggle. Plays well with
   any view that wraps content in <details class="fold" ...>.

   Markup convention used across the magazine:
     <details class="fold" data-fold="dash-briefings">
       <summary class="fold__head">
         <span class="fold__sigil">⊕</span>
         <span class="fold__lbl">BRIEFINGS</span>
         <span class="fold__meta">4 days ago · Hyperscalers...</span>
         <span class="fold__chev">▸</span>
       </summary>
       <div class="fold__body">...content...</div>
     </details>

   Why <details> and not custom:
     - Native disclosure semantics (a11y free)
     - Keyboard support (Space/Enter to toggle)
     - Works without JS (graceful degradation)
     - iOS/Android handle scroll-position properly when content
       expands; our state-restore just sets the attribute
   ================================================================= */

const STORAGE_KEY = 'sbn:fold:v1';

function loadFoldState(){
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (_) { return {}; }
}

function saveFoldState(state){
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_) {}
}

/**
 * Wire all <details data-fold="..."> elements under `root` so their
 * open/closed state persists to localStorage. Honors a `data-fold-default`
 * attribute ("open" | "closed") for first-visit defaults.
 * @param {HTMLElement} root
 */
export function wireFolds(root){
  const state = loadFoldState();
  const folds = root.querySelectorAll('[data-fold]');
  folds.forEach(el => {
    const id = el.dataset.fold;
    if (!id) return;
    const stored = state[id];
    if (stored === 'open') el.setAttribute('open', '');
    else if (stored === 'closed') el.removeAttribute('open');
    // else: leave whatever HTML sets (data-fold-default handled at render)

    el.addEventListener('toggle', () => {
      state[id] = el.open ? 'open' : 'closed';
      saveFoldState(state);
    });
  });
}

/**
 * Expand or collapse all folds under `root`. Useful for "EXPAND ALL"
 * / "COLLAPSE ALL" toolbars.
 * @param {HTMLElement} root
 * @param {boolean}     openAll
 */
export function setAllFolds(root, openAll){
  const state = loadFoldState();
  root.querySelectorAll('[data-fold]').forEach(el => {
    const id = el.dataset.fold;
    if (openAll) el.setAttribute('open', '');
    else el.removeAttribute('open');
    if (id) state[id] = openAll ? 'open' : 'closed';
  });
  saveFoldState(state);
}

/**
 * Render-time helper: returns the right `open` attribute string
 * given an id + default behavior. Reads localStorage so the SSR-
 * style template rendering matches the post-mount state without
 * a flash of incorrect content.
 * @param {string} id
 * @param {'open'|'closed'} defaultState
 * @returns {string} either ' open' or ''
 */
export function foldOpenAttr(id, defaultState = 'closed'){
  const state = loadFoldState();
  const stored = state[id];
  const effective = stored || defaultState;
  return effective === 'open' ? ' open' : '';
}

/**
 * Convenience helper for rendering a complete fold template.
 * Returns the HTML string. Caller still needs to call wireFolds()
 * after mount.
 *
 * @param {Object} opts
 * @param {string} opts.id              data-fold id (required)
 * @param {string} opts.label           the eyebrow label
 * @param {string} [opts.meta]          summary value/meta line
 * @param {string} opts.body            inner HTML
 * @param {'open'|'closed'} [opts.default]  default state
 * @param {string} [opts.cta]           optional CTA link HTML
 * @param {string} [opts.className]     extra class on the <details>
 */
export function renderFold({ id, label, meta = '', body, default: def = 'closed', cta = '', className = '' }){
  const open = foldOpenAttr(id, def);
  return `
    <details class="fold ${className}" data-fold="${id}"${open}>
      <summary class="fold__head">
        <span class="fold__sigil">⊕</span>
        <span class="fold__lbl">${label}</span>
        <span class="fold__meta">${meta}</span>
        ${cta}
        <span class="fold__chev">▸</span>
      </summary>
      <div class="fold__body">${body}</div>
    </details>`;
}
