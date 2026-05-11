import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TetrisAgentSimulator — refined live demo of the floor optimisation agent.
 *
 * What it shows: a 6-table grid representing the live floor. An incoming
 * party tries to claim a sub-optimal table; TapIn rejects the placement
 * ("Waste minimised"), routes them to the right-fit table, locks it as VIP,
 * and rewards the floor with +RevPASH. The loop repeats with explanatory
 * status pills so it actually reads as an optimisation process, not random
 * boxes.
 *
 * Stripped the legacy glass-panel + diagonal background — now the panel is
 * a flat data-grid, designed to live INSIDE the parent cockpit (IAFloor).
 */

type TableStatus = 'available' | 'incoming' | 'rejected' | 'locked_vip';

interface Table {
    id: number;
    type: '4-top' | '2-top' | 'Window 2-top';
    seats: number;
    status: TableStatus;
    prime?: boolean;
}

const INITIAL_FLOOR: Table[] = [
    { id: 1, type: '4-top',        seats: 4, status: 'available' },
    { id: 2, type: '2-top',        seats: 2, status: 'available' },
    { id: 3, type: '2-top',        seats: 2, status: 'available' },
    { id: 4, type: '4-top',        seats: 4, status: 'available' },
    { id: 5, type: 'Window 2-top', seats: 2, status: 'available', prime: true },
    { id: 6, type: '4-top',        seats: 4, status: 'available' },
];

const STATUS_COPY: Record<TableStatus, { label: string; muted: string }> = {
    available:  { label: 'Available',         muted: 'Ready'        },
    incoming:   { label: 'Attempt · 2p → 4p', muted: 'Probing fit'  },
    rejected:   { label: 'Rejected',          muted: 'Waste · 2 seats lost' },
    locked_vip: { label: 'Locked · VIP',      muted: 'Optimal fit'  },
};

const STATUS_VISUAL: Record<TableStatus, { fill: string; stroke: string; text: string; accent: string }> = {
    available:  { fill: 'bg-white/[0.02]',  stroke: 'border-white/10',    text: 'text-silver/55', accent: 'text-silver/40' },
    incoming:   { fill: 'bg-white/[0.08]',  stroke: 'border-white/30',    text: 'text-white',     accent: 'text-white/65'  },
    rejected:   { fill: 'bg-rose-500/[0.10]', stroke: 'border-rose-400/45', text: 'text-rose-300/90', accent: 'text-rose-300/65' },
    locked_vip: { fill: 'bg-yuzu/[0.10]',   stroke: 'border-yuzu/55',     text: 'text-yuzu/95',   accent: 'text-yuzu/75'   },
};

export function TetrisAgentSimulator() {
    const [floor, setFloor] = useState<Table[]>(INITIAL_FLOOR);
    const [phase, setPhase] = useState<'idle' | 'probing' | 'rejecting' | 'routing' | 'rewarded'>('idle');
    const [cycle, setCycle] = useState(1);
    const aliveRef = useRef(true);

    /* Optimisation cycle loop */
    useEffect(() => {
        aliveRef.current = true;
        const reset = () => INITIAL_FLOOR.map((t) => ({ ...t }));

        async function run() {
            while (aliveRef.current) {
                setFloor(reset());
                setPhase('idle');
                await wait(1500);
                if (!aliveRef.current) break;

                // 1. Probe — incoming 2p tries T1 (4-top)
                setPhase('probing');
                setFloor((prev) => prev.map((t) => t.id === 1 ? { ...t, status: 'incoming' } : t));
                await wait(1600);
                if (!aliveRef.current) break;

                // 2. Reject — Waste minimised
                setPhase('rejecting');
                setFloor((prev) => prev.map((t) => t.id === 1 ? { ...t, status: 'rejected' } : t));
                await wait(1200);
                if (!aliveRef.current) break;

                // 3. Route to T5 (Window 2-top, prime)
                setPhase('routing');
                setFloor((prev) => prev.map((t) =>
                    t.id === 1 ? { ...t, status: 'available' } :
                    t.id === 5 ? { ...t, status: 'locked_vip' } : t
                ));
                await wait(2400);
                if (!aliveRef.current) break;

                // 4. Reward
                setPhase('rewarded');
                await wait(2400);
                if (!aliveRef.current) break;

                // Next cycle
                setCycle((c) => c + 1);
            }
        }
        run();
        return () => { aliveRef.current = false; };
    }, []);

    return (
        <div className="flex flex-col gap-4">
            {/* Status banner above the grid — narrates the cycle */}
            <StatusBanner phase={phase} cycle={cycle} />

            {/* Floor grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 relative">
                {floor.map((t) => <TableCell key={t.id} table={t} />)}

                {/* Reward overlay */}
                <AnimatePresence>
                    {phase === 'rewarded' && (
                        <motion.div
                            initial={{ opacity: 0, y: 14, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -14, scale: 0.95 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-10"
                        >
                            <div className="bg-yuzu text-obsidian px-4 py-2 rounded-full font-mono text-[10.5px] font-bold tracking-[0.18em] uppercase shadow-[0_0_28px_rgba(204,255,0,0.45)] inline-flex items-center gap-2">
                                ✓ VIP seated · +50 RevPASH
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Legend — explains the colour code so the simulation reads clearly */}
            <Legend />
        </div>
    );
}

function wait(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

/* ─── STATUS BANNER ────────────────────────────────────────────────────── */

function StatusBanner({ phase, cycle }: { phase: string; cycle: number }) {
    const copy: Record<string, { kw: string; text: string; tone: 'normal' | 'warn' | 'yuzu' }> = {
        idle:      { kw: 'Watching',  text: 'Floor at rest · waiting for next party',         tone: 'normal' },
        probing:   { kw: 'Probing',   text: 'Incoming 2-top attempting Table 01 (4-top)',     tone: 'normal' },
        rejecting: { kw: 'Rejected',  text: 'Sub-optimal fit · 2 seats would be wasted',      tone: 'warn'   },
        routing:   { kw: 'Routing',   text: 'Re-assigning to Table 05 (Window 2-top · prime)', tone: 'yuzu'   },
        rewarded:  { kw: 'Optimised', text: 'Match locked · revenue per available seat-hour ↑', tone: 'yuzu'   },
    };
    const c = copy[phase] ?? copy.idle;
    const toneClass = c.tone === 'warn' ? 'text-rose-300/90' : c.tone === 'yuzu' ? 'text-yuzu/95' : 'text-white/85';
    return (
        <div className="flex items-baseline justify-between gap-3">
            <div className="flex items-baseline gap-3 min-w-0">
                <span className={`font-mono text-[9px] uppercase tracking-[0.28em] shrink-0 ${
                    c.tone === 'warn' ? 'text-rose-300/80' : c.tone === 'yuzu' ? 'text-yuzu/85' : 'text-silver/55'
                }`}>
                    {c.kw}
                </span>
                <AnimatePresence mode="wait">
                    <motion.span
                        key={phase}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.25 }}
                        className={`font-sans text-[12px] leading-tight tracking-tight truncate ${toneClass}`}
                    >
                        {c.text}
                    </motion.span>
                </AnimatePresence>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-silver/35 shrink-0">
                Cycle · {String(cycle).padStart(2, '0')}
            </span>
        </div>
    );
}

/* ─── TABLE CELL ───────────────────────────────────────────────────────── */

function TableCell({ table }: { table: Table }) {
    const v = STATUS_VISUAL[table.status];
    const c = STATUS_COPY[table.status];
    return (
        <motion.div
            layout
            className={`relative p-3.5 rounded-md border h-[92px] flex flex-col justify-between transition-colors duration-300 ${v.fill} ${v.stroke}`}
        >
            <div className={`flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.18em] ${v.accent}`}>
                <span>T{String(table.id).padStart(2, '0')}</span>
                <span className="flex items-center gap-1.5">
                    {table.prime && <span className="text-yuzu/85">★</span>}
                    {table.type}
                </span>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={table.status}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-0.5"
                >
                    <span className={`font-sans text-[12px] font-medium leading-tight tracking-tight ${v.text}`}>
                        {c.label}
                    </span>
                    <span className={`font-mono text-[9px] uppercase tracking-[0.18em] ${v.accent}`}>
                        {c.muted}
                    </span>
                </motion.div>
            </AnimatePresence>

            {/* Bottom accent line for locked_vip */}
            {table.status === 'locked_vip' && (
                <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-yuzu rounded-b-md origin-left"
                />
            )}
        </motion.div>
    );
}

/* ─── LEGEND ───────────────────────────────────────────────────────────── */

function Legend() {
    const items = [
        { color: 'bg-white/15',       label: 'Available'    },
        { color: 'bg-white/55',       label: 'Probing'      },
        { color: 'bg-rose-400/70',    label: 'Rejected'     },
        { color: 'bg-yuzu',           label: 'VIP locked'   },
    ];
    return (
        <div className="flex items-center gap-4 flex-wrap font-mono text-[8.5px] uppercase tracking-[0.22em] text-silver/45">
            {items.map((i) => (
                <span key={i.label} className="flex items-center gap-1.5">
                    <span className={`block w-1.5 h-1.5 rounded-full ${i.color}`} />
                    {i.label}
                </span>
            ))}
        </div>
    );
}
