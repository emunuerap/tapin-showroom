import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * CustomCursor — a small yuzu dot + outer ring that follow the cursor with
 * spring physics. The ring expands on hover over interactive elements
 * (a, button, [role=button], input, textarea, select, [data-cursor=hover]).
 *
 * Disabled on:
 *  - Touch devices (no hover capability)
 *  - Reduced-motion preference
 *
 * Coordinates use motion values + springs (no React re-renders per frame),
 * so the cursor stays at 60fps even with heavy GSAP/Three work running.
 */
function shouldUseCustomCursor() {
    if (typeof window === 'undefined') return false;
    const isTouch =
        window.matchMedia('(hover: none)').matches ||
        window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !isTouch && !reducedMotion;
}

export function CustomCursor() {
    const [enabled] = useState(shouldUseCustomCursor);
    const [isHovering, setIsHovering] = useState(false);
    const [isDown, setIsDown] = useState(false);

    // Raw position from the mouse
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Springs for the dot (tight) and the ring (looser, trails behind)
    const dotX = useSpring(mouseX, { mass: 0.1, stiffness: 900, damping: 40 });
    const dotY = useSpring(mouseY, { mass: 0.1, stiffness: 900, damping: 40 });
    const ringX = useSpring(mouseX, { mass: 0.4, stiffness: 220, damping: 24 });
    const ringY = useSpring(mouseY, { mass: 0.4, stiffness: 220, damping: 24 });

    const interactiveSelector = useRef(
        'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]'
    );

    useEffect(() => {
        if (!enabled) return;

        const onMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const onOver = (e: Event) => {
            const t = e.target as HTMLElement | null;
            if (t && t.closest && t.closest(interactiveSelector.current)) {
                setIsHovering(true);
            }
        };
        const onOut = (e: Event) => {
            const t = e.target as HTMLElement | null;
            if (t && t.closest && t.closest(interactiveSelector.current)) {
                setIsHovering(false);
            }
        };

        const onDown = () => setIsDown(true);
        const onUp = () => setIsDown(false);

        window.addEventListener('mousemove', onMove);
        document.addEventListener('mouseover', onOver, true);
        document.addEventListener('mouseout', onOut, true);
        window.addEventListener('mousedown', onDown);
        window.addEventListener('mouseup', onUp);

        return () => {
            window.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseover', onOver, true);
            document.removeEventListener('mouseout', onOut, true);
            window.removeEventListener('mousedown', onDown);
            window.removeEventListener('mouseup', onUp);
        };
    }, [enabled, mouseX, mouseY]);

    if (!enabled) return null;

    return (
        <>
            {/* Dot — tight follow, hides on hover so the ring can be the focus */}
            <motion.div
                style={{
                    x: dotX,
                    y: dotY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isHovering ? 0 : isDown ? 0.6 : 1,
                    opacity: isHovering ? 0 : 1,
                }}
                transition={{ type: 'spring', mass: 0.3, stiffness: 400, damping: 30 }}
                className="fixed top-0 left-0 pointer-events-none z-[100000] w-1.5 h-1.5 rounded-full bg-yuzu shadow-[0_0_8px_rgba(204,255,0,0.8)]"
                aria-hidden="true"
            />
            {/* Ring — looser follow, expands on hover */}
            <motion.div
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isHovering ? 1.8 : isDown ? 0.85 : 1,
                    borderColor: isHovering ? 'rgba(204,255,0,0.9)' : 'rgba(204,255,0,0.35)',
                    backgroundColor: isHovering ? 'rgba(204,255,0,0.06)' : 'rgba(204,255,0,0)',
                }}
                transition={{ type: 'spring', mass: 0.4, stiffness: 220, damping: 22 }}
                className="fixed top-0 left-0 pointer-events-none z-[100000] w-8 h-8 rounded-full border"
                aria-hidden="true"
            />
        </>
    );
}
