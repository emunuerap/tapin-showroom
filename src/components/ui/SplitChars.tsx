import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * SplitChars — character-by-character cinematic reveal.
 *
 * Reserved for the 2-3 most important headlines on the site. Splits text
 * into individual characters, each wrapped in an overflow-hidden mask, and
 * animates yPercent / rotate / blur with a tight stagger.
 *
 * Vs KineticWords (word-level): SplitChars is character-level and adds
 * rotation jitter + blur, producing a luxury-cinema feel. Use sparingly.
 *
 * Modes:
 *  - trigger="mount"  → plays immediately on mount (use for above-the-fold)
 *  - trigger="scroll" → plays when the element enters viewport, via
 *    IntersectionObserver. More reliable than ScrollTrigger when Lenis
 *    smooth scroll + overflow-hidden ancestors are in play.
 *
 * Line-breaking: characters are grouped by word with `white-space: nowrap`,
 * so the browser can only break lines at real word boundaries — never in
 * the middle of a word (avoids orphaned punctuation like a lone ".").
 *
 * Accessibility: visible chars are aria-hidden; the outer span carries the
 * real text via aria-label; reduced-motion users get the text instantly.
 */
interface SplitCharsProps {
    text: string;
    className?: string;
    charClassName?: string;
    delay?: number;
    duration?: number;
    stagger?: number;
    trigger?: 'mount' | 'scroll';
    /** Intersection ratio at which scroll trigger fires. Default 0.18. */
    threshold?: number;
    /** Entry rotation jitter (degrees, +/-). Default 14. */
    rotateJitter?: number;
    /** Vertical mask travel %. Default 110. */
    yPercent?: number;
}

export function SplitChars({
    text,
    className = '',
    charClassName = '',
    delay = 0,
    duration = 0.86,
    stagger = 0.018,
    trigger = 'scroll',
    threshold = 0.18,
    rotateJitter = 14,
    yPercent = 110,
}: SplitCharsProps) {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !ref.current) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return;

        const root = ref.current;
        const chars = root.querySelectorAll<HTMLElement>('.split-char');
        if (!chars.length) return;

        // Pre-set the masked starting state immediately so chars are hidden
        // until we choose to reveal them.
        gsap.set(chars, {
            yPercent,
            opacity: 0,
            rotate: () => gsap.utils.random(-rotateJitter, rotateJitter),
            filter: 'blur(8px)',
        });

        let observer: IntersectionObserver | null = null;
        let tween: gsap.core.Tween | null = null;
        let scheduledTimer: number | null = null;

        const reveal = () => {
            tween = gsap.to(chars, {
                yPercent: 0,
                opacity: 1,
                rotate: 0,
                filter: 'blur(0px)',
                duration,
                stagger,
                delay,
                ease: 'power3.out',
            });
        };

        if (trigger === 'mount') {
            scheduledTimer = window.requestAnimationFrame(() => reveal());
        } else {
            observer = new IntersectionObserver(
                (entries) => {
                    for (const entry of entries) {
                        if (entry.isIntersecting) {
                            reveal();
                            observer?.disconnect();
                            observer = null;
                            break;
                        }
                    }
                },
                {
                    rootMargin: '0px 0px -10% 0px',
                    threshold,
                },
            );
            observer.observe(root);
        }

        return () => {
            if (scheduledTimer !== null) window.cancelAnimationFrame(scheduledTimer);
            if (observer) observer.disconnect();
            if (tween) tween.kill();
            // Restore final state so unmount/remount can't leave invisible chars
            gsap.set(chars, { yPercent: 0, opacity: 1, rotate: 0, filter: 'blur(0px)' });
        };
    }, [text, delay, duration, stagger, trigger, threshold, rotateJitter, yPercent]);

    // Group chars by word to prevent intra-word line breaks. Without this,
    // browsers happily break between two inline-block chars, leaving a lone
    // "." or "," on its own line at wide viewports.
    const words = text.split(' ');

    return (
        <span ref={ref} className={`inline-block ${className}`} aria-label={text}>
            {words.map((word, wIdx) => (
                <span
                    key={`word-${wIdx}`}
                    aria-hidden="true"
                    className="split-word inline-block"
                    style={{ whiteSpace: 'nowrap' }}
                >
                    {Array.from(word).map((ch, cIdx) => (
                        <span
                            key={`${ch}-${wIdx}-${cIdx}`}
                            className="split-char-wrap inline-block overflow-hidden align-baseline"
                            style={{ lineHeight: 1 }}
                        >
                            <span
                                className={`split-char inline-block will-change-transform ${charClassName}`}
                            >
                                {ch}
                            </span>
                        </span>
                    ))}
                    {wIdx < words.length - 1 && (
                        <span
                            aria-hidden="true"
                            className="split-char-space inline-block"
                            style={{ width: '0.32em' }}
                        />
                    )}
                </span>
            ))}
        </span>
    );
}
