import { motion } from 'framer-motion';

import { SmoothScroll } from '../components/layout/SmoothScroll';
import { products } from './content/products';
import { ProductNav } from './components/ProductNav';
import { ProductStage } from './components/ProductStage';
import { ProductTransition } from './components/ProductTransition';
import { ProductUniverse } from './components/ProductUniverse';

interface ProductsPageProps {
  onNavigateShowroom: () => void;
}

export default function ProductsPage({ onNavigateShowroom }: ProductsPageProps) {
  return (
    <motion.div
      key="products-page"
      initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
      animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
      exit={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 min-h-screen overflow-hidden bg-[#050505] text-white"
    >
      <ProductTransition />
      <ProductNav onNavigateShowroom={onNavigateShowroom} />

      <SmoothScroll>
        <main>
          <ProductUniverse products={products} />
          <ProductStage products={products} />
          <ProductsFinale onNavigateShowroom={onNavigateShowroom} />
        </main>
      </SmoothScroll>
    </motion.div>
  );
}

function ProductsFinale({ onNavigateShowroom }: ProductsPageProps) {
  return (
    <section className="relative overflow-hidden px-5 py-24 md:px-10 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(204,255,0,0.12),transparent_42%)]" />
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="mb-8 h-px w-28 bg-gradient-to-r from-transparent via-yuzu to-transparent" />
        <h2 className="max-w-4xl text-[clamp(3.4rem,9vw,9rem)] font-black leading-[0.82] tracking-tighter text-silver">
          One protocol.
          <span className="block font-serif font-normal italic text-yuzu">Every surface.</span>
        </h2>
        <p className="mt-8 max-w-2xl font-mono text-[12px] leading-relaxed tracking-[0.08em] text-silver/58">
          TapIn starts as a button, becomes a passport, speaks through messages, and gives the room an operating system.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onNavigateShowroom}
            className="rounded-full border border-white/12 bg-white/[0.04] px-6 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-silver transition-colors hover:border-yuzu/35 hover:text-white"
          >
            Back to showroom
          </button>
          <a
            href="mailto:hello@tapin.app?subject=TapIn%20Products%20Demo"
            className="rounded-full border border-yuzu/30 bg-yuzu px-6 py-3 font-mono text-[10px] font-extrabold uppercase tracking-[0.2em] text-obsidian shadow-[0_0_22px_rgba(204,255,0,0.22)] transition-transform hover:scale-[1.03]"
          >
            Request demo
          </a>
        </div>
      </div>
    </section>
  );
}
