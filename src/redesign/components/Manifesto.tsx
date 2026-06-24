import { useRef } from 'react';
import type { CSSProperties } from 'react';
import { motion, useScroll } from 'framer-motion';
import type { MotionStyle } from 'framer-motion';
import { Reveal } from './Reveal';

/**
 * Manifesto — the "chaos → a full house that runs itself" beat. Deliberately
 * NOT about speed (GestureFlow owns the 3-second gesture); this is about the
 * floor. A scroll-linked grid of tables fills as you descend and empties as
 * you scroll back, so the room visibly comes to life — no decorative stroke.
 */
const PROBLEM =
  'Eight o’clock. The phone won’t stop, the book is a mess of cross-outs, and the bar is filling with names that never confirmed.';

const SEATS = 32;

function RoomFill() {
  const ref = useRef<HTMLDivElement>(null);
  // 0 → 1 as the section crosses the viewport; reverses on scroll-up
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] });
  return (
    <motion.div ref={ref} className="rd-mf__floor" aria-hidden="true" style={{ '--p': scrollYProgress } as MotionStyle}>
      {Array.from({ length: SEATS }).map((_, i) => (
        <span className="rd-mf__seat" key={i} style={{ '--s': (i / SEATS).toFixed(3) } as CSSProperties}>
          <span className="rd-mf__seat-fill" />
        </span>
      ))}
    </motion.div>
  );
}

export function Manifesto() {
  return (
    <section id="why" className="rd-section rd-mf">
      <div className="rd-container rd-mf__inner">
        <Reveal className="rd-mf__text">
          <span className="rd-mf__eyebrow">The quiet system</span>
          <p className="rd-mf__problem">
            {PROBLEM.split(' ').map((w, i) => (
              <span key={i} className="rd-mf__word">
                {w}
              </span>
            ))}
          </p>
          <h2 className="rd-display rd-mf__turn">
            TapIn runs the room underneath it all — so a full house feels{' '}
            <span className="rd-accent">effortless</span>, never like chaos.
          </h2>
        </Reveal>

        <RoomFill />

        <Reveal className="rd-mf__caption" y={16}>
          Every cover placed, paced and turned — no clipboard, no crossings-out, no four-top left sitting empty.
        </Reveal>
      </div>
    </section>
  );
}
