import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ease } from '../../design/light-tokens';

/**
 * Preloader — a brief branded entrance (CODEGRID-style). A pine curtain with
 * the TapIn wordmark that wipes up to reveal the hero. Parent controls mount
 * via AnimatePresence; this just animates in and calls onDone.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = window.setTimeout(onDone, 1500);
    return () => window.clearTimeout(id);
  }, [onDone]);

  return (
    <motion.div
      className="rd-preloader"
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.85, ease: ease.liquid }}
    >
      <motion.div
        className="rd-preloader__brand"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.7, ease: ease.liquid }}
      >
        <span className="rd-preloader__word">TapIn</span>
        <span className="rd-preloader__dot" />
      </motion.div>
      <motion.div
        className="rd-preloader__line"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.3, ease: ease.liquid }}
      />
    </motion.div>
  );
}
