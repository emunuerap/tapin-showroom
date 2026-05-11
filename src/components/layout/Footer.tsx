export function Footer() {
    return (
        <footer className="w-full border-t border-white/5 py-16 px-6">
            <div className="max-w-5xl mx-auto flex flex-col items-center gap-7 text-center">
                {/* Wordmark — dot sits tight against "In" for proper logotype lockup */}
                <div className="inline-flex items-baseline leading-none">
                    <span className="font-sans font-bold tracking-tighter text-silver text-base">
                        TapIn
                    </span>
                    <span
                        aria-hidden="true"
                        className="ml-[3px] mb-[1px] inline-block w-[6px] h-[6px] rounded-full bg-yuzu shadow-[0_0_6px_1px_rgba(204,255,0,0.55)]"
                    />
                </div>

                {/* Minimal nav — only legal/contact links */}
                <nav
                    aria-label="Footer"
                    className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 font-mono text-[10px] text-silver/45 uppercase tracking-[0.22em]"
                >
                    <a href="#" className="hover:text-yuzu transition-colors duration-300">Privacy</a>
                    <a href="#" className="hover:text-yuzu transition-colors duration-300">Press</a>
                    <a href="#" className="hover:text-yuzu transition-colors duration-300">Contact</a>
                </nav>

                <span className="block w-12 h-px bg-white/10" />

                <p className="font-mono text-[10px] text-silver/30 tracking-[0.18em] uppercase">
                    © 2026 TapIn OS · The Hospitality Operating System
                </p>
            </div>
        </footer>
    );
}
