import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CinematicText } from "../ui/CinematicText";

gsap.registerPlugin(ScrollTrigger);

/**
 * ConsumerAppShowcase — "The Gastronomic Passport".
 *
 * REWRITTEN to separate concerns: this section is about IDENTITY (the
 * passport — who you are, your taste signature, the venues you've visited).
 * The post-visit payment / gratitude moment lives in GratitudeLoop. They
 * are different chapters of the journey and shouldn't share a visual.
 *
 * Visual: a passport-style card on the right, with header, sigil, owner row,
 * cuisine affinity bars, recent stamps, and a cryptographic signature. On
 * the left: copy explaining what the Passport actually is.
 */

export function ConsumerAppShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const toggleActions = "play none none reverse";
      gsap.from(".passport-eyebrow", {
        opacity: 0,
        y: 20,
        duration: 1.0,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions,
        },
      });
      gsap.from(".passport-headline", {
        opacity: 0,
        y: 30,
        scale: 0.98,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions,
        },
      });
      gsap.from(".passport-body", {
        opacity: 0,
        y: 15,
        duration: 1.0,
        ease: "power3.out",
        delay: 0.25,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions,
        },
      });
      gsap.from(".passport-feature", {
        opacity: 0,
        x: -20,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.4,
        stagger: 0.15,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions,
        },
      });
      gsap.from(".passport-card", {
        opacity: 0,
        scale: 0.85,
        rotateY: -10,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.3,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions,
        },
      });

      // iPhone 3D appearance after the title finishes loading
      gsap.fromTo(
        ".iphone-3d-container",
        { opacity: 0, y: 80, scale: 0.9, rotateX: 15 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1.8,
          ease: "expo.out",
          delay: 1.2, // appears right after title and text load
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions,
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className="relative w-full py-24 md:py-28 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-20 items-center">
        {/* Left — copy */}
        <div className="passport-copy flex flex-col gap-6 lg:gap-7 text-center lg:text-left">
          <span className="passport-eyebrow inline-flex items-center gap-3 self-center lg:self-start font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-yuzu/80">
            <span className="block w-8 h-px bg-yuzu/40" />
            Module · Identity
          </span>
          <h2 className="passport-headline font-serif italic text-4xl md:text-6xl text-silver/90 leading-[1.04] tracking-tight">
            <CinematicText text="The Gastronomic" />
            <br />
            <span className="text-yuzu">
              <CinematicText text="Passport." delay={0.2} />
            </span>
          </h2>
          <p className="passport-body font-sans text-base md:text-lg text-silver/65 leading-relaxed max-w-xl mx-auto lg:mx-0">
            One cryptographic identity that travels with you. Your phone number
            is the passport. Every venue recognises you instantly — no app to
            download, no profile to set up.
          </p>

          <ul className="flex flex-col gap-3 mt-2 max-w-xl mx-auto lg:mx-0">
            <Feature
              label="Cryptographic identity"
              body="Owned by you. Verified by venues. Never owned by an intermediary."
            />
            <Feature
              label="Taste Genome on board"
              body="Your preferences, allergies, and rhythm — pre-shared (with consent) when you arrive."
            />
            <Feature
              label="One protocol, every venue"
              body="From a Michelin counter to a corner trattoria — the same passport, the same recognition."
            />
          </ul>
        </div>

        {/* Right — Passport card visual */}
        <div className="iphone-3d-container flex justify-center lg:justify-end w-full relative z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.10)_0%,transparent_60%)] pointer-events-none" />
          <PassportCard />
        </div>
      </div>
    </section>
  );
}

function PassportCard() {
  return (
    <div
      className="passport-card relative w-[300px] md:w-[340px] rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, rgba(20,20,20,0.95), rgba(10,10,10,0.98))',
        border: '1px solid rgba(204,255,0,0.18)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(204,255,0,0.06)',
        padding: '28px',
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">Gastronomic Passport</span>
        <span className="w-2 h-2 rounded-full bg-yuzu shadow-[0_0_8px_rgba(204,255,0,0.8)]" />
      </div>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full border border-yuzu/30 bg-yuzu/5 flex items-center justify-center text-yuzu text-xl font-bold">M</div>
        <div>
          <div className="text-white/90 text-sm font-semibold">Marco V.</div>
          <div className="text-white/30 text-[10px] font-mono">+44 7700 ••• ••• · verified</div>
        </div>
      </div>
      <div className="flex flex-col gap-2 mb-6">
        {[['Italian', 94], ['Natural wine', 88], ['Omakase', 76], ['Late seating', 71]].map(([label, pct]) => (
          <div key={label as string} className="flex items-center gap-2">
            <span className="text-[10px] text-white/40 w-24 shrink-0">{label as string}</span>
            <div className="flex-1 h-[3px] rounded-full bg-white/5">
              <div className="h-full rounded-full bg-yuzu/60" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[9px] font-mono text-yuzu/60 w-7 text-right">{pct}%</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-5">
        {['Noma', 'Etxebarri', 'Sushi S.', 'Osteria L.'].map((v) => (
          <span key={v} className="px-2 py-0.5 rounded-full text-[8px] font-mono text-white/50 border border-white/8 bg-white/3">{v}</span>
        ))}
      </div>
      <div className="font-mono text-[7px] text-white/15 tracking-widest">
        SHA · 4f9c2a8e1b7d3f0a · verified
      </div>
    </div>
  );
}

function Feature({ label, body }: { label: string; body: string }) {
  return (
    <li className="passport-feature flex items-start gap-3">
      <span className="mt-1.5 block w-1 h-1 rounded-full bg-yuzu shadow-[0_0_4px_rgba(204,255,0,0.7)] shrink-0" />
      <div className="flex flex-col gap-0.5">
        <span className="font-sans text-[12px] font-semibold text-white/90 tracking-tight">
          {label}
        </span>
        <span className="font-sans text-[12.5px] text-silver/55 leading-relaxed">
          {body}
        </span>
      </div>
    </li>
  );
}
