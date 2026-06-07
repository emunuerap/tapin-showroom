import { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { FlowLine } from '../visuals/FlowLine';
import { fadeUp, lineReveal, riseIn, staggerParent, inView } from '../motion/variants';
import { useReducedMotion } from '../motion/useReducedMotion';
import { ease } from '../../design/light-tokens';

const CONNECTOR = 'M 0 30 C 250 -6, 250 66, 500 30 C 750 -6, 750 66, 1000 30';

export function GestureFlow() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <section id="gesture" className="rd-section rd-gesture">
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
              Three seconds from
            </motion.span>
          </span>
          <span className="rd-line">
            <motion.span className="rd-line__inner" variants={lineReveal}>
              craving to <span className="rd-accent">confirmed</span>.
            </motion.span>
          </span>
        </h2>
        <motion.p className="rd-lead" variants={fadeUp}>
          No phone call. No waiting on hold. Choose, swipe, done — the whole
          reservation collapses into a single, deliberate motion.
        </motion.p>
      </motion.div>

      <div className="rd-container">
        <div className="rd-beats">
          <FlowLine
            className="rd-connector"
            viewBox="0 0 1000 60"
            d={CONNECTOR}
            stroke="rgba(46,30,22,0.28)"
            strokeWidth={1.5}
            travel
            travelColor="#DDA84C"
            travelDur={3.6}
          />

          {/* Beat 1 — Choose */}
          <motion.div
            className="rd-beat"
            variants={riseIn}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            <span className="rd-beat__index">01</span>
            <span className="rd-beat__label">Choose</span>
            <p className="rd-beat__note">Time, table, party — surfaced before you ask.</p>
            <div className="rd-beat__stage">
              <div className="rd-chips" style={{ marginBottom: '0.5rem' }}>
                <span className="rd-chip" data-active="true">Tonight</span>
                <span className="rd-chip">Tomorrow</span>
              </div>
              <div className="rd-chips">
                <span className="rd-chip">7:30</span>
                <span className="rd-chip" data-active="true">8:00</span>
                <span className="rd-chip">2 guests</span>
              </div>
            </div>
          </motion.div>

          {/* Beat 2 — Swipe */}
          <motion.div
            className="rd-beat"
            variants={riseIn}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            transition={{ delay: 0.08 }}
          >
            <span className="rd-beat__index">02</span>
            <span className="rd-beat__label">Swipe</span>
            <p className="rd-beat__note">One decisive motion commits the table.</p>
            <div className="rd-beat__stage">
              <SwipeToBook confirmed={confirmed} onConfirm={() => setConfirmed(true)} />
            </div>
          </motion.div>

          {/* Beat 3 — Confirm */}
          <motion.div
            className="rd-beat"
            variants={riseIn}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            transition={{ delay: 0.16 }}
          >
            <span className="rd-beat__index">03</span>
            <span className="rd-beat__label">Confirm</span>
            <p className="rd-beat__note">Held instantly. The kitchen already knows.</p>
            <div className="rd-beat__stage">
              <ConfirmMark active={confirmed} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- swipe-to-book: drag it, or watch it demo itself ---------- */
function SwipeToBook({ confirmed, onConfirm }: { confirmed: boolean; onConfirm: () => void }) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const interacted = useRef(false);
  const x = useMotionValue(0);
  const [maxX, setMaxX] = useState(170);
  const isInView = useInView(trackRef, { once: true, amount: 0.6 });
  const fillScale = useTransform(x, [0, Math.max(1, maxX)], [0.16, 1]);

  useEffect(() => {
    const measure = () => {
      const el = trackRef.current;
      if (!el) return;
      // track has 5px inner padding each side; knob is 46px wide
      setMaxX(Math.max(40, el.clientWidth - 46 - 10));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // auto-demo (or instant complete for reduced motion)
  useEffect(() => {
    if (!isInView || confirmed || interacted.current) return;
    if (reduced) {
      x.set(maxX);
      onConfirm();
      return;
    }
    const controls = animate(x, maxX, {
      duration: 1.15,
      delay: 0.8,
      ease: ease.liquid,
      onComplete: () => {
        if (!interacted.current) onConfirm();
      },
    });
    return () => controls.stop();
  }, [isInView, reduced, maxX, confirmed, onConfirm, x]);

  // keep the knob pinned at the end once confirmed (e.g. after demo)
  useEffect(() => {
    if (confirmed) animate(x, maxX, { duration: 0.3, ease: ease.liquid });
  }, [confirmed, maxX, x]);

  return (
    <div className="rd-swipe" ref={trackRef}>
      <motion.div className="rd-swipe__fill" style={{ scaleX: fillScale }} />
      <span className="rd-swipe__label">{confirmed ? 'Table held' : 'Swipe to reserve'}</span>
      <motion.button
        type="button"
        className="rd-swipe__knob"
        aria-label="Swipe to reserve"
        drag={confirmed ? false : 'x'}
        dragConstraints={{ left: 0, right: maxX }}
        dragElastic={0.03}
        dragMomentum={false}
        style={{ x }}
        onPointerDown={() => {
          interacted.current = true;
        }}
        onDragEnd={() => {
          if (x.get() > maxX * 0.62) {
            animate(x, maxX, { duration: 0.3, ease: ease.liquid });
            onConfirm();
          } else {
            animate(x, 0, { duration: 0.45, ease: ease.liquid });
          }
        }}
      >
        {confirmed ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12.5 L10 17.5 L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 5 L15 12 L8 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </motion.button>
    </div>
  );
}

/* ---------- confirm mark: ring + check that draws on success ---------- */
function ConfirmMark({ active }: { active: boolean }) {
  return (
    <motion.div
      className="rd-confirm"
      initial={false}
      animate={{ opacity: active ? 1 : 0.34 }}
      transition={{ duration: 0.5, ease: ease.liquid }}
    >
      <svg className="rd-confirm__check" viewBox="0 0 52 52" fill="none" aria-hidden="true">
        <motion.circle
          cx={26}
          cy={26}
          r={24}
          stroke="rgba(46,30,22,0.2)"
          strokeWidth={1.5}
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: active ? 1 : 0 }}
          transition={{ duration: 0.8, ease: ease.liquid }}
        />
        <motion.path
          d="M14 27 L23 36 L40 17"
          stroke="#2E1E16"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: active ? 1 : 0 }}
          transition={{ duration: 0.55, delay: active ? 0.25 : 0, ease: ease.liquid }}
        />
      </svg>
      <div className="rd-confirm__text">
        <span className="rd-yuzu-dot" /> Table held
      </div>
      <div className="rd-confirm__sub">Confirmation sent — no call, no wait.</div>
    </motion.div>
  );
}
