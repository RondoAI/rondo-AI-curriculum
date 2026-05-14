/* =================================================================
   SUBNET MAGAZINE — LOCAL CONFIG (template)
   -----------------------------------------------------------------
   Copy this file to `config.js` and fill in your keys. `config.js`
   is gitignored — it never gets committed, so secrets stay local.

   Every HTML page loads `config.js` BEFORE `src/boot.js`, so
   whatever you set on `window.__SUBNET_CONFIG__` is available to
   the data layer at startup.

   WITHOUT a config.js the site still works — it falls back to the
   keyless Tao Market Cap public API. A taostats key just unlocks
   the deeper feeds (live validators, richer market data) and
   removes the CORS-proxy hop.

   SECURITY NOTE: this is a static client-side site. Any key in
   config.js is visible to anyone who opens the deployed page's
   dev tools. Only deploy config.js to hosts you control, and
   treat the key as rotatable.
   ================================================================= */

window.__SUBNET_CONFIG__ = {
  /* taostats.io API key — https://taostats.io → API.
     Format: "tao-XXatXXX...:NNNNNNNN". Leave null to use the
     keyless TMC public API instead. */
  taostatsKey: null,

  /* Optional override for the CORS proxy used to reach the TMC
     public API (TMC sends no CORS headers). Default is codetabs. */
  corsProxy: null,
};
