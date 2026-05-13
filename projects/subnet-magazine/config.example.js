/* =================================================================
   SUBNET MAGAZINE — CONFIG (example)
   -----------------------------------------------------------------
   Copy this file to `config.js` (gitignored) and fill in your keys.
   The data layer reads from `window.__SUBNET_CONFIG__`. Anything
   missing falls back to public endpoints or the simulator.

   You do NOT need any of these to see live TAO price or live AI
   headlines — those use public, keyless APIs (CoinGecko and HN
   Algolia). Keys unlock the Bittensor on-chain endpoints.
   ================================================================= */

window.__SUBNET_CONFIG__ = {
  // taostats.io — sign up for a free key at https://dash.taostats.io
  // and paste it here. Without it, block height and subnet rows
  // come from the simulator.
  taostatsKey: '',                                  // e.g. 'tao-key-XXXXXXXX'
  taostatsBase: 'https://api.taostats.io/api',      // override if needed

  // Future: alpha-vantage or polygon.io for equities (NVDA, MSFT etc.)
  // alphaVantageKey: '',
};
