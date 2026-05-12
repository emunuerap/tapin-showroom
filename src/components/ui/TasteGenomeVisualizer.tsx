import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * TasteGenomeVisualizer — the radar visualisation of a guest's Taste Genome.
 *
 * REWRITTEN to actually communicate, not to require interaction the user
 * doesn't understand. What it now shows:
 *  - A 6-axis hexagonal radar covering meaningful dimensions of dining taste
 *    (Palate, Setting, Hour, Group, Pace, Wine)
 *  - The active polygon ANIMATES into shape on mount (radar "draws itself")
 *  - The values then subtly MUTATE every ~4 seconds (±a few points on one
 *    or two axes) — visible signal that the Genome is "learning" in real
 *    time, with a soft pulse on the changed axis dot
 *  - Hover over any axis label to see what that signal means
 *  - A vector signature at the bottom — a fingerprint-style hex string
 *    that updates with the values
 */

interface Axis {
    id: string;
    label: string;
    description: string;
}

const AXES: Axis[] = [
    { id: 'palate', label: 'Palate',  description: 'Flavour bias — umami, acid, fat, salt, sweet' },
    { id: 'setting', label: 'Setting', description: 'Atmosphere preference — intimate to lively' },
    { id: 'hour',    label: 'Hour',    description: 'When you naturally dine — early, late, weekday vs weekend' },
    { id: 'group',   label: 'Group',   description: 'Who you bring — solo, pair, family, work' },
    { id: 'pace',    label: 'Pace',    description: 'How long you linger — quick, leisurely, lingering' },
    { id: 'wine',    label: 'Wine',    description: 'Bottle range — by-glass, mid, cellar list' },
];

const INITIAL_VALUES = [82, 65, 48, 73, 88, 56];

export function TasteGenomeVisualizer() {
    const [values, setValues] = useState<number[]>(INITIAL_VALUES);
    const [hoverIdx, setHoverIdx] = useState<number | null>(null);
    const [recentMutation, setRecentMutation] = useState<number | null>(null);
    const aliveRef = useRef(true);

    /* Auto-mutation loop — every 3.5-5.5s, nudge one axis by ±3-7 points. */
    useEffect(() => {
        aliveRef.current = true;
        let timer: ReturnType<typeof setTimeout>;
        const schedule = () => {
            const ms = 3500 + Math.random() * 2000;
            timer = setTimeout(() => {
                if (!aliveRef.current) return;
                const idx = Math.floor(Math.random() * AXES.length);
                const delta = (Math.random() < 0.5 ? -1 : 1) * (3 + Math.floor(Math.random() * 5));
                setValues((prev) => {
                    const next = [...prev];
                    next[idx] = Math.max(25, Math.min(95, next[idx] + delta));
                    return next;
                });
                setRecentMutation(idx);
                setTimeout(() => setRecentMutation((i) => (i === idx ? null : i)), 1200);
                schedule();
            }, ms);
        };
        schedule();
        return () => {
            aliveRef.current = false;
            clearTimeout(timer);
        };
    }, []);

    /* SVG layout */
    const cx = 170;
    const cy = 170;
    const radius = 110;
    const labelRadius = radius + 26;

    const points = values.map((val, i) => {
        const angle = (Math.PI * 2 * i) / AXES.length - Math.PI / 2;
        const r = (val / 100) * radius;
        return {
            x: cx + r * Math.cos(angle),
            y: cy + r * Math.sin(angle),
            labelX: cx + labelRadius * Math.cos(angle),
            labelY: cy + labelRadius * Math.sin(angle),
            angle,
            val,
        };
    });

    const pathString = `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')} Z`;

    /* Build vector ID from values — fingerprint-style hex string */
    const vectorId = values
        .map((v) => Math.floor((v / 100) * 255).toString(16).padStart(2, '0').toUpperCase())
        .join(':');

    return (
        <div className="relative w-full max-w-[400px] bg-[#0A0A0A]/85 backdrop-blur-md border border-white/12 rounded-2xl px-6 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.55),0_0_24px_rgba(204,255,0,0.04)]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/8">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-silver/55">
                    Genome · Live
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="relative flex w-1.5 h-1.5">
                        <span className="absolute inset-0 rounded-full bg-yuzu animate-ping opacity-75" />
                        <span className="relative w-1.5 h-1.5 rounded-full bg-yuzu" />
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-yuzu/75">
                        Learning
                    </span>
                </span>
            </div>

            {/* Radar */}
            <div className="relative w-full flex items-center justify-center">
                <svg width="340" height="340" viewBox="0 0 340 340" className="overflow-visible">
                    {/* Background concentric rings (web) */}
                    {[25, 50, 75, 100].map((level) => {
                        const r = (level / 100) * radius;
                        const webPoints = AXES.map((_, i) => {
                            const angle = (Math.PI * 2 * i) / AXES.length - Math.PI / 2;
                            return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
                        }).join(' ');
                        return (
                            <polygon
                                key={level}
                                points={webPoints}
                                fill="none"
                                stroke="rgba(255,255,255,0.06)"
                                strokeWidth="0.6"
                                strokeDasharray={level === 100 ? '0' : '2 3'}
                            />
                        );
                    })}

                    {/* Axis lines */}
                    {AXES.map((_, i) => {
                        const angle = (Math.PI * 2 * i) / AXES.length - Math.PI / 2;
                        const x2 = cx + radius * Math.cos(angle);
                        const y2 = cy + radius * Math.sin(angle);
                        return (
                            <line
                                key={i}
                                x1={cx} y1={cy} x2={x2} y2={y2}
                                stroke="rgba(255,255,255,0.06)"
                                strokeWidth="0.6"
                            />
                        );
                    })}

                    {/* Active path — animates as values change */}
                    <motion.path
                        d={pathString}
                        fill="rgba(204,255,0,0.14)"
                        stroke="rgba(204,255,0,0.85)"
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{ filter: 'drop-shadow(0 0 8px rgba(204,255,0,0.25))' }}
                    />

                    {/* Value dots — pulse the one that just mutated */}
                    {points.map((p, i) => {
                        const isHover = hoverIdx === i;
                        const isRecent = recentMutation === i;
                        return (
                            <g key={i}>
                                {isRecent && (
                                    <circle
                                        cx={p.x} cy={p.y} r="4"
                                        fill="none"
                                        stroke="rgba(204,255,0,0.7)"
                                        strokeWidth="1"
                                        opacity="0.55"
                                    />
                                )}
                                <circle
                                    cx={p.x} cy={p.y}
                                    r={isHover ? 5 : 3.2}
                                    fill={isHover ? 'rgb(204,255,0)' : 'rgba(204,255,0,0.85)'}
                                    style={{ filter: 'drop-shadow(0 0 4px rgba(204,255,0,0.55))' }}
                                />
                            </g>
                        );
                    })}

                    {/* Axis labels — hoverable */}
                    {points.map((p, i) => {
                        const axis = AXES[i];
                        const isHover = hoverIdx === i;
                        return (
                            <g
                                key={`label-${i}`}
                                onMouseEnter={() => setHoverIdx(i)}
                                onMouseLeave={() => setHoverIdx((cur) => (cur === i ? null : cur))}
                                style={{ cursor: 'help' }}
                            >
                                <text
                                    x={p.labelX}
                                    y={p.labelY - 5}
                                    textAnchor="middle"
                                    fontFamily="monospace"
                                    fontSize="9"
                                    letterSpacing="1.5"
                                    fill={isHover ? 'rgba(204,255,0,0.95)' : 'rgba(255,255,255,0.65)'}
                                    style={{ transition: 'fill 200ms', textTransform: 'uppercase' }}
                                >
                                    {axis.label}
                                </text>
                                <text
                                    x={p.labelX}
                                    y={p.labelY + 7}
                                    textAnchor="middle"
                                    fontFamily="monospace"
                                    fontSize="9"
                                    fill={isHover ? 'rgba(204,255,0,0.85)' : 'rgba(204,255,0,0.55)'}
                                    style={{ transition: 'fill 200ms' }}
                                >
                                    {Math.round(p.val)}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Hover description or default helper text */}
            <div className="mt-2 min-h-[34px] flex items-center justify-center text-center">
                {hoverIdx !== null ? (
                    <motion.p
                        key={`desc-${hoverIdx}`}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-sans text-[11.5px] text-silver/75 leading-snug px-2"
                    >
                        <span className="font-mono uppercase tracking-[0.2em] text-yuzu/85 mr-2">
                            {AXES[hoverIdx].label}
                        </span>
                        {AXES[hoverIdx].description}
                    </motion.p>
                ) : (
                    <p className="font-mono text-[10px] text-silver/35 uppercase tracking-[0.22em]">
                        Hover an axis · Genome refines itself
                    </p>
                )}
            </div>

            {/* Footer — vector signature */}
            <div className="mt-3 pt-3 border-t border-white/8 flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-silver/45">
                    Signature
                </span>
                <span className="font-mono text-[10px] text-yuzu/80 tracking-wide">
                    {vectorId}
                </span>
            </div>
        </div>
    );
}
