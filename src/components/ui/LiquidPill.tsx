import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface LiquidPillProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
}

export function LiquidPill({ children, className, ...props }: LiquidPillProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current!.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
            className={cn(
                "relative overflow-hidden rounded-full bg-yuzu text-obsidian px-8 py-4 font-sans font-bold tracking-tighter",
                "transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
                "hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(204,255,0,0.3)]",
                "active:scale-95",
                className
            )}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-full" />
        </motion.button>
    );
}
