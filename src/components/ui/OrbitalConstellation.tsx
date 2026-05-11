import { motion } from 'framer-motion';

/**
 * OrbitalConstellation — premium visualisation of a Taste Genome.
 *
 * Concept: the guest is the centre. Three orbital rings represent the
 * concentric layers of taste — INTIMATE (atmosphere preferences), PALATE
 * (cuisine + flavour signals), and SOCIAL (group / occasion signals). Each
 * ring carries a few signal nodes orbiting at their own pace. A subtle
 * connection line draws from the centre to each node — feels like a real
 * data structure, not a generic radar.
 *
 * Replaces the previous version which had bouncy badges floating randomly.
 */

interface Signal { label: string; weight: 'high' | 'mid' | 'low'; }
interface Ring {
    name: string;
    radius: number;        // px
    rotationSec: number;   // seconds for full revolution
    direction: 1 | -1;
    signals: Signal[];
}

const RINGS: Ring[] = [
    {
        name: 'Palate',
        radius: 64,
        rotationSec: 50,
        direction: 1,
        signals: [
            { label: 'Wagyu',  weight: 'high' },
            { label: 'Chablis', weight: 'mid' },
            { label: 'Oysters', weight: 'high' },
            { label: 'Citrus',  weight: 'low' },
        ],
    },
    {
        name: 'Intimate',
        radius: 108,
        rotationSec: 80,
        direction: -1,
        signals: [
            { label: 'Low-light', weight: 'high' },
            { label: 'Corner seat', weight: 'mid' },
            { label: 'Quiet',  weight: 'high' },
        ],
    },
    {
        name: 'Social',
        radius: 154,
        rotationSec: 120,
        direction: 1,
        signals: [
            { label: 'Pairs', weight: 'high' },
            { label: 'Anniversaries', weight: 'mid' },
            { label: 'Wine-forward', weight: 'mid' },
            { label: 'Late dinner', weight: 'low' },
        ],
    },
];

const ringNames = ['Palate', 'Intimate', 'Social'] as const;

export function OrbitalConstellation() {
    return (
        <div className="relative w-full h-full flex items-center justify-center min-h-[420px]">
            {/* Soft centre warmth */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.05)_0%,transparent_55%)]" />

            <div className="relative w-[360px] h-[360px] flex items-center justify-center">
                {/* Ring labels around the diagram (top edge of each ring) */}
                {RINGS.map((r) => (
                    <span
                        key={`label-${r.name}`}
                        className="absolute font-mono text-[8.5px] uppercase tracking-[0.28em] text-silver/40 select-none pointer-events-none"
                        style={{
                            top: `calc(50% - ${r.radius}px - 12px)`,
                            left: '50%',
                            transform: 'translateX(-50%)',
                        }}
                    >
                        {r.name}
                    </span>
                ))}

                {/* Concentric rings (static) */}
                {RINGS.map((r) => (
                    <span
                        key={`ring-${r.name}`}
                        className="absolute rounded-full border border-dashed border-white/8"
                        style={{
                            width: r.radius * 2,
                            height: r.radius * 2,
                        }}
                    />
                ))}

                {/* Signals orbiting per ring */}
                {RINGS.map((r) => (
                    <motion.div
                        key={`orbit-${r.name}`}
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ rotate: r.direction * 360 }}
                        transition={{ duration: r.rotationSec, repeat: Infinity, ease: 'linear' }}
                    >
                        {r.signals.map((s, i) => {
                            const angle = (i / r.signals.length) * 2 * Math.PI;
                            const x = Math.cos(angle) * r.radius;
                            const y = Math.sin(angle) * r.radius;
                            return (
                                <SignalNode
                                    key={`${r.name}-${s.label}`}
                                    label={s.label}
                                    weight={s.weight}
                                    x={x}
                                    y={y}
                                    counterRotateSec={r.rotationSec}
                                    counterRotateDir={r.direction === 1 ? -1 : 1}
                                />
                            );
                        })}
                    </motion.div>
                ))}

                {/* Central node — the guest */}
                <div className="absolute z-20 flex items-center justify-center">
                    <span className="absolute w-10 h-10 rounded-full bg-yuzu/15 blur-md" />
                    <motion.span
                        className="relative block w-3.5 h-3.5 rounded-full bg-yuzu shadow-[0_0_18px_rgba(204,255,0,0.7)]"
                        animate={{ scale: [1, 1.18, 1], opacity: [0.95, 1, 0.95] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>

                {/* Tiny label under the centre */}
                <span className="absolute top-[calc(50%+18px)] left-1/2 -translate-x-1/2 font-mono text-[8.5px] uppercase tracking-[0.3em] text-yuzu/75 select-none pointer-events-none whitespace-nowrap">
                    Your Genome
                </span>
            </div>

            {/* Legend underneath the diagram */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-4 font-mono text-[8.5px] uppercase tracking-[0.22em] text-silver/45">
                {ringNames.map((n, i) => (
                    <span key={n} className="flex items-center gap-1.5">
                        <span className={`block w-1 h-1 rounded-full ${i === 0 ? 'bg-yuzu' : 'bg-silver/45'}`} />
                        {n}
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ─── SIGNAL NODE ──────────────────────────────────────────────────────── */

function SignalNode({
    label,
    weight,
    x,
    y,
    counterRotateSec,
    counterRotateDir,
}: {
    label: string;
    weight: 'high' | 'mid' | 'low';
    x: number;
    y: number;
    counterRotateSec: number;
    counterRotateDir: 1 | -1;
}) {
    const isHigh = weight === 'high';
    const isLow = weight === 'low';
    return (
        <motion.div
            className="absolute flex items-center justify-center"
            style={{ x, y }}
            animate={{ rotate: counterRotateDir * 360 }}
            transition={{ duration: counterRotateSec, repeat: Infinity, ease: 'linear' }}
        >
            <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md transition-colors ${
                    isHigh
                        ? 'bg-yuzu/15 border border-yuzu/45 text-yuzu/95 shadow-[0_0_10px_rgba(204,255,0,0.15)]'
                        : isLow
                            ? 'bg-[#0A0A0A]/85 border border-white/8 text-silver/55'
                            : 'bg-[#0A0A0A]/90 border border-white/15 text-white/80'
                }`}
            >
                <span
                    className={`block w-1 h-1 rounded-full ${
                        isHigh ? 'bg-yuzu' : isLow ? 'bg-silver/45' : 'bg-yuzu/60'
                    }`}
                />
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] whitespace-nowrap">
                    {label}
                </span>
            </div>
        </motion.div>
    );
}
