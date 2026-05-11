# TapIn Protocol - Project Context & Handoff Document

This document provides a comprehensive overview of the current state of the **TapIn Protocol** web application showroom. It is designed to give ChatGPT (or any other developer/AI) full context to continue development seamlessly.

## 1. Project Concept & Vision
TapIn is an **"Invisible Luxury"** hospitality OS. It operates on the premise that true luxury means zero friction: no apps, no checkout lines, just seamless recognition from the moment a VIP guest arrives.

The web showroom functions as a high-end dual-perspective landing page:
- **For Guests (B2C):** Focuses on frictionless experiences, "The Epicurean Genome" (taste profile mapping), and "The Gratitude Loop" (seamless tipping/status unlocking).
- **For Venues (B2B):** Focuses on "The Sentient Floorplan", real-time RevPASH optimization, predictive yield matrices, and a high-fidelity Hospitality Command Center.

## 2. Technical Stack
- **Framework:** React 18 with TypeScript.
- **Build Tool:** Vite.
- **Styling:** Tailwind CSS (strict custom color palette and aesthetic rules).
- **Animation & Physics:** 
  - **Framer Motion:** Used heavily for interactive components, layout animations, gestures (`drag`, `useMotionValue`, `useTransform`), and complex UI states.
  - **GSAP & ScrollTrigger:** Used for global scroll animations, fade-ups, and pinning sections.
- **Icons:** `lucide-react`.

## 3. Design System & Aesthetic Directives
The aesthetic is strictly **"Stripe / Apple / Awwwards Tier"** luxury.
- **Colors:** 
  - **Backgrounds:** Obsidian Black (`#050505`, `#0A0A0A`).
  - **Text:** Pure White, Silver (for muted text), and translucent white (`white/40`, `white/70`).
  - **Accent/Brand:** Neon Lime / Yuzu (`#CCFF00`). This color is used sparingly and aggressively *only* for high-value actions, glowing success states, and live data nodes.
- **Typography:**
  - **Headings/Elegance:** `Instrument Serif` (Italicized heavily for luxury feel).
  - **Data/UI/Micro-copy:** `JetBrains Mono` (uppercase, wide tracking `tracking-widest` or `tracking-[0.2em]`).
  - **Body:** Clean sans-serif (Inter/system default).
- **UI Materials:** Dark glassmorphism (`backdrop-blur-xl`), subtle inner shadows (`shadow-inner`), ultra-thin borders (`border border-white/10`), and deep radial gradient glows.

## 4. Application Architecture & Routing
The application features a unique **Perspective Switch**. 
- Located in the `Navbar` (floating dock style: `fixed top-6 left-1/2 -translate-x-1/2 z-50`), users toggle between `activeView: 'guests'` and `activeView: 'venues'`.
- The main `App.tsx` conditionally renders completely different sections based on this state using Framer Motion's `<AnimatePresence>`.

## 5. Core Sections & Components

### B2C (Guests) Modules:
1. **Manifesto / Hero:** High-impact text explaining the philosophy of friction vs. flow.
2. **Orbital Constellation (`OrbitalConstellation.tsx`):** Represents the "Epicurean Genome". A dynamic, rotating orbital system (concentric dashed rings) mapping the user's specific tastes (e.g., Wagyu, Chablis) floating endlessly around a pulsing core.
3. **The Kinetic Resonance (`KineticResonance.tsx`):** Represents the "Gratitude Loop" (tipping). A highly interactive, gamified "Press and Hold" engine. The user holds a dark glass button, a Neon Lime SVG ring charges up to 100, and upon climax, detonates a massive #CCFF00 aura, changing the UI to `VIP STATUS SECURED`.

### B2B (Venues) Modules:
1. **Hospitality Command Center (`Ecosystem.tsx` / `HospitalityCockpit.tsx`):** A high-density SaaS dashboard. Features an un-truncated Activity Log wrapping text elegantly, and a High-Fidelity Floorplan (SVG) where tables glow Neon Lime with deep POS tooltips on hover (Check #, Seat Data, Turnaround progress).
2. **Tetris Blueprint (`TetrisBlueprint.tsx`):** The "Sentient Floorplan". An animated grid simulating AI arranging tables in real-time to eliminate empty seats and maximize RevPASH.
3. **Prediction Matrix (`PredictionMatrix.tsx`):** An animated node graph showing data inputs (Weather, Traffic, History) flowing into a central Predictive Yield engine.

## 6. Recent Iterations & "Lore" (Crucial for Context)
The project went through intense iterations to reach its current "Awwwards Tier" polish. 
- *What we threw away:* We abandoned abstract floating dots, muddy holographic glows, and generic sliders/dials.
- *What we built:* Tactile, physics-driven interactions. Every component must feel like an expensive piece of physical hardware or a cutting-edge military/luxury OS interface. **Interactivity is mandatory.** If a component doesn't react physically to the mouse or touch, it fails the standard.

## 7. Current Project Status
- The routing, animations, and core UI components are fully built and functioning.
- The project is structurally sound but might require ongoing tweaks depending on the user's new feature requests.
- **Known Environmental Issue:** The local machine occasionally experiences `EPERM` (permissions) errors in the `node_modules` folder due to conflicting `sudo` processes on the user's OS. The codebase itself is pristine.

---
**To ChatGPT:** You are now inheriting a highly polished, opinionated, and sophisticated React/Framer Motion codebase. Maintain the strict color discipline, the typography rules, and the premium physics-based interaction models moving forward.
