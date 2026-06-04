import { motion } from 'framer-motion';
import { fadeUp, lineReveal, riseIn, staggerParent, inView } from '../motion/variants';

type Capability = { no: string; title: string; desc: string; metric: string };

const CAPS: Capability[] = [
  {
    no: '01',
    title: 'Tetris Agent',
    desc: 'Real-time seating that works the grid for you — packing covers, protecting pacing, never leaving a four-top sitting empty.',
    metric: '+15% RevPASH per shift',
  },
  {
    no: '02',
    title: 'No-show shield',
    desc: 'Predicts the risk, requests a smart deposit when it matters, and auto-releases the table the moment a party ghosts.',
    metric: '−80% silent no-shows',
  },
  {
    no: '03',
    title: 'Walk-in Express',
    desc: 'A tap at the host stand seats walk-ins in seconds — no clipboard, no guesswork, slotted straight into the live floor.',
    metric: '~4 min average wait',
  },
  {
    no: '04',
    title: 'Taste Genome',
    desc: 'Every guest carries a flavour fingerprint. The OS remembers the Chablis, the allergy, the anniversary — and prompts the server.',
    metric: 'Every regular, remembered',
  },
  {
    no: '05',
    title: 'Gratitude Protocol',
    desc: 'Tips and thank-yous become live sentiment signals on the floor, so you know which tables are glowing and which need a touch.',
    metric: '+0.32 avg sentiment',
  },
  {
    no: '06',
    title: 'Live POS sync',
    desc: 'Checks, courses and dwell time stream straight into the floor map. One source of truth — zero double entry.',
    metric: 'Zero manual entry',
  },
];

export function RestaurantCapabilities() {
  return (
    <section id="capabilities" className="rd-section rd-caps">
      <motion.div
        className="rd-container rd-head"
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        <motion.span className="rd-tag" variants={fadeUp}>
          What it does
        </motion.span>
        <h2 className="rd-display rd-head__title">
          <span className="rd-line">
            <motion.span className="rd-line__inner" variants={lineReveal}>
              Everything the room needs,
            </motion.span>
          </span>
          <span className="rd-line">
            <motion.span className="rd-line__inner" variants={lineReveal}>
              running <span className="rd-accent">quietly</span>.
            </motion.span>
          </span>
        </h2>
        <motion.p className="rd-lead" variants={fadeUp}>
          Not another dashboard to babysit. Six capabilities, one system —
          working the floor while your team works the guests.
        </motion.p>
      </motion.div>

      <div className="rd-container">
        <motion.div
          className="rd-caps__grid"
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {CAPS.map((cap) => (
            <motion.article key={cap.no} className="rd-cap" variants={riseIn}>
              <span className="rd-cap__glow" aria-hidden="true" />
              <span className="rd-cap__no">{cap.no}</span>
              <h3 className="rd-cap__title">{cap.title}</h3>
              <p className="rd-cap__desc">{cap.desc}</p>
              <span className="rd-cap__metric">
                <span className="rd-yuzu-dot" /> {cap.metric}
              </span>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
