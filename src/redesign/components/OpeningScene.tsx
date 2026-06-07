import { lazy, Suspense, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { AnimatedPath } from '../visuals/AnimatedPath';
import { fadeUp, lineReveal, staggerParent } from '../motion/variants';
import { useReducedMotion } from '../motion/useReducedMotion';
import { useMediaQuery } from '../motion/useMediaQuery';
import { scrollToId } from '../motion/scrollTo';
import { ease } from '../../design/light-tokens';

// WebGL hero field — lazy so three.js only loads on desktop, when shown.
const HeroCanvas = lazy(() => import('../visuals/HeroCanvas'));

/** A single expressive gesture stroke that resolves into a clean intention. */
const GESTURE =
  'M 110 590 C 300 680, 360 450, 560 500 C 740 545, 770 690, 930 545 C 1015 470, 1030 320, 1080 230';
const DOT = { cx: 1080, cy: 230 };

export function OpeningScene() {
  const reduced = useReducedMotion();
  const isWide = useMediaQuery('(min-width: 1024px)');
  const sectionRef = useRef<HTMLElement>(null);
  // mount the canvas only while the hero is on screen (frees the GPU after)
  const inHero = useInView(sectionRef, { margin: '200px' });
  const showField = isWide && !reduced && inHero;
  const { scrollY } = useScroll();
  const lineY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : 130]);
  const contentY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : 60]);

  return (
    <section id="top" ref={sectionRef} className="rd-section rd-hero">
      {showField && (
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
      )}

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
        <motion.circle
          cx={DOT.cx}
          cy={DOT.cy}
          r={26}
          fill="#DDA84C"
          opacity={0.16}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 0.16, transition: { delay: 2.1, duration: 0.6 } } }}
        />
        <motion.circle
          cx={DOT.cx}
          cy={DOT.cy}
          r={9}
          fill="#DDA84C"
          variants={{
            hidden: { opacity: 0, scale: 0 },
            show: { opacity: 1, scale: 1, transition: { delay: 2.05, duration: 0.5, ease: ease.liquid } },
          }}
          style={{ transformOrigin: `${DOT.cx}px ${DOT.cy}px` }}
        />
      </motion.svg>

      {/* floating live-intelligence chip */}
      <motion.aside
        className="rd-hero__chip"
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.1, duration: 0.8, ease: ease.liquid }}
        aria-hidden="true"
      >
        <div className="rd-hero__chip-row">
          <span className="rd-yuzu-dot" /> Tetris Agent · live
        </div>
        <div className="rd-hero__chip-row">
          <b>+15%</b> RevPASH today
        </div>
        <div className="rd-hero__chip-row">
          <b>T6</b> ready · seating 8:12
        </div>
      </motion.aside>

      <motion.div
        className="rd-container rd-hero__grid"
        style={{ y: contentY }}
        variants={staggerParent}
        initial="hidden"
        animate="show"
      >
        <h1 className="rd-display rd-hero__title">
          <span className="rd-line">
            <motion.span className="rd-line__inner" variants={lineReveal}>
              Hospitality,
            </motion.span>
          </span>
          <span className="rd-line">
            <motion.span className="rd-line__inner" variants={lineReveal}>
              without <span className="rd-accent">friction</span>.
            </motion.span>
          </span>
        </h1>

        <motion.p className="rd-lead rd-hero__lead" variants={fadeUp}>
          The operating system behind the modern dining room — booking, seating,
          and floor intelligence working as one. Reservations in five seconds.
          Tables that never sit empty.
        </motion.p>

        <motion.div
          variants={fadeUp}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.4rem' }}
        >
          <button type="button" className="rd-btn rd-btn--primary" onClick={() => scrollToId('contact')}>
            Book a demo
          </button>
          <button type="button" className="rd-btn rd-btn--ghost" onClick={() => scrollToId('restaurants')}>
            See the floor
          </button>
        </motion.div>

        <motion.div className="rd-hero__meta" variants={fadeUp}>
          <span>
            <span className="rd-yuzu-dot" /> Reserve in under 5 seconds
          </span>
          <span>Live POS sync</span>
          <span>No app required</span>
        </motion.div>
      </motion.div>

      <button type="button" className="rd-cue" onClick={() => scrollToId('gesture')} aria-label="Scroll to see how it works">
        <span>Scroll</span>
        <span className="rd-cue__track">
          <span className="rd-cue__bead" />
        </span>
      </button>
    </section>
  );
}
