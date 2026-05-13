import { KineticWords } from './KineticText';
import { ProductOrbitMap } from './ProductOrbitMap';
import type { ProductDefinition } from '../content/products';

interface ProductUniverseProps {
  products: ProductDefinition[];
}

export function ProductUniverse({ products }: ProductUniverseProps) {
  return (
    <section className="relative min-h-screen w-screen max-w-[100vw] overflow-hidden px-5 pt-28 md:px-10 md:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_36%,rgba(204,255,0,0.16),transparent_34%),radial-gradient(circle_at_12%_74%,rgba(255,196,87,0.06),transparent_34%)]" />
      <div className="absolute inset-0 opacity-[0.09] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:80px_80px]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#050505]" />

      <div className="relative z-10 mx-auto grid w-full min-w-0 max-w-7xl items-center gap-10 overflow-hidden lg:grid-cols-[0.86fr_1.14fr]">
        <div className="min-w-0">
          <div className="products-soft-reveal mb-8 h-px w-24 bg-gradient-to-r from-yuzu to-transparent" />
          <h1 className="products-page-kinetic max-w-[calc(100vw-2.5rem)] text-[clamp(2.75rem,11.2vw,3.6rem)] font-black leading-[0.86] tracking-tighter text-silver md:max-w-3xl md:text-[clamp(3.6rem,8.2vw,8.6rem)] md:leading-[0.82]">
            <KineticWords text="The TapIn" />
            <span className="block font-serif font-normal italic text-yuzu drop-shadow-[0_0_34px_rgba(204,255,0,0.24)] md:hidden">
              <KineticWords text="Product" />
            </span>
            <span className="block font-serif font-normal italic text-yuzu drop-shadow-[0_0_34px_rgba(204,255,0,0.24)] md:hidden">
              <KineticWords text="Universe." />
            </span>
            <span className="hidden font-serif font-normal italic text-yuzu drop-shadow-[0_0_34px_rgba(204,255,0,0.24)] md:block">
              <KineticWords text="Product Universe." />
            </span>
          </h1>
          <p
            className="mt-8 max-w-[calc(100vw-2.5rem)] font-mono text-[12px] leading-relaxed tracking-[0.08em] text-silver/62 md:max-w-xl"
          >
            Not a feature list. A connected hospitality stack: widget, app, operating system,
            messaging, AI core, payments, and integrations moving as one protocol.
          </p>
          <div className="products-soft-reveal mt-10 flex flex-wrap gap-3">
            {['Web', 'App', 'OS', 'Messages', 'AI', 'Integrations'].map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-silver/58"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <ProductOrbitMap products={products} />
      </div>
    </section>
  );
}
