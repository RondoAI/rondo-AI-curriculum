/* =================================================================
   SUBNET MAGAZINE — CENTRALIZED-AI TICKER TAPE
   -----------------------------------------------------------------
   The compact roster the Central Desk ticker reads off. Mix of
   public stocks (price + day-change) and private AI labs (last-
   round valuation + recent move). Used by Tickers.js to render
   the second tape across the top of every page.

   `val`     : numeric value used to drive the mini sparkline trend
   `valFmt`  : display string in the chip (price or valuation)
   `chg`     : 24h / Q-to-Q % change, used for the colored Δ badge
   `domain`  : passed to Clearbit's free logo API; the chip falls
               back to a generative monogram if the image 404s.
   `tag`     : optional badge — 'PVT' for private, 'CN' / 'KR' /
               'JP' / 'TW' for non-US public listings
   `href`    : optional company link
   ================================================================= */

/**
 * @typedef {Object} TickerRow
 * @prop {string}  sym
 * @prop {string}  name
 * @prop {number}  val
 * @prop {string}  valFmt
 * @prop {number}  chg
 * @prop {string}  domain
 * @prop {string=} tag
 * @prop {string=} href
 */

/** @type {readonly TickerRow[]} */
export const CENTRALIZED_TICKERS = Object.freeze([

  /* ========== Public · semiconductors ========== */
  { sym:'NVDA', name:'NVIDIA',    val:905.20,  valFmt:'$905.20', chg: +1.2, domain:'nvidia.com',       href:'https://nvidia.com' },
  { sym:'AMD',  name:'AMD',       val:173.80,  valFmt:'$173.80', chg: +3.8, domain:'amd.com',          href:'https://amd.com' },
  { sym:'TSM',  name:'TSMC',      val:198.40,  valFmt:'$198.40', chg: +1.4, domain:'tsmc.com',         href:'https://tsmc.com', tag:'TW' },
  { sym:'ARM',  name:'Arm',       val:142.10,  valFmt:'$142.10', chg: -1.1, domain:'arm.com',          href:'https://arm.com',  tag:'UK' },
  { sym:'MU',   name:'Micron',    val:142.85,  valFmt:'$142.85', chg: +0.9, domain:'micron.com',       href:'https://micron.com' },
  { sym:'AVGO', name:'Broadcom',  val:1825.40, valFmt:'$1,825',  chg: +0.6, domain:'broadcom.com',     href:'https://broadcom.com' },
  { sym:'INTC', name:'Intel',     val:32.05,   valFmt:'$32.05',  chg: -2.1, domain:'intel.com',        href:'https://intel.com' },

  /* ========== Public · hyperscalers ========== */
  { sym:'MSFT', name:'Microsoft', val:432.15,  valFmt:'$432.15', chg: -0.4, domain:'microsoft.com',    href:'https://microsoft.com' },
  { sym:'GOOGL',name:'Alphabet',  val:178.40,  valFmt:'$178.40', chg: +0.6, domain:'google.com',       href:'https://google.com' },
  { sym:'META', name:'Meta',      val:612.30,  valFmt:'$612.30', chg: +2.1, domain:'meta.com',         href:'https://meta.com' },
  { sym:'AMZN', name:'Amazon',    val:218.55,  valFmt:'$218.55', chg: +0.3, domain:'amazon.com',       href:'https://amazon.com' },
  { sym:'AAPL', name:'Apple',     val:226.40,  valFmt:'$226.40', chg: +0.1, domain:'apple.com',        href:'https://apple.com' },

  /* ========== Public · data + frontier-AI surface ========== */
  { sym:'PLTR', name:'Palantir',  val:89.45,   valFmt:'$89.45',  chg: +4.2, domain:'palantir.com',     href:'https://palantir.com' },
  { sym:'SNOW', name:'Snowflake', val:185.60,  valFmt:'$185.60', chg: +0.8, domain:'snowflake.com',    href:'https://snowflake.com' },
  { sym:'MDB',  name:'MongoDB',   val:298.10,  valFmt:'$298.10', chg: -0.7, domain:'mongodb.com',      href:'https://mongodb.com' },
  { sym:'TSLA', name:'Tesla',     val:352.70,  valFmt:'$352.70', chg: +1.8, domain:'tesla.com',        href:'https://tesla.com' },

  /* ========== Public · Asia frontier ========== */
  { sym:'BABA', name:'Alibaba',   val:138.20,  valFmt:'$138.20', chg: +2.4, domain:'alibaba.com',      href:'https://alibaba.com', tag:'CN' },
  { sym:'BIDU', name:'Baidu',     val:118.60,  valFmt:'$118.60', chg: +1.6, domain:'baidu.com',        href:'https://baidu.com',   tag:'CN' },
  { sym:'9988', name:'Huawei',    val:0,       valFmt:'PVT',     chg: 0,    domain:'huawei.com',       href:'https://huawei.com',  tag:'CN' },

  /* ========== Private · frontier labs (last-round valuation) ========== */
  { sym:'OpenAI',    name:'OpenAI',    val:852000, valFmt:'$852B', chg:+12.4, domain:'openai.com',     href:'https://openai.com',     tag:'PVT' },
  { sym:'Anthropic', name:'Anthropic', val:900000, valFmt:'~$900B', chg:+18.6, domain:'anthropic.com', href:'https://anthropic.com',  tag:'PVT' },
  { sym:'xAI',       name:'xAI',       val:80000,  valFmt:'$80B',   chg:+8.2,  domain:'x.ai',          href:'https://x.ai',           tag:'PVT' },
  { sym:'DeepSeek',  name:'DeepSeek',  val:6000,   valFmt:'$6B',    chg:+22.4, domain:'deepseek.com',  href:'https://deepseek.com',   tag:'CN PVT' },
  { sym:'Mistral',   name:'Mistral',   val:14000,  valFmt:'$14B',   chg:+3.8,  domain:'mistral.ai',    href:'https://mistral.ai',     tag:'FR PVT' },
  { sym:'Cursor',    name:'Cursor',    val:13000,  valFmt:'$13B',   chg:+45.2, domain:'cursor.com',    href:'https://cursor.com',     tag:'PVT' },
  { sym:'Perplexity',name:'Perplexity',val:18000,  valFmt:'$18B',   chg:+10.4, domain:'perplexity.ai', href:'https://perplexity.ai',  tag:'PVT' },

  /* ========== Crypto-native AI exchanges (where TAO trades) ========== */
  { sym:'COIN', name:'Coinbase',  val:284.60,  valFmt:'$284.60', chg: +1.2, domain:'coinbase.com',  href:'https://coinbase.com' },
  { sym:'BNB',  name:'Binance',   val:712.40,  valFmt:'$712.40', chg: +0.8, domain:'binance.com',   href:'https://binance.com',  tag:'CEX' },
  { sym:'KRKN', name:'Kraken',    val:0,       valFmt:'PVT',     chg: 0,    domain:'kraken.com',    href:'https://kraken.com',   tag:'PVT CEX' },
  { sym:'MEXC', name:'MEXC',      val:0,       valFmt:'PVT',     chg: 0,    domain:'mexc.com',      href:'https://mexc.com',     tag:'PVT CEX' },
]);
