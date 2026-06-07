import { motion } from 'framer-motion';
import { fadeUp, lineReveal, staggerParent, inView } from '../motion/variants';

export function ClosingSection() {
  return (
    <section id="contact" className="rd-section rd-close">
      <motion.div
        className="rd-container"
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        <h2 className="rd-display rd-close__title">
          <span className="rd-line">
            <motion.span className="rd-line__inner" variants={lineReveal}>
              Don&rsquo;t call.
            </motion.span>
          </span>
          <span className="rd-line">
            <motion.span className="rd-line__inner" variants={lineReveal}>
              Just <span className="rd-accent">TapIn</span>.
            </motion.span>
          </span>
        </h2>

        <motion.div className="rd-close__actions" variants={fadeUp}>
          <a className="rd-btn rd-btn--primary" href="mailto:hello@tapin.app?subject=Restaurant%20demo">
            Request a restaurant demo
            <span className="rd-yuzu-dot" />
          </a>
          <a className="rd-btn rd-btn--ghost" href="mailto:hello@tapin.app?subject=Talk%20to%20the%20team">
            Talk to the team
          </a>
        </motion.div>

        <motion.footer className="rd-foot" variants={fadeUp}>
          <span className="rd-foot__brand">TapIn</span>
          <span>The invisible OS for modern hospitality</span>
          <span>© {new Date().getFullYear()} TapIn</span>
        </motion.footer>
      </motion.div>
    </section>
  );
}
