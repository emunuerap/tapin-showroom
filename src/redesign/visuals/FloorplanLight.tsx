import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimatedPath } from './AnimatedPath';
import { useReducedMotion } from '../motion/useReducedMotion';
import { useMediaQuery } from '../motion/useMediaQuery';
import { ease } from '../../design/light-tokens';

/**
 * FloorplanLight — the full-bleed, drag-to-explore restaurant blueprint.
 *
 * Warm Sand × Pine palette. A large pannable floor (drag with inertia), a
 * cursor-follow spotlight over the blueprint, magnet-hover tables that reveal
 * seat-level POS data, a yuzu→honey-traced route to the next party, and a
 * pinned HUD of live KPIs + activity feed. Inherits the intelligence of the
 * dark site's HospitalityCockpit, reimagined as one immersive ops canvas.
 */

type Seat = { n: string; o: string };
type Status = 'occupied' | 'free' | 'next';
type Table = {
  id: string; shape: 'rect' | 'circle';
  x: number; y: number; w?: number; h?: number; r?: number;
  status: Status; score: number; turn: number; pax: number; seats: Seat[];
};

const PLANE_W = 1700;
const PLANE_H = 1050;

// brand palette (kept in sync with redesign.css)
const PINE = '#214335';
const SAND = '#F4E7D0';
const HONEY = '#DDA84C';
const PINE_45 = 'rgba(33,67,53,0.45)';

const TABLES: Table[] = [
  { id: '01', shape: 'rect', x: 150, y: 175, w: 150, h: 110, status: 'occupied', score: 9.2, turn: 72, pax: 2, seats: [{ n: 'Alex', o: 'Oysters · Chablis' }, { n: 'Emma', o: 'Truffle risotto' }] },
  { id: '02', shape: 'rect', x: 350, y: 175, w: 120, h: 110, status: 'free', score: 0, turn: 0, pax: 0, seats: [] },
  { id: '03', shape: 'rect', x: 520, y: 175, w: 210, h: 110, status: 'occupied', score: 8.6, turn: 40, pax: 4, seats: [{ n: 'Guest', o: 'Wagyu A5' }, { n: 'Guest', o: 'Black cod' }, { n: 'Guest', o: 'Spicy tuna' }, { n: 'Guest', o: 'Uni' }] },
  { id: '04', shape: 'circle', x: 880, y: 230, r: 72, status: 'occupied', score: 9.8, turn: 88, pax: 1, seats: [{ n: 'Jordan', o: 'Omakase menu' }] },
  { id: '05', shape: 'rect', x: 1030, y: 175, w: 150, h: 110, status: 'free', score: 0, turn: 0, pax: 0, seats: [] },
  { id: '06', shape: 'circle', x: 1380, y: 235, r: 82, status: 'occupied', score: 9.4, turn: 55, pax: 3, seats: [{ n: 'Sarah (VIP)', o: 'Champagne' }, { n: 'Tom', o: 'Caviar service' }, { n: 'Mia', o: 'Tartare' }] },
  { id: '07', shape: 'rect', x: 150, y: 500, w: 150, h: 150, status: 'occupied', score: 8.1, turn: 28, pax: 2, seats: [{ n: 'Guest', o: 'Steak frites' }, { n: 'Guest', o: 'Burrata' }] },
  { id: '08', shape: 'circle', x: 470, y: 580, r: 70, status: 'next', score: 0, turn: 0, pax: 0, seats: [] },
  { id: '09', shape: 'rect', x: 640, y: 500, w: 200, h: 150, status: 'free', score: 0, turn: 0, pax: 0, seats: [] },
  { id: '10', shape: 'circle', x: 1040, y: 580, r: 86, status: 'occupied', score: 9.0, turn: 64, pax: 4, seats: [{ n: 'Guest', o: 'Tasting menu' }, { n: 'Guest', o: 'Sommelier pairing' }, { n: 'Guest', o: 'Lobster' }, { n: 'Guest', o: 'Dover sole' }] },
  { id: '11', shape: 'rect', x: 1280, y: 505, w: 180, h: 150, status: 'occupied', score: 8.8, turn: 36, pax: 2, seats: [{ n: 'Guest', o: 'Cacio e pepe' }, { n: 'Guest', o: 'Negroni' }] },
  { id: '12', shape: 'rect', x: 300, y: 800, w: 190, h: 130, status: 'occupied', score: 7.9, turn: 18, pax: 3, seats: [{ n: 'Guest', o: 'Margherita' }, { n: 'Guest', o: 'Spritz' }, { n: 'Guest', o: 'Tiramisù' }] },
  { id: '13', shape: 'circle', x: 700, y: 865, r: 70, status: 'free', score: 0, turn: 0, pax: 0, seats: [] },
  { id: '14', shape: 'rect', x: 880, y: 800, w: 230, h: 130, status: 'occupied', score: 9.6, turn: 80, pax: 4, seats: [{ n: 'Guest', o: 'Chef counter' }, { n: 'Guest', o: 'Sake flight' }, { n: 'Guest', o: 'A5 nigiri' }, { n: 'Guest', o: 'Toro' }] },
  { id: '15', shape: 'circle', x: 1320, y: 865, r: 78, status: 'occupied', score: 8.4, turn: 48, pax: 2, seats: [{ n: 'Guest', o: 'Bistecca' }, { n: 'Guest', o: 'Barolo' }] },
];

const ROUTE = 'M 150 1010 C 270 900, 330 690, 470 590';

const FEED: { t: string; yuzu: boolean }[] = [
  { t: 'VIP detected at host stand · routing to T06', yuzu: true },
  { t: 'Gratitude signal · T14 · sentiment +0.32', yuzu: false },
  { t: 'Walk-in arrived · 4-top · est. wait 4m', yuzu: true },
  { t: 'Course pacing slow at T03 · prompting server', yuzu: false },
  { t: 'Re-optimisation cycle · +15% RevPASH today', yuzu: true },
  { t: 'T09 freeing in 6m · pre-staged for the 8:00', yuzu: false },
  { t: 'No-show predicted · smart deposit requested', yuzu: true },
  { t: 'Dwell time optimal · 92% covers on time', yuzu: false },
];

type FeedEntry = { id: string; time: string; t: string; yuzu: boolean };
let FEED_SEQ = 0;
function clockNow(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}
function center(t: Table): { cx: number; cy: number } {
  if (t.shape === 'circle') return { cx: t.x, cy: t.y };
  return { cx: t.x + (t.w ?? 0) / 2, cy: t.y + (t.h ?? 0) / 2 };
}

const KPIS = [
  { v: '86', l: 'Covers tonight' },
  { v: '78%', l: 'Occupancy' },
  { v: '41′', l: 'Avg turn' },
  { v: '+15%', em: true, l: 'RevPASH' },
];

export function FloorplanLight() {
  const reduced = useReducedMotion();
  const isWide = useMediaQuery('(min-width: 768px)');
  const zoneRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [dragged, setDragged] = useState(false);
  const interacted = useRef(false);

  const occupiedIds = TABLES.filter((t) => t.status === 'occupied').map((t) => t.id);

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
    const seed = window.setTimeout(() => {
      if (!interacted.current) setHovered(occupiedIds[0]);
    }, 1000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(seed);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, isWide]);

  // cursor-follow spotlight over the blueprint
  const onZoneMove = (e: React.MouseEvent) => {
    if (reduced || rafRef.current) return;
    const el = zoneRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    });
  };

  const active = hovered ? TABLES.find((t) => t.id === hovered) ?? null : null;

  return (
    <div className="rd-floorzone" ref={zoneRef} onMouseMove={onZoneMove}>
      <div className="rd-floorzone__grid rd-blueprint-grid" aria-hidden="true" />
      <div className="rd-floor__spot" aria-hidden="true" />

      <motion.div
        className="rd-floor__plane"
        drag
        dragConstraints={zoneRef}
        dragElastic={0.06}
        dragMomentum={!reduced}
        dragTransition={{ power: 0.22, timeConstant: 320 }}
        onDragStart={() => {
          interacted.current = true;
          setDragged(true);
        }}
      >
        <svg viewBox={`0 0 ${PLANE_W} ${PLANE_H}`} width={PLANE_W} height={PLANE_H} fill="none" aria-label="Restaurant floor plan">
          {/* pass / bar */}
          <rect x={150} y={92} width={520} height={40} rx={18} fill="rgba(169,184,158,0.5)" />
          <text x={170} y={118} fontFamily="General Sans, sans-serif" fontSize={18} fill={PINE} letterSpacing="2">THE PASS</text>

          {/* route to the next party */}
          <AnimatedPath d={ROUTE} stroke="rgba(33,67,53,0.5)" strokeWidth={3} delay={0.3} />
          {!reduced && (
            <circle r={8} fill={HONEY}>
              <animateMotion dur="4s" repeatCount="indefinite" path={ROUTE} begin="1s" />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.85;1" dur="4s" repeatCount="indefinite" begin="1s" />
            </circle>
          )}

          {TABLES.map((t) => {
            const isHovered = hovered === t.id;
            const occ = t.status === 'occupied';
            const next = t.status === 'next';
            const stroke = isHovered || next ? HONEY : occ ? 'transparent' : PINE_45;
            const fill = occ ? PINE : next ? 'rgba(244,231,208,0.85)' : 'transparent';
            const dash = t.status === 'free' ? '8 8' : undefined;
            const { cx, cy } = center(t);
            const common = {
              fill, stroke,
              strokeWidth: isHovered || next ? 4 : 2,
              strokeDasharray: dash,
              style: { transition: 'stroke 0.3s ease' } as const,
              onMouseEnter: () => {
                interacted.current = true;
                setHovered(t.id);
              },
            };
            return (
              <motion.g
                key={t.id}
                whileHover={isWide ? { scale: 1.045 } : undefined}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              >
                {t.shape === 'circle' ? (
                  <circle cx={t.x} cy={t.y} r={t.r} {...common} />
                ) : (
                  <rect x={t.x} y={t.y} width={t.w} height={t.h} rx={18} {...common} />
                )}
                <text x={cx} y={cy + (occ ? 2 : 6)} textAnchor="middle" fontFamily="General Sans, sans-serif" fontWeight={600} fontSize={22} fill={occ ? SAND : next ? PINE : 'rgba(33,67,53,0.6)'} style={{ pointerEvents: 'none' }}>
                  T{t.id}
                </text>
                {occ && (
                  <text x={cx} y={cy + 24} textAnchor="middle" fontFamily="General Sans, sans-serif" fontSize={14} fill="rgba(244,231,208,0.72)" style={{ pointerEvents: 'none' }}>
                    {t.pax}P · {t.turn}%
                  </text>
                )}
              </motion.g>
            );
          })}

          <line x1={150} y1={1000} x2={1480} y2={1000} stroke="rgba(33,67,53,0.3)" strokeWidth={1.5} />
          <text x={815} y={1024} textAnchor="middle" fontFamily="General Sans, sans-serif" fontSize={15} fill="rgba(33,67,53,0.55)" letterSpacing="4">OSTERIA LUMINA · DINING ROOM · 86 COVERS</text>
        </svg>

        {/* AI cue near the next table — pans with the plane */}
        <motion.div
          className="rd-floor__aitag"
          style={{ left: 470, top: 580, transform: 'translate(-50%, 70px)' }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6, ease: ease.liquid }}
        >
          <span className="rd-yuzu-dot" /> Seat the 8:00 → T08 · ready 8:12
        </motion.div>

        <AnimatePresence>
          {isWide && active && <TableTip key={active.id} table={active} />}
        </AnimatePresence>
      </motion.div>

      {/* pinned HUD */}
      <div className="rd-hud">
        <div className="rd-hud__kpis">
          {KPIS.map((k) => (
            <div key={k.l} className="rd-kpi">
              <div className="rd-kpi__v">{k.em ? <em>{k.v}</em> : k.v}</div>
              <div className="rd-kpi__l">{k.l}</div>
            </div>
          ))}
        </div>

        <div className="rd-hud__legend" aria-hidden="true">
          <span><i data-k="occupied" /> Seated</span>
          <span><i data-k="free" /> Open</span>
          <span><i data-k="next" /> Next</span>
        </div>

        <div className="rd-hud__feed">
          <div className="rd-feed__head"><span className="rd-yuzu-dot" /> Tetris Agent · live</div>
          <LiveFeed reduced={reduced} />
        </div>

        <AnimatePresence>
          {!dragged && (
            <motion.div
              className="rd-hud__hint"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M5 12l4-4M5 12l4 4M19 12l-4-4M19 12l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Drag to explore the floor
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TableTip({ table }: { table: Table }) {
  const { cx, cy } = center(table);
  const below = cy < 360;
  return (
    <motion.div
      className="rd-floor__tip"
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      style={{ left: cx, top: cy, transform: `translate(-50%, ${below ? '40px' : 'calc(-100% - 40px)'})` }}
    >
      <div className="rd-floor__tip-head">
        <span>TABLE {table.id} · check #89{table.id}</span>
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
          <motion.div className="rd-floor__bar-fill" initial={{ width: 0 }} animate={{ width: `${table.turn}%` }} transition={{ duration: 0.9, ease: ease.liquid }} />
        </div>
      </div>
    </motion.div>
  );
}

function LiveFeed({ reduced }: { reduced: boolean }) {
  const [entries, setEntries] = useState<FeedEntry[]>(() =>
    reduced ? FEED.slice(0, 4).map((f, i) => ({ id: `seed${i}`, time: '—', t: f.t, yuzu: f.yuzu })) : []
  );
  const cursor = useRef(0);

  useEffect(() => {
    if (reduced) return;
    let alive = true;
    const push = () => {
      const tpl = FEED[cursor.current % FEED.length];
      cursor.current += 1;
      FEED_SEQ += 1;
      const id = `fe${FEED_SEQ}`;
      setEntries((prev) => [{ id, time: clockNow(), t: tpl.t, yuzu: tpl.yuzu }, ...prev].slice(0, 4));
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
    <div className="rd-feed__list">
      <AnimatePresence initial={false}>
        {entries.map((e) => (
          <motion.div
            key={e.id}
            className="rd-feed__item"
            data-yuzu={e.yuzu}
            layout
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          >
            <div className="rd-feed__meta">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><i /> SYS</span>
              <span>{e.time}</span>
            </div>
            <div className="rd-feed__text">{e.t}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
