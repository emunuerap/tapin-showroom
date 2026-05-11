import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TetrisAgentSimulator } from '../ui/TetrisAgentSimulator';

gsap.registerPlugin(ScrollTrigger);

/**
 * IAFloorShuffler — Venues section.
 *
 * Unified version: the Tetris Agent (floor optimisation simulator) and the
 * Sentiment Typewriter (live signal stream) are presented as ONE control
 * cockpit — two panels of the same console — rather than two disconnected
 * blocks. The narrative is: TapIn watches the floor (Sentiment) AND acts on
 * it (Tetris). One brain, two surfaces.
 */

interface TickerEntry { id: string; time: string; text: string; tone: 'normal' | 'yuzu'; }

const TICKER_LINES: Omit<TickerEntry, 'id' | 'time'>[] = [
    { text: 'VIP detected at host stand · routing to T09', tone: 'yuzu'   },
    { text: 'Gratitude signal · Table 04 · sentiment +0.32', tone: 'normal' },
    { text: 'Walk-in arrived · 4-top · expected wait 4m',   tone: 'yuzu'   },
    { text: 'Course pacing slow at T13 · prompting server', tone: 'normal' },
    { text: 'Re-optimisation cycle · +15% RevPASH today',   tone: 'yuzu'   },
    { text: 'Table 07 freeing in 6m · pre-staged',          tone: 'normal' },
    { text: 'No-show detected · auto-released T11',         tone: 'yuzu'   },
    { text: 'Dwell time within optimal band · 92% covers',  tone: 'normal' },
];

function fmtTime(date: Date): string {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}

export function IAFloorShuffler() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [entries, setEntries] = useState<TickerEntry[]>([]);
    const cursorRef = useRef(0);
    const idRef = useRef(0);

    /* Live ticker — push a new entry every 3-5 seconds, keep max 6 visible */
    useEffect(() => {
        let alive = true;

        function pushOne() {
            const tpl = TICKER_LINES[cursorRef.current % TICKER_LINES.length];
            cursorRef.current += 1;
            idRef.current += 1;
            // Capture the id + time NOW, outside the updater. Otherwise React
            // batches multiple pushOne calls and all updaters read the SAME
            // (final) value of idRef.current, producing duplicate keys.
            const id = `e${idRef.current}`;
            const time = fmtTime(new Date());
            setEntries((prev) => {
                const next = [...prev, { ...tpl, id, time }];
                return next.slice(-6);
            });
        }

        // Seed with 3 entries so the panel isn't empty on load
        pushOne(); pushOne(); pushOne();

        const tick = () => {
            if (!alive) return;
            pushOne();
            const next = 3000 + Math.random() * 2000;
            setTimeout(tick, next);
        };
        const initial = setTimeout(tick, 3500);

        return () => { alive = false; clearTimeout(initial); };
    }, []);

    useGSAP(() => {
        gsap.from('.floor-eyebrow', {
            opacity: 0, y: 14, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.floor-headline', {
            opacity: 0, y: 24, duration: 1.1, ease: 'power4.out', delay: 0.05,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.floor-sub', {
            opacity: 0, y: 12, duration: 0.9, ease: 'power3.out', delay: 0.2,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.floor-cockpit', {
            opacity: 0, y: 28, scale: 0.98, duration: 1.2, ease: 'power4.out', delay: 0.3,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className="relative w-full py-24 md:py-28 px-6 max-w-7xl mx-auto flex flex-col bg-transparent"
        >
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-6 mb-12">
                <span className="floor-eyebrow inline-flex items-center gap-3 font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-yuzu/80">
                    <span className="block w-8 h-px bg-yuzu/40" />
                    Module · Floor Intelligence
                    <span className="block w-8 h-px bg-yuzu/40" />
                </span>
                <h2 className="floor-headline font-serif italic text-4xl md:text-6xl lg:text-7xl text-silver/90 leading-[1.04] tracking-tight max-w-3xl">
                    The room watches itself.
                </h2>
                <p className="floor-sub font-sans text-base md:text-lg text-silver/65 max-w-2xl leading-relaxed">
                    Two surfaces of the same brain. On the left: the agent that watches every signal — VIP arrivals, sentiment, pacing, walk-ins. On the right: the optimiser that decides where each party belongs.
                </p>
            </div>

            {/* Unified cockpit — left: sentiment stream · right: Tetris agent */}
            <div className="floor-cockpit grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-4 lg:gap-5 bg-[#0A0A0A]/82 backdrop-blur-md border border-white/12 rounded-2xl p-4 lg:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.55),0_0_24px_rgba(204,255,0,0.04)]">
                {/* Left panel — Sentiment Stream */}
                <SentimentPanel entries={entries} />

                {/* Right panel — Tetris Agent simulator */}
                <div className="rounded-xl border border-white/8 bg-[#070707] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8 bg-white/[0.02]">
                        <div className="flex items-center gap-1.5">
                            <span className="block w-2 h-2 rounded-full bg-white/20" />
                            <span className="block w-2 h-2 rounded-full bg-white/15" />
                            <span className="block w-2 h-2 rounded-full bg-white/10" />
                        </div>
                        <span className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-silver/55">
                            Tetris Agent · Floor Optimiser
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="relative flex w-1.5 h-1.5">
                                <span className="absolute inset-0 rounded-full bg-yuzu animate-ping opacity-75" />
                                <span className="relative w-1.5 h-1.5 rounded-full bg-yuzu" />
                            </span>
                            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-yuzu/75">Live</span>
                        </span>
                    </div>
                    <div className="p-4 lg:p-5">
                        <TetrisAgentSimulator />
                    </div>
                </div>
            </div>

            {/* Subtle context line under the cockpit */}
            <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-silver/35">
                One cycle · sense → decide → act · every 3 seconds
            </p>
        </section>
    );
}

/* ─── SENTIMENT PANEL ──────────────────────────────────────────────────── */

function SentimentPanel({ entries }: { entries: TickerEntry[] }) {
    return (
        <div className="rounded-xl border border-white/8 bg-[#070707] overflow-hidden flex flex-col">
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8 bg-white/[0.02]">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-silver/55">
                    Sentiment Stream
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-silver/45">
                    Last · 6
                </span>
            </div>
            {/* Entries */}
            <ul className="flex-1 px-4 py-4 flex flex-col gap-2 min-h-[260px]">
                <AnimatePresence initial={false}>
                    {entries.map((e) => (
                        <motion.li
                            key={e.id}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="flex items-baseline gap-2.5 leading-snug"
                        >
                            <span className="font-mono text-[9.5px] text-silver/35 tabular-nums shrink-0 w-[58px]">
                                {e.time}
                            </span>
                            <span className={`shrink-0 mt-1 block w-1 h-1 rounded-full ${e.tone === 'yuzu' ? 'bg-yuzu shadow-[0_0_4px_rgba(204,255,0,0.6)]' : 'bg-silver/35'}`} />
                            <span className={`font-sans text-[11.5px] tracking-tight leading-snug ${e.tone === 'yuzu' ? 'text-yuzu/95' : 'text-silver/85'}`}>
                                {e.text}
                            </span>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
            {/* Footer — RevPASH live ticker */}
            <div className="border-t border-white/8 bg-white/[0.02] px-4 py-2.5 flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-silver/45">
                    RevPASH · tonight
                </span>
                <motion.span
                    className="font-serif italic text-[16px] text-yuzu/95 leading-none tracking-tight"
                    animate={{ opacity: [0.85, 1, 0.85] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                    +18%
                </motion.span>
            </div>
        </div>
    );
}
