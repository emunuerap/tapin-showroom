import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import { AnimatedPath } from '../visuals/AnimatedPath';
import { fadeUp, lineReveal, staggerParent, inView } from '../motion/variants';
import { useReducedMotion } from '../motion/useReducedMotion';
import { ease } from '../../design/light-tokens';

type TableState = 'seated' | 'open' | 'next';
type Table = { id: number; x: number; y: number; seats: number; state: TableState };

const TABLES: Table[] = [
  { id: 1, x: 130, y: 150, seats: 4, state: 'seated' },
  { id: 2, x: 250, y: 118, seats: 2, state: 'seated' },
  { id: 3, x: 372, y: 150, seats: 4, state: 'open' },
  { id: 4, x: 492, y: 124, seats: 2, state: 'seated' },
  { id: 5, x: 150, y: 312, seats: 6, state: 'seated' },
  { id: 6, x: 332, y: 304, seats: 2, state: 'next' },
  { id: 7, x: 480, y: 300, seats: 4, state: 'open' },
];

/** path the host walks to seat the next party */
const ROUTE = 'M 70 408 C 150 388, 196 352, 332 306';

function tableRadius(seats: number): number {
  if (seats <= 2) return 16;
  if (seats <= 4) return 21;
  return 27;
}

const seatFill: Record<TableState, string> = {
  seated: '#A6B09A',
  open: 'transparent',
  next: '#FFB800',
};

const seats = TABLES.flatMap((t) => {
  const r = tableRadius(t.seats) + 11;
  return Array.from({ length: t.seats }).map((_, i) => {
    const angle = (i / t.seats) * Math.PI * 2 - Math.PI / 2;
    return {
      key: `t${t.id}s${i}`,
      cx: t.x + r * Math.cos(angle),
      cy: t.y + r * Math.sin(angle),
      state: t.state,
    };
  });
});

export function RestaurantLayer() {
  const reduced = useReducedMotion();
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.5 });

  return (
    <section id="restaurants" className="rd-section rd-rest">
      <motion.div
        className="rd-container rd-head"
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        <motion.span className="rd-eyebrow" variants={fadeUp}>
          For Restaurants
        </motion.span>
        <h2 className="rd-display rd-head__title">
          <span className="rd-line">
            <motion.span className="rd-line__inner" variants={lineReveal}>
              Your floor,
            </motion.span>
          </span>
          <span className="rd-line">
            <motion.span className="rd-line__inner" variants={lineReveal}>
              <span className="rd-amber">choreographed</span>.
            </motion.span>
          </span>
        </h2>
        <motion.p className="rd-lead" variants={fadeUp}>
          TapIn reads the room as one living system — covers, turn times, the
          pressure building in a section — and quietly tells you where the next
          party belongs.
        </motion.p>
      </motion.div>

      <div className="rd-container">
        <div className="rd-rest__grid">
          <div className="rd-floor">
            <motion.svg
              className="rd-floor__svg"
              viewBox="0 0 600 450"
              fill="none"
              initial="hidden"
              whileInView="show"
              viewport={inView}
              aria-label="A restaurant floor plan: tables filling and a path to the next available table."
              role="img"
            >
              {/* the pass / bar */}
              <rect x={46} y={40} width={196} height={24} rx={12} fill="rgba(166,176,154,0.32)" />

              {/* service-pressure warmth near the busy six-top */}
              <motion.ellipse
                cx={150}
                cy={312}
                rx={86}
                ry={62}
                fill="#FFB800"
                animate={reduced ? { opacity: 0.22 } : { opacity: [0.14, 0.32, 0.14] }}
                transition={reduced ? undefined : { duration: 4, ease: ease.inOut, repeat: Infinity }}
              />

              {/* the host's route to the next table */}
              <AnimatedPath d={ROUTE} stroke="rgba(17,17,17,0.4)" strokeWidth={1.5} delay={0.4} />
              {!reduced && (
                <circle r={4.5} fill="#CCFF00">
                  <animateMotion dur="3.8s" repeatCount="indefinite" path={ROUTE} begin="1.4s" />
                  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.85;1" dur="3.8s" repeatCount="indefinite" begin="1.4s" />
                </circle>
              )}

              {/* tables */}
              {TABLES.map((t) => {
                const r = tableRadius(t.seats);
                const isNext = t.state === 'next';
                const isSeated = t.state === 'seated';
                return (
                  <circle
                    key={`table-${t.id}`}
                    cx={t.x}
                    cy={t.y}
                    r={r}
                    fill={isSeated ? '#111111' : isNext ? 'rgba(247,244,238,0.9)' : 'transparent'}
                    stroke={isNext ? '#CCFF00' : isSeated ? 'transparent' : 'rgba(17,17,17,0.2)'}
                    strokeWidth={isNext ? 2.5 : 1.4}
                  />
                );
              })}

              {/* seats — choreographed fill */}
              <motion.g variants={staggerParent}>
                {seats.map((s) => (
                  <motion.circle
                    key={s.key}
                    cx={s.cx}
                    cy={s.cy}
                    fill={seatFill[s.state]}
                    stroke={s.state === 'open' ? 'rgba(17,17,17,0.25)' : 'transparent'}
                    strokeWidth={1.2}
                    variants={{
                      hidden: { opacity: 0, r: 0 },
                      show: { opacity: 1, r: 4.5, transition: { duration: 0.4, ease: ease.liquid } },
                    }}
                  />
                ))}
              </motion.g>
            </motion.svg>

            {/* the one yuzu intelligence moment on the floor */}
            <motion.div
              className="rd-ai-tag"
              style={{ left: '47%', top: '52%' }}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: 1.2, duration: 0.6, ease: ease.liquid }}
            >
              <span className="rd-yuzu-dot" /> Seat the 8:00 → Table 6 · ready 8:12
            </motion.div>
          </div>

          <div className="rd-rest__stats" ref={statsRef}>
            <Stat value={94} suffix="%" label="Seats turning on time tonight" start={statsInView} />
            <Stat value={41} suffix="′" label="Average turn — down 12 minutes this month" start={statsInView} />
            <Stat value={0} label="Parties left waiting at the door" start={statsInView} accent />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  suffix,
  label,
  start,
  accent = false,
}: {
  value: number;
  suffix?: string;
  label: string;
  start: boolean;
  accent?: boolean;
}) {
  const reduced = useReducedMotion();
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    if (!start || reduced || value === 0) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: ease.reveal,
      onUpdate: (v) => setAnimated(Math.round(v)),
    });
    return () => controls.stop();
  }, [start, value, reduced]);

  // No synchronous setState in the effect — derive the shown value instead.
  const display = !start ? 0 : reduced || value === 0 ? value : animated;

  return (
    <motion.div
      className="rd-stat"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={inView}
    >
      <div className="rd-stat__value">
        {accent ? <span className="rd-yuzu-dot" style={{ marginRight: '0.4rem' }} /> : null}
        {display}
        {suffix}
      </div>
      <div className="rd-stat__label">{label}</div>
    </motion.div>
  );
}
