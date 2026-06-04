import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import { FloorplanLight } from '../visuals/FloorplanLight';
import { fadeUp, lineReveal, staggerParent, inView } from '../motion/variants';
import { useReducedMotion } from '../motion/useReducedMotion';
import { ease } from '../../design/light-tokens';

export function RestaurantLayer() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.4 });

  return (
    <section id="restaurants" className="rd-section rd-rest">
      <motion.div
        className="rd-container rd-head"
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        <motion.span className="rd-tag" variants={fadeUp}>
          For restaurants
        </motion.span>
        <h2 className="rd-display rd-head__title">
          <span className="rd-line">
            <motion.span className="rd-line__inner" variants={lineReveal}>
              Your floor,
            </motion.span>
          </span>
          <span className="rd-line">
            <motion.span className="rd-line__inner" variants={lineReveal}>
              <span className="rd-accent">choreographed</span>.
            </motion.span>
          </span>
        </h2>
        <motion.p className="rd-lead" variants={fadeUp}>
          TapIn reads the room as one living system — every cover, turn time and
          the pressure building in a section. Hover a table: it&rsquo;s real POS
          data, a satisfaction score, a turnaround clock. The Tetris Agent works
          the grid in the background so the next party always has a seat.
        </motion.p>
      </motion.div>

      <motion.div
        className="rd-container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: ease.liquid }}
      >
        <FloorplanLight />

        <div className="rd-rest__stats" ref={statsRef}>
          <Stat value={94} suffix="%" label="Seats turning on time tonight" start={statsInView} />
          <Stat value={41} suffix="′" label="Average turn — down 12 minutes this month" start={statsInView} />
          <Stat value={15} prefix="+" suffix="%" label="RevPASH lift this quarter" start={statsInView} />
          <Stat value={0} label="Parties left waiting at the door" start={statsInView} accent />
        </div>
      </motion.div>
    </section>
  );
}

function Stat({
  value,
  prefix,
  suffix,
  label,
  start,
  accent = false,
}: {
  value: number;
  prefix?: string;
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

  const display = !start ? 0 : reduced || value === 0 ? value : animated;

  return (
    <motion.div className="rd-stat" variants={fadeUp} initial="hidden" whileInView="show" viewport={inView}>
      <div className="rd-stat__value">
        {accent ? <span className="rd-yuzu-dot" style={{ marginRight: '0.45rem' }} /> : null}
        {prefix}
        {display}
        {suffix}
      </div>
      <div className="rd-stat__label">{label}</div>
    </motion.div>
  );
}
