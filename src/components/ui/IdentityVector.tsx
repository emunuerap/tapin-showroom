import { motion } from 'framer-motion';

export const IdentityVector = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-between py-4">
            <div className="flex-1 flex items-center justify-center relative w-full h-full my-8">
                {/* Abstract Rotating Geometric Mesh */}
                <motion.svg
                    viewBox="0 0 200 200"
                    className="w-64 h-64 overflow-visible"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                    <motion.polygon
                        points="100,10 190,50 160,150 40,150 10,50"
                        fill="none"
                        stroke="#CCFF00"
                        strokeWidth="0.5"
                        opacity="0.5"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [0.8, 1.1, 0.8] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.polygon
                        points="100,30 170,60 140,140 60,140 30,60"
                        fill="rgba(204,255,0,0.02)"
                        stroke="#FAFAFA"
                        strokeWidth="0.5"
                        opacity="0.2"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: -360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.circle cx="100" cy="100" r="80" fill="none" stroke="#888888" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4" />
                    <motion.circle cx="100" cy="100" r="40" fill="none" stroke="#CCFF00" strokeWidth="1" opacity="0.1"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0, 0.1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.svg>
            </div>

            {/* Monospace Footer UI */}
            <div className="w-full mt-auto pt-6 border-t border-white/10 font-mono text-[10px] md:text-xs text-silver/60 flex flex-wrap justify-between items-center gap-2">
                <span>[UID: 0x8F9A...</span>
                <span className="hidden md:inline">|</span>
                <span className="text-[#CCFF00]">STATUS: VIP_VERIFIED</span>
                <span className="hidden md:inline">|</span>
                <span>G-SCORE: 9.8]</span>
            </div>
        </div>
    );
};
