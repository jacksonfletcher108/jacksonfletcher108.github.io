import { ArrowDown, Nfc } from 'lucide-react'

export default function Hero({ stats, onNfc }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 sm:pt-20">
      <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-1 font-mono text-[11.5px] uppercase tracking-[.14em] text-slate-300">
        <span className="size-1.5 rounded-full bg-cyan-300" />Portfolio · App Hub
      </p>
      <h1 className="animate-rise mt-6 max-w-4xl font-display text-[40px] font-bold leading-[1.02] tracking-[-0.035em] text-white sm:text-[64px] lg:text-[76px]" style={{ animationDelay: '60ms' }}>
        Small apps for{' '}
        <span className="bg-gradient-to-r from-violet-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">everyday life.</span>
      </h1>
      <p className="animate-rise mt-6 max-w-[58ch] text-[17px] leading-relaxed text-slate-400 sm:text-[18px]" style={{ animationDelay: '120ms' }}>
        Tools I design and ship for real problems: what to do on date night, what to cook, where the money is going, and whatever comes next.
        Open any of them right here, no sign-in, no install.
      </p>
      <div className="animate-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: '180ms' }}>
        <a href="#apps" className="group inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-[15px] font-semibold text-slate-900 shadow-[0_10px_40px_-10px_rgb(255_255_255/.45)] transition hover:-translate-y-0.5">
          Explore the apps<ArrowDown className="size-4 transition group-hover:translate-y-0.5" />
        </a>
        <button type="button" onClick={onNfc} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.04] px-5 py-3 text-[15px] font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[.08]">
          <Nfc className="size-4 text-amber-300" />NFC fridge setup
        </button>
      </div>

      <dl className="animate-rise mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[.08] bg-white/[.06] sm:grid-cols-4" style={{ animationDelay: '240ms' }}>
        {stats.map(s => (
          <div key={s.label} className="bg-[#0b0d14]/80 px-5 py-4 backdrop-blur">
            <dt className="text-[12px] font-medium text-slate-400">{s.label}</dt>
            <dd className="tabular mt-1 flex items-baseline gap-1.5 font-display text-[26px] font-semibold tracking-tight text-white">
              {s.value}{s.unit && <span className="font-sans text-[13px] font-medium text-slate-400">{s.unit}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
