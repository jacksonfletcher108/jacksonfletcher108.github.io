import { ArrowUpRight, Nfc } from 'lucide-react'
import { cn } from '../lib/cn'

/** One app, hung on the fridge with a magnet or a piece of tape. */
export default function AppCard({ app, up, onOpen, onNfc, index }) {
  const Icon = app.icon
  const live = app.status === 'live'
  return (
    <article
      style={{ '--tilt': `${app.tilt}deg`, '--pin': app.color, '--card-paper': app.paper, animationDelay: `${index * 110}ms` }}
      className={cn('paper group relative flex flex-col rounded-[6px] p-6 pt-8 animate-hang transition-[transform,box-shadow] duration-300 ease-out sm:p-7 sm:pt-9',
        'rotate-[var(--tilt)] hover:z-10 hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[0_2px_2px_rgb(31_43_38/.08),0_26px_40px_-18px_rgb(31_43_38/.45)]',
        !live && 'border-2 border-dashed border-ink/15')}
    >
      <span className={app.pin === 'tape' ? 'tape' : 'magnet'} aria-hidden="true" />

      <div className="flex items-start gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl text-white shadow-[inset_0_-3px_0_rgb(0_0_0/.15)] transition-transform duration-300 group-hover:-rotate-6"
          style={{ background: app.color }}>
          <Icon className="size-7" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="hand text-[22px] leading-none" style={{ color: app.color }}>{app.kicker}</p>
          <h3 className="mt-1 flex flex-wrap items-center gap-x-2.5 font-display text-[28px] font-extrabold leading-tight tracking-tight">
            {app.name}
            {live
              ? <span className="inline-flex items-center gap-1.5 font-sans text-[12px] font-semibold tracking-normal text-pencil" title={up === false ? "Can't reach it right now" : 'Up and running'}>
                  <span className={cn('size-2 rounded-full', up === false ? 'bg-rose-400' : 'bg-[#2f8f6f]')} />{up === false ? 'offline' : 'live'}
                </span>
              : <span className="rounded-full bg-[#7c5cd6]/12 px-2 py-0.5 font-sans text-[12px] font-semibold tracking-normal text-[#5b3fb5]">in progress</span>}
          </h3>
        </div>
      </div>

      <p className="mt-4 text-[16px] leading-relaxed text-ink/85">{app.tagline}</p>

      <ul className="mt-4 space-y-2">
        {app.features.map(f => (
          <li key={f.text} className="flex items-center gap-2.5 text-[14.5px] text-pencil">
            <f.icon className="size-4 shrink-0" style={{ color: app.color }} />{f.text}
          </li>
        ))}
      </ul>

      {app.stats.length > 0 && (
        <p className="tabular mt-4 text-[13.5px] text-pencil">
          {app.stats.map(([n, l], i) => <span key={l}>{i > 0 && <span className="mx-1.5 text-pencil/40">·</span>}<b className="font-bold text-ink">{n}</b> {l}</span>)}
        </p>
      )}

      {/* handwritten note in the margin */}
      <p className="hand mt-5 border-t border-dashed border-ink/15 pt-4 text-[22px] leading-snug text-ink/80">
        {app.note} <span className="text-pencil">– J</span>
      </p>

      <div className="mt-auto flex items-center gap-2 pt-5">
        <button type="button" onClick={() => onOpen(app.id)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-bold text-white shadow-[inset_0_-3px_0_rgb(0_0_0/.18)] transition active:translate-y-px"
          style={{ background: live ? app.color : '#1f2b26' }}>
          {live ? `Open ${app.short}` : 'Vote on what\'s next'}
        </button>
        {app.id === 'kitchen' && (
          <button type="button" onClick={onNfc} aria-label="Set up the fridge tag" title="Fridge tag setup"
            className="grid size-12 place-items-center rounded-full border-2 border-ink/10 text-ink transition hover:-rotate-12 hover:border-ink/25">
            <Nfc className="size-5" />
          </button>
        )}
        {live && (
          <a href={app.url} target="_blank" rel="noreferrer" aria-label={`Open ${app.name} in its own tab`} title="Open in its own tab"
            className="grid size-12 place-items-center rounded-full border-2 border-ink/10 text-ink transition hover:rotate-12 hover:border-ink/25">
            <ArrowUpRight className="size-5" />
          </a>
        )}
      </div>
    </article>
  )
}
