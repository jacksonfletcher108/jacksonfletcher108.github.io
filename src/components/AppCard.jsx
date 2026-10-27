import { ArrowUpRight, Play, Nfc, Clock3 } from 'lucide-react'
import { cn } from '../lib/cn'

export default function AppCard({ app, status, onLaunch, onNfc, index }) {
  const Icon = app.icon
  const live = app.status === 'live'
  const s = status?.[app.id]
  const onMove = e => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return (
    <article
      onPointerMove={onMove}
      style={{ '--glow': app.glow, animationDelay: `${120 + index * 90}ms` }}
      className={cn(
        'spot group relative flex flex-col rounded-[28px] p-6 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] animate-rise hover:-translate-y-1.5 sm:p-7',
        live ? 'glass hover:border-white/20 hover:shadow-[0_40px_80px_-40px_rgb(var(--glow)/.55)]' : 'border border-dashed border-white/15 bg-white/[.015] backdrop-blur-xl hover:border-violet-300/40',
      )}
    >
      {/* top row */}
      <div className="flex items-start justify-between gap-3">
        <span className="relative grid size-14 place-items-center rounded-2xl text-white shadow-lg transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${app.accent}, ${app.accent2})`, boxShadow: `0 14px 30px -12px ${app.accent}` }}>
          <Icon className="size-7" strokeWidth={1.8} />
        </span>
        {live ? (
          <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-2.5 py-1 font-mono text-[11px] font-medium text-slate-300">
            <span className={cn('size-1.5 rounded-full', s ? (s.up ? 'bg-emerald-400' : 'bg-rose-400') : 'animate-pulse bg-slate-500')} />
            {s ? (s.up ? `Live · ${s.ms}ms` : 'Unreachable') : 'Checking…'}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full border border-violet-300/25 bg-violet-400/10 px-2.5 py-1 font-mono text-[11px] font-medium text-violet-200">
            <Clock3 className="size-3" />In the lab
          </span>
        )}
      </div>

      <p className="mt-6 font-mono text-[11.5px] uppercase tracking-[.12em]" style={{ color: app.accent }}>{app.alias}</p>
      <h3 className="mt-2 font-display text-[24px] font-semibold leading-tight tracking-tight text-white">{app.name}</h3>
      <p className="mt-2.5 text-[15px] leading-relaxed text-slate-400">{app.tagline}</p>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tags">
        {app.tags.map(t => (
          <li key={t} className="rounded-full border px-2.5 py-1 text-[11.5px] font-semibold"
            style={{ borderColor: `${app.accent}40`, background: `${app.accent}14`, color: app.accent }}>{t}</li>
        ))}
      </ul>

      <ul className="mt-6 space-y-3 border-t border-white/[.07] pt-5">
        {app.features.map(f => (
          <li key={f.text} className="flex gap-3 text-[14px] leading-snug text-slate-300">
            <f.icon className="mt-0.5 size-4 shrink-0 text-slate-500 transition-colors group-hover:text-slate-300" />{f.text}
          </li>
        ))}
      </ul>

      <dl className="mt-6 grid grid-cols-3 gap-2">
        {app.stats.map(st => (
          <div key={st.label} className="rounded-xl bg-white/[.03] px-3 py-2.5">
            <dd className="tabular font-display text-[17px] font-semibold text-white">{st.value}</dd>
            <dt className="text-[11.5px] text-slate-500">{st.label}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-auto flex items-center gap-2 pt-6">
        <button type="button" onClick={() => onLaunch(app.id)}
          className="group/btn inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[14.5px] font-semibold text-slate-950 transition-all active:scale-[.98]"
          style={{ background: live ? `linear-gradient(135deg, ${app.accent}, ${app.accent2})` : 'rgb(255 255 255 / .9)' }}>
          <Play className="size-4 fill-current" />{live ? 'Launch App' : 'Peek inside'}
        </button>
        {app.id === 'kitchen' && (
          <button type="button" onClick={onNfc} aria-label="NFC tag setup guide" title="NFC tag setup"
            className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[.04] text-amber-300 transition hover:border-amber-300/40 hover:bg-amber-300/10">
            <Nfc className="size-5" />
          </button>
        )}
        {live && (
          <a href={app.url} target="_blank" rel="noreferrer" aria-label={`Open ${app.name} in a new tab`} title="Open in a new tab"
            className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[.04] text-slate-300 transition hover:border-white/25 hover:text-white">
            <ArrowUpRight className="size-5 transition group-hover:translate-x-px group-hover:-translate-y-px" />
          </a>
        )}
      </div>
    </article>
  )
}
