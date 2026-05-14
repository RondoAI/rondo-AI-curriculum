/* =================================================================
   SUBNET MAGAZINE — TOPOJSON DECODER
   -----------------------------------------------------------------
   A minimal TopoJSON-1 decoder. Just enough to turn the Natural
   Earth `world-atlas/countries-110m.json` (and similar) back into
   GeoJSON-style polygons in (lng, lat). No quantization features
   beyond what world-atlas uses, no projection — just the math.

   References:
     https://github.com/topojson/topojson-specification

   Public API:
     - decodeTopology(topo) → { features: [{ name, polygons }] }
        where polygons is Array<Array<[lng, lat][]>>:
          outer ring first, then any inner rings (we paint outer
          rings only).
   ================================================================= */

/**
 * @typedef {Object} CountryFeature
 * @prop {string} name
 * @prop {string|number} id
 * @prop {[number,number][][]} polygons  Outer rings only
 */

/**
 * @param {any} topo
 * @returns {{ features: CountryFeature[] }}
 */
export function decodeTopology(topo){
  const { arcs, transform, objects } = topo;
  if (!arcs) throw new Error('topojson: missing arcs');
  const sx = transform?.scale?.[0]     ?? 1;
  const sy = transform?.scale?.[1]     ?? 1;
  const tx = transform?.translate?.[0] ?? 0;
  const ty = transform?.translate?.[1] ?? 0;

  /* dequantize each delta-encoded arc into absolute (lng, lat) */
  const decoded = arcs.map(arc => {
    let x = 0, y = 0;
    const out = new Array(arc.length);
    for (let i = 0; i < arc.length; i++){
      x += arc[i][0];
      y += arc[i][1];
      out[i] = [x * sx + tx, y * sy + ty];
    }
    return out;
  });

  /* expand an arc reference (~i means reverse of arc i) */
  function getArc(idx){
    if (idx < 0){
      const src = decoded[~idx];
      const rev = new Array(src.length);
      for (let i = 0; i < src.length; i++) rev[i] = src[src.length - 1 - i];
      return rev;
    }
    return decoded[idx];
  }

  /* stitch a ring (sequence of arc indices) into a single coord array */
  function stitchRing(arcIdxList){
    const ring = [];
    for (let i = 0; i < arcIdxList.length; i++){
      const seg = getArc(arcIdxList[i]);
      const start = i === 0 ? 0 : 1;          // skip the duplicate join
      for (let k = start; k < seg.length; k++) ring.push(seg[k]);
    }
    return ring;
  }

  /* turn a geometry into an array of polygons (each polygon is an
     array of rings; we only emit outer rings, dropping holes). */
  function geomPolygons(geom){
    const out = [];
    if (geom.type === 'Polygon'){
      out.push([ stitchRing(geom.arcs[0]) ]);
    } else if (geom.type === 'MultiPolygon'){
      for (const poly of geom.arcs){
        out.push([ stitchRing(poly[0]) ]);
      }
    }
    return out;
  }

  /* the file's interesting collection is the only entry in objects */
  const collectionName = Object.keys(objects)[0];
  const coll = objects[collectionName];
  const geoms = coll?.geometries ?? [];
  const features = geoms.map(g => ({
    name: g.properties?.name ?? '',
    id:   g.id ?? '',
    polygons: geomPolygons(g),
  }));

  return { features };
}

/**
 * Compute a rough centroid of a ring (mean of vertices). Good enough
 * for label placement — does not handle multipart / multiring tricks.
 * @param {[number,number][]} ring
 * @returns {[number,number]}
 */
export function ringCentroid(ring){
  let sx = 0, sy = 0;
  for (const [x, y] of ring){ sx += x; sy += y; }
  return [sx / ring.length, sy / ring.length];
}

/**
 * Pick the largest polygon of a feature (by ring length) for centroid
 * placement — avoids labels appearing on tiny outlying islands.
 * @param {CountryFeature} feature
 */
export function largestPolygonCentroid(feature){
  let best = null, bestLen = -1;
  for (const poly of feature.polygons){
    const ring = poly[0];
    if (!ring) continue;
    if (ring.length > bestLen){ bestLen = ring.length; best = ring; }
  }
  if (!best) return [0, 0];
  return ringCentroid(best);
}
