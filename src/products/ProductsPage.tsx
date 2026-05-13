import { useEffect, useRef, type RefObject } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { MobileRouteHeader } from '../components/layout/MobileRouteHeader';
import { Navbar } from '../components/layout/Navbar';
import { SmoothScroll } from '../components/layout/SmoothScroll';
import type { ShowroomProps } from '../types/showroom';
import { products } from './content/products';
import { KineticWords } from './components/KineticText';
import { ProductStage } from './components/ProductStage';
import { ProductUniverse } from './components/ProductUniverse';

gsap.registerPlugin(ScrollTrigger);

export default function ProductsPage({
  activeView,
  setActiveView,
  routeMode,
  onNavigateProducts,
  onNavigateShowroom,
}: ShowroomProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useProductPageMotion(rootRef);

  return (
    <motion.div
      ref={rootRef}
      key="products-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 min-h-screen overflow-hidden bg-[#050505] text-white"
    >
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        routeMode={routeMode}
        onNavigateProducts={onNavigateProducts}
        onNavigateShowroom={onNavigateShowroom}
      />
      <MobileRouteHeader
        activeView={activeView}
        setActiveView={setActiveView}
        routeMode={routeMode}
        onNavigateProducts={onNavigateProducts}
        onNavigateShowroom={onNavigateShowroom}
      />

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

function ProductsFinale({ onNavigateShowroom }: Pick<ShowroomProps, 'onNavigateShowroom'>) {
  return (
    <section className="relative overflow-hidden px-5 py-24 md:px-10 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(204,255,0,0.12),transparent_42%)]" />
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="mb-8 h-px w-28 bg-gradient-to-r from-transparent via-yuzu to-transparent" />
        <h2 className="products-page-kinetic max-w-4xl text-[clamp(3.4rem,9vw,9rem)] font-black leading-[0.82] tracking-tighter text-silver">
          <KineticWords text="One protocol." />
          <span className="block font-serif font-normal italic text-yuzu">
            <KineticWords text="Every surface." />
          </span>
        </h2>
        <p className="mt-8 max-w-2xl font-mono text-[12px] leading-relaxed tracking-[0.08em] text-silver/58">
          TapIn starts as a button, becomes a passport, speaks through messages, and gives the room an operating system.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => onNavigateShowroom?.()}
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

function useProductPageMotion(scope: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (typeof window === 'undefined' || !scope.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.products-page-kinetic').forEach((title) => {
        const words = title.querySelectorAll('.products-kinetic-word');
        gsap.fromTo(
          words,
          { yPercent: 115, rotateX: -30, opacity: 0, filter: 'blur(10px)' },
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.86,
            stagger: 0.035,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: title,
              start: 'top 84%',
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('.products-soft-reveal').forEach((item) => {
        gsap.fromTo(
          item,
          { y: 28, opacity: 0, filter: 'blur(10px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.72,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 86%',
              once: true,
            },
          }
        );
      });
    }, scope.current);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [scope]);
}
