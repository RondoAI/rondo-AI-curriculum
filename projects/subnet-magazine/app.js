/* =================================================================
   SUBNET MAGAZINE — APP.JS
   All client behavior in one file. No build step, no dependencies.
   Sections:
     1. Data — mock subnet directory and ticker
     2. Utility — formatters, reduced-motion check
     3. Cover canvas — network animation
     4. Ticker — scrolling band content
     5. Stats — counter-up animation
     6. SOTW chart — line chart for the subnet of the week
     7. Directory — render, filter, sort
     8. Emissions canvas — flow / treemap-ish viz
     9. Scroll reveal + active-nav + back-to-top
    10. Subscribe form (demo)
    11. TAO live-ish price wobble
   ================================================================= */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. DATA ----------
     SUBNETS data is loaded from subnets.js (window.SUBNETS_DATA) so
     it can be refreshed without touching app code. CATEGORIES holds
     the semantic color/label/description for each subnet category.
     Each row carries a `change` alias matching the legacy field name
     used throughout the rest of this file. */
  const SUBNETS = (window.SUBNETS_DATA || []).map(s => ({
    ...s,
    change: s.chg24 ?? s.change ?? 0,
  }));
  const CATEGORIES = window.CATEGORIES || {};
  function catLabel(c){ return CATEGORIES[c]?.label || c; }
  function catColor(c){ return CATEGORIES[c]?.color || '#94A3B8'; }
  function catGlow(c){  return CATEGORIES[c]?.glow  || 'rgba(148,163,184,.35)'; }

  /* ---------- 2. UTILITIES ---------- */
  const fmt = {
    comma: n => n.toLocaleString('en-US'),
    compact: n => {
      if (n >= 1e9) return (n/1e9).toFixed(2)+'B';
      if (n >= 1e6) return (n/1e6).toFixed(2)+'M';
      if (n >= 1e3) return (n/1e3).toFixed(1)+'K';
      return n.toFixed(0);
    },
    pct: n => (n>=0?'+':'')+n.toFixed(2)+'%',
    money: n => '$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}),
  };

  /* ---------- 3. COVER CANVAS — animated network ---------- */
  function initCoverCanvas(){
    const canvas = document.getElementById('cover-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr, nodes, t = 0;

    const COLORS = ['#FF1E3C','#FF6B7A','#C11128','#FF4D60'];
    const NODE_N = 64;

    function resize(){
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    function makeNodes(){
      nodes = Array.from({length:NODE_N}, () => ({
        x: Math.random()*w,
        y: Math.random()*h,
        vx: (Math.random()-.5)*.18,
        vy: (Math.random()-.5)*.18,
        r: Math.random()*1.4 + .8,
        c: COLORS[Math.floor(Math.random()*COLORS.length)],
        phase: Math.random()*Math.PI*2,
      }));
    }
    function frame(){
      t += 0.005;
      ctx.clearRect(0,0,w,h);
      // edges
      for (let i=0;i<nodes.length;i++){
        for (let j=i+1;j<nodes.length;j++){
          const a = nodes[i], b = nodes[j];
          const dx = a.x-b.x, dy = a.y-b.y;
          const d2 = dx*dx + dy*dy;
          const maxD = 140;
          if (d2 < maxD*maxD){
            const alpha = (1 - Math.sqrt(d2)/maxD) * 0.18;
            ctx.strokeStyle = `rgba(244,241,234,${alpha})`;
            ctx.lineWidth = .6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // nodes
      for (const n of nodes){
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const pulse = 1 + Math.sin(t*2 + n.phase) * 0.3;
        ctx.beginPath();
        ctx.fillStyle = n.c;
        ctx.shadowColor = n.c; ctx.shadowBlur = 12;
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      if (!reduceMotion) requestAnimationFrame(frame);
    }
    function onResize(){ resize(); makeNodes(); }
    window.addEventListener('resize', onResize);
    resize(); makeNodes(); frame();
  }

  /* ---------- 4. TICKER ---------- */
  function initTicker(){
    const track = document.getElementById('ticker-track');
    if (!track) return;
    const items = SUBNETS.map(s => {
      const cls = s.change >= 0 ? 'up' : 'down';
      const arrow = s.change >= 0 ? '▲' : '▼';
      return `<span class="tic-item">
        <span class="net">SN${s.netuid}</span>
        <span class="name">${s.name}</span>
        <span class="val">τ ${s.emission}</span>
        <span class="chg ${cls}">${arrow} ${fmt.pct(s.change)}</span>
      </span>`;
    }).join('');
    // double for seamless loop
    track.innerHTML = items + items;
  }

  /* ---------- 5. STAT COUNTERS ---------- */
  function initCounters(){
    const els = document.querySelectorAll('.stat-value');
    if (!els.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        if (el.dataset.done) return;
        el.dataset.done = '1';
        const target = +el.dataset.count;
        const format = el.dataset.format;
        const decimals = +(el.dataset.decimals || 0);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const dur = reduceMotion ? 0 : 1400;
        const start = performance.now();
        function render(now){
          const p = Math.min(1, (now - start) / Math.max(1,dur));
          const ease = 1 - Math.pow(1-p, 3);
          const v = target * ease;
          let txt;
          if (format === 'compact') txt = fmt.compact(v);
          else if (format === 'comma') txt = fmt.comma(Math.round(v));
          else txt = v.toFixed(decimals);
          el.textContent = `${prefix}${txt}${suffix}`;
          if (p < 1) requestAnimationFrame(render);
        }
        if (dur === 0){
          let txt;
          if (format === 'compact') txt = fmt.compact(target);
          else if (format === 'comma') txt = fmt.comma(target);
          else txt = target.toFixed(decimals);
          el.textContent = `${prefix}${txt}${suffix}`;
        } else {
          requestAnimationFrame(render);
        }
        observer.unobserve(el);
      });
    }, {threshold:.4});
    els.forEach(el => observer.observe(el));
  }

  /* ---------- 6. SOTW CHART ---------- */
  function initSotwChart(){
    const c = document.getElementById('sotw-canvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    let w, h, dpr;
    function resize(){
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w*dpr; c.height = h*dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      draw();
    }
    // mock data: 30 days, three series
    function gen(start, vol, drift){
      const arr = []; let v = start;
      for (let i=0;i<30;i++){
        v += (Math.random()-.5)*vol + drift;
        arr.push(v);
      }
      return arr;
    }
    const leader = gen(4.2, .12, -.04);
    const median = gen(5.6, .08, -.02);
    const best   = leader.map((v,i) => Math.min(v, ...leader.slice(0,i+1)));

    function draw(){
      ctx.clearRect(0,0,w,h);
      const pad = {l:46, r:18, t:14, b:28};
      const cw = w - pad.l - pad.r;
      const ch = h - pad.t - pad.b;
      const all = [...leader, ...median, ...best];
      const mn = Math.min(...all) - .15;
      const mx = Math.max(...all) + .15;
      // grid + y-axis labels
      ctx.strokeStyle = 'rgba(244,241,234,.06)';
      ctx.lineWidth = 1;
      ctx.fillStyle = 'rgba(244,241,234,.45)';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const ticks = 5;
      for (let i=0;i<=ticks;i++){
        const y = pad.t + ch * (i/ticks);
        ctx.beginPath();
        ctx.moveTo(pad.l, y); ctx.lineTo(w-pad.r, y); ctx.stroke();
        const val = mx - (mx-mn) * (i/ticks);
        ctx.fillText(val.toFixed(2), pad.l-8, y);
      }
      // x labels
      ctx.textAlign='center';
      ['30d ago','20d','10d','today'].forEach((lbl,i) => {
        const x = pad.l + cw * (i/3);
        ctx.fillText(lbl, x, h - 8);
      });

      function plot(series, color, width, fill){
        ctx.beginPath();
        series.forEach((v,i) => {
          const x = pad.l + cw * (i/(series.length-1));
          const y = pad.t + ch * (1 - (v - mn)/(mx-mn));
          if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        });
        if (fill){
          ctx.lineTo(pad.l + cw, pad.t+ch);
          ctx.lineTo(pad.l, pad.t+ch);
          ctx.closePath();
          const g = ctx.createLinearGradient(0, pad.t, 0, pad.t+ch);
          g.addColorStop(0, color+'55');
          g.addColorStop(1, color+'00');
          ctx.fillStyle = g; ctx.fill();
        } else {
          ctx.strokeStyle = color;
          ctx.lineWidth = width;
          ctx.lineJoin = 'round'; ctx.lineCap='round';
          ctx.stroke();
        }
      }
      // fills first
      plot(leader, '#F69537', 0, true);
      plot(median, '#7C5CFF', 2, false);
      plot(best,   '#34E0A1', 1.5, false);
      plot(leader, '#F69537', 2.5, false);

      // current marker on leader
      const last = leader[leader.length-1];
      const lx = pad.l + cw;
      const ly = pad.t + ch * (1 - (last - mn)/(mx-mn));
      ctx.fillStyle = '#F69537';
      ctx.shadowColor = '#F69537'; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(lx, ly, 4, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
    }
    window.addEventListener('resize', resize);
    // wait for layout to settle
    requestAnimationFrame(resize);
  }

  /* ---------- 7. DIRECTORY ---------- */
  function initDirectory(){
    const grid = document.getElementById('dir-grid');
    if (!grid) return;
    let state = {filter:'all', sort:'emission'};
    function render(){
      let rows = SUBNETS.slice();
      if (state.filter !== 'all') rows = rows.filter(r => r.cat === state.filter);
      rows.sort((a,b) => {
        if (state.sort === 'emission') return b.emission - a.emission;
        if (state.sort === 'change') return b.chg24 - a.chg24;
        if (state.sort === 'miners') return b.miners - a.miners;
        return a.netuid - b.netuid;
      });
      grid.innerHTML = rows.map(s => {
        const chgCls = s.chg24 >= 0 ? 'up' : 'down';
        const color = catColor(s.cat);
        return `<article class="dir-card" data-netuid="${s.netuid}" style="--cat-color:${color}">
          <div class="dir-card-head">
            <span class="dir-net">SN${s.netuid}</span>
            <span class="dir-cat" style="color:${color}">${catLabel(s.cat)}</span>
          </div>
          <h3 class="dir-name">${s.name}</h3>
          <p class="dir-desc">${s.desc}</p>
          <div class="dir-row">
            <span><span class="lbl">Emission</span><br><span class="val">τ ${s.emission}</span></span>
            <span><span class="lbl">Miners</span><br><span class="val">${fmt.comma(s.miners)}</span></span>
            <span><span class="lbl">24h</span><br><span class="val chg ${chgCls}">${fmt.pct(s.chg24)}</span></span>
          </div>
        </article>`;
      }).join('');
      // wire click → modal
      grid.querySelectorAll('.dir-card').forEach(el => {
        el.addEventListener('click', () => openSubnetModal(+el.dataset.netuid));
      });
    }
    document.querySelectorAll('.dir-filters .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.dir-filters .chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.filter = chip.dataset.filter;
        render();
      });
    });
    const sortSel = document.getElementById('sort');
    if (sortSel) sortSel.addEventListener('change', e => { state.sort = e.target.value; render(); });
    render();
  }

  /* ---------- 8. EMISSIONS VIZ — treemap-ish layout + list ---------- */
  function initEmissions(){
    const c = document.getElementById('emissions-canvas');
    const list = document.getElementById('em-list');
    if (!c) return;
    const ctx = c.getContext('2d');
    let w, h, dpr;

    // total emission share
    const top = SUBNETS.slice().sort((a,b)=>b.emission-a.emission).slice(0,12);
    const total = top.reduce((s,x)=>s+x.emission, 0);

    function squarify(items, x, y, ww, hh){
      // simple squarified treemap — recursive split on longer axis
      if (items.length === 0) return [];
      if (items.length === 1) return [{...items[0], x, y, w:ww, h:hh}];
      const sum = items.reduce((s,i)=>s+i.value, 0);
      let acc = 0, splitIdx = items.length;
      const half = sum / 2;
      for (let i=0;i<items.length;i++){
        acc += items[i].value;
        if (acc >= half){ splitIdx = i+1; break; }
      }
      const left = items.slice(0, splitIdx);
      const right = items.slice(splitIdx);
      const leftSum = left.reduce((s,i)=>s+i.value, 0);
      const ratio = leftSum / sum;
      if (ww >= hh){
        return [
          ...squarify(left,  x, y,                   ww*ratio,      hh),
          ...squarify(right, x+ww*ratio, y,          ww*(1-ratio),  hh),
        ];
      } else {
        return [
          ...squarify(left,  x, y,                   ww, hh*ratio),
          ...squarify(right, x, y+hh*ratio,          ww, hh*(1-ratio)),
        ];
      }
    }

    function colorFor(cat){ return catColor(cat); }

    function draw(){
      ctx.clearRect(0,0,w,h);
      const items = top.map(s => ({...s, value:s.emission}));
      const cells = squarify(items, 0, 0, w, h);
      const gap = 3;
      cells.forEach(cell => {
        const cw = Math.max(0, cell.w - gap);
        const ch = Math.max(0, cell.h - gap);
        // background
        const c1 = colorFor(cell.cat);
        const grad = ctx.createLinearGradient(cell.x, cell.y, cell.x+cw, cell.y+ch);
        grad.addColorStop(0, c1 + 'EE');
        grad.addColorStop(1, c1 + '88');
        ctx.fillStyle = grad;
        roundRect(ctx, cell.x, cell.y, cw, ch, 6);
        ctx.fill();
        // labels (only if big enough)
        if (cw > 80 && ch > 40){
          ctx.fillStyle = 'rgba(11,11,15,.85)';
          ctx.font = '600 11px JetBrains Mono, monospace';
          ctx.textBaseline = 'top'; ctx.textAlign = 'left';
          ctx.fillText(`SN${cell.netuid}`, cell.x+10, cell.y+10);
          ctx.font = '400 18px Fraunces, serif';
          ctx.fillText(cell.name, cell.x+10, cell.y+26);
          if (ch > 70){
            ctx.font = '500 12px JetBrains Mono, monospace';
            ctx.fillStyle = 'rgba(11,11,15,.7)';
            ctx.fillText(`τ ${cell.emission}  ·  ${((cell.emission/total)*100).toFixed(1)}%`, cell.x+10, cell.y+ch-22);
          }
        }
      });
    }
    function roundRect(ctx,x,y,w,h,r){
      r = Math.min(r, w/2, h/2);
      ctx.beginPath();
      ctx.moveTo(x+r,y);
      ctx.arcTo(x+w,y,x+w,y+h,r);
      ctx.arcTo(x+w,y+h,x,y+h,r);
      ctx.arcTo(x,y+h,x,y,r);
      ctx.arcTo(x,y,x+w,y,r);
      ctx.closePath();
    }
    function resize(){
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w*dpr; c.height = h*dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      draw();
    }
    window.addEventListener('resize', resize);
    requestAnimationFrame(resize);

    // top emitters list
    if (list){
      list.innerHTML = top.slice(0,8).map((s,i) => {
        const pct = ((s.emission/total)*100).toFixed(1);
        return `<li class="em-row">
          <span class="em-rank">${i+1}</span>
          <span>
            <span class="em-name">${s.name}</span>
            <span class="em-sub">SN${s.netuid} · ${s.cat}</span>
          </span>
          <span class="em-pct">${pct}%</span>
        </li>`;
      }).join('');
    }
  }

  /* ---------- 9. SCROLL REVEAL + ACTIVE NAV + BACK TO TOP ---------- */
  function initReveal(){
    document.querySelectorAll('section, article.feature, .stat-card, .voice, .research-item').forEach(el => el.classList.add('reveal'));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, {threshold:.08});
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  function initActiveNav(){
    const links = Array.from(document.querySelectorAll('.primary-nav .nav-link'));
    const sections = links
      .map(l => {
        const id = l.getAttribute('href').replace('#','');
        return {link:l, el: document.getElementById(id)};
      })
      .filter(s => s.el);
    if (!sections.length) return;
    function onScroll(){
      const y = window.scrollY + 120;
      let cur = sections[0];
      for (const s of sections){
        if (s.el.offsetTop <= y) cur = s;
      }
      links.forEach(l => l.classList.remove('active'));
      cur.link.classList.add('active');
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  function initBackToTop(){
    const btn = document.getElementById('to-top');
    if (!btn) return;
    btn.addEventListener('click', () => window.scrollTo({top:0, behavior:reduceMotion?'auto':'smooth'}));
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) btn.classList.add('visible');
      else btn.classList.remove('visible');
    }, {passive:true});
  }

  /* ---------- 10. SUBSCRIBE FORM ---------- */
  function initSubscribe(){
    const form = document.getElementById('sub-form');
    const msg = document.getElementById('sub-msg');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('sub-email').value.trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      msg.classList.remove('ok','err');
      if (!ok){
        msg.textContent = 'That email does not look right. Try again.';
        msg.classList.add('err');
        return;
      }
      msg.textContent = `Thanks — we would have added ${email} to the list. This is a demo build.`;
      msg.classList.add('ok');
      form.reset();
    });
  }

  /* ---------- 11. TAO PRICE — live via DataLayer (CoinGecko), sim fallback ---------- */
  function initTaoPrice(){
    const priceEl = document.getElementById('tao-price');
    const deltaEl = document.getElementById('tao-delta');
    if (!priceEl || !deltaEl) return;
    function render(d){
      if (!d) return;
      priceEl.textContent = '$' + d.price.toFixed(2);
      const sign = d.change24 >= 0 ? '+' : '';
      deltaEl.textContent = `${sign}${d.change24.toFixed(2)}%`;
      deltaEl.classList.toggle('up',  d.change24 >= 0);
      deltaEl.classList.toggle('down', d.change24 < 0);
      priceEl.title = `Source: ${d.source} · updated ${new Date(d.lastUpdated).toLocaleTimeString()}`;
    }
    if (window.SubnetData) {
      window.SubnetData.subscribe('tao:price', render);
    }
  }

  /* ---------- 11b. BLOCK HEIGHT — live via DataLayer, sim fallback ---------- */
  function initBlockSubscriber(){
    const blockEl = document.getElementById('util-block');
    if (!blockEl || !window.SubnetData) return;
    window.SubnetData.subscribe('tao:block', d => {
      if (!d || typeof d.height !== 'number') return;
      blockEl.textContent = d.height.toLocaleString('en-US');
      blockEl.title = `Source: ${d.source}`;
    });
  }

  /* ---------- 12. UTC CLOCK ---------- */
  function initClock(){
    const clockEl = document.getElementById('util-clock');
    if (!clockEl) return;
    function tick(){
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2,'0');
      const mm = String(d.getUTCMinutes()).padStart(2,'0');
      const ss = String(d.getUTCSeconds()).padStart(2,'0');
      clockEl.textContent = `${hh}:${mm}:${ss}`;
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- 13. QUOTE BOARD ---------- */
  function initQuoteBoard(){
    const tbody = document.getElementById('quote-tbody');
    if (!tbody) return;

    // Build market state from SUBNETS — add simulated price + 7d change + sparkline series
    const market = SUBNETS.map(s => {
      const series = [];
      let p = (s.emission / 100) * (0.8 + Math.random()*0.6);  // crude α-price proxy
      for (let i=0;i<24;i++){
        p *= 1 + (Math.random()-.5) * 0.025;
        series.push(p);
      }
      const last = series[series.length-1];
      const first = series[0];
      const chg7 = ((last - first) / first) * 100;
      return {
        ...s,
        price: last,
        chg24: s.change,
        chg7: chg7,
        series,
        validators: Math.floor(s.miners * (0.18 + Math.random()*0.10)),
      };
    });

    function sparkSVG(series, color){
      const w = 80, h = 22, pad = 1;
      const mn = Math.min(...series), mx = Math.max(...series);
      const pts = series.map((v,i) => {
        const x = pad + (w-2*pad) * (i/(series.length-1));
        const y = pad + (h-2*pad) * (1 - (v-mn)/Math.max(1e-9, mx-mn));
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
      return `<svg class="spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">
        <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/>
      </svg>`;
    }

    function render(){
      tbody.innerHTML = market.map(s => {
        const up24 = s.chg24 >= 0;
        const up7  = s.chg7  >= 0;
        const sparkColor = up7 ? '#00E5A8' : '#FF4D6D';
        return `<tr data-net="${s.netuid}">
          <td class="net">SN${s.netuid}</td>
          <td class="name">${s.name}</td>
          <td class="cat" style="color:${catColor(s.cat)}">${catLabel(s.cat)}</td>
          <td class="num">$${s.price.toFixed(2)}</td>
          <td class="num">τ ${s.emission}</td>
          <td class="num miners-col">${fmt.comma(s.miners)}</td>
          <td class="num chg ${up24?'up':'down'}">${up24?'+':''}${s.chg24.toFixed(2)}%</td>
          <td class="num chg ${up7?'up':'down'}">${up7?'+':''}${s.chg7.toFixed(2)}%</td>
          <td class="num">${sparkSVG(s.series, sparkColor)}</td>
        </tr>`;
      }).join('');
      // click row → subnet detail modal
      tbody.querySelectorAll('tr[data-net]').forEach(tr => {
        tr.style.cursor = 'pointer';
        tr.addEventListener('click', () => openSubnetModal(+tr.dataset.net));
      });
    }
    render();

    // Live wobble — every 1.4s tick a few rows
    if (!reduceMotion){
      setInterval(() => {
        const n = 2 + Math.floor(Math.random()*3);
        for (let i=0;i<n;i++){
          const idx = Math.floor(Math.random() * market.length);
          const s = market[idx];
          const drift = (Math.random()-.5) * 0.02;
          s.price = Math.max(0.01, s.price * (1+drift));
          s.chg24 += drift*100*0.4;
          s.series.shift();
          s.series.push(s.price);
          s.chg7 = ((s.price - s.series[0]) / s.series[0]) * 100;
          const row = tbody.querySelector(`tr[data-net="${s.netuid}"]`);
          if (row){
            const tds = row.children;
            tds[3].textContent = '$'+s.price.toFixed(2);
            const up24 = s.chg24 >= 0;
            const up7  = s.chg7  >= 0;
            tds[6].className = 'num chg ' + (up24?'up':'down');
            tds[6].textContent = (up24?'+':'') + s.chg24.toFixed(2) + '%';
            tds[7].className = 'num chg ' + (up7?'up':'down');
            tds[7].textContent = (up7?'+':'') + s.chg7.toFixed(2) + '%';
            tds[8].innerHTML = sparkSVG(s.series, up7?'#00E5A8':'#FF4D6D');
            row.classList.remove('row-flash-up','row-flash-down');
            // force reflow so animation replays
            void row.offsetWidth;
            row.classList.add(drift >= 0 ? 'row-flash-up' : 'row-flash-down');
          }
        }
      }, 1400);
    }
  }

  /* ---------- 14. TAO TERMINAL PANELS ---------- */
  function nowStamp(){
    const d = new Date();
    return `${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}:${String(d.getUTCSeconds()).padStart(2,'0')}`;
  }

  function initTerminal(){
    initPanelMovers();
    initPanelStream();
    initPanelHeatmap();
    initPanelEmissionsMini();
  }

  function initPanelMovers(){
    const tbody = document.querySelector('#movers-tbl tbody');
    if (!tbody) return;
    const stamp = document.getElementById('movers-stamp');
    const rows = SUBNETS.slice().sort((a,b) => b.change - a.change).slice(0,8);
    const state = rows.map(s => ({...s, price: (s.emission/100) * (0.8 + Math.random()*0.6)}));
    function render(){
      tbody.innerHTML = state.map(s => {
        const up = s.change >= 0;
        return `<tr>
          <td class="tag">SN${s.netuid}</td>
          <td>${s.name}</td>
          <td class="num">$${s.price.toFixed(2)}</td>
          <td class="num chg ${up?'up':'down'}">${up?'+':''}${s.change.toFixed(2)}%</td>
        </tr>`;
      }).join('');
      if (stamp) stamp.textContent = nowStamp();
    }
    render();
    if (!reduceMotion){
      setInterval(() => {
        state.forEach(s => {
          const d = (Math.random()-.5) * 0.7;
          s.change += d;
          s.price *= 1 + d*0.005;
        });
        state.sort((a,b) => b.change - a.change);
        render();
      }, 2200);
    }
  }

  function initPanelStream(){
    const list = document.getElementById('stream-list');
    if (!list) return;
    const stamp = document.getElementById('stream-stamp');
    const KINDS = [
      ['transfer', 'transfer'],
      ['stake',    'stake →'],
      ['unstake',  'unstake ←'],
      ['register', 'register'],
      ['emit',     'emission'],
    ];
    function addRow(){
      const k = KINDS[Math.floor(Math.random()*KINDS.length)];
      const amt = (Math.random() < 0.1)
        ? (Math.random()*8000 + 500)
        : (Math.random()*400 + 5);
      const sn = SUBNETS[Math.floor(Math.random()*SUBNETS.length)];
      const desc = `${k[1]}  SN${sn.netuid} · ${sn.name}`;
      const row = document.createElement('div');
      row.className = 'stream-row new';
      row.innerHTML = `
        <span class="ts">${nowStamp()}</span>
        <span class="desc">${desc}</span>
        <span class="amt">τ ${amt.toLocaleString('en-US',{maximumFractionDigits:2})}</span>`;
      list.prepend(row);
      while (list.children.length > 14) list.lastElementChild.remove();
      if (stamp) stamp.textContent = nowStamp();
    }
    // seed
    for (let i=0;i<10;i++) addRow();
    if (!reduceMotion){
      setInterval(addRow, 1700);
    }
  }

  function initPanelHeatmap(){
    const grid = document.getElementById('heatmap');
    if (!grid) return;
    // 92 cells — mirror network size; reuse SUBNETS for first 18, synthesize rest
    const N = 92;
    const catKeys = Object.keys(CATEGORIES);
    const cells = [];
    for (let i=0;i<N;i++){
      if (i < SUBNETS.length){
        cells.push({...SUBNETS[i]});
      } else {
        cells.push({
          netuid: i+1,
          name: `SN${i+1}`,
          cat: catKeys[Math.floor(Math.random()*catKeys.length)],
          chg24: (Math.random()-.5) * 30,
          change: (Math.random()-.5) * 30,
          emission: Math.round(Math.random()*40 + 4),
        });
      }
    }
    function color(chg){
      // map -15..+25 onto a red-to-mint scale
      const t = Math.max(-15, Math.min(25, chg));
      if (t >= 0){
        const k = t / 25;
        // dark teal -> bright mint
        const r = Math.round(58  + (0 - 58) * k);
        const g = Math.round(96  + (229 - 96) * k);
        const b = Math.round(74  + (168 - 74) * k);
        return `rgb(${r},${g},${b})`;
      } else {
        const k = -t / 15;
        // dark mauve -> bright rose
        const r = Math.round(58  + (255 - 58) * k);
        const g = Math.round(58  + (77 - 58) * k);
        const b = Math.round(68  + (109 - 68) * k);
        return `rgb(${r},${g},${b})`;
      }
    }
    function render(){
      grid.innerHTML = cells.map(c => {
        const bg = color(c.change);
        const txtDark = Math.abs(c.change) > 8;
        const labelColor = txtDark ? 'rgba(0,0,0,.85)' : 'rgba(234,234,240,.55)';
        const sign = c.change >= 0 ? '+' : '';
        return `<div class="hm-cell" style="background:${bg};color:${labelColor}" title="SN${c.netuid} ${c.name} ${sign}${c.change.toFixed(1)}%">
          <span>SN${c.netuid}</span>
          <span class="tip">SN${c.netuid} · ${c.name} · ${catLabels[c.cat]||c.cat} · ${sign}${c.change.toFixed(2)}%</span>
        </div>`;
      }).join('');
    }
    render();
    if (!reduceMotion){
      setInterval(() => {
        // randomly nudge ~8 cells
        for (let i=0;i<10;i++){
          const idx = Math.floor(Math.random() * cells.length);
          cells[idx].change += (Math.random()-.5) * 1.2;
          cells[idx].change = Math.max(-18, Math.min(28, cells[idx].change));
        }
        render();
      }, 3200);
    }
  }

  function initPanelEmissionsMini(){
    const c = document.getElementById('emissions-mini-canvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    let w, h, dpr;
    // 30-day daily emissions, simulated
    const data = [];
    let v = 7100;
    for (let i=0;i<30;i++){
      v += (Math.random()-.5)*200 + (i>15?20:-10);
      data.push(v);
    }
    function resize(){
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w*dpr; c.height = h*dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      draw();
    }
    function draw(){
      ctx.clearRect(0,0,w,h);
      const pad = {l:8,r:8,t:10,b:14};
      const cw = w - pad.l - pad.r;
      const ch = h - pad.t - pad.b;
      const mn = Math.min(...data) - 80;
      const mx = Math.max(...data) + 80;
      // grid
      ctx.strokeStyle = 'rgba(234,234,240,.05)';
      for (let i=0;i<4;i++){
        const y = pad.t + ch * (i/3);
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w-pad.r, y); ctx.stroke();
      }
      // bars
      const bw = cw / data.length - 2;
      data.forEach((d,i) => {
        const x = pad.l + (cw/data.length) * i + 1;
        const yTop = pad.t + ch * (1 - (d - mn)/(mx-mn));
        const yBot = pad.t + ch;
        const grad = ctx.createLinearGradient(0, yTop, 0, yBot);
        grad.addColorStop(0, '#FFA537');
        grad.addColorStop(1, '#FFA53733');
        ctx.fillStyle = grad;
        ctx.fillRect(x, yTop, bw, yBot - yTop);
      });
      // last value marker
      const last = data[data.length-1];
      ctx.fillStyle = '#EAEAF0';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.fillText(`τ ${Math.round(last).toLocaleString('en-US')}/d`, w-pad.r-2, pad.t-2);
    }
    window.addEventListener('resize', resize);
    requestAnimationFrame(resize);
  }

  /* ---------- 15. CENTRALIZED DESK ---------- */
  function initCentralizedDesk(){
    const labs = [
      {ticker:'PVT',  name:'Anthropic',       color:'#D97757', model:'Claude Opus 4.7',     tags:['safety','tool-use','agents'], stat1:['valuation','$170B'], stat2:['focus','assistants'], note:'Frontier lab focused on long-horizon agents and constitutional methods. Opus 4.7 is the current flagship.'},
      {ticker:'PVT',  name:'OpenAI',          color:'#10A37F', model:'GPT-5.1 / o-series',  tags:['reasoning','realtime'],        stat1:['valuation','$340B'], stat2:['focus','products'],  note:'Largest distribution surface. Heaviest pipeline in agent-tool reasoning and consumer assistant scale.'},
      {ticker:'GOOGL',name:'Google DeepMind', color:'#4285F4', model:'Gemini 3 Pro',        tags:['multimodal','search'],         stat1:['parent','$2.1T'],    stat2:['focus','infra+model'], note:'In-house TPUs, in-house data, in-house distribution. The integrated stack.'},
      {ticker:'META', name:'Meta AI',         color:'#0866FF', model:'Llama 5 405B',        tags:['open-weights','tooling'],      stat1:['mcap','$1.6T'],      stat2:['focus','open-weights'], note:'The open-weights pole. Llama 5 keeps the per-token cost floor visible to everyone else.'},
      {ticker:'PVT',  name:'xAI',             color:'#FFFFFF', model:'Grok 4',              tags:['compute','X-data'],             stat1:['cluster','Colossus 2'], stat2:['focus','scale'], note:'Memphis cluster keeps growing. Compute-first thesis, Twitter-native distribution.'},
      {ticker:'MSFT', name:'Microsoft',       color:'#5BC0BE', model:'Copilot · Azure AI',  tags:['enterprise','partner'],         stat1:['mcap','$3.4T'],      stat2:['focus','distribution'], note:'The enterprise channel. Azure runs OpenAI; Copilot ships AI into every Office surface.'},
      {ticker:'NVDA', name:'NVIDIA',          color:'#76B900', model:'Blackwell B200 · Rubin', tags:['silicon','CUDA'],            stat1:['mcap','$3.9T'],      stat2:['focus','silicon'], note:'Still the picks-and-shovels king. Rubin sampling, Blackwell in production at scale.'},
      {ticker:'TSM',  name:'TSMC',            color:'#E60012', model:'N2 · N3P process',    tags:['fab','capacity'],               stat1:['mcap','$1.0T'],      stat2:['focus','fabrication'], note:'The bottleneck behind the bottleneck. N2 ramping; A16 in 2027 on the published roadmap.'},
      {ticker:'AVGO', name:'Broadcom',        color:'#CC092F', model:'Custom AI ASICs',     tags:['ASIC','networking'],            stat1:['mcap','$960B'],      stat2:['focus','custom silicon'], note:'Co-designs the hyperscalers’ in-house accelerators. Ethernet for AI clusters at scale.'},
    ];

    const labGrid = document.getElementById('lab-grid');
    if (labGrid){
      labGrid.innerHTML = labs.map(l => `
        <article class="lab-card" style="--lab-color:${l.color}">
          <span class="lab-tick">${l.ticker} · ${l.model}</span>
          <h3 class="lab-name">${l.name}</h3>
          <p class="lab-note">${l.note}</p>
          <div class="lab-tags">${l.tags.map(t => `<span class="lab-tag">${t}</span>`).join('')}</div>
          <div class="lab-row"><span>${l.stat1[0]}</span><span class="val">${l.stat1[1]}</span></div>
          <div class="lab-row"><span>${l.stat2[0]}</span><span class="val">${l.stat2[1]}</span></div>
        </article>
      `).join('');
    }

    // Headline feed
    const feedList = document.getElementById('feed-list');
    if (!feedList) return;
    const sources = {
      'ANTH':  {bg:'rgba(217,119,87,.18)',   fg:'#E08866'},
      'OPENAI':{bg:'rgba(16,163,127,.18)',   fg:'#34D8A9'},
      'DM':    {bg:'rgba(66,133,244,.18)',   fg:'#6FA4F8'},
      'META':  {bg:'rgba(8,102,255,.18)',    fg:'#6FA4F8'},
      'xAI':   {bg:'rgba(234,234,240,.10)',  fg:'#EAEAF0'},
      'MSFT':  {bg:'rgba(91,192,190,.18)',   fg:'#8AD8D6'},
      'NVDA':  {bg:'rgba(118,185,0,.18)',    fg:'#A2E55B'},
      'TSM':   {bg:'rgba(230,0,18,.18)',     fg:'#FF6B7A'},
      'AVGO':  {bg:'rgba(204,9,47,.18)',     fg:'#FF6B7A'},
      'POL':   {bg:'rgba(255,165,55,.18)',   fg:'#FFA537'},  // policy
    };
    const HEADLINES = [
      ['ANTH',   'Claude Opus 4.7 rolls out 1M-context to Pro tier; Sonnet 4.6 holds default'],
      ['OPENAI', 'GPT-5.1 evaluation suite leaks: agentic tool-use scores climb across SWE-bench Verified'],
      ['NVDA',   'Rubin sampling reportedly underway with three hyperscaler customers'],
      ['DM',     'Gemini 3 Pro integrated into Workspace Enterprise; pricing held flat YoY'],
      ['META',   'Llama 5 405B weights released under updated community license; safety eval expanded'],
      ['xAI',    'Colossus 2 build crosses 350k H200 milestone, per Memphis filings'],
      ['MSFT',   'Copilot ARR disclosed at $14B in latest earnings; agents in preview to Fortune 500'],
      ['TSM',    'N2 yields reported at production-grade; Apple, NVIDIA, AMD share early allocation'],
      ['AVGO',   'Custom AI ASIC pipeline expands with two new hyperscaler design wins'],
      ['POL',    'EU AI Office issues draft compute-reporting threshold at 10^25 FLOPs'],
      ['ANTH',   'Anthropic publishes interpretability report: feature circuits in Opus model family'],
      ['OPENAI', 'OpenAI partners with national lab on alignment evaluation framework'],
      ['DM',     'DeepMind Veo 3 video model: 4-minute coherent generation in research preview'],
      ['NVDA',   'NVIDIA fiscal Q1 prelim: data-center revenue up 41% YoY; supply guidance widened'],
      ['META',   'Meta AI dev surface gains async tool calling, function output streaming'],
      ['xAI',    'Grok 4 vision tier opens to API; pricing undercuts comparable tier by ~22%'],
      ['MSFT',   'Azure announces TAO-denominated workload settlement experiment with select partners'],
      ['POL',    'US Commerce updates export-control matrix for advanced AI accelerators'],
    ];

    function renderSynthetic(){
      feedList.innerHTML = HEADLINES.map((h,i) => {
        const s = sources[h[0]] || {bg:'',fg:''};
        const d = new Date(Date.now() - i*7*60*1000);
        const ts = `${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}`;
        return `<li class="feed-item">
          <span class="ts">${ts}</span>
          <span class="src" style="--src-bg:${s.bg};--src-fg:${s.fg}">${h[0]}</span>
          <span class="h">${h[1]}</span>
        </li>`;
      }).join('');
    }
    function renderLive(items){
      if (!items || !items.length) return;
      feedList.innerHTML = items.slice(0,18).map(item => {
        const s = sources[item.source] || {bg:'rgba(234,234,240,.10)', fg:'#EAEAF0'};
        const d = new Date(item.ts);
        const ts = `${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}`;
        const safeTitle = escapeHtml(item.title || '');
        const url = item.url ? escapeAttr(item.url) : '#';
        return `<li class="feed-item">
          <span class="ts">${ts}</span>
          <span class="src" style="--src-bg:${s.bg};--src-fg:${s.fg}">${item.source}</span>
          <a class="h" href="${url}" target="_blank" rel="noopener">${safeTitle}</a>
        </li>`;
      }).join('');
    }
    // first paint synthetic, then upgrade to live when DataLayer delivers
    renderSynthetic();
    if (window.SubnetData){
      window.SubnetData.subscribe('news:ai', items => {
        renderLive(items);
        const first = feedList.querySelector('.feed-item');
        if (first) first.classList.add('new');
      });
    }
    if (!reduceMotion){
      setInterval(() => {
        // only rotate synthetic items if no live feed has loaded
        if (window.SubnetData?.get('news:ai')) return;
        const rolled = HEADLINES.pop();
        HEADLINES.unshift(rolled);
        renderSynthetic();
        const first = feedList.querySelector('.feed-item');
        if (first) first.classList.add('new');
      }, 7000);
    }
  }

  // small HTML/attr escapers for safely interpolating external strings
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, ch => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[ch]));
  }
  function escapeAttr(s){ return escapeHtml(s); }

  /* ---------- BOOT ---------- */
  function boot(){
    // Bloomberg-style compact date: WED 13 MAY 2026
    const dateEl = document.getElementById('util-date');
    if (dateEl){
      try {
        const d = new Date();
        const day = d.toLocaleDateString('en-US',{weekday:'short'}).toUpperCase();
        const dom = String(d.getDate()).padStart(2,'0');
        const mon = d.toLocaleDateString('en-US',{month:'short'}).toUpperCase();
        const yr  = d.getFullYear();
        dateEl.textContent = `${day} ${dom} ${mon} ${yr}`;
      } catch(_) {}
    }
    initCoverCanvas();
    initTicker();
    initCounters();
    initSotwChart();
    initDirectory();
    initQuoteBoard();
    initTerminal();
    initEmissions();
    initCentralizedDesk();
    initReveal();
    initActiveNav();
    initBackToTop();
    initSubscribe();
    initTaoPrice();
    initBlockSubscriber();
    initClock();
    // Start polling for live data — adapters self-fall-back on failure.
    if (window.SubnetData && typeof window.SubnetData.start === 'function') {
      window.SubnetData.start();
    }
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
