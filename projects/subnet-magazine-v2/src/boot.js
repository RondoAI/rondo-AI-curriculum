/* =================================================================
   SUBNET MAGAZINE, BOOT
   -----------------------------------------------------------------
   The single entry point. Imports views, finds their mount points
   in the DOM, hands each a destroy() it can store. No logic lives
   here, just wiring.
   ================================================================= */

import { qs } from './lib/dom.js';
import { DataLayer } from './data/layer.js';
import { mountTickers } from './views/Tickers.js';
import { mountConsole } from './views/Console.js';
import { mountStatusStrip } from './views/StatusStrip.js';
import { mountMasthead } from './views/Masthead.js';
import { mountHero } from './views/Hero.js';
/* Home.js carries the cache-bust query so phones with aggressive
   browser caches re-fetch it after the SUBNET_LOGOS TDZ fix. The
   index.html boot script tag carries the same version. Bump both
   when a deployed Home.js change isn't being picked up. */
import { mountHome } from './views/Home.js?v=20260518e';
import { mountArticles } from './views/Articles.js';
import { mountInterviews } from './views/Interviews.js';
import { mountResearch } from './views/Research.js';
import { mountMarkets } from './views/Markets.js';
import { mountDashboard } from './views/Dashboard.js?v=20260518e';
import { mountEditor } from './views/Editor.js';
import { mountVoices } from './views/Voices.js';
import { mountCodex } from './views/Codex.js';

const teardowns = [];

function mountIf(selector, mountFn){
  const el = qs(selector);
  if (!el) return;
  /* Wrap each mount in try/catch so a failure in one view (e.g. an
     ES module import error, or a runtime exception during render)
     doesn't block the other views from mounting. Errors are shown
     in the console with the selector so they're easy to find. */
  try {
    const t = mountFn(el);
    if (typeof t === 'function')      teardowns.push(t);
    else if (t && typeof t.destroy === 'function') teardowns.push(() => t.destroy());
  } catch (err){
    // eslint-disable-next-line no-console
    console.error('[boot] mount failed for', selector, err);
    el.innerHTML = `<pre style="color:#FF4D60;padding:12px;font-family:monospace;font-size:11px;white-space:pre-wrap;overflow-x:auto">[mount error] ${selector}\n${(err && err.stack) || err}</pre>`;
  }
}

function boot(){
  // 1) start polling adapters (CoinGecko + HN Algolia), UI subscribes
  DataLayer.start();

  // 2) mount views, order is the page reading order
  mountIf('[data-mount="tickers"]',   root => mountTickers(root, DataLayer));
  mountIf('[data-mount="statusbar"]', root => mountStatusStrip(root, DataLayer));

  // system console, self-injecting chrome, present on every page
  const sysConsole = mountConsole(DataLayer);
  teardowns.push(() => sysConsole.destroy());

  mountIf('[data-mount="masthead"]',   mountMasthead);
  mountIf('[data-mount="hero"]',       root => mountHero(root, DataLayer));
  mountIf('[data-mount="home"]',       root => mountHome(root, DataLayer));
  mountIf('[data-mount="articles"]',   root => mountArticles(root, DataLayer));
  mountIf('[data-mount="interviews"]', root => mountInterviews(root));
  mountIf('[data-mount="research"]',   root => mountResearch(root));
  mountIf('[data-mount="markets"]',    root => mountMarkets(root, DataLayer));
  mountIf('[data-mount="dashboard"]',  root => mountDashboard(root, DataLayer));
  mountIf('[data-mount="voices"]',     root => mountVoices(root));
  mountIf('[data-mount="codex"]',      root => mountCodex(root, DataLayer));
  mountIf('[data-mount="editor"]',     root => mountEditor(root));

  // 3) clean teardown on unload (idempotent)
  window.addEventListener('beforeunload', () => {
    teardowns.splice(0).forEach(t => { try { t(); } catch (_) {} });
    DataLayer.stop();
  });
}

if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
