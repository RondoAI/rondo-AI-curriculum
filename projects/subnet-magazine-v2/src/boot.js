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
import { mountNetworkMap } from './views/NetworkMap.js';
import { mountHome } from './views/Home.js';
import { mountTerminal } from './views/Terminal.js';
import { mountSubnetDetail } from './views/SubnetDetail.js';
import { mountCompare } from './views/Compare.js';
import { mountArticles } from './views/Articles.js';
import { mountSubnets }  from './views/Subnets.js';
import { mountValidators } from './views/Validators.js';
import { mountCommunity } from './views/Community.js';
import { mountCentralized } from './views/Centralized.js';
import { mountMarkets } from './views/Markets.js';
import { mountEditor } from './views/Editor.js';
import { mountInterviews } from './views/Interviews.js';
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

  mountIf('[data-mount="masthead"]',  mountMasthead);
  mountIf('[data-mount="hero"]',      root => mountHero(root, DataLayer));
  mountIf('[data-mount="netmap"]',    root => mountNetworkMap(root, DataLayer));
  mountIf('[data-mount="home"]',      root => mountHome(root, DataLayer));
  mountIf('[data-mount="terminal"]',       root => mountTerminal(root, DataLayer));
  mountIf('[data-mount="subnet-detail"]',  root => mountSubnetDetail(root, DataLayer));
  mountIf('[data-mount="compare"]',        root => mountCompare(root));
  mountIf('[data-mount="articles"]',       root => mountArticles(root, DataLayer));
  mountIf('[data-mount="subnets"]',        root => mountSubnets(root, DataLayer));
  mountIf('[data-mount="validators"]',     root => mountValidators(root, DataLayer));
  mountIf('[data-mount="community"]',      root => mountCommunity(root, DataLayer));
  mountIf('[data-mount="centralized"]',    root => mountCentralized(root));
  mountIf('[data-mount="markets"]',        root => mountMarkets(root, DataLayer));
  mountIf('[data-mount="editor"]',         root => mountEditor(root));
  mountIf('[data-mount="interviews"]',     root => mountInterviews(root));
  mountIf('[data-mount="voices"]',         root => mountVoices(root));
  mountIf('[data-mount="codex"]',          root => mountCodex(root, DataLayer));

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
