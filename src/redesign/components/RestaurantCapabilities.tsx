import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Reveal } from './Reveal';
import { useMediaQuery } from '../motion/useMediaQuery';
import { ease } from '../../design/light-tokens';

gsap.registerPlugin(ScrollTrigger);

type Capability = { no: string; title: string; desc: string; metric: string; sub: string; img: string };

const CAPS: Capability[] = [
  { no: '01', title: 'Tetris Agent', desc: 'Real-time seating that works the grid for you — packing covers, protecting pacing, never leaving a four-top sitting empty.', metric: '+15%', sub: 'RevPASH per shift', img: '/redesign/img/c-spacious.jpg' },
  { no: '02', title: 'No-show shield', desc: 'Predicts the risk, requests a smart deposit when it matters, and auto-releases the table the moment a party ghosts.', metric: '−80%', sub: 'silent no-shows', img: '/redesign/img/c-tables.jpg' },
  { no: '03', title: 'Walk-in Express', desc: 'A tap at the host stand seats walk-ins in seconds — no clipboard, no guesswork, slotted straight into the live floor.', metric: '~4 min', sub: 'average wait', img: '/redesign/img/c-ornate.jpg' },
  { no: '04', title: 'Taste Genome', desc: 'Every guest carries a flavour fingerprint. The OS remembers the Chablis, the allergy, the anniversary — and prompts the server.', metric: '100%', sub: 'of regulars, remembered', img: '/redesign/img/c-plating.jpg' },
  { no: '05', title: 'Gratitude Protocol', desc: 'Tips and thank-yous become live sentiment signals on the floor, so you know which tables are glowing and which need a touch.', metric: '+0.32', sub: 'average sentiment lift', img: '/redesign/img/c-chef.jpg' },
  { no: '06', title: 'Live POS sync', desc: 'Checks, courses and dwell time stream straight into the floor map. One source of truth — zero double entry.', metric: '0', sub: 'manual entries', img: '/redesign/img/c-chandelier.jpg' },
];

export function RestaurantCapabilities() {
  const isWide = useMediaQuery('(min-width: 861px)');
  const [active, setActive] = useState(0);
  const cap = CAPS[active];
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const lastIdx = useRef(0);

  // Cinematic pin/scrub (desktop): pin the stage and scrub through the six
  // capabilities, each a full visual scene. Mobile gets a stacked fallback.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', () => {
        if (!pinRef.current) return;
        ScrollTrigger.create({
          trigger: pinRef.current,
          start: 'top 12%',
          end: '+=2100',
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
    { scope: sectionRef, dependencies: [isWide] }
  );

  return (
    <section id="capabilities" ref={sectionRef} className="rd-section rd-caps">
      <Reveal className="rd-container rd-head">
        <h2 className="rd-display rd-head__title">
          <span className="rd-line">
            <span className="rd-line__inner">Everything the room needs,</span>
          </span>
          <span className="rd-line">
            <span className="rd-line__inner">
              running <span className="rd-accent">quietly</span>.
            </span>
          </span>
        </h2>
        <p className="rd-lead">
          Not another dashboard to babysit. One system, working the floor while
          your team works the guests — scroll through what&rsquo;s running underneath.
        </p>
      </Reveal>

      {isWide ? (
        <div className="rd-caps__pin" ref={pinRef}>
          <div className="rd-container">
            <div className="rd-caps__stage">
              <div className="rd-blueprint-grid" aria-hidden="true" />

              <ol className="rd-caps__index" aria-hidden="true">
                {CAPS.map((c, i) => (
                  <li key={c.no} data-active={i === active}>{c.no}</li>
                ))}
              </ol>

              <AnimatePresence mode="wait">
                <motion.div
                  key={cap.no}
                  className="rd-caps__scene"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.45, ease: ease.liquid }}
                >
                  <div className="rd-caps__scene-text">
                    <div className="rd-caps__scene-no">{cap.no} — 06</div>
                    <h3 className="rd-caps__scene-title">{cap.title}</h3>
                    <p className="rd-caps__scene-desc">{cap.desc}</p>
                    <div className="rd-caps__scene-metric">
                      {cap.metric} <span>{cap.sub}</span>
                    </div>
                  </div>
                  <figure className="rd-caps__photo">
                    <img src={cap.img} alt="" loading="lazy" />
                    <span className="rd-caps__photo-tint" aria-hidden="true" />
                  </figure>
                </motion.div>
              </AnimatePresence>

              <div className="rd-caps__progress" aria-hidden="true">
                <span style={{ transform: `scaleX(${(active + 1) / CAPS.length})` }} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rd-container rd-caps__stack">
          {CAPS.map((c) => (
            <Reveal key={c.no} className="rd-caps__card" y={34}>
              <figure className="rd-caps__photo">
                <img src={c.img} alt="" loading="lazy" />
                <span className="rd-caps__photo-tint" aria-hidden="true" />
              </figure>
              <div className="rd-caps__scene-text">
                <div className="rd-caps__scene-no">{c.no} — 06</div>
                <h3 className="rd-caps__scene-title">{c.title}</h3>
                <p className="rd-caps__scene-desc">{c.desc}</p>
                <div className="rd-caps__scene-metric">
                  {c.metric} <span>{c.sub}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
