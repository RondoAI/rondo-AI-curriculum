/* =================================================================
   SUBNEτ TERMINAL — ticker seed
   Realistic recent values for the top-chrome tape. Replaced by live
   feeds in later phases; never ships empty.
   ================================================================= */

export interface TickerItem {
  sym: string;
  /** numeric value for display */
  price: number;
  /** 24h % change */
  chg: number;
  /** how to render the price */
  unit: "usd" | "tao" | "mwh" | "raw";
  vertical: "bittensor" | "ai" | "gpu" | "power" | "macro";
}

export const TICKER_SEED: TickerItem[] = [
  { sym: "TAO", price: 300.94, chg: 0.58, unit: "usd", vertical: "bittensor" },
  { sym: "SN64·CHUTES", price: 0.0421, chg: 6.4, unit: "raw", vertical: "bittensor" },
  { sym: "SN4·TARGON", price: 0.0388, chg: -2.1, unit: "raw", vertical: "bittensor" },
  { sym: "SN1·APEX", price: 0.0512, chg: 3.7, unit: "raw", vertical: "bittensor" },
  { sym: "SN51·CELIUM", price: 0.0297, chg: 1.2, unit: "raw", vertical: "bittensor" },
  { sym: "SN9·PRETRAIN", price: 0.0644, chg: -0.9, unit: "raw", vertical: "bittensor" },
  { sym: "SN8·PTN", price: 0.0233, chg: 4.8, unit: "raw", vertical: "bittensor" },
  { sym: "SN56·GRADIENTS", price: 0.0181, chg: 9.1, unit: "raw", vertical: "bittensor" },
  { sym: "SN5·OPENKAITO", price: 0.0274, chg: -1.6, unit: "raw", vertical: "bittensor" },
  { sym: "SN68·METANOVA", price: 0.0156, chg: 2.4, unit: "raw", vertical: "bittensor" },
  { sym: "BTC", price: 79792.83, chg: -1.78, unit: "usd", vertical: "macro" },
  { sym: "ETH", price: 2266.05, chg: -1.51, unit: "usd", vertical: "macro" },
  { sym: "NVDA", price: 184.57, chg: 2.31, unit: "usd", vertical: "gpu" },
  { sym: "TSM", price: 281.40, chg: 0.63, unit: "usd", vertical: "gpu" },
  { sym: "ERCOT·HB", price: 41.18, chg: 12.4, unit: "mwh", vertical: "power" },
  { sym: "HENRY HUB", price: 3.74, chg: -0.8, unit: "usd", vertical: "power" },
];
