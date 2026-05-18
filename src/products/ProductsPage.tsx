import { useEffect, useRef, type RefObject } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { MobileRouteHeader } from '../components/layout/MobileRouteHeader';
import { Navbar } from '../components/layout/Navbar';
import type { ShowroomProps } from '../types/showroom';
import { products } from './content/products';
import { ProductStage } from './components/ProductStage';
import { ProductUniverseHero } from './components/ProductUniverseHero';
import { SplitChars } from '../components/ui/SplitChars';

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

      {/* ─── CONTINUOUS GLOBAL AMBIENT ───────────────────────────────────
          One single warm-gradient layer that spans the WHOLE page (fixed
          to viewport), so sections don't have abrupt black cuts between
          them. Sections are now transparent and float over this. */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* Warm radial pools, drifting slowly */}
        <div className="absolute -left-[12%] top-[8%] h-[68vmin] w-[68vmin] rounded-full bg-[radial-gradient(circle,rgba(255,170,70,0.10)_0%,transparent_62%)] blur-3xl [animation:pp-drift-1_28s_ease-in-out_infinite_alternate]" />
        <div className="absolute right-[-10%] top-[20%] h-[58vmin] w-[58vmin] rounded-full bg-[radial-gradient(circle,rgba(204,255,0,0.08)_0%,transparent_64%)] blur-3xl [animation:pp-drift-2_34s_ease-in-out_infinite_alternate]" />
        <div className="absolute left-[18%] bottom-[8%] h-[52vmin] w-[52vmin] rounded-full bg-[radial-gradient(circle,rgba(220,120,60,0.07)_0%,transparent_66%)] blur-3xl [animation:pp-drift-3_31s_ease-in-out_infinite_alternate]" />
        <div className="absolute right-[10%] bottom-[12%] h-[44vmin] w-[44vmin] rounded-full bg-[radial-gradient(circle,rgba(255,200,90,0.08)_0%,transparent_62%)] blur-3xl [animation:pp-drift-4_27s_ease-in-out_infinite_alternate]" />
        {/* Soft vignette to focus the centre without hard cuts */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(5,5,5,0.55)_100%)]" />
      </div>
      <style>{`
        @keyframes pp-drift-1 { 0% { transform: translate3d(0,0,0) scale(1); } 100% { transform: translate3d(40px,30px,0) scale(1.08); } }
        @keyframes pp-drift-2 { 0% { transform: translate3d(0,0,0) scale(1.04); } 100% { transform: translate3d(-50px,40px,0) scale(0.96); } }
        @keyframes pp-drift-3 { 0% { transform: translate3d(0,0,0) scale(0.98); } 100% { transform: translate3d(60px,-30px,0) scale(1.06); } }
        @keyframes pp-drift-4 { 0% { transform: translate3d(0,0,0); } 100% { transform: translate3d(-40px,-50px,0) scale(1.05); } }
      `}</style>

      {/* Lenis SmoothScroll is now applied at the App root (single instance). */}
      <main>
        <ProductUniverseHero products={products} />
        <ProductStage products={products} />
        <ProductsFinale onNavigateShowroom={onNavigateShowroom} />
      </main>
    </motion.div>
  );
}

function ProductsFinale({ onNavigateShowroom }: Pick<ShowroomProps, 'onNavigateShowroom'>) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-5 py-24 md:px-10 md:py-32">
      {/* ─── BACKGROUND DEPTH STACK ────────────────────────────────────────
          Six layered light sources + a slow rotating conic ring + grid +
          vignette. This is what turns the section from "a paragraph with
          two buttons" into a cinematic stage. */}
      <div className="absolute inset-0 -z-10">
        {/* Massive halo top-center */}
        <div className="absolute left-1/2 top-[8%] h-[140vmin] w-[140vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(204,255,0,0.13)_0%,rgba(204,255,0,0.04)_28%,transparent_62%)] blur-2xl" />
        {/* Two side glows */}
        <div className="absolute -left-[12%] top-[40%] h-[58vmin] w-[58vmin] rounded-full bg-[radial-gradient(circle,rgba(204,255,0,0.06),transparent_60%)] blur-3xl" />
        <div className="absolute -right-[12%] top-[55%] h-[64vmin] w-[64vmin] rounded-full bg-[radial-gradient(circle,rgba(204,255,0,0.05),transparent_60%)] blur-3xl" />

        {/* Slow rotating conic ring behind the wordmark — echoes the orbit
            core from the hero, but bigger and slower. Pure CSS animation. */}
        <div className="absolute left-1/2 top-1/2 h-[78vmin] w-[78vmin] -translate-x-1/2 -translate-y-1/2 opacity-50">
          <div className="absolute inset-0 animate-[finale-spin_38s_linear_infinite] rounded-full bg-[conic-gradient(from_140deg,transparent_0deg,rgba(204,255,0,0.32)_60deg,transparent_140deg,rgba(255,255,255,0.18)_220deg,transparent_320deg)] [mask-image:radial-gradient(circle,transparent_55%,#000_56%,#000_60%,transparent_61%)]" />
          <div className="absolute inset-[6%] animate-[finale-spin-reverse_55s_linear_infinite] rounded-full border border-yuzu/15" />
          <div className="absolute inset-[14%] rounded-full border border-white/8" />
          <div className="absolute inset-[24%] rounded-full bg-[radial-gradient(circle,rgba(204,255,0,0.08),transparent_70%)] blur-2xl" />
        </div>

        {/* Subtle grid texture — only on the lower half so it doesn't fight
            the wordmark */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:110px_110px] [mask-image:linear-gradient(to_top,#000,transparent)]" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,5,0.7)_75%,#050505_100%)]" />
      </div>

      {/* Keyframes for the rotating ring (kept local to this section) */}
      <style>{`
        @keyframes finale-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes finale-spin-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
      `}</style>

      {/* ─── FOREGROUND CONTENT ────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        {/* Eyebrow with two flanking lines — matches the brand pattern */}
        <span className="mb-10 inline-flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-yuzu/72 md:text-[11px]">
          <span className="block h-px w-10 bg-yuzu/30 md:w-14" />
          The protocol
          <span className="block h-px w-10 bg-yuzu/30 md:w-14" />
        </span>

        {/* Cumbre headline — two-tone, two-line, char-stagger reveal */}
        <h2 className="products-finale-headline relative max-w-5xl text-[clamp(3rem,11vw,10.5rem)] font-black leading-[0.84] tracking-tight text-silver">
          <span className="block">
            <SplitChars
              text="One protocol."
              trigger="scroll"
              stagger={0.026}
              rotateJitter={10}
              duration={1.0}
            />
          </span>
          <span
            className="mt-1 block font-serif font-normal italic text-yuzu drop-shadow-[0_0_56px_rgba(204,255,0,0.32)] md:mt-2"
          >
            <SplitChars
              text="Every surface."
              trigger="scroll"
              delay={0.38}
              stagger={0.028}
              rotateJitter={14}
              duration={1.1}
            />
          </span>
        </h2>

        {/* Signature line — slightly larger, in serif, sets the tone */}
        <p className="mt-14 max-w-2xl font-serif text-[15px] italic leading-relaxed text-silver/72 md:mt-16 md:text-[17px]">
          TapIn starts as a button. Becomes a passport. Speaks through messages.
          And gives the room an operating system.
        </p>

        {/* Single hero CTA + quiet secondary link */}
        <div className="mt-14 flex flex-col items-center gap-5 md:mt-16">
          <a
            href="mailto:hello@tapin.app?subject=TapIn%20Products%20Demo"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-yuzu px-10 py-4 font-mono text-[11px] font-extrabold uppercase tracking-[0.28em] text-obsidian shadow-[0_0_48px_rgba(204,255,0,0.32)] transition-transform duration-300 hover:scale-[1.04] md:px-12 md:py-5 md:text-[12px]"
          >
            <span className="absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.5)_50%,transparent_60%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-hover:[animation:finale-sheen_1.2s_ease-out_forwards]" />
            <span className="relative">Request a demo</span>
            <span className="relative font-sans text-base leading-none">→</span>
          </a>

          <button
            type="button"
            onClick={() => onNavigateShowroom?.()}
            className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-silver/55 transition-colors duration-300 hover:text-silver"
          >
            <span className="h-px w-6 bg-silver/30 transition-colors duration-300 group-hover:bg-silver/70" />
            Back to showroom
          </button>
        </div>

        {/* Final closing dot — circular yuzu glyph (the protocol "seal") */}
        <div className="mt-20 flex flex-col items-center gap-3 md:mt-24">
          <span className="block h-1.5 w-1.5 rounded-full bg-yuzu shadow-[0_0_22px_rgba(204,255,0,0.7),0_0_60px_rgba(204,255,0,0.3)]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.42em] text-silver/30">
            TapIn · End of protocol
          </span>
        </div>
      </div>

      {/* Sheen keyframe for the CTA hover */}
      <style>{`
        @keyframes finale-sheen {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
      `}</style>
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
        // Guard: some kinetic titles use SplitChars (char-level) instead of
        // KineticWords (word-level), so this NodeList may be empty. GSAP
        // warns on empty targets, hence the skip.
        if (!words.length) return;
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

      const softs = gsap.utils.toArray<HTMLElement>('.products-soft-reveal');
      softs.forEach((item) => {
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
