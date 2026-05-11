import { useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ConsumerAppShowcase — "The Gastronomic Passport".
 *
 * REWRITTEN to separate concerns: this section is about IDENTITY (the
 * passport — who you are, your taste signature, the venues you've visited).
 * The post-visit payment / gratitude moment lives in GratitudeLoop. They
 * are different chapters of the journey and shouldn't share a visual.
 *
 * Visual: a passport-style card on the right, with header, sigil, owner row,
 * cuisine affinity bars, recent stamps, and a cryptographic signature. On
 * the left: copy explaining what the Passport actually is.
 */

export function ConsumerAppShowcase() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from('.passport-copy > *', {
            opacity: 0, y: 18, duration: 0.95, ease: 'power4.out', stagger: 0.1,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.passport-card', {
            opacity: 0, y: 28, scale: 0.97, duration: 1.2, ease: 'power4.out', delay: 0.15,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative w-full py-24 md:py-28 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-20 items-center">
                {/* Left — copy */}
                <div className="passport-copy flex flex-col gap-6 lg:gap-7 text-center lg:text-left">
                    <span className="inline-flex items-center gap-3 self-center lg:self-start font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-yuzu/80">
                        <span className="block w-8 h-px bg-yuzu/40" />
                        Module · Identity
                    </span>
                    <h2 className="font-serif italic text-4xl md:text-6xl text-silver/90 leading-[1.04] tracking-tight">
                        The Gastronomic
                        <br />
                        <span className="text-yuzu">Passport.</span>
                    </h2>
                    <p className="font-sans text-base md:text-lg text-silver/65 leading-relaxed max-w-xl mx-auto lg:mx-0">
                        One cryptographic identity that travels with you. Your phone number is the passport. Every venue recognises you instantly — no app to download, no profile to set up, no card to remember.
                    </p>

                    <ul className="flex flex-col gap-3 mt-2 max-w-xl mx-auto lg:mx-0">
                        <Feature
                            label="Cryptographic identity"
                            body="Owned by you. Verified by venues. Never owned by an intermediary."
                        />
                        <Feature
                            label="Taste Genome on board"
                            body="Your preferences, allergies, and rhythm — pre-shared (with consent) when you arrive."
                        />
                        <Feature
                            label="One protocol, every venue"
                            body="From a Michelin counter to a corner trattoria — the same passport, the same recognition."
                        />
                    </ul>
                </div>

                {/* Right — passport card */}
                <div className="passport-card flex justify-center lg:justify-end">
                    <PassportCard />
                </div>
            </div>
        </section>
    );
}

function Feature({ label, body }: { label: string; body: string }) {
    return (
        <li className="flex items-start gap-3">
            <span className="mt-1.5 block w-1 h-1 rounded-full bg-yuzu shadow-[0_0_4px_rgba(204,255,0,0.7)] shrink-0" />
            <div className="flex flex-col gap-0.5">
                <span className="font-sans text-[12px] font-semibold text-white/90 tracking-tight">
                    {label}
                </span>
                <span className="font-sans text-[12.5px] text-silver/55 leading-relaxed">
                    {body}
                </span>
            </div>
        </li>
    );
}

/* ─── PASSPORT CARD ────────────────────────────────────────────────────── */

const CUISINE_AFFINITY = [
    { name: 'Italian',        pct: 94 },
    { name: 'Coastal',        pct: 87 },
    { name: 'French',         pct: 76 },
    { name: 'Omakase',        pct: 68 },
];

const RECENT_STAMPS = [
    { initials: 'OL', name: 'Osteria Lumina', when: '3d' },
    { initials: 'CM', name: 'Casa Marisol',   when: '12d' },
    { initials: 'SA', name: 'Sasso',           when: '21d' },
    { initials: 'NK', name: 'Nakamura',        when: '34d' },
];

function PassportCard() {
    return (
        <div className="relative w-full max-w-[440px] rounded-2xl bg-gradient-to-b from-[#0E0E0E] to-[#070707] border border-white/12 shadow-[0_30px_70px_rgba(0,0,0,0.6),0_0_30px_rgba(204,255,0,0.04)] overflow-hidden">
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yuzu/50 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                <div className="flex items-center gap-2">
                    <svg viewBox="0 0 12 12" width="11" height="11" className="text-yuzu">
                        <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
                        <path d="M 6 2 L 7 5.5 L 6 4.5 L 5 5.5 Z" fill="currentColor" />
                    </svg>
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-silver/55">
                        TapIn OS · Passport
                    </span>
                </div>
                <span className="font-mono text-[8.5px] text-yuzu/65 tracking-[0.2em]">
                    No. 0A·4F2B·9E7D
                </span>
            </div>

            {/* Body */}
            <div className="px-6 py-7 flex flex-col gap-7">
                {/* Sigil + owner */}
                <div className="flex items-center gap-5">
                    <Sigil />
                    <div className="flex flex-col gap-1.5 min-w-0">
                        <span className="font-mono text-[8.5px] uppercase tracking-[0.28em] text-silver/45">
                            Owner
                        </span>
                        <span className="font-serif italic text-[20px] text-white/95 leading-none truncate">
                            M. Solano
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-[9px] text-silver/40 tracking-wide">Issued · 2024</span>
                            <span className="w-1 h-1 rounded-full bg-silver/25" />
                            <span className="flex items-center gap-1">
                                <span className="relative flex w-1 h-1">
                                    <span className="absolute inset-0 rounded-full bg-yuzu animate-ping opacity-75" />
                                    <span className="relative w-1 h-1 rounded-full bg-yuzu" />
                                </span>
                                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-yuzu/70">Active</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Taste signature */}
                <div>
                    <div className="flex items-center justify-between mb-2.5">
                        <span className="font-mono text-[8.5px] uppercase tracking-[0.28em] text-silver/45">
                            Taste signature
                        </span>
                        <span className="font-mono text-[8.5px] text-silver/35">
                            128d · refreshed live
                        </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        {CUISINE_AFFINITY.map((c) => (
                            <AffinityBar key={c.name} name={c.name} pct={c.pct} />
                        ))}
                    </div>
                </div>

                {/* Recent stamps */}
                <div>
                    <div className="flex items-center justify-between mb-2.5">
                        <span className="font-mono text-[8.5px] uppercase tracking-[0.28em] text-silver/45">
                            Recent stamps
                        </span>
                        <span className="font-mono text-[8.5px] text-silver/35">
                            Last 30 days · 4 of 12
                        </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        {RECENT_STAMPS.map((s, i) => (
                            <Stamp key={s.name} initials={s.initials} name={s.name} when={s.when} idx={i} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer — cryptographic signature line */}
            <div className="px-6 py-3 border-t border-white/8 bg-white/[0.02] flex items-center justify-between">
                <span className="font-mono text-[8.5px] text-silver/40 tracking-wide truncate max-w-[60%]">
                    sig · 0x9F·2A4B·D7E1·…·8C42
                </span>
                <span className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-yuzu/65">
                    Verified · TapIn OS
                </span>
            </div>
        </div>
    );
}

/* Sigil — an abstract personal mark (varies per identity in real product) */
function Sigil() {
    return (
        <svg viewBox="0 0 64 64" width="64" height="64" className="shrink-0">
            <defs>
                <radialGradient id="sigil-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(204,255,0,0.30)" />
                    <stop offset="100%" stopColor="rgba(204,255,0,0)" />
                </radialGradient>
            </defs>
            <circle cx="32" cy="32" r="30" fill="url(#sigil-glow)" />
            <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(204,255,0,0.40)" strokeWidth="0.8" />
            <circle cx="32" cy="32" r="20" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" strokeDasharray="3 3" />
            {/* Abstract glyph — like an M for Marisol but stylised */}
            <path d="M 20 42 L 20 22 L 32 36 L 44 22 L 44 42"
                fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <motion.circle
                cx="32" cy="32" r="2.5"
                fill="rgb(204,255,0)"
                animate={{ scale: [1, 1.4, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '32px 32px' }}
            />
        </svg>
    );
}

function AffinityBar({ name, pct }: { name: string; pct: number }) {
    return (
        <div className="flex items-center gap-3">
            <span className="font-sans text-[11px] text-white/85 tracking-tight w-20 shrink-0">{name}</span>
            <span className="relative flex-1 h-[6px] rounded-full bg-white/8 overflow-hidden">
                <motion.span
                    className="absolute inset-y-0 left-0 rounded-full bg-yuzu shadow-[0_0_6px_rgba(204,255,0,0.5)]"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                />
            </span>
            <span className="font-mono text-[10px] text-yuzu/85 tabular-nums w-8 text-right shrink-0">
                {pct}%
            </span>
        </div>
    );
}

function Stamp({ initials, name, when, idx }: { initials: string; name: string; when: string; idx: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.15 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col items-center gap-1"
            title={`${name} · ${when} ago`}
        >
            <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-yuzu/40 bg-yuzu/[0.06] font-mono text-[10px] font-bold tracking-wider text-yuzu/95">
                {initials}
                <span className="absolute -inset-px rounded-full border border-white/8" />
            </span>
            <span className="font-mono text-[8px] text-silver/45 tracking-wide">{when}</span>
        </motion.div>
    );
}
