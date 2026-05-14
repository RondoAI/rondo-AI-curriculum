/* =================================================================
   SUBNET MAGAZINE — BOOT
   -----------------------------------------------------------------
   The single entry point. Imports views, finds their mount points
   in the DOM, hands each a destroy() it can store. No logic lives
   here — just wiring.
   ================================================================= */

import { qs } from './lib/dom.js';
import { DataLayer } from './data/layer.js';
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

const teardowns = [];

function mountIf(selector, mountFn){
  const el = qs(selector);
  if (!el) return;
  const t = mountFn(el);
  if (typeof t === 'function')      teardowns.push(t);
  else if (t && typeof t.destroy === 'function') teardowns.push(() => t.destroy());
}

function boot(){
  // 1) start polling adapters (CoinGecko + HN Algolia) — UI subscribes
  DataLayer.start();

  // 2) mount views — order is the page reading order
  mountIf('[data-mount="statusbar"]', root => mountStatusStrip(root, DataLayer));
  mountIf('[data-mount="masthead"]',  mountMasthead);
  mountIf('[data-mount="hero"]',      root => mountHero(root, DataLayer));
  mountIf('[data-mount="netmap"]',    root => mountNetworkMap(root, DataLayer));
  mountIf('[data-mount="home"]',      root => mountHome(root, DataLayer));
  mountIf('[data-mount="terminal"]',       root => mountTerminal(root, DataLayer));
  mountIf('[data-mount="subnet-detail"]',  root => mountSubnetDetail(root, DataLayer));
  mountIf('[data-mount="compare"]',        root => mountCompare(root));
  mountIf('[data-mount="articles"]',       root => mountArticles(root, DataLayer));
  mountIf('[data-mount="subnets"]',        root => mountSubnets(root));
  mountIf('[data-mount="validators"]',     root => mountValidators(root));

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
