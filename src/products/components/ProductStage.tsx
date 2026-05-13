import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import type { ProductDefinition, ProductScene as ProductSceneName } from '../content/products';
import { KineticWords } from './KineticText';
import { AICoreScene } from '../scenes/AICoreScene';
import { ConsumerAppScene } from '../scenes/ConsumerAppScene';
import { HospitalityOSScene } from '../scenes/HospitalityOSScene';
import { IntegrationsScene } from '../scenes/IntegrationsScene';
import { MessagingLayerScene } from '../scenes/MessagingLayerScene';
import { WebSDKScene } from '../scenes/WebSDKScene';

gsap.registerPlugin(ScrollTrigger);

interface ProductStageProps {
  products: ProductDefinition[];
}

export function ProductStage({ products }: ProductStageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desktop = window.matchMedia('(min-width: 768px)').matches;
    if (reduce || !desktop || !sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.product-panel');
      const distance = Math.max(0, window.innerWidth * (panels.length - 1));

      const railTween = gsap.to(trackRef.current, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${distance}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel, index) => {
        if (index === 0) return;

        const words = panel.querySelectorAll('.products-kinetic-word');
        if (words.length) {
          gsap.fromTo(
            words,
            { yPercent: 115, rotateX: -28, opacity: 0, filter: 'blur(10px)' },
            {
              yPercent: 0,
              rotateX: 0,
              opacity: 1,
              filter: 'blur(0px)',
              stagger: 0.025,
              duration: 0.72,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: railTween,
                start: 'left 68%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        gsap.fromTo(
          panel.querySelectorAll('.product-reveal'),
          { y: 40, opacity: 0, filter: 'blur(10px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            stagger: 0.08,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: railTween,
              start: 'left 65%',
              end: 'left 25%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [products.length]);

  return (
    <section id="product-rail" ref={sectionRef} className="relative overflow-hidden">
      <div className="hidden h-screen overflow-hidden md:block">
        <div ref={trackRef} className="flex h-full w-max">
          {products.map((product, index) => (
            <article key={product.id} className="product-panel grid h-screen w-screen grid-cols-[0.88fr_1.12fr] items-center gap-10 px-[clamp(2rem,5vw,5rem)]">
              <ProductCopy product={product} index={index} />
              <div className="product-reveal">
                <Scene scene={product.scene} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="grid gap-16 px-5 py-20 md:hidden">
        {products.map((product, index) => (
          <article key={product.id} className="grid gap-6">
            <ProductCopy product={product} index={index} />
            <Scene scene={product.scene} />
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductCopy({ product, index }: { product: ProductDefinition; index: number }) {
  const accentClass = product.accent === 'amber' ? 'text-[#ffc457]' : product.accent === 'neutral' ? 'text-silver' : 'text-yuzu';

  return (
    <div className="product-reveal max-w-xl">
      <div className="mb-8 flex items-center gap-4">
        <span className={`font-serif text-5xl italic leading-none ${accentClass}`}>0{index + 1}</span>
        <span className="h-px w-16 bg-white/18" />
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-silver/42">{product.eyebrow}</span>
      </div>
      <h2 className="products-kinetic text-[clamp(2.8rem,5.6vw,6.2rem)] font-black leading-[0.86] tracking-tighter text-silver">
        <KineticWords text={product.headline} />
      </h2>
      <p className="mt-7 text-base leading-relaxed text-silver/62 md:max-w-lg">{product.description}</p>
      <div className="mt-8 grid gap-3">
        {product.bullets.map((bullet) => (
          <div key={bullet} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3">
            <span className="h-1.5 w-1.5 rounded-full bg-yuzu shadow-[0_0_10px_rgba(204,255,0,0.76)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver/60">{bullet}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Scene({ scene }: { scene: ProductSceneName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
    >
      {scene === 'web-sdk' && <WebSDKScene />}
      {scene === 'consumer-app' && <ConsumerAppScene />}
      {scene === 'hospitality-os' && <HospitalityOSScene />}
      {scene === 'messaging' && <MessagingLayerScene />}
      {scene === 'ai-core' && <AICoreScene />}
      {scene === 'integrations' && <IntegrationsScene />}
    </motion.div>
  );
}
