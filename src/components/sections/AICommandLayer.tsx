import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * AICommandLayer — TapIn's signature section.
 *
 * Demonstrates the core differentiator: speak (or type) in natural language,
 * and TapIn's OS understands → confirms → acts. Rendered as a live terminal-
 * style card cycling through 5 real scenarios. Scenarios switch with the
 * active view (Guests vs Venues) so the same surface shows both sides of the
 * product.
 *
 * Each scenario plays in phases: typing (typewriter command) → thinking
 * (yuzu dot pulse) → response (line-by-line reveal) → visualisation (small
 * inline diagram of the action) → hold → exit → next.
 *
 * Built with framer-motion + custom timing. No new dependencies.
 */

/* ─── DATA ─────────────────────────────────────────────────────────────── */

type LineType = 'header' | 'detail' | 'check' | 'meta';
type VisualKind = 'reservation' | 'vipSeat' | 'walkin' | 'pushback' | 'topTable' | 'discovery' | 'taste' | 'remember';

interface ResponseLine { text: string; type: LineType; }

interface Scenario {
    id: string;
    label: string;
    command: string;
    thinkingMs: number;
    response: ResponseLine[];
    visual: VisualKind;
}

const VENUE_SCENARIOS: Scenario[] = [
    {
        id: 'reservation-move',
        label: 'Reservation move',
        command: "Move Marta's 20:00 table 04 reservation to 21:30",
        thinkingMs: 700,
        response: [
            { type: 'header', text: 'Confirmed' },
            { type: 'detail', text: 'Marta Solano · Party of 2' },
            { type: 'detail', text: 'Table 04 · 20:00 → 21:30' },
            { type: 'check',  text: 'SMS sent in her preferred language' },
        ],
        visual: 'reservation',
    },
    {
        id: 'vip-seat',
        label: 'VIP seating',
        command: 'VIP just arrived — where should I seat them?',
        thinkingMs: 850,
        response: [
            { type: 'header', text: 'Suggested · Table 09 (booth)' },
            { type: 'check',  text: 'Quiet corner · low-light · their preference' },
            { type: 'check',  text: 'Server Sofía · their usual' },
            { type: 'check',  text: 'Wine list pre-staged · 2018 Barolo flagged' },
        ],
        visual: 'vipSeat',
    },
    {
        id: 'walkin',
        label: 'Walk-in routing',
        command: 'Got 4 walk-ins waiting. Any table soon?',
        thinkingMs: 620,
        response: [
            { type: 'header', text: 'Table 11 frees in 4 min' },
            { type: 'detail', text: 'Current party finishing dessert' },
            { type: 'detail', text: 'Bar seating available now (alternative)' },
            { type: 'meta',   text: 'Estimated wait · 4 min' },
        ],
        visual: 'walkin',
    },
    {
        id: 'pushback',
        label: 'Service shift',
        command: "Push tonight's 22:00 reservations back 30 min",
        thinkingMs: 720,
        response: [
            { type: 'header', text: 'Done · 4 reservations notified' },
            { type: 'check',  text: 'All confirmed acceptance' },
            { type: 'check',  text: 'Service flow re-optimised' },
            { type: 'meta',   text: 'No table swaps required' },
        ],
        visual: 'pushback',
    },
    {
        id: 'top-table',
        label: 'Insight',
        command: "What's our top-performing table tonight?",
        thinkingMs: 580,
        response: [
            { type: 'header', text: 'Table 13 · booth' },
            { type: 'detail', text: '€420 revenue · 2.1× turn rate' },
            { type: 'check',  text: '2 VIP parties · 1 anniversary' },
            { type: 'meta',   text: 'Top across last 14 services' },
        ],
        visual: 'topTable',
    },
];

const GUEST_SCENARIOS: Scenario[] = [
    {
        id: 'discovery',
        label: 'Discover',
        command: 'Italian, intimate, near me, tonight at 20:30',
        thinkingMs: 720,
        response: [
            { type: 'header', text: '3 matches · all available' },
            { type: 'detail', text: 'Osteria Lumina · 94% taste match · 0.4 km' },
            { type: 'detail', text: 'Da Salvatore · 87% match · 0.9 km' },
            { type: 'detail', text: 'Sasso · 81% match · wine-forward · 1.2 km' },
        ],
        visual: 'discovery',
    },
    {
        id: 'reserve',
        label: 'Book',
        command: 'Book Osteria Lumina, table for 2, 20:30',
        thinkingMs: 600,
        response: [
            { type: 'header', text: 'Confirmed' },
            { type: 'detail', text: 'Osteria Lumina · Table 04 · 20:30' },
            { type: 'check',  text: 'Your usual wine pre-noted' },
            { type: 'check',  text: 'Calendar updated' },
        ],
        visual: 'reservation',
    },
    {
        id: 'mood',
        label: 'New for you',
        command: "I'm in the mood for something I haven't tried",
        thinkingMs: 820,
        response: [
            { type: 'header', text: 'New for you · 2 picks' },
            { type: 'detail', text: 'Nakamura · Omakase · 92% confidence' },
            { type: 'detail', text: 'Suriya · Thai · 87% confidence' },
            { type: 'meta',   text: 'Avoids 14 you have tried before' },
        ],
        visual: 'taste',
    },
    {
        id: 'group',
        label: 'Group',
        command: 'Where can 6 of us go tonight, near central?',
        thinkingMs: 700,
        response: [
            { type: 'header', text: '2 spots with 6-tops free' },
            { type: 'detail', text: 'Maison Verde · 21:00 · large booth' },
            { type: 'detail', text: 'El Corral · 22:00 · private round' },
            { type: 'check',  text: 'Both match the group preferences' },
        ],
        visual: 'discovery',
    },
    {
        id: 'remember',
        label: 'Memory',
        command: 'What did I have last time at Casa Marisol?',
        thinkingMs: 540,
        response: [
            { type: 'header', text: 'Your last visit · 3 weeks ago' },
            { type: 'detail', text: 'Mussels · Côtes du Rhône 2019' },
            { type: 'detail', text: 'Server Diego · table by the window' },
            { type: 'meta',   text: 'Recreate the visit?' },
        ],
        visual: 'remember',
    },
];

/* ─── PHASES ───────────────────────────────────────────────────────────── */

type Phase = 'typing' | 'thinking' | 'responding' | 'visualising' | 'holding' | 'exiting';

function wait(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

/* ─── COMPONENT ────────────────────────────────────────────────────────── */

export function AICommandLayer({ activeView = 'guests' as 'guests' | 'venues' }: { activeView?: 'guests' | 'venues' }) {
    const containerRef = useRef<HTMLElement>(null);
    const scenarios = activeView === 'venues' ? VENUE_SCENARIOS : GUEST_SCENARIOS;

    const [scenarioIdx, setScenarioIdx] = useState(0);
    const [phase, setPhase] = useState<Phase>('typing');
    const [typedChars, setTypedChars] = useState(0);
    const [revealedLines, setRevealedLines] = useState(0);
    const aliveRef = useRef<boolean>(true);

    /* Reset when activeView changes */
    useEffect(() => {
        const id = window.setTimeout(() => {
            setScenarioIdx(0);
            setPhase('typing');
            setTypedChars(0);
            setRevealedLines(0);
        }, 0);
        return () => window.clearTimeout(id);
    }, [activeView]);

    /* Playback loop — runs once per scenarioIdx change */
    useEffect(() => {
        aliveRef.current = true;
        const scenario = scenarios[scenarioIdx];
        if (!scenario) return;

        let cancelled = false;

        async function play() {
            // Reset state for new scenario
            setPhase('typing');
            setTypedChars(0);
            setRevealedLines(0);

            // 1. Typing — char by char with slight variance, longer on punctuation
            for (let i = 1; i <= scenario.command.length; i++) {
                const c = scenario.command[i - 1];
                const ms = c === ',' || c === '.' ? 120 : c === ' ' ? 50 : 30 + Math.random() * 25;
                await wait(ms);
                if (cancelled) return;
                setTypedChars(i);
            }
            await wait(360);
            if (cancelled) return;

            // 2. Thinking
            setPhase('thinking');
            await wait(scenario.thinkingMs);
            if (cancelled) return;

            // 3. Response reveal
            setPhase('responding');
            for (let i = 1; i <= scenario.response.length; i++) {
                await wait(260);
                if (cancelled) return;
                setRevealedLines(i);
            }
            await wait(280);
            if (cancelled) return;

            // 4. Visualisation
            setPhase('visualising');
            await wait(520);
            if (cancelled) return;

            // 5. Hold
            setPhase('holding');
            await wait(3400);
            if (cancelled) return;

            // 6. Exit + next
            setPhase('exiting');
            await wait(560);
            if (cancelled) return;
            setScenarioIdx((i) => (i + 1) % scenarios.length);
        }

        play();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scenarioIdx, activeView]);

    /* GSAP entrance for headline / terminal */
    useGSAP(() => {
        gsap.from('.aicl-eyebrow', {
            opacity: 0, y: 14, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        });
        gsap.from('.aicl-headline', {
            opacity: 0, y: 24, duration: 1.1, ease: 'power4.out', delay: 0.05,
            scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        });
        gsap.from('.aicl-sub', {
            opacity: 0, y: 12, duration: 0.9, ease: 'power3.out', delay: 0.2,
            scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        });
        gsap.from('.aicl-terminal', {
            opacity: 0, y: 30, scale: 0.98, duration: 1.2, ease: 'power4.out', delay: 0.3,
            scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        });
    }, { scope: containerRef });

    /* Manual scenario jump (clickable dots) */
    const jumpTo = useCallback((idx: number) => {
        if (idx === scenarioIdx) return;
        setScenarioIdx(idx);
    }, [scenarioIdx]);

    const scenario = scenarios[scenarioIdx];
    if (!scenario) return null;

    return (
        <section ref={containerRef} className="relative w-full py-32 md:py-40 px-6 overflow-hidden">
            {/* Ambient yuzu warmth — sits behind everything */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(204,255,0,0.025)_0%,transparent_60%)]" />

            <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center gap-12">
                {/* Eyebrow */}
                <span className="aicl-eyebrow inline-flex items-center gap-3 font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-yuzu/80">
                    <span className="block w-8 h-px bg-yuzu/40" />
                    Sentient Command Layer
                    <span className="block w-8 h-px bg-yuzu/40" />
                </span>

                {/* Headline */}
                <h2 className="aicl-headline font-serif italic text-4xl md:text-6xl lg:text-7xl text-silver/90 leading-[1.04] tracking-tight text-center max-w-4xl">
                    {activeView === 'venues'
                        ? <>Talk to your <span className="text-yuzu">venue</span>.</>
                        : <>Talk to your <span className="text-yuzu">night</span>.</>}
                </h2>

                {/* Subtitle */}
                <p className="aicl-sub font-sans text-base md:text-lg text-silver/65 max-w-2xl text-center leading-relaxed">
                    {activeView === 'venues'
                        ? 'No menus, no clicks. Speak in plain words. TapIn understands the intent, confirms in human language, and acts across the floor — in real time.'
                        : 'No apps to learn, no forms to fill. Speak in plain words. TapIn knows you, finds the place, books the table, remembers the wine.'}
                </p>

                {/* Terminal */}
                <Terminal
                    scenario={scenario}
                    phase={phase}
                    typedChars={typedChars}
                    revealedLines={revealedLines}
                />

                {/* Scenario navigator */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                    {scenarios.map((s, i) => (
                        <button
                            key={s.id}
                            onClick={() => jumpTo(i)}
                            aria-label={`Show scenario: ${s.label}`}
                            className={`group relative flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 overflow-hidden ${
                                i === scenarioIdx
                                    ? 'border-yuzu/40 bg-yuzu/[0.08] text-yuzu shadow-[0_0_20px_rgba(204,255,0,0.15),inset_0_1px_5px_rgba(204,255,0,0.2)]'
                                    : 'border-white/10 bg-black/40 text-silver/45 hover:border-yuzu/30 hover:text-silver/75 hover:bg-yuzu/[0.02] shadow-[0_5px_15px_rgba(0,0,0,0.3)]'
                            }`}
                        >
                            {/* Glass reflection */}
                            <div className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-b from-white/[0.08] to-transparent opacity-50" />
                            <span className={`relative z-10 block w-1.5 h-1.5 rounded-full ${i === scenarioIdx ? 'bg-yuzu shadow-[0_0_8px_rgba(204,255,0,0.8)]' : 'bg-silver/30 group-hover:bg-yuzu/60'}`} />
                            <span className="relative z-10 font-mono text-[10px] font-medium uppercase tracking-[0.2em]">{s.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── TERMINAL ─────────────────────────────────────────────────────────── */

function Terminal({
    scenario,
    phase,
    typedChars,
    revealedLines,
}: {
    scenario: Scenario;
    phase: Phase;
    typedChars: number;
    revealedLines: number;
}) {
    const visibleCommand = scenario.command.slice(0, typedChars);
    const showCursor = phase === 'typing' || phase === 'thinking';
    const visibleResponse = scenario.response.slice(0, revealedLines);
    const showVisual = phase === 'visualising' || phase === 'holding';
    const fadingOut = phase === 'exiting';

    return (
        <motion.div
            className="aicl-terminal relative w-full max-w-3xl"
            animate={{ opacity: fadingOut ? 0.2 : 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="relative bg-[#0A0A0A]/95 backdrop-blur-md border border-white/12 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_28px_rgba(204,255,0,0.05)] overflow-hidden">
                {/* Terminal header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8 bg-white/[0.02]">
                    <div className="flex items-center gap-1.5">
                        <span className="block w-2 h-2 rounded-full bg-white/20" />
                        <span className="block w-2 h-2 rounded-full bg-white/15" />
                        <span className="block w-2 h-2 rounded-full bg-white/10" />
                    </div>
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-silver/55">
                        TapIn OS · Sentient Command
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="relative flex w-1.5 h-1.5">
                            <span className="absolute inset-0 rounded-full bg-yuzu animate-ping opacity-75" />
                            <span className="relative w-1.5 h-1.5 rounded-full bg-yuzu" />
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-yuzu/75">Live</span>
                    </span>
                </div>

                {/* Terminal body */}
                <div className="px-6 py-7 min-h-[280px]">
                    {/* Prompt + command */}
                    <div className="flex items-baseline gap-3">
                        <span className="font-mono text-yuzu/85 text-sm leading-none select-none">›</span>
                        <span className="font-mono text-sm md:text-[15px] text-white/95 leading-snug">
                            {visibleCommand}
                            {showCursor && (
                                <span className="inline-block w-[8px] h-[16px] -mb-[2px] ml-[1px] bg-yuzu/85 animate-pulse align-middle" />
                            )}
                        </span>
                    </div>

                    {/* Thinking */}
                    <AnimatePresence>
                        {phase === 'thinking' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="flex items-center gap-2 mt-5 pl-7"
                            >
                                <ThinkingDots />
                                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver/45">
                                    parsing intent
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Response */}
                    <AnimatePresence>
                        {(phase === 'responding' || phase === 'visualising' || phase === 'holding') && (
                            <motion.div
                                key={`response-${scenario.id}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-5 pl-7 flex flex-col gap-1.5"
                            >
                                {visibleResponse.map((line, idx) => (
                                    <motion.div
                                        key={`${scenario.id}-${idx}`}
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                                        className="flex items-start gap-2.5"
                                    >
                                        <LineMarker type={line.type} />
                                        <span className={lineClass(line.type)}>{line.text}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Visualisation */}
                    <AnimatePresence>
                        {showVisual && (
                            <motion.div
                                key={`vis-${scenario.id}`}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                className="mt-6 ml-7 mr-1 p-4 rounded-md border border-white/8 bg-white/[0.02]"
                            >
                                <Visualisation kind={scenario.visual} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

/* ─── LINE STYLES ──────────────────────────────────────────────────────── */

function LineMarker({ type }: { type: LineType }) {
    if (type === 'header') {
        return (
            <span className="font-mono text-yuzu/95 text-[13px] leading-snug select-none mt-[1px]">✓</span>
        );
    }
    if (type === 'check') {
        return (
            <span className="font-mono text-yuzu/85 text-[12px] leading-snug select-none mt-[2px]">·</span>
        );
    }
    if (type === 'meta') {
        return (
            <span className="font-mono text-silver/40 text-[12px] leading-snug select-none mt-[2px]">›</span>
        );
    }
    return <span className="block w-1.5 h-1.5 rounded-full bg-white/25 mt-[8px]" />;
}

function lineClass(type: LineType): string {
    switch (type) {
        case 'header': return 'font-sans text-[14px] font-medium text-yuzu/95 leading-snug tracking-tight';
        case 'check':  return 'font-sans text-[12.5px] text-silver/85 leading-snug';
        case 'meta':   return 'font-mono text-[11.5px] text-silver/50 leading-snug italic';
        case 'detail':
        default:       return 'font-sans text-[13px] text-white/85 leading-snug tracking-tight';
    }
}

/* ─── THINKING DOTS ────────────────────────────────────────────────────── */

function ThinkingDots() {
    return (
        <span className="inline-flex items-center gap-1">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="block w-1.5 h-1.5 rounded-full bg-yuzu"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
                    transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.18,
                    }}
                />
            ))}
        </span>
    );
}

/* ─── VISUALISATIONS ───────────────────────────────────────────────────── */

function Visualisation({ kind }: { kind: VisualKind }) {
    switch (kind) {
        case 'reservation': return <ReservationViz />;
        case 'vipSeat':     return <VipSeatViz />;
        case 'walkin':      return <WalkinViz />;
        case 'pushback':    return <PushbackViz />;
        case 'topTable':    return <TopTableViz />;
        case 'discovery':   return <DiscoveryViz />;
        case 'taste':       return <TasteViz />;
        case 'remember':    return <RememberViz />;
    }
}

/* Reservation move — timeline with old time crossed out, new time highlighted */
function ReservationViz() {
    return (
        <div className="flex items-center gap-3 font-mono text-[11px] text-silver/70">
            <span className="text-silver/35 line-through">20:00</span>
            <svg width="36" height="10" viewBox="0 0 36 10" className="text-yuzu">
                <line x1="0" y1="5" x2="30" y2="5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
                <path d="M 28 1 L 34 5 L 28 9" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </svg>
            <span className="text-yuzu/95 font-semibold tracking-wider">21:30</span>
            <span className="ml-auto text-silver/40">Table 04 · Party of 2</span>
        </div>
    );
}

/* VIP seat suggestion — mini floor plan with one table highlighted */
function VipSeatViz() {
    const tables = [
        { x: 14, y: 14, w: 18, h: 14, id: 1 },
        { x: 44, y: 14, r: 8, id: 2 },
        { x: 74, y: 14, w: 18, h: 14, id: 3 },
        { x: 104, y: 14, r: 8, id: 4 },
        { x: 134, y: 14, w: 18, h: 14, id: 5 },
        { x: 14, y: 44, r: 8, id: 6 },
        { x: 44, y: 44, w: 18, h: 14, id: 7 },
        { x: 74, y: 44, r: 8, id: 8 },
        { x: 104, y: 44, w: 22, h: 14, id: 9 }, // booth — highlighted
        { x: 138, y: 44, r: 7, id: 10 },
    ];
    return (
        <div className="flex items-center gap-4">
            <svg width="170" height="64" viewBox="0 0 170 64">
                {tables.map((t) => {
                    const active = t.id === 9;
                    const fill = active ? 'rgba(204,255,0,0.85)' : 'transparent';
                    const stroke = active ? 'rgba(204,255,0,1)' : 'rgba(255,255,255,0.30)';
                    if ('r' in t) {
                        return <circle key={t.id} cx={t.x} cy={t.y + 4} r={t.r} fill={fill} stroke={stroke} strokeWidth="1" />;
                    }
                    return <rect key={t.id} x={t.x} y={t.y} width={t.w} height={t.h} rx="1.5" fill={fill} stroke={stroke} strokeWidth="1" />;
                })}
                <text x="115" y="55" fontSize="7" fontFamily="monospace" fill="rgba(204,255,0,0.95)" textAnchor="middle">T09</text>
            </svg>
            <div className="flex flex-col gap-0.5">
                <span className="font-sans text-[11px] text-yuzu/90 font-medium">Booth · quiet zone</span>
                <span className="font-mono text-[10px] text-silver/50">Match score · 96%</span>
            </div>
        </div>
    );
}

/* Walk-in routing — timeline showing 4 walk-ins and when they get seated */
function WalkinViz() {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-mono text-[10px] text-silver/45 uppercase tracking-wider">
                <span>Now</span>
                <span className="flex-1 h-px bg-white/8" />
                <span className="text-yuzu/80">+4 min</span>
                <span className="flex-1 h-px bg-white/8" />
                <span>+8 min</span>
            </div>
            <div className="flex items-center gap-2 text-[10.5px]">
                <span className="font-mono text-silver/65">●●●● <span className="text-silver/40">walk-ins</span></span>
                <span className="ml-auto inline-flex items-center gap-1.5">
                    <span className="font-mono text-yuzu/85">T11</span>
                    <span className="font-mono text-silver/45">freed · seated</span>
                </span>
            </div>
        </div>
    );
}

/* Pushback — 4 reservation chips shifting right by 30 minutes */
function PushbackViz() {
    const slots = [
        { id: 'r1', old: '22:00', new: '22:30', who: 'Rivera · 4' },
        { id: 'r2', old: '22:00', new: '22:30', who: 'Soler · 2' },
        { id: 'r3', old: '22:00', new: '22:30', who: 'Costa · 6' },
        { id: 'r4', old: '22:00', new: '22:30', who: 'Lien · 2' },
    ];
    return (
        <div className="flex flex-wrap gap-2">
            {slots.map((s) => (
                <div key={s.id} className="flex items-center gap-1.5 px-2 py-1 bg-yuzu/[0.08] border border-yuzu/25 rounded">
                    <span className="font-mono text-[10px] text-silver/50 line-through">{s.old}</span>
                    <span className="font-mono text-[10px] text-yuzu/90 font-semibold">{s.new}</span>
                    <span className="font-sans text-[10px] text-white/80">{s.who}</span>
                </div>
            ))}
        </div>
    );
}

/* Top table — small ranked bar chart of tables by revenue */
function TopTableViz() {
    const data = [
        { id: 13, val: 100, label: '€420' },
        { id: 9,  val: 78,  label: '€330' },
        { id: 4,  val: 68,  label: '€285' },
        { id: 11, val: 60,  label: '€252' },
        { id: 7,  val: 52,  label: '€220' },
    ];
    return (
        <div className="flex items-end gap-3 h-[68px]">
            {data.map((d, i) => (
                <div key={d.id} className="flex flex-col items-center gap-1">
                    <span className={`font-mono text-[9px] ${i === 0 ? 'text-yuzu/95' : 'text-silver/40'}`}>{d.label}</span>
                    <span
                        className="block w-6 rounded-sm"
                        style={{
                            height: `${d.val * 0.42}px`,
                            background: i === 0
                                ? 'rgba(204,255,0,0.90)'
                                : `rgba(204,255,0,${0.18 + (1 - i / data.length) * 0.18})`,
                            boxShadow: i === 0 ? '0 0 12px rgba(204,255,0,0.4)' : 'none',
                        }}
                    />
                    <span className={`font-mono text-[9px] ${i === 0 ? 'text-yuzu/85' : 'text-silver/35'}`}>T{String(d.id).padStart(2, '0')}</span>
                </div>
            ))}
        </div>
    );
}

/* Discovery — 3 mini venue cards stacked */
function DiscoveryViz() {
    const matches = [
        { name: 'Osteria Lumina', cuisine: 'Italian',   pct: 94, dist: '0.4 km' },
        { name: 'Da Salvatore',   cuisine: 'Trattoria', pct: 87, dist: '0.9 km' },
        { name: 'Sasso',          cuisine: 'Wine Bar',  pct: 81, dist: '1.2 km' },
    ];
    return (
        <div className="flex flex-col gap-1.5">
            {matches.map((m, i) => (
                <div key={m.name} className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-silver/40 w-3">{i + 1}</span>
                    <span className="font-serif italic text-[12.5px] text-white/90 flex-shrink-0">{m.name}</span>
                    <span className="font-sans italic text-[10px] text-silver/45">{m.cuisine}</span>
                    <span className="ml-auto flex items-center gap-3">
                        <span className="font-mono text-[10px] text-silver/55">{m.dist}</span>
                        <span className="font-mono text-[10.5px] text-yuzu/90 font-semibold">{m.pct}%</span>
                    </span>
                </div>
            ))}
        </div>
    );
}

/* Taste — two mini comparison bars */
function TasteViz() {
    return (
        <div className="flex items-center gap-6">
            <RadialGauge value={92} label="Nakamura" />
            <RadialGauge value={87} label="Suriya" />
            <span className="font-mono text-[10px] text-silver/45 leading-relaxed ml-auto max-w-[160px]">
                Avoids 14 venues<br />you have tried before
            </span>
        </div>
    );
}

function RadialGauge({ value, label }: { value: number; label: string }) {
    const r = 14;
    const c = 2 * Math.PI * r;
    const off = c - (value / 100) * c;
    return (
        <div className="flex items-center gap-2">
            <svg width="36" height="36" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="2.2" />
                <circle
                    cx="18" cy="18" r={r}
                    fill="none"
                    stroke="rgb(204,255,0)"
                    strokeWidth="2.2"
                    strokeDasharray={c}
                    strokeDashoffset={off}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                />
                <text x="18" y="22.5" textAnchor="middle" fill="white" fontSize="10" fontWeight="600" fontFamily="sans-serif">{value}</text>
            </svg>
            <span className="font-serif italic text-[12px] text-white/85">{label}</span>
        </div>
    );
}

/* Remember — mini visit recap */
function RememberViz() {
    return (
        <div className="flex items-center gap-3 font-sans text-[11px]">
            <div className="flex flex-col gap-0.5">
                <span className="text-yuzu/90 font-medium">Mussels marinière</span>
                <span className="text-silver/55">Côtes du Rhône 2019 · 2 glasses</span>
            </div>
            <span className="w-px h-8 bg-white/8 mx-1" />
            <div className="flex flex-col gap-0.5">
                <span className="text-white/85 font-medium">Server Diego</span>
                <span className="text-silver/55">Window table · 2h 14m dwell</span>
            </div>
        </div>
    );
}
