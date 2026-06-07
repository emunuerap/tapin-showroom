import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '../motion/useReducedMotion';

/**
 * Reveal — a scroll-LINKED reveal (not a toggle). Opacity + lift are tied
 * continuously to the element's position, so it eases in as it enters and eases
 * back out as it leaves — perfectly smooth in both directions (the CodeGrid
 * "scrub" feel). Stacked Reveals naturally sequence because each sits at a
 * different scroll position. Honours reduced motion (renders static).
 */
type Props = {
  children: ReactNode;
  className?: string;
  /** lift distance in px */
  y?: number;
  /** how wide the fade ramp is at each edge (0–0.5 of the pass) */
  ramp?: number;
};

export function Reveal({ children, className, y = 38, ramp = 0.16 }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // full opacity through the middle; gentle fade only near the very edges
  const opacity = useTransform(scrollYProgress, [0, ramp, 1 - ramp, 1], [0, 1, 1, 0]);
  const ty = useTransform(scrollYProgress, [0, ramp, 1 - ramp, 1], [y, 0, 0, -y * 0.5]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ opacity, y: ty }}>
      {children}
    </motion.div>
  );
}
