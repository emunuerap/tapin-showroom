import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const TableTetrisGrid = () => {
    const [optimized, setOptimized] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setOptimized(prev => !prev);
        }, 3000); // toggle every 3s
        return () => clearInterval(interval);
    }, []);

    // 4x4 Grid -> coordinates (col, row) from 0 to 3
    // 8 blocks
    const blocks = [
        { id: 1, scatter: { x: 0, y: 0 }, pack: { x: 0, y: 3 } },
        { id: 2, scatter: { x: 2, y: 0 }, pack: { x: 1, y: 3 } },
        { id: 3, scatter: { x: 1, y: 1 }, pack: { x: 2, y: 3 } },
        { id: 4, scatter: { x: 3, y: 1 }, pack: { x: 3, y: 3 } },
        { id: 5, scatter: { x: 0, y: 2 }, pack: { x: 0, y: 2 } },
        { id: 6, scatter: { x: 2, y: 2 }, pack: { x: 1, y: 2 } },
        { id: 7, scatter: { x: 1, y: 3 }, pack: { x: 2, y: 2 } },
        { id: 8, scatter: { x: 3, y: 3 }, pack: { x: 3, y: 2 } },
    ];

    const cellSize = 40; // px
    const gap = 8; // px

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="relative" style={{ width: 4 * cellSize + 3 * gap, height: 4 * cellSize + 3 * gap }}>
                {/* Background Grid (Empty Seats) */}
                {[...Array(16)].map((_, i) => (
                    <div
                        key={`bg-${i}`}
                        className="absolute bg-white/5 border border-white/5 rounded-sm"
                        style={{
                            width: cellSize, height: cellSize,
                            left: (i % 4) * (cellSize + gap),
                            top: Math.floor(i / 4) * (cellSize + gap)
                        }}
                    />
                ))}

                {/* Moving Blocks */}
                {blocks.map((block) => {
                    const pos = optimized ? block.pack : block.scatter;
                    return (
                        <motion.div
                            key={block.id}
                            className={`absolute rounded-sm ${optimized ? 'bg-[#CCFF00]/20 border border-[#CCFF00]/50 shadow-[0_0_15px_rgba(204,255,0,0.15)] z-10' : 'bg-[#FAFAFA]/10 border border-white/10 z-0'}`}
                            initial={false}
                            animate={{
                                left: pos.x * (cellSize + gap),
                                top: pos.y * (cellSize + gap),
                            }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                            style={{ width: cellSize, height: cellSize }}
                        />
                    );
                })}
            </div>
            {/* Status Action */}
            <div className="mt-8 font-mono text-[10px] md:text-xs uppercase tracking-widest w-full text-center">
                <span className={`transition-colors duration-500 ${optimized ? "text-[#CCFF00]" : "text-silver/60"}`}>
                    {optimized ? "> INVENTORY PACKED" : "> DETECTING WASTE..."}
                </span>
            </div>
        </div>
    );
};
