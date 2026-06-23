/* =================================================================
   SUBNET MAGAZINE, WORLD MAP CHART (v3, clean data-viz)
   -----------------------------------------------------------------
   Design goal: clean Bloomberg-grade data visualization. Continents
   read instantly. Hubs are unambiguous. Labels are always legible.
   Motion is restrained, only the consensus head and packets move,
   and they move slowly enough to read.

   Pipeline (per layout):
     1. Sample (lng,lat) grid; point-in-polygon against the continent
        list; emit a dot for every land sample, with coastal cells
        promoted to brighter dots.
     2. Project all hubs.
     3. Build packet pool, one per hub, riding hub → consensus head.

   Pipeline (per frame):
     1. Light grid + axis labels.
     2. Land dots (cached) + coast dots.
     3. A single consensus-head sweep on the equator.
     4. Slow packets along arcs.
     5. Hub halos + core dots sized by stake.
     6. Always-on labels: airport code + τ stake, anti-clipped.
     7. Hover overlay.
     8. Minimal chrome.
   ================================================================= */

import { Chart } from './Chart.js';

/* ---------- Palette ---------- */
const RED       = '#FF1E3C';
const RED_2     = '#FF6B7A';
const WHITE     = '#F5E5E8';
const C_DOT     = 'rgba(255,60,90,.32)';
const C_DOT_HOT = 'rgba(255,77,109,.65)';
const C_GRID    = 'rgba(255,30,60,.07)';
const C_GRID_T  = 'rgba(255,30,60,.32)';

/* ---------- Continent polygons (lng, lat) ---------- */
const CONTINENTS = [
  /* North America */
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
  /* Asia */
  [[30,72],[60,75],[110,75],[150,70],[170,67],[165,60],[145,55],[142,45],
   [134,35],[121,22],[108,20],[108,10],[98,8],[92,18],[80,8],[73,20],
   [62,25],[50,38],[40,45],[35,60]],
  /* Indonesia archipelago */
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
  { code:'SFO', name:'SAN FRANCISCO', lat: 37.78, lng:-122.42, stake: 8.4 },
  { code:'NYC', name:'NEW YORK',      lat: 40.71, lng: -74.01, stake: 6.1 },
  { code:'YYZ', name:'TORONTO',       lat: 43.65, lng: -79.38, stake: 2.4 },
  { code:'MEX', name:'MEXICO CITY',   lat: 19.43, lng: -99.13, stake: 0.9 },
  { code:'SAO', name:'SAO PAULO',     lat:-23.55, lng: -46.63, stake: 1.2 },
  { code:'LON', name:'LONDON',        lat: 51.51, lng:  -0.13, stake: 7.6 },
  { code:'FRA', name:'FRANKFURT',     lat: 50.11, lng:   8.68, stake:11.2 },
  { code:'AMS', name:'AMSTERDAM',     lat: 52.37, lng:   4.89, stake: 6.8 },
  { code:'HEL', name:'HELSINKI',      lat: 60.17, lng:  24.94, stake: 2.4 },
  { code:'CPT', name:'CAPE TOWN',     lat:-33.92, lng:  18.42, stake: 0.8 },
  { code:'BOM', name:'MUMBAI',        lat: 19.08, lng:  72.88, stake: 2.6 },
  { code:'SIN', name:'SINGAPORE',     lat:  1.35, lng: 103.82, stake: 8.6 },
  { code:'TYO', name:'TOKYO',         lat: 35.68, lng: 139.69, stake: 5.8 },
  { code:'SEL', name:'SEOUL',         lat: 37.57, lng: 126.98, stake: 3.4 },
  { code:'SYD', name:'SYDNEY',        lat:-33.87, lng: 151.21, stake: 1.8 },
  { code:'DXB', name:'DUBAI',         lat: 25.20, lng:  55.27, stake: 1.5 },
];

/* ---------- Math ---------- */
function pointInPoly(x, y, poly){
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++){
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const hit = ((yi > y) !== (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (hit) inside = !inside;
  }
  return inside;
}

/* Anti-collision label slots, try one side, fall back to the other. */
function placeLabel(ctx, hub, w, h, occupied){
  const txt = `${hub.code}  τ${hub.stake.toFixed(1)}M`;
  const tw = ctx.measureText(txt).width;
  const bw = tw + 10, bh = 14;
  /* Try right-up, right-down, left-up, left-down */
  const candidates = [
    { lx: hub.x + 10,        ly: hub.y - bh - 4 },
    { lx: hub.x + 10,        ly: hub.y + 4 },
    { lx: hub.x - bw - 10,   ly: hub.y - bh - 4 },
    { lx: hub.x - bw - 10,   ly: hub.y + 4 },
  ];
  for (const c of candidates){
    if (c.lx < 4 || c.lx + bw > w - 4) continue;
    if (c.ly < 4 || c.ly + bh > h - 4) continue;
    const overlap = occupied.some(r =>
      c.lx < r.x + r.w && c.lx + bw > r.x &&
      c.ly < r.y + r.h && c.ly + bh > r.y
    );
    if (overlap) continue;
    occupied.push({ x: c.lx, y: c.ly, w: bw, h: bh });
    return { ...c, bw, bh, txt };
  }
  return null;  // no clean slot, skip this label
}

/* ---------- Class ---------- */

export class WorldMap extends Chart {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas){
    super(canvas, { animate: true });
    /** @private */ this.landDots = [];
    /** @private */ this.coast    = [];
    /** @private */ this.hubPts   = [];
    /** @private */ this.packets  = [];
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
  _isLand(lng, lat){
    for (let i = 0; i < CONTINENTS.length; i++)
      if (pointInPoly(lng, lat, CONTINENTS[i])) return true;
    return false;
  }

  layout(ctx, w, h){
    const landDots = [];
    const coast = [];
    const stepX = Math.max(2.0, 360 / (w * 0.34));
    const stepY = Math.max(1.5, 180 / (h * 0.30));
    const samples = [];
    let rows = 0, cols = 0;
    for (let lat = 85; lat >= -85; lat -= stepY){
      const rowArr = [];
      for (let lng = -180; lng <= 180; lng += stepX){
        rowArr.push(this._isLand(lng, lat));
      }
      samples.push(rowArr);
      if (rows === 0) cols = rowArr.length;
      rows++;
    }
    for (let r = 0; r < rows; r++){
      for (let c = 0; c < cols; c++){
        if (!samples[r][c]) continue;
        const n  = r > 0        && samples[r-1][c];
        const s  = r < rows - 1 && samples[r+1][c];
        const e  = c < cols - 1 && samples[r][c+1];
        const wN = c > 0        && samples[r][c-1];
        const isCoast = !(n && s && e && wN);

        const lng = -180 + c * stepX;
        const lat = 85   - r * stepY;
        const [x, y] = this._project(lat, lng);
        const jx = (Math.random() - .5) * 1.2;
        const jy = (Math.random() - .5) * 1.2;
        if (isCoast){
          coast.push({ x: x + jx, y: y + jy, r: 1.6, a: .8 });
        } else {
          landDots.push({
            x: x + jx, y: y + jy,
            r: .9 + Math.random() * .35,
            a: .28 + Math.random() * .12,
          });
        }
      }
    }
    this.landDots = landDots;
    this.coast    = coast;
    this.hubPts = HUBS.map((h, idx) => {
      const [x, y] = this._project(h.lat, h.lng);
      return { ...h, x, y, idx };
    });
    /* One slow packet per hub, riding hub → consensus head. */
    this.packets = this.hubPts.map((_, i) => ({
      a: i, t0: Math.random(), speed: 0.08 + Math.random() * 0.08,
    }));
  }

  _arcAt(ax, ay, bx, by, k){
    const cx = (ax + bx) / 2;
    const cy = Math.min(ay, by) - Math.abs(ax - bx) * 0.15 - 18;
    const u = 1 - k;
    return {
      x: u * u * ax + 2 * u * k * cx + k * k * bx,
      y: u * u * ay + 2 * u * k * cy + k * k * by,
    };
  }

  draw(ctx, w, h, t){
    ctx.clearRect(0, 0, w, h);

    /* ===== axis margin reserved for lat/lng labels ===== */
    const marginL = 28, marginR = 12, marginT = 12, marginB = 22;

    /* ===== grid (30° spacing) with axis labels ===== */
    ctx.strokeStyle = C_GRID;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let lng = -180; lng <= 180; lng += 30){
      const [x] = this._project(0, lng);
      ctx.moveTo(x, marginT); ctx.lineTo(x, h - marginB);
    }
    for (let lat = -60; lat <= 60; lat += 30){
      const [, y] = this._project(lat, 0);
      ctx.moveTo(marginL, y); ctx.lineTo(w - marginR, y);
    }
    ctx.stroke();

    /* equator + prime meridian, slightly bolder */
    ctx.strokeStyle = C_GRID_T;
    ctx.lineWidth = 1;
    const [, yEq] = this._project(0, 0);
    const [xPm]   = this._project(0, 0);
    ctx.beginPath();
    ctx.moveTo(marginL, yEq); ctx.lineTo(w - marginR, yEq);
    ctx.moveTo(xPm, marginT); ctx.lineTo(xPm, h - marginB);
    ctx.stroke();

    /* axis labels */
    ctx.font = '600 9px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(255,30,60,.45)';
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (const lat of [60, 30, 0, -30, -60]){
      const [, y] = this._project(lat, 0);
      ctx.fillText(`${Math.abs(lat)}°${lat >= 0 ? 'N' : 'S'}`, marginL - 4, y);
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    for (const lng of [-120, -60, 0, 60, 120]){
      const [x] = this._project(0, lng);
      ctx.fillText(`${Math.abs(lng)}°${lng >= 0 ? 'E' : 'W'}`, x, h - 4);
    }

    /* ===== land dots ===== */
    for (const d of this.landDots){
      ctx.fillStyle = `rgba(255,60,90,${d.a})`;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
    }
    for (const d of this.coast){
      ctx.fillStyle = C_DOT_HOT;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
    }

    /* ===== consensus head, slow, single, no sweep band ===== */
    const consensusAngle = (t * 0.05) % (Math.PI * 2);
    const consensusLng = (consensusAngle / Math.PI * 180) - 180;
    const [chX, chY] = this._project(0, consensusLng);

    /* ===== arcs from each hub to consensus head, restrained ===== */
    for (const hub of this.hubPts){
      ctx.strokeStyle = 'rgba(255,30,60,.10)';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(hub.x, hub.y);
      const cx = (hub.x + chX) / 2;
      const cy = Math.min(hub.y, chY) - Math.abs(hub.x - chX) * 0.15 - 18;
      ctx.quadraticCurveTo(cx, cy, chX, chY);
      ctx.stroke();
    }

    /* ===== slow packets riding arcs ===== */
    for (const p of this.packets){
      const k = ((t * p.speed) + p.t0) % 1;
      const hub = this.hubPts[p.a];
      const pt = this._arcAt(hub.x, hub.y, chX, chY, k);
      const head = 1 - Math.abs(k - .5) * 2;
      ctx.fillStyle = `rgba(255,107,122,${0.50 + 0.45 * head})`;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 1.4, 0, Math.PI * 2); ctx.fill();
    }

    /* ===== hubs: glow + core ===== */
    for (const hub of this.hubPts){
      const pulse = 0.55 + 0.45 * Math.sin(t * 1.4 + hub.lat * 0.1);
      const halo = 12 + hub.stake * 1.0;
      const g = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, halo);
      g.addColorStop(0, `rgba(255,30,60,${0.42 * pulse})`);
      g.addColorStop(1, 'rgba(255,30,60,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(hub.x, hub.y, halo, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = RED;
      ctx.shadowColor = RED; ctx.shadowBlur = 6 * pulse;
      ctx.beginPath();
      ctx.arc(hub.x, hub.y, 3 + hub.stake * 0.20, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    /* ===== consensus head ===== */
    const headPulse = 0.6 + 0.4 * Math.sin(t * 2.6);
    const gh = ctx.createRadialGradient(chX, chY, 0, chX, chY, 18);
    gh.addColorStop(0, `rgba(255,128,148,${0.7 * headPulse})`);
    gh.addColorStop(1, 'rgba(255,30,60,0)');
    ctx.fillStyle = gh;
    ctx.beginPath(); ctx.arc(chX, chY, 18, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = WHITE;
    ctx.shadowColor = RED; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(chX, chY, 3.2, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    /* ===== always-on labels with anti-collision ===== */
    ctx.font = '600 9.5px JetBrains Mono, monospace';
    const occupied = [];
    /* prefer labeling biggest stakes first */
    const sortedHubs = [...this.hubPts].sort((a,b) => b.stake - a.stake);
    for (const hub of sortedHubs){
      const slot = placeLabel(ctx, hub, w, h, occupied);
      if (!slot) continue;
      ctx.strokeStyle = 'rgba(255,30,60,.45)';
      ctx.lineWidth = 0.6;
      const lineToX = slot.lx < hub.x ? slot.lx + slot.bw : slot.lx;
      const lineToY = slot.ly + slot.bh / 2;
      ctx.beginPath();
      ctx.moveTo(hub.x, hub.y); ctx.lineTo(lineToX, lineToY);
      ctx.stroke();

      ctx.fillStyle = 'rgba(0,0,0,.82)';
      ctx.fillRect(slot.lx, slot.ly, slot.bw, slot.bh);
      ctx.strokeStyle = 'rgba(255,30,60,.32)';
      ctx.strokeRect(slot.lx + 0.5, slot.ly + 0.5, slot.bw - 1, slot.bh - 1);
      ctx.fillStyle = RED_2;
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(slot.txt, slot.lx + 5, slot.ly + slot.bh / 2 + 0.5);
    }

    /* ===== hover overlay ===== */
    if (this.hover){
      const hub = this.hover;
      const txt = `${hub.name}  ·  τ ${hub.stake.toFixed(1)}M staked`;
      ctx.font = '600 11px JetBrains Mono, monospace';
      ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
      const tw = ctx.measureText(txt).width;
      const padX = 8;
      const bx = Math.min(w - tw - padX * 2 - 4, hub.x + 10);
      const by = Math.max(28, hub.y - 14);
      ctx.fillStyle = '#000';
      ctx.fillRect(bx, by - 18, tw + padX * 2, 22);
      ctx.strokeStyle = 'rgba(255,30,60,.45)';
      ctx.strokeRect(bx + .5, by - 17.5, tw + padX * 2, 21);
      ctx.fillStyle = WHITE;
      ctx.fillText(txt, bx + padX, by - 4);
    }

    /* ===== chrome, minimal ===== */
    ctx.font = '600 9.5px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(255,30,60,.55)';
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText('EQUIRECT · WGS84', marginL, marginT - 4);
    ctx.textAlign = 'right';
    ctx.fillText(
      `LON ${consensusLng.toFixed(1).padStart(7,' ')}°   HEAD · CONSENSUS`,
      w - marginR, marginT - 4
    );

    /* lint guard */
    void C_DOT;
  }
}
