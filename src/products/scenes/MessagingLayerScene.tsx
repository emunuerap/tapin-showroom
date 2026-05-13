export function MessagingLayerScene() {
  return (
    <div className="relative min-h-[34rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#070707] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.52)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(204,255,0,0.1),transparent_32%),radial-gradient(circle_at_78%_76%,rgba(255,255,255,0.06),transparent_36%)]" />
      <div className="relative mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
        <ChatPanel
          label="WhatsApp"
          lines={[
            ['guest', 'Italian tonight, quiet, 2 people.'],
            ['tapin', 'Osteria Lumina has 20:00 and remembers your Chablis preference.'],
            ['guest', 'Hold it.'],
            ['tapin', 'Held for 4 minutes. Confirm with TapIn.'],
          ]}
        />
        <ChatPanel
          label="Telegram"
          lines={[
            ['guest', 'Move us 30 minutes later?'],
            ['tapin', '20:30 works. Table 04 remains available.'],
            ['guest', 'Perfect.'],
            ['tapin', 'Updated. Venue notified without calling.'],
          ]}
        />
      </div>

      <div className="relative mx-auto mt-6 grid max-w-5xl grid-cols-3 gap-3">
        {['Parse intent', 'Match availability', 'Send confirmation'].map((step, index) => (
          <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <div className="mx-auto grid h-9 w-9 place-items-center rounded-full border border-yuzu/35 bg-yuzu/[0.08] font-serif text-xl italic text-yuzu">
              {index + 1}
            </div>
            <div className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-silver/56">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatPanel({ label, lines }: { label: string; lines: Array<['guest' | 'tapin', string]> }) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-black/45 p-4">
      <div className="mb-5 flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-yuzu/70">{label}</span>
        <span className="h-2 w-2 rounded-full bg-yuzu shadow-[0_0_12px_rgba(204,255,0,0.72)]" />
      </div>
      <div className="grid gap-3">
        {lines.map(([speaker, text]) => (
          <div
            key={text}
            className={`max-w-[86%] rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
              speaker === 'tapin'
                ? 'ml-auto border-yuzu/26 bg-yuzu/[0.08] text-white'
                : 'border-white/10 bg-white/[0.055] text-silver/76'
            }`}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
