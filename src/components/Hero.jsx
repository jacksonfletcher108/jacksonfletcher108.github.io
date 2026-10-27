import { ArrowDown, Nfc } from 'lucide-react'

export default function Hero({ stats, onNfc }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 sm:pt-20">
      <div className="animate-rise flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-white font-display text-[15px] font-bold text-slate-900">JF</span>
        <div className="leading-tight">
          <p className="text-[15px] font-semibold text-white">Hi, I'm Jackson.</p>
          <p className="text-[13.5px] text-slate-400">Charleston, SC</p>
        </div>
      </div>
      <h1 className="animate-rise mt-7 max-w-4xl font-display text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[60px] lg:text-[68px]" style={{ animationDelay: '60ms' }}>
        I build small apps for things that come up <span className="text-slate-400">every week.</span>
      </h1>
      <p className="animate-rise mt-6 max-w-[60ch] text-[17px] leading-relaxed text-slate-400 sm:text-[18px]" style={{ animationDelay: '120ms' }}>
        Each one started as something I wanted for myself: a quicker way to plan a date, figure out dinner, or keep a budget.
        I design and build them, then keep improving them as they get used. They all run in the browser, work well on a phone, and don't need an account.
      </p>
      <div className="animate-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: '180ms' }}>
        <a href="#apps" className="group inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-[15px] font-semibold text-slate-900 transition hover:-translate-y-0.5">
          See the apps<ArrowDown className="size-4 transition group-hover:translate-y-0.5" />
        </a>
        <button type="button" onClick={onNfc} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.04] px-5 py-3 text-[15px] font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[.08]">
          <Nfc className="size-4 text-amber-300" />Fridge tag setup
        </button>
      </div>

      <dl className="animate-rise mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[.08] bg-white/[.06] sm:grid-cols-4" style={{ animationDelay: '240ms' }}>
        {stats.map(s => (
          <div key={s.label} className="bg-[#0b0d14]/80 px-5 py-4 backdrop-blur">
            <dt className="text-[13px] text-slate-400">{s.label}</dt>
            <dd className="tabular mt-1 flex items-baseline gap-1.5 font-display text-[26px] font-semibold tracking-tight text-white">
              {s.value}{s.unit && <span className="font-sans text-[13px] font-medium text-slate-400">{s.unit}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
