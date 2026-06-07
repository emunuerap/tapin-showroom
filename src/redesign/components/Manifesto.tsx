import { motion } from 'framer-motion';
import { FlowLine } from '../visuals/FlowLine';
import { staggerParent, wordReveal, fadeUp, maskReveal, inView } from '../motion/variants';

/**
 * Manifesto — the "friction problem" beat of the journey.
 * Layout: the Diagonal ("Excel") grid — statement upper-left, stat card
 * lower-right, with the faint Golden Canon diagonals behind. Entrance uses
 * a word-by-word reveal (statement) + a clip-path mask wipe (the card).
 */
const PROBLEM = 'The call goes unanswered. The host is buried. The eight o’clock is circling the block.';

export function Manifesto() {
  return (
    <section id="why" className="rd-section rd-mf">
      <div className="gc-diagonals" aria-hidden="true" />

      <div className="rd-container rd-mf__inner">
        {/* diagonal intention line connecting statement → stat card */}
        <FlowLine
          className="rd-mf__diag"
          viewBox="0 0 100 50"
          d="M 2 16 C 38 16, 44 40, 82 42"
          stroke="rgba(33,67,53,0.42)"
          strokeWidth={0.7}
          travel
          travelColor="#DDA84C"
          travelDur={4.2}
          travelRadius={0.9}
          preserveAspectRatio="none"
        />
        <motion.div
          className="rd-mf__text gc-baseline"
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          <p className="rd-display rd-mf__problem">
            {PROBLEM.split(' ').map((w, i) => (
              <motion.span key={i} className="rd-mf__word" variants={wordReveal}>
                {w}
              </motion.span>
            ))}
          </p>
          <motion.p className="rd-display rd-mf__turn" variants={fadeUp}>
            TapIn makes the <span className="rd-accent">friction</span> vanish — quietly, in five seconds.
          </motion.p>
        </motion.div>

        <motion.aside
          className="rd-mf__aside"
          variants={maskReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="rd-mf__stat">5s</div>
          <div className="rd-mf__stat-l">from craving to confirmed</div>
          <div className="rd-mf__aside-line">No app. No call. No hold music — just a tap.</div>
        </motion.aside>
      </div>
    </section>
  );
}
