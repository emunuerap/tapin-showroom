import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import type { ProductDefinition, ProductId } from '../content/products';

interface ProductOrbitMapProps {
  products: ProductDefinition[];
}

const positions: Record<ProductId, { x: number; y: number }> = {
  'web-sdk': { x: 50, y: 14 },
  'consumer-app': { x: 82, y: 32 },
  'hospitality-os': { x: 82, y: 68 },
  messaging: { x: 50, y: 76 },
  'ai-core': { x: 18, y: 68 },
  integrations: { x: 18, y: 32 },
};

const ORDER: ProductId[] = ['web-sdk', 'consumer-app', 'hospitality-os', 'messaging', 'ai-core', 'integrations'];

export function ProductOrbitMap({ products }: ProductOrbitMapProps) {
  const [active, setActive] = useState<ProductDefinition>(products[0]);
  const [hoveredId, setHoveredId] = useState<ProductId | null>(null);

  /* ─── REFS for RAF-driven animation ─────────────────────────────────── */
  const ring1Ref = useRef<SVGGElement>(null); // outermost dotted ring (r=44)
  const ring2Ref = useRef<SVGGElement>(null); // mid dashed ring (r=37)
  const ring3Ref = useRef<SVGGElement>(null); // inner solid ring (r=30)
  const coreGlowRef = useRef<SVGCircleElement>(null);

  // Per-node refs for breathing
  const nodeRefs = useRef<Map<ProductId, SVGGElement>>(new Map());

  // Per-line refs for dash animation
  const lineRefs = useRef<Map<ProductId, SVGLineElement>>(new Map());

  // Heartbeat pulse — one circle that travels from core to a chosen node
  const pulseRef = useRef<SVGCircleElement>(null);
  const pulseTrailRef = useRef<SVGCircleElement>(null);

  // Live refs so the RAF can read state without re-mounting on every change
  const activeIdRef = useRef<ProductId>(products[0].id);
  const hoveredIdRef = useRef<ProductId | null>(null);

  useEffect(() => {
    activeIdRef.current = active.id;
  }, [active.id]);

  useEffect(() => {
    hoveredIdRef.current = hoveredId;
  }, [hoveredId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const start = performance.now();
    let raf = 0;

    // Pulse state
    let lastPulseAt = start - 1500; // start first pulse soon after mount
    const PULSE_INTERVAL = 2800; // ms between pulses
    const PULSE_DURATION = 1000; // ms travel from core to node
    let pulseTarget: ProductId = 'web-sdk';
    let pulseStartedAt = start;
    let pulseActive = false;

    const tick = () => {
      const now = performance.now();
      const tSec = (now - start) / 1000;

      /* Ring rotations — counter-rotating to feel alive but not dizzy */
      if (ring1Ref.current) ring1Ref.current.setAttribute('transform', `rotate(${(tSec * 4.5) % 360} 50 50)`);
      if (ring2Ref.current) ring2Ref.current.setAttribute('transform', `rotate(${(-tSec * 7) % 360} 50 50)`);
      if (ring3Ref.current) ring3Ref.current.setAttribute('transform', `rotate(${(tSec * 2.3) % 360} 50 50)`);

      /* Core glow — slow breathing */
      if (coreGlowRef.current) {
        const breath = 21 + Math.sin(tSec * 1.1) * 0.6;
        coreGlowRef.current.setAttribute('r', String(breath));
      }

      /* Node breathing — each at a different phase, ~ ±8% scale */
      ORDER.forEach((id, i) => {
        const g = nodeRefs.current.get(id);
        if (!g) return;
        const pos = positions[id];
        const breath = 1 + Math.sin(tSec * 1.45 + i * 0.85) * 0.085;
        // SVG transform that scales around the node center
        g.setAttribute(
          'transform',
          `translate(${pos.x} ${pos.y}) scale(${breath}) translate(${-pos.x} ${-pos.y})`,
        );
      });

      /* Heartbeat — emit pulse to a node every PULSE_INTERVAL */
      if (!pulseActive && now - lastPulseAt > PULSE_INTERVAL) {
        pulseActive = true;
        pulseStartedAt = now;
        lastPulseAt = now;
        // Prefer the hovered/active node so the pulse "responds" to the user,
        // otherwise rotate through ORDER. Read live refs (not closure) so we
        // don't re-mount the RAF on every hover.
        const candidate = (hoveredIdRef.current || activeIdRef.current) as ProductId;
        const idx = ORDER.indexOf(candidate);
        const next = ORDER[(idx + Math.floor(Math.random() * 5) + 1) % ORDER.length];
        pulseTarget = next;
      }

      if (pulseActive && pulseRef.current && pulseTrailRef.current) {
        const elapsed = (now - pulseStartedAt) / PULSE_DURATION;
        const p = Math.min(1, elapsed);
        const easeP = 1 - Math.pow(1 - p, 3); // ease-out-cubic
        const target = positions[pulseTarget];
        const cx = 50 + (target.x - 50) * easeP;
        const cy = 50 + (target.y - 50) * easeP;
        pulseRef.current.setAttribute('cx', String(cx));
        pulseRef.current.setAttribute('cy', String(cy));
        pulseRef.current.setAttribute('opacity', String(p < 1 ? 0.95 - p * 0.35 : 0));

        // Trail — same path, slightly behind, more transparent, larger
        const trailP = Math.max(0, easeP - 0.12);
        const trailCx = 50 + (target.x - 50) * trailP;
        const trailCy = 50 + (target.y - 50) * trailP;
        pulseTrailRef.current.setAttribute('cx', String(trailCx));
        pulseTrailRef.current.setAttribute('cy', String(trailCy));
        pulseTrailRef.current.setAttribute('opacity', String(p < 1 ? 0.45 - p * 0.25 : 0));

        if (p >= 1) {
          // Pulse arrived — flash the destination node briefly
          const targetG = nodeRefs.current.get(pulseTarget);
          if (targetG) {
            const inner = targetG.querySelector('circle');
            if (inner) {
              const orig = inner.getAttribute('fill') || '';
              inner.setAttribute('fill', 'rgba(204,255,0,1)');
              window.setTimeout(() => inner.setAttribute('fill', orig), 220);
            }
          }
          pulseActive = false;
        }
      }

      /* Dash-offset radar sweep on the outer dotted ring */
      if (ring1Ref.current) {
        const dotted = ring1Ref.current.querySelector('circle');
        if (dotted) {
          dotted.setAttribute('stroke-dashoffset', String((tSec * 12) % 50));
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // Empty deps — RAF runs for the lifetime of the component. State is read
    // through activeIdRef / hoveredIdRef so hover changes don't reset rotation.
  }, []);

  const registerNode = (id: ProductId) => (el: SVGGElement | null) => {
    if (el) nodeRefs.current.set(id, el);
    else nodeRefs.current.delete(id);
  };
  const registerLine = (id: ProductId) => (el: SVGLineElement | null) => {
    if (el) lineRefs.current.set(id, el);
    else lineRefs.current.delete(id);
  };

  return (
    <div className="relative mx-auto grid w-full max-w-[360px] gap-5 md:max-w-[620px]">
      <div className="relative aspect-square w-full">
        {/* Ambient halos behind everything */}
        <div className="absolute inset-[6%] rounded-full bg-[conic-gradient(from_120deg,rgba(204,255,0,0.18),transparent_18%,rgba(255,255,255,0.1)_34%,transparent_54%,rgba(204,255,0,0.2)_78%,transparent)] opacity-70 blur-2xl" />
        <div className="absolute inset-[18%] rounded-full border border-yuzu/10 bg-[radial-gradient(circle,rgba(204,255,0,0.11),transparent_58%)] shadow-[inset_0_0_80px_rgba(204,255,0,0.05)]" />
        <div className="absolute inset-[32%] rounded-full bg-yuzu/[0.035] blur-2xl" />

        {/* SVG layer — rings, nodes, lines, pulse */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <radialGradient id="product-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(204,255,0,0.32)" />
              <stop offset="100%" stopColor="rgba(204,255,0,0)" />
            </radialGradient>
            <linearGradient id="product-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(204,255,0,0.65)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
            </linearGradient>
            <filter id="product-node-glow">
              <feGaussianBlur stdDeviation="1.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="pulse-glow">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ring 1 — outermost, dotted, slow rotation + dash sweep */}
          <g ref={ring1Ref}>
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.045)" strokeDasharray="0.8 3.8" />
          </g>

          {/* Ring 2 — mid, dashed, counter-rotating */}
          <g ref={ring2Ref}>
            <circle cx="50" cy="50" r="37" fill="none" stroke="rgba(204,255,0,0.12)" strokeDasharray="18 10" />
          </g>

          {/* Ring 3 — inner, slow rotation */}
          <g ref={ring3Ref}>
            <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.08)" />
          </g>

          {/* Core glow — breathes */}
          <circle ref={coreGlowRef} cx="50" cy="50" r="21" fill="url(#product-core-glow)" stroke="rgba(204,255,0,0.18)" />

          {/* Background micro-dots on outer ring (static — they belong to the
              outermost halo, not the rotating group) */}
          {Array.from({ length: 24 }).map((_, index) => {
            const angle = (index / 24) * Math.PI * 2;
            const x = 50 + Math.cos(angle) * 43.5;
            const y = 50 + Math.sin(angle) * 43.5;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="0.32"
                fill={index % 3 === 0 ? 'rgba(204,255,0,0.5)' : 'rgba(255,255,255,0.16)'}
              />
            );
          })}

          {/* Lines from core to nodes */}
          {products.map((product, index) => {
            const point = positions[product.id];
            const isActive = active.id === product.id;
            const isHovered = hoveredId === product.id;
            const accent = isActive || isHovered;
            return (
              <motion.line
                key={`line-${product.id}`}
                ref={registerLine(product.id)}
                x1="50"
                y1="50"
                x2={point.x}
                y2={point.y}
                stroke={accent ? 'url(#product-line)' : 'rgba(255,255,255,0.1)'}
                strokeWidth={accent ? 0.5 : 0.22}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: accent ? 1 : 0.55 }}
                transition={{ duration: 0.72, delay: 0.08 * index, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          })}

          {/* Heartbeat pulse — single particle traveling along the active line */}
          <circle
            ref={pulseTrailRef}
            cx="50"
            cy="50"
            r="1.4"
            fill="rgba(204,255,0,0.5)"
            opacity="0"
            filter="url(#pulse-glow)"
          />
          <circle
            ref={pulseRef}
            cx="50"
            cy="50"
            r="0.95"
            fill="rgba(255,255,255,0.98)"
            opacity="0"
            filter="url(#pulse-glow)"
          />

          {/* Nodes — wrapped in <g> for transform-based breathing */}
          {products.map((product) => {
            const point = positions[product.id];
            const isActive = active.id === product.id;
            return (
              <g key={`node-${product.id}`} ref={registerNode(product.id)}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isActive ? 1.25 : 0.72}
                  fill={isActive ? 'rgba(204,255,0,0.95)' : 'rgba(255,255,255,0.32)'}
                  filter={isActive ? 'url(#product-node-glow)' : undefined}
                />
              </g>
            );
          })}
        </svg>

        {/* Core TapIn nucleus */}
        <div className="absolute left-1/2 top-1/2 grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-yuzu/32 bg-[#070707]/92 shadow-[0_0_90px_rgba(204,255,0,0.2),inset_0_0_48px_rgba(204,255,0,0.08)] backdrop-blur-xl md:h-48 md:w-48">
          <div className="absolute inset-2 rounded-full border border-white/8" />
          <div className="absolute inset-5 rounded-full border border-yuzu/14" />
          <motion.div
            className="absolute inset-9 rounded-full bg-[conic-gradient(from_180deg,transparent,rgba(204,255,0,0.28),transparent_42%,rgba(255,255,255,0.14),transparent)] opacity-60"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />
          <div className="text-center">
            <div className="font-serif text-4xl italic leading-none text-yuzu drop-shadow-[0_0_18px_rgba(204,255,0,0.32)] md:text-5xl">TapIn</div>
            <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.26em] text-silver/48 md:text-[9px]">Product Core</div>
            <div className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-yuzu/65 to-transparent" />
          </div>
        </div>

        {/* Clickable / hoverable node labels */}
        {products.map((product, index) => {
          const point = positions[product.id];
          const isActive = active.id === product.id;
          return (
            <button
              key={product.id}
              type="button"
              onMouseEnter={() => {
                setActive(product);
                setHoveredId(product.id);
              }}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setActive(product)}
              onClick={() => setActive(product)}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-left"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            >
              <motion.span
                className={`flex min-w-[4.8rem] items-center gap-1.5 rounded-full border px-2 py-1.5 shadow-[0_14px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-colors md:min-w-[8.4rem] md:gap-2 md:px-3 md:py-2 ${
                  isActive
                    ? 'border-yuzu/50 bg-yuzu/[0.11] text-white shadow-[0_0_32px_rgba(204,255,0,0.22)]'
                    : 'border-white/10 bg-white/[0.035] text-silver/58 hover:text-white'
                }`}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.48, delay: 0.14 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-yuzu' : 'bg-white/25'}`} />
                <span className="font-mono text-[7px] uppercase tracking-[0.12em] md:hidden">{getMobileProductLabel(product.id)}</span>
                <span className="hidden font-mono text-[9px] uppercase tracking-[0.18em] md:inline">{product.name}</span>
              </motion.span>
            </button>
          );
        })}
      </div>

      <div className="z-[60] w-full rounded-2xl border border-white/10 bg-[#080808]/88 p-4 text-center shadow-[0_22px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl md:hidden">
        <ActiveProductNote active={active} />
      </div>

      <div className="absolute left-0 top-[58%] z-[60] hidden w-80 rounded-2xl border border-white/10 bg-[#080808] p-4 text-left shadow-[0_22px_70px_rgba(0,0,0,0.45)] md:block">
        <ActiveProductNote active={active} />
      </div>
    </div>
  );
}

function ActiveProductNote({ active }: { active: ProductDefinition }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={active.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28 }}
      >
        <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-yuzu/72">{active.eyebrow}</div>
        <p className="mt-2 text-sm leading-relaxed text-silver/72">{active.description}</p>
      </motion.div>
    </AnimatePresence>
  );
}

function getMobileProductLabel(id: ProductId) {
  const labels: Record<ProductId, string> = {
    'web-sdk': 'Web SDK',
    'consumer-app': 'App',
    'hospitality-os': 'OS',
    messaging: 'Messaging',
    'ai-core': 'AI Core',
    integrations: 'Integrations',
  };

  return labels[id];
}
