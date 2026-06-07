import { FlowLine } from '../visuals/FlowLine';
import { Reveal } from './Reveal';
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
      <Reveal className="rd-container rd-head">
        <h2 className="rd-display rd-head__title">
          <span className="rd-line">
            <span className="rd-line__inner">
              Live by <span className="rd-accent">dinner service</span>.
            </span>
          </span>
        </h2>
        <p className="rd-lead">
          No new hardware, no migration project. TapIn slots onto the system you
          already run and goes live in a day — not a quarter.
        </p>
      </Reveal>

      <div className="rd-container">
        <div className="rd-steps">
          <FlowLine
            className="rd-steps__line"
            viewBox="0 0 1000 40"
            d={CONNECTOR}
            stroke="rgba(33,67,53,0.3)"
            strokeWidth={1.4}
            travel
            travelColor="#DDA84C"
            travelDur={4}
          />
          {STEPS.map((step) => (
            <Reveal key={step.no} className="rd-step" y={30}>
              <span className="rd-step__no">{step.no}</span>
              <h3 className="rd-step__title">{step.title}</h3>
              <p className="rd-step__desc">{step.desc}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="rd-install__foot" y={20}>
          <span>Works with your existing POS · no new hardware · cancel anytime.</span>
          <button type="button" className="rd-btn rd-btn--primary" onClick={() => scrollToId('contact')}>
            Book a demo
          </button>
        </Reveal>
      </div>
    </section>
  );
}
