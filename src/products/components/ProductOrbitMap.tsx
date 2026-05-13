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
    <div className="relative mx-auto aspect-square w-full max-w-[300px] md:max-w-[520px] xl:max-w-[600px]">
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(204,255,0,0.12),transparent_58%)] blur-xl" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <radialGradient id="product-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(204,255,0,0.28)" />
            <stop offset="100%" stopColor="rgba(204,255,0,0)" />
          </radialGradient>
          <linearGradient id="product-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(204,255,0,0.58)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="39" fill="none" stroke="rgba(255,255,255,0.05)" strokeDasharray="0.8 4" />
        <circle cx="50" cy="50" r="31" fill="none" stroke="rgba(204,255,0,0.16)" />
        <circle cx="50" cy="50" r="22" fill="url(#product-core-glow)" stroke="rgba(204,255,0,0.16)" />
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
                stroke={isActive ? 'url(#product-line)' : 'rgba(255,255,255,0.1)'}
                strokeWidth={isActive ? 0.5 : 0.22}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isActive ? 1 : 0.55 }}
                transition={{ duration: 0.72, delay: 0.08 * index, ease: [0.16, 1, 0.3, 1] }}
              />
            </g>
          );
        })}
      </svg>

      <div className="absolute left-1/2 top-1/2 grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-yuzu/32 bg-[#070707]/92 shadow-[0_0_90px_rgba(204,255,0,0.18),inset_0_0_42px_rgba(204,255,0,0.07)] backdrop-blur-xl md:h-48 md:w-48">
        <div className="absolute inset-3 rounded-full border border-white/8" />
        <div className="absolute inset-8 rounded-full border border-yuzu/12" />
        <div className="text-center">
          <div className="font-serif text-4xl italic leading-none text-yuzu md:text-5xl">TapIn</div>
          <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.28em] text-silver/42">Product Core</div>
          <div className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-yuzu/65 to-transparent" />
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

      <div className="absolute bottom-4 left-1/2 z-[60] w-[min(88%,30rem)] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#080808] p-4 text-center shadow-[0_22px_70px_rgba(0,0,0,0.45)] md:hidden">
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
