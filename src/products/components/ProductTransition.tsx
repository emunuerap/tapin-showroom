import { motion } from 'framer-motion';

export function ProductTransition() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden bg-[#050505]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
    >
      <motion.div
        className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yuzu shadow-[0_0_44px_rgba(204,255,0,0.95)]"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.8, 1] }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-px -translate-x-1/2 -translate-y-1/2 bg-yuzu shadow-[0_0_32px_rgba(204,255,0,0.82)]"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: ['0vw', '82vw', '100vw'], opacity: [0, 1, 0] }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], times: [0, 0.62, 1] }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.2),transparent_46%)]"
        initial={{ scale: 0.18, opacity: 0 }}
        animate={{ scale: [0.18, 1.4], opacity: [0, 0.65, 0] }}
        transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}
