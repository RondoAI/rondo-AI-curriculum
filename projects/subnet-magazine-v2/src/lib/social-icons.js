/* =================================================================
   SUBNET MAGAZINE, SOCIAL / EXTERNAL-LINK ICONS
   -----------------------------------------------------------------
   Inline-SVG brand marks for the common surfaces we link out to
   from subnet cards: website, GitHub, X, Discord, docs, Hugging
   Face. All single-path-ish, currentColor-driven, no external
   dependencies, no requests. Source: simplified renders of the
   brand glyphs as they appear in simple-icons / brand assets.

   Usage:
     socialIcon('github', 14)
     socialIcon('x',      14)
   ================================================================= */

/**
 * @typedef {'website'|'github'|'x'|'discord'|'docs'|'huggingface'} IconKind
 */

const ICONS = {
  /* a clean globe, three lines for latitude, two for longitude */
  website: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round">
    <circle cx="8" cy="8" r="6.6"/>
    <ellipse cx="8" cy="8" rx="3" ry="6.6"/>
    <line x1="1.4" y1="8" x2="14.6" y2="8"/>
    <line x1="1.8" y1="5"  x2="14.2" y2="5"/>
    <line x1="1.8" y1="11" x2="14.2" y2="11"/>
  </svg>`,

  /* official GitHub mark, simplified single path */
  github: `<svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.69-.01-1.36-2.22.48-2.69-1.07-2.69-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.5 7.5 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
  </svg>`,

  /* X / Twitter brand mark, two diagonal strokes */
  x: `<svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M12.21 1H14.5l-5 5.72L15.4 15H10.7L7.07 9.96 2.96 15H.66l5.36-6.12L0 1h4.86l3.3 4.62L12.21 1zm-.81 12.65h1.27L4.66 2.27H3.3l8.1 11.38z"/>
  </svg>`,

  /* Discord brand glyph */
  discord: `<svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M13.55 2.27a13.04 13.04 0 0 0-3.26-1.01c-.14.25-.31.59-.42.86a12 12 0 0 0-3.74 0c-.11-.27-.28-.61-.42-.86A13 13 0 0 0 2.45 2.27 13.66 13.66 0 0 0 .25 11.6a13.14 13.14 0 0 0 3.98 2.02c.33-.44.62-.91.86-1.4-.47-.18-.93-.4-1.36-.66.11-.08.23-.17.34-.26a9.3 9.3 0 0 0 7.86 0c.11.09.22.18.34.26-.43.26-.89.48-1.36.66.24.49.53.96.86 1.4a13.14 13.14 0 0 0 3.98-2.02 13.49 13.49 0 0 0-2.2-9.33zM5.34 9.94c-.78 0-1.43-.72-1.43-1.6s.63-1.6 1.43-1.6c.81 0 1.45.73 1.43 1.6 0 .88-.63 1.6-1.43 1.6zm5.32 0c-.78 0-1.43-.72-1.43-1.6s.63-1.6 1.43-1.6c.81 0 1.45.73 1.43 1.6 0 .88-.62 1.6-1.43 1.6z"/>
  </svg>`,

  /* docs, a clean book glyph */
  docs: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round">
    <path d="M2.5 13V3a1.5 1.5 0 0 1 1.5-1.5h9V14H4a1.5 1.5 0 0 0-1.5-1z"/>
    <line x1="4.6" y1="4.4" x2="11" y2="4.4"/>
    <line x1="4.6" y1="6.8" x2="11" y2="6.8"/>
    <line x1="4.6" y1="9.2" x2="9"  y2="9.2"/>
  </svg>`,

  /* Hugging Face, simplified smiley with the hand-on-cheeks gesture */
  huggingface: `<svg viewBox="0 0 16 16" fill="currentColor">
    <circle cx="8" cy="8" r="5.4" fill="currentColor"/>
    <circle cx="6.1" cy="7.6" r=".9" fill="#050203"/>
    <circle cx="9.9" cy="7.6" r=".9" fill="#050203"/>
    <path d="M5.4 10.5q2.6 1.4 5.2 0" stroke="#050203" stroke-width=".8" fill="none" stroke-linecap="round"/>
    <rect x="1.4" y="9.6" width="2.6" height="2" rx="1" fill="currentColor"/>
    <rect x="12"  y="9.6" width="2.6" height="2" rx="1" fill="currentColor"/>
  </svg>`,
};

/**
 * Return an inline-SVG string for a known social/external-link kind.
 * Falls back to an empty string for unknown kinds so callers can
 * just feature-detect with truthiness.
 * @param {IconKind} kind
 * @param {number} [size]
 * @returns {string}
 */
export function socialIcon(kind, size = 14){
  const svg = ICONS[kind];
  if (!svg) return '';
  /* swap the default viewBox-only sizing for an explicit width/height
     so the icon never inflates the parent flex item */
  return svg.replace('<svg ', `<svg width="${size}" height="${size}" aria-hidden="true" `);
}

/**
 * Best-effort: infer a sensible icon kind from a known URL pattern.
 * Used so callers can throw any external URL at us and get the right
 * icon without writing a switch each time.
 * @param {string} url
 * @returns {IconKind | null}
 */
export function inferIconKind(url){
  if (!url || typeof url !== 'string') return null;
  const u = url.toLowerCase();
  if (u.includes('github.com'))       return 'github';
  if (u.includes('twitter.com') ||
      u.includes('x.com'))             return 'x';
  if (u.includes('discord.gg') ||
      u.includes('discord.com'))       return 'discord';
  if (u.includes('huggingface.co'))    return 'huggingface';
  if (u.includes('docs.') ||
      u.includes('/docs') ||
      u.includes('readthedocs'))       return 'docs';
  return 'website';
}
