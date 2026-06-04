import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/**
 * Definite-boolean wrapper around framer-motion's useReducedMotion.
 * framer returns `boolean | null` (null before hydration); we collapse
 * that to a stable boolean so component logic (auto-demo loops, travelling
 * dots, etc.) can branch without null checks.
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}
