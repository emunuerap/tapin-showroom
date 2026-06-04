import { motion } from 'framer-motion';
import { FlowLine } from '../visuals/FlowLine';
import { fadeUp, lineReveal, riseIn, staggerParent, inView } from '../motion/variants';
import { scrollToId } from '../motion/scrollTo';

type Step = { no: string; title: string; desc: string };

const STEPS: Step[] = [
  { no: '1', title: 'Connect your POS', desc: 'We sync with the system you already run — Toast, Square, Lightspeed. No rip-and-replace.' },
  { no: '2', title: 'Map your floor', desc: 'Drag your real tables onto the blueprint. The OS learns your room, sections and capacity.' },
  { no: '3', title: 'Drop the widget', desc: 'One line of code on your site, or a QR on the door. Guests book in five seconds.' },
  { no: '4', title: 'Go live', desc: 'Reservations, walk-ins and the Tetris Agent — all running the same dinner service.' },
];

const CONNECTOR = 'M 0 20 C 250 6, 250 34, 500 20 C 750 6, 750 34, 1000 20';

export function InstallFlow() {
  return (
    <section id="install" className="rd-section rd-install">
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
              Live by <span className="rd-accent">dinner service</span>.
            </motion.span>
          </span>
        </h2>
        <motion.p className="rd-lead" variants={fadeUp}>
          No new hardware, no migration project. TapIn slots onto the system you
          already run and goes live in a day — not a quarter.
        </motion.p>
      </motion.div>

      <div className="rd-container">
        <div className="rd-steps">
          <FlowLine
            className="rd-steps__line"
            viewBox="0 0 1000 40"
            d={CONNECTOR}
            stroke="rgba(46,70,54,0.3)"
            strokeWidth={1.4}
            travel
            travelColor="#CCFF00"
            travelDur={4}
          />
          {STEPS.map((step) => (
            <motion.div
              key={step.no}
              className="rd-step"
              variants={riseIn}
              initial="hidden"
              whileInView="show"
              viewport={inView}
            >
              <span className="rd-step__no">{step.no}</span>
              <h3 className="rd-step__title">{step.title}</h3>
              <p className="rd-step__desc">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="rd-install__foot"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          <span>Works with your existing POS · no new hardware · cancel anytime.</span>
          <button type="button" className="rd-btn rd-btn--primary" onClick={() => scrollToId('contact')}>
            Book a demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}
