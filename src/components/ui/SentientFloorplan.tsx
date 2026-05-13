import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const SentientFloorplan = () => {
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

    const tables = [
        { id: 1, x: 20, y: 20, size: 30 },
        { id: 2, x: 70, y: 30, size: 40 },
        { id: 3, x: 130, y: 20, size: 30 },
        { id: 4, x: 30, y: 80, size: 50 },
        { id: 5, x: 100, y: 90, size: 40 },
        { id: 6, x: 160, y: 80, size: 30 },
        { id: 7, x: 60, y: 150, size: 40 },
        { id: 8, x: 130, y: 140, size: 50 },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            // Pick a random table to highlight
            const nextIdx = Math.floor(Math.random() * tables.length);
            setHighlightedIndex(nextIdx);

            // Turn off highlight shortly after
            setTimeout(() => setHighlightedIndex(null), 1500);
        }, 4000);

        return () => clearInterval(interval);
    }, [tables.length]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative p-4">
            <motion.div
                className="relative w-[800px] h-[800px] rounded-[100px] border border-white/5 flex items-center justify-center p-2 cursor-grab active:cursor-grabbing bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_0%,transparent_100%)]"
                drag
                dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
                dragElastic={0.2}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
            >
                {/* Simulated Infinite Grid Background */}
                <div
                    className="absolute inset-0 z-0 pointer-events-none opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(204,255,0,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }}
                />

                {/* Tables rendering */}
                {tables.map((t, idx) => {
                    const isHighlighted = idx === highlightedIndex;
                    return (
                        <motion.div
                            key={t.id}
                            className={`absolute rounded-full border bg-black/40 backdrop-blur-sm flex items-center justify-center transition-colors duration-1000 z-10 ${isHighlighted ? 'border-[#CCFF00] shadow-[0_0_20px_rgba(204,255,0,0.3)]' : 'border-white/10'
                                }`}
                            style={{
                                width: t.size,
                                height: t.size,
                                left: t.x + 300, // Offset to center in new 800x800 canvas
                                top: t.y + 300
                            }}
                            whileHover={{ scale: 1.1 }}
                        >
                            {/* Inner dot if highlighted */}
                            <motion.div
                                className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: isHighlighted ? 1 : 0, scale: isHighlighted ? 1 : 0 }}
                                transition={{ duration: 0.5 }}
                            />
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};
