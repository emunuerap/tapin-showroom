import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { maskReveal } from '../motion/variants';
import { useReducedMotion } from '../motion/useReducedMotion';

/**
 * EditorialImage — curated photography, treated to the brand.
 * A clip-path mask reveal on enter, a subtle scroll parallax (scale), and a
 * pine/sand duotone-ish overlay + warm wash + grain so any free-licence photo
 * reads cohesively with Warm Sand × Pine instead of looking like stock.
 */
type Props = {
  src: string;
  alt: string;
  className?: string;
  tint?: 'soft' | 'strong';
};

export function EditorialImage({ src, alt, className, tint = 'soft' }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.12, 1]);

  return (
    <motion.figure
      ref={ref}
      className={`rd-figure ${className ?? ''}`}
      data-tint={tint}
      variants={maskReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.img className="rd-figure__img" src={src} alt={alt} loading="lazy" style={{ scale }} />
      <span className="rd-figure__tint" aria-hidden="true" />
    </motion.figure>
  );
}
