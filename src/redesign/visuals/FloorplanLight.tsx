import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimatedPath } from './AnimatedPath';
import { useReducedMotion } from '../motion/useReducedMotion';
import { useMediaQuery } from '../motion/useMediaQuery';
import { ease } from '../../design/light-tokens';

/**
 * FloorplanLight — the interactive blueprint floor + live intelligence feed.
 *
 * A light-language reimagining of the dark site's HospitalityCockpit: a
 * technical blueprint of the dining room (basil line-work on porcelain),
 * tables you can hover for seat-level POS data, a yuzu-traced route to the
 * next party's table, and a live feed of what the OS is doing on the floor.
 * Auto-demos itself (cycling table focus) until you take over with the mouse.
 */

type Seat = { n: string; o: string };
type Status = 'occupied' | 'free' | 'next';
type Table = {
  id: string;
  shape: 'rect' | 'circle';
  x: number;
  y: number;
  w?: number;
  h?: number;
  r?: number;
  status: Status;
  score: number;
  turn: number; // turnaround completion %
  pax: number;
  seats: Seat[];
};

const VBW = 400;
const VBH = 230;

const TABLES: Table[] = [
  { id: '01', shape: 'rect', x: 28, y: 50, w: 58, h: 44, status: 'occupied', score: 9.2, turn: 72, pax: 2, seats: [{ n: 'Alex', o: 'Oysters · Chablis' }, { n: 'Emma', o: 'Truffle risotto' }] },
  { id: '02', shape: 'rect', x: 102, y: 50, w: 46, h: 44, status: 'free', score: 0, turn: 0, pax: 0, seats: [] },
  { id: '03', shape: 'rect', x: 166, y: 50, w: 88, h: 44, status: 'occupied', score: 8.6, turn: 40, pax: 3, seats: [{ n: 'Guest', o: 'Wagyu A5' }, { n: 'Guest', o: 'Black cod' }, { n: 'Guest', o: 'Spicy tuna' }] },
  { id: '04', shape: 'circle', x: 322, y: 72, r: 27, status: 'occupied', score: 9.8, turn: 88, pax: 1, seats: [{ n: 'Jordan', o: 'Omakase menu' }] },
  { id: '05', shape: 'rect', x: 28, y: 126, w: 58, h: 58, status: 'occupied', score: 8.1, turn: 28, pax: 2, seats: [{ n: 'Guest', o: 'Steak frites' }, { n: 'Guest', o: 'Burrata' }] },
  { id: '06', shape: 'circle', x: 150, y: 158, r: 24, status: 'next', score: 0, turn: 0, pax: 0, seats: [] },
  { id: '07', shape: 'rect', x: 200, y: 128, w: 74, h: 56, status: 'free', score: 0, turn: 0, pax: 0, seats: [] },
  { id: '08', shape: 'circle', x: 324, y: 156, r: 31, status: 'occupied', score: 9.4, turn: 55, pax: 3, seats: [{ n: 'Sarah', o: 'Champagne' }, { n: 'Tom', o: 'Caviar service' }, { n: 'Mia', o: 'Tartare' }] },
];

const ROUTE = 'M 26 212 C 72 196, 96 180, 150 160';

function center(t: Table): { cx: number; cy: number } {
  if (t.shape === 'circle') return { cx: t.x, cy: t.y };
  return { cx: t.x + (t.w ?? 0) / 2, cy: t.y + (t.h ?? 0) / 2 };
}

const FEED: { t: string; yuzu: boolean }[] = [
  { t: 'VIP detected at host stand · routing to T08', yuzu: true },
  { t: 'Gratitude signal · T04 · sentiment +0.32', yuzu: false },
  { t: 'Walk-in arrived · 4-top · est. wait 4m', yuzu: true },
  { t: 'Course pacing slow at T03 · prompting server', yuzu: false },
  { t: 'Re-optimisation cycle · +15% RevPASH today', yuzu: true },
  { t: 'Table 07 freeing in 6m · pre-staged', yuzu: false },
  { t: 'No-show predicted · smart deposit requested', yuzu: true },
  { t: 'Dwell time optimal · 92% covers on time', yuzu: false },
];

type FeedEntry = { id: string; time: string; t: string; yuzu: boolean };

function clockNow(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

export function FloorplanLight() {
  const reduced = useReducedMotion();
  // Hover tooltips are a desktop interaction — on the small mobile floor the
  // tooltip would cover the room, so we keep both it and the auto-demo to wide
  // screens. Mobile gets the live floor + AI cue + activity feed instead.
  const isWide = useMediaQuery('(min-width: 768px)');
  const [hovered, setHovered] = useState<string | null>(null);
  const interacted = useRef(false);

  const occupiedIds = TABLES.filter((t) => t.status === 'occupied').map((t) => t.id);

  // Auto-demo: cycle focus across occupied tables until the user takes over.
  useEffect(() => {
    if (reduced || !isWide) return;
    let i = 0;
    const id = window.setInterval(() => {
      if (interacted.current) {
        window.clearInterval(id);
        return;
      }
      setHovered(occupiedIds[i % occupiedIds.length]);
      i += 1;
    }, 2600);
    // seed quickly so the tooltip is present on arrival
    const seed = window.setTimeout(() => {
      if (!interacted.current) setHovered(occupiedIds[0]);
    }, 900);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(seed);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, isWide]);

  const active = hovered ? TABLES.find((t) => t.id === hovered) ?? null : null;

  return (
    <div className="rd-cockpit">
      <div className="rd-cockpit__main">
        <div className="rd-cockpit__bar">
          <span className="rd-cockpit__title">
            <span className="rd-yuzu-dot" /> Floor · Tetris Agent active
          </span>
          <div className="rd-legend" aria-hidden="true">
            <span><i data-k="occupied" /> Seated</span>
            <span><i data-k="free" /> Open</span>
            <span><i data-k="next" /> Next</span>
          </div>
        </div>

        <div
          className="rd-floor"
          onMouseLeave={() => {
            if (interacted.current) setHovered(null);
          }}
        >
          <div className="rd-floor__grid rd-blueprint-grid" aria-hidden="true" />
          <span className="rd-floor__corner rd-floor__corner--tl" aria-hidden="true" />
          <span className="rd-floor__corner rd-floor__corner--tr" aria-hidden="true" />
          <span className="rd-floor__corner rd-floor__corner--bl" aria-hidden="true" />
          <span className="rd-floor__corner rd-floor__corner--br" aria-hidden="true" />

          <motion.svg
            className="rd-floor__svg"
            viewBox={`0 0 ${VBW} ${VBH}`}
            fill="none"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            role="img"
            aria-label="Interactive restaurant floor plan with live table status."
          >
            {/* bar / pass */}
            <rect x={22} y={18} width={150} height={15} rx={7} fill="rgba(166,176,154,0.4)" />
            <text x={26} y={29} fontFamily="Hanken Grotesk, sans-serif" fontSize={7.5} fill="#2E4636" letterSpacing="1">THE PASS</text>

            {/* route to the next party */}
            <AnimatedPath d={ROUTE} stroke="rgba(46,70,54,0.45)" strokeWidth={1.4} delay={0.3} />
            {!reduced && (
              <circle r={4} fill="#CCFF00">
                <animateMotion dur="3.8s" repeatCount="indefinite" path={ROUTE} begin="1.2s" />
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.85;1" dur="3.8s" repeatCount="indefinite" begin="1.2s" />
              </circle>
            )}

            {/* tables */}
            {TABLES.map((t, idx) => {
              const isHovered = hovered === t.id;
              const occ = t.status === 'occupied';
              const next = t.status === 'next';
              const stroke = isHovered ? '#CCFF00' : next ? '#CCFF00' : occ ? 'transparent' : 'rgba(46,70,54,0.4)';
              const fill = occ ? '#2E4636' : next ? 'rgba(247,244,238,0.85)' : 'transparent';
              const dash = t.status === 'free' ? '4 4' : undefined;
              const { cx, cy } = center(t);
              const common = {
                fill,
                stroke,
                strokeWidth: isHovered || next ? 2 : 1.2,
                strokeDasharray: dash,
                style: { cursor: 'pointer', transition: 'stroke 0.3s ease' } as const,
                onMouseEnter: () => {
                  interacted.current = true;
                  setHovered(t.id);
                },
              };
              return (
                <motion.g
                  key={t.id}
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.4 + idx * 0.07, duration: 0.5 } } }}
                >
                  {t.shape === 'circle' ? (
                    <circle cx={t.x} cy={t.y} r={t.r} {...common} />
                  ) : (
                    <rect x={t.x} y={t.y} width={t.w} height={t.h} rx={9} {...common} />
                  )}
                  <text
                    x={cx}
                    y={cy + (occ ? 0 : 2.5)}
                    textAnchor="middle"
                    fontFamily="Hanken Grotesk, sans-serif"
                    fontSize={9}
                    fontWeight={600}
                    fill={occ ? '#F7F4EE' : next ? '#2E4636' : 'rgba(46,70,54,0.55)'}
                    style={{ pointerEvents: 'none' }}
                  >
                    T{t.id}
                  </text>
                  {occ && (
                    <text x={cx} y={cy + 10} textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize={6} fill="rgba(247,244,238,0.7)" style={{ pointerEvents: 'none' }}>
                      {t.pax}P
                    </text>
                  )}
                </motion.g>
              );
            })}

            {/* dimension tick line at the foot — blueprint signature */}
            <line x1={22} y1={222} x2={378} y2={222} stroke="rgba(46,70,54,0.25)" strokeWidth={0.8} />
            <line x1={22} y1={219} x2={22} y2={225} stroke="rgba(46,70,54,0.25)" strokeWidth={0.8} />
            <line x1={378} y1={219} x2={378} y2={225} stroke="rgba(46,70,54,0.25)" strokeWidth={0.8} />
            <text x={200} y={221} textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize={6} fill="rgba(46,70,54,0.5)" letterSpacing="1.5">DINING ROOM · 86 COVERS</text>
          </motion.svg>

          {/* hover / demo tooltip — desktop only (would cover the mobile floor) */}
          <AnimatePresence>
            {isWide && active && (
              <TableTip key={active.id} table={active} />
            )}
          </AnimatePresence>

          {/* the always-on intelligence cue near the next table */}
          <motion.div
            className="rd-ai-tag"
            style={{ left: `${(150 / VBW) * 100}%`, top: `${(158 / VBH) * 100}%`, transform: 'translate(-46%, 18px)', position: 'absolute', zIndex: 4 }}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 1, duration: 0.6, ease: ease.liquid }}
          >
            <span className="rd-yuzu-dot" /> Seat the 8:00 → T06 · ready 8:12
          </motion.div>
        </div>
      </div>

      <LiveFeed reduced={reduced} />
    </div>
  );
}

function TableTip({ table }: { table: Table }) {
  const { cx, cy } = center(table);
  const left = Math.min(82, Math.max(18, (cx / VBW) * 100));
  const below = (cy / VBH) * 100 < 46;
  return (
    <motion.div
      className="rd-floor__tip"
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      style={{
        left: `${left}%`,
        top: `${(cy / VBH) * 100}%`,
        transform: `translate(-50%, ${below ? '16px' : 'calc(-100% - 16px)'})`,
      }}
    >
      <div className="rd-floor__tip-head">
        <span>TABLE {table.id} · check #890{table.id}</span>
        <b>★ {table.score.toFixed(1)}</b>
      </div>
      {table.seats.length > 0 ? (
        table.seats.map((s, i) => (
          <div key={i} className="rd-floor__seat">
            <span>{s.n}</span>
            <span>{s.o}</span>
          </div>
        ))
      ) : (
        <div className="rd-floor__tip-free">Open — no POS data on this node.</div>
      )}
      <div className="rd-floor__bar">
        <div className="rd-floor__bar-label">
          <span>Turnaround</span>
          <span>{table.turn}%</span>
        </div>
        <div className="rd-floor__bar-track">
          <motion.div
            className="rd-floor__bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${table.turn}%` }}
            transition={{ duration: 0.9, ease: ease.liquid }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function LiveFeed({ reduced }: { reduced: boolean }) {
  const [entries, setEntries] = useState<FeedEntry[]>(() =>
    reduced ? FEED.slice(0, 6).map((f, i) => ({ id: `seed${i}`, time: '—', t: f.t, yuzu: f.yuzu })) : []
  );
  const cursor = useRef(0);
  const seq = useRef(0);

  useEffect(() => {
    if (reduced) return;
    let alive = true;
    const push = () => {
      const tpl = FEED[cursor.current % FEED.length];
      cursor.current += 1;
      seq.current += 1;
      const entry: FeedEntry = { id: `e${seq.current}`, time: clockNow(), t: tpl.t, yuzu: tpl.yuzu };
      setEntries((prev) => [entry, ...prev].slice(0, 6));
    };
    push();
    push();
    push();
    const tick = () => {
      if (!alive) return;
      push();
      window.setTimeout(tick, 3000 + Math.random() * 1800);
    };
    const first = window.setTimeout(tick, 2800);
    return () => {
      alive = false;
      window.clearTimeout(first);
    };
  }, [reduced]);

  return (
    <div className="rd-feed">
      <div className="rd-feed__head">
        <span className="rd-yuzu-dot" /> Live activity
      </div>
      <div className="rd-feed__list">
        <AnimatePresence initial={false}>
          {entries.map((e) => (
            <motion.div
              key={e.id}
              className="rd-feed__item"
              data-yuzu={e.yuzu}
              layout
              initial={{ opacity: 0, y: -14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            >
              <div className="rd-feed__meta">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <i /> SYS
                </span>
                <span>{e.time}</span>
              </div>
              <div className="rd-feed__text">{e.t}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
