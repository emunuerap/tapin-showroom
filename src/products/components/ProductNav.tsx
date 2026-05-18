import { motion } from 'framer-motion';

interface ProductNavProps {
  onNavigateShowroom: () => void;
}

export function ProductNav({ onNavigateShowroom }: ProductNavProps) {
  return (
    <nav className="fixed left-1/2 top-6 z-[9999] flex w-full max-w-[94%] -translate-x-1/2 flex-col items-center md:max-w-3xl">
      <div className="flex w-full items-center justify-between rounded-full border border-white/8 bg-[#080808]/82 px-2 py-1.5 shadow-[0_10px_38px_rgba(0,0,0,0.62)] backdrop-blur-2xl">
        <button
          type="button"
          onClick={onNavigateShowroom}
          className="flex items-baseline pl-2 text-sm font-bold leading-none tracking-tighter text-silver transition-colors hover:text-white min-[390px]:pl-4"
        >
          TapIn
          <span className="ml-1 inline-block h-[5px] w-[5px] rounded-full bg-yuzu shadow-[0_0_8px_rgba(204,255,0,0.7)]" />
        </button>

        <div className="flex items-center rounded-full border border-white/8 bg-black/60 p-0.5">
          <button
            type="button"
            onClick={onNavigateShowroom}
            className="relative z-10 rounded-full px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/35 transition-colors hover:text-white/65 min-[390px]:px-4 min-[390px]:text-[10px]"
          >
            <span className="min-[390px]:hidden">Home</span>
            <span className="hidden min-[390px]:inline">Showroom</span>
          </button>
          <button
            type="button"
            className="relative z-10 rounded-full px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-white min-[390px]:px-4 min-[390px]:text-[10px]"
            aria-current="page"
          >
            Products
            <motion.span
              layoutId="active-route-products"
              className="absolute inset-0 -z-10 rounded-full border border-yuzu/35 bg-yuzu/15 shadow-[0_0_14px_rgba(204,255,0,0.2)]"
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            />
          </button>
        </div>

        <a
          href="#product-rail"
          className="mr-1 hidden rounded-full border border-yuzu/25 bg-yuzu px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-obsidian shadow-[0_0_18px_rgba(204,255,0,0.22)] transition-transform hover:scale-[1.03] min-[390px]:inline-flex"
        >
          Explore
        </a>
      </div>
    </nav>
  );
}
