/* =================================================================
   SUBNET MAGAZINE — WORLD GLOBE
   -----------------------------------------------------------------
   A 3D rotating earth rendered to 2D canvas. Continents are dot
   density on the sphere surface; validator hubs sit slightly above
   the surface and are wired together in an orbital mesh; great-
   circle arcs carry packets between hubs.

   Designed for the "PS5 cinematic" feel: smooth easing on rotation,
   atmospheric red rim, anti-aliased dots with depth-derived alpha,
   restrained motion.

   Interaction:
     - Auto-rotates on idle (slow, eastward)
     - Drag to spin (pointer events); inertia carries on release
     - Goes back to idle auto-rotation after ~3 seconds of stillness

   Math: standard spherical-to-cartesian, Y-up. Rotate around Y
   (longitude) then X (latitude). Project orthographic.
   ================================================================= */

import { Chart } from './Chart.js';
import { COUNTRY_BORDERS, COUNTRY_LABELS, US_STATES } from '../data/geo.js';
import { decodeTopology, largestPolygonCentroid } from '../data/topojson.js';

/* Natural Earth 110m country names → short labels for the globe.
   Most names from the TopoJSON file are already fine; this map only
   handles the verbose ones. */
const NAME_SHORT = {
  'United States of America':'USA',
  'Russian Federation':'RUSSIA',
  'United Kingdom':'UK',
  'United Republic of Tanzania':'TANZANIA',
  'Republic of Korea':'S. KOREA',
  'Dem. Rep. Korea':'N. KOREA',
  'Dem. Rep. Congo':'DR CONGO',
  'Bosnia and Herz.':'BOSNIA',
  'Czech Republic':'CZECH',
  'Central African Rep.':'CAR',
  'Eq. Guinea':'EQ. GUINEA',
  'Côte d’Ivoire':'IVORY COAST',
  'Côte d\'Ivoire':'IVORY COAST',
  'United Arab Emirates':'UAE',
  'Trinidad and Tobago':'TRINIDAD',
  'Papua New Guinea':'PAPUA NEW GUINEA',
  'New Zealand':'NEW ZEALAND',
  'Saudi Arabia':'SAUDI',
  'South Africa':'S. AFRICA',
  'South Sudan':'S. SUDAN',
  'Burkina Faso':'BURKINA',
  'Solomon Is.':'SOLOMON IS.',
  'Falkland Is.':'FALKLAND',
  'W. Sahara':'W. SAHARA',
};
function shortName(s){ return (NAME_SHORT[s] || s).toUpperCase(); }

/* Country display priority — biggest landmasses first so they
   "win" anti-collision over smaller neighbors. */
const PRIORITY = new Set([
  'USA','RUSSIA','CHINA','BRAZIL','CANADA','INDIA','AUSTRALIA',
  'ARGENTINA','MEXICO','UK','FRANCE','GERMANY','SPAIN','ITALY',
  'JAPAN','S. AFRICA','EGYPT','SAUDI','UAE','TURKEY','IRAN',
  'INDONESIA','S. KOREA','UKRAINE','POLAND','SWEDEN','NORWAY',
  'FINLAND','GREECE','VIETNAM','THAILAND','PHILIPPINES','NIGERIA',
  'KENYA','ETHIOPIA','MOROCCO','ALGERIA','PERU','COLOMBIA','CHILE',
  'VENEZUELA','NEW ZEALAND','PAKISTAN','BANGLADESH',
]);

/* ---------- Palette ---------- */
const RED       = '#FF1E3C';
const RED_2     = '#FF4D60';
const RED_3     = '#FF8094';
const WHITE     = '#F5E5E8';

/* ---------- Validator hubs ---------- */
const HUBS = [
  { code:'SFO', name:'SAN FRANCISCO', lat: 37.78, lng:-122.42, stake: 8.4, validators: 412, miners: 2_141 },
  { code:'NYC', name:'NEW YORK',      lat: 40.71, lng: -74.01, stake: 6.1, validators: 288, miners: 1_580 },
  { code:'YYZ', name:'TORONTO',       lat: 43.65, lng: -79.38, stake: 2.4, validators: 124, miners:   612 },
  { code:'MEX', name:'MEXICO CITY',   lat: 19.43, lng: -99.13, stake: 0.9, validators:  48, miners:   240 },
  { code:'SAO', name:'SAO PAULO',     lat:-23.55, lng: -46.63, stake: 1.2, validators:  64, miners:   312 },
  { code:'LON', name:'LONDON',        lat: 51.51, lng:  -0.13, stake: 7.6, validators: 380, miners: 1_972 },
  { code:'FRA', name:'FRANKFURT',     lat: 50.11, lng:   8.68, stake:11.2, validators: 621, miners: 3_154 },
  { code:'AMS', name:'AMSTERDAM',     lat: 52.37, lng:   4.89, stake: 6.8, validators: 340, miners: 1_812 },
  { code:'HEL', name:'HELSINKI',      lat: 60.17, lng:  24.94, stake: 2.4, validators: 124, miners:   610 },
  { code:'CPT', name:'CAPE TOWN',     lat:-33.92, lng:  18.42, stake: 0.8, validators:  42, miners:   216 },
  { code:'BOM', name:'MUMBAI',        lat: 19.08, lng:  72.88, stake: 2.6, validators: 148, miners:   820 },
  { code:'DXB', name:'DUBAI',         lat: 25.20, lng:  55.27, stake: 1.5, validators:  76, miners:   396 },
  { code:'SIN', name:'SINGAPORE',     lat:  1.35, lng: 103.82, stake: 8.6, validators: 412, miners: 2_188 },
  { code:'SEL', name:'SEOUL',         lat: 37.57, lng: 126.98, stake: 3.4, validators: 184, miners:   924 },
  { code:'TYO', name:'TOKYO',         lat: 35.68, lng: 139.69, stake: 5.8, validators: 294, miners: 1_510 },
  { code:'SYD', name:'SYDNEY',        lat:-33.87, lng: 151.21, stake: 1.8, validators:  96, miners:   478 },
];

/* ---------- Math ---------- */

const DEG = Math.PI / 180;

/** Convert (lat, lng) to a unit 3D vector. */
function sph2cart(lat, lng){
  const φ = lat * DEG, λ = lng * DEG;
  return {
    x: Math.cos(φ) * Math.cos(λ),
    y: Math.sin(φ),
    z: Math.cos(φ) * Math.sin(λ),
  };
}

/* ---------- Class ---------- */

export class WorldGlobe extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{
   *   radius?:     number,    // 0..1, fraction of min(w,h)/2
   *   autospin?:   number,    // rad/sec eastward
   *   tilt?:       number,    // initial X-tilt in radians
   *   hubAltitude?:number,    // 1.0 = surface, >1 = above
   * }} [opts]
   */
  constructor(canvas, opts = {}){
    super(canvas, { animate: true });

    /** @private */ this.radius = opts.radius ?? 0.44;
    /** @private */ this.autospin = opts.autospin ?? 0.06;
    /** @private */ this.hubAlt = opts.hubAltitude ?? 1.08;

    /** @private */ this.rotX = opts.tilt ?? 0.30;    // current tilt
    /** @private */ this.rotY = 0;                    // current longitude offset
    /** @private */ this.tgtX = this.rotX;            // smoothing target
    /** @private */ this.tgtY = this.rotY;

    /** @private */ this.dragging = false;
    /** @private */ this.lastPx = 0;
    /** @private */ this.lastPy = 0;
    /** @private */ this.vY = 0;                      // inertia
    /** @private */ this.vX = 0;
    /** @private */ this.lastInteraction = -1e9;

    /** @private */ this.hover = null;
    /** @private */ this.lastT = 0;

    /** @private */ this.hubs = HUBS.map(h => ({
      ...h,
      v: sph2cart(h.lat, h.lng),
    }));
    /** @private */ this.mesh = this._buildMesh();

    /* Optional live state — pushed in by the view via setStatus().
       Used to render data overlays inside the canvas. */
    /** @private */ this.status = {
      block:        4_812_047,
      epochBlock:   268,           // block within current 360-block epoch
      epoch:        14_302,
      tps:          2_147,
      vp:           96.4,          // validator participation %
      mempool:      412,           // pending tx count
      blockTimeMs:  12_000,
      emissionDay:  7_200,         // τ minted per day
    };

    /* Real geographic data loaded asynchronously. Until it arrives,
       the chart falls back to the hand-authored borders. */
    /** @private */ this.realFeatures = null;
    /** @private */ this.realLabels   = null;
    this._loadRealGeo();

    this._bind();
  }

  /** Fetch and decode the embedded Natural Earth 110m TopoJSON. */
  async _loadRealGeo(){
    try {
      const url = new URL('../data/countries-110m.json', import.meta.url);
      const res = await fetch(url, { cache: 'force-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const topo = await res.json();
      const { features } = decodeTopology(topo);
      this.realFeatures = features;
      this.realLabels = features
        .filter(f => f.polygons.length)
        .map(f => {
          const c = largestPolygonCentroid(f);
          return {
            name:    shortName(f.name),
            lng:     c[0],
            lat:     c[1],
            ringLen: f.polygons[0]?.[0]?.length ?? 0,
          };
        });
    } catch (e){
      console.warn('[WorldGlobe] real geo failed to load, using hand data:', e?.message);
    }
  }

  /**
   * Push live data into the globe.
   * @param {Partial<typeof this.status>} patch
   */
  setStatus(patch){
    if (!patch) return;
    Object.assign(this.status, patch);
  }

  _bind(){
    const c = this.canvas;
    const down = (e) => {
      const p = this._pt(e);
      this.dragging = true;
      this.lastPx = p.x; this.lastPy = p.y;
      this.vX = 0; this.vY = 0;
      this.lastInteraction = performance.now();
      c.setPointerCapture?.(e.pointerId);
    };
    const move = (e) => {
      const p = this._pt(e);
      const r = c.getBoundingClientRect();
      // hover hit-test
      this.hover = this._hitHub(p.x, p.y);
      if (!this.dragging) return;
      const dx = p.x - this.lastPx;
      const dy = p.y - this.lastPy;
      this.lastPx = p.x; this.lastPy = p.y;
      const k = 0.005;
      this.tgtY += dx * k;
      this.tgtX += dy * k;
      this.tgtX = Math.max(-1.2, Math.min(1.2, this.tgtX));
      this.vY = dx * k * 60;     // ~per-second velocity for inertia
      this.vX = dy * k * 60;
      this.lastInteraction = performance.now();
      void r;
    };
    const up = (e) => {
      this.dragging = false;
      c.releasePointerCapture?.(e.pointerId);
    };
    const leave = () => { this.hover = null; };
    c.addEventListener('pointerdown', down);
    c.addEventListener('pointermove', move);
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener('pointerleave', leave);
    c.style.cursor = 'grab';
  }

  _pt(e){
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  _hitHub(px, py){
    let best = 14 * 14, hit = null;
    const cx = this.w / 2, cy = this.h / 2;
    const R = Math.min(this.w, this.h) * this.radius;
    for (const h of this.hubs){
      const rot = this._rotate(h.v);
      if (rot.z < -0.05) continue;
      const sx = cx + rot.x * R * this.hubAlt;
      const sy = cy - rot.y * R * this.hubAlt;
      const d = (sx - px) ** 2 + (sy - py) ** 2;
      if (d < best){ best = d; hit = h; }
    }
    return hit;
  }

  /** Rotate a unit 3D vector by current (rotX, rotY). */
  _rotate(v){
    const cosY = Math.cos(this.rotY), sinY = Math.sin(this.rotY);
    const cosX = Math.cos(this.rotX), sinX = Math.sin(this.rotX);
    // Y rotation
    const x1 = v.x * cosY + v.z * sinY;
    const z1 = -v.x * sinY + v.z * cosY;
    // X rotation
    const y2 = v.y * cosX - z1 * sinX;
    const z2 = v.y * sinX + z1 * cosX;
    return { x: x1, y: y2, z: z2 };
  }

  /** Hub-to-hub mesh: top 8 hubs, fully connected. */
  _buildMesh(){
    const top = [...this.hubs].sort((a,b) => b.stake - a.stake).slice(0, 8);
    const out = [];
    for (let i = 0; i < top.length; i++)
      for (let j = i + 1; j < top.length; j++){
        // Pre-compute midpoint above sphere
        const a = top[i].v, b = top[j].v;
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, mz = (a.z + b.z) / 2;
        const ml = Math.hypot(mx, my, mz);
        const m = { x: mx / ml * 1.18, y: my / ml * 1.18, z: mz / ml * 1.18 };
        out.push({ a: top[i], b: top[j], m });
      }
    return out;
  }

  /** Cheap layout — nothing to precompute now that we render real
      polygons each frame. Just refresh hub vectors. */
  layout(){
    this.hubs.forEach(h => { h.v = sph2cart(h.lat, h.lng); });
  }

  draw(ctx, w, h, t){
    const dt = this.lastT === 0 ? 0 : Math.min(0.066, t - this.lastT);
    this.lastT = t;

    /* === update rotation: inertia decay + idle auto-spin === */
    const idle = (performance.now() - this.lastInteraction) > 2500;
    if (!this.dragging){
      if (idle){
        this.tgtY += this.autospin * dt;
      } else {
        // inertia decay
        this.tgtY += this.vY * dt;
        this.tgtX += this.vX * dt;
        this.vY *= 0.92;
        this.vX *= 0.92;
        this.tgtX = Math.max(-1.2, Math.min(1.2, this.tgtX));
      }
    }
    /* easing — give it the smooth feel */
    this.rotX += (this.tgtX - this.rotX) * 0.12;
    this.rotY += (this.tgtY - this.rotY) * 0.12;

    /* === paint === */
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2, cy = h / 2;
    const R  = Math.min(w, h) * this.radius;

    /* outer atmosphere */
    const atmos = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.30);
    atmos.addColorStop(0, 'rgba(255,30,60,.18)');
    atmos.addColorStop(0.6, 'rgba(255,30,60,.05)');
    atmos.addColorStop(1, 'rgba(255,30,60,0)');
    ctx.fillStyle = atmos;
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.30, 0, Math.PI * 2); ctx.fill();

    /* sphere body — dark with subtle off-center highlight */
    const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, R * 0.05, cx, cy, R);
    body.addColorStop(0, '#1A0408');
    body.addColorStop(0.7, '#0A0204');
    body.addColorStop(1,   '#04010A');
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

    /* country fills — solid filled landmasses from real polygons */
    this._drawCountryFills(ctx, cx, cy, R);

    /* graticule on the sphere — only front-facing arcs */
    this._drawGraticule(ctx, cx, cy, R);

    /* country borders — thin strokes on the front hemisphere */
    this._drawCountryBorders(ctx, cx, cy, R);

    /* country + state labels — float on the visible hemisphere */
    this._drawCountryLabels(ctx, cx, cy, R, w, h);

    /* radial activity ring around the silhouette */
    this._drawActivityRing(ctx, cx, cy, R, t);

    /* orbital mesh — arcs going OVER the sphere between hub pairs */
    for (const m of this.mesh){
      const ra = this._rotate(m.a.v);
      const rb = this._rotate(m.b.v);
      const rm = this._rotate(m.m);
      // skip if both endpoints clearly behind
      if (ra.z < -0.25 && rb.z < -0.25) continue;
      const ax = cx + ra.x * R * this.hubAlt;
      const ay = cy - ra.y * R * this.hubAlt;
      const bx = cx + rb.x * R * this.hubAlt;
      const by = cy - rb.y * R * this.hubAlt;
      const mxp = cx + rm.x * R;
      const myp = cy - rm.y * R;
      const mz = (ra.z + rb.z + rm.z) / 3;
      const alpha = Math.max(0, 0.06 + mz * 0.32);
      ctx.strokeStyle = `rgba(255,30,60,${alpha})`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.quadraticCurveTo(mxp, myp, bx, by);
      ctx.stroke();
    }

    /* arc packets */
    const packetCount = 14;
    for (let i = 0; i < packetCount; i++){
      const m = this.mesh[i % this.mesh.length];
      const k = ((t * 0.18) + i / packetCount) % 1;
      const ra = this._rotate(m.a.v);
      const rb = this._rotate(m.b.v);
      const rm = this._rotate(m.m);
      if (ra.z < -0.1 || rb.z < -0.1) continue;
      const ax = cx + ra.x * R * this.hubAlt;
      const ay = cy - ra.y * R * this.hubAlt;
      const bx = cx + rb.x * R * this.hubAlt;
      const by = cy - rb.y * R * this.hubAlt;
      const mxp = cx + rm.x * R;
      const myp = cy - rm.y * R;
      const u = 1 - k;
      const px = u * u * ax + 2 * u * k * mxp + k * k * bx;
      const py = u * u * ay + 2 * u * k * myp + k * k * by;
      const mz = (ra.z + rb.z + rm.z) / 3;
      const alpha = Math.max(0, 0.4 + mz * 0.55);
      ctx.fillStyle = `rgba(255,128,148,${alpha})`;
      ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2); ctx.fill();
    }

    /* hubs (slightly above surface) */
    const labelSlots = [];
    const visHubs = this.hubs.map(h => ({ h, r: this._rotate(h.v) }))
      .filter(o => o.r.z > -0.15)
      .sort((a, b) => a.r.z - b.r.z);    // back to front

    for (const { h, r } of visHubs){
      const sx = cx + r.x * R * this.hubAlt;
      const sy = cy - r.y * R * this.hubAlt;
      const front = Math.max(0, r.z);
      const pulse = 0.55 + 0.45 * Math.sin(t * 1.4 + h.lat * 0.1);

      /* halo */
      const halo = 8 + h.stake * 0.7;
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, halo);
      g.addColorStop(0, `rgba(255,30,60,${0.42 * front * pulse})`);
      g.addColorStop(1, 'rgba(255,30,60,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(sx, sy, halo, 0, Math.PI * 2); ctx.fill();

      /* tether to the sphere surface */
      const sxSurf = cx + r.x * R;
      const sySurf = cy - r.y * R;
      ctx.strokeStyle = `rgba(255,30,60,${0.35 * front})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(sx, sy); ctx.lineTo(sxSurf, sySurf);
      ctx.stroke();

      /* core */
      ctx.fillStyle = RED;
      ctx.shadowColor = RED; ctx.shadowBlur = 6 * front * pulse;
      ctx.beginPath(); ctx.arc(sx, sy, 2 + h.stake * 0.18, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

      /* always-on label for top hubs */
      if (h.stake >= 5 && front > 0.55){
        const txt = `${h.code}  τ${h.stake.toFixed(1)}M`;
        ctx.font = '600 9.5px JetBrains Mono, monospace';
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        const tw = ctx.measureText(txt).width;
        const lx = sx + 8, ly = sy - 8;
        if (lx + tw + 8 < w && ly > 12){
          ctx.fillStyle = 'rgba(0,0,0,.78)';
          ctx.fillRect(lx, ly - 7, tw + 8, 14);
          ctx.strokeStyle = 'rgba(255,30,60,.35)';
          ctx.strokeRect(lx + 0.5, ly - 6.5, tw + 8, 13);
          ctx.fillStyle = RED_2;
          ctx.fillText(txt, lx + 4, ly + 0.5);
          labelSlots.push(lx, ly);
        }
      }
    }

    /* hover overlay (full data) */
    if (this.hover){
      const hub = this.hover;
      const rot = this._rotate(hub.v);
      const sx = cx + rot.x * R * this.hubAlt;
      const sy = cy - rot.y * R * this.hubAlt;
      const lines = [
        `${hub.name}  ·  ${hub.code}`,
        `τ ${hub.stake.toFixed(1)}M staked`,
        `${hub.validators.toLocaleString('en-US')} validators · ${hub.miners.toLocaleString('en-US')} miners`,
      ];
      ctx.font = '600 11px JetBrains Mono, monospace';
      let tw = 0;
      for (const ln of lines) tw = Math.max(tw, ctx.measureText(ln).width);
      const padX = 10, padY = 8, lh = 14;
      const bw = tw + padX * 2, bh = lines.length * lh + padY * 2 - 4;
      const bx = Math.min(w - bw - 8, sx + 12);
      const by = Math.max(8, Math.min(h - bh - 8, sy + 12));
      ctx.fillStyle = 'rgba(0,0,0,.82)';
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = 'rgba(255,30,60,.45)';
      ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
      ctx.fillStyle = WHITE;
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      lines.forEach((ln, i) => ctx.fillText(ln, bx + padX, by + padY + i * lh));
    }

    /* rim glow on the silhouette */
    ctx.strokeStyle = 'rgba(255,30,60,.45)';
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,30,60,.18)';
    ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.06, 0, Math.PI * 2); ctx.stroke();

    /* === Data overlays — terminal-grade chrome === */
    this._drawOverlays(ctx, w, h, t);

    /* lint guard */
    void RED_3;
  }

  /** Render the four-corner data readouts and the epoch progress bar. */
  _drawOverlays(ctx, w, h, t){
    const RED_DIM   = 'rgba(255,30,60,.55)';
    const RED_VDIM  = 'rgba(255,30,60,.32)';
    const INK_DIM   = 'rgba(232,200,205,.65)';

    const s = this.status;
    const lonOff = ((this.rotY / Math.PI * 180) % 360 + 540) % 360 - 180;
    const tps = (s.tps + Math.sin(t * 0.6) * 24 | 0);
    const epochProgress = (s.epochBlock % 360) / 360;
    const blocksLeft = 360 - (s.epochBlock % 360);
    const secsLeft = Math.max(0, blocksLeft * (s.blockTimeMs / 1000));
    const mm = Math.floor(secsLeft / 60), ss = Math.floor(secsLeft % 60);
    const countdown = `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;

    /* Top-left: SYS · CHAIN · BLOCK */
    ctx.font = '600 9.5px JetBrains Mono, monospace';
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillStyle = RED_DIM;
    ctx.fillText('SYS  ·  CHAIN', 12, 12);
    ctx.fillStyle = INK_DIM;
    ctx.fillText('v3.2.4  ·  MAINNET', 12, 26);
    ctx.fillStyle = RED_DIM;
    ctx.fillText(`BLOCK  ·  ${s.block.toLocaleString('en-US')}`, 12, 40);

    /* Top-right: ORBITAL · EPOC · EMIT */
    ctx.textAlign = 'right';
    ctx.fillStyle = RED_DIM;
    ctx.fillText('ORBITAL  ·  WGS84', w - 12, 12);
    ctx.fillStyle = INK_DIM;
    ctx.fillText(`LON ${lonOff.toFixed(0).padStart(4, ' ')}°  ·  EPOC ${s.epoch.toLocaleString('en-US')}`, w - 12, 26);
    ctx.fillStyle = RED_DIM;
    ctx.fillText(`τ EMIT  ·  ${s.emissionDay.toLocaleString('en-US')} / d`, w - 12, 40);

    /* Bottom-left: epoch progress bar + countdown */
    const barX = 12;
    const barY = h - 30;
    const barW = Math.min(220, w * 0.35);
    const barH = 4;
    ctx.fillStyle = 'rgba(255,30,60,.08)';
    ctx.fillRect(barX, barY, barW, barH);
    const fillW = Math.max(1, Math.floor(barW * epochProgress));
    const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    grad.addColorStop(0, '#FF1E3C');
    grad.addColorStop(1, '#FF8094');
    ctx.fillStyle = grad;
    ctx.fillRect(barX, barY, fillW, barH);
    ctx.font = '600 9.5px JetBrains Mono, monospace';
    ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
    ctx.fillStyle = RED_DIM;
    ctx.fillText(`EPOCH PROGRESS  ${(epochProgress * 100).toFixed(0).padStart(2, ' ')}%`, barX, barY - 4);
    ctx.fillStyle = INK_DIM;
    ctx.textBaseline = 'top';
    ctx.fillText(`CLOSE IN  ${countdown}  ·  ${blocksLeft} BLOCKS`, barX, barY + 10);

    /* Bottom-right: TPS · VP · MEMPOOL */
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    const items = [
      { k:'TPS',     v: tps.toString() },
      { k:'VP',      v: `${s.vp.toFixed(1)}%` },
      { k:'MEMPOOL', v: s.mempool.toString() },
    ];
    let xCursor = w - 12;
    for (let i = items.length - 1; i >= 0; i--){
      const it = items[i];
      const txt = `${it.k} ${it.v}`;
      const tw = ctx.measureText(txt).width;
      ctx.fillStyle = INK_DIM;
      ctx.fillText(txt, xCursor, h - 12);
      xCursor -= (tw + 18);
    }

    /* drag hint */
    ctx.font = '600 9px JetBrains Mono, monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'right';
    ctx.fillStyle = RED_VDIM;
    ctx.fillText(this.dragging ? 'ROTATING…' : 'DRAG TO ROTATE  ·  AUTO-SPIN ON IDLE', w - 12, 56);
  }

  /** Render a ring (list of [lng,lat]) on the sphere, breaking the
      stroke at the horizon so segments don't smear across the back. */
  _drawRingOnSphere(ctx, ring, cx, cy, R){
    ctx.beginPath();
    let started = false, lastVis = false;
    for (let k = 0; k < ring.length; k++){
      const [lng, lat] = ring[k];
      const v = sph2cart(lat, lng);
      const r = this._rotate(v);
      const vis = r.z > 0.04;
      if (!vis){ started = false; lastVis = false; continue; }
      const sx = cx + r.x * R;
      const sy = cy - r.y * R;
      if (!started || !lastVis){ ctx.moveTo(sx, sy); started = true; }
      else ctx.lineTo(sx, sy);
      lastVis = true;
    }
    ctx.stroke();
  }

  /** Country fills — solid landmasses from real polygons. Skips any
      polygon that crosses the silhouette so we don't paint smeared
      shapes wrapping the limb. */
  _drawCountryFills(ctx, cx, cy, R){
    if (!this.realFeatures) return;

    /* Light tint of red sitting on top of the dark sphere body so
       the land reads but doesn't dominate. */
    ctx.fillStyle = 'rgba(255,30,60,.13)';

    for (const f of this.realFeatures){
      for (const poly of f.polygons){
        const ring = poly[0];
        if (!ring || ring.length < 3) continue;

        /* First pass: project every vertex; skip the polygon if any
           vertex is clearly on the back hemisphere. This avoids the
           "polygon dragged across the sphere" artifact. */
        const projected = new Array(ring.length);
        let allFront = true;
        for (let i = 0; i < ring.length; i++){
          const [lng, lat] = ring[i];
          const v = sph2cart(lat, lng);
          const r = this._rotate(v);
          if (r.z < -0.05){ allFront = false; break; }
          projected[i] = { x: cx + r.x * R, y: cy - r.y * R, z: r.z };
        }
        if (!allFront) continue;

        ctx.beginPath();
        for (let i = 0; i < projected.length; i++){
          const p = projected[i];
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  /** Country borders — Natural Earth real data if loaded, else
      fall back to the curated hand-drawn set. */
  _drawCountryBorders(ctx, cx, cy, R){
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255,107,122,.40)';
    ctx.lineWidth = 0.6;

    if (this.realFeatures){
      for (const f of this.realFeatures){
        for (const poly of f.polygons){
          const ring = poly[0];
          if (ring && ring.length >= 3) this._drawRingOnSphere(ctx, ring, cx, cy, R);
        }
      }
      return;
    }

    /* fallback */
    ctx.strokeStyle = 'rgba(255,107,122,.38)';
    ctx.lineWidth = 0.7;
    for (const c of COUNTRY_BORDERS){
      this._drawRingOnSphere(ctx, c.poly, cx, cy, R);
    }
  }

  /** Country labels + US-state labels on the front hemisphere. */
  _drawCountryLabels(ctx, cx, cy, R, w, h){
    const placed = [];
    const try_place = (x, y, w_, h_) => {
      for (const r of placed){
        if (x < r.x + r.w && x + w_ > r.x && y < r.y + r.h && y + h_ > r.y) return false;
      }
      placed.push({ x, y, w: w_, h: h_ });
      return true;
    };

    /* Real labels if loaded, else hand-authored as a fallback. The
       priority set picks the big land masses first so they always
       win anti-collision against smaller neighbors. */
    ctx.font = '700 9.5px JetBrains Mono, monospace';
    ctx.textBaseline = 'middle';

    let candidates;
    if (this.realLabels){
      candidates = this.realLabels.slice().sort((a, b) => {
        const aPri = PRIORITY.has(a.name) ? 0 : (a.ringLen >= 50 ? 1 : 2);
        const bPri = PRIORITY.has(b.name) ? 0 : (b.ringLen >= 50 ? 1 : 2);
        if (aPri !== bPri) return aPri - bPri;
        return (b.ringLen ?? 0) - (a.ringLen ?? 0);
      });
    } else {
      candidates = COUNTRY_LABELS.slice().sort((a, b) => a.pr - b.pr);
    }

    for (const c of candidates){
      const v = sph2cart(c.lat, c.lng);
      const r = this._rotate(v);
      if (r.z < 0.15) continue;
      const sx = cx + r.x * R;
      const sy = cy - r.y * R;
      const tw = ctx.measureText(c.name).width;
      const bx = sx - tw / 2;
      const by = sy - 6;
      if (bx < 50 || bx + tw > w - 50) continue;
      if (by < 50 || by > h - 50) continue;
      if (!try_place(bx - 2, by - 2, tw + 4, 12)) continue;
      const alpha = 0.4 + r.z * 0.55;
      ctx.fillStyle = `rgba(255,176,186,${alpha})`;
      ctx.textAlign = 'center';
      ctx.fillText(c.name, sx, sy);
    }

    /* US states — only when North America is squarely facing us. */
    const usCenter = this._rotate(sph2cart(39, -98));
    if (usCenter.z > 0.55){
      ctx.font = '600 8.5px JetBrains Mono, monospace';
      for (const s of US_STATES){
        const v = sph2cart(s.lat, s.lng);
        const r = this._rotate(v);
        if (r.z < 0.35) continue;
        const sx = cx + r.x * R;
        const sy = cy - r.y * R;
        const tw = ctx.measureText(s.code).width;
        if (!try_place(sx - 6, sy - 5, 12, 10)) continue;
        ctx.fillStyle = `rgba(255,30,60,${0.35 + r.z * 0.45})`;
        ctx.textAlign = 'center';
        ctx.fillText(s.code, sx, sy);
        void tw;
      }
    }
  }

  /** Segmented red ring around the silhouette — 36 segments, intensity
      cycles to suggest live network activity. */
  _drawActivityRing(ctx, cx, cy, R, t){
    const segs = 36;
    const rIn = R * 1.10;
    const rOut = R * 1.16;
    for (let i = 0; i < segs; i++){
      const a0 = (i / segs) * Math.PI * 2 - Math.PI / 2;
      const a1 = ((i + 0.85) / segs) * Math.PI * 2 - Math.PI / 2;
      /* deterministic seed for each segment, modulated by time */
      const seed = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      const phase = (seed - Math.floor(seed)) * Math.PI * 2;
      const intensity = 0.18 + 0.40 * (0.5 + 0.5 * Math.sin(t * 1.5 + phase));
      ctx.strokeStyle = `rgba(255,30,60,${intensity})`;
      ctx.lineWidth = rOut - rIn;
      ctx.beginPath();
      ctx.arc(cx, cy, (rIn + rOut) / 2, a0, a1);
      ctx.stroke();
    }
    /* outer thin guide */
    ctx.strokeStyle = 'rgba(255,30,60,.10)';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.arc(cx, cy, rOut, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, rIn, 0, Math.PI * 2); ctx.stroke();
  }

  /** Latitude/longitude wireframe arcs on the visible hemisphere. */
  _drawGraticule(ctx, cx, cy, R){
    ctx.strokeStyle = 'rgba(255,30,60,.10)';
    ctx.lineWidth = 0.6;
    const segs = 64;
    for (let lat = -60; lat <= 60; lat += 30){
      ctx.beginPath();
      let started = false;
      for (let k = 0; k <= segs; k++){
        const lng = -180 + (360 / segs) * k;
        const v = sph2cart(lat, lng);
        const r = this._rotate(v);
        if (r.z < 0){ started = false; continue; }
        const sx = cx + r.x * R, sy = cy - r.y * R;
        if (!started){ ctx.moveTo(sx, sy); started = true; }
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }
    for (let lng = -180; lng < 180; lng += 30){
      ctx.beginPath();
      let started = false;
      for (let k = 0; k <= segs; k++){
        const lat = -85 + (170 / segs) * k;
        const v = sph2cart(lat, lng);
        const r = this._rotate(v);
        if (r.z < 0){ started = false; continue; }
        const sx = cx + r.x * R, sy = cy - r.y * R;
        if (!started){ ctx.moveTo(sx, sy); started = true; }
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }
  }
}
