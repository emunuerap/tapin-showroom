import { useState } from 'react';
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

export function ProductOrbitMap({ products }: ProductOrbitMapProps) {
  const [active, setActive] = useState<ProductDefinition>(products[0]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[620px]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <radialGradient id="product-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(204,255,0,0.28)" />
            <stop offset="100%" stopColor="rgba(204,255,0,0)" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="1 4" />
        <circle cx="50" cy="50" r="22" fill="url(#product-core-glow)" />
        {products.map((product, index) => {
          const point = positions[product.id];
          const isActive = active.id === product.id;
          return (
            <g key={product.id}>
              <motion.line
                x1="50"
                y1="50"
                x2={point.x}
                y2={point.y}
                stroke={isActive ? 'rgba(204,255,0,0.55)' : 'rgba(255,255,255,0.11)'}
                strokeWidth={isActive ? 0.42 : 0.22}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isActive ? 1 : 0.55 }}
                transition={{ duration: 0.72, delay: 0.08 * index, ease: [0.16, 1, 0.3, 1] }}
              />
            </g>
          );
        })}
      </svg>

      <div className="absolute left-1/2 top-1/2 grid h-36 w-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-yuzu/30 bg-[#070707]/86 shadow-[0_0_70px_rgba(204,255,0,0.13)] backdrop-blur-xl md:h-44 md:w-44">
        <div className="text-center">
          <div className="font-serif text-4xl italic leading-none text-yuzu md:text-5xl">TapIn</div>
          <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.28em] text-silver/42">Product Core</div>
        </div>
      </div>

      {products.map((product, index) => {
        const point = positions[product.id];
        const isActive = active.id === product.id;
        return (
          <button
            key={product.id}
            type="button"
            onMouseEnter={() => setActive(product)}
            onFocus={() => setActive(product)}
            onClick={() => setActive(product)}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-left"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            <motion.span
              className={`flex min-w-[5.6rem] items-center gap-2 rounded-full border px-2.5 py-2 backdrop-blur-xl transition-colors md:min-w-[8.4rem] md:px-3 ${
                isActive
                  ? 'border-yuzu/50 bg-yuzu/[0.09] text-white shadow-[0_0_28px_rgba(204,255,0,0.18)]'
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

      <div className="absolute bottom-4 left-1/2 z-[60] w-[min(88%,30rem)] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#080808] p-4 text-center shadow-[0_22px_70px_rgba(0,0,0,0.45)] md:hidden">
        <ActiveProductNote active={active} />
      </div>

      <div className="absolute bottom-10 left-0 z-[60] hidden w-80 rounded-2xl border border-white/10 bg-[#080808] p-4 text-left shadow-[0_22px_70px_rgba(0,0,0,0.45)] md:block">
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
        initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
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
