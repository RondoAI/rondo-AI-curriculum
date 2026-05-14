/* =================================================================
   SUBNET MAGAZINE — WORLD MAP CHART (v2)
   -----------------------------------------------------------------
   Equirectangular map with hand-authored continent polygons.

   Pipeline (per layout):
     1. Sample a fine (lng,lat) grid; point-in-polygon against the
        continent list; emit a dot for every land sample.
     2. Build hub projections.
     3. Build arcs: hub → consensus-head (always) plus hub-to-hub
        mesh for the top stake hubs.

   Pipeline (per frame):
     1. Faint grid + scanlines.
     2. Land dots (cached).
     3. Hub-to-hub mesh.
     4. Animated packets riding the arcs.
     5. Multi-radius hub halos + glowing core dots.
     6. Always-on labels for the top stake hubs.
     7. Hover overlay (any hub).
     8. Watermark + coords.
   ================================================================= */

import { Chart } from './Chart.js';

/* ---------- Palette ---------- */
const RED       = '#FF1E3C';
const RED_2     = '#FF6B7A';
const WHITE     = '#F5E5E8';
const C_DOT     = 'rgba(255,30,60,.32)';
const C_DOT_HOT = 'rgba(255,30,60,.55)';
const C_GRID    = 'rgba(255,30,60,.05)';
const C_ARC     = 'rgba(255,30,60,.12)';
const C_MESH    = 'rgba(255,30,60,.08)';

/* ---------- Continent polygons (lng, lat) ---------- */
const CONTINENTS = [
  /* North America (Alaska + main body) */
  [[-167,68],[-141,70],[-126,73],[-95,73],[-78,73],[-65,65],[-55,52],[-66,47],
   [-70,42],[-82,30],[-97,26],[-105,22],[-115,30],[-124,40],[-130,50],
   [-135,58],[-150,60],[-158,62],[-165,65]],
  /* Greenland */
  [[-55,83],[-20,80],[-15,72],[-25,60],[-50,60],[-55,75]],
  /* South America */
  [[-78,11],[-65,8],[-50,0],[-36,-5],[-35,-20],[-40,-25],[-52,-32],
   [-58,-38],[-65,-50],[-72,-54],[-72,-45],[-78,-30],[-80,-10],[-80,5]],
  /* Iceland */
  [[-24,66],[-13,66],[-13,63],[-24,63]],
  /* British Isles */
  [[-10,60],[-2,60],[2,53],[-5,50],[-10,53]],
  /* Europe (Scandinavia + continental) */
  [[5,71],[25,71],[30,60],[38,55],[42,48],[30,42],[10,36],[-5,36],[-10,44],
   [-2,50],[5,60]],
  /* Africa */
  [[-17,35],[10,37],[25,32],[37,30],[42,14],[50,12],[42,-2],[42,-18],
   [33,-28],[20,-35],[12,-28],[10,-10],[-5,5],[-15,15],[-17,25]],
  /* Madagascar */
  [[43,-12],[50,-16],[50,-25],[44,-25]],
  /* Middle East / Arabia */
  [[27,31],[40,34],[50,35],[60,32],[60,24],[54,17],[44,12],[38,12],[33,20]],
  /* Asia (Russia + China + India + SE Asia) */
  [[30,72],[60,75],[110,75],[150,70],[170,67],[165,60],[145,55],[142,45],
   [134,35],[121,22],[108,20],[108,10],[98,8],[92,18],[80,8],[73,20],
   [62,25],[50,38],[40,45],[35,60]],
  /* Indonesia / SE archipelago (composite) */
  [[95,4],[120,4],[142,-2],[140,-8],[105,-8],[95,-2]],
  /* Borneo */
  [[109,5],[118,5],[118,-4],[109,-4]],
  /* Philippines */
  [[120,18],[125,18],[126,8],[121,6]],
  /* Japan */
  [[131,33],[142,41],[146,44],[138,36]],
  /* Australia */
  [[113,-12],[130,-10],[142,-10],[148,-22],[154,-28],[150,-36],
   [142,-38],[130,-32],[115,-32],[113,-22]],
  /* New Zealand */
  [[173,-36],[178,-42],[171,-47],[166,-45]],
  /* Antarctica strip */
  [[-180,-65],[180,-65],[180,-85],[-180,-85]],
];

/* ---------- Validator hubs ---------- */
const HUBS = [
  { name:'SAN FRANCISCO', code:'SFO', lat: 37.78, lng:-122.42, stake: 8.4 },
  { name:'NEW YORK',      code:'NYC', lat: 40.71, lng: -74.01, stake: 6.1 },
  { name:'TORONTO',       code:'YYZ', lat: 43.65, lng: -79.38, stake: 2.4 },
  { name:'MEXICO CITY',   code:'MEX', lat: 19.43, lng: -99.13, stake: 0.9 },
  { name:'SAO PAULO',     code:'SAO', lat:-23.55, lng: -46.63, stake: 1.2 },
  { name:'LONDON',        code:'LON', lat: 51.51, lng:  -0.13, stake: 7.6 },
  { name:'FRANKFURT',     code:'FRA', lat: 50.11, lng:   8.68, stake:11.2 },
  { name:'AMSTERDAM',     code:'AMS', lat: 52.37, lng:   4.89, stake: 6.8 },
  { name:'HELSINKI',      code:'HEL', lat: 60.17, lng:  24.94, stake: 2.4 },
  { name:'CAPE TOWN',     code:'CPT', lat:-33.92, lng:  18.42, stake: 0.8 },
  { name:'MUMBAI',        code:'BOM', lat: 19.08, lng:  72.88, stake: 2.6 },
  { name:'SINGAPORE',     code:'SIN', lat:  1.35, lng: 103.82, stake: 8.6 },
  { name:'TOKYO',         code:'TYO', lat: 35.68, lng: 139.69, stake: 5.8 },
  { name:'SEOUL',         code:'SEL', lat: 37.57, lng: 126.98, stake: 3.4 },
  { name:'SYDNEY',        code:'SYD', lat:-33.87, lng: 151.21, stake: 1.8 },
  { name:'DUBAI',         code:'DXB', lat: 25.20, lng:  55.27, stake: 1.5 },
];

/* ---------- Math ---------- */

/** Ray-casting point-in-polygon. @param {number[][]} poly */
function pointInPoly(x, y, poly){
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++){
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = ((yi > y) !== (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/* ---------- Class ---------- */

export class WorldMap extends Chart {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas){
    super(canvas, { animate: true });

    /** @private */ this.landDots = [];   // {x,y,r,a}
    /** @private */ this.coast    = [];   // {x,y} thicker coastal dots
    /** @private */ this.hubPts   = [];   // hub projections
    /** @private */ this.mesh     = [];   // {a:i,b:j} hub indices for hub-to-hub mesh
    /** @private */ this.packets  = [];   // {arcKey, t0, speed}
    /** @private */ this.hover    = null;

    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      const px = e.clientX - r.left, py = e.clientY - r.top;
      let best = 20 * 20, hit = null;
      for (const h of this.hubPts){
        const d = (h.x - px) ** 2 + (h.y - py) ** 2;
        if (d < best){ best = d; hit = h; }
      }
      this.hover = hit;
    });
    canvas.addEventListener('mouseleave', () => { this.hover = null; });
  }

  _project(lat, lng){
    return [(lng + 180) / 360 * this.w, (90 - lat) / 180 * this.h];
  }

  /** Test (lng,lat) against the continent set. */
  _isLand(lng, lat){
    for (let i = 0; i < CONTINENTS.length; i++){
      if (pointInPoly(lng, lat, CONTINENTS[i])) return true;
    }
    return false;
  }

  layout(ctx, w, h){
    /* ----- LAND DOTS: sample (lng,lat) grid; emit dots on land ----- */
    const landDots = [];
    const coast = [];

    // Adapt sample resolution to canvas size — denser on larger canvases.
    const stepX = Math.max(2.0, 360 / (w * 0.32));    // ~degrees per sample
    const stepY = Math.max(1.5, 180 / (h * 0.28));

    const samples = []; // 2D array of booleans for coast detection
    let rows = 0, cols = 0;
    for (let lat = 85; lat >= -85; lat -= stepY){
      const rowArr = [];
      for (let lng = -180; lng <= 180; lng += stepX){
        const isL = this._isLand(lng, lat);
        rowArr.push(isL);
      }
      samples.push(rowArr);
      if (rows === 0) cols = rowArr.length;
      rows++;
    }

    for (let r = 0; r < rows; r++){
      for (let c = 0; c < cols; c++){
        if (!samples[r][c]) continue;
        // coast = a land cell with at least one non-land neighbor
        const n  = r > 0        ? samples[r-1][c] : false;
        const s  = r < rows - 1 ? samples[r+1][c] : false;
        const e  = c < cols - 1 ? samples[r][c+1] : false;
        const wN = c > 0        ? samples[r][c-1] : false;
        const isCoast = !(n && s && e && wN);

        const lng = -180 + c * stepX;
        const lat = 85   - r * stepY;
        const [x, y] = this._project(lat, lng);
        const jx = (Math.random() - .5) * 1.6;
        const jy = (Math.random() - .5) * 1.6;
        if (isCoast){
          coast.push({ x: x + jx, y: y + jy, r: 1.6, a: .65 });
        } else {
          landDots.push({
            x: x + jx, y: y + jy,
            r: .9 + Math.random() * .4,
            a: .26 + Math.random() * .14,
          });
        }
      }
    }
    this.landDots = landDots;
    this.coast    = coast;

    /* ----- HUBS ----- */
    this.hubPts = HUBS.map((h, idx) => {
      const [x, y] = this._project(h.lat, h.lng);
      return { ...h, x, y, idx };
    });

    /* ----- HUB-to-HUB mesh (top 6 by stake) ----- */
    const top = [...this.hubPts].sort((a,b) => b.stake - a.stake).slice(0, 6);
    const mesh = [];
    for (let i = 0; i < top.length; i++)
      for (let j = i + 1; j < top.length; j++)
        mesh.push({ a: top[i].idx, b: top[j].idx });
    this.mesh = mesh;

    /* ----- PACKETS: a population of moving dots along arcs ----- */
    const packets = [];
    for (let i = 0; i < this.hubPts.length; i++){
      packets.push({ kind: 'consensus', a: i, t0: Math.random(), speed: 0.18 + Math.random() * 0.18 });
    }
    for (let i = 0; i < this.mesh.length; i++){
      packets.push({ kind: 'mesh', m: i, t0: Math.random(), speed: 0.10 + Math.random() * 0.12 });
    }
    this.packets = packets;
  }

  /** Quadratic-bezier point + derivative for arc placement. */
  _arcAt(ax, ay, bx, by, k){
    const cx = (ax + bx) / 2;
    const cy = Math.min(ay, by) - Math.abs(ax - bx) * 0.18 - 20;
    const u = 1 - k;
    return {
      x: u * u * ax + 2 * u * k * cx + k * k * bx,
      y: u * u * ay + 2 * u * k * cy + k * k * by,
    };
  }

  draw(ctx, w, h, t){
    ctx.clearRect(0, 0, w, h);

    /* ===== background grid + scanlines ===== */
    ctx.strokeStyle = C_GRID;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let lng = -180; lng <= 180; lng += 30){
      const [x] = this._project(0, lng);
      ctx.moveTo(x, 0); ctx.lineTo(x, h);
    }
    for (let lat = -60; lat <= 60; lat += 30){
      const [, y] = this._project(lat, 0);
      ctx.moveTo(0, y); ctx.lineTo(w, y);
    }
    ctx.stroke();

    /* ===== land dots ===== */
    for (const d of this.landDots){
      ctx.fillStyle = `rgba(255,30,60,${d.a})`;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
    }
    /* coastal dots — brighter, slightly larger */
    for (const d of this.coast){
      ctx.fillStyle = C_DOT_HOT;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
    }

    /* ===== consensus head walks the equator ===== */
    const consensusAngle = (t * 0.08) % (Math.PI * 2);
    const consensusLng = (consensusAngle / Math.PI * 180) - 180;
    const [chX, chY] = this._project(0, consensusLng);

    /* dim vertical sweep band behind the head */
    const grad = ctx.createLinearGradient(chX - 60, 0, chX + 60, 0);
    grad.addColorStop(0,   'rgba(255,30,60,0)');
    grad.addColorStop(.5,  'rgba(255,30,60,.10)');
    grad.addColorStop(1,   'rgba(255,30,60,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(chX - 60, 0, 120, h);

    /* ===== hub-to-hub mesh ===== */
    for (const m of this.mesh){
      const a = this.hubPts[m.a], b = this.hubPts[m.b];
      ctx.strokeStyle = C_MESH; ctx.lineWidth = 0.6;
      const cx = (a.x + b.x) / 2;
      const cy = Math.min(a.y, b.y) - Math.abs(a.x - b.x) * 0.12 - 16;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(cx, cy, b.x, b.y);
      ctx.stroke();
    }

    /* ===== arcs from each hub to consensus head ===== */
    for (const hub of this.hubPts){
      const pulse = 0.55 + 0.45 * Math.sin(t * 1.8 + hub.lat * 0.1);
      ctx.strokeStyle = `rgba(255,30,60,${0.10 + 0.10 * pulse})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(hub.x, hub.y);
      const cx = (hub.x + chX) / 2;
      const cy = Math.min(hub.y, chY) - Math.abs(hub.x - chX) * 0.18 - 16;
      ctx.quadraticCurveTo(cx, cy, chX, chY);
      ctx.stroke();
    }

    /* ===== packets traveling along arcs ===== */
    for (const p of this.packets){
      const k = ((t * p.speed) + p.t0) % 1;
      if (p.kind === 'consensus'){
        const hub = this.hubPts[p.a];
        const pt = this._arcAt(hub.x, hub.y, chX, chY, k);
        ctx.fillStyle = `rgba(255,107,122,${0.55 + 0.45 * (1 - Math.abs(k - .5) * 2)})`;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 1.6, 0, Math.PI * 2); ctx.fill();
      } else {
        const m = this.mesh[p.m];
        const a = this.hubPts[m.a], b = this.hubPts[m.b];
        const pt = this._arcAt(a.x, a.y, b.x, b.y, k);
        ctx.fillStyle = `rgba(255,176,186,${0.40 + 0.40 * (1 - Math.abs(k - .5) * 2)})`;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 1.2, 0, Math.PI * 2); ctx.fill();
      }
    }

    /* ===== hubs: multi-radius halo + core ===== */
    for (const hub of this.hubPts){
      const pulse = 0.55 + 0.45 * Math.sin(t * 1.8 + hub.lat * 0.1);
      const stakeR = 18 + hub.stake * 1.6;

      // outer halo
      const g1 = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, stakeR);
      g1.addColorStop(0, `rgba(255,30,60,${0.45 * pulse})`);
      g1.addColorStop(1, 'rgba(255,30,60,0)');
      ctx.fillStyle = g1;
      ctx.beginPath(); ctx.arc(hub.x, hub.y, stakeR, 0, Math.PI * 2); ctx.fill();

      // inner halo
      const g2 = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, 9);
      g2.addColorStop(0, `rgba(255,107,122,${0.55 * pulse})`);
      g2.addColorStop(1, 'rgba(255,30,60,0)');
      ctx.fillStyle = g2;
      ctx.beginPath(); ctx.arc(hub.x, hub.y, 9, 0, Math.PI * 2); ctx.fill();

      // core dot
      ctx.fillStyle = RED;
      ctx.shadowColor = RED; ctx.shadowBlur = 8 * pulse;
      ctx.beginPath(); ctx.arc(hub.x, hub.y, 2.6 + hub.stake * 0.18, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }

    /* ===== consensus head (white-hot) ===== */
    const headPulse = 0.6 + 0.4 * Math.sin(t * 3);
    const gh = ctx.createRadialGradient(chX, chY, 0, chX, chY, 20);
    gh.addColorStop(0, `rgba(255,107,122,${0.75 * headPulse})`);
    gh.addColorStop(1, 'rgba(255,30,60,0)');
    ctx.fillStyle = gh;
    ctx.beginPath(); ctx.arc(chX, chY, 20, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = WHITE;
    ctx.shadowColor = RED; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(chX, chY, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    /* ===== always-on labels for top stake hubs ===== */
    const labelHubs = [...this.hubPts].sort((a,b) => b.stake - a.stake).slice(0, 8);
    ctx.font = '600 9px JetBrains Mono, monospace';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    for (const hub of labelHubs){
      const lx = hub.x + 8;
      const ly = hub.y - 8;
      const txt = `${hub.code}  τ${hub.stake.toFixed(1)}M`;
      // small tick connecting dot to label
      ctx.strokeStyle = 'rgba(255,30,60,.45)';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(hub.x, hub.y); ctx.lineTo(hub.x + 6, hub.y - 6);
      ctx.stroke();
      // label bg + text
      const tw = ctx.measureText(txt).width;
      ctx.fillStyle = 'rgba(0,0,0,.78)';
      ctx.fillRect(lx, ly - 6, tw + 6, 12);
      ctx.strokeStyle = 'rgba(255,30,60,.30)';
      ctx.lineWidth = 1;
      ctx.strokeRect(lx + 0.5, ly - 5.5, tw + 6, 12);
      ctx.fillStyle = RED_2;
      ctx.fillText(txt, lx + 3, ly + 0.5);
    }

    /* ===== hover overlay ===== */
    if (this.hover){
      const hub = this.hover;
      const txt = `${hub.name}  ·  τ ${hub.stake.toFixed(1)}M staked`;
      ctx.font = '600 11px JetBrains Mono, monospace';
      ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
      const tw = ctx.measureText(txt).width;
      const padX = 8, padY = 6;
      const bx = Math.min(w - tw - padX * 2 - 4, hub.x + 10);
      const by = Math.max(28, hub.y - 14);
      ctx.fillStyle = '#000';
      ctx.fillRect(bx, by - 18, tw + padX * 2, 22);
      ctx.strokeStyle = 'rgba(255,30,60,.45)';
      ctx.strokeRect(bx + .5, by - 17.5, tw + padX * 2, 21);
      ctx.fillStyle = WHITE;
      ctx.fillText(txt, bx + padX, by - 4);
    }

    /* ===== CRT scanline overlay ===== */
    ctx.fillStyle = 'rgba(255,30,60,.03)';
    for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
    /* faint vignette */
    const vg = ctx.createRadialGradient(w/2, h/2, Math.min(w,h)*0.3, w/2, h/2, Math.max(w,h)*0.7);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,.45)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);

    /* ===== chrome ===== */
    ctx.font = '600 9.5px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(255,30,60,.55)';
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText('EQUIRECT · WGS84', 10, 10);
    ctx.textAlign = 'right';
    ctx.fillText(
      `LON ${consensusLng.toFixed(1).padStart(6,' ')}°   T+${t.toFixed(1)}s   HEAD · CONSENSUS`,
      w - 10, 10
    );
    ctx.textAlign = 'left';
    ctx.fillText(`HUBS · ${HUBS.length}   STAKE Σ · τ 6.24M   PACKETS · ${this.packets.length}`, 10, h - 18);
  }
}
