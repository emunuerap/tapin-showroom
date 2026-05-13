import { useRef, type ElementType } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface CinematicTextProps {
    text: string;
    as?: ElementType;
    className?: string;
    delay?: number;
}

export function CinematicText({ text, as: Component = 'span', className = '', delay = 0 }: CinematicTextProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

    const words = text.split(" ");

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: () => ({
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: delay * 0.5 },
        }),
    };

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            scale: 1,
            transition: {
                type: 'spring',
                damping: 20,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 30,
            filter: 'blur(10px)',
            scale: 0.95,
        },
    };

    return (
        <Component ref={ref} className={className}>
            <motion.span
                variants={container}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="inline-flex flex-wrap gap-[0.25em]"
            >
                {words.map((word, index) => (
                    <motion.span variants={child} key={index} className="inline-block">
                        {word}
                    </motion.span>
                ))}
            </motion.span>
        </Component>
    );
}
