import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ease, duration as dur } from '../../design/light-tokens';
import { useReducedMotion } from '../motion/useReducedMotion';

type Props = {
  d: string;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
  /** seconds */
  drawDuration?: number;
  delay?: number;
  opacity?: number;
};

/**
 * AnimatedPath — a line that draws itself.
 *
 * Variant-driven: render inside a <motion.svg initial="hidden"
 * whileInView="show"> and the parent orchestrates the draw via stroke
 * length (framer normalises pathLength 0→1). The line is the core of the
 * redesign's motion language: intention, a path to a table, data entering
 * the OS — never a technical diagram.
 *
 * Honours reduced motion by rendering the final, fully-drawn line.
 */
export function AnimatedPath({
  d,
  stroke = 'currentColor',
  strokeWidth = 1.5,
  className,
  drawDuration = dur.scene,
  delay = 0,
  opacity = 1,
}: Props) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <path
        d={d}
        className={className}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
      />
    );
  }

  const variants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    show: {
      pathLength: 1,
      opacity,
      transition: {
        pathLength: { duration: drawDuration, delay, ease: ease.liquid },
        opacity: { duration: 0.3, delay },
      },
    },
  };

  return (
    <motion.path
      d={d}
      className={className}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={variants}
    />
  );
}
