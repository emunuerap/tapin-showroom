import { lazy, Suspense, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import type { ProductDefinition, ProductId } from '../content/products';
import { useIsMobileViewport } from '../hooks/useIsMobileViewport';
import { KineticWords } from './KineticText';
import { SplitChars } from '../../components/ui/SplitChars';

interface ProductUniverseHeroProps {
  products: ProductDefinition[];
}

const IPhone3D = lazy(() =>
  import('./IPhone3D').then((module) => ({ default: module.IPhone3D })),
);

type ManifestPosition = {
  x: number;
  y: number;
  width: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
};

const CORE = { x: 46, y: 48 };
const HERO_OBJECT = { x: 67, y: 51 };

const SUPPORT_POSITIONS: Record<ProductId, ManifestPosition> = {
  'web-sdk': { x: 20, y: 24, width: 255, rotateX: 8, rotateY: -18, rotateZ: -5 },
  'consumer-app': { x: 58, y: 18, width: 150, rotateX: 6, rotateY: 12, rotateZ: 4 },
  'hospitality-os': { x: 82, y: 35, width: 278, rotateX: 8, rotateY: 18, rotateZ: 4 },
  messaging: { x: 72, y: 75, width: 246, rotateX: -4, rotateY: 14, rotateZ: -3 },
  'ai-core': { x: 30, y: 74, width: 216, rotateX: -8, rotateY: -10, rotateZ: 6 },
  integrations: { x: 15, y: 51, width: 252, rotateX: 5, rotateY: -16, rotateZ: 2 },
};

const PRODUCT_LABELS: Record<ProductId, string> = {
  'web-sdk': 'Web SDK',
  'consumer-app': 'App',
  'hospitality-os': 'OS',
  messaging: 'Messages',
  'ai-core': 'AI Core',
  integrations: 'Fabric',
};

export function ProductUniverseHero({ products }: ProductUniverseHeroProps) {
  const [activeId, setActiveId] = useState<ProductId>('consumer-app');
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobileViewport();
  const activeProduct = useMemo(
    () => products.find((product) => product.id === activeId) ?? products[0],
    [activeId, products],
  );

  const activateProduct = (product: ProductDefinition) => setActiveId(product.id);

  return (
    <section className="relative isolate w-full max-w-[100vw] overflow-hidden px-4 pb-16 pt-28 md:px-8 md:pb-24 md:pt-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[4%] top-[20%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(204,255,0,0.075),transparent_64%)] blur-3xl" />
        <div className="absolute right-[-10%] top-[4%] h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(circle,rgba(255,160,70,0.055),transparent_66%)] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#050505] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1480px] gap-10 lg:grid-cols-[0.74fr_1.26fr] lg:items-center lg:gap-10 xl:gap-16">
        <HeroEditorial
          products={products}
          activeProduct={activeProduct}
          onActivate={activateProduct}
        />
        <LivingProductStage
          products={products}
          activeProduct={activeProduct}
          onActivate={activateProduct}
          reducedMotion={Boolean(reducedMotion)}
          isMobile={isMobile}
        />
      </div>
    </section>
  );
}

function HeroEditorial({
  products,
  activeProduct,
  onActivate,
}: {
  products: ProductDefinition[];
  activeProduct: ProductDefinition;
  onActivate: (product: ProductDefinition) => void;
}) {
  return (
    <div className="relative z-20 min-w-0">
      <h1 className="products-page-kinetic max-w-[48rem] text-[clamp(3.2rem,7.6vw,8rem)] font-black leading-[0.82] tracking-tight text-silver">
        <KineticWords text="The TapIn" />
        <span className="block font-serif font-normal italic text-yuzu drop-shadow-[0_0_46px_rgba(204,255,0,0.28)]">
          <SplitChars
            text="Product Universe."
            trigger="mount"
            delay={0.42}
            stagger={0.022}
            rotateJitter={12}
            duration={0.95}
          />
        </span>
      </h1>

      <p className="products-soft-reveal mt-8 max-w-[34rem] font-serif text-[15px] italic leading-[1.55] text-silver/74 md:text-[17px]">
        One connected hospitality protocol: website, app, room, messages, AI and
        payments moving like a single living surface.
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeProduct.id}
          initial={{ opacity: 0, y: 12, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="products-soft-reveal mt-8 hidden max-w-[35rem] md:block"
        >
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-yuzu shadow-[0_0_16px_rgba(204,255,0,0.76)]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-yuzu/76">
              {activeProduct.eyebrow}
            </span>
          </div>
          <h2 className="mt-4 text-[clamp(1.45rem,2.6vw,2.5rem)] font-black leading-[0.98] tracking-tight text-silver">
            {activeProduct.headline}
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-silver/58 md:text-[15px]">
            {activeProduct.shortDescription}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="products-soft-reveal mt-8 hidden flex-wrap gap-2 md:flex">
        {products.map((product) => {
          const active = product.id === activeProduct.id;
          return (
            <button
              key={product.id}
              type="button"
              aria-label={`Activate ${product.name}`}
              onClick={() => onActivate(product)}
              onMouseEnter={() => onActivate(product)}
              className={`rounded-full border px-3.5 py-2 font-mono text-[9px] uppercase tracking-[0.2em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yuzu/60 ${
                active
                  ? 'border-yuzu/42 bg-yuzu/12 text-yuzu shadow-[0_0_22px_rgba(204,255,0,0.12)]'
                  : 'border-white/9 bg-white/[0.018] text-silver/48 hover:border-yuzu/24 hover:text-silver'
              }`}
            >
              {PRODUCT_LABELS[product.id]}
            </button>
          );
        })}
      </div>

      <div className="products-soft-reveal mt-10 flex flex-col gap-3 sm:flex-row">
        <a
          href="mailto:hello@tapin.app?subject=TapIn%20Products%20Demo"
          className="inline-flex items-center justify-center rounded-full bg-yuzu px-7 py-3.5 font-mono text-[10px] font-black uppercase tracking-[0.24em] text-obsidian shadow-[0_0_34px_rgba(204,255,0,0.24)] transition-transform duration-300 hover:scale-[1.03]"
        >
          Request demo
        </a>
        <a
          href="#product-rail"
          className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.025] px-7 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-silver/70 transition-colors duration-300 hover:border-yuzu/30 hover:text-silver"
        >
          Explore surfaces
        </a>
      </div>
    </div>
  );
}

function LivingProductStage({
  products,
  activeProduct,
  onActivate,
  reducedMotion,
  isMobile,
}: {
  products: ProductDefinition[];
  activeProduct: ProductDefinition;
  onActivate: (product: ProductDefinition) => void;
  reducedMotion: boolean;
  isMobile: boolean;
}) {
  if (isMobile) {
    return (
      <div className="products-soft-reveal relative">
        <MobileLivingStage products={products} activeProduct={activeProduct} onActivate={onActivate} />
      </div>
    );
  }

  return (
    <div className="products-soft-reveal relative">
      <div>
        <div className="relative h-[min(76vh,760px)] min-h-[650px] overflow-visible rounded-[3rem] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(255,255,255,0.045),rgba(255,255,255,0.012)_45%,rgba(0,0,0,0.12))] shadow-[0_50px_140px_rgba(0,0,0,0.52),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-2xl [perspective:1500px]">
          <div className="pointer-events-none absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_54%_42%,rgba(204,255,0,0.08),transparent_40%),radial-gradient(circle_at_82%_16%,rgba(255,160,70,0.055),transparent_34%)]" />
          <div className="pointer-events-none absolute inset-0 rounded-[3rem] opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:58px_58px]" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-yuzu/50 to-transparent" />

          <ProductConnectionField products={products} activeId={activeProduct.id} />
          <TapInCoreObject activeProduct={activeProduct} reducedMotion={reducedMotion} />

          {products.map((product) => (
            <ProductManifestation
              key={product.id}
              product={product}
              active={product.id === activeProduct.id}
              onActivate={onActivate}
              reducedMotion={reducedMotion}
            />
          ))}

          <SystemReadout activeProduct={activeProduct} />
        </div>
      </div>

    </div>
  );
}

function ProductConnectionField({
  products,
  activeId,
}: {
  products: ProductDefinition[];
  activeId: ProductId;
}) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id="stage-core-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(204,255,0,0.34)" />
          <stop offset="100%" stopColor="rgba(204,255,0,0)" />
        </radialGradient>
      </defs>
      <circle cx={CORE.x} cy={CORE.y} r="32" fill="url(#stage-core-halo)" opacity="0.22" />
      {products.map((product) => {
        const active = product.id === activeId;
        const position = active ? HERO_OBJECT : SUPPORT_POSITIONS[product.id];
        return (
          <motion.path
            key={product.id}
            d={`M ${CORE.x} ${CORE.y} C ${(CORE.x + position.x) / 2} ${CORE.y - 10}, ${(CORE.x + position.x) / 2} ${position.y + 10}, ${position.x} ${position.y}`}
            fill="none"
            stroke={active ? 'rgba(204,255,0,0.74)' : 'rgba(255,255,255,0.105)'}
            strokeWidth={active ? 0.36 : 0.18}
            strokeDasharray={active ? '1.15 1.25' : '0'}
            initial={false}
            animate={{ opacity: active ? 1 : 0.46 }}
            transition={{ duration: 0.34 }}
          />
        );
      })}
    </svg>
  );
}

function TapInCoreObject({
  activeProduct,
  reducedMotion,
}: {
  activeProduct: ProductDefinition;
  reducedMotion: boolean;
}) {
  return (
    <div
      className="absolute z-20 grid h-52 w-52 -translate-x-1/2 -translate-y-1/2 place-items-center"
      style={{ left: `${CORE.x}%`, top: `${CORE.y}%` }}
    >
      <motion.div
        className="absolute inset-0 rounded-full border border-yuzu/22 bg-[radial-gradient(circle,rgba(204,255,0,0.09),transparent_62%)]"
        animate={reducedMotion ? undefined : { scale: [1, 1.045, 1], opacity: [0.68, 1, 0.68] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-5 rounded-full border border-white/12 [background:conic-gradient(from_140deg,transparent,rgba(204,255,0,0.22),transparent,rgba(255,255,255,0.15),transparent)]"
        animate={reducedMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
      />
      <div className="relative grid h-36 w-36 place-items-center rounded-full border border-white/12 bg-[#040504]/90 text-center shadow-[0_0_80px_rgba(204,255,0,0.13),inset_0_1px_0_rgba(255,255,255,0.09)] backdrop-blur-xl">
        <div className="absolute inset-4 rounded-full border border-yuzu/12" />
        <div className="relative">
          <div className="font-serif text-[1.7rem] italic leading-none text-silver">
            TapIn<span className="text-yuzu">·</span>
          </div>
          <div className="mt-2 font-mono text-[7px] uppercase tracking-[0.34em] text-yuzu/64">Living core</div>
          <div className="mx-auto mt-3 h-px w-14 bg-yuzu/36" />
          <div className="mt-2 max-w-[6.5rem] font-mono text-[6.5px] uppercase tracking-[0.18em] text-silver/36">
            {activeProduct.name}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductManifestation({
  product,
  active,
  onActivate,
  reducedMotion,
}: {
  product: ProductDefinition;
  active: boolean;
  onActivate: (product: ProductDefinition) => void;
  reducedMotion: boolean;
}) {
  const support = SUPPORT_POSITIONS[product.id];
  const width = active ? Math.max(support.width * 1.22, 330) : support.width;

  return (
    <motion.div
      className="absolute z-10 block rounded-[1.6rem] text-left outline-none [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-yuzu/60"
      style={{ width, transformOrigin: '50% 50%', zIndex: active ? 36 : 14 }}
      initial={false}
      animate={{
        left: `${active ? HERO_OBJECT.x : support.x}%`,
        top: `${active ? HERO_OBJECT.y : support.y}%`,
        x: '-50%',
        y: '-50%',
        rotateX: active ? 0 : support.rotateX,
        rotateY: active ? 0 : support.rotateY,
        rotateZ: active ? 0 : support.rotateZ,
        scale: active ? 1.06 : 0.92,
        opacity: active ? 1 : 0.56,
        filter: active ? 'blur(0px)' : 'blur(0.15px)',
      }}
      whileHover={{ opacity: 1, scale: active ? 1.075 : 0.98 }}
      transition={{ duration: 0.64, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => onActivate(product)}
      onClick={() => onActivate(product)}
    >
      <motion.div
        className="relative [transform-style:preserve-3d]"
        animate={reducedMotion || active ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 6.2 + product.index * 0.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ManifestationShell product={product} active={active} />
      </motion.div>
    </motion.div>
  );
}

function ManifestationShell({ product, active }: { product: ProductDefinition; active: boolean }) {
  const label = PRODUCT_LABELS[product.id];
  const phoneHero = active && product.id === 'consumer-app';

  return (
    <div className="relative">
      <div
        className={`pointer-events-none absolute -inset-5 rounded-[2.2rem] blur-2xl transition-opacity duration-500 ${
          active ? 'bg-yuzu/[0.13] opacity-100' : 'bg-yuzu/[0.035] opacity-45'
        }`}
      />
      <div
        className={`relative rounded-[1.45rem] ${
          phoneHero
            ? 'overflow-visible border-0 bg-transparent shadow-none'
            : 'overflow-hidden border border-white/12 bg-[#070807]/76 shadow-[0_26px_80px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl'
        }`}
      >
        <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-yuzu/48 to-transparent" />
        <ProductObject product={product} active={active} immersive={phoneHero} />
        <div
          className={`absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/9 bg-black/35 px-2.5 py-1.5 backdrop-blur-xl transition-opacity duration-300 ${
            phoneHero ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-yuzu shadow-[0_0_12px_rgba(204,255,0,0.72)]' : 'bg-silver/30'}`} />
          <span className="font-mono text-[6.5px] uppercase tracking-[0.22em] text-silver/56">{label}</span>
        </div>
      </div>
    </div>
  );
}

function ProductObject({
  product,
  active,
  immersive = false,
}: {
  product: ProductDefinition;
  active: boolean;
  immersive?: boolean;
}) {
  switch (product.id) {
    case 'web-sdk':
      return <WebSdkObject active={active} />;
    case 'consumer-app':
      return <ConsumerAppObject active={active} immersive={immersive} />;
    case 'hospitality-os':
      return <HospitalityOsObject active={active} />;
    case 'messaging':
      return <MessagingObject active={active} />;
    case 'ai-core':
      return <AiCoreObject active={active} />;
    case 'integrations':
      return <IntegrationsObject active={active} />;
    default:
      return null;
  }
}

function WebSdkObject({ active }: { active: boolean }) {
  return (
    <div className="relative h-[13.5rem] overflow-hidden bg-black">
      <img
        src="/products/websdk-restaurant-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-56"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/35 to-black/18" />
      <div className="relative z-10 p-5 pt-12">
        <div className="font-serif text-[1.8rem] italic leading-[0.9] text-silver">
          Tonight,
          <br />
          quietly arranged.
        </div>
        <div className="mt-5 h-px w-16 bg-yuzu/50" />
      </div>
      <motion.div
        className="absolute bottom-4 right-4 w-[52%] rounded-[1.2rem] border border-yuzu/28 bg-[#060706]/88 p-3 shadow-[0_0_42px_rgba(204,255,0,0.12)] backdrop-blur-xl"
        animate={active ? { y: [6, 0], opacity: [0.86, 1] } : undefined}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-2 flex justify-between font-mono text-[6px] uppercase tracking-[0.22em] text-silver/42">
          <span>Booking layer</span>
          <span className="text-yuzu">12 sec</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {['19:30', '20:00', '20:30'].map((slot) => (
            <span
              key={slot}
              className={`rounded-lg border px-1 py-2 text-center font-mono text-[7px] ${
                slot === '20:00' ? 'border-yuzu/50 bg-yuzu/12 text-yuzu' : 'border-white/8 text-silver/35'
              }`}
            >
              {slot}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function ConsumerAppObject({ active, immersive = false }: { active: boolean; immersive?: boolean }) {
  if (active && immersive) {
    return (
      <div className="relative h-[23rem] overflow-visible">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[19rem] w-[14rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(204,255,0,0.12),transparent_62%)] blur-3xl" />
        <Suspense fallback={<ConsumerPhoneFallback />}>
          <IPhone3D active />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="relative grid h-[20rem] place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_34%,rgba(204,255,0,0.16),transparent_50%),#030403]">
      <motion.div
        className="relative h-[17.2rem] w-[8.35rem] rounded-[2rem] border border-white/22 bg-[#050605] p-2.5 shadow-[0_28px_80px_rgba(0,0,0,0.62),inset_0_1px_0_rgba(255,255,255,0.18)]"
        animate={active ? { rotateY: [-5, 0], rotateZ: [-2, 0] } : undefined}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute left-1/2 top-2.5 h-3.5 w-14 -translate-x-1/2 rounded-full bg-black shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />
        <div className="h-full overflow-hidden rounded-[1.45rem] bg-[#050505] px-3 pb-3 pt-8">
          <div className="font-serif text-lg italic leading-none text-silver">
            TapIn<span className="text-yuzu">·</span>
          </div>
          <div className="mt-2 font-mono text-[6px] uppercase tracking-[0.26em] text-yuzu/72">
            Tonight
          </div>
          <div className="mt-3 rounded-xl border border-yuzu/30 bg-yuzu/[0.07] p-2.5">
            <div className="font-mono text-[5.5px] uppercase tracking-[0.22em] text-yuzu/78">Reservation</div>
            <div className="font-serif text-[1.35rem] italic leading-none text-silver">8:30pm</div>
            <div className="mt-1 text-[7px] text-silver/50">Osteria Lumina</div>
          </div>
          <div className="mt-3 space-y-1.5">
            {[88, 72, 64, 58].map((value) => (
              <div key={value} className="h-1 rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-yuzu"
                  initial={false}
                  animate={{ width: `${active ? value : value * 0.72}%` }}
                  transition={{ duration: 0.7 }}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 border-l border-yuzu/40 pl-2">
            <div className="font-mono text-[5.5px] uppercase tracking-[0.22em] text-yuzu/68">Visit 03</div>
            <div className="font-serif text-[0.75rem] italic text-silver/82">Tomato carpaccio</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ConsumerPhoneFallback() {
  return (
    <div className="grid h-full place-items-center">
      <div className="relative h-[19rem] w-[9.4rem] rounded-[2.2rem] border border-white/22 bg-[#050605] p-2.5 shadow-[0_28px_80px_rgba(0,0,0,0.62),inset_0_1px_0_rgba(255,255,255,0.18)]">
        <div className="absolute left-1/2 top-3 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
        <div className="h-full rounded-[1.65rem] bg-[radial-gradient(circle_at_50%_22%,rgba(204,255,0,0.13),transparent_38%),#050505]" />
      </div>
    </div>
  );
}

function HospitalityOsObject({ active }: { active: boolean }) {
  const tables = [
    { left: '16%', top: '28%', hot: true },
    { left: '44%', top: '20%', hot: false },
    { left: '70%', top: '32%', hot: true },
    { left: '28%', top: '60%', hot: false },
    { left: '60%', top: '66%', hot: true },
  ];

  return (
    <div className="relative h-[14rem] overflow-hidden bg-[#050605] p-4">
      <div className="grid h-full grid-cols-[1fr_0.82fr] gap-3">
        <div className="relative rounded-[1.1rem] border border-white/10 bg-white/[0.025]">
          <div className="absolute inset-4 rounded-xl border border-yuzu/13" />
          {tables.map(({ left, top, hot }, index) => (
            <motion.span
              key={`${left}-${top}`}
              className={`absolute h-7 w-7 rounded-full border ${
                hot ? 'border-yuzu/58 bg-yuzu/14 shadow-[0_0_20px_rgba(204,255,0,0.18)]' : 'border-white/13 bg-black/48'
              }`}
              style={{ left, top }}
              animate={active && hot ? { scale: [1, 1.12, 1] } : undefined}
              transition={{ duration: 2.1, repeat: Infinity, delay: index * 0.2 }}
            />
          ))}
          <div className="absolute bottom-3 left-3 rounded-full border border-yuzu/28 bg-yuzu/[0.06] px-3 py-1 font-mono text-[6px] uppercase tracking-[0.22em] text-yuzu/72">
            Floor live
          </div>
        </div>
        <div className="grid gap-2">
          {['VIP context', 'Yield +18%', 'No-show -4'].map((label) => (
            <div key={label} className="rounded-xl border border-white/8 bg-white/[0.028] px-3 py-2">
              <div className="h-px w-10 bg-yuzu/48" />
              <div className="mt-2 font-mono text-[7px] uppercase tracking-[0.18em] text-silver/58">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessagingObject({ active }: { active: boolean }) {
  return (
    <div className="relative h-[13rem] overflow-hidden bg-[#050605] p-4">
      <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yuzu/12 bg-yuzu/[0.035] blur-[1px]" />
      <div className="relative space-y-3 pt-5">
        <ConversationRibbon align="left" label="Guest" text="Two of us, around 9, somewhere quiet." />
        <ConversationRibbon align="right" label="TapIn parses" text="Party 2 · quiet table · 21:00" active={active} />
        <ConversationRibbon align="right" label="Confirm" text="Casa Marisol · link ready" active={active} />
      </div>
    </div>
  );
}

function ConversationRibbon({
  align,
  label,
  text,
  active = false,
}: {
  align: 'left' | 'right';
  label: string;
  text: string;
  active?: boolean;
}) {
  return (
    <div className={`flex ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[82%] rounded-full border px-4 py-2.5 ${
          active ? 'border-yuzu/35 bg-yuzu/[0.07]' : 'border-white/9 bg-white/[0.025]'
        }`}
      >
        <div className="font-mono text-[6px] uppercase tracking-[0.22em] text-yuzu/64">{label}</div>
        <div className="mt-1 text-[11px] leading-snug text-silver/76">{text}</div>
      </div>
    </div>
  );
}

function AiCoreObject({ active }: { active: boolean }) {
  const nodes = [
    ['Taste', 48, 25],
    ['Tetris', 72, 45],
    ['Sentiment', 53, 72],
    ['Gratitude', 24, 50],
  ];

  return (
    <div className="relative h-[13.5rem] overflow-hidden bg-[#030403]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 280 210" aria-hidden="true">
        <circle cx="140" cy="104" r="42" fill="rgba(204,255,0,0.045)" stroke="rgba(204,255,0,0.24)" />
        <circle cx="140" cy="104" r="76" fill="none" stroke="rgba(255,255,255,0.08)" />
        <path d="M140 104 L82 52 M140 104 L208 94 M140 104 L148 158 M140 104 L68 116" stroke="rgba(204,255,0,0.28)" strokeWidth="1" />
        <motion.circle
          cx="140"
          cy="104"
          r="6"
          fill="#ccff00"
          animate={active ? { r: [5, 8, 5], opacity: [0.8, 1, 0.8] } : undefined}
          transition={{ duration: 2.2, repeat: Infinity }}
        />
      </svg>
      {nodes.map(([label, left, top]) => (
        <div
          key={String(label)}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[#080908]/88 px-3 py-2 font-mono text-[7px] uppercase tracking-[0.2em] text-silver/62"
          style={{ left: `${left}%`, top: `${top}%` }}
        >
          {label}
        </div>
      ))}
      <div className="absolute bottom-4 left-4 right-4 rounded-full border border-yuzu/20 bg-yuzu/[0.045] px-4 py-2 font-mono text-[7px] uppercase tracking-[0.24em] text-yuzu/72">
        Optimization intelligence · live
      </div>
    </div>
  );
}

function IntegrationsObject({ active }: { active: boolean }) {
  const items = ['POS', 'Stripe', 'NFC', 'Maps', 'Social', 'WA'];

  return (
    <div className="relative h-[13.5rem] overflow-hidden bg-[#040504]">
      <svg className="absolute inset-0 h-full w-full opacity-80" viewBox="0 0 280 210" aria-hidden="true">
        <circle cx="140" cy="104" r="34" fill="rgba(204,255,0,0.05)" stroke="rgba(204,255,0,0.25)" />
        {items.map((_, index) => {
          const angle = (-90 + index * 60) * (Math.PI / 180);
          const x = 140 + Math.cos(angle) * 78;
          const y = 104 + Math.sin(angle) * 68;
          return <path key={index} d={`M140 104 L${x} ${y}`} stroke="rgba(204,255,0,0.18)" strokeWidth="1" />;
        })}
        <motion.circle
          cx="140"
          cy="104"
          r="5"
          fill="#ccff00"
          animate={active ? { opacity: [0.55, 1, 0.55] } : undefined}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
      </svg>
      <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-yuzu/28 bg-black/70 font-serif text-lg italic text-silver backdrop-blur-xl">
        TapIn
      </div>
      {items.map((item, index) => {
        const angle = (-90 + index * 60) * (Math.PI / 180);
        const left = 50 + Math.cos(angle) * 32;
        const top = 50 + Math.sin(angle) * 32;
        return (
          <div
            key={item}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 font-mono text-[7px] uppercase tracking-[0.18em] text-silver/62 backdrop-blur-xl"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}

function SystemReadout({ activeProduct }: { activeProduct: ProductDefinition }) {
  return (
    <div className="absolute bottom-5 left-5 right-5 z-40 grid grid-cols-[1fr_auto] items-end gap-5 rounded-[1.6rem] border border-white/[0.08] bg-[#050605]/76 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.44),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeProduct.id}
          initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
          transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-yuzu shadow-[0_0_14px_rgba(204,255,0,0.75)]" />
            <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-yuzu/70">{activeProduct.eyebrow}</span>
          </div>
          <div className="mt-2 max-w-[34rem] text-[1.35rem] font-black leading-none tracking-tight text-silver">
            {activeProduct.headline}
          </div>
          <p className="mt-2 max-w-[38rem] text-[12px] leading-relaxed text-silver/56">
            {activeProduct.shortDescription}
          </p>
        </motion.div>
      </AnimatePresence>
      <div className="hidden gap-2 lg:flex">
        {activeProduct.bullets.slice(0, 3).map((bullet) => (
          <div key={bullet} className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 font-mono text-[7px] uppercase tracking-[0.18em] text-silver/50">
            {bullet}
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileLivingStage({
  products,
  activeProduct,
  onActivate,
}: {
  products: ProductDefinition[];
  activeProduct: ProductDefinition;
  onActivate: (product: ProductDefinition) => void;
}) {
  return (
    <div className="grid gap-5 md:hidden">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {products.map((product) => {
          const active = activeProduct.id === product.id;
          return (
            <button
              key={product.id}
              type="button"
              aria-label={`Activate ${product.name}`}
              onClick={() => onActivate(product)}
              className={`shrink-0 rounded-full border px-4 py-3 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors ${
                active ? 'border-yuzu/45 bg-yuzu/12 text-yuzu' : 'border-white/10 bg-white/[0.025] text-silver/50'
              }`}
            >
              {String(product.index).padStart(2, '0')} · {PRODUCT_LABELS[product.id]}
            </button>
          );
        })}
      </div>
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#070807]/62 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="font-serif text-2xl italic text-silver">
            TapIn<span className="text-yuzu">·</span>
          </div>
          <div className="rounded-full border border-yuzu/30 px-3 py-1 font-mono text-[8px] uppercase tracking-[0.24em] text-yuzu">
            Core
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.id}
            initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="overflow-hidden rounded-[1.4rem] border border-white/10">
              <ProductObject product={activeProduct} active />
            </div>
            <div className="mt-5">
              <div className="font-mono text-[8px] uppercase tracking-[0.3em] text-yuzu/70">
                {activeProduct.eyebrow}
              </div>
              <h2 className="mt-2 text-2xl font-black leading-none tracking-tight text-silver">
                {activeProduct.headline}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-silver/58">
                {activeProduct.shortDescription}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
