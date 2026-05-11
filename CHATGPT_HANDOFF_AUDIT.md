# TapIn Showroom - Audit & Handoff Document

## 1. Component Audit (`src/components/sections/`)

| Component | Represents | Status | Dependencies (Visual/Motion) | Issues / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `Hero.tsx` | Main introduction / Header | Needs Polish | Framer Motion | Good base, needs ID anchors and premium layout classes (`.section-shell`). |
| `Manifesto.tsx` | Friction vs Flow / 5-Second Simulator | Needs Polish | Framer Motion, GSAP | Needs `id="protocol"` or similar for navigation. Layout should use `.content-grid`. |
| `WalkInExpress.tsx` | Walk-In Express flow | Needs Polish | Framer Motion | Add `id="walk-in"`. Ensure animations don't break native scroll. |
| `TasteGenomeVisualizer.tsx` | Taste Genome | Needs Polish | Framer Motion, Three/Canvas? | Add `id="genome"`. Verify performance with Lenis. |
| `ConsumerAppShowcase.tsx` | Passport / Consumer App | Needs Polish | Framer Motion | Add `id="passport"`. Layout needs full-width premium feel. |
| `Protocol.tsx` | Ecosystem Monolith / Gastronomic Passport & Gratitude Loop | Refactor | GSAP, Framer Motion | It currently handles multiple things depending on `activeView`. Needs to be split into explicit sections: `GratitudeLoop` and `EcosystemCards`. |
| `Ecosystem.tsx` | Hospitality Cockpit (Venues) | Needs Polish | Framer Motion | Add `id="cockpit"`. Check layout boundaries. |
| `IAFloorShuffler.tsx` | Tetris Agent Floorplan (Venues) | Needs Polish | Framer Motion, GSAP | Add `id="tetris"`. Intensive animations, monitor scroll blocking. |
| `Features.tsx` | Generic features | To Delete / Review | - | Might be unused or legacy. Replace with narrative sections (Prediction Matrix, Revenue). |

## 2. Global Architecture Status

- **CSS Starter**: Removed `App.css` limits. `#root` now occupies full viewport.
- **Scroll**: Replaced custom `motion.div fixed` SmoothScroll wrapper with `Lenis` for performant native-feeling smooth scroll. Fixes a11y and GSAP ScrollTrigger compatibility.
- **Layout System**: Added `.section-shell`, `.content-grid`, `.wide-grid`, and `.visual-pane` to `index.css`.
- **Navigation**: Navbar refined. Smaller footprint, better hierarchy, added sub-navigation anchors (`#protocol`, `#genome`, `#cockpit`, etc.) depending on the active perspective.

## 3. Pending Narrative Sections to Build/Extract
- **Guests**: `Gratitude Loop` (needs extraction from `Protocol.tsx`), `Consumer app` (exists but needs alignment).
- **Venues**: `Prediction Matrix` (Missing), `CRM / Customer DNA` (Missing), `Revenue / RevPASH` (Missing).

## 4. Next Steps
- Apply layout utilities (`.section-shell`, `.content-grid`) consistently across all sections.
- Add corresponding `id` tags to sections so the Navbar anchors work.
- Break down `Protocol.tsx` into standalone narrative components.
- Build missing Venues sections.
