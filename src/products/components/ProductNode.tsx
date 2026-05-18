import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

import type { ProductDefinition } from '../content/products';

interface ProductNodeProps {
  product: ProductDefinition;
  active: boolean;
  muted?: boolean;
  className?: string;
  style?: CSSProperties;
  onActivate: (product: ProductDefinition) => void;
}

export function ProductNode({
  product,
  active,
  muted = false,
  className = '',
  style,
  onActivate,
}: ProductNodeProps) {
  return (
    <motion.button
      type="button"
      className={`group relative z-20 w-[9.7rem] rounded-2xl border border-transparent px-3 py-3 text-left outline-none backdrop-blur-xl transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-yuzu/70 ${className}`}
      style={style}
      initial={{ opacity: 0, y: 12, scale: 0.94 }}
      animate={{
        opacity: muted ? 0.44 : 1,
        y: active ? -2 : 0,
        scale: active ? 1.035 : 1,
      }}
      whileHover={{ y: -4, scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => onActivate(product)}
      onFocus={() => onActivate(product)}
      onClick={() => onActivate(product)}
    >
      <span
        className={`pointer-events-none absolute inset-0 rounded-2xl border transition-opacity duration-300 ${
          active
            ? 'border-yuzu/45 bg-[radial-gradient(circle_at_18%_10%,rgba(204,255,0,0.14),transparent_48%)] opacity-100 shadow-[0_0_34px_rgba(204,255,0,0.10)]'
            : 'border-white/8 bg-white/[0.025] opacity-100 group-hover:border-yuzu/24 group-hover:bg-white/[0.035]'
        }`}
      />
      <span className="relative z-10 flex items-start gap-3">
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border font-serif text-sm italic leading-none transition-colors duration-300 ${
            active
              ? 'border-yuzu/55 bg-yuzu/12 text-yuzu'
              : 'border-white/10 bg-black/30 text-silver/58 group-hover:border-yuzu/28 group-hover:text-yuzu'
          }`}
        >
          {String(product.index).padStart(2, '0')}
        </span>
        <span className="min-w-0 pt-0.5">
          <span className="mb-2 flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                active ? 'bg-yuzu shadow-[0_0_12px_rgba(204,255,0,0.75)]' : 'bg-silver/28'
              }`}
            />
            <span className="font-mono text-[7px] uppercase tracking-[0.24em] text-silver/38">
              {product.eyebrow}
            </span>
          </span>
          <span className="block text-[13px] font-semibold leading-tight text-silver">
            {product.name}
          </span>
        </span>
      </span>
    </motion.button>
  );
}
