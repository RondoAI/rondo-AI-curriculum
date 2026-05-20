/* =================================================================
   SUBNET MAGAZINE, PAPER PORTFOLIO PANEL
   -----------------------------------------------------------------
   The "actually do something with the analytics" surface. The reader
   gets $100K paper, buys subnet α at the live mark, tracks P&L
   against cost basis, and watches the portfolio value sparkline
   move with the market. Persists to localStorage; pure frontend
   for now, backend-syncable once auth ships.

   Integrates with the Attribution Desk: positions here become the
   PAPER preset over there, so the reader's actual bets get the
   Brinson-Fachler treatment alongside the canned portfolios.

   Layout (mobile-first):
     [4 KPI tiles]    total / day P&L / total P&L / cash
     [+ BUY POSITION] inline form, subnet + shares
     [positions table on desktop / cards on mobile]
     [PORTFOLIO VALUE 30D sparkline]
     [SECTOR TILT vs NETWORK]
     [INSIGHTS strip]  best / worst / most concentrated
   ================================================================= */

import { SUBNETS, subnetById } from '../../data/subnets.js';
import {
  buy, sell, reset,
  annotatePositions, summarize, sectorTilt, insights,
  STARTING_CASH,
} from '../../data/paper-portfolio.js';
/* 2026-05-18: multi-portfolio support per Rondo "CoinMarketCap
   has a feature where you can use paper money to track your
   portfolio and add different amounts of fake money." All
   load/save calls now route through the active-portfolio shim
   so a reader can create N portfolios with arbitrary starting
   amounts, switch between them, and watch each one's P&L
   independently. The default $100K portfolio stays at the
   original storage key — no migration needed. */
import {
  loadActivePortfolio as loadPaperState,
  saveActivePortfolio as savePaperState,
  listPortfolios,
  loadActiveId,
  saveActiveId,
  createPortfolio,
  deletePortfolio,
  DEFAULT_PORTFOLIO_ID,
} from '../../data/paper-portfolios.js';

const CAT_COLOR = {
  text:'#FF1E3C', vision:'#FF8094', audio:'#FFB85C', video:'#C8A8AD',
  multimodal:'#FF4D60', training:'#FF7A88', data:'#8B6B70',
  search:'#5BE599', finance:'#00E5A8', agents:'#FFB0BA',
  robotics:'#FF8C42', science:'#FFB85C', infra:'#C11128',
  prediction:'#F5E5E8',
};
const catColor = c => CAT_COLOR[c] || '#FF1E3C';
const CAT_LABEL = {
  text:'TEXT', vision:'VISION', audio:'AUDIO', video:'VIDEO',
  multimodal:'MULTIMODAL', training:'TRAINING', data:'DATA',
  search:'SEARCH', finance:'FINANCE', agents:'AGENTS',
  robotics:'ROBOTICS', science:'SCIENCE', infra:'INFRA',
  prediction:'PREDICTION',
};
const catLabel = c => CAT_LABEL[c] || (c || '').toUpperCase();

/* ---------- formatters --------------------------------------- */

const fmtUsd = n => {
  if (n == null || !Number.isFinite(n)) return '·';
  const sign = n < 0 ? '-' : '';
  const abs  = Math.abs(n);
  if (abs >= 1e9) return sign + '$' + (abs/1e9).toFixed(2) + 'B';
  if (abs >= 1e6) return sign + '$' + (abs/1e6).toFixed(2) + 'M';
  if (abs >= 1e3) return sign + '$' + (abs/1e3).toFixed(2) + 'K';
  return sign + '$' + abs.toFixed(2);
};
const fmtUsdSigned = n => (n == null || !Number.isFinite(n)) ? '·'
  : (n >= 0 ? '+' : '−') + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtPct  = v => v == null || !Number.isFinite(v) ? '·' : (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
const fmtShares = n => n == null ? '·' : n >= 1000 ? n.toFixed(0) : n.toFixed(2);
const cls   = v => v == null ? 'is-flat' : (v > 0 ? 'is-up' : v < 0 ? 'is-down' : 'is-flat');
const arrow = v => v == null ? '·' : (v > 0.001 ? '▲' : v < -0.001 ? '▼' : '—');

/* ---------- pseudo-historical portfolio value series --------
   Until the DataLayer + TaoStats wiring lands, the chart shows
   each position's contribution to today's value extrapolated
   backwards by their chg30. Imperfect but directionally honest:
   tells the reader "this is roughly where you'd be over the
   trailing 30d if you'd held these positions the whole time."
   The header labels this as "approximate" so nobody mistakes it
   for a true mark-to-market history. */
function syntheticValueSeries(annotated, currentTotal, days = 30){
  if (!annotated.length || currentTotal <= 0){
    return Array.from({length: days}, () => currentTotal);
  }
  const series = [];
  for (let i = 0; i < days; i++){
    const t = i / (days - 1); // 0 .. 1
    // value at day i ≈ sum of each position's value at day i,
    // where day-i value = current * (1 - chg30%/100 * (1 - t))
    let v = 0;
    for (const p of annotated){
      const r30 = (p.chg30 || 0) / 100;
      // multiplicative backwards-walk: today's value / (1+r30) gets the 30d-ago value
      const dayBackProgress = 1 - t; // 1 at day 0, 0 at today
      const factor = 1 - r30 * dayBackProgress;
      v += p.value * factor;
    }
    series.push(Math.max(0, v));
  }
  return series;
}

function svgSpark(values, w = 320, h = 80, color = '#5BE599'){
  if (!values || values.length < 2) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const line = pts.join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" class="paper-spark__svg">
    <defs>
      <linearGradient id="paper-spark-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${color}" stop-opacity=".34"/>
        <stop offset="1" stop-color="${color}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <polygon points="0,${h} ${line} ${w},${h}" fill="url(#paper-spark-grad)"/>
    <polyline points="${line}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

/* ---------- main render -------------------------------------- */

export function renderPaperPortfolio(){
  const state     = loadPaperState();
  const annotated = annotatePositions(state);
  const sum       = summarize(state);
  const tilt      = sectorTilt(state);
  const ins       = insights(state);

  const subnetOptions = SUBNETS.slice()
    .sort((a,b) => b.emission - a.emission)
    .map(s => `<option value="${s.netuid}">SN${s.netuid} · ${s.name} · $${(s.price||0).toFixed(2)}</option>`)
    .join('');

  const metricTiles = [
    {
      lbl: 'PORTFOLIO VALUE',
      val: fmtUsd(sum.total),
      cls: '',
      note: `equity ${fmtUsd(sum.equity)} + cash ${fmtUsd(sum.cashUSD)}`,
    },
    {
      lbl: 'DAY P&L',
      val: fmtUsdSigned(sum.dayChangeUSD),
      cls: cls(sum.dayChangeUSD),
      note: `${arrow(sum.dayChangeUSD)} ${fmtPct(sum.dayChangePct)} · 24h mark-to-mark`,
    },
    {
      lbl: 'TOTAL P&L',
      val: fmtUsdSigned(sum.pnl),
      cls: cls(sum.pnl),
      note: `${fmtPct(sum.pnlPct)} vs cost basis · ${sum.positionCount} positions`,
    },
    {
      lbl: 'CASH',
      val: fmtUsd(sum.cashUSD),
      cls: '',
      note: `${fmtPct(sum.totalReturnPct)} since $${(STARTING_CASH/1000).toFixed(0)}K start`,
    },
  ].map(m => `
    <div class="paper-kpi">
      <div class="paper-kpi__lbl">${m.lbl}</div>
      <div class="paper-kpi__val ${m.cls}">${m.val}</div>
      <div class="paper-kpi__note">${m.note}</div>
    </div>`).join('');

  // Positions
  const emptyState = `
    <div class="paper-empty">
      <div class="paper-empty__big">No positions yet.</div>
      <div class="paper-empty__sub">You have ${fmtUsd(STARTING_CASH)} of paper cash. Tap <strong>+ BUY POSITION</strong> below to put it to work, then come back here to watch your bets play out against the live network.</div>
    </div>`;

  // Desktop table
  const tableRows = annotated.map(p => `
    <tr class="paper-table__row" data-pos="${p.netuid}">
      <td class="paper-table__sn">
        <span class="paper-table__sw" style="background:${catColor(p.cat)}"></span>
        SN${p.netuid}
      </td>
      <td class="paper-table__name">${p.name}</td>
      <td class="paper-table__num">${fmtShares(p.shares)} α</td>
      <td class="paper-table__num">$${p.avgCost.toFixed(2)}</td>
      <td class="paper-table__num">$${p.mark.toFixed(2)}</td>
      <td class="paper-table__num paper-table__num--value">${fmtUsd(p.value)}</td>
      <td class="paper-table__num ${cls(p.chg24)}">${fmtPct(p.chg24)}</td>
      <td class="paper-table__num ${cls(p.pnl)} paper-table__num--pnl">${fmtUsdSigned(p.pnl)}</td>
      <td class="paper-table__num ${cls(p.pnlPct)}">${fmtPct(p.pnlPct)}</td>
      <td class="paper-table__act">
        <button type="button" class="paper-table__sell" data-sell="${p.netuid}">SELL</button>
      </td>
    </tr>`).join('');

  // Mobile cards
  const positionCards = annotated.map(p => `
    <div class="paper-card" data-pos="${p.netuid}">
      <div class="paper-card__head">
        <span class="paper-card__sw" style="background:${catColor(p.cat)}"></span>
        <span class="paper-card__sn">SN${p.netuid}</span>
        <span class="paper-card__name">${p.name}</span>
        <span class="paper-card__pct ${cls(p.pnlPct)}">${fmtPct(p.pnlPct)}</span>
      </div>
      <div class="paper-card__grid">
        <div><span>SHARES</span><b>${fmtShares(p.shares)} α</b></div>
        <div><span>AVG COST</span><b>$${p.avgCost.toFixed(2)}</b></div>
        <div><span>MARK</span><b>$${p.mark.toFixed(2)}</b></div>
        <div><span>24H</span><b class="${cls(p.chg24)}">${fmtPct(p.chg24)}</b></div>
        <div><span>VALUE</span><b>${fmtUsd(p.value)}</b></div>
        <div><span>P&L</span><b class="${cls(p.pnl)}">${fmtUsdSigned(p.pnl)}</b></div>
      </div>
      <div class="paper-card__foot">
        <button type="button" class="paper-card__sell" data-sell="${p.netuid}">SELL</button>
      </div>
    </div>`).join('');

  const positionsHtml = annotated.length ? `
    <div class="paper-positions">
      <div class="paper-table-wrap">
        <table class="paper-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>NAME</th>
              <th class="paper-table__num">SHARES</th>
              <th class="paper-table__num">AVG COST</th>
              <th class="paper-table__num">MARK</th>
              <th class="paper-table__num">VALUE</th>
              <th class="paper-table__num">24H</th>
              <th class="paper-table__num">P&L</th>
              <th class="paper-table__num">P&L %</th>
              <th></th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
      <div class="paper-cards">${positionCards}</div>
    </div>
  ` : emptyState;

  // Sector tilt rows
  const tiltRows = tilt.length ? tilt.map(t => {
    const wMax = 60;
    const portLen = Math.min(wMax, (t.w_P / 50) * wMax);
    const benchLen = Math.min(wMax, (t.w_B / 50) * wMax);
    return `
      <li class="paper-tilt__row">
        <div class="paper-tilt__lbl">
          <span class="paper-tilt__sw" style="background:${catColor(t.cat)}"></span>
          ${catLabel(t.cat)}
        </div>
        <div class="paper-tilt__bars">
          <div class="paper-tilt__bar paper-tilt__bar--port" style="width:${portLen.toFixed(1)}%"></div>
          <div class="paper-tilt__bar paper-tilt__bar--bench" style="width:${benchLen.toFixed(1)}%"></div>
        </div>
        <div class="paper-tilt__nums">
          <span class="paper-tilt__port">${t.w_P.toFixed(1)}%</span>
          <span class="paper-tilt__bench">${t.w_B.toFixed(1)}%</span>
          <span class="paper-tilt__tilt ${cls(t.tilt)}">${(t.tilt >= 0 ? '+' : '') + t.tilt.toFixed(1)}%</span>
        </div>
      </li>`;
  }).join('') : `<li class="paper-tilt__empty">Buy your first position to see how your sector mix compares to the network.</li>`;

  // Insights
  const insightsHtml = annotated.length ? `
    <div class="paper-ins">
      <div class="paper-ins__card">
        <div class="paper-ins__lbl">BEST POSITION</div>
        <div class="paper-ins__big">SN${ins.best.netuid} · ${ins.best.name}</div>
        <div class="paper-ins__val ${cls(ins.best.pnlPct)}">${fmtPct(ins.best.pnlPct)}</div>
      </div>
      <div class="paper-ins__card">
        <div class="paper-ins__lbl">WORST POSITION</div>
        <div class="paper-ins__big">SN${ins.worst.netuid} · ${ins.worst.name}</div>
        <div class="paper-ins__val ${cls(ins.worst.pnlPct)}">${fmtPct(ins.worst.pnlPct)}</div>
      </div>
      <div class="paper-ins__card">
        <div class="paper-ins__lbl">MOST CONCENTRATED</div>
        <div class="paper-ins__big">SN${ins.mostConcentrated.netuid} · ${ins.mostConcentrated.name}</div>
        <div class="paper-ins__val">${ins.mostConcentrated.pctOfPortfolio.toFixed(1)}% of portfolio</div>
      </div>
    </div>` : '';

  // Portfolio value series
  const valSeries = syntheticValueSeries(annotated, sum.total, 30);
  const sparkColor = sum.pnl >= 0 ? '#00E5A8' : '#FF4D60';
  const sparkHtml  = annotated.length ? svgSpark(valSeries, 320, 80, sparkColor) : '';

  /* Multi-portfolio switcher (2026-05-18) — dropdown + create
     button + delete (for non-default). CMC-style: reader can
     run several theoretical portfolios with different starting
     amounts side by side. */
  const portfolios = listPortfolios();
  const activeId   = loadActiveId();
  const active     = portfolios.find(p => p.id === activeId) || portfolios[0];
  const portfolioOptions = portfolios.map(p => {
    const isActive = p.id === activeId;
    const startTxt = p.startingCash >= 1e6
      ? '$' + (p.startingCash/1e6).toFixed(1) + 'M'
      : p.startingCash >= 1e3
        ? '$' + (p.startingCash/1e3).toFixed(0) + 'K'
        : '$' + p.startingCash.toFixed(0);
    const escName = (p.name || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
    return `<option value="${p.id}"${isActive ? ' selected' : ''}>${escName} · ${startTxt}</option>`;
  }).join('');
  const canDelete  = active && active.id !== DEFAULT_PORTFOLIO_ID;

  return `
    <section class="paper" data-paper-root>
      <header class="paper__head">
        <div class="paper__title">
          <span class="paper__eyebrow">⊕ PAPER PORTFOLIO</span>
          <h2 class="paper__h">Your positions, scored against the live market.</h2>
          <div class="paper__sub">Mock-trading account. CoinMarketCap-style: spin up multiple portfolios with any starting amount, switch between them, watch each one's P&L mark-to-mark. Persists in your browser; backend sync ships with the auth layer.</div>
        </div>
        <div class="paper__pulse">
          <span class="paper__pulse-dot"></span>
          <span class="paper__pulse-txt">PAPER</span>
        </div>
      </header>

      <div class="paper-pswitch" data-paper-pswitch>
        <label class="paper-pswitch__lbl" for="paper-pswitch-sel">PORTFOLIO</label>
        <select class="paper-pswitch__sel" id="paper-pswitch-sel" data-paper-pswitch-sel>${portfolioOptions}</select>
        <button type="button" class="paper-pswitch__btn paper-pswitch__btn--new" data-paper-pswitch-new>+ NEW</button>
        ${canDelete ? `<button type="button" class="paper-pswitch__btn paper-pswitch__btn--del" data-paper-pswitch-del aria-label="Delete this portfolio">DELETE</button>` : ''}
      </div>
      <form class="paper-pswitch-new" data-paper-pswitch-newform style="display:none">
        <div class="paper-pswitch-new__row">
          <label class="paper-pswitch-new__lbl">NAME
            <input class="paper-pswitch-new__inp" type="text" maxlength="40" placeholder="Aggressive AI book · $250K" data-paper-pswitch-name>
          </label>
          <label class="paper-pswitch-new__lbl">STARTING CASH (USD)
            <input class="paper-pswitch-new__inp" type="number" min="100" max="100000000" step="100" placeholder="250000" data-paper-pswitch-cash>
          </label>
          <button type="submit" class="paper-pswitch-new__submit">CREATE</button>
          <button type="button" class="paper-pswitch-new__cancel" data-paper-pswitch-cancel>cancel</button>
        </div>
      </form>

      <div class="paper-kpis">${metricTiles}</div>

      <div class="paper-actions">
        <button type="button" class="paper-btn paper-btn--buy" data-paper-buy-toggle>+ BUY POSITION</button>
        <button type="button" class="paper-btn paper-btn--reset" data-paper-reset>RESET</button>
        <div class="paper-actions__meta">Real cash is never at risk. Watch how your decisions would actually play out, decide whether you'd trust them with the real thing.</div>
      </div>

      <form class="paper-buyform" data-paper-buyform style="display:none">
        <div class="paper-buyform__row">
          <label class="paper-buyform__lbl">SUBNET
            <select class="paper-buyform__sel" data-paper-sel-netuid>${subnetOptions}</select>
          </label>
          <label class="paper-buyform__lbl">SHARES
            <input class="paper-buyform__inp" type="number" min="0.01" step="any" data-paper-inp-shares placeholder="e.g. 100"/>
          </label>
        </div>
        <div class="paper-buyform__summary" data-paper-buy-summary>Choose a subnet and shares to see the cost.</div>
        <div class="paper-buyform__row">
          <button type="button" class="paper-btn paper-btn--confirm" data-paper-confirm>CONFIRM BUY</button>
          <button type="button" class="paper-btn paper-btn--cancel" data-paper-cancel>CANCEL</button>
        </div>
      </form>

      ${positionsHtml}

      <!-- PORTFOLIO VALUE · 30D sparkline removed 2026-05-18
           per Rondo "we dont need two paper charts only one." The
           cockpit's main chart pane now carries a SUBNET ↔
           PORTFOLIO mode toggle that swaps the aggregate paper
           portfolio value series into the same canvas as the
           subnet α-price chart. One chart, two modes — no
           duplicate sparkline in the DESK pane. -->


      <div class="paper-tilt-panel">
        <div class="paper-tilt-panel__head">
          <span class="paper-tilt-panel__lbl">SECTOR TILT · paper vs network</span>
          <span class="paper-tilt-panel__meta">overweight (+) means more concentrated than the network avg</span>
        </div>
        <div class="paper-tilt__legend">
          <span><span class="paper-tilt__sw paper-tilt__sw--port"></span>YOUR PAPER</span>
          <span><span class="paper-tilt__sw paper-tilt__sw--bench"></span>NETWORK</span>
          <span style="margin-left:auto;color:var(--c-ink-3);font-style:italic;font-family:var(--f-sans)">emission-weighted</span>
        </div>
        <ul class="paper-tilt">${tiltRows}</ul>
      </div>

      ${insightsHtml}
    </section>
  `;
}

/* ---------- wire --------------------------------------------- */

/**
 * @param {HTMLElement} root
 * @param {Function}    onChange  called when state changes so caller
 *                                can repaint the section + any other
 *                                section that depends on the paper
 *                                portfolio (eg the Attribution Desk).
 */
export function wirePaperPortfolio(root, onChange){
  const sec = root.querySelector('[data-paper-root]');
  if (!sec) return;

  /* ---------- multi-portfolio switcher --------------------- */
  const pSel       = sec.querySelector('[data-paper-pswitch-sel]');
  const pNewBtn    = sec.querySelector('[data-paper-pswitch-new]');
  const pDelBtn    = sec.querySelector('[data-paper-pswitch-del]');
  const pNewForm   = sec.querySelector('[data-paper-pswitch-newform]');
  const pCancelBtn = sec.querySelector('[data-paper-pswitch-cancel]');
  const pNameInp   = sec.querySelector('[data-paper-pswitch-name]');
  const pCashInp   = sec.querySelector('[data-paper-pswitch-cash]');

  if (pSel){
    pSel.addEventListener('change', () => {
      saveActiveId(pSel.value);
      if (typeof onChange === 'function') onChange();
    });
  }
  if (pNewBtn && pNewForm){
    pNewBtn.addEventListener('click', () => {
      pNewForm.style.display = '';
      pNameInp?.focus();
    });
  }
  if (pCancelBtn && pNewForm){
    pCancelBtn.addEventListener('click', () => {
      pNewForm.style.display = 'none';
      if (pNameInp) pNameInp.value = '';
      if (pCashInp) pCashInp.value = '';
    });
  }
  if (pNewForm){
    pNewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (pNameInp?.value || '').trim();
      const cash = Number(pCashInp?.value || '');
      if (!Number.isFinite(cash) || cash <= 0){
        pCashInp?.focus();
        pCashInp?.classList.add('is-bad');
        return;
      }
      try {
        createPortfolio(name, cash);
        if (typeof onChange === 'function') onChange();
      } catch (_) { /* silently swallow — UI already validated */ }
    });
  }
  if (pDelBtn){
    pDelBtn.addEventListener('click', () => {
      const id = loadActiveId();
      if (id === DEFAULT_PORTFOLIO_ID) return;
      /* Brief confirm to avoid accidental destruction of a paper
         track record. */
      if (!window.confirm('Delete this portfolio permanently? Track record will be lost.')) return;
      deletePortfolio(id);
      if (typeof onChange === 'function') onChange();
    });
  }

  const toggle  = sec.querySelector('[data-paper-buy-toggle]');
  const form    = sec.querySelector('[data-paper-buyform]');
  const sel     = sec.querySelector('[data-paper-sel-netuid]');
  const inp     = sec.querySelector('[data-paper-inp-shares]');
  const summary = sec.querySelector('[data-paper-buy-summary]');
  const confirm = sec.querySelector('[data-paper-confirm]');
  const cancel  = sec.querySelector('[data-paper-cancel]');
  const resetBt = sec.querySelector('[data-paper-reset]');

  const updateSummary = () => {
    const netuid = parseInt(sel.value, 10);
    const shares = parseFloat(inp.value);
    const s = subnetById(netuid);
    if (!s || !Number.isFinite(shares) || shares <= 0){
      summary.textContent = 'Choose a subnet and shares to see the cost.';
      summary.classList.remove('is-bad');
      return;
    }
    const cost = shares * (s.price || 0);
    const state = loadPaperState();
    const after = state.cashUSD - cost;
    const insufficient = after < 0;
    summary.innerHTML = insufficient
      ? `Buying <b>${fmtShares(shares)} α</b> of <b>${s.name}</b> at $${(s.price||0).toFixed(2)} = <b>${fmtUsd(cost)}</b>. Cash after: <b class="is-down">${fmtUsd(after)}</b> &mdash; not enough paper cash.`
      : `Buying <b>${fmtShares(shares)} α</b> of <b>${s.name}</b> at $${(s.price||0).toFixed(2)} = <b>${fmtUsd(cost)}</b>. Cash after: <b>${fmtUsd(after)}</b>.`;
    summary.classList.toggle('is-bad', insufficient);
  };

  if (toggle){
    toggle.addEventListener('click', () => {
      const visible = form.style.display !== 'none';
      form.style.display = visible ? 'none' : 'block';
      toggle.classList.toggle('is-on', !visible);
      if (!visible) inp.focus();
    });
  }
  if (sel) sel.addEventListener('change', updateSummary);
  if (inp) inp.addEventListener('input', updateSummary);
  if (cancel){
    cancel.addEventListener('click', () => {
      form.style.display = 'none';
      toggle.classList.remove('is-on');
      inp.value = '';
      summary.textContent = 'Choose a subnet and shares to see the cost.';
      summary.classList.remove('is-bad');
    });
  }
  if (confirm){
    confirm.addEventListener('click', () => {
      const netuid = parseInt(sel.value, 10);
      const shares = parseFloat(inp.value);
      const s = subnetById(netuid);
      if (!s || !Number.isFinite(shares) || shares <= 0){
        summary.textContent = 'Pick a subnet and enter a positive share count.';
        summary.classList.add('is-bad');
        return;
      }
      const state = loadPaperState();
      const next  = buy(state, netuid, shares, s.price || 0);
      if (next === state){
        summary.textContent = 'Not enough paper cash for that buy.';
        summary.classList.add('is-bad');
        return;
      }
      savePaperState(next);
      if (typeof onChange === 'function') onChange(next);
    });
  }
  if (resetBt){
    resetBt.addEventListener('click', () => {
      // No native confirm dialog here so iOS doesn't double-prompt;
      // require a second click within 4s to actually wipe.
      if (!resetBt.classList.contains('is-armed')){
        resetBt.classList.add('is-armed');
        resetBt.textContent = 'CLICK AGAIN TO WIPE';
        setTimeout(() => {
          resetBt.classList.remove('is-armed');
          resetBt.textContent = 'RESET';
        }, 4000);
        return;
      }
      const next = reset();
      savePaperState(next);
      if (typeof onChange === 'function') onChange(next);
    });
  }

  sec.querySelectorAll('[data-sell]').forEach(btn => {
    btn.addEventListener('click', () => {
      const netuid = parseInt(btn.dataset.sell, 10);
      const s = subnetById(netuid);
      const state = loadPaperState();
      const lot = state.positions.find(p => p.netuid === netuid);
      if (!s || !lot) return;
      const raw = window.prompt(
        `Sell SN${netuid} ${s.name}. You hold ${fmtShares(lot.shares)} α at avg cost $${lot.avgCost.toFixed(2)} (mark $${(s.price||0).toFixed(2)}). How many shares to sell? (max ${fmtShares(lot.shares)})`,
        String(lot.shares)
      );
      if (raw == null) return;
      const sharesToSell = parseFloat(raw);
      if (!Number.isFinite(sharesToSell) || sharesToSell <= 0) return;
      const next = sell(state, netuid, sharesToSell, s.price || 0);
      savePaperState(next);
      if (typeof onChange === 'function') onChange(next);
    });
  });
}
