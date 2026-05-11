import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * DistrictMap — the Hero atmosphere.
 *
 * A stylized cartographic illustration of a coastal dining district. Streets,
 * building blocks, park, plaza, coastline, subway. On top of the map: 10
 * venues that come alive with rich TapIn signal cards — each card has its own
 * graphical body (mini floor plan, % gauge, friend avatars, clock, style
 * tags, mini bar chart). Hover a venue and its card opens. Drag the map and
 * it pans. The whole thing is meant to feel like the actual TapIn product
 * surface — a sentient city, not a radar.
 */

/* ─── DATA ─────────────────────────────────────────────────────────────── */

type SignalType =
    | 'recognition'
    | 'match'
    | 'social'
    | 'availability'
    | 'discovery'
    | 'trending';

type LabelAnchor = 'top' | 'bottom';

interface Venue {
    id: number;
    name: string;
    cuisine: string;
    cx: number;
    cy: number;
    labelAnchor: LabelAnchor;
    weight?: 1 | 2 | 3;
    strip: 'top' | 'bottom';
}

const VENUES: Venue[] = [
    { id: 1,  name: 'Osteria Lumina', cuisine: 'Italian',          cx: 565,  cy: 220, labelAnchor: 'top',    weight: 3, strip: 'top'    },
    { id: 2,  name: 'Casa Marisol',   cuisine: 'Coastal',          cx: 320,  cy: 250, labelAnchor: 'top',    weight: 2, strip: 'top'    },
    { id: 3,  name: 'Sasso',          cuisine: 'Wine Bar',         cx: 815,  cy: 215, labelAnchor: 'top',    weight: 1, strip: 'top'    },
    { id: 4,  name: 'Da Salvatore',   cuisine: 'Trattoria',        cx: 1100, cy: 240, labelAnchor: 'top',    weight: 2, strip: 'top'    },
    { id: 5,  name: 'Nakamura',       cuisine: 'Omakase',          cx: 1370, cy: 260, labelAnchor: 'top',    weight: 1, strip: 'top'    },
    { id: 6,  name: 'Lumière',        cuisine: 'French',           cx: 220,  cy: 700, labelAnchor: 'bottom', weight: 2, strip: 'bottom' },
    { id: 7,  name: 'El Corral',      cuisine: 'Steakhouse',       cx: 470,  cy: 720, labelAnchor: 'bottom', weight: 1, strip: 'bottom' },
    { id: 8,  name: 'Rosewood',       cuisine: 'New American',     cx: 770,  cy: 660, labelAnchor: 'bottom', weight: 1, strip: 'bottom' },
    { id: 9,  name: 'Maison Verde',   cuisine: 'Modern European',  cx: 1020, cy: 695, labelAnchor: 'bottom', weight: 2, strip: 'bottom' },
    { id: 10, name: 'Suriya',         cuisine: 'Thai',             cx: 1340, cy: 670, labelAnchor: 'bottom', weight: 1, strip: 'bottom' },
];

/** Each venue's signature signal type (used on hover, before any random
 *  auto-activation). Gives every venue a "personality" the user discovers
 *  by exploring the map. */
const HOVER_SIGNAL_TYPES: Record<number, SignalType> = {
    1: 'recognition',   // Lumina is your usual
    2: 'match',         // Marisol is curated for your taste
    3: 'social',        // Sasso is where friends gather
    4: 'availability',  // Salvatore: last-minute table
    5: 'discovery',     // Nakamura: a discovery
    6: 'match',
    7: 'trending',
    8: 'recognition',
    9: 'discovery',
    10: 'trending',
};

/* ─── MAP GEOMETRY ─────────────────────────────────────────────────────── */

const HORIZONTAL_ARTERIES = [
    'M -20 195 C 220 190 460 210 720 195 S 1240 180 1620 205',
    'M -20 365 C 220 360 460 380 720 365 S 1240 350 1620 370',
    'M -20 540 C 220 545 460 525 720 540 S 1240 555 1620 530',
    'M -20 720 C 220 715 460 735 720 720 S 1240 705 1620 730',
];
const VERTICAL_STREETS = [
    'M 215 -20 C 210 200 225 400 215 600 S 210 800 220 920',
    'M 500 -20 C 495 200 510 400 500 600 S 495 800 505 920',
    'M 820 -20 C 815 200 830 400 820 600 S 815 800 825 920',
    'M 1100 -20 C 1095 200 1110 400 1100 600 S 1095 800 1105 920',
    'M 1380 -20 C 1375 200 1390 400 1380 600 S 1375 800 1385 920',
];
const OLD_TOWN_STREETS = [
    'M 80 130 C 140 145 220 155 280 175',
    'M 110 290 C 180 300 260 280 340 295',
    'M 60 430 C 120 450 200 440 280 460',
    'M 215 195 C 250 240 280 290 320 340',
    'M 380 250 C 410 320 430 380 470 440',
];
const EAST_QUARTER_STREETS = [
    'M 1000 580 L 1000 800',
    'M 1200 580 L 1200 800',
    'M 1300 470 L 1300 700',
    'M 900 650 L 1380 650',
    'M 900 580 L 900 800',
];
const BOULEVARD = 'M 60 80 C 360 220 680 380 980 540 S 1360 800 1560 920';
const SUBWAY = 'M -20 455 C 240 450 480 470 720 455 S 1240 440 1620 460';
const COASTLINE = 'M 1480 -20 C 1450 140 1495 280 1465 420 C 1440 540 1490 680 1465 820 C 1450 880 1485 920 1500 920';
const WATER_FILL = 'M 1480 -20 C 1450 140 1495 280 1465 420 C 1440 540 1490 680 1465 820 C 1450 880 1485 920 1500 920 L 1700 920 L 1700 -20 Z';
const PARK_PATH = 'M 100 80 C 220 65 320 90 380 165 C 425 240 380 330 290 335 C 195 340 110 270 90 180 C 80 130 90 100 100 80 Z';
const PLAZA_PATH = 'M 360 220 L 410 215 L 445 240 L 450 280 L 425 315 L 380 318 L 345 295 L 340 255 Z';

interface Block { x: number; y: number; w: number; h: number; a: number; r?: number; }
const BLOCKS_OLD_TOWN: Block[] = [
    { x: 100, y: 150, w: 50, h: 35, a: 0.018, r: -3 },
    { x: 155, y: 155, w: 38, h: 32, a: 0.022 },
    { x: 250, y: 195, w: 45, h: 35, a: 0.020, r: 4 },
    { x: 130, y: 210, w: 40, h: 38, a: 0.024 },
    { x: 175, y: 250, w: 45, h: 30, a: 0.018 },
    { x: 110, y: 350, w: 60, h: 35, a: 0.022, r: 2 },
    { x: 175, y: 360, w: 50, h: 30, a: 0.018 },
    { x: 80,  y: 480, w: 65, h: 38, a: 0.020 },
    { x: 150, y: 478, w: 50, h: 40, a: 0.024 },
    { x: 245, y: 480, w: 55, h: 42, a: 0.022, r: -2 },
    { x: 325, y: 290, w: 55, h: 40, a: 0.020 },
    { x: 300, y: 360, w: 70, h: 35, a: 0.018, r: 3 },
    { x: 380, y: 380, w: 55, h: 30, a: 0.024 },
];
const BLOCKS_CENTRAL: Block[] = [
    { x: 540, y: 220, w: 110, h: 90, a: 0.022 },
    { x: 660, y: 220, w: 80,  h: 90, a: 0.025 },
    { x: 750, y: 220, w: 60,  h: 90, a: 0.020 },
    { x: 540, y: 400, w: 110, h: 80, a: 0.024 },
    { x: 660, y: 400, w: 80,  h: 80, a: 0.022 },
    { x: 750, y: 400, w: 60,  h: 80, a: 0.025 },
    { x: 540, y: 580, w: 110, h: 80, a: 0.020 },
    { x: 660, y: 580, w: 80,  h: 80, a: 0.025 },
    { x: 750, y: 580, w: 60,  h: 80, a: 0.022 },
    { x: 540, y: 760, w: 110, h: 50, a: 0.022 },
    { x: 660, y: 760, w: 140, h: 50, a: 0.024 },
];
const BLOCKS_EAST_QUARTER: Block[] = [
    { x: 840,  y: 235, w: 70,  h: 50, a: 0.022 }, { x: 920,  y: 235, w: 70,  h: 50, a: 0.025 },
    { x: 1000, y: 235, w: 80,  h: 50, a: 0.020 }, { x: 840,  y: 295, w: 70,  h: 60, a: 0.024 },
    { x: 920,  y: 295, w: 70,  h: 60, a: 0.022 }, { x: 1000, y: 295, w: 80,  h: 60, a: 0.025 },
    { x: 1120, y: 235, w: 100, h: 60, a: 0.022 }, { x: 1230, y: 235, w: 60,  h: 60, a: 0.020 },
    { x: 1300, y: 235, w: 70,  h: 60, a: 0.024 }, { x: 1120, y: 305, w: 100, h: 50, a: 0.024 },
    { x: 1230, y: 305, w: 60,  h: 50, a: 0.022 }, { x: 1300, y: 305, w: 70,  h: 50, a: 0.020 },
    { x: 840,  y: 410, w: 70,  h: 70, a: 0.022 }, { x: 920,  y: 410, w: 70,  h: 70, a: 0.025 },
    { x: 1000, y: 410, w: 80,  h: 70, a: 0.020 }, { x: 1120, y: 410, w: 100, h: 70, a: 0.022 },
    { x: 1230, y: 410, w: 60,  h: 70, a: 0.024 }, { x: 1300, y: 410, w: 70,  h: 70, a: 0.020 },
    { x: 840,  y: 600, w: 50,  h: 40, a: 0.022 }, { x: 910,  y: 600, w: 50,  h: 40, a: 0.020 },
    { x: 920,  y: 660, w: 60,  h: 50, a: 0.025 }, { x: 1010, y: 600, w: 60,  h: 60, a: 0.025 },
    { x: 1010, y: 670, w: 60,  h: 50, a: 0.022 }, { x: 1130, y: 590, w: 60,  h: 50, a: 0.024 },
    { x: 1130, y: 660, w: 60,  h: 50, a: 0.022 }, { x: 1210, y: 590, w: 80,  h: 50, a: 0.022 },
    { x: 1210, y: 660, w: 80,  h: 50, a: 0.025 }, { x: 1310, y: 580, w: 60,  h: 60, a: 0.022 },
    { x: 1310, y: 660, w: 60,  h: 50, a: 0.024 }, { x: 840,  y: 740, w: 50,  h: 60, a: 0.022 },
    { x: 910,  y: 740, w: 60,  h: 60, a: 0.020 }, { x: 990,  y: 740, w: 60,  h: 60, a: 0.024 },
    { x: 1060, y: 740, w: 60,  h: 60, a: 0.022 }, { x: 1140, y: 740, w: 60,  h: 60, a: 0.025 },
    { x: 1220, y: 740, w: 60,  h: 60, a: 0.022 }, { x: 1300, y: 740, w: 70,  h: 60, a: 0.020 },
];
const LANDMARKS: Block[] = [
    { x: 600,  y: 670, w: 200, h: 70, a: 0.045 },
    { x: 1020, y: 80,  w: 150, h: 90, a: 0.04  },
    { x: 230,  y: 600, w: 110, h: 90, a: 0.04, r: -2 },
];

/* ─── SIGNAL CONTENT (now with graphical data) ────────────────────────── */

interface SignalData {
    tableNum?: number;
    activeTable?: number;
    percentage?: number;
    friends?: { initial: string; tone: 'yuzu' | 'silver' }[];
    time?: { hour: number; minute: number };
    tags?: string[];
    bars?: number[];
    delta?: number;
}

interface SignalContent {
    type: SignalType;
    primary: string;
    secondary: string;
    data: SignalData;
}

const FRIEND_INITIALS = ['M', 'R', 'A', 'L', 'S', 'J', 'D', 'C'];
const FRIEND_TONES: ('yuzu' | 'silver')[] = ['yuzu', 'silver', 'yuzu', 'silver', 'yuzu'];
const STYLE_TAGS_BY_CUISINE: Record<string, string[]> = {
    'Italian': ['Intimate', 'Wine forward', 'Romantic'],
    'Coastal': ['Light', 'Seafood', 'Patio'],
    'Wine Bar': ['Cellar', 'Small plates', 'Late'],
    'Trattoria': ['Family-style', 'Pasta', 'Cozy'],
    'Omakase': ['Counter', 'Premium', 'Discreet'],
    'French': ['Classic', 'Tasting menu', 'Quiet'],
    'Steakhouse': ['Bold', 'Aged', 'Reserve list'],
    'New American': ['Seasonal', 'Modern', 'Bar program'],
    'Modern European': ['Refined', 'Tasting', 'Polished'],
    'Thai': ['Spicy', 'Vibrant', 'Group'],
};

function pickSignal(venue: Venue, type: SignalType): SignalContent {
    switch (type) {
        case 'recognition': {
            const table = 1 + Math.floor(Math.random() * 12);
            return {
                type, primary: 'Recognized', secondary: `Table ${table} ready`,
                data: { activeTable: table, tableNum: table },
            };
        }
        case 'match': {
            const pct = 84 + Math.floor(Math.random() * 16); // 84–99
            return {
                type, primary: `${pct}% taste match`, secondary: 'Curated for you',
                data: { percentage: pct },
            };
        }
        case 'social': {
            const count = 2 + Math.floor(Math.random() * 4); // 2–5
            const friends = Array.from({ length: count }).map((_, i) => ({
                initial: FRIEND_INITIALS[(i + Math.floor(Math.random() * 5)) % FRIEND_INITIALS.length],
                tone: FRIEND_TONES[i % FRIEND_TONES.length],
            }));
            return {
                type, primary: `${count} friends dining`, secondary: 'Right now',
                data: { friends },
            };
        }
        case 'availability': {
            const hour = 19 + Math.floor(Math.random() * 4);
            const minute = Math.random() < 0.5 ? 0 : 30;
            return {
                type, primary: 'Last seat tonight',
                secondary: `${hour}:${minute === 0 ? '00' : '30'}`,
                data: { time: { hour, minute } },
            };
        }
        case 'discovery': {
            const tags = STYLE_TAGS_BY_CUISINE[venue.cuisine] || [venue.cuisine];
            return {
                type, primary: 'New for you', secondary: `${venue.cuisine}`,
                data: { tags },
            };
        }
        case 'trending': {
            const bars = Array.from({ length: 8 }).map((_, i) => 2 + i + Math.floor(Math.random() * 3));
            const delta = 80 + Math.floor(Math.random() * 140);
            return {
                type, primary: 'Trending tonight', secondary: `+${delta}% vs avg`,
                data: { bars, delta },
            };
        }
    }
}

const SIGNAL_WEIGHTS: { type: SignalType; weight: number }[] = [
    { type: 'recognition', weight: 4 },
    { type: 'match', weight: 3 },
    { type: 'social', weight: 2 },
    { type: 'availability', weight: 3 },
    { type: 'discovery', weight: 2 },
    { type: 'trending', weight: 2 },
];

function pickWeightedSignalType(): SignalType {
    const total = SIGNAL_WEIGHTS.reduce((s, w) => s + w.weight, 0);
    let r = Math.random() * total;
    for (const { type, weight } of SIGNAL_WEIGHTS) {
        r -= weight;
        if (r <= 0) return type;
    }
    return 'recognition';
}

/* ─── ACTIVATION TYPES ─────────────────────────────────────────────────── */

interface ActiveVenue { venue: Venue; signal: SignalContent; key: number; }
interface ActiveRoute { from: Venue; to: Venue; distanceKm: number; minutes: number; key: number; }

const SHOW_DURATION_MS = 4500;
const IDLE_MIN_MS = 4500;
const IDLE_MAX_MS = 7000;
const ROUTE_PROBABILITY = 0.14;
const BURST_PROBABILITY = 0.18;
const HOVER_RADIUS_VB = 32;        // tight: must be very near the dot
const PROXIMITY_GLOW_VB = 60;      // small radius for halo brightening

/** Pixel offset between dot and where the card edge meets the connector line. */
const CONNECTOR_VB = 28;

/** Pan bounds in pixels (drag-to-pan limits). */
const PAN_LIMIT_X = 240;
const PAN_LIMIT_Y = 120;

function wait(ms: number) { return new Promise((r) => setTimeout(r, ms)); }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function pickRoutePair(): [Venue, Venue] | null {
    const strip = Math.random() < 0.5 ? 'top' : 'bottom';
    const pool = VENUES.filter((v) => v.strip === strip);
    if (pool.length < 2) return null;
    const i = Math.floor(Math.random() * pool.length);
    let j = Math.floor(Math.random() * pool.length);
    while (j === i) j = Math.floor(Math.random() * pool.length);
    return [pool[i], pool[j]];
}

/* ─── COMPONENT ────────────────────────────────────────────────────────── */

export function DistrictMap() {
    const [active, setActive] = useState<ActiveVenue | null>(null);
    const [activeRoute, setActiveRoute] = useState<ActiveRoute | null>(null);
    const [size, setSize] = useState({ w: 0, h: 0 });
    const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
    const [pan, setPan] = useState({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const lastVenueIdRef = useRef<number>(-1);
    const keyRef = useRef<number>(0);
    const aliveRef = useRef<boolean>(true);
    const panRef = useRef({ x: 0, y: 0 });

    /* container size */
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const update = () => {
            const r = el.getBoundingClientRect();
            setSize({ w: r.width, h: r.height });
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    /* activations */
    useEffect(() => {
        const reducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) return;
        aliveRef.current = true;

        async function showVenue() {
            let next: Venue;
            do {
                next = VENUES[Math.floor(Math.random() * VENUES.length)];
            } while (next.id === lastVenueIdRef.current && VENUES.length > 1);
            lastVenueIdRef.current = next.id;
            const sig = pickSignal(next, pickWeightedSignalType());
            keyRef.current += 1;
            setActive({ venue: next, signal: sig, key: keyRef.current });
            await wait(SHOW_DURATION_MS);
            setActive(null);
        }
        async function showRoute() {
            const pair = pickRoutePair();
            if (!pair) return;
            const [from, to] = pair;
            const dx = (to.cx - from.cx) / 1600;
            const dy = (to.cy - from.cy) / 900;
            const km = +(Math.sqrt(dx * dx + dy * dy) * 4).toFixed(1);
            const min = Math.max(3, Math.round(km * 6 + (Math.random() * 4 - 2)));
            keyRef.current += 1;
            setActiveRoute({ from, to, distanceKm: km, minutes: min, key: keyRef.current });
            await wait(2400);
            setActiveRoute(null);
        }
        async function loop() {
            await wait(2200);
            while (aliveRef.current) {
                const r = Math.random();
                if (r < ROUTE_PROBABILITY) {
                    await showRoute();
                } else if (r < ROUTE_PROBABILITY + BURST_PROBABILITY) {
                    await showVenue();
                    if (!aliveRef.current) break;
                    await wait(700);
                    if (!aliveRef.current) break;
                    await showVenue();
                } else {
                    await showVenue();
                }
                if (!aliveRef.current) break;
                const idle = IDLE_MIN_MS + Math.random() * (IDLE_MAX_MS - IDLE_MIN_MS);
                await wait(idle);
            }
        }
        loop();
        return () => { aliveRef.current = false; };
    }, []);

    /* mouse tracking — coords compensate for current pan offset */
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const isTouch =
            window.matchMedia('(hover: none)').matches ||
            window.matchMedia('(pointer: coarse)').matches;
        if (isTouch) return;

        let raf = 0;
        let pendingX = -1;
        let pendingY = -1;

        function tick() {
            if (containerRef.current && pendingX >= 0) {
                const r = containerRef.current.getBoundingClientRect();
                if (pendingX >= r.left && pendingX <= r.right && pendingY >= r.top && pendingY <= r.bottom) {
                    const cx = pendingX - r.left - panRef.current.x;
                    const cy = pendingY - r.top - panRef.current.y;
                    setMouse({
                        x: (cx / r.width) * 1600,
                        y: (cy / r.height) * 900,
                    });
                } else {
                    setMouse(null);
                }
            }
            raf = 0;
        }
        function onMove(e: MouseEvent) {
            pendingX = e.clientX;
            pendingY = e.clientY;
            if (!raf) raf = requestAnimationFrame(tick);
        }
        function onLeave() { setMouse(null); }

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseleave', onLeave);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseleave', onLeave);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    /* drag-to-pan */
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const dragTarget: HTMLDivElement = el;
        let dragging = false;
        let startX = 0, startY = 0;
        let startPanX = 0, startPanY = 0;

        function onPointerDown(e: PointerEvent) {
            if (e.button !== 0) return;
            const target = e.target as HTMLElement;
            // Don't start a drag from inside an interactive label
            if (target.closest('[data-no-drag]')) return;
            dragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startPanX = panRef.current.x;
            startPanY = panRef.current.y;
            dragTarget.setPointerCapture(e.pointerId);
        }
        function onPointerMove(e: PointerEvent) {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const newX = clamp(startPanX + dx, -PAN_LIMIT_X, PAN_LIMIT_X);
            const newY = clamp(startPanY + dy, -PAN_LIMIT_Y, PAN_LIMIT_Y);
            panRef.current = { x: newX, y: newY };
            setPan({ x: newX, y: newY });
        }
        function onPointerUp(e: PointerEvent) {
            dragging = false;
            try { dragTarget.releasePointerCapture(e.pointerId); } catch { /* noop */ }
        }
        el.addEventListener('pointerdown', onPointerDown);
        el.addEventListener('pointermove', onPointerMove);
        el.addEventListener('pointerup', onPointerUp);
        el.addEventListener('pointercancel', onPointerUp);
        return () => {
            el.removeEventListener('pointerdown', onPointerDown);
            el.removeEventListener('pointermove', onPointerMove);
            el.removeEventListener('pointerup', onPointerUp);
            el.removeEventListener('pointercancel', onPointerUp);
        };
    }, []);

    /* hover detection */
    const hovered = useMemo<Venue | null>(() => {
        if (!mouse) return null;
        let closest: Venue | null = null;
        let closestDist = Infinity;
        for (const v of VENUES) {
            const dx = v.cx - mouse.x;
            const dy = v.cy - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < HOVER_RADIUS_VB && dist < closestDist) {
                closest = v;
                closestDist = dist;
            }
        }
        return closest;
    }, [mouse]);

    /* generate a stable signal for the currently hovered venue */
    const hoverSignal = useMemo(() => {
        if (!hovered) return null;
        const sigType = HOVER_SIGNAL_TYPES[hovered.id] || 'recognition';
        return { venueId: hovered.id, signal: pickSignal(hovered, sigType) };
    }, [hovered]);

    const displayed = useMemo(() => {
        if (hovered) {
            const sig = active && active.venue.id === hovered.id
                ? active.signal
                : (hoverSignal && hoverSignal.venueId === hovered.id ? hoverSignal.signal : null);
            return sig ? { venue: hovered, signal: sig } : null;
        }
        if (active) return { venue: active.venue, signal: active.signal };
        return null;
    }, [hovered, active, hoverSignal]);

    const svgToPx = useCallback(
        (vx: number, vy: number) => {
            if (size.w === 0 || size.h === 0) return { x: 0, y: 0 };
            const scale = Math.max(size.w / 1600, size.h / 900);
            const offX = (size.w - 1600 * scale) / 2;
            const offY = (size.h - 900 * scale) / 2;
            return { x: vx * scale + offX, y: vy * scale + offY };
        },
        [size]
    );

    const allBlocks = useMemo(
        () => [...BLOCKS_OLD_TOWN, ...BLOCKS_CENTRAL, ...BLOCKS_EAST_QUARTER],
        []
    );

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden touch-none"
            style={{ cursor: 'grab' }}
        >
            {/* World wrapper — pan-translated. SVG and HTML labels both live
                inside, so they always stay anchored to each other. */}
            <motion.div
                className="absolute inset-0"
                style={{ x: pan.x, y: pan.y }}
                transition={{ type: 'tween', duration: 0 }}
            >
                <svg
                    viewBox="0 0 1600 900"
                    preserveAspectRatio="xMidYMid slice"
                    className="absolute inset-0 w-full h-full"
                    aria-hidden="true"
                >
                    <defs>
                        <filter id="venue-glow" x="-300%" y="-300%" width="700%" height="700%">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <radialGradient id="map-mask-grad" cx="50%" cy="50%" r="68%">
                            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                            <stop offset="55%" stopColor="#fff" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                        </radialGradient>
                        <mask id="map-fade">
                            <rect width="1600" height="900" fill="url(#map-mask-grad)" />
                        </mask>
                        <pattern id="water" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 0 10 Q 10 4 20 10 T 40 10" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" fill="none" />
                        </pattern>
                    </defs>

                    <g mask="url(#map-fade)">
                        <path d={WATER_FILL} fill="rgba(255,255,255,0.012)" />
                        <path d={WATER_FILL} fill="url(#water)" opacity="0.5" />
                        <path d={COASTLINE} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.9" />

                        <path d={PARK_PATH} fill="rgba(204,255,0,0.022)" stroke="rgba(204,255,0,0.10)" strokeWidth="0.8" />
                        <g fill="rgba(204,255,0,0.10)">
                            {[
                                [180, 130], [220, 160], [250, 195], [180, 220],
                                [310, 200], [340, 245], [275, 270], [220, 290],
                                [170, 280], [125, 230], [310, 280], [165, 175],
                            ].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.3" />)}
                        </g>
                        <path d={PLAZA_PATH} fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />

                        <g stroke="rgba(255,255,255,0.04)" strokeWidth="0.4">
                            {allBlocks.map((b, i) => (
                                <rect
                                    key={`b-${i}`}
                                    x={b.x} y={b.y} width={b.w} height={b.h}
                                    fill={`rgba(255,255,255,${b.a})`}
                                    transform={b.r ? `rotate(${b.r} ${b.x + b.w / 2} ${b.y + b.h / 2})` : undefined}
                                />
                            ))}
                        </g>
                        <g stroke="rgba(255,255,255,0.10)" strokeWidth="0.6">
                            {LANDMARKS.map((b, i) => (
                                <rect
                                    key={`l-${i}`}
                                    x={b.x} y={b.y} width={b.w} height={b.h}
                                    fill={`rgba(255,255,255,${b.a})`}
                                    transform={b.r ? `rotate(${b.r} ${b.x + b.w / 2} ${b.y + b.h / 2})` : undefined}
                                />
                            ))}
                        </g>
                        <g fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="0.9" strokeLinecap="round">
                            {OLD_TOWN_STREETS.map((d, i) => <path key={`ot-${i}`} d={d} />)}
                        </g>
                        <g fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8">
                            {EAST_QUARTER_STREETS.map((d, i) => <path key={`eq-${i}`} d={d} />)}
                        </g>
                        <path d={BOULEVARD} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeLinecap="round" />
                        <path d={SUBWAY} fill="none" stroke="rgba(204,255,0,0.16)" strokeWidth="0.9" strokeDasharray="3 5" strokeLinecap="round" />
                        <g fill="none" stroke="rgba(255,255,255,0.085)" strokeWidth="1.4" strokeLinecap="round">
                            {HORIZONTAL_ARTERIES.map((d, i) => <path key={`ha-${i}`} d={d} />)}
                            {VERTICAL_STREETS.map((d, i) => <path key={`vs-${i}`} d={d} />)}
                        </g>

                        <g fontFamily="serif" fontStyle="italic" fontSize="13" fill="rgba(255,255,255,0.20)">
                            <text x="220" y="58" textAnchor="middle" letterSpacing="1.5">Old Town</text>
                            <text x="200" y="218" textAnchor="middle" fill="rgba(204,255,0,0.30)" letterSpacing="1.5">Parc</text>
                            <text x="395" y="262" textAnchor="middle" letterSpacing="1.5" fontSize="11">Plaza</text>
                            <text x="1100" y="100" textAnchor="middle" letterSpacing="1.5">East Quarter</text>
                            <text x="1545" y="500" textAnchor="middle" transform="rotate(90 1545 500)" letterSpacing="1.5" fontSize="12">Bay</text>
                        </g>

                        {/* INACTIVE DOTS (with small proximity halo) */}
                        {VENUES.map((v) => {
                            const isDisplayed = displayed?.venue.id === v.id;
                            const isAuto = active?.venue.id === v.id;
                            if (isAuto) return null;
                            let proximityBoost = 0;
                            if (mouse) {
                                const dx = v.cx - mouse.x;
                                const dy = v.cy - mouse.y;
                                const dist = Math.sqrt(dx * dx + dy * dy);
                                if (dist < PROXIMITY_GLOW_VB) {
                                    proximityBoost = (1 - dist / PROXIMITY_GLOW_VB) * 0.55;
                                }
                            }
                            const baseOpacity = 0.32 + (v.weight ?? 1) * 0.08;
                            const baseRadius = 2.0 + (v.weight ?? 1) * 0.6;
                            return (
                                <g key={v.id}>
                                    <circle cx={v.cx} cy={v.cy}
                                        r={baseRadius + (isDisplayed ? 6 : 4)}
                                        fill={`rgba(204,255,0,${isDisplayed ? 0.55 : 0.05 + proximityBoost * 0.5})`} />
                                    <circle cx={v.cx} cy={v.cy}
                                        r={baseRadius + (isDisplayed ? 0.8 : 0)}
                                        fill={`rgba(204,255,0,${Math.min(1, baseOpacity + proximityBoost + (isDisplayed ? 0.4 : 0))})`} />
                                </g>
                            );
                        })}

                        {/* CONNECTOR LINE for the displayed venue (hover or auto-active) — short, vertical, always meets the dot */}
                        {displayed && (() => {
                            const v = displayed.venue;
                            const dy = v.labelAnchor === 'top' ? -CONNECTOR_VB : CONNECTOR_VB;
                            return (
                                <g key={`connector-${v.id}`}>
                                    <motion.line
                                        x1={v.cx} y1={v.cy}
                                        x2={v.cx} y2={v.cy + dy}
                                        stroke="rgba(204,255,0,0.6)"
                                        strokeWidth="1.1"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 0.85 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                    {/* small accent dot at line end (where card meets line) */}
                                    <motion.circle
                                        cx={v.cx} cy={v.cy + dy} r={1.6}
                                        fill="rgba(204,255,0,0.95)"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3, delay: 0.2 }}
                                    />
                                </g>
                            );
                        })()}

                        {/* ROUTE */}
                        <AnimatePresence>
                            {activeRoute && (() => {
                                const { from, to, key } = activeRoute;
                                return (
                                    <g key={`route-${key}`}>
                                        <motion.line
                                            x1={from.cx} y1={from.cy} x2={to.cx} y2={to.cy}
                                            stroke="rgba(204,255,0,0.55)" strokeWidth="1.4" strokeLinecap="round"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: [0, 0.9, 0.9, 0] }}
                                            transition={{ duration: 2.4, times: [0, 0.25, 0.85, 1], ease: [0.16, 1, 0.3, 1] }}
                                        />
                                        <motion.circle cx={from.cx} cy={from.cy} r={5} fill="rgba(204,255,0,0.95)" filter="url(#venue-glow)"
                                            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }}
                                            transition={{ duration: 2.4, times: [0, 0.15, 0.85, 1] }} />
                                        <motion.circle cx={to.cx} cy={to.cy} r={5} fill="rgba(204,255,0,0.95)" filter="url(#venue-glow)"
                                            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }}
                                            transition={{ duration: 2.4, times: [0, 0.15, 0.85, 1], delay: 0.15 }} />
                                    </g>
                                );
                            })()}
                        </AnimatePresence>

                        {/* AUTO-ACTIVE BRIGHT DOT */}
                        <AnimatePresence>
                            {active && (() => {
                                const v = active.venue;
                                return (
                                    <g key={`active-${active.key}`}>
                                        <motion.circle
                                            cx={v.cx} cy={v.cy} r={2.0 + (v.weight ?? 1) * 0.6}
                                            fill="rgba(204,255,0,1)" filter="url(#venue-glow)"
                                            initial={{ opacity: 0, scale: 0.6 }}
                                            animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1.4, 1.1, 1] }}
                                            exit={{ opacity: 0 }}
                                            transition={{
                                                duration: SHOW_DURATION_MS / 1000,
                                                times: [0, 0.10, 0.85, 1],
                                                ease: [0.16, 1, 0.3, 1],
                                            }}
                                            style={{ transformOrigin: `${v.cx}px ${v.cy}px` }}
                                        />
                                        <motion.circle
                                            cx={v.cx} cy={v.cy} r={3} fill="none"
                                            stroke="rgba(204,255,0,0.55)" strokeWidth="0.8"
                                            initial={{ opacity: 0, r: 3 }}
                                            animate={{ opacity: [0, 0.6, 0], r: [3, 22] }}
                                            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                                        />
                                    </g>
                                );
                            })()}
                        </AnimatePresence>
                    </g>
                </svg>

                {/* HTML overlay — venue card.
                    Two-layer pattern fixes a previous bug where framer-motion's
                    `y` animation was overriding the inline `transform:translate(-50%)`
                    used to center the card on the dot. Now the OUTER motion.div
                    only animates `opacity` and uses Tailwind utility classes for
                    the centering transform (which framer leaves alone). The
                    INNER motion.div handles `y` + `scale` for entry. They live
                    on different elements so their transforms don't fight. */}
                <AnimatePresence mode="wait">
                    {displayed && size.w > 0 && (() => {
                        const v = displayed.venue;
                        const yOffset = v.labelAnchor === 'top' ? -CONNECTOR_VB : CONNECTOR_VB;
                        const anchorPx = svgToPx(v.cx, v.cy + yOffset);
                        return (
                            <motion.div
                                key={`label-${v.id}-${displayed.signal.type}`}
                                data-no-drag="true"
                                style={{ left: anchorPx.x, top: anchorPx.y }}
                                className={`pointer-events-none absolute z-[5] ${
                                    v.labelAnchor === 'top'
                                        ? '-translate-x-1/2 -translate-y-full'
                                        : '-translate-x-1/2'
                                }`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <motion.div
                                    initial={{ y: v.labelAnchor === 'top' ? 6 : -6, scale: 0.96 }}
                                    animate={{ y: 0, scale: 1 }}
                                    exit={{ y: v.labelAnchor === 'top' ? 4 : -4, scale: 0.98 }}
                                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <PinCard venue={v} signal={displayed.signal} />
                                </motion.div>
                            </motion.div>
                        );
                    })()}
                </AnimatePresence>

                {/* HTML overlay — route info pill */}
                <AnimatePresence>
                    {activeRoute && size.w > 0 && (() => {
                        const midVB = {
                            x: (activeRoute.from.cx + activeRoute.to.cx) / 2,
                            y: (activeRoute.from.cy + activeRoute.to.cy) / 2 - 14,
                        };
                        const midPx = svgToPx(midVB.x, midVB.y);
                        return (
                            <motion.div
                                key={`route-label-${activeRoute.key}`}
                                initial={{ opacity: 0, y: 4, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                                style={{ left: midPx.x, top: midPx.y, transform: 'translate(-50%, -50%)' }}
                                className="pointer-events-none absolute z-[5]"
                            >
                                <div className="bg-[#0A0A0A]/95 backdrop-blur-md border border-white/15 rounded-full px-3.5 py-1.5 flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.55)]">
                                    <span className="font-sans text-[10.5px] font-medium tracking-tight text-yuzu/95">
                                        {activeRoute.distanceKm} km
                                    </span>
                                    <span className="w-px h-3 bg-white/15" />
                                    <span className="font-sans text-[10.5px] tracking-tight text-silver/80">
                                        {activeRoute.minutes} min
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })()}
                </AnimatePresence>
            </motion.div>

            {/* Paper-grain texture (sits ABOVE the panned content so the texture is constant) */}
            <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.06]"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")',
                }}
            />

            {/* Yuzu warmth at center */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(204,255,0,0.025)_0%,transparent_55%)]" />
        </div>
    );
}

/* ─── PIN CARD ─────────────────────────────────────────────────────────── */

function PinCard({ venue, signal }: { venue: Venue; signal: SignalContent }) {
    const Icon = CUISINE_ICONS[venue.cuisine] || PlateIcon;
    return (
        <div className="bg-[#0A0A0A]/95 backdrop-blur-md border border-white/15 rounded-md px-3.5 py-2.5 shadow-[0_8px_28px_rgba(0,0,0,0.7),0_0_18px_rgba(204,255,0,0.05)] min-w-[230px] max-w-[280px]">
            {/* Header */}
            <div className="flex items-baseline justify-between gap-3 pb-2 border-b border-white/8">
                <span className="font-serif italic text-[14px] text-white/95 leading-tight">
                    {venue.name}
                </span>
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <Icon className="w-[11px] h-[11px] text-silver/55 shrink-0" />
                    <span className="font-sans italic text-[10px] text-silver/45">
                        {venue.cuisine}
                    </span>
                </span>
            </div>
            {/* Body — varies by signal type */}
            <div className="pt-2.5">
                <SignalBody signal={signal} venue={venue} />
            </div>
            {/* Footer: live indicator + meta */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/6 gap-2">
                <span className="flex items-center gap-1.5">
                    <span className="relative flex w-1.5 h-1.5">
                        <span className="absolute inset-0 rounded-full bg-yuzu animate-ping opacity-75" />
                        <span className="relative w-1.5 h-1.5 rounded-full bg-yuzu shadow-[0_0_4px_rgba(204,255,0,0.7)]" />
                    </span>
                    <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-yuzu/75">
                        Live
                    </span>
                </span>
                <span className="font-mono text-[8.5px] text-silver/40">
                    Updated now
                </span>
            </div>
        </div>
    );
}

/* ─── CUISINE ICONS — minimalist stroke SVG glyphs ──────────────────────── */

interface IconProps { className?: string; }

function PastaIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 12 12" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
            <path d="M3 2v8 M5 2v8 M7 2v4a2 2 0 0 0 2 2v2" />
        </svg>
    );
}
function FishIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 12 12" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6c0-1.8 1.6-3 3.5-3s3.5 1.2 3.5 3-1.6 3-3.5 3S2 7.8 2 6Z" />
            <path d="M9 6l1.5-1.5v3z" />
            <circle cx="4" cy="5.5" r="0.4" fill="currentColor" />
        </svg>
    );
}
function WineIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 12 12" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 2h4l-0.5 3a1.5 1.5 0 0 1-3 0z" />
            <path d="M6 6.5v3.5 M4.5 10h3" />
        </svg>
    );
}
function BowlIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 12 12" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 5.5h8v1.5a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" />
            <path d="M5 4.2c0.3-1 1.5-1 1.5 0 M7 4.2c0.3-1 1.5-1 1.5 0" />
        </svg>
    );
}
function ChopsticksIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 12 12" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
            <line x1="2.5" y1="2" x2="9" y2="10" />
            <line x1="3.8" y1="1.7" x2="10.3" y2="9.7" />
        </svg>
    );
}
function SteakIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 12 12" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8c0-2.5 2-4 4.5-4S11 5 11 6.5 9.5 9 7 9.5 3 9.5 3 8z" />
            <path d="M5 5.5l1 1 M7 5l1 1.5" />
        </svg>
    );
}
function PlateIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 12 12" className={className} fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="6" cy="6" r="4" />
            <circle cx="6" cy="6" r="2.2" />
        </svg>
    );
}
function UtensilsIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 12 12" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
            <path d="M3 2v3.5a1 1 0 0 0 2 0V2 M4 5.5V10" />
            <path d="M9 2v8 M7.3 4l1.7-2" />
        </svg>
    );
}
function LeafIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 12 12" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 9.5C3 5 6 2.5 10 2.5c0 4-2.5 7-7 7.5z" />
            <path d="M3 9.5L8.5 4" />
        </svg>
    );
}

const CUISINE_ICONS: Record<string, React.FC<IconProps>> = {
    'Italian':         PastaIcon,
    'Coastal':         FishIcon,
    'Wine Bar':        WineIcon,
    'Trattoria':       BowlIcon,
    'Omakase':         ChopsticksIcon,
    'French':          WineIcon,
    'Steakhouse':      SteakIcon,
    'New American':    PlateIcon,
    'Modern European': UtensilsIcon,
    'Thai':            LeafIcon,
};

function SignalBody({ signal, venue }: { signal: SignalContent; venue: Venue }) {
    switch (signal.type) {
        case 'recognition': return <RecognitionBody signal={signal} />;
        case 'match':       return <MatchBody signal={signal} />;
        case 'social':      return <SocialBody signal={signal} />;
        case 'availability':return <AvailabilityBody signal={signal} />;
        case 'discovery':   return <DiscoveryBody signal={signal} venue={venue} />;
        case 'trending':    return <TrendingBody signal={signal} />;
    }
}

/* Each Body is a graphical micro-card. Compact, monochrome, on-brand. */

function RecognitionBody({ signal }: { signal: SignalContent }) {
    const active = signal.data.activeTable ?? 1;
    // Mini floor plan: 2 rows × 4 cols, alternating circle / square tables
    const tables = [
        { id: 1, type: 'square' as const, x: 0, y: 0 },
        { id: 2, type: 'circle' as const, x: 1, y: 0 },
        { id: 3, type: 'square' as const, x: 2, y: 0 },
        { id: 4, type: 'circle' as const, x: 3, y: 0 },
        { id: 5, type: 'circle' as const, x: 0, y: 1 },
        { id: 6, type: 'square' as const, x: 1, y: 1 },
        { id: 7, type: 'square' as const, x: 2, y: 1 },
        { id: 8, type: 'circle' as const, x: 3, y: 1 },
    ];
    return (
        <div className="flex items-center gap-3">
            <svg width="64" height="34" viewBox="0 0 64 34" className="shrink-0">
                {tables.map((t) => {
                    const cx = 8 + t.x * 16;
                    const cy = 8 + t.y * 16;
                    const isOn = t.id === active;
                    const fill = isOn ? 'rgb(204,255,0)' : 'transparent';
                    const stroke = isOn ? 'rgb(204,255,0)' : 'rgba(255,255,255,0.32)';
                    return t.type === 'circle' ? (
                        <circle key={t.id} cx={cx} cy={cy} r={4.2} fill={fill} stroke={stroke} strokeWidth="1" />
                    ) : (
                        <rect key={t.id} x={cx - 4.2} y={cy - 4.2} width="8.4" height="8.4" rx="1.2" fill={fill} stroke={stroke} strokeWidth="1" />
                    );
                })}
            </svg>
            <div className="flex flex-col min-w-0">
                <span className="font-sans text-[11px] font-medium text-yuzu/95 leading-tight">
                    {signal.primary}
                </span>
                <span className="font-sans text-[10px] text-silver/65 leading-tight mt-0.5">
                    {signal.secondary}
                </span>
            </div>
        </div>
    );
}

function MatchBody({ signal }: { signal: SignalContent }) {
    const pct = signal.data.percentage ?? 90;
    const radius = 14;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;
    return (
        <div className="flex items-center gap-3">
            <svg width="38" height="38" viewBox="0 0 38 38" className="shrink-0">
                <circle cx="19" cy="19" r={radius} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="2.2" />
                <circle
                    cx="19" cy="19" r={radius}
                    fill="none"
                    stroke="rgb(204,255,0)"
                    strokeWidth="2.2"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 19 19)"
                />
                <text x="19" y="22.5" textAnchor="middle" fill="white" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
                    {pct}
                </text>
            </svg>
            <div className="flex flex-col min-w-0">
                <span className="font-sans text-[11px] font-medium text-yuzu/95 leading-tight">
                    {signal.primary}
                </span>
                <span className="font-sans text-[10px] text-silver/65 leading-tight mt-0.5">
                    {signal.secondary}
                </span>
            </div>
        </div>
    );
}

function SocialBody({ signal }: { signal: SignalContent }) {
    const friends = signal.data.friends ?? [];
    return (
        <div className="flex items-center gap-3">
            <div className="flex shrink-0">
                {friends.slice(0, 5).map((f, i) => {
                    const isYuzu = f.tone === 'yuzu';
                    return (
                        <span
                            key={i}
                            style={{ marginLeft: i === 0 ? 0 : -7 }}
                            className={`relative w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-semibold border-2 border-[#0A0A0A] ${
                                isYuzu ? 'bg-yuzu text-obsidian' : 'bg-silver/40 text-white'
                            }`}
                        >
                            {f.initial}
                        </span>
                    );
                })}
            </div>
            <div className="flex flex-col min-w-0">
                <span className="font-sans text-[11px] font-medium text-yuzu/95 leading-tight">
                    {signal.primary}
                </span>
                <span className="font-sans text-[10px] text-silver/65 leading-tight mt-0.5">
                    {signal.secondary}
                </span>
            </div>
        </div>
    );
}

function AvailabilityBody({ signal }: { signal: SignalContent }) {
    const t = signal.data.time ?? { hour: 21, minute: 30 };
    const hourAngle = (((t.hour % 12) + t.minute / 60) / 12) * 360;
    const minuteAngle = (t.minute / 60) * 360;
    const hourEnd = polar(19, 19, 6, hourAngle);
    const minuteEnd = polar(19, 19, 9.5, minuteAngle);
    return (
        <div className="flex items-center gap-3">
            <svg width="38" height="38" viewBox="0 0 38 38" className="shrink-0">
                <circle cx="19" cy="19" r="14" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                {/* tick marks */}
                {[0, 90, 180, 270].map((a) => {
                    const start = polar(19, 19, 11, a);
                    const end = polar(19, 19, 13, a);
                    return (
                        <line key={a}
                            x1={start.x} y1={start.y} x2={end.x} y2={end.y}
                            stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
                    );
                })}
                <line x1="19" y1="19" x2={hourEnd.x} y2={hourEnd.y}
                    stroke="rgb(204,255,0)" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="19" y1="19" x2={minuteEnd.x} y2={minuteEnd.y}
                    stroke="rgba(255,255,255,0.85)" strokeWidth="1" strokeLinecap="round" />
                <circle cx="19" cy="19" r="1.4" fill="rgb(204,255,0)" />
            </svg>
            <div className="flex flex-col min-w-0">
                <span className="font-sans text-[11px] font-medium text-yuzu/95 leading-tight">
                    {signal.primary}
                </span>
                <span className="font-sans text-[10px] text-silver/65 leading-tight mt-0.5">
                    {signal.secondary}
                </span>
            </div>
        </div>
    );
}

function DiscoveryBody({ signal, venue }: { signal: SignalContent; venue: Venue }) {
    const tags = signal.data.tags ?? [venue.cuisine];
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1">
                {tags.map((t, i) => (
                    <span
                        key={i}
                        className="px-2 py-0.5 bg-yuzu/12 text-yuzu/85 rounded-full text-[9.5px] font-medium tracking-tight border border-yuzu/15"
                    >
                        {t}
                    </span>
                ))}
            </div>
            <div className="flex items-center gap-1.5">
                <span className="block w-1 h-1 rounded-full bg-yuzu shadow-[0_0_3px_rgba(204,255,0,0.6)] shrink-0" />
                <span className="font-sans text-[11px] font-medium text-yuzu/95">
                    {signal.primary}
                </span>
                <span className="text-silver/35 text-[10px]">·</span>
                <span className="font-sans text-[10px] text-silver/65 truncate">
                    {signal.secondary}
                </span>
            </div>
        </div>
    );
}

function TrendingBody({ signal }: { signal: SignalContent }) {
    const bars = signal.data.bars ?? [3, 4, 6, 5, 7, 9, 12, 14];
    const max = Math.max(...bars);
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-end gap-[3px] h-[28px] shrink-0" aria-hidden="true">
                {bars.map((b, i) => {
                    const isLast = i === bars.length - 1;
                    return (
                        <span
                            key={i}
                            className="block w-[4px] rounded-[1px]"
                            style={{
                                height: `${Math.max(4, (b / max) * 100)}%`,
                                background: isLast
                                    ? 'rgb(204,255,0)'
                                    : `rgba(204,255,0,${0.30 + (i / bars.length) * 0.35})`,
                                boxShadow: isLast ? '0 0 6px rgba(204,255,0,0.6)' : 'none',
                            }}
                        />
                    );
                })}
            </div>
            <div className="flex flex-col min-w-0">
                <span className="font-sans text-[11px] font-medium text-yuzu/95 leading-tight">
                    {signal.primary}
                </span>
                <span className="font-sans text-[10px] text-silver/65 leading-tight mt-0.5">
                    {signal.secondary}
                </span>
            </div>
        </div>
    );
}

/* ─── HELPERS ─────────────────────────────────────────────────────────── */

function polar(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
