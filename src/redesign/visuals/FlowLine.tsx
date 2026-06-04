import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import { AnimatedPath } from './AnimatedPath';
import { inView } from '../motion/variants';
import { useReducedMotion } from '../motion/useReducedMotion';

type Props = {
  d: string;
  viewBox: string;
  className?: string;
  stroke?: string;
  strokeWidth?: number;
  drawDuration?: number;
  delay?: number;
  /** a small pulse that travels the line after it draws — "intention" */
  travel?: boolean;
  travelColor?: string;
  travelDur?: number;
  travelRadius?: number;
  preserveAspectRatio?: string;
  style?: CSSProperties;
};

/**
 * FlowLine — a self-contained drawing line with an optional travelling pulse.
 * Used to connect the beats of the gesture, trace the path to a table, or
 * suggest data flowing into the OS. Draw-on-scroll via AnimatedPath; the
 * travelling dot uses cheap SMIL animateMotion (skipped for reduced motion).
 */
export function FlowLine({
  d,
  viewBox,
  className,
  stroke = 'rgba(17,17,17,0.5)',
  strokeWidth = 1.5,
  drawDuration,
  delay = 0,
  travel = false,
  travelColor = '#CCFF00',
  travelDur = 3.4,
  travelRadius = 4,
  preserveAspectRatio = 'none',
  style,
}: Props) {
  const reduced = useReducedMotion();
  return (
    <motion.svg
      className={className}
      viewBox={viewBox}
      fill="none"
      preserveAspectRatio={preserveAspectRatio}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      style={style}
      aria-hidden="true"
    >
      <AnimatedPath
        d={d}
        stroke={stroke}
        strokeWidth={strokeWidth}
        drawDuration={drawDuration}
        delay={delay}
      />
      {travel && !reduced ? (
        <circle r={travelRadius} fill={travelColor}>
          <animateMotion
            dur={`${travelDur}s`}
            repeatCount="indefinite"
            path={d}
            begin={`${delay + 0.6}s`}
          />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            keyTimes="0;0.12;0.85;1"
            dur={`${travelDur}s`}
            repeatCount="indefinite"
            begin={`${delay + 0.6}s`}
          />
        </circle>
      ) : null}
    </motion.svg>
  );
}
