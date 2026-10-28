import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '../lib/cn'

export function Card({ className, children, ...props }) {
  return <section className={cn('glass p-5 sm:p-6 animate-rise', className)} {...props}>{children}</section>
}

export function Button({ variant = 'primary', className, children, ...props }) {
  return (
    <button type="button" {...props}
      className={cn('inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[15px] font-bold transition active:scale-[.98] disabled:pointer-events-none disabled:opacity-40',
        variant === 'primary' && 'bg-gradient-to-br from-emerald-400 to-teal-500 text-emerald-950 shadow-lg shadow-emerald-500/20 hover:brightness-105',
        variant === 'ghost' && 'border border-white/10 bg-white/[.04] text-slate-100 hover:bg-white/[.08]',
        variant === 'quiet' && 'text-slate-400 hover:bg-white/[.06] hover:text-white',
        variant === 'danger' && 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25',
        className)}>
      {children}
    </button>
  )
}

/** Animated bar; stripes move while it's still filling. */
export function Progress({ value, className, color = 'from-emerald-400 to-teal-400', height = 'h-3' }) {
  const p = Math.max(0, Math.min(1, value || 0))
  return (
    <div className={cn('relative w-full overflow-hidden rounded-full bg-white/[.07]', height, className)} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p * 100)}>
      <div className={cn('h-full rounded-full bg-gradient-to-r transition-[width] duration-1000 ease-[cubic-bezier(.2,.8,.2,1)]', color, p < 1 && p > 0 && 'stripes')} style={{ width: `${p * 100}%` }} />
    </div>
  )
}

/** Full-screen on phones, centered on bigger screens. Escape and the backdrop close it. */
export function Modal({ open, onClose, title, label, children, wide, className }) {
  const ref = useRef(null)
  // the app redraws every second for the live counters; keep the latest onClose without re-running setup (which would steal focus from inputs)
  const close = useRef(onClose)
  useEffect(() => { close.current = onClose })
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    const onKey = e => { if (e.key === 'Escape') close.current() }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    const t = setTimeout(() => ref.current?.querySelector('[data-autofocus]')?.focus(), 40)
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); document.documentElement.style.overflow = ''; prev?.focus?.({ preventScroll: true }) }
  }, [open])
  if (!open) return null
  return (
    <div ref={ref} className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={label || title}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade" onClick={onClose} />
      <div className={cn('relative max-h-[94dvh] w-full overflow-y-auto rounded-t-[28px] border border-white/10 bg-[#0a1713]/95 p-5 pb-[calc(20px+var(--sab))] shadow-2xl backdrop-blur-2xl animate-pop sm:rounded-[28px] sm:p-7', wide ? 'max-w-2xl' : 'max-w-lg', className)}>
        {title && (
          <div className="mb-4 flex items-start justify-between gap-3">
            <h2 className="text-[20px] font-extrabold tracking-tight">{title}</h2>
            <button type="button" data-autofocus onClick={onClose} aria-label="Close" className="grid size-10 shrink-0 place-items-center rounded-xl text-slate-400 hover:bg-white/[.07] hover:text-white"><X className="size-5" /></button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export const field = 'w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10'

const clean = t => { let v = String(t).replace(/[^0-9.]/g, ''); const d = v.indexOf('.'); if (d >= 0) v = v.slice(0, d + 1) + v.slice(d + 1).replace(/\./g, '').slice(0, 2); return v }
const num = t => { const n = parseFloat(t); return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0 }

/** Dollar box that keeps what you're typing ("0.", "12.") instead of snapping to a number. */
export function MoneyInput({ value, onChange, className, big, ...props }) {
  const [text, setText] = useState(value ? String(value) : '')
  useEffect(() => { setText(t => (num(t) === (value || 0) ? t : value ? String(value) : '')) }, [value])
  return (
    <label className={cn('flex items-center rounded-2xl border border-white/10 bg-black/25 px-4 transition focus-within:border-emerald-400/60 focus-within:ring-4 focus-within:ring-emerald-400/10', big ? 'py-3.5' : 'py-3', className)}>
      <span className={cn('text-slate-500', big ? 'text-2xl font-bold' : 'text-base')}>$</span>
      <input type="text" inputMode="decimal" autoComplete="off" placeholder="0" value={text}
        onChange={e => { const t = clean(e.target.value); setText(t); onChange(num(t)) }}
        onBlur={() => setText(value ? String(value) : '')}
        className={cn('tabular w-full min-w-0 bg-transparent pl-1 text-white outline-none placeholder:text-slate-600', big ? 'text-3xl font-extrabold tracking-tight' : 'text-base font-semibold')} {...props} />
    </label>
  )
}

/** Small number box (hours) with the same typing behavior. */
export function NumberInput({ value, onChange, className, suffix, max = 24, ...props }) {
  const [text, setText] = useState(value ? String(value) : '')
  useEffect(() => { setText(t => (num(t) === (value || 0) ? t : value ? String(value) : '')) }, [value])
  return (
    <label className={cn('flex items-center rounded-2xl border border-white/10 bg-black/25 px-4 py-3 transition focus-within:border-emerald-400/60 focus-within:ring-4 focus-within:ring-emerald-400/10', className)}>
      <input type="text" inputMode="decimal" autoComplete="off" placeholder="0" value={text}
        onChange={e => { const t = clean(e.target.value); setText(t); onChange(Math.min(max, num(t))) }}
        onBlur={() => setText(value ? String(value) : '')}
        className="tabular w-full min-w-0 bg-transparent text-base font-semibold text-white outline-none placeholder:text-slate-600" {...props} />
      {suffix && <span className="shrink-0 pl-2 text-[14px] text-slate-400">{suffix}</span>}
    </label>
  )
}

export function Segmented({ options, value, onChange, className, label }) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('grid gap-1 rounded-2xl bg-black/25 p-1', className)} style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map(([v, l]) => (
        <button key={v} type="button" role="radio" aria-checked={value === v} onClick={() => onChange(v)}
          className={cn('rounded-xl px-2 py-2 text-[14px] font-semibold transition', value === v ? 'bg-white/[.12] text-white' : 'text-slate-400 hover:text-white')}>{l}</button>
      ))}
    </div>
  )
}

export function Toggle({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors', on ? 'bg-emerald-500' : 'bg-white/15')}>
      <span className={cn('absolute top-0.5 size-6 rounded-full bg-white shadow transition-all', on ? 'left-[22px]' : 'left-0.5')} />
    </button>
  )
}
