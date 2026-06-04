import type { Variants } from 'framer-motion';
import { ease, duration } from '../../design/light-tokens';

/**
 * Shared framer-motion variants for the redesign. Kept here so every section
 * breathes with the same rhythm and easing — the motion equivalent of a
 * type scale. Wrap a parent in `staggerParent` and children in `fadeUp`
 * (or `lineReveal` for headline lines) for an orchestrated entrance.
 */

export const staggerParent: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.reveal },
  },
};

/** Editorial line reveal — content slides up from behind a clip mask. */
export const lineReveal: Variants = {
  hidden: { opacity: 0, y: '110%' },
  show: {
    opacity: 1,
    y: '0%',
    transition: { duration: duration.slow, ease: ease.liquid },
  },
};

/** Soft scale-in for cards / panels. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: duration.base, ease: ease.liquid },
  },
};

/** Default viewport config for whileInView reveals. */
export const inView = { once: true, amount: 0.35 } as const;
