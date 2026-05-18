import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type {
  ProductDefinition,
  ProductScene as ProductSceneName,
} from "../content/products";
import { KineticWords } from "./KineticText";
import { AICoreScene } from "../scenes/AICoreScene";
import { ConsumerAppScene } from "../scenes/ConsumerAppScene";
import { HospitalityOSScene } from "../scenes/HospitalityOSScene";
import { IntegrationsScene } from "../scenes/IntegrationsScene";
import { MessagingLayerScene } from "../scenes/MessagingLayerScene";
import { WebSDKScene } from "../scenes/WebSDKScene";
import { useIsMobileViewport } from "../hooks/useIsMobileViewport";

// A simple hook to track mouse position for the 3D tilt effect
function useMouseTilt(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(max-width: 768px)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      gsap.to(el, {
        rotateX,
        rotateY,
        duration: 0.8,
        ease: "power3.out",
        transformPerspective: 1200,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.3)",
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref]);
}

gsap.registerPlugin(ScrollTrigger);

interface ProductStageProps {
  products: ProductDefinition[];
}

export function ProductStage({ products }: ProductStageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobileViewport();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (
      reduce ||
      isMobile ||
      !desktop ||
      !sectionRef.current ||
      !trackRef.current
    )
      return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".product-panel");
      const getDistance = () =>
        trackRef.current ? trackRef.current.scrollWidth - window.innerWidth : 0;

      const railTween = gsap.to(trackRef.current, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel, index) => {
        if (index === 0) return;

        const words = panel.querySelectorAll(".products-kinetic-word");
        if (words.length) {
          gsap.fromTo(
            words,
            { yPercent: 115, rotateX: -28, opacity: 0, filter: "blur(10px)" },
            {
              yPercent: 0,
              rotateX: 0,
              opacity: 1,
              filter: "blur(0px)",
              stagger: 0.025,
              duration: 0.72,
              ease: "power3.out",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: railTween,
                start: "left 68%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }

        gsap.fromTo(
          panel.querySelectorAll(".product-reveal"),
          { y: 40, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.08,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: railTween,
              start: "left 65%",
              end: "left 25%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, sectionRef);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [isMobile, products.length]);

  return (
    <section
      id="product-rail"
      ref={sectionRef}
      className="relative overflow-hidden"
    >
      {isMobile ? (
        <MobileProductJourney products={products} />
      ) : (
        <div className="h-screen overflow-hidden">
          <div ref={trackRef} className="flex h-full w-max">
            {products.map((product, index) => (
              <article
                key={product.id}
                className="product-panel grid h-screen w-screen grid-cols-[0.88fr_1.12fr] items-center gap-10 px-[clamp(2rem,5vw,5rem)]"
              >
                <ProductCopy product={product} index={index} />
                <div className="product-reveal">
                  <Scene scene={product.scene} />
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function MobileProductJourney({ products }: { products: ProductDefinition[] }) {
  return (
    <div className="px-4 py-14">
      <div className="mx-auto mb-9 max-w-[430px]">
        <div className="mb-3 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.28em] text-yuzu/70">
          <span className="h-px w-8 bg-yuzu/40" />
          Product flow
        </div>
        <h2 className="text-[clamp(2.15rem,10vw,3.8rem)] font-black leading-[0.88] tracking-tight text-silver">
          Six surfaces.
          <span className="block font-serif font-normal italic text-yuzu">
            One system.
          </span>
        </h2>
      </div>

      <div className="mx-auto grid max-w-[430px] gap-5">
        {products.map((product) => (
          <motion.article
            key={product.id}
            initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.025] p-4 shadow-[0_22px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-yuzu/42 to-transparent" />
            <MobileProductVisual product={product} />
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <span className="font-serif text-[1.65rem] italic leading-none text-yuzu">
                  {String(product.index).padStart(2, "0")}
                </span>
                <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-silver/44">
                  {product.eyebrow}
                </span>
              </div>
              <h3 className="mt-3 text-[1.55rem] font-black leading-[0.96] tracking-tight text-silver">
                {product.headline}
              </h3>
              <p className="mt-3 text-[12px] leading-relaxed text-silver/56">
                {product.shortDescription}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.bullets.slice(0, 2).map((bullet) => (
                  <span
                    key={bullet}
                    className="rounded-full border border-yuzu/18 bg-yuzu/[0.035] px-3 py-1.5 font-mono text-[7px] uppercase tracking-[0.16em] text-yuzu/70"
                  >
                    {bullet}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function MobileProductVisual({ product }: { product: ProductDefinition }) {
  switch (product.scene) {
    case "web-sdk":
      return <MobileWebSdkVisual />;
    case "consumer-app":
      return <MobileConsumerVisual />;
    case "hospitality-os":
      return <MobileHospitalityVisual />;
    case "messaging":
      return <MobileMessagingVisual />;
    case "ai-core":
      return <MobileAiVisual />;
    case "integrations":
      return <MobileIntegrationVisual />;
    default:
      return null;
  }
}

function MobileWebSdkVisual() {
  return (
    <div className="relative h-[13.5rem] overflow-hidden rounded-[1.25rem] bg-black">
      <img
        src="/products/websdk-restaurant-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/38 to-black/16" />
      <div className="relative z-10 flex h-full flex-col justify-between p-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[8px] uppercase tracking-[0.24em] text-silver/45">
          <span>Osteria Lumina</span>
          <span className="text-yuzu">Book</span>
        </div>
        <div>
          <p className="font-serif text-3xl italic leading-[0.9] text-silver/90">
            Tonight, quietly arranged.
          </p>
          <div className="mt-4 h-px w-16 bg-yuzu/55" />
        </div>
      </div>
      <div className="absolute bottom-4 right-4 z-20 w-[58%] rounded-[1rem] border border-yuzu/24 bg-black/78 p-3 backdrop-blur-xl">
        <div className="mb-2 flex justify-between font-mono text-[6px] uppercase tracking-[0.2em] text-silver/40">
          <span>TapIn layer</span>
          <span className="text-yuzu">12 sec</span>
        </div>
        <div className="rounded-full bg-yuzu px-3 py-2 text-center font-mono text-[7px] font-black uppercase tracking-[0.2em] text-black">
          Confirm
        </div>
      </div>
    </div>
  );
}

function MobileConsumerVisual() {
  return (
    <div className="relative grid h-[14.5rem] place-items-center overflow-hidden rounded-[1.25rem] bg-[radial-gradient(circle_at_50%_30%,rgba(204,255,0,0.13),transparent_48%),#050605]">
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="relative h-[12.5rem] w-[6.2rem] rounded-[1.6rem] border border-white/18 bg-[#050505] p-1.5 shadow-[0_22px_64px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.16)]">
        <div className="absolute left-1/2 top-2 h-3 w-12 -translate-x-1/2 rounded-full bg-black" />
        <div className="h-full overflow-hidden rounded-[1.25rem] bg-[#060706] px-2 pb-2 pt-6">
          <div className="font-serif text-sm italic text-silver">
            TapIn<span className="text-yuzu">·</span>
          </div>
          <div className="mt-2 rounded-xl border border-yuzu/28 bg-yuzu/[0.07] p-2">
            <div className="font-mono text-[5px] uppercase tracking-[0.22em] text-yuzu/75">
              Reservation
            </div>
            <div className="font-serif text-lg italic text-silver">8:30pm</div>
          </div>
          <div className="mt-3 grid gap-1.5">
            {[88, 72, 64].map((value) => (
              <div key={value} className="h-1 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-yuzu"
                  style={{ width: `${value}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 border-l border-yuzu/45 pl-2 font-serif text-[0.58rem] italic text-silver/80">
            Tomato carpaccio
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileHospitalityVisual() {
  return (
    <div className="relative h-[13.5rem] overflow-hidden rounded-[1.25rem] bg-[#050605] p-4">
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="relative grid h-full grid-cols-[1fr_0.78fr] gap-3">
        <div className="relative rounded-[1rem] border border-white/10 bg-white/[0.025]">
          {[
            { left: "18%", top: "24%", hot: true },
            { left: "62%", top: "22%", hot: false },
            { left: "38%", top: "56%", hot: true },
            { left: "72%", top: "66%", hot: true },
          ].map(({ left, top, hot }, index) => (
            <span
              key={`${left}-${top}`}
              className={`absolute h-8 w-8 rounded-full border ${hot ? "border-yuzu/55 bg-yuzu/13" : "border-white/15 bg-black/42"}`}
              style={{ left, top }}
            >
              {index === 2 && (
                <span className="absolute inset-2 rounded-full bg-yuzu shadow-[0_0_14px_rgba(204,255,0,0.55)]" />
              )}
            </span>
          ))}
        </div>
        <div className="grid gap-2">
          {["VIP routed", "Yield +18", "AP matched"].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-white/9 bg-white/[0.028] p-3"
            >
              <div className="h-px w-8 bg-yuzu/52" />
              <div className="mt-2 font-mono text-[7px] uppercase tracking-[0.18em] text-silver/58">
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileMessagingVisual() {
  return (
    <div className="relative h-[13.5rem] overflow-hidden rounded-[1.25rem] bg-[#050605] p-4">
      <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yuzu/12 bg-yuzu/[0.035]" />
      <div className="relative grid gap-3 pt-3">
        {[
          [
            "Guest",
            "Two of us, quiet, around 9",
            "mr-auto border-white/10 bg-white/[0.03]",
          ],
          [
            "TapIn",
            "party 2 · quiet table · 21:00",
            "ml-auto border-yuzu/30 bg-yuzu/[0.065]",
          ],
          [
            "Confirm",
            "link ready · deposit protected",
            "ml-auto border-yuzu/30 bg-yuzu/[0.065]",
          ],
        ].map(([label, text, klass]) => (
          <div
            key={label}
            className={`max-w-[84%] rounded-2xl border px-3 py-2.5 ${klass}`}
          >
            <div className="font-mono text-[6px] uppercase tracking-[0.22em] text-yuzu/65">
              {label}
            </div>
            <div className="mt-1 text-[11px] leading-snug text-silver/78">
              {text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileAiVisual() {
  return (
    <div className="relative grid h-[13.5rem] place-items-center overflow-hidden rounded-[1.25rem] bg-[#030403]">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 320 210"
        aria-hidden="true"
      >
        <circle
          cx="160"
          cy="104"
          r="36"
          fill="rgba(204,255,0,0.055)"
          stroke="rgba(204,255,0,0.26)"
        />
        <circle
          cx="160"
          cy="104"
          r="74"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
        />
        <path
          d="M160 104 L93 55 M160 104 L232 72 M160 104 L221 150 M160 104 L92 150"
          stroke="rgba(204,255,0,0.22)"
        />
        <circle cx="160" cy="104" r="5" fill="#ccff00" />
      </svg>
      {[
        ["Taste", "29%", "26%"],
        ["Tetris", "72%", "33%"],
        ["Sentiment", "69%", "70%"],
        ["Gratitude", "24%", "70%"],
      ].map(([label, left, top]) => (
        <span
          key={label}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/70 px-3 py-2 font-mono text-[7px] uppercase tracking-[0.18em] text-silver/62"
          style={{ left, top }}
        >
          {label}
        </span>
      ))}
      <div className="relative rounded-full border border-yuzu/22 bg-black/70 px-5 py-3 font-mono text-[8px] uppercase tracking-[0.24em] text-yuzu/75 backdrop-blur-xl">
        Decision layer
      </div>
    </div>
  );
}

function MobileIntegrationVisual() {
  const items = ["POS", "Stripe", "NFC", "Maps", "WA", "IG"];
  return (
    <div className="relative h-[13.5rem] overflow-hidden rounded-[1.25rem] bg-[#040504]">
      <svg
        className="absolute inset-0 h-full w-full opacity-85"
        viewBox="0 0 320 210"
        aria-hidden="true"
      >
        <circle
          cx="160"
          cy="104"
          r="31"
          fill="rgba(204,255,0,0.05)"
          stroke="rgba(204,255,0,0.26)"
        />
        {items.map((_, index) => {
          const angle = (-90 + index * 60) * (Math.PI / 180);
          const x = 160 + Math.cos(angle) * 86;
          const y = 104 + Math.sin(angle) * 70;
          return (
            <path
              key={index}
              d={`M160 104 L${x} ${y}`}
              stroke="rgba(204,255,0,0.18)"
            />
          );
        })}
      </svg>
      <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-yuzu/28 bg-black/76 font-serif text-lg italic text-silver">
        TapIn
      </div>
      {items.map((item, index) => {
        const angle = (-90 + index * 60) * (Math.PI / 180);
        const left = 50 + Math.cos(angle) * 32;
        const top = 50 + Math.sin(angle) * 32;
        return (
          <span
            key={item}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/[0.028] px-3 py-2 font-mono text-[7px] uppercase tracking-[0.18em] text-silver/62"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            {item}
          </span>
        );
      })}
    </div>
  );
}

/**
 * Per-product editorial highlight words. The matched words render in
 * serif italic yuzu inside the otherwise-sans headline, giving each
 * product a distinct typographic accent like a magazine cover.
 */
const HIGHLIGHTS: Partial<Record<ProductDefinition["id"], string[]>> = {
  "consumer-app": ["gastronomic", "passport"],
  "hospitality-os": ["invisible", "front", "of", "house", "manager"],
  "web-sdk": ["TapIn", "layer"],
  messaging: ["conversations", "already", "happen"],
  "ai-core": ["operational", "intelligence"],
  integrations: ["guest,", "room,", "outside", "world"],
};

function ProductCopy({
  product,
  index,
}: {
  product: ProductDefinition;
  index: number;
}) {
  const accentClass =
    product.accent === "neutral" ? "text-silver" : "text-yuzu";
  const highlight = HIGHLIGHTS[product.id];

  return (
    <div className="product-reveal relative z-20 max-w-xl">
      <div className="mb-6 flex items-center gap-4">
        <span
          className={`font-serif text-5xl italic leading-none ${accentClass}`}
        >
          0{index + 1}
        </span>
        <span className="h-px w-16 bg-white/18" />
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-silver/42">
          {product.eyebrow}
        </span>
      </div>
      <h2 className="products-kinetic max-w-[min(100%,42rem)] text-[clamp(2.45rem,5.6vw,6.2rem)] font-black leading-[0.92] tracking-tight text-silver md:leading-[0.88]">
        <KineticWords text={product.headline} highlightWords={highlight} />
      </h2>
      <p className="mt-7 text-base leading-relaxed text-silver/62 md:max-w-lg">
        {product.description}
      </p>
      <div className="mt-10 flex flex-wrap gap-2">
        {product.bullets.map((bullet) => (
          <div
            key={bullet}
            className="flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.015] px-3 py-1.5 backdrop-blur-sm transition-colors hover:border-yuzu/30 hover:bg-white/[0.04]"
          >
            <span
              className={`h-1 w-1 rounded-full ${product.accent === "yuzu" ? "bg-yuzu shadow-[0_0_8px_rgba(204,255,0,0.8)]" : "bg-silver shadow-[0_0_8px_rgba(255,255,255,0.4)]"}`}
            />
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-silver/70">
              {bullet}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Scene({ scene }: { scene: ProductSceneName }) {
  const tiltRef = useRef<HTMLDivElement>(null);
  useMouseTilt(tiltRef);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96, filter: "blur(16px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.86, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 mx-auto w-full max-w-[560px] md:max-w-none"
    >
      {/* 3D Tilt Container */}
      <div
        ref={tiltRef}
        className="relative will-change-transform [transform-style:preserve-3d]"
      >
        {/* Cinematic glow drop-shadow behind the scene */}
        <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(circle_at_50%_50%,rgba(204,255,0,0.08),transparent_60%)] blur-2xl md:-inset-20 md:bg-[radial-gradient(circle_at_50%_50%,rgba(204,255,0,0.05),transparent_60%)]" />

        {scene === "web-sdk" && <WebSDKScene />}
        {scene === "consumer-app" && <ConsumerAppScene />}
        {scene === "hospitality-os" && <HospitalityOSScene />}
        {scene === "messaging" && <MessagingLayerScene />}
        {scene === "ai-core" && <AICoreScene />}
        {scene === "integrations" && <IntegrationsScene />}
      </div>
    </motion.div>
  );
}
