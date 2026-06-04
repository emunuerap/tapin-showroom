/**
 * TapIn — "Liquid Light" design tokens.
 *
 * Light-immersive showroom direction (redesign/light-immersive-showroom-v1).
 * A new language built from scratch — not a recolour of the dark obsidian site.
 *
 * The palette is intentionally tight: warm paper, ink black, and a GREEN
 * identity. Two greens do the work —
 *   - basil  : a deep herb green, used with confidence (accents, lines,
 *              highlighted words, the blueprint floor). This is the brand green.
 *   - sage   : a soft, calm green for fills and quiet surfaces.
 * Plus one sharp spark —
 *   - yuzu   : the electric green, reserved for a moment of intelligence or
 *              action (a confirm, a swipe fill, a live AI signal). Never ambient.
 *
 * No other hues. (No amber, no neon ambience.)
 */

export type Cubic = [number, number, number, number];

export const colors = {
  // Base — warm paper canvas
  warmWhite: '#F7F4EE',
  porcelain: '#EFEAE1',
  mist: '#D9D4CA',
  // Ink
  ink: '#121212',
  charcoal: '#2A2A2A',
  slate: '#6B675F',
  // Green identity
  basil: '#2E4636', // deep herb green — the brand green, used confidently
  moss: '#5E7355', // mid green — borders, secondary structure
  sage: '#A6B09A', // soft sage — fills, calm surfaces
  // Spark
  yuzu: '#CCFF00', // electric green — intelligence / action only, never ambient
} as const;

export const fonts = {
  display: '"Fraunces", "Times New Roman", Georgia, serif',
  sans: '"Hanken Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: '"Hanken Grotesk", ui-monospace, "SFMono-Regular", monospace',
} as const;

/** Organic, "liquid" easing curves. Tuples are framer-motion `ease` ready. */
export const ease = {
  liquid: [0.22, 1, 0.36, 1] as Cubic,
  reveal: [0.16, 1, 0.3, 1] as Cubic,
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

export const shadow = {
  hairline: '0 1px 0 rgba(18,18,18,0.06)',
  soft: '0 10px 30px -18px rgba(18,18,18,0.25)',
  lifted: '0 30px 60px -30px rgba(18,18,18,0.30)',
  glowYuzu: '0 0 0 1px rgba(204,255,0,0.6), 0 8px 24px -8px rgba(204,255,0,0.45)',
} as const;

export const z = {
  base: 0,
  content: 10,
  nav: 50,
  overlay: 80,
} as const;
