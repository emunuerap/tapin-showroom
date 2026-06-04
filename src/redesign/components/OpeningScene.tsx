import { motion, useScroll, useTransform } from 'framer-motion';
import { AnimatedPath } from '../visuals/AnimatedPath';
import { fadeUp, lineReveal, staggerParent } from '../motion/variants';
import { useReducedMotion } from '../motion/useReducedMotion';
import { scrollToId } from '../motion/scrollTo';
import { ease } from '../../design/light-tokens';

/** A single expressive gesture stroke that resolves into a clean intention. */
const GESTURE =
  'M 110 590 C 300 680, 360 450, 560 500 C 740 545, 770 690, 930 545 C 1015 470, 1030 320, 1080 230';
const DOT = { cx: 1080, cy: 230 };

export function OpeningScene() {
  const reduced = useReducedMotion();
  // Parallax keyed to global scroll (the hero begins at scroll 0). Avoids a
  // target-based useScroll, which warns under StrictMode about the scroll
  // container's position.
  const { scrollY } = useScroll();
  const lineY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : 130]);
  const contentY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : 60]);

  return (
    <section id="top" className="rd-section rd-hero">
      {/* the gesture: draws across, lands on a yuzu intention point */}
      <motion.svg
        className="rd-hero__line"
        viewBox="0 0 1200 760"
        fill="none"
        preserveAspectRatio="none"
        initial="hidden"
        animate="show"
        style={{ y: lineY }}
        aria-hidden="true"
      >
        <AnimatedPath d={GESTURE} stroke="currentColor" strokeWidth={2} delay={0.5} />
        {/* leading "tap" point — the one yuzu moment in the hero */}
        <motion.circle
          cx={DOT.cx}
          cy={DOT.cy}
          r={26}
          fill="#CCFF00"
          opacity={0.16}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 0.16, transition: { delay: 2.1, duration: 0.6 } } }}
        />
        <motion.circle
          cx={DOT.cx}
          cy={DOT.cy}
          r={9}
          fill="#CCFF00"
          variants={{
            hidden: { opacity: 0, scale: 0 },
            show: { opacity: 1, scale: 1, transition: { delay: 2.05, duration: 0.5, ease: ease.liquid } },
          }}
          style={{ transformOrigin: `${DOT.cx}px ${DOT.cy}px` }}
        />
      </motion.svg>

      <motion.div
        className="rd-container rd-hero__grid"
        style={{ y: contentY }}
        variants={staggerParent}
        initial="hidden"
        animate="show"
      >
        <motion.div className="rd-hero__eyebrow" variants={fadeUp}>
          <span className="rd-eyebrow">Hospitality Operating System</span>
          <span style={{ width: 38, height: 1, background: 'rgba(17,17,17,0.3)' }} />
        </motion.div>

        <h1 className="rd-display rd-hero__title">
          <span className="rd-line">
            <motion.span className="rd-line__inner" variants={lineReveal}>
              Hospitality,
            </motion.span>
          </span>
          <span className="rd-line">
            <motion.span className="rd-line__inner" variants={lineReveal}>
              without <span className="rd-amber">friction</span>.
            </motion.span>
          </span>
        </h1>

        <motion.p className="rd-lead rd-hero__lead" variants={fadeUp}>
          The invisible OS for modern restaurants — and the people they serve.
          One gesture replaces the call, the wait, the friction.
        </motion.p>

        <motion.div
          variants={fadeUp}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.6rem' }}
        >
          <button type="button" className="rd-btn rd-btn--primary" onClick={() => scrollToId('contact')}>
            Book a demo
          </button>
          <button type="button" className="rd-btn rd-btn--ghost" onClick={() => scrollToId('gesture')}>
            See how it works
          </button>
        </motion.div>

        <motion.div className="rd-hero__meta" variants={fadeUp}>
          <span>
            <span className="rd-yuzu-dot" /> Reserve in under 5 seconds
          </span>
          <span>No app required</span>
          <span>Liquid Motion UX</span>
        </motion.div>
      </motion.div>

      <button
        type="button"
        className="rd-cue"
        onClick={() => scrollToId('gesture')}
        aria-label="Scroll to see how it works"
      >
        <span>Scroll</span>
        <span className="rd-cue__track">
          <span className="rd-cue__bead" />
        </span>
      </button>
    </section>
  );
}
