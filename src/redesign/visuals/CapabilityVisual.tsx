import { motion } from 'framer-motion';
import { ease } from '../../design/light-tokens';

/**
 * CapabilityVisual — a bespoke abstract motif per capability (line-art on the
 * pine stage), so the OS's capabilities read visually, not as text cards.
 * Sand strokes + honey accents. Subtle continuous motion; honours reduced
 * motion via the page-level MotionConfig.
 */

const SAND = 'rgba(244,231,208,0.55)';
const SAND_FAINT = 'rgba(244,231,208,0.16)';
const HONEY = '#DDA84C';
const VB = '0 0 420 420';

const loop = (extra: object = {}) => ({ duration: 3.2, repeat: Infinity, ease: ease.inOut, ...extra });

export function CapabilityVisual({ id }: { id: string }) {
  switch (id) {
    case '01':
      return <Tetris />;
    case '02':
      return <Shield />;
    case '03':
      return <WalkIn />;
    case '04':
      return <Genome />;
    case '05':
      return <Gratitude />;
    default:
      return <Sync />;
  }
}

/* 01 — Tetris Agent: a packed grid, one honey tile slotting in */
function Tetris() {
  const cells = [
    [0, 0, 1], [1, 0, 1], [2, 0, 0], [3, 0, 1],
    [0, 1, 1], [1, 1, 0], [2, 1, 1], [3, 1, 1],
    [0, 2, 0], [1, 2, 1], [2, 2, 1], [3, 2, 0],
  ];
  return (
    <svg viewBox={VB} className="rd-caps__svg" fill="none" aria-hidden="true">
      {cells.map(([c, r, on], i) => (
        <rect key={i} x={60 + c * 78} y={90 + r * 78} width={68} height={68} rx={12}
          fill={on ? SAND_FAINT : 'transparent'} stroke={SAND} strokeWidth={1.4} />
      ))}
      <motion.rect
        x={138} y={246} width={68} height={68} rx={12} fill={HONEY}
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: ease.liquid }}
      />
    </svg>
  );
}

/* 02 — No-show shield: a drawn shield + honey check */
function Shield() {
  return (
    <svg viewBox={VB} className="rd-caps__svg" fill="none" aria-hidden="true">
      <motion.path
        d="M210 70 L320 110 V210 C320 290 270 330 210 355 C150 330 100 290 100 210 V110 Z"
        stroke={SAND} strokeWidth={1.6}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: ease.liquid }}
      />
      <motion.path
        d="M165 205 L198 240 L262 165" stroke={HONEY} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.8, ease: ease.liquid }}
      />
      <circle cx={210} cy={210} r={150} stroke={SAND_FAINT} strokeWidth={1} />
    </svg>
  );
}

/* 03 — Walk-in Express: NFC tap ripples (animate radius, not scale) */
function WalkIn() {
  return (
    <svg viewBox={VB} className="rd-caps__svg" fill="none" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.circle key={i} cx={210} cy={210} stroke={HONEY} strokeWidth={1.6} fill="none"
          initial={{ r: 30, opacity: 0 }}
          animate={{ r: [30, 172], opacity: [0.85, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: ease.inOut, delay: i }}
        />
      ))}
      <circle cx={210} cy={210} r={24} fill={HONEY} />
      <circle cx={210} cy={210} r={150} stroke={SAND_FAINT} strokeWidth={1} />
    </svg>
  );
}

/* 04 — Taste Genome: a constellation fingerprint */
function Genome() {
  const nodes = [
    [120, 110], [210, 80], [300, 130], [330, 230], [260, 300], [150, 300], [90, 210], [210, 200],
  ];
  return (
    <svg viewBox={VB} className="rd-caps__svg" fill="none" aria-hidden="true">
      {nodes.map(([x, y], i) => {
        const [nx, ny] = nodes[(i + 1) % nodes.length];
        return <line key={`l${i}`} x1={x} y1={y} x2={nx} y2={ny} stroke={SAND_FAINT} strokeWidth={1} />;
      })}
      {nodes.map(([x, y], i) => <line key={`c${i}`} x1={x} y1={y} x2={210} y2={200} stroke={SAND_FAINT} strokeWidth={0.8} />)}
      {nodes.map(([x, y], i) => <circle key={`n${i}`} cx={x} cy={y} r={5} fill={SAND} />)}
      <motion.circle cx={210} cy={200} r={9} fill={HONEY}
        animate={{ opacity: [0.5, 1, 0.5] }} transition={loop()} />
    </svg>
  );
}

/* 05 — Gratitude Protocol: a rising sentiment wave */
function Gratitude() {
  return (
    <svg viewBox={VB} className="rd-caps__svg" fill="none" aria-hidden="true">
      <motion.path
        d="M70 250 C 130 180, 170 320, 230 230 C 280 155, 330 250, 360 190"
        stroke={SAND} strokeWidth={1.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: ease.liquid }}
      />
      {[[150, 150], [250, 120], [320, 95]].map(([x, y], i) => (
        <motion.g key={i} animate={{ y: [6, -6, 6], opacity: [0.4, 1, 0.4] }} transition={loop({ delay: i * 0.6 })}>
          <line x1={x - 9} y1={y} x2={x + 9} y2={y} stroke={HONEY} strokeWidth={3} strokeLinecap="round" />
          <line x1={x} y1={y - 9} x2={x} y2={y + 9} stroke={HONEY} strokeWidth={3} strokeLinecap="round" />
        </motion.g>
      ))}
    </svg>
  );
}

/* 06 — Live POS sync: a sync loop with an orbiting pulse (SMIL rotate) */
function Sync() {
  return (
    <svg viewBox={VB} className="rd-caps__svg" fill="none" aria-hidden="true">
      <circle cx={210} cy={210} r={120} stroke={SAND} strokeWidth={1.6} strokeDasharray="6 10" />
      <g>
        <circle cx={210} cy={90} r={9} fill={HONEY} />
        <animateTransform attributeName="transform" type="rotate" from="0 210 210" to="360 210 210" dur="8s" repeatCount="indefinite" />
      </g>
      <path d="M170 210 H250 M210 170 V250" stroke={SAND_FAINT} strokeWidth={1.2} />
      <circle cx={210} cy={210} r={150} stroke={SAND_FAINT} strokeWidth={1} />
    </svg>
  );
}
