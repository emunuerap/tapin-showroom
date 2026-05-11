import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const TetrisBlueprint = () => {
    const gridSize = 20; // Size of each grid square in pixels

    const [step, setStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(prev => (prev >= 2 ? 0 : prev + 1));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Static placed tables (the baseline "unoptimized" state)
    const staticBlocks = [
        { id: 1, w: 2, h: 2, x: 1, y: 1 },
        { id: 2, w: 2, h: 2, x: 4, y: 1 },
        { id: 3, w: 3, h: 2, x: 7, y: 1 },
        { id: 4, w: 2, h: 2, x: 1, y: 4 },
        { id: 5, w: 2, h: 3, x: 10, y: 4 },
        { id: 6, w: 3, h: 2, x: 4, y: 4 },
    ];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative p-4">
            <svg
                viewBox="0 0 280 180"
                className="w-full h-full object-contain overflow-visible border border-white/5 rounded-lg bg-[#0A0A0A]"
            >

                {/* SVG Grid Lines */}
                <pattern id="grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                    <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Static Blocks */}
                {staticBlocks.map(b => (
                    <rect
                        key={b.id}
                        x={b.x * gridSize}
                        y={b.y * gridSize}
                        width={b.w * gridSize}
                        height={b.h * gridSize}
                        fill="rgba(255,255,255,0.02)"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="1"
                        rx="2"
                    />
                ))}

                {/* The "Tetris" Block being optimized entirely via Framer Motion */}
                <motion.rect
                    // Step 0: Initial bad placement (causing a gap)
                    // Step 1: Slide to optimal slot
                    // Step 2: Flash success, clear space
                    initial={{
                        x: 7 * gridSize,
                        y: 4 * gridSize,
                        width: 2 * gridSize,
                        height: 2 * gridSize,
                        stroke: "rgba(255,255,255,0.5)",
                        fill: "rgba(255,255,255,0.1)"
                    }}
                    animate={{
                        x: step === 0 ? 7 * gridSize : 1 * gridSize,
                        y: step === 0 ? 4 * gridSize : 7 * gridSize,
                        stroke: step === 2 ? "#CCFF00" : "rgba(255,255,255,0.5)",
                        fill: step === 2 ? "rgba(204,255,0,0.2)" : "rgba(255,255,255,0.1)",
                    }}
                    transition={{
                        x: { type: "spring", stiffness: 60, damping: 15 },
                        y: { type: "spring", stiffness: 60, damping: 15 },
                        stroke: { duration: 0.3 },
                        fill: { duration: 0.3 }
                    }}
                    strokeWidth="1.5"
                    rx="2"
                />

                {/* VIP Box that gets "cleared up" when the tetris block moves */}
                <motion.rect
                    x={4 * gridSize}
                    y={6 * gridSize}
                    width={6 * gridSize}
                    height={2 * gridSize}
                    fill="none"
                    stroke="#CCFF00"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    rx="2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: step === 2 ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                />
                <motion.text
                    x={7 * gridSize}
                    y={7.2 * gridSize}
                    fill="#CCFF00"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: step === 2 ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    + VIP SLOT
                </motion.text>
            </svg>
        </div>
    );
};
