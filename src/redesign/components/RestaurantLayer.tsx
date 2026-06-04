import { motion } from 'framer-motion';
import { FloorplanLight } from '../visuals/FloorplanLight';
import { fadeUp, lineReveal, staggerParent, inView } from '../motion/variants';

export function RestaurantLayer() {
  return (
    <section id="restaurants" className="rd-section rd-rest">
      <motion.div
        className="rd-container rd-head"
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        <h2 className="rd-display rd-head__title">
          <span className="rd-line">
            <motion.span className="rd-line__inner" variants={lineReveal}>
              Your floor,
            </motion.span>
          </span>
          <span className="rd-line">
            <motion.span className="rd-line__inner" variants={lineReveal}>
              <span className="rd-accent">choreographed</span>.
            </motion.span>
          </span>
        </h2>
        <motion.p className="rd-lead" variants={fadeUp}>
          The whole dining room, live and explorable. Drag across the floor,
          hover any table for real POS data — covers, orders, satisfaction, a
          turnaround clock. The Tetris Agent works the grid in the background so
          the next party always has a seat.
        </motion.p>
      </motion.div>

      <FloorplanLight />
    </section>
  );
}
