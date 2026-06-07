import { FloorplanLight } from '../visuals/FloorplanLight';
import { Reveal } from './Reveal';

export function RestaurantLayer() {
  return (
    <section id="restaurants" className="rd-section rd-rest">
      <Reveal className="rd-container rd-head">
        <h2 className="rd-display rd-head__title">
          <span className="rd-line">
            <span className="rd-line__inner">Your floor,</span>
          </span>
          <span className="rd-line">
            <span className="rd-line__inner">
              <span className="rd-accent">choreographed</span>.
            </span>
          </span>
        </h2>
        <p className="rd-lead">
          The whole dining room, live and explorable. Drag across the floor,
          hover any table for real POS data — covers, orders, satisfaction, a
          turnaround clock. The Tetris Agent works the grid in the background so
          the next party always has a seat.
        </p>
      </Reveal>

      <FloorplanLight />
    </section>
  );
}
