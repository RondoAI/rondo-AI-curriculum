/* =================================================================
   SUBNET MAGAZINE, CATEGORY COLOR SYSTEM
   -----------------------------------------------------------------
   Every subnet on Bittensor belongs to a category, text/LLM,
   vision, training, etc. The palette below is intentional: the
   whole brand sits inside a red/black wave, so each category is a
   distinct point on the red spectrum (warm-red → magenta-red → wine
   → rose). Side-by-side they stay readable; together they keep the
   monochrome mood the brand asked for.

   Categories also carry a `weight` used for chart ordering, and a
   `desc` shown in tooltips and legends.
   ================================================================= */

/**
 * @typedef {Object} Category
 * @prop {string} key
 * @prop {string} label
 * @prop {string} color    Hex color for chrome (lines, badges)
 * @prop {string} glow     RGBA for soft glows and fills
 * @prop {string} desc     One-line definition
 * @prop {number} weight   Display ordering, lower first
 */

/** @type {Record<string, Category>} */
export const CATEGORIES = Object.freeze({
  text:       { key:'text',       label:'Text · LLM',         color:'#FF1E3C', glow:'rgba(255,30,60,.35)',   desc:'Natural-language inference, prompting, dialogue, summarization.', weight: 10 },
  vision:     { key:'vision',     label:'Vision · Image',     color:'#FF6B7A', glow:'rgba(255,107,122,.35)', desc:'Classification, embedding, generation of images and 3D.',         weight: 20 },
  audio:      { key:'audio',      label:'Audio · Speech',     color:'#FFB0BA', glow:'rgba(255,176,186,.32)', desc:'Speech recognition, TTS, voice cloning, music.',                   weight: 30 },
  video:      { key:'video',      label:'Video',              color:'#D62246', glow:'rgba(214,34,70,.35)',   desc:'Text-to-video, video understanding, temporal modeling.',           weight: 40 },
  multimodal: { key:'multimodal', label:'Multimodal',         color:'#F45B69', glow:'rgba(244,91,105,.35)',  desc:'Any-to-any generation across text / vision / audio / video.',      weight: 50 },
  training:   { key:'training',   label:'Training',           color:'#B82850', glow:'rgba(184,40,80,.35)',   desc:'Distributed pretraining, finetuning, optimizer competitions.',     weight: 60 },
  data:       { key:'data',       label:'Data',               color:'#FF8C8C', glow:'rgba(255,140,140,.30)', desc:'Dataset construction, curation, labeling, provenance.',            weight: 70 },
  search:     { key:'search',     label:'Search · Retrieval', color:'#E8475F', glow:'rgba(232,71,95,.35)',   desc:'Web search, retrieval, ranking, personalized feed.',               weight: 80 },
  finance:    { key:'finance',    label:'Finance',            color:'#FF6A2B', glow:'rgba(255,106,43,.35)',  desc:'Trading, yield strategy, defi, market microstructure.',            weight: 90 },
  agents:     { key:'agents',     label:'Agents',             color:'#FF8541', glow:'rgba(255,133,65,.35)',  desc:'Tool-using and browser-using AI agents, planning, routing.',       weight:100 },
  robotics:   { key:'robotics',   label:'Robotics',           color:'#FF4D2D', glow:'rgba(255,77,45,.35)',   desc:'Sim-to-real policy training, embodied agents.',                    weight:110 },
  science:    { key:'science',    label:'Science',            color:'#C84368', glow:'rgba(200,67,104,.35)',  desc:'Biology, chemistry, physics, materials, climate, optimization.',   weight:120 },
  infra:      { key:'infra',      label:'Infrastructure',     color:'#8B6B70', glow:'rgba(139,107,112,.30)', desc:'Compute, validation, serverless, edge, the substrate.',            weight:130 },
  prediction: { key:'prediction', label:'Prediction',         color:'#FF8C42', glow:'rgba(255,140,66,.35)',  desc:'Forecasting markets, real-world outcome prediction.',              weight:140 },
});

/** Fallback for unknown categories. */
const UNKNOWN = Object.freeze({
  key:'unknown', label:'Unknown', color:'#8B6B70', glow:'rgba(139,107,112,.25)',
  desc:'Uncategorized subnet.', weight: 999,
});

/**
 * Resolve a category by key, with a stable fallback so callers never
 * have to handle a missing entry.
 * @param {string|null|undefined} key
 * @returns {Category}
 */
export function cat(key){
  if (!key) return UNKNOWN;
  return CATEGORIES[key] || UNKNOWN;
}

/** Convenience accessors. @param {string} key */
export const catColor = key => cat(key).color;
/** @param {string} key */
export const catGlow  = key => cat(key).glow;
/** @param {string} key */
export const catLabel = key => cat(key).label;
