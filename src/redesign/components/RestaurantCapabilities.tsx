import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fadeUp, lineReveal, staggerParent, inView } from '../motion/variants';
import { ease } from '../../design/light-tokens';

gsap.registerPlugin(ScrollTrigger);

type Capability = { no: string; title: string; desc: string; metric: string; sub: string };

const CAPS: Capability[] = [
  { no: '01', title: 'Tetris Agent', desc: 'Real-time seating that works the grid for you — packing covers, protecting pacing, never leaving a four-top sitting empty.', metric: '+15%', sub: 'RevPASH per shift' },
  { no: '02', title: 'No-show shield', desc: 'Predicts the risk, requests a smart deposit when it matters, and auto-releases the table the moment a party ghosts.', metric: '−80%', sub: 'silent no-shows' },
  { no: '03', title: 'Walk-in Express', desc: 'A tap at the host stand seats walk-ins in seconds — no clipboard, no guesswork, slotted straight into the live floor.', metric: '~4 min', sub: 'average wait' },
  { no: '04', title: 'Taste Genome', desc: 'Every guest carries a flavour fingerprint. The OS remembers the Chablis, the allergy, the anniversary — and prompts the server.', metric: '100%', sub: 'of regulars, remembered' },
  { no: '05', title: 'Gratitude Protocol', desc: 'Tips and thank-yous become live sentiment signals on the floor, so you know which tables are glowing and which need a touch.', metric: '+0.32', sub: 'average sentiment lift' },
  { no: '06', title: 'Live POS sync', desc: 'Checks, courses and dwell time stream straight into the floor map. One source of truth — zero double entry.', metric: '0', sub: 'manual entries' },
];

export function RestaurantCapabilities() {
  const [active, setActive] = useState(0);
  const cap = CAPS[active];
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const lastIdx = useRef(0);

  // Cinematic pin/scrub (desktop, non-reduced): pin the explorer and scrub
  // through the six capabilities as the user scrolls. Falls back to the plain
  // hover explorer on mobile / reduced motion. (CODEGRID pinned-scene pattern.)
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', () => {
        ScrollTrigger.create({
          trigger: pinRef.current,
          start: 'top 16%',
          end: '+=1800',
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            const idx = Math.min(CAPS.length - 1, Math.floor(self.progress * CAPS.length));
            if (idx !== lastIdx.current) {
              lastIdx.current = idx;
              setActive(idx);
            }
          },
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section id="capabilities" ref={sectionRef} className="rd-section rd-caps">
      <motion.div
        className="rd-container rd-head"
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        <h2 className="rd-display rd-head__title">
          <span className="rd-line">
            <motion.span className="rd-line__inner" variants={lineReveal}>
              Everything the room needs,
            </motion.span>
          </span>
          <span className="rd-line">
            <motion.span className="rd-line__inner" variants={lineReveal}>
              running <span className="rd-accent">quietly</span>.
            </motion.span>
          </span>
        </h2>
        <motion.p className="rd-lead" variants={fadeUp}>
          Not another dashboard to babysit. One system, working the floor while
          your team works the guests. Explore what&rsquo;s running underneath.
        </motion.p>
      </motion.div>

      <div className="rd-caps__pin" ref={pinRef}>
      <motion.div
        className="rd-container rd-explorer"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: ease.liquid }}
      >
        <div className="rd-explorer__list">
          {CAPS.map((c, i) => (
            <button
              key={c.no}
              type="button"
              className="rd-exp"
              data-active={i === active}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <span className="rd-exp__no">{c.no}</span>
              {c.title}
            </button>
          ))}
        </div>

        <div className="rd-explorer__detail">
          <div className="rd-blueprint-grid" aria-hidden="true" />
          <AnimatePresence mode="wait">
            <motion.div
              key={cap.no}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: ease.liquid }}
              style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}
            >
              <div>
                <div className="rd-detail__no">{cap.no} / 06</div>
                <h3 className="rd-detail__title">{cap.title}</h3>
                <p className="rd-detail__desc">{cap.desc}</p>
              </div>
              <div className="rd-detail__metric">
                {cap.metric} <span>{cap.sub}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      </div>
    </section>
  );
}
