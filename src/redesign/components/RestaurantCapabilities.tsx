import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Reveal } from './Reveal';
import { useMediaQuery } from '../motion/useMediaQuery';

gsap.registerPlugin(ScrollTrigger);

type Capability = { no: string; title: string; desc: string; metric: string; sub: string; img: string };

const CAPS: Capability[] = [
  { no: '01', title: 'Tetris Agent', desc: 'Real-time seating that works the grid for you — packing covers, protecting pacing, never leaving a four-top sitting empty.', metric: '+15%', sub: 'RevPASH per shift', img: '/redesign/img/c-spacious.jpg' },
  { no: '02', title: 'No-show shield', desc: 'Predicts the risk, requests a smart deposit when it matters, and auto-releases the table the moment a party ghosts.', metric: '−80%', sub: 'silent no-shows', img: '/redesign/img/c-tables.jpg' },
  { no: '03', title: 'Walk-in Express', desc: 'A tap at the host stand seats walk-ins in seconds — no clipboard, no guesswork, slotted straight into the live floor.', metric: '~4 min', sub: 'average wait', img: '/redesign/img/c-ornate.jpg' },
  { no: '04', title: 'Taste Genome', desc: 'Every guest carries a flavour fingerprint. The OS remembers the Chablis, the allergy, the anniversary — and prompts the server.', metric: '100%', sub: 'of regulars, remembered', img: '/redesign/img/c-plating.jpg' },
  { no: '05', title: 'Gratitude Protocol', desc: 'Tips and thank-yous become live sentiment signals on the floor, so you know which tables are glowing and which need a touch.', metric: '+0.32', sub: 'average sentiment lift', img: '/redesign/img/c-chef.jpg' },
  { no: '06', title: 'Live POS sync', desc: 'Checks, courses and dwell time stream straight into the floor map. One source of truth — zero double entry.', metric: '0', sub: 'manual entries', img: '/redesign/img/c-chandelier.jpg' },
];

const BLIND_COUNT = 22;
const NS = 'http://www.w3.org/2000/svg';

export function RestaurantCapabilities() {
  const isWide = useMediaQuery('(min-width: 768px)');
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // The gallery GROWS from a framed card sitting in the page into full-bleed
  // immersion, then RECEDES back into the page — so it stays part of the web
  // instead of feeling like a separate fullscreen app. The capability photos
  // are revealed through scrubbed SVG-mask blinds. Fully scroll-linked, so
  // scrolling up mirrors the whole sequence (expand/reveals/recede) in reverse.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const root = sectionRef.current;
        const stage = stageRef.current;
        if (!root || !stage) return;

        const w = window.innerWidth;
        const h = window.innerHeight;
        const vbW = 100;
        const vbH = (h / w) * 100;

        const layers = Array.from(root.querySelectorAll<SVGSVGElement>('.rd-capsx__layer'));
        const blindsSets: { top: SVGRectElement; bottom: SVGRectElement; y: number; h: number }[][] = [];

        layers.forEach((svg) => {
          svg.setAttribute('viewBox', `0 0 ${vbW} ${vbH}`);
          svg.querySelectorAll('mask rect').forEach((mr) => {
            mr.setAttribute('width', String(vbW));
            mr.setAttribute('height', String(vbH));
          });
          svg.querySelectorAll('image').forEach((im) => {
            im.setAttribute('width', String(vbW));
            im.setAttribute('height', String(vbH));
          });
          const g = svg.querySelector<SVGGElement>('g[id^="capblinds"]');
          if (!g) return;
          g.innerHTML = '';
          const blindH = vbH / BLIND_COUNT;
          let cy = 0;
          const blinds: { top: SVGRectElement; bottom: SVGRectElement; y: number; h: number }[] = [];
          for (let i = 0; i < BLIND_COUNT; i++) {
            const centerY = vbH - (cy + blindH / 2);
            const rt = document.createElementNS(NS, 'rect') as SVGRectElement;
            const rb = document.createElementNS(NS, 'rect') as SVGRectElement;
            [rt, rb].forEach((r) => {
              r.setAttribute('x', '0');
              r.setAttribute('width', '100');
              r.setAttribute('height', '0');
              r.setAttribute('fill', 'white');
              r.setAttribute('shape-rendering', 'crispEdges');
              r.setAttribute('y', String(centerY));
            });
            g.appendChild(rt);
            g.appendChild(rb);
            blinds.push({ top: rt, bottom: rb, y: centerY, h: blindH / 2 });
            cy += blindH;
          }
          blindsSets.push(blinds);
        });

        const texts = Array.from(root.querySelectorAll<HTMLElement>('.rd-capsx__txt')); // [intro, cap1..cap6]
        const frame = root.querySelector<HTMLElement>('.rd-capsx__frame');
        const tint = root.querySelector<HTMLElement>('.rd-capsx__tint');
        const barFill = root.querySelector<HTMLElement>('.rd-capsx__bar-fill');

        // initial: a framed card on the page; intro shown, capability copy hidden
        if (frame) gsap.set(frame, { scale: 0.9, borderRadius: 28, transformOrigin: '50% 50%' });
        gsap.set(texts[0], { clipPath: 'inset(0% 0% 0% 0%)', y: 0 });
        texts.slice(1).forEach((t) => gsap.set(t, { clipPath: 'inset(100% 0 0 0)', y: 40 }));
        if (tint) gsap.set(tint, { opacity: 0 });

        const openBlinds = (blinds: typeof blindsSets[number]) => {
          const flat = blinds.flatMap((b) => [b.top, b.bottom]);
          const vars = {
            attr: {
              y: (idx: number) => {
                const b = blinds[Math.floor(idx / 2)];
                return idx % 2 === 0 ? b.y - b.h : b.y;
              },
              height: () => blinds[0].h + 0.01,
            },
            ease: 'power3.out',
            duration: 1,
            stagger: { each: 0.022, from: 'start' },
          } as unknown as gsap.TweenVars;
          return gsap.to(flat, vars);
        };
        const textIn = (el: HTMLElement) =>
          gsap.to(el, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.5, ease: 'expo.out' });
        const textOut = (el: HTMLElement) =>
          gsap.to(el, { clipPath: 'inset(0% 0% 100% 0%)', y: -30, duration: 1.2, ease: 'power2.inOut' });

        const master = gsap.timeline({
          scrollTrigger: { trigger: stage, start: 'top top', end: 'bottom bottom', scrub: 2.6 },
        });

        // 1) the card expands from the page into full-bleed (intro still showing)
        if (frame) master.to(frame, { scale: 1, borderRadius: 0, duration: 1.4, ease: 'power3.out' }, 0);
        if (tint) master.to(tint, { opacity: 1, duration: 1.4, ease: 'power2.out' }, '>-0.6');

        // 2) the capability reveals
        blindsSets.forEach((blinds, li) => {
          master.add(openBlinds(blinds));
          master.add(textOut(texts[li]), '<+=0.15');
          master.add(textIn(texts[li + 1]), '-=0.3');
        });

        // 3) the immersion recedes back into a card and dissolves into the page
        if (frame) master.to(frame, { scale: 0.92, borderRadius: 28, autoAlpha: 0, duration: 1.4, ease: 'power2.in' }, '+=0.4');

        ScrollTrigger.create({
          trigger: stage,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
          onUpdate: (self) => {
            // single fill line across the active reveal window (skip expand/recede)
            if (barFill) barFill.style.transform = `scaleX(${gsap.utils.clamp(0, 1, (self.progress - 0.08) / 0.8)})`;
          },
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [isWide] }
  );

  return (
    <section id="capabilities" ref={sectionRef} className="rd-section rd-capsx">
      {isWide ? (
        <div className="rd-capsx__stage" ref={stageRef}>
          <div className="rd-capsx__layers">
            <div className="rd-capsx__frame">
              <div className="rd-capsx__media">
                {CAPS.map((c, i) => (
                  <svg key={c.no} className="rd-capsx__layer" viewBox="0 0 100 56" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <mask id={`capmask${i}`} maskUnits="userSpaceOnUse">
                        <rect x="0" y="0" width="100" height="56" fill="black" />
                        <g id={`capblinds${i}`} />
                      </mask>
                    </defs>
                    <image href={c.img} x="0" y="0" width="100" height="56" preserveAspectRatio="xMidYMid slice" mask={`url(#capmask${i})`} />
                  </svg>
                ))}
                <div className="rd-capsx__tint" aria-hidden="true" />
              </div>

              <div className="rd-capsx__texts">
                {/* frame 0 — the intro, on sand inside the card */}
                <div className="rd-capsx__txt rd-capsx__txt--intro">
                  <span className="rd-capsx__kicker">The Hospitality OS</span>
                  <h2 className="rd-capsx__lead-title rd-display">
                    Everything the room needs, <span className="rd-accent">running quietly</span>.
                  </h2>
                  <p className="rd-capsx__lead-p">
                    One system working the floor while your team works the guests. Keep
                    scrolling — here&rsquo;s what runs underneath.
                  </p>
                </div>

                {/* frames 1–6 — the capabilities, over photography */}
                {CAPS.map((c) => (
                  <div className="rd-capsx__txt" key={c.no}>
                    <div className="rd-capsx__no">{c.no} — 06</div>
                    <h3 className="rd-capsx__title">{c.title}</h3>
                    <p className="rd-capsx__desc">{c.desc}</p>
                    <div className="rd-capsx__metric">
                      {c.metric} <span>{c.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rd-capsx__bar" aria-hidden="true">
                <div className="rd-capsx__bar-fill" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rd-container rd-capsx__stack">
          <div className="rd-capsx__m-intro">
            <span className="rd-capsx__kicker">The Hospitality OS</span>
            <h2 className="rd-display rd-capsx__lead-title">
              Everything the room needs, <span className="rd-accent">running quietly</span>.
            </h2>
          </div>
          {CAPS.map((c) => (
            <Reveal key={c.no} className="rd-capsx__m" y={30}>
              <figure className="rd-capsx__m-photo">
                <img src={c.img} alt="" loading="lazy" />
                <span className="rd-capsx__m-tint" aria-hidden="true" />
                <div className="rd-capsx__m-text">
                  <div className="rd-capsx__no">{c.no} — 06</div>
                  <h3 className="rd-capsx__title">{c.title}</h3>
                  <div className="rd-capsx__metric">{c.metric} <span>{c.sub}</span></div>
                </div>
              </figure>
              <p className="rd-capsx__desc rd-capsx__desc--m">{c.desc}</p>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
