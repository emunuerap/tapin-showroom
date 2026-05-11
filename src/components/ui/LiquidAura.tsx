import { motion } from 'framer-motion';

export const LiquidAura = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* The Living Orb */}
            <motion.div
                className="w-40 h-40 rounded-full bg-[#CCFF00] blur-[40px] opacity-20"
                animate={{
                    scale: [1, 1.2, 0.9, 1.1, 1],
                    opacity: [0.15, 0.3, 0.15, 0.25, 0.15],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            {/* Core */}
            <motion.div
                className="absolute w-24 h-24 rounded-full bg-white blur-[20px] mix-blend-overlay"
                animate={{
                    scale: [1, 0.8, 1.1, 1],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
            />
        </div>
    );
};
