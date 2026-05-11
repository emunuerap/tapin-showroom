import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BrandCloseProps {
    activeView?: 'guests' | 'venues';
    onSwitchView?: () => void;
}

/**
 * BrandClose — final brand statement before the footer.
 *
 * Clean composition:
 *  - No paper-grain (the global ambient layer already provides texture).
 *  - Soft horizontal yuzu hairline above the headline (an elegant "underline
 *    of the section" rather than a noisy gradient).
 *  - One single primary CTA, context-aware (Guests → Get the App,
 *    Venues → Request a Demo).
 *  - A quiet secondary link to the other side ("Are you a venue? →" or
 *    "Looking for a table?") — invitation, not pressure.
 *  - Crossfade between view-specific content so toggling feels alive.
 */
export function BrandClose({ activeView = 'guests', onSwitchView }: BrandCloseProps) {
    const containerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        gsap.from('.brand-close-rule', {
            scaleX: 0, transformOrigin: 'center',
            duration: 1.2, ease: 'power4.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.brand-close-eyebrow', {
            opacity: 0, y: 12, duration: 0.9, ease: 'power3.out', delay: 0.1,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.brand-close-headline', {
            opacity: 0, y: 28, duration: 1.2, ease: 'power4.out', delay: 0.15,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.brand-close-sub', {
            opacity: 0, y: 12, duration: 0.9, ease: 'power3.out', delay: 0.35,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.brand-close-cta', {
            opacity: 0, y: 14, duration: 0.9, ease: 'power3.out', delay: 0.5, stagger: 0.1,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
    }, { scope: containerRef });

    const isGuests = activeView === 'guests';
    const primaryLabel = isGuests ? 'Get the App' : 'Request a Demo';
    const switchLabel = isGuests ? 'Are you a venue?' : 'Looking for a table?';

    return (
        <section
            ref={containerRef}
            className="relative w-full py-36 md:py-44 px-6"
        >
            {/* Soft centred yuzu wash — clean, no grain (the global ambient layer
                handles texture; doubling it here was producing the noisy look). */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_60%_at_center,rgba(204,255,0,0.04)_0%,transparent_60%)]" />

            <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center gap-10 md:gap-12">
                {/* Elegant horizontal accent */}
                <span className="brand-close-rule block w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-yuzu/65 to-transparent" />

                {/* Eyebrow */}
                <span className="brand-close-eyebrow font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-yuzu/70">
                    The Hospitality OS
                </span>

                {/* Monumental headline */}
                <h2 className="brand-close-headline font-serif italic text-5xl md:text-8xl lg:text-9xl leading-[1.02] text-silver/90 tracking-tight">
                    Don't call.
                    <br />
                    <span className="text-yuzu drop-shadow-[0_0_40px_rgba(204,255,0,0.22)]">
                        Just TapIn.
                    </span>
                </h2>

                {/* One-sentence summary — switches with the view */}
                <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                        key={`sub-${activeView}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="brand-close-sub font-sans text-base md:text-lg text-silver/65 max-w-xl leading-relaxed"
                    >
                        {isGuests
                            ? 'Every restaurant. One protocol. From the first tap to the last memory, your night runs itself.'
                            : 'Every guest recognised. Every table optimised. The operating system that runs the room with you.'}
                    </motion.p>
                </AnimatePresence>

                {/* Single contextual primary CTA */}
                <div className="flex flex-col items-center gap-5 mt-2">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.button
                            key={`cta-${activeView}`}
                            type="button"
                            initial={{ opacity: 0, y: 6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="brand-close-cta group inline-flex items-center gap-3 px-9 py-4 rounded-full bg-yuzu text-obsidian font-sans font-semibold text-[12px] uppercase tracking-[0.25em] hover:scale-[1.04] transition-transform duration-300 shadow-[0_0_36px_rgba(204,255,0,0.25)]"
                        >
                            {primaryLabel}
                            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                                →
                            </span>
                        </motion.button>
                    </AnimatePresence>

                    {/* Quiet secondary — invitation to switch perspective */}
                    {onSwitchView && (
                        <button
                            type="button"
                            onClick={onSwitchView}
                            className="brand-close-cta group inline-flex items-center gap-2 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-silver/45 hover:text-yuzu transition-colors duration-300"
                        >
                            {switchLabel}
                            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                                →
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
