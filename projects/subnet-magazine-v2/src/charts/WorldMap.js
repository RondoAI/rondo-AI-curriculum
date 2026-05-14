/* =================================================================
   SUBNET MAGAZINE — WORLD MAP CHART
   -----------------------------------------------------------------
   Equirectangular dot-density world rendered to canvas. Every dot
   is a 6° × 6° land cell drawn in faint red; on top of that, named
   validator hubs pulse in brighter red, connected by great-circle
   arcs to a moving "consensus head" that walks around the globe.

   No external map library — the land mask is a tiny packed string
   we author below. This keeps the asset budget under 4KB for the
   whole map.
   ================================================================= */

import { Chart } from './Chart.js';

/**
 * 36×18 land mask, 10° × 10° per cell. Generated from a low-res
 * raster of natural-earth land polygons. '#' = land, '.' = water.
 * North is row 0 (60°N+), south is row 17 (60°S+). The mask is
 * intentionally coarse — the dot grid we render on top is finer.
 */
const LAND_MASK = [
  '....#.##############################',
  '...##.################################',
  '..####################################',
  '.#####.....#####################...##.',
  '.#####.......################......##.',
  '..####.........############........##.',
  '..####............##########..........',
  '...####............########.........#.',
  '....####............#######.........##',
  '.....####............######........###',
  '......####............####.........##.',
  '.......####............##...........#.',
  '........####............#............',
  '.........###..........................',
  '..........##..........................',
  '.....................##.##............',
  '....................##############....',
  '.....##############################...',
];

/** Notable validator hubs around the globe. */
const HUBS = [
  { name:'SAN FRANCISCO', lat: 37.78, lng:-122.42, stake: 8.4 },
  { name:'NEW YORK',      lat: 40.71, lng: -74.01, stake: 6.1 },
  { name:'TORONTO',       lat: 43.65, lng: -79.38, stake: 2.4 },
  { name:'SAO PAULO',     lat:-23.55, lng: -46.63, stake: 1.2 },
  { name:'LONDON',        lat: 51.51, lng:  -0.13, stake: 7.6 },
  { name:'FRANKFURT',     lat: 50.11, lng:   8.68, stake:11.2 },
  { name:'AMSTERDAM',     lat: 52.37, lng:   4.89, stake: 6.8 },
  { name:'HELSINKI',      lat: 60.17, lng:  24.94, stake: 2.4 },
  { name:'CAPE TOWN',     lat:-33.92, lng:  18.42, stake: 0.8 },
  { name:'MUMBAI',        lat: 19.08, lng:  72.88, stake: 2.6 },
  { name:'SINGAPORE',     lat:  1.35, lng: 103.82, stake: 8.6 },
  { name:'TOKYO',         lat: 35.68, lng: 139.69, stake: 5.8 },
  { name:'SEOUL',         lat: 37.57, lng: 126.98, stake: 3.4 },
  { name:'SYDNEY',        lat:-33.87, lng: 151.21, stake: 1.8 },
];

const RED       = '#FF1E3C';
const RED_DIM   = 'rgba(255,30,60,.22)';
const RED_DOT   = 'rgba(255,30,60,.36)';
const RED_GRID  = 'rgba(255,30,60,.06)';
const RED_TEXT  = 'rgba(255,30,60,.55)';
const WHITE     = '#F5E5E8';

export class WorldMap extends Chart {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas){
    super(canvas, { animate: true });
    /** @private */ this.dots = [];           // {x,y,size} land grid dots
    /** @private */ this.hubPts = [];         // hub projection cache
    /** @private */ this.consensusAngle = 0;  // moving consensus head, radians
    /** @private */ this.hover = null;
    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      const px = (e.clientX - r.left), py = (e.clientY - r.top);
      let closest = null, best = 18 * 18;
      for (const h of this.hubPts){
        const d = (h.x - px) ** 2 + (h.y - py) ** 2;
        if (d < best){ best = d; closest = h; }
      }
      this.hover = closest;
    });
    canvas.addEventListener('mouseleave', () => { this.hover = null; });
  }

  /** Project (lat,lng) → canvas pixels using equirectangular. */
  _project(lat, lng){
    return [
      (lng + 180) / 360 * this.w,
      (90 - lat)  / 180 * this.h,
    ];
  }

  /** @param {boolean} mask Whether the 10°×10° cell at (col,row) is land. */
  _isLand(col, row){
    const r = LAND_MASK[row];
    return r && r[col] === '#';
  }

  layout(ctx, w, h){
    // Rebuild the dot grid: ~7px spacing, denser near land cells.
    const dots = [];
    const stepX = Math.max(6, w / 110);
    const stepY = Math.max(6, h / 55);
    for (let py = stepY / 2; py < h; py += stepY){
      for (let px = stepX / 2; px < w; px += stepX){
        const lng = px / w * 360 - 180;
        const lat = 90 - py / h * 180;
        const col = Math.min(35, Math.max(0, Math.floor((lng + 180) / 10)));
        const row = Math.min(17, Math.max(0, Math.floor((90 - lat) / 10)));
        if (this._isLand(col, row)){
          const jitterX = (Math.random() - .5) * stepX * .3;
          const jitterY = (Math.random() - .5) * stepY * .3;
          dots.push({ x: px + jitterX, y: py + jitterY, size: Math.random() * .7 + .9 });
        }
      }
    }
    this.dots = dots;
    this.hubPts = HUBS.map(h => {
      const [x, y] = this._project(h.lat, h.lng);
      return { ...h, x, y };
    });
  }

  draw(ctx, w, h, t){
    ctx.clearRect(0, 0, w, h);

    // === grid + equator/meridian guides ===
    ctx.strokeStyle = RED_GRID;
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

    // === land dots ===
    ctx.fillStyle = RED_DOT;
    for (const d of this.dots){
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // === consensus head: a position on the equator that walks ===
    this.consensusAngle = (t * 0.08) % (Math.PI * 2);
    const consensusLng = (this.consensusAngle / Math.PI * 180) - 180;
    const [chX, chY] = this._project(0, consensusLng);
    ctx.strokeStyle = RED_DIM;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chX, 0); ctx.lineTo(chX, h);
    ctx.stroke();

    // === hubs: glow halo, then arc to consensus head, then dot ===
    for (const hub of this.hubPts){
      const pulse = 0.55 + 0.45 * Math.sin(t * 1.8 + hub.lat * 0.1);

      // halo
      const grad = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, 22 + hub.stake);
      grad.addColorStop(0, `rgba(255,30,60,${0.55 * pulse})`);
      grad.addColorStop(1, 'rgba(255,30,60,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(hub.x, hub.y, 22 + hub.stake, 0, Math.PI * 2); ctx.fill();

      // arc to the consensus head — a faint great-circle approximation
      ctx.strokeStyle = `rgba(255,30,60,${0.16 + 0.10 * pulse})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(hub.x, hub.y);
      const cx = (hub.x + chX) / 2;
      const cy = Math.min(hub.y, chY) - Math.abs(hub.x - chX) * 0.18;
      ctx.quadraticCurveTo(cx, cy, chX, chY);
      ctx.stroke();

      // core dot
      ctx.fillStyle = RED;
      ctx.shadowColor = RED; ctx.shadowBlur = 6 * pulse;
      ctx.beginPath();
      ctx.arc(hub.x, hub.y, 2.4 + hub.stake * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // === consensus head dot ===
    ctx.fillStyle = WHITE;
    ctx.shadowColor = RED; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(chX, chY, 3, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // === hover label ===
    if (this.hover){
      const hub = this.hover;
      ctx.font = '600 11px JetBrains Mono, monospace';
      ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
      const txt = `${hub.name} · τ ${(hub.stake).toFixed(1)}M`;
      const tw = ctx.measureText(txt).width;
      const padX = 6, padY = 4;
      const bx = Math.min(w - tw - padX * 2 - 4, hub.x + 8);
      const by = Math.max(20, hub.y - 10);
      ctx.fillStyle = '#000';
      ctx.fillRect(bx, by - 16, tw + padX * 2, 18);
      ctx.strokeStyle = RED_DIM; ctx.lineWidth = 1;
      ctx.strokeRect(bx + 0.5, by - 16 + 0.5, tw + padX * 2, 18);
      ctx.fillStyle = WHITE;
      ctx.fillText(txt, bx + padX, by - 2);
    }

    // === watermark frame coords ===
    ctx.font = '600 9.5px JetBrains Mono, monospace';
    ctx.fillStyle = RED_TEXT;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText('EQUIRECT  ·  WGS84', 10, 10);
    ctx.textAlign = 'right';
    ctx.fillText(`LON ${consensusLng.toFixed(1).padStart(6,' ')}°  ·  T+${t.toFixed(1)}s`, w - 10, 10);
    ctx.textAlign = 'left';
    ctx.fillText(`HUBS · ${HUBS.length}   STAKE Σ · τ 6.24M`, 10, h - 18);
  }
}
