/**
 * TapIn — "Liquid Light" design tokens.
 *
 * Single source of truth for the light-immersive showroom direction
 * (redesign/light-immersive-showroom-v1). This is intentionally a *new*
 * language, not a recolour of the dark obsidian site — see src/redesign/.
 *
 * Rules of the language:
 *  - The canvas is warm paper / porcelain, never black.
 *  - Ink is the workhorse for type and line.
 *  - Yuzu is NOT ambient. It only appears at a moment of intelligence or
 *    action (a confirm, a swipe fill, an AI signal). Treat it like a spark.
 *  - Amber is human warmth — used for hospitality highlights, sparingly.
 *  - Sage is the quiet natural-hospitality tone for secondary structure.
 *
 * Visual CSS variables mirroring these values live in
 * src/redesign/redesign.css under the `.tapin-light` scope.
 */

export type Cubic = [number, number, number, number];

export const colors = {
  // Base — warm paper canvas
  warmWhite: '#F7F4EE',
  porcelain: '#EFEAE1',
  mist: '#D9D4CA',
  // Ink
  ink: '#111111',
  charcoal: '#2A2A2A',
  // Quiet text
  slate: '#6B675F',
  // Accents — used with discipline
  yuzu: '#CCFF00', // intelligence / action / confirm — never ambient
  amber: '#FFB800', // human warmth / hospitality highlight
  sage: '#A6B09A', // natural hospitality tone
} as const;

export const fonts = {
  display: '"Fraunces", "Times New Roman", Georgia, serif',
  sans: '"Hanken Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif',
} as const;

/** Organic, "liquid" easing curves. Tuples are framer-motion `ease` ready. */
export const ease = {
  /** ease-out-expo — entrances that settle like a heavy, well-balanced door */
  liquid: [0.22, 1, 0.36, 1] as Cubic,
  /** softer entrance for type reveals */
  reveal: [0.16, 1, 0.3, 1] as Cubic,
  /** symmetric in/out for looping demos */
  inOut: [0.65, 0, 0.35, 1] as Cubic,
} as const;

export const duration = {
  fast: 0.4,
  base: 0.7,
  slow: 1.1,
  scene: 1.8,
} as const;

export const radius = {
  sm: '0.625rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  pill: '999px',
} as const;

/** Fine, premium shadows tuned for a warm (non-white) background. */
export const shadow = {
  hairline: '0 1px 0 rgba(17,17,17,0.06)',
  soft: '0 10px 30px -18px rgba(17,17,17,0.25)',
  lifted: '0 30px 60px -30px rgba(17,17,17,0.30)',
  glowYuzu: '0 0 0 1px rgba(204,255,0,0.6), 0 8px 24px -8px rgba(204,255,0,0.45)',
} as const;

export const z = {
  base: 0,
  content: 10,
  nav: 50,
  overlay: 80,
} as const;
