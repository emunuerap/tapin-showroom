import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface IntroSequenceProps {
    onComplete: () => void;
}

// Cinematic ease (easeOutExpo-like)
const customEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Total duration target: ~8.0s. Pacing prioritizes presence over speed —
// continuous motion during holds prevents "dead time" feel.
const T = {
    signal:        { in: 0.10, out: 1.10 },
    welcome:       { in: 1.00, out: 2.80 }, // 1.8s — letter-spacing reveal + hold
    expecting:     { in: 3.00, out: 5.10 }, // 2.1s — word-stagger reveal + hold
    wordmarkIn:    5.20,
    wordmarkRise:  6.60,
    statementIn:   7.20,
    statementUL:   7.55,
    finish:        8.10,
};

// Words for staggered reveal
const EXPECTING_WORDS = ["We've", 'been', 'expecting', 'you.'];

// Reusable yuzu-glow shadow for the dot
const DOT_SHADOW =
    'shadow-[0_0_14px_3px_rgba(204,255,0,0.55),0_0_36px_8px_rgba(204,255,0,0.18)]';

export function IntroSequence({ onComplete }: IntroSequenceProps) {
    const [isReducedMotion, setIsReducedMotion] = useState(() =>
        typeof window !== 'undefined'
            ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
            : false
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
        mq.addEventListener('change', listener);
        return () => mq.removeEventListener('change', listener);
    }, []);

    const skipIntro = useCallback(() => onComplete(), [onComplete]);

    // Skip on interaction
    useEffect(() => {
        const handle = (e: Event) => {
            if (e.type === 'keydown') {
                const k = (e as KeyboardEvent).key;
                if (k !== 'Enter' && k !== 'Escape' && k !== ' ') return;
            }
            skipIntro();
        };
        window.addEventListener('wheel', handle, { once: true });
        window.addEventListener('touchstart', handle, { once: true });
        window.addEventListener('keydown', handle);
        return () => {
            window.removeEventListener('wheel', handle);
            window.removeEventListener('touchstart', handle);
            window.removeEventListener('keydown', handle);
        };
    }, [skipIntro]);

    // Auto-complete timer
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const ms = isReducedMotion ? 1500 : T.finish * 1000;
        const t = window.setTimeout(onComplete, ms);
        return () => window.clearTimeout(t);
    }, [isReducedMotion, onComplete]);

    return (
        <motion.div
            key="intro-sequence"
            exit={{
                opacity: 0,
                scale: 2.5,
                filter: 'blur(10px)',
                transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] }, // Cinematic ease-in-out
            }}
            style={{ transformOrigin: 'center center' }}
            className="fixed inset-0 z-[99999] bg-[#050505] overflow-hidden"
        >
            {/* Ambient radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.025)_0%,transparent_60%)] pointer-events-none" />

            {/* Grain */}
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
                }}
            />

            {!isReducedMotion ? (
                <>
                    {/* PHASE 1 — Signal line sweep */}
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: '100vw', opacity: [0, 0.5, 0] }}
                        transition={{
                            delay: T.signal.in,
                            duration: T.signal.out - T.signal.in,
                            ease: customEase,
                        }}
                        className="absolute top-1/2 left-0 -translate-y-1/2 h-px bg-yuzu shadow-[0_0_15px_rgba(204,255,0,0.5)]"
                    />

                    {/* PHASE 2 — Pre-brand phrase: "Welcome."
                        Letter-spacing + blur reveal, continuous gentle float during hold,
                        breath-line below for rhythm. */}
                    <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 1, 0] }}
                        transition={{
                            delay: T.welcome.in,
                            duration: T.welcome.out - T.welcome.in,
                            times: [0, 0.16, 0.86, 1],
                            ease: customEase,
                        }}
                    >
                        <motion.span
                            initial={{ letterSpacing: '0.15em', filter: 'blur(8px)', y: 4 }}
                            animate={{
                                letterSpacing: ['0.15em', '0em', '0em', '0.02em'],
                                filter: ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(4px)'],
                                y: [4, 0, -2, -6],
                            }}
                            transition={{
                                delay: T.welcome.in,
                                duration: T.welcome.out - T.welcome.in,
                                times: [0, 0.32, 0.82, 1],
                                ease: customEase,
                            }}
                            className="font-serif italic text-4xl md:text-6xl text-white/90 tracking-tight inline-block"
                        >
                            Welcome.
                        </motion.span>
                        {/* Breath line */}
                        <motion.span
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{
                                scaleX: [0, 1, 1, 0],
                                opacity: [0, 0.6, 0.6, 0],
                            }}
                            transition={{
                                delay: T.welcome.in + 0.25,
                                duration: T.welcome.out - T.welcome.in - 0.35,
                                times: [0, 0.32, 0.78, 1],
                                ease: customEase,
                            }}
                            className="block h-px w-24 md:w-32 bg-yuzu/60 origin-center mt-5 shadow-[0_0_8px_rgba(204,255,0,0.4)]"
                        />
                    </motion.div>

                    {/* PHASE 3 — "We've been expecting you." with word-by-word stagger
                        Parent controls fade-in/hold/fade-out; words reveal individually. */}
                    <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 1, 0] }}
                        transition={{
                            delay: T.expecting.in,
                            duration: T.expecting.out - T.expecting.in,
                            times: [0, 0.05, 0.85, 1],
                            ease: customEase,
                        }}
                    >
                        <h2 className="font-serif italic text-2xl md:text-4xl text-silver/95 tracking-tight flex flex-wrap justify-center gap-x-[0.35em]">
                            {EXPECTING_WORDS.map((word, i) => (
                                <motion.span
                                    key={word + i}
                                    initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                                    animate={{
                                        opacity: [0, 1, 1, 0],
                                        y: [10, 0, -2, -6],
                                        filter: ['blur(6px)', 'blur(0px)', 'blur(0px)', 'blur(4px)'],
                                    }}
                                    transition={{
                                        delay: T.expecting.in + 0.18 + i * 0.11,
                                        duration: T.expecting.out - T.expecting.in - 0.18 - i * 0.11,
                                        times: [0, 0.18, 0.78, 1],
                                        ease: customEase,
                                    }}
                                    className="inline-block"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </h2>
                        {/* Breath line */}
                        <motion.span
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{
                                scaleX: [0, 1, 1, 0],
                                opacity: [0, 0.55, 0.55, 0],
                            }}
                            transition={{
                                delay: T.expecting.in + 0.55,
                                duration: T.expecting.out - T.expecting.in - 0.65,
                                times: [0, 0.30, 0.78, 1],
                                ease: customEase,
                            }}
                            className="block h-px w-32 md:w-44 bg-yuzu/50 origin-center mt-5 shadow-[0_0_8px_rgba(204,255,0,0.35)]"
                        />
                    </motion.div>

                    {/* PHASE 4 + 5 — Wordmark: reveal at center, then glide up.
                        Outer wrapper handles vertical centering via CSS; inner motion handles px offset. */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                        className="flex flex-col items-center"
                        initial={{ y: 0, opacity: 0, scale: 0.97, filter: 'blur(10px)' }}
                        animate={{
                            // 4 keyframes: fade-in fast, hold, glide up
                            y: [0, 0, 0, -120],
                            opacity: [0, 1, 1, 1],
                            scale: [0.97, 1, 1, 1],
                            filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'],
                        }}
                        transition={{
                            delay: T.wordmarkIn,
                            duration: T.statementIn - T.wordmarkIn, // 2.0s
                            times: [
                                0,
                                0.30, // fade-in done at ~0.6s
                                (T.wordmarkRise - T.wordmarkIn) / (T.statementIn - T.wordmarkIn), // ~0.7
                                1,
                            ],
                            ease: customEase,
                        }}
                    >
                        {/* TapIn● — flex items-baseline so the dot sits on the typographic baseline */}
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-silver flex items-baseline leading-none">
                            <span>TapIn</span>
                            <motion.span
                                aria-hidden="true"
                                initial={{ opacity: 0, scale: 0.4 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    delay: T.wordmarkIn + 0.45,
                                    duration: 0.5,
                                    ease: customEase,
                                }}
                                className={`ml-2 md:ml-3 inline-block w-[0.16em] h-[0.16em] rounded-full bg-yuzu ${DOT_SHADOW}`}
                            />
                        </h1>

                        {/* Tagline */}
                        <motion.span
                            initial={{ opacity: 0, letterSpacing: '0.1em', y: -4 }}
                            animate={{ opacity: 0.6, letterSpacing: '0.4em', y: 0 }}
                            transition={{
                                delay: T.wordmarkIn + 0.7,
                                duration: 0.9,
                                ease: customEase,
                            }}
                            className="font-sans text-[11px] md:text-xs uppercase text-silver mt-4 ml-[0.4em]"
                        >
                            The Hospitality OS
                        </motion.span>
                    </motion.div>
                    </div>

                    {/* PHASE 6 — Statement at lower third */}
                    <motion.div
                        className="absolute inset-x-0 bottom-[28%] md:bottom-[30%] flex items-center justify-center pointer-events-none"
                        initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{
                            delay: T.statementIn,
                            duration: 0.75,
                            ease: customEase,
                        }}
                    >
                        <h2 className="text-2xl md:text-4xl font-serif italic text-white flex flex-wrap items-baseline justify-center gap-x-3">
                            <span className="text-silver/45">Don't call.</span>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    delay: T.statementIn + 0.25,
                                    duration: 0.55,
                                    ease: customEase,
                                }}
                                className="relative inline-block"
                            >
                                Just TapIn.
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{
                                        delay: T.statementUL,
                                        duration: 0.55,
                                        ease: customEase,
                                    }}
                                    className="absolute -bottom-1 left-0 right-0 h-px bg-yuzu origin-left shadow-[0_0_8px_rgba(204,255,0,0.5)]"
                                />
                            </motion.span>
                        </h2>
                    </motion.div>

                    {/* Skip button — appears after first second so it doesn't fight the opening */}
                    <motion.button
                        onClick={skipIntro}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                        className="absolute bottom-8 right-8 font-mono text-[10px] uppercase tracking-[0.3em] text-silver/40 hover:text-yuzu transition-colors duration-300 z-50 cursor-pointer p-4 -m-4"
                    >
                        Skip
                    </motion.button>
                </>
            ) : (
                /* REDUCED MOTION VERSION */
                <div className="absolute inset-0 grid place-items-center w-full h-full">
                    <div className="flex flex-col items-center">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-silver flex items-baseline leading-none">
                            <span>TapIn</span>
                            <span
                                aria-hidden="true"
                                className={`ml-2 md:ml-3 inline-block w-[0.16em] h-[0.16em] rounded-full bg-yuzu ${DOT_SHADOW}`}
                            />
                        </h1>
                        <span className="font-sans text-[11px] tracking-[0.4em] uppercase text-silver/60 mt-4 block ml-[0.4em]">
                            The Hospitality OS
                        </span>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
