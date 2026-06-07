# The Golden Canon Grid — TapIn layout system

Adopted as the structural foundation for the light-immersive redesign
(`/redesign`). Extracted from the *GoldenCanonGrid* freebie by Adrián S. / Bont
(Sketch/XD/Figma), reconciled with classical page-construction canon.

## What it is

A proportional layout system, not just a column grid. Two layers:

1. **A 12-column grid** with golden-ratio-derived margins & gutters.
2. **Canonical proportional anchors** — the page is divided by halves,
   thirds and quarters, and crossed by corner-to-corner diagonals (full +
   reciprocal). Where those diagonals intersect is where content blocks,
   headlines and imagery are placed. This is what gives the layout its
   "rightness" — the same logic behind classical book-page construction
   (Van de Graaf / golden canon).

## The numbers (from the source file)

Desktop artboard `1920 × 1080`:

| Token | Value | Ratio |
| --- | --- | --- |
| Columns | 12 | — |
| Column width | 113.58px | — |
| Gutter | 30px | gutter/col ≈ 0.264 |
| Content width | 1693px | 88.2% of 1920 |
| Side margin | 113.5px | 5.91% of 1920 |
| Vertical splits | x = 480 / 960 / 1280 / 1440 / 1600 | ¼ · ½ · ⅔ · ¾ · ⅚ |
| Horizontal splits | y = 540 / 720 | ½ · ⅔ |

The reference composition: a minor block at **¼ width** (x 0→480) over a major
field at **¾ width** (x 480→1920), headline seated on the lower-left golden
intersection. φ = **1.618**; its reciprocal 0.618 governs asymmetric splits.

Mobile/Tablet keep 12 columns and fall back to ½/¼ divisions.

## How we apply it in TapIn (`src/redesign/golden-canon.css`)

CSS variables under `.tapin-light`:

- `--phi: 1.618`
- `--gc-margin: clamp(20px, 5.9vw, 120px)` — the canon side margin
- `--gc-gutter: clamp(16px, 1.6vw, 30px)`
- `--gc-content: min(100% - 2 * var(--gc-margin), 1693px)`

Utilities:

- `.gc-shell` — the canon content column (replaces ad-hoc max-widths)
- `.gc-grid` — 12-col grid with canon gutter
- `.gc-major` / `.gc-minor` — the ¾ : ¼ canonical split
- `.gc-phi-major` / `.gc-phi-minor` — golden split (7 : 5 columns ≈ φ)
- diagonal/“canon lines” are available as a decorative overlay (`.gc-diagonals`)
  used sparingly behind hero/editorial moments.

### Rules of use

- Lead the eye with **asymmetry**: text in the golden-major column, supporting
  visual in the minor — never a centered 50/50 by default.
- Anchor headlines and key UI to the canonical intersections (¼/⅓/⅔ lines),
  not arbitrary positions.
- Vertical rhythm follows the same ratios: section padding and the hero’s
  optical center use ½ / ⅔, not round numbers.
- The diagonal overlay is a *reference*, occasionally surfaced as a faint motif
  — it should feel discovered, not decorative noise.

Source files (local): `…/GoldenCanonGrid-FreebieByBont-v3/*.{sketch,xd,fig}`.

---

## Hero workflow (BONT, 4 steps)

1. **Canvas & base grids** — design the hero on a `1440 × 900` artboard (a
   multiple of 10). Drop the Golden Canon over the *full* canvas for the big
   blocks; add a `10px` micro-grid for small margins/spacing.
2. **Margins & nav** — apply fixed perimeter margins (~`60px`) for the nav and
   repeating chrome. **Do NOT structure the navbar with the Golden Canon** —
   keep the nav separate from the editorial grid. (In TapIn, `.rd-nav__inner`
   uses its own fixed width, not `--gc-content`. Keep it that way.)
3. **Sketch freely** — place imagery, headline and CTAs and iterate *before*
   snapping to the grid. Pull text colours from the imagery for harmony. One
   loud primary CTA + a quieter solid-background secondary.
4. **Snap to the grid last** — turn the grid on and align edges to the diagonal
   *intersections*. If an element won't sit on the diagonals, don't force it —
   give it clean mathematical margins (e.g. 30px) and align only its top/left.
   A complex grid doesn't make the design better; design free, correct with grid.

## The 6 professional grids (for interior sections)

Alternate these so internal pages don't feel monotonous:

1. **Diagonal / "Excel"** — one primary diagonal; mass (image) on one side,
   text on the other. Dynamic, breaks the box. (`.gc-diagonals` motif.)
2. **Modular** — identical cells + gutters (chessboard). Give ~70% to a hero
   media block, fill the rest with copy/links. (`.gc-modular`.)
3. **Radial** — everything radiates from a focal centre. Good for a single
   product/logo hero.
4. **Column** — classic vertical columns; guide the eye top→bottom. Good for
   features/services. (`.gc-grid` 12-col.)
5. **Baseline** — sequential horizontal lines all text sits on. Mandatory for
   blog/manifesto/text walls — identical vertical rhythm. (`--gc-baseline`.)
6. **Hierarchical** — no fixed geometry; split by importance (main 50% / support
   30% / details the rest). The safety net when stuck. (`.gc-hierarchical`.)

Reference: BONT — *Design the hero with the Golden Canon Grid*; GraphiqVibe —
*Better layouts with 6 professional grids*.
