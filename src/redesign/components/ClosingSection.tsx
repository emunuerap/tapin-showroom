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
        <motion.span className="rd-eyebrow" variants={fadeUp} style={{ display: 'inline-block', marginBottom: '1.4rem' }}>
          Two ways in
        </motion.span>

        <h2 className="rd-display rd-close__title">
          <span className="rd-line">
            <motion.span className="rd-line__inner" variants={lineReveal}>
              Don&rsquo;t call.
            </motion.span>
          </span>
          <span className="rd-line">
            <motion.span className="rd-line__inner" variants={lineReveal}>
              Just <span className="rd-amber">TapIn</span>.
            </motion.span>
          </span>
        </h2>

        <motion.div className="rd-close__actions" variants={fadeUp}>
          <a className="rd-btn rd-btn--primary" href="mailto:hello@tapin.app?subject=Restaurant%20demo">
            Request a restaurant demo
            <span className="rd-yuzu-dot" />
          </a>
          <a className="rd-btn rd-btn--ghost" href="mailto:hello@tapin.app?subject=Diner%20waitlist">
            Join the diner waitlist
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
