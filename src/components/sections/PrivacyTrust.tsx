import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * PrivacyTrust — universal section.
 *
 * A premium brand that captures Taste Genome / Sentiment data needs to OWN
 * the trust conversation. This is the calm, confident moment that says:
 * your data is yours. No drama, no fear-mongering, no jargon. Three quiet
 * commitments + one simple guarantee.
 */

const COMMITMENTS = [
    {
        id: 'ownership',
        keyword: 'Yours',
        title: 'Your Taste Genome is yours',
        body: 'Every signal — the wine you loved, the table you favour, the rhythm of your visits — belongs to you. Export it, delete it, take it anywhere.',
    },
    {
        id: 'never-sold',
        keyword: 'Sealed',
        title: 'Never sold. Never advertised against.',
        body: 'TapIn does not sell your data, share it with brokers, or use it to target ads. We are paid by venues, never by advertisers.',
    },
    {
        id: 'minimal',
        keyword: 'Minimal',
        title: 'Only what hospitality needs',
        body: 'Phone number as your passport. No social logins, no scraping, no shadow profiles. The minimum needed to recognise you and welcome you back.',
    },
];

export function PrivacyTrust() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from('.priv-eyebrow', {
            opacity: 0, y: 14, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        });
        gsap.from('.priv-headline', {
            opacity: 0, y: 24, duration: 1.1, ease: 'power4.out', delay: 0.05,
            scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        });
        gsap.from('.priv-card', {
            opacity: 0, y: 20, duration: 0.9, ease: 'power4.out', delay: 0.3, stagger: 0.12,
            scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        });
        gsap.from('.priv-controls', {
            opacity: 0, y: 14, duration: 0.9, ease: 'power3.out', delay: 0.65,
            scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative w-full py-32 md:py-40 px-6 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(204,255,0,0.020)_0%,transparent_55%)]" />

            <div className="relative z-10 max-w-6xl mx-auto">
                <div className="flex flex-col items-center gap-7 text-center mb-16">
                    <span className="priv-eyebrow inline-flex items-center gap-3 font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-yuzu/80">
                        <span className="block w-8 h-px bg-yuzu/40" />
                        Privacy by design
                        <span className="block w-8 h-px bg-yuzu/40" />
                    </span>
                    <h2 className="priv-headline font-serif italic text-4xl md:text-6xl lg:text-7xl text-silver/90 leading-[1.04] tracking-tight max-w-4xl">
                        Anticipation requires trust.
                        <br />
                        <span className="text-yuzu">Trust requires control.</span>
                    </h2>
                </div>

                {/* Three commitments */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-16">
                    {COMMITMENTS.map((c) => <CommitmentCard key={c.id} commitment={c} />)}
                </div>

                {/* Quiet controls strip — quick options the user "owns" */}
                <div className="priv-controls flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 px-5 py-5 md:px-8 md:py-6 rounded-xl bg-[#0A0A0A]/80 border border-white/12">
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-yuzu/80">
                            Your controls
                        </span>
                        <span className="font-sans text-[12.5px] text-silver/65">
                            One tap to inspect, export, or revoke at any moment.
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <ControlChip label="Inspect Genome" />
                        <ControlChip label="Export · JSON" />
                        <ControlChip label="Pause memory" />
                        <ControlChip label="Forget me" tone="warn" />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── COMMITMENT CARD ──────────────────────────────────────────────────── */

function CommitmentCard({ commitment }: { commitment: typeof COMMITMENTS[number] }) {
    return (
        <div className="priv-card relative bg-[#0A0A0A]/85 backdrop-blur-sm border border-white/12 hover:border-yuzu/35 rounded-lg p-6 md:p-7 transition-colors duration-300 group overflow-hidden">
            {/* Vertical accent on left */}
            <span className="absolute top-5 bottom-5 left-0 w-px bg-yuzu/40" />

            <div className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-yuzu/75 mb-4">
                {commitment.keyword}
            </div>
            <h3 className="font-serif italic text-[20px] md:text-[22px] text-white/95 leading-tight tracking-tight mb-3">
                {commitment.title}
            </h3>
            <p className="font-sans text-[12.5px] text-silver/65 leading-relaxed">
                {commitment.body}
            </p>
        </div>
    );
}

function ControlChip({ label, tone = 'normal' }: { label: string; tone?: 'normal' | 'warn' }) {
    const isWarn = tone === 'warn';
    return (
        <button
            type="button"
            className={`px-3.5 py-2 rounded-full border font-mono text-[10px] uppercase tracking-[0.22em] transition-all duration-300 cursor-pointer ${
                isWarn
                    ? 'border-white/15 text-silver/55 hover:border-rose-300/40 hover:text-rose-300/80'
                    : 'border-yuzu/30 text-yuzu/85 hover:border-yuzu/70 hover:text-yuzu hover:bg-yuzu/[0.04]'
            }`}
        >
            {label}
        </button>
    );
}
