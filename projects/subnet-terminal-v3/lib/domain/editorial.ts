/* =================================================================
   SUBNEτ TERMINAL — Editorial domain types
   The magazine DNA. The terminal shows what is happening; editorial
   argues what it means. Each piece is tagged to the vertical it
   reasons about, so the desk's research and its data share a spine.
   ================================================================= */

import type { Vertical } from "@/lib/panels";

/** A body block — the reader renders these in order. Kept structured
    rather than markdown so there's no parser in the bundle. */
export type Block =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "quote"; text: string; cite?: string }
  | { kind: "list"; items: string[] };

export interface Article {
  slug: string;
  title: string;
  /** standfirst — the one-sentence argument */
  deck: string;
  author: string;
  /** ISO date string */
  date: string;
  /** which vertical the piece reasons about — drives its accent */
  vertical: Vertical;
  /** estimated reading time, minutes */
  readMins: number;
  body: Block[];
}
