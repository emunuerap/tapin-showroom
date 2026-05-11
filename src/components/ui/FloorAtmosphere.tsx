import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * FloorAtmosphere — the Hero atmosphere for the "For Venues" view.
 *
 * Concept: a live architectural BLUEPRINT of a single restaurant. Rendered
 * with the visual language of a technical drawing — blueprint grid, dimension
 * lines with measurements, hatching for service zones (kitchen/bar), door
 * swing arc, compass, title block. On top of that scaffolding the venue is
 * ALIVE: tables transition state on their own (vacant → seated → ordered →
 * checking → vacant), party-size dots appear inside seated tables, walk-in
 * dots route from the entrance to a vacant table, four KPI cards with live
 * sparklines sit at the corners, and an activity ticker streams what TapIn
 * sees. Hover over a table to open a rich detail card with party size,
 * dwell time, server, course.
 *
 * Drag to pan. Same palette / paper grain / vignette as the city map so
 * Guests↔Venues feel like one universe.
 */

/* ─── DATA ─────────────────────────────────────────────────────────────── */

type TableType = 'square' | 'round' | 'booth';
type TableState = 'vacant' | 'seated' | 'ordered' | 'checking';

interface Table {
    id: number;
    type: TableType;
    cx: number;
    cy: number;
    w: number;
    h: number;
    capacity: number;
    /** Optional small rotation (degrees) for organic floor feel. */
    rotate?: number;
}

interface TableInstance {
    state: TableState;
    partySize: number;
    seatedAt: number | null; // ms timestamp
    server: string;
    course: string;
}

/** 12 tables (down from 17) for breathing room. Mix of types and sizes
 *  curated so each table feels like a deliberate place, not filler. */
const TABLES: Table[] = [
    // ── TOP STRIP (6) ───────────────────────────────────────────────
    { id: 1,  type: 'square', cx: 300,  cy: 230, w: 60, h: 60, capacity: 4 },
    { id: 2,  type: 'round',  cx: 460,  cy: 220, w: 56, h: 56, capacity: 2, rotate: -3 },
    { id: 3,  type: 'round',  cx: 690,  cy: 225, w: 72, h: 72, capacity: 4 },
    { id: 4,  type: 'booth',  cx: 940,  cy: 230, w: 90, h: 56, capacity: 4 },
    { id: 5,  type: 'square', cx: 1140, cy: 230, w: 60, h: 60, capacity: 4 },
    { id: 6,  type: 'round',  cx: 1320, cy: 225, w: 60, h: 60, capacity: 2 },
    // ── BOTTOM STRIP (6) ────────────────────────────────────────────
    { id: 7,  type: 'round',  cx: 300,  cy: 690, w: 56, h: 56, capacity: 2 },
    { id: 8,  type: 'round',  cx: 530,  cy: 690, w: 72, h: 72, capacity: 4 },
    { id: 9,  type: 'booth',  cx: 740,  cy: 700, w: 110, h: 56, capacity: 6 },
    { id: 10, type: 'square', cx: 940,  cy: 700, w: 60, h: 60, capacity: 4 },
    { id: 11, type: 'square', cx: 1130, cy: 700, w: 60, h: 60, capacity: 4, rotate: 4 },
    { id: 12, type: 'round',  cx: 1310, cy: 690, w: 84, h: 84, capacity: 6 },
];

/* Architecture (in viewBox 1600x900) */
const FLOOR_WALL  = { x: 50, y: 95, w: 1500, h: 760, rx: 14 };
const BAR_AREA    = { x: 80, y: 130, w: 80, h: 690 };
const KITCHEN     = { x: 1430, y: 130, w: 100, h: 360 };
const HOST_STAND  = { x: 760, y: 105, w: 80, h: 26 };
const ENTRANCE    = { cx: 800, cy: 75, w: 110 };
const ENTRANCE_TARGET = { cx: 800, cy: 145 }; // where walk-in dots start their route

const BAR_STOOLS = Array.from({ length: 9 }, (_, i) => ({
    x: BAR_AREA.x + BAR_AREA.w + 12,
    y: BAR_AREA.y + 30 + i * (BAR_AREA.h - 60) / 8,
}));

/* Mock data pools */
const SERVERS = ['Ana', 'Marc', 'Sofía', 'Diego', 'Lía', 'Tomás', 'Elena', 'Marc B.', 'Carla'];
const COURSES = ['Aperitif', 'Starters', 'Mains', 'Cheese', 'Dessert', 'Coffee'];

function pickFrom<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

/* ─── BLUEPRINT ANNOTATIONS ────────────────────────────────────────────── */

interface DimensionLine {
    /** Orientation. */
    axis: 'x' | 'y';
    /** Position perpendicular to the axis (y for x-axis lines, x for y-axis). */
    pos: number;
    /** Start coordinate along the axis. */
    from: number;
    /** End coordinate along the axis. */
    to: number;
    /** Label text shown in the middle. */
    label: string;
}

/** Dimension lines kept OUTSIDE the active floor zones to prevent collisions
 *  with the entrance, host stand, activity ticker, and title block. Two
 *  vertical measurements on the far left wall (showing room height in halves)
 *  are enough to read as "blueprint" without crowding anything. */
const DIMENSIONS: DimensionLine[] = [
    { axis: 'y', pos: 30, from: 130, to: 460, label: '3.40 m' },
    { axis: 'y', pos: 30, from: 460, to: 820, label: '3.60 m' },
];

interface SectionMarker { id: string; cx: number; cy: number; }
const SECTION_MARKERS: SectionMarker[] = [
    { id: 'A', cx: 200, cy: 470 },
    { id: 'B', cx: 1390, cy: 470 },
    { id: 'C', cx: 800, cy: 870 },
];

/* ─── SENTIENT RECOMMENDATIONS ─────────────────────────────────────────── */

interface Recommendation {
    targetTableId: number;
    text: string;
    eta?: string;
    priority: 'normal' | 'high';
}

/** Recommendations target real tables in the new 12-table layout.
 *  Table types referenced: T03 round 4-top, T04 booth, T07 round 2-top,
 *  T08 round 4-top, T09 booth 6-top, T12 round 6-top. */
const RECOMMENDATIONS: Recommendation[] = [
    { targetTableId: 4,  text: 'Free in 8m · pre-stage next 4-top',     eta: '19:42', priority: 'normal' },
    { targetTableId: 9,  text: 'VIP party · reseat booth before 19:45', eta: '19:45', priority: 'high'   },
    { targetTableId: 7,  text: 'Aging dwell · soft check-in advised',   eta: 'now',   priority: 'normal' },
    { targetTableId: 3,  text: 'Optimal slot for next walk-in (4-top)', eta: 'now',   priority: 'normal' },
    { targetTableId: 12, text: 'Long table free · open for group of 6', eta: '19:50', priority: 'normal' },
    { targetTableId: 8,  text: 'Course pacing slow · prompt server',    eta: 'now',   priority: 'high'   },
];

/* ─── KPI CARDS WITH SPARKLINES ────────────────────────────────────────── */

interface KPIView {
    value: string;
    subValue: string;
    delta: string;
    deltaPositive: boolean;
    spark: number[];
    range: string; // "this hour", "tonight", "last 7d"…
}

interface KPI {
    id: string;
    label: string;
    views: KPIView[];
}

function makeSparkline(seed: number, trend: 'up' | 'flat' | 'down'): number[] {
    const out: number[] = [];
    let v = 50 + seed * 7;
    for (let i = 0; i < 14; i++) {
        const drift = trend === 'up' ? 1.2 : trend === 'down' ? -1.0 : 0;
        v += drift + (Math.random() - 0.5) * 6;
        v = Math.max(20, Math.min(95, v));
        out.push(v);
    }
    return out;
}

/* Each KPI card has 3 views the user can cycle through by clicking. */
const KPIS: KPI[] = [
    {
        id: 'revpash', label: 'RevPASH',
        views: [
            { value: '€34.20', subValue: 'per seat / hr', delta: '+18%',  deltaPositive: true, spark: makeSparkline(1, 'up'),   range: 'this hour' },
            { value: '€891',   subValue: 'tonight total',  delta: '+12%', deltaPositive: true, spark: makeSparkline(2, 'up'),   range: 'tonight'   },
            { value: '€8.4k',  subValue: 'projected week', delta: '+9%',  deltaPositive: true, spark: makeSparkline(3, 'flat'), range: 'last 7d'   },
        ],
    },
    {
        id: 'covers', label: 'Coverage',
        views: [
            { value: '12 / 14', subValue: '85% seated',     delta: '+2',     deltaPositive: true, spark: makeSparkline(2, 'up'),   range: 'right now' },
            { value: '76 cov',  subValue: 'tonight target', delta: 'on pace',deltaPositive: true, spark: makeSparkline(4, 'up'),   range: 'tonight'   },
            { value: '4.2x',    subValue: 'turns / seat',   delta: '+0.6',   deltaPositive: true, spark: makeSparkline(5, 'flat'), range: 'last 7d'   },
        ],
    },
    {
        id: 'dwell', label: 'Avg dwell',
        views: [
            { value: '64m',    subValue: 'optimal range',     delta: 'on target',  deltaPositive: true,  spark: makeSparkline(3, 'flat'), range: 'right now' },
            { value: '15/17',  subValue: 'tables on track',   delta: '88%',        deltaPositive: true,  spark: makeSparkline(6, 'flat'), range: 'tonight'   },
            { value: '+8m',    subValue: 'vs last Friday',    delta: 'within band',deltaPositive: true,  spark: makeSparkline(7, 'up'),   range: 'last week' },
        ],
    },
    {
        id: 'walkins', label: 'Walk-ins',
        views: [
            { value: '3',    subValue: '8 min wait',          delta: 'incoming',         deltaPositive: true, spark: makeSparkline(4, 'up'), range: 'right now' },
            { value: '14',   subValue: 'walked-in tonight',   delta: '+4 vs avg',        deltaPositive: true, spark: makeSparkline(8, 'up'), range: 'tonight'   },
            { value: '92%',  subValue: 'walk-in seat rate',   delta: 'top decile',       deltaPositive: true, spark: makeSparkline(9, 'flat'), range: 'last 7d' },
        ],
    },
];

/* ─── ANIMATIONS / TIMINGS ─────────────────────────────────────────────── */

const STATE_TRANSITION_MIN_MS = 2400;
const STATE_TRANSITION_MAX_MS = 4200;
const WALKIN_INTERVAL_MIN_MS  = 11000;
const WALKIN_INTERVAL_MAX_MS  = 17000;
const HOVER_RADIUS_VB         = 60;
const PAN_LIMIT_X             = 240;
const PAN_LIMIT_Y             = 100;

function wait(ms: number) { return new Promise((r) => setTimeout(r, ms)); }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function nextState(s: TableState): TableState {
    return s === 'vacant' ? 'seated' : s === 'seated' ? 'ordered' : s === 'ordered' ? 'checking' : 'vacant';
}

const STATE_VISUAL: Record<TableState, { fill: string; stroke: string; strokeWidth: number; glow: boolean }> = {
    vacant:   { fill: 'transparent',                stroke: 'rgba(255,255,255,0.34)', strokeWidth: 1,   glow: false },
    seated:   { fill: 'rgba(255,255,255,0.06)',     stroke: 'rgba(255,255,255,0.50)', strokeWidth: 1,   glow: false },
    ordered:  { fill: 'rgba(204,255,0,0.10)',       stroke: 'rgba(204,255,0,0.60)',   strokeWidth: 1.2, glow: true  },
    checking: { fill: 'rgba(204,255,0,0.18)',       stroke: 'rgba(204,255,0,0.90)',   strokeWidth: 1.6, glow: true  },
};

const STATE_LABEL: Record<TableState, string> = {
    vacant: 'Vacant', seated: 'Seated', ordered: 'Ordered · Mid-service', checking: 'Checking out',
};

/* Initial states + party sizes for an interesting starting picture */
function initialInstances(): Record<number, TableInstance> {
    const states: Record<number, TableInstance> = {};
    const pool: TableState[] = ['vacant', 'seated', 'seated', 'ordered', 'ordered', 'ordered', 'checking', 'vacant'];
    for (const t of TABLES) {
        const state = pool[Math.floor(Math.random() * pool.length)];
        const partySize = state === 'vacant' ? 0 : Math.max(1, Math.min(t.capacity, 1 + Math.floor(Math.random() * t.capacity)));
        states[t.id] = {
            state,
            partySize,
            seatedAt: state === 'vacant' ? null : Date.now() - Math.floor(Math.random() * 50) * 60 * 1000,
            server: pickFrom(SERVERS),
            course: state === 'ordered' ? pickFrom(COURSES) : '—',
        };
    }
    return states;
}

/* ─── TICKER ───────────────────────────────────────────────────────────── */

interface TickerEvent { id: string; time: string; text: string; }

function nowHHMM(): string {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/* ─── COMPONENT ─────────────────────────────────────────────────────────── */

export function FloorAtmosphere() {
    const [tables, setTables] = useState<Record<number, TableInstance>>(initialInstances);
    const [size, setSize] = useState({ w: 0, h: 0 });
    const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [recentChange, setRecentChange] = useState<number | null>(null);
    const [walkIn, setWalkIn] = useState<{ targetId: number; key: number } | null>(null);
    const [nowMs, setNowMs] = useState(() => Date.now());
    const [tickerEvents, setTickerEvents] = useState<TickerEvent[]>([
        { id: 't1', time: nowHHMM(), text: 'Service started · 17 covers loaded' },
        { id: 't2', time: nowHHMM(), text: 'Sentient: Optimal seating ready' },
    ]);
    const [recIdx, setRecIdx] = useState(0);
    const activeRec = RECOMMENDATIONS[recIdx];

    const containerRef = useRef<HTMLDivElement>(null);
    const aliveRef = useRef<boolean>(true);
    const panRef = useRef({ x: 0, y: 0 });
    const tickerIdRef = useRef<number>(2);
    /** Always-fresh tables ref — async loops read this to avoid stale closure data. */
    const tablesRef = useRef<Record<number, TableInstance>>(tables);
    useEffect(() => { tablesRef.current = tables; }, [tables]);

    useEffect(() => {
        const id = window.setInterval(() => setNowMs(Date.now()), 30000);
        return () => window.clearInterval(id);
    }, []);

    /* Auto-rotate Sentient recommendations every 6.5s */
    useEffect(() => {
        const id = setInterval(() => {
            setRecIdx((i) => (i + 1) % RECOMMENDATIONS.length);
        }, 6500);
        return () => clearInterval(id);
    }, []);

    const pushTicker = useCallback((text: string) => {
        tickerIdRef.current += 1;
        // Capture id + time outside the updater to avoid stale-closure
        // duplicate-key issues if React batches calls.
        const id = `t${tickerIdRef.current}`;
        const time = nowHHMM();
        setTickerEvents((prev) => {
            const next = [...prev, { id, time, text }];
            return next.slice(-4);
        });
    }, []);

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

    /* table state transitions */
    useEffect(() => {
        const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) return;
        aliveRef.current = true;

        async function loop() {
            await wait(1500);
            while (aliveRef.current) {
                await wait(STATE_TRANSITION_MIN_MS + Math.random() * (STATE_TRANSITION_MAX_MS - STATE_TRANSITION_MIN_MS));
                if (!aliveRef.current) break;

                const table = TABLES[Math.floor(Math.random() * TABLES.length)];
                setTables((prev) => {
                    const cur = prev[table.id];
                    const ns = nextState(cur.state);
                    let partySize = cur.partySize;
                    let seatedAt = cur.seatedAt;
                    let server = cur.server;
                    let course = cur.course;

                    if (ns === 'seated') {
                        partySize = Math.max(1, Math.min(table.capacity, 1 + Math.floor(Math.random() * table.capacity)));
                        seatedAt = Date.now();
                        server = pickFrom(SERVERS);
                        course = '—';
                    } else if (ns === 'ordered') {
                        course = pickFrom(COURSES);
                    } else if (ns === 'checking') {
                        course = 'Check requested';
                    } else if (ns === 'vacant') {
                        partySize = 0;
                        seatedAt = null;
                        course = '—';
                    }

                    return { ...prev, [table.id]: { state: ns, partySize, seatedAt, server, course } };
                });

                setRecentChange(table.id);
                setTimeout(() => setRecentChange((id) => (id === table.id ? null : id)), 1100);

                // Ticker event — read CURRENT state from ref (post-update tables)
                const inst = tablesRef.current[table.id];
                if (inst) {
                    const lines: Record<TableState, string> = {
                        seated:   `Table ${table.id} · Seated · ${inst.partySize || table.capacity}-top`,
                        ordered:  `Table ${table.id} · Order placed`,
                        checking: `Table ${table.id} · Check requested`,
                        vacant:   `Table ${table.id} · Cleared`,
                    };
                    pushTicker(lines[inst.state]);
                }
            }
        }
        loop();
        return () => { aliveRef.current = false; };
    }, [pushTicker]);

    /* walk-in events: occasional yuzu dot from entrance to a vacant table */
    useEffect(() => {
        const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) return;
        let alive = true;
        let key = 0;

        async function loop() {
            await wait(5500);
            while (alive) {
                await wait(WALKIN_INTERVAL_MIN_MS + Math.random() * (WALKIN_INTERVAL_MAX_MS - WALKIN_INTERVAL_MIN_MS));
                if (!alive) break;
                // pick a vacant table; fall back to any (read from ref so we get fresh state)
                const cur = tablesRef.current;
                const vacant = TABLES.filter((t) => cur[t.id]?.state === 'vacant');
                const pool = vacant.length ? vacant : TABLES;
                const target = pool[Math.floor(Math.random() * pool.length)];
                key += 1;
                setWalkIn({ targetId: target.id, key });
                pushTicker(`Walk-in arrived · Routing to Table ${target.id}`);
                await wait(2800);
                if (!alive) break;
                setWalkIn(null);
            }
        }
        loop();
        return () => { alive = false; };
    }, [pushTicker]);

    /* mouse tracking */
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const isTouch = window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches;
        if (isTouch) return;

        let raf = 0;
        let pendingX = -1, pendingY = -1;

        function tick() {
            if (containerRef.current && pendingX >= 0) {
                const r = containerRef.current.getBoundingClientRect();
                if (pendingX >= r.left && pendingX <= r.right && pendingY >= r.top && pendingY <= r.bottom) {
                    const cx = pendingX - r.left - panRef.current.x;
                    const cy = pendingY - r.top - panRef.current.y;
                    setMouse({ x: (cx / r.width) * 1600, y: (cy / r.height) * 900 });
                } else {
                    setMouse(null);
                }
            }
            raf = 0;
        }
        function onMove(e: MouseEvent) {
            pendingX = e.clientX; pendingY = e.clientY;
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
        let startX = 0, startY = 0, startPanX = 0, startPanY = 0;

        function onPointerDown(e: PointerEvent) {
            if (e.button !== 0) return;
            const target = e.target as HTMLElement;
            if (target.closest('[data-no-drag]')) return;
            dragging = true;
            startX = e.clientX; startY = e.clientY;
            startPanX = panRef.current.x; startPanY = panRef.current.y;
            dragTarget.setPointerCapture(e.pointerId);
        }
        function onPointerMove(e: PointerEvent) {
            if (!dragging) return;
            const dx = e.clientX - startX, dy = e.clientY - startY;
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

    /* sticky hover — when the cursor leaves a venue area, the detail card and
       table highlight linger for 400ms before clearing. If the cursor enters
       another venue within that window, the new venue takes over instantly.
       Subtle but a much more elegant feel. */
    const [stickyHovered, setStickyHovered] = useState<Table | null>(null);

    /* hover detection */
    const hovered = useMemo<Table | null>(() => {
        if (!mouse) return null;
        let closest: Table | null = null;
        let closestDist = Infinity;
        for (const t of TABLES) {
            const dx = t.cx - mouse.x;
            const dy = t.cy - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < HOVER_RADIUS_VB && dist < closestDist) {
                closest = t;
                closestDist = dist;
            }
        }
        return closest;
    }, [mouse]);

    /* Linger logic: hover entering a venue updates instantly; leaving waits
       400ms (so casual cursor flicks don't kill the detail card). Re-entry
       within the window cancels the clear. */
    useEffect(() => {
        if (hovered) {
            const t = window.setTimeout(() => setStickyHovered(hovered), 0);
            return () => window.clearTimeout(t);
        }
        const t = window.setTimeout(() => setStickyHovered(null), 400);
        return () => window.clearTimeout(t);
    }, [hovered]);

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

    /* hovered position uses sticky so the card position lingers with the card */
    const hoveredPx = useMemo(() => {
        if (!stickyHovered) return null;
        const yOffset = stickyHovered.cy < 450 ? -55 : 55;
        return {
            anchor: svgToPx(stickyHovered.cx, stickyHovered.cy + yOffset),
            anchorIsTop: stickyHovered.cy < 450,
        };
    }, [stickyHovered, svgToPx]);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden touch-none" style={{ cursor: 'grab' }}>
            <motion.div
                className="absolute inset-0"
                style={{ x: pan.x, y: pan.y }}
                transition={{ type: 'tween', duration: 0 }}
            >
                <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden="true">
                    <defs>
                        <radialGradient id="floor-mask-grad" cx="50%" cy="50%" r="80%">
                            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                            <stop offset="60%" stopColor="#fff" stopOpacity="0.92" />
                            <stop offset="100%" stopColor="#fff" stopOpacity="0.28" />
                        </radialGradient>
                        <mask id="floor-fade">
                            <rect width="1600" height="900" fill="url(#floor-mask-grad)" />
                        </mask>
                        <filter id="table-glow" x="-200%" y="-200%" width="500%" height="500%">
                            <feGaussianBlur stdDeviation="3" result="b" />
                            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>

                        {/* Blueprint grid: minor 20px + major 100px */}
                        <pattern id="grid-minor" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 L 0 20" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.4" />
                        </pattern>
                        <pattern id="grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
                            <rect width="100" height="100" fill="url(#grid-minor)" />
                            <path d="M 100 0 L 0 0 L 0 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
                        </pattern>

                        {/* Hatching for service zones (kitchen/bar) */}
                        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.10)" strokeWidth="0.7" />
                        </pattern>

                        {/* Crosshair markers at the major grid intersections */}
                        <pattern id="grid-crosshair" width="100" height="100" patternUnits="userSpaceOnUse">
                            <line x1="-2" y1="0" x2="2" y2="0" stroke="rgba(255,255,255,0.10)" strokeWidth="0.5" />
                            <line x1="0" y1="-2" x2="0" y2="2" stroke="rgba(255,255,255,0.10)" strokeWidth="0.5" />
                        </pattern>
                    </defs>

                    <g mask="url(#floor-fade)">
                        {/* GRID PAPER BACKGROUND — subtle, single layer (the
                            crosshair overlay was removed to reduce visual noise) */}
                        <rect width="1600" height="900" fill="url(#grid-major)" />

                        {/* OUTER WALL — drawn as DOUBLE LINE for architectural feel */}
                        <rect
                            x={FLOOR_WALL.x} y={FLOOR_WALL.y}
                            width={FLOOR_WALL.w} height={FLOOR_WALL.h}
                            rx={FLOOR_WALL.rx}
                            fill="none"
                            stroke="rgba(255,255,255,0.20)" strokeWidth="1.4"
                        />
                        <rect
                            x={FLOOR_WALL.x + 4} y={FLOOR_WALL.y + 4}
                            width={FLOOR_WALL.w - 8} height={FLOOR_WALL.h - 8}
                            rx={FLOOR_WALL.rx - 4}
                            fill="none"
                            stroke="rgba(255,255,255,0.10)" strokeWidth="0.6"
                        />

                        {/* DIMENSION LINES with measurements */}
                        <DimensionLines />

                        {/* SECTION MARKERS — kept but quieter; pure blueprint
                            decoration so they shouldn't compete with live data */}
                        <g>
                            {SECTION_MARKERS.map((m) => (
                                <g key={m.id}>
                                    <circle cx={m.cx} cy={m.cy} r="8" fill="rgba(5,5,5,0.7)" stroke="rgba(204,255,0,0.30)" strokeWidth="0.6" />
                                    <text x={m.cx} y={m.cy + 3} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="rgba(204,255,0,0.55)" fontWeight="700">
                                        {m.id}
                                    </text>
                                </g>
                            ))}
                        </g>

                        {/* BAR — hatched */}
                        <rect
                            x={BAR_AREA.x} y={BAR_AREA.y}
                            width={BAR_AREA.w} height={BAR_AREA.h}
                            rx={2}
                            fill="url(#hatch)"
                            stroke="rgba(255,255,255,0.30)" strokeWidth="0.9"
                        />
                        <text x={BAR_AREA.x + BAR_AREA.w / 2} y={BAR_AREA.y + BAR_AREA.h / 2}
                            textAnchor="middle"
                            transform={`rotate(-90 ${BAR_AREA.x + BAR_AREA.w / 2} ${BAR_AREA.y + BAR_AREA.h / 2})`}
                            fontFamily="monospace" fontSize="10" letterSpacing="3"
                            fill="rgba(255,255,255,0.55)">
                            BAR · 9 STOOLS
                        </text>
                        {BAR_STOOLS.map((s, i) => (
                            <circle key={i} cx={s.x} cy={s.y} r="3.5"
                                fill="rgba(5,5,5,0.6)"
                                stroke="rgba(255,255,255,0.40)" strokeWidth="0.7" />
                        ))}

                        {/* KITCHEN — hatched */}
                        <rect x={KITCHEN.x} y={KITCHEN.y}
                            width={KITCHEN.w} height={KITCHEN.h}
                            rx={2}
                            fill="url(#hatch)"
                            stroke="rgba(255,255,255,0.30)" strokeWidth="0.9"
                            strokeDasharray="6 3" />
                        <text x={KITCHEN.x + KITCHEN.w / 2} y={KITCHEN.y + KITCHEN.h / 2}
                            textAnchor="middle"
                            transform={`rotate(-90 ${KITCHEN.x + KITCHEN.w / 2} ${KITCHEN.y + KITCHEN.h / 2})`}
                            fontFamily="monospace" fontSize="10" letterSpacing="3"
                            fill="rgba(255,255,255,0.55)">
                            KITCHEN · BACK OF HOUSE
                        </text>

                        {/* HOST STAND */}
                        <rect x={HOST_STAND.x} y={HOST_STAND.y}
                            width={HOST_STAND.w} height={HOST_STAND.h}
                            rx={2}
                            fill="rgba(204,255,0,0.10)"
                            stroke="rgba(204,255,0,0.55)" strokeWidth="1" />
                        <text x={HOST_STAND.x + HOST_STAND.w / 2} y={HOST_STAND.y + HOST_STAND.h / 2 + 3}
                            textAnchor="middle"
                            fontFamily="monospace" fontSize="9" letterSpacing="2"
                            fill="rgba(204,255,0,0.85)">
                            HOST
                        </text>

                        {/* ENTRANCE with door swing arc */}
                        <g stroke="rgba(204,255,0,0.55)" fill="none" strokeWidth="1" strokeLinecap="round">
                            {/* Door opening (gap) */}
                            <line x1={ENTRANCE.cx - ENTRANCE.w / 2} y1={ENTRANCE.cy} x2={ENTRANCE.cx - 18} y2={ENTRANCE.cy} />
                            <line x1={ENTRANCE.cx + 18} y1={ENTRANCE.cy} x2={ENTRANCE.cx + ENTRANCE.w / 2} y2={ENTRANCE.cy} />
                            {/* Door panel */}
                            <line x1={ENTRANCE.cx - 18} y1={ENTRANCE.cy} x2={ENTRANCE.cx - 18} y2={ENTRANCE.cy + 36} strokeWidth="1.4" />
                            {/* Door swing arc */}
                            <path d={`M ${ENTRANCE.cx - 18} ${ENTRANCE.cy + 36} A 36 36 0 0 1 ${ENTRANCE.cx + 18} ${ENTRANCE.cy}`} strokeWidth="0.6" strokeDasharray="2 3" />
                        </g>
                        <text x={ENTRANCE.cx} y={ENTRANCE.cy - 8}
                            textAnchor="middle"
                            fontFamily="monospace" fontSize="8" letterSpacing="2"
                            fill="rgba(204,255,0,0.7)">
                            ENTRANCE
                        </text>

                        {/* TABLES — wrapped in motion.g for staggered draw-in
                            entrance on mount. Inner <g> handles optional small
                            rotation per-table (organic, not a perfect grid). */}
                        {TABLES.map((t, idx) => {
                            const inst = tables[t.id];
                            if (!inst) return null;
                            const v = STATE_VISUAL[inst.state];
                            const isHovered = stickyHovered?.id === t.id;
                            const isRecent = recentChange === t.id;
                            const isCircle = t.type === 'round';
                            const isActive = inst.state === 'ordered' || inst.state === 'checking';
                            const hw = t.w / 2, hh = t.h / 2;
                            const rotateAttr = t.rotate ? `rotate(${t.rotate} ${t.cx} ${t.cy})` : undefined;

                            return (
                                <motion.g
                                    key={t.id}
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: 0.55,
                                        delay: 0.18 + idx * 0.06,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    style={{ transformOrigin: `${t.cx}px ${t.cy}px` }}
                                >
                                    <g transform={rotateAttr}>
                                        {/* Drop shadow for active tables — soft offset
                                            yuzu silhouette for a subtle sense of depth. */}
                                        {isActive && (
                                            isCircle ? (
                                                <circle cx={t.cx} cy={t.cy + 3} r={hw}
                                                    fill="rgba(204,255,0,0.32)"
                                                    style={{ filter: 'blur(4px)' }} />
                                            ) : (
                                                <rect x={t.cx - hw} y={t.cy - hh + 3}
                                                    width={t.w} height={t.h} rx={3}
                                                    fill="rgba(204,255,0,0.32)"
                                                    style={{ filter: 'blur(4px)' }} />
                                            )
                                        )}
                                        {/* Recent-change pulse ring */}
                                        {isRecent && (
                                            <motion.circle cx={t.cx} cy={t.cy}
                                                r={Math.max(hw, hh) + 2} fill="none"
                                                stroke="rgba(204,255,0,0.6)" strokeWidth="1"
                                                initial={{ opacity: 0.7, scale: 1 }}
                                                animate={{ opacity: 0, scale: 1.7 }}
                                                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                                                style={{ transformOrigin: `${t.cx}px ${t.cy}px` }}
                                            />
                                        )}
                                        {/* Chairs around the table — capacity, occupied = filled */}
                                        <TableChairs table={t} partySize={inst.partySize} state={inst.state} hovered={isHovered} />
                                        {/* Hover glow — soft yuzu blur underneath */}
                                        {isHovered && (
                                            isCircle ? (
                                                <circle cx={t.cx} cy={t.cy} r={hw + 1}
                                                    fill="rgba(204,255,0,0.18)"
                                                    style={{ filter: 'blur(6px)' }} />
                                            ) : (
                                                <rect x={t.cx - hw - 1} y={t.cy - hh - 1}
                                                    width={t.w + 2} height={t.h + 2} rx={4}
                                                    fill="rgba(204,255,0,0.18)"
                                                    style={{ filter: 'blur(6px)' }} />
                                            )
                                        )}
                                        {/* Table shape — when hovered, brighter stroke + glow */}
                                        {isCircle ? (
                                            <circle cx={t.cx} cy={t.cy} r={hw}
                                                fill={v.fill}
                                                stroke={isHovered ? 'rgba(204,255,0,0.95)' : v.stroke}
                                                strokeWidth={isHovered ? v.strokeWidth + 0.4 : v.strokeWidth}
                                                filter={v.glow || isHovered ? 'url(#table-glow)' : undefined} />
                                        ) : (
                                            <rect x={t.cx - hw} y={t.cy - hh}
                                                width={t.w} height={t.h} rx={3}
                                                fill={v.fill}
                                                stroke={isHovered ? 'rgba(204,255,0,0.95)' : v.stroke}
                                                strokeWidth={isHovered ? v.strokeWidth + 0.4 : v.strokeWidth}
                                                filter={v.glow || isHovered ? 'url(#table-glow)' : undefined} />
                                        )}
                                    {/* Recommendation badge — small yuzu dot at the top-right
                                        corner of the table when this table is the current
                                        Sentient recommendation. Soft entry, no infinite
                                        radar pulse (that was visual noise). */}
                                    {activeRec && activeRec.targetTableId === t.id && (
                                        <motion.circle
                                            cx={t.cx + hw + 2} cy={t.cy - hh + 2}
                                            r={3}
                                            fill="rgba(204,255,0,0.95)"
                                            filter="url(#table-glow)"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        />
                                    )}
                                    {/* Table number — INSIDE the table (centered), no
                                        more collision with chairs above. */}
                                        <text x={t.cx} y={t.cy + 3.5}
                                            textAnchor="middle"
                                            fontFamily="monospace" fontSize="10"
                                            fill={isHovered ? 'rgba(204,255,0,1)' : (inst.state === 'vacant' ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.85)')}
                                            letterSpacing="1.5"
                                            style={{ transition: 'fill 200ms', pointerEvents: 'none' }}>
                                            T{String(t.id).padStart(2, '0')}
                                        </text>
                                    </g>
                                </motion.g>
                            );
                        })}

                        {/* WALK-IN dot animation */}
                        <AnimatePresence>
                            {walkIn && (() => {
                                const target = TABLES.find((t) => t.id === walkIn.targetId);
                                if (!target) return null;
                                return (
                                    <g key={`walkin-${walkIn.key}`}>
                                        {/* Path line */}
                                        <motion.line
                                            x1={ENTRANCE_TARGET.cx} y1={ENTRANCE_TARGET.cy}
                                            x2={target.cx} y2={target.cy}
                                            stroke="rgba(204,255,0,0.40)"
                                            strokeWidth="1"
                                            strokeDasharray="3 4"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: [0, 0.7, 0.7, 0] }}
                                            transition={{ duration: 2.6, times: [0, 0.3, 0.85, 1] }}
                                        />
                                        {/* Trail dots — fade behind the leading dot,
                                            smaller and fainter as they trail. Adds a
                                            premium "moving signal" feel. */}
                                        {[0.14, 0.28].map((d, ti) => (
                                            <motion.circle
                                                key={`trail-${walkIn.key}-${ti}`}
                                                r={3 - ti * 0.7}
                                                fill={`rgba(204,255,0,${0.55 - ti * 0.15})`}
                                                initial={{ cx: ENTRANCE_TARGET.cx, cy: ENTRANCE_TARGET.cy, opacity: 0 }}
                                                animate={{
                                                    cx: target.cx,
                                                    cy: target.cy,
                                                    opacity: [0, 0.55 - ti * 0.15, 0.55 - ti * 0.15, 0],
                                                }}
                                                transition={{
                                                    duration: 2.6,
                                                    cx: { duration: 2.4, ease: [0.4, 0, 0.2, 1], delay: d },
                                                    cy: { duration: 2.4, ease: [0.4, 0, 0.2, 1], delay: d },
                                                    opacity: { duration: 2.6, times: [0, 0.18, 0.85, 1] },
                                                }}
                                            />
                                        ))}
                                        {/* Moving leading dot */}
                                        <motion.circle
                                            r="4"
                                            fill="rgba(204,255,0,1)"
                                            filter="url(#table-glow)"
                                            initial={{ cx: ENTRANCE_TARGET.cx, cy: ENTRANCE_TARGET.cy, opacity: 0 }}
                                            animate={{
                                                cx: target.cx,
                                                cy: target.cy,
                                                opacity: [0, 1, 1, 0],
                                            }}
                                            transition={{
                                                duration: 2.6,
                                                cx: { duration: 2.4, ease: [0.4, 0, 0.2, 1] },
                                                cy: { duration: 2.4, ease: [0.4, 0, 0.2, 1] },
                                                opacity: { duration: 2.6, times: [0, 0.12, 0.85, 1] },
                                            }}
                                        />
                                    </g>
                                );
                            })()}
                        </AnimatePresence>
                    </g>
                </svg>

                {/* Hover detail card (HTML overlay).
                    Driven by `stickyHovered` so the card lingers ~400ms after
                    the cursor leaves the venue area before fading out. */}
                <AnimatePresence mode="wait">
                    {stickyHovered && hoveredPx && size.w > 0 && (() => {
                        const t = stickyHovered;
                        const inst = tables[t.id];
                        if (!inst) return null;
                        return (
                            <motion.div
                                key={`tip-${t.id}`}
                                data-no-drag="true"
                                style={{ left: hoveredPx.anchor.x, top: hoveredPx.anchor.y }}
                                className={`pointer-events-none absolute z-[5] ${
                                    hoveredPx.anchorIsTop ? '-translate-x-1/2 -translate-y-full' : '-translate-x-1/2'
                                }`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <motion.div
                                    initial={{ y: hoveredPx.anchorIsTop ? 6 : -6, scale: 0.96 }}
                                    animate={{ y: 0, scale: 1 }}
                                    exit={{ y: hoveredPx.anchorIsTop ? 4 : -4, scale: 0.98 }}
                                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <TableDetail table={t} instance={inst} nowMs={nowMs} />
                                </motion.div>
                            </motion.div>
                        );
                    })()}
                </AnimatePresence>
            </motion.div>

            {/* KPI rail — vertical stack on the left side */}
            <KPIRail kpis={KPIS} />

            {/* Sentient Recommendations — compact pill at top-right */}
            <SentientPanel rec={activeRec} index={recIdx} total={RECOMMENDATIONS.length} />

            {/* Activity ticker — bottom-right */}
            <ActivityTicker events={tickerEvents} />

            {/* Mini title block — bottom-left */}
            <TitleBlock />

            {/* Paper-grain texture */}
            <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.06]"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")',
                }}
            />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(204,255,0,0.025)_0%,transparent_55%)]" />
            {/* Corner ambient glows — subtle yuzu spotlights behind each panel
                area so the KPI rail / Sentient pill / activity ticker / title
                block don't feel washed out by the vignette. Pure presentation:
                pointer-events:none, sits under the panels. */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: [
                        'radial-gradient(420px circle at 8% 22%, rgba(204,255,0,0.038), transparent 70%)',
                        'radial-gradient(360px circle at 92% 12%, rgba(204,255,0,0.032), transparent 70%)',
                        'radial-gradient(360px circle at 92% 90%, rgba(204,255,0,0.030), transparent 70%)',
                        'radial-gradient(320px circle at 8% 92%, rgba(204,255,0,0.026), transparent 70%)',
                    ].join(', '),
                }}
            />
        </div>
    );
}

/* ─── TABLE CHAIRS ─────────────────────────────────────────────────────── */
/* Architectural blueprint chairs around each table's perimeter. Filled chairs
   = occupied seats; outlined chairs = available. Replaces the previous "dots
   inside the table" approach with a more cartographically correct view. */

interface ChairPos { x: number; y: number; rot: number; }

function chairPositions(table: Table): ChairPos[] {
    const out: ChairPos[] = [];
    if (table.type === 'round') {
        const radius = table.w / 2 + 7;
        for (let i = 0; i < table.capacity; i++) {
            const angle = (i / table.capacity) * Math.PI * 2 - Math.PI / 2;
            out.push({
                x: table.cx + Math.cos(angle) * radius,
                y: table.cy + Math.sin(angle) * radius,
                rot: (angle * 180) / Math.PI + 90,
            });
        }
        return out;
    }

    // Square / booth — distribute capacity across the four sides.
    const hw = table.w / 2, hh = table.h / 2;
    const off = 7;
    const cap = table.capacity;
    let top: number, bottom: number, left = 0, right = 0;
    if (table.type === 'booth') {
        // Booth: bench style, chairs only on long sides
        top = Math.ceil(cap / 2);
        bottom = Math.floor(cap / 2);
    } else if (cap === 2) { top = 1; bottom = 1; }
    else if (cap === 3) { top = 1; bottom = 1; right = 1; }
    else if (cap === 4) { top = 1; bottom = 1; left = 1; right = 1; }
    else if (cap === 5) { top = 2; bottom = 2; right = 1; }
    else if (cap === 6) { top = 2; bottom = 2; left = 1; right = 1; }
    else if (cap === 8) { top = 2; bottom = 2; left = 2; right = 2; }
    else { top = Math.ceil(cap / 4); bottom = Math.ceil(cap / 4); left = Math.floor((cap - top - bottom) / 2); right = cap - top - bottom - left; }

    for (let i = 0; i < top; i++) {
        const f = (i + 1) / (top + 1);
        out.push({ x: table.cx - hw + table.w * f, y: table.cy - hh - off, rot: 0 });
    }
    for (let i = 0; i < bottom; i++) {
        const f = (i + 1) / (bottom + 1);
        out.push({ x: table.cx - hw + table.w * f, y: table.cy + hh + off, rot: 180 });
    }
    for (let i = 0; i < left; i++) {
        const f = (i + 1) / (left + 1);
        out.push({ x: table.cx - hw - off, y: table.cy - hh + table.h * f, rot: 90 });
    }
    for (let i = 0; i < right; i++) {
        const f = (i + 1) / (right + 1);
        out.push({ x: table.cx + hw + off, y: table.cy - hh + table.h * f, rot: 270 });
    }
    return out;
}

function TableChairs({ table, partySize, state, hovered }: { table: Table; partySize: number; state: TableState; hovered: boolean }) {
    const positions = chairPositions(table);
    const isYuzu = state === 'ordered' || state === 'checking';

    return (
        <g>
            {positions.map((p, i) => {
                const occupied = i < partySize;
                let fill = 'transparent';
                let stroke = 'rgba(255,255,255,0.30)';
                if (occupied) {
                    if (isYuzu) {
                        fill = 'rgba(204,255,0,0.85)';
                        stroke = 'rgba(204,255,0,1)';
                    } else {
                        fill = 'rgba(255,255,255,0.55)';
                        stroke = 'rgba(255,255,255,0.85)';
                    }
                }
                if (hovered) stroke = 'rgba(204,255,0,0.85)';
                return (
                    <rect
                        key={i}
                        x={p.x - 2.6}
                        y={p.y - 1.8}
                        width={5.2}
                        height={3.6}
                        rx={0.8}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth="0.6"
                        transform={`rotate(${p.rot} ${p.x} ${p.y})`}
                        style={{ transition: 'fill 250ms, stroke 250ms' }}
                    />
                );
            })}
        </g>
    );
}

/* ─── DIMENSION LINES ──────────────────────────────────────────────────── */

function DimensionLines() {
    return (
        <g stroke="rgba(255,255,255,0.30)" strokeWidth="0.5" fill="rgba(255,255,255,0.45)" fontFamily="monospace" fontSize="8">
            {DIMENSIONS.map((d, i) => {
                if (d.axis === 'x') {
                    return (
                        <g key={i}>
                            <line x1={d.from} y1={d.pos} x2={d.to} y2={d.pos} />
                            <line x1={d.from} y1={d.pos - 4} x2={d.from} y2={d.pos + 4} />
                            <line x1={d.to} y1={d.pos - 4} x2={d.to} y2={d.pos + 4} />
                            <rect x={(d.from + d.to) / 2 - 22} y={d.pos - 5} width="44" height="10" fill="#050505" />
                            <text x={(d.from + d.to) / 2} y={d.pos + 3} textAnchor="middle" letterSpacing="1">{d.label}</text>
                        </g>
                    );
                }
                return (
                    <g key={i}>
                        <line x1={d.pos} y1={d.from} x2={d.pos} y2={d.to} />
                        <line x1={d.pos - 4} y1={d.from} x2={d.pos + 4} y2={d.from} />
                        <line x1={d.pos - 4} y1={d.to} x2={d.pos + 4} y2={d.to} />
                        <rect x={d.pos - 16} y={(d.from + d.to) / 2 - 5} width="32" height="10" fill="#050505" />
                        <text x={d.pos} y={(d.from + d.to) / 2 + 3} textAnchor="middle" letterSpacing="1">{d.label}</text>
                    </g>
                );
            })}
        </g>
    );
}

/* ─── HOVER DETAIL CARD ────────────────────────────────────────────────── */

function TableDetail({ table, instance, nowMs }: { table: Table; instance: TableInstance; nowMs: number }) {
    const isYuzu = instance.state === 'ordered' || instance.state === 'checking';
    const dwell = instance.seatedAt
        ? Math.max(1, Math.floor((nowMs - instance.seatedAt) / 60000))
        : null;

    return (
        <div className="bg-[#0A0A0A]/95 backdrop-blur-md border border-white/15 rounded-md px-3.5 py-2.5 shadow-[0_8px_28px_rgba(0,0,0,0.7),0_0_18px_rgba(204,255,0,0.05)] min-w-[240px]">
            {/* Header */}
            <div className="flex items-baseline justify-between gap-3 pb-2 border-b border-white/8">
                <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-[9px] text-yuzu/65 uppercase tracking-[0.18em]">T</span>
                    <span className="font-serif italic text-[15px] text-white/95 leading-tight">
                        Table {String(table.id).padStart(2, '0')}
                    </span>
                </div>
                <span className="font-mono italic text-[10px] text-silver/50 whitespace-nowrap uppercase tracking-wider">
                    {table.type === 'round' ? `Round · ${table.capacity}-top`
                        : table.type === 'booth' ? `Booth · ${table.capacity}-top`
                            : `Square · ${table.capacity}-top`}
                </span>
            </div>

            {/* Status row */}
            <div className="flex items-center gap-2 pt-2 mb-2">
                <span className="block w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                        background: isYuzu ? 'rgb(204,255,0)' : 'rgba(255,255,255,0.55)',
                        boxShadow: isYuzu ? '0 0 5px rgba(204,255,0,0.7)' : 'none',
                    }}
                />
                <span className="font-sans text-[11.5px] font-medium leading-tight"
                    style={{ color: isYuzu ? 'rgba(204,255,0,0.95)' : 'rgba(255,255,255,0.92)' }}
                >
                    {STATE_LABEL[instance.state]}
                </span>
            </div>

            {/* Detail rows */}
            {instance.state !== 'vacant' && (
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1">
                    <DetailRow label="Party" value={`${instance.partySize} of ${table.capacity}`} />
                    <DetailRow label="Server" value={instance.server} />
                    {dwell !== null && (
                        <DetailRow label="Dwell" value={`${dwell}m`} accent={dwell > 90 ? 'warn' : 'normal'} />
                    )}
                    <DetailRow label="Course" value={instance.course} accent={instance.state === 'ordered' ? 'yuzu' : 'normal'} />
                </div>
            )}
            {instance.state === 'vacant' && (
                <div className="text-[10px] text-silver/55 leading-relaxed">
                    Ready for assignment. TapIn will route the next compatible party.
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/6">
                <span className="flex items-center gap-1.5">
                    <span className="relative flex w-1.5 h-1.5">
                        <span className="absolute inset-0 rounded-full bg-yuzu animate-ping opacity-75" />
                        <span className="relative w-1.5 h-1.5 rounded-full bg-yuzu" />
                    </span>
                    <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-yuzu/75">Live</span>
                </span>
                <span className="font-mono text-[8.5px] text-silver/40">Synced now</span>
            </div>
        </div>
    );
}

function DetailRow({ label, value, accent }: { label: string; value: string; accent?: 'normal' | 'yuzu' | 'warn' }) {
    const valueColor =
        accent === 'yuzu' ? 'text-yuzu/95'
            : accent === 'warn' ? 'text-amber-300/90'
            : 'text-white/85';
    return (
        <div className="flex items-baseline justify-between gap-2 min-w-0">
            <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-silver/45 shrink-0">{label}</span>
            <span className={`font-sans text-[10.5px] truncate ${valueColor}`}>{value}</span>
        </div>
    );
}

/* ─── KPI CARD with sparkline ──────────────────────────────────────────── */

/* KPIRail — compact vertical stack on the left side of the hero. */
function KPIRail({ kpis }: { kpis: KPI[] }) {
    return (
        <motion.div
            data-no-drag="true"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-6 top-24 z-[6] flex flex-col gap-2 w-[200px]"
        >
            {kpis.map((k) => <KPIRailCard key={k.id} kpi={k} />)}
        </motion.div>
    );
}

/* Compact card. Click cycles through the KPI's views. */
function KPIRailCard({ kpi }: { kpi: KPI }) {
    const [viewIdx, setViewIdx] = useState(0);
    const view = kpi.views[viewIdx];
    const total = kpi.views.length;

    function cycle(e: React.MouseEvent) {
        e.stopPropagation();
        setViewIdx((i) => (i + 1) % total);
    }

    return (
        <button
            type="button"
            onClick={cycle}
            onPointerDown={(e) => e.stopPropagation()}
            className="group bg-[#0A0A0A]/90 backdrop-blur-md border border-white/12 hover:border-yuzu/45 rounded-md px-3 py-2 shadow-[0_4px_18px_rgba(0,0,0,0.55)] text-left cursor-pointer transition-colors duration-300"
            aria-label={`${kpi.label} — click to cycle views`}
        >
            <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-silver/55 leading-tight">
                    {kpi.label}
                </span>
                <span className="flex items-center gap-1">
                    {Array.from({ length: total }).map((_, i) => (
                        <span
                            key={i}
                            className={`block w-[3px] h-[3px] rounded-full transition-colors ${i === viewIdx ? 'bg-yuzu' : 'bg-white/15'}`}
                        />
                    ))}
                </span>
            </div>
            <AnimatePresence mode="wait">
                <motion.div
                    key={`v-${kpi.id}-${viewIdx}`}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="font-serif italic text-[18px] leading-none text-white/95 truncate">
                        {view.value}
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                        <span className="font-mono text-[8.5px] text-silver/50 truncate">
                            {view.subValue}
                        </span>
                        <span className={`font-mono text-[8.5px] font-semibold shrink-0 ${view.deltaPositive ? 'text-yuzu/90' : 'text-rose-400/90'}`}>
                            {view.delta}
                        </span>
                    </div>
                    <div className="h-[14px] mt-1.5">
                        <Sparkline data={view.spark} />
                    </div>
                </motion.div>
            </AnimatePresence>
        </button>
    );
}

function Sparkline({ data }: { data: number[] }) {
    const max = Math.max(...data, 100);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const w = 100, h = 26;
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((d - min) / range) * h;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    const lastX = w;
    const lastY = h - ((data[data.length - 1] - min) / range) * h;
    return (
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
            {/* Subtle baseline */}
            <line x1="0" y1={h - 1} x2={w} y2={h - 1} stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
            {/* Filled area */}
            <polyline
                points={`0,${h} ${points} ${w},${h}`}
                fill="rgba(204,255,0,0.10)"
            />
            {/* Line */}
            <polyline
                points={points}
                fill="none"
                stroke="rgba(204,255,0,0.85)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Last point */}
            <circle cx={lastX} cy={lastY} r="1.6" fill="rgb(204,255,0)" />
        </svg>
    );
}

/* ─── SENTIENT RECOMMENDATIONS PANEL ───────────────────────────────────── */

function SentientPanel({ rec, index, total }: { rec: Recommendation; index: number; total: number }) {
    const isHigh = rec.priority === 'high';
    return (
        <div
            data-no-drag="true"
            className="absolute top-6 right-6 z-[6] pointer-events-none w-[300px] max-w-[calc(100vw-3rem)]"
        >
            <div className="bg-[#0A0A0A]/92 backdrop-blur-md border border-yuzu/25 rounded-md px-3 py-2 shadow-[0_4px_18px_rgba(0,0,0,0.55),0_0_14px_rgba(204,255,0,0.05)]">
                {/* Header — minimal */}
                <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1.5">
                        <span className="relative flex w-1.5 h-1.5">
                            <span className="absolute inset-0 rounded-full bg-yuzu animate-ping opacity-75" />
                            <span className="relative w-1.5 h-1.5 rounded-full bg-yuzu" />
                        </span>
                        <span className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-yuzu/85">
                            Sentient
                        </span>
                    </span>
                    <span className="flex items-center gap-1">
                        {Array.from({ length: total }).map((_, i) => (
                            <span
                                key={i}
                                className={`block w-[3px] h-[3px] rounded-full ${i === index ? 'bg-yuzu' : 'bg-white/15'}`}
                            />
                        ))}
                    </span>
                </div>
                {/* Recommendation row */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`rec-${index}`}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-2.5"
                    >
                        <span className={`shrink-0 inline-flex items-center justify-center w-7 h-7 rounded font-mono text-[9px] tracking-[0.05em] font-bold ${
                            isHigh
                                ? 'bg-yuzu/20 text-yuzu border border-yuzu/60'
                                : 'bg-white/[0.06] text-white/85 border border-white/15'
                        }`}>
                            T{String(rec.targetTableId).padStart(2, '0')}
                        </span>
                        <div className="flex-1 min-w-0">
                            <div className="font-sans text-[10.5px] text-white/95 leading-tight truncate">
                                {rec.text}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`font-mono text-[8px] uppercase tracking-[0.18em] ${isHigh ? 'text-yuzu/90' : 'text-silver/55'}`}>
                                    {isHigh ? 'High' : 'Sugg.'}
                                </span>
                                {rec.eta && (
                                    <>
                                        <span className="text-silver/25 text-[8px]">·</span>
                                        <span className="font-mono text-[8px] text-silver/55 uppercase tracking-[0.18em]">
                                            {rec.eta}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

/* ─── ACTIVITY TICKER ──────────────────────────────────────────────────── */

function ActivityTicker({ events }: { events: TickerEvent[] }) {
    return (
        <div data-no-drag="true" className="absolute bottom-6 right-6 z-[6] pointer-events-none">
            <div className="bg-[#0A0A0A]/88 backdrop-blur-md border border-white/12 rounded-md px-3 py-2 shadow-[0_4px_18px_rgba(0,0,0,0.5)] min-w-[280px] max-w-[320px]">
                <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/8">
                    <span className="font-mono text-[8.5px] uppercase tracking-[0.25em] text-silver/55">
                        Activity
                    </span>
                    <span className="font-mono text-[8px] text-silver/35 uppercase tracking-[0.2em]">
                        Stream
                    </span>
                </div>
                {/* Plain rendering of the last 2 events. AnimatePresence was removed
                    because its exit animations (300ms) overlapped with new events
                    being pushed, leaving phantom rows / gaps. The content itself
                    updating is enough "live" signal — no animation needed. */}
                <ul className="flex flex-col gap-1">
                    {events.slice(-2).map((e) => (
                        <li key={e.id} className="flex items-baseline gap-2 transition-opacity duration-300">
                            <span className="font-mono text-[9px] text-silver/40 shrink-0 w-9">{e.time}</span>
                            <span className="font-sans text-[10.5px] text-white/80 leading-tight truncate">{e.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

/* ─── TITLE BLOCK ──────────────────────────────────────────────────────── */

function TitleBlock() {
    return (
        <div data-no-drag="true" className="absolute bottom-6 left-6 z-[6] pointer-events-none">
            <div className="bg-[#0A0A0A]/85 backdrop-blur-md border border-white/12 rounded-md px-3 py-2 shadow-[0_4px_18px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-2">
                    {/* Mini compass */}
                    <svg viewBox="0 0 16 16" width="12" height="12" className="text-silver/55 shrink-0">
                        <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="0.7" />
                        <path d="M 8 3 L 9 7.5 L 8 6.5 L 7 7.5 Z" fill="rgb(204,255,0)" />
                    </svg>
                    <span className="font-serif italic text-[13px] text-white/95 leading-tight whitespace-nowrap">
                        Osteria Lumina
                    </span>
                    <span className="w-px h-3 bg-white/15" />
                    <span className="font-mono text-[8.5px] text-yuzu/70 uppercase tracking-[0.22em] whitespace-nowrap">
                        A-101 · 1:120
                    </span>
                    <span className="w-px h-3 bg-white/15" />
                    <span className="flex items-center gap-1.5">
                        <span className="relative flex w-1 h-1">
                            <span className="absolute inset-0 rounded-full bg-yuzu animate-ping opacity-75" />
                            <span className="relative w-1 h-1 rounded-full bg-yuzu" />
                        </span>
                        <span className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-yuzu/70 whitespace-nowrap">
                            Live
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}

/* DragHint removed — the pan interaction is discovered naturally; keeping the
 * screen visually clean was the higher priority. */
