import { Reveal } from './Reveal';

export function ClosingSection() {
  return (
    <section id="contact" className="rd-section rd-close">
      <div className="rd-container">
        <Reveal>
          <h2 className="rd-display rd-close__title">
            <span className="rd-line">
              <span className="rd-line__inner">Don&rsquo;t call.</span>
            </span>
            <span className="rd-line">
              <span className="rd-line__inner">
                Just <span className="rd-accent">TapIn</span>.
              </span>
            </span>
          </h2>
        </Reveal>

        <Reveal className="rd-close__actions" y={24}>
          <a className="rd-btn rd-btn--primary" href="mailto:hello@tapin.app?subject=Restaurant%20demo">
            Request a restaurant demo
            <span className="rd-yuzu-dot" />
          </a>
          <a className="rd-btn rd-btn--ghost" href="mailto:hello@tapin.app?subject=Talk%20to%20the%20team">
            Talk to the team
          </a>
        </Reveal>

        <Reveal className="rd-foot" y={20}>
          <span className="rd-foot__brand">TapIn</span>
          <span>The invisible OS for modern hospitality</span>
          <span>© {new Date().getFullYear()} TapIn</span>
        </Reveal>
      </div>
    </section>
  );
}
