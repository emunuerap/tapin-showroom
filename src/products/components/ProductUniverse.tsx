import { motion } from 'framer-motion';

import { ProductOrbitMap } from './ProductOrbitMap';
import type { ProductDefinition } from '../content/products';

interface ProductUniverseProps {
  products: ProductDefinition[];
}

export function ProductUniverse({ products }: ProductUniverseProps) {
  return (
    <section className="relative min-h-screen overflow-hidden px-5 pt-32 md:px-10 md:pt-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(204,255,0,0.12),transparent_38%),radial-gradient(circle_at_15%_78%,rgba(255,196,87,0.06),transparent_34%)]" />
      <div className="absolute inset-0 opacity-[0.11] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:80px_80px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.86fr_1.14fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 h-px w-24 bg-gradient-to-r from-yuzu to-transparent"
          />
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="max-w-3xl text-[clamp(3.6rem,8.2vw,8.6rem)] font-black leading-[0.82] tracking-tighter text-silver"
          >
            The TapIn
            <span className="block font-serif font-normal italic text-yuzu drop-shadow-[0_0_34px_rgba(204,255,0,0.24)]">
              Product Universe.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
            className="mt-8 max-w-xl font-mono text-[12px] leading-relaxed tracking-[0.08em] text-silver/62"
          >
            Not a feature list. A connected hospitality stack: widget, app, operating system,
            messaging, AI core, payments, and integrations moving as one protocol.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1], delay: 0.34 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            {['Web', 'App', 'OS', 'Messages', 'AI', 'Integrations'].map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-silver/54"
              >
                {label}
              </span>
            ))}
          </motion.div>
        </div>

        <ProductOrbitMap products={products} />
      </div>
    </section>
  );
}
