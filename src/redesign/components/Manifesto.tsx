import { FlowLine } from '../visuals/FlowLine';
import { Reveal } from './Reveal';

/**
 * Manifesto — the "friction problem" beat (Diagonal grid). Reveals are
 * scroll-linked via <Reveal> so they ease in/out smoothly in both directions.
 */
const PROBLEM = 'The call goes unanswered. The host is buried. The eight o’clock is circling the block.';

export function Manifesto() {
  return (
    <section id="why" className="rd-section rd-mf">
      <div className="gc-diagonals" aria-hidden="true" />

      <div className="rd-container rd-mf__inner">
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

        <Reveal className="rd-mf__text gc-baseline">
          <p className="rd-display rd-mf__problem">
            {PROBLEM.split(' ').map((w, i) => (
              <span key={i} className="rd-mf__word">
                {w}
              </span>
            ))}
          </p>
          <p className="rd-display rd-mf__turn">
            TapIn makes the <span className="rd-accent">friction</span> vanish — quietly, in five seconds.
          </p>
        </Reveal>

        <Reveal className="rd-mf__aside" y={26}>
          <div className="rd-mf__aside-grid" aria-hidden="true" />
          <div className="rd-mf__stat">5s</div>
          <div className="rd-mf__stat-l">from craving to confirmed</div>
          <div className="rd-mf__aside-line">No app. No call. No hold music — just a tap.</div>
        </Reveal>
      </div>
    </section>
  );
}
