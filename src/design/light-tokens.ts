/**
 * TapIn — "Liquid Light" design tokens.
 *
 * Light-immersive showroom direction. A tight, lively palette: warm paper,
 * ink black, and a FRESH green identity (not muted). One electric spark (yuzu)
 * reserved for moments of action / intelligence.
 *
 * The same values are mirrored into tailwind.config.js (primary / accent /
 * leaf / paper / ink…) so they can be used as utilities, and into
 * src/redesign/redesign.css as CSS variables under `.tapin-light`.
 *
 * Type: Clash Display (display) + General Sans (UI) — loaded in index.html.
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
  // Green identity — fresh, not muted
  leaf: '#1FA85D', // vivid primary green — accents, links, highlights
  leafDeep: '#15633C', // deeper green for small text on light
  pine: '#16412B', // deep green — table fills / strong surfaces
  sage: '#AFC6A6', // soft light-green wash
  // Spark
  yuzu: '#CCFF00', // electric green — intelligence / action only
} as const;

export const fonts = {
  display: '"Clash Display", "Hanken Grotesk", system-ui, sans-serif',
  sans: '"General Sans", system-ui, -apple-system, "Segoe UI", sans-serif',
} as const;

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
  glowLeaf: '0 0 0 1px rgba(31,168,93,0.5), 0 10px 30px -10px rgba(31,168,93,0.4)',
} as const;

export const z = {
  base: 0,
  content: 10,
  nav: 50,
  overlay: 80,
} as const;
