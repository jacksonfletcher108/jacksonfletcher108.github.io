import { useEffect, useState } from 'react'
import { cn } from '../lib/utils'

export function Card({ className, children, ...props }) {
  return <section className={cn('glass p-5 sm:p-6 animate-rise', className)} {...props}>{children}</section>
}

export function CardHeader({ icon: Icon, title, subtitle, action, className }) {
  return (
    <div className={cn('mb-4 flex items-start justify-between gap-3', className)}>
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-900/5 text-slate-600 dark:bg-white/[.06] dark:text-slate-300">
            <Icon className="size-[18px]" strokeWidth={2} />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="truncate text-[15px] font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="text-[13px] leading-snug text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

export function ProgressBar({ value, max, color = '#10b981', className, height = 'h-2', glow = true }) {
  const p = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const over = max > 0 && value > max
  return (
    <div className={cn('relative w-full overflow-hidden rounded-full bg-slate-900/[.07] dark:bg-white/[.07]', height, className)}>
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(.2,.8,.2,1)]"
        style={{
          width: `${p}%`,
          background: over ? 'linear-gradient(90deg,#fb7185,#f43f5e)' : `linear-gradient(90deg, ${color}cc, ${color})`,
          boxShadow: glow ? `0 0 12px ${over ? '#f43f5e' : color}66` : undefined,
        }}
      />
    </div>
  )
}

export function Ring({ value, max, size = 64, stroke = 7, color = '#10b981', children }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r
  const p = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-slate-900/[.08] dark:stroke-white/[.08]" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - p)} style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)' }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}

export function Button({ variant = 'primary', className, children, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[.97] disabled:pointer-events-none disabled:opacity-40',
        variant === 'primary' && 'bg-gradient-to-br from-emerald-400 to-teal-500 text-emerald-950 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:brightness-105',
        variant === 'ghost' && 'border border-slate-900/10 bg-white/60 text-slate-700 hover:bg-white dark:border-white/10 dark:bg-white/[.04] dark:text-slate-200 dark:hover:bg-white/[.09]',
        variant === 'subtle' && 'text-slate-500 hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[.06] dark:hover:text-white',
        variant === 'danger' && 'text-rose-500 hover:bg-rose-500/10',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

const parseMoney = t => { const n = parseFloat(t); return Number.isFinite(n) ? Math.max(0, Math.round(n * 100) / 100) : 0 }
const cleanMoney = t => {
  let v = String(t).replace(/[^0-9.]/g, '')
  const dot = v.indexOf('.')
  if (dot >= 0) v = v.slice(0, dot + 1) + v.slice(dot + 1).replace(/\./g, '').slice(0, 2)   // one dot, two decimals
  return v
}

/**
 * Dollar input that keeps the $ inside the field. It holds what you're typing as text,
 * so "0.", "12." or an empty box stay put while you type instead of snapping to a number.
 */
export function MoneyInput({ value, onChange, className, inputClassName, size = 'md', onBlur, ...props }) {
  const [text, setText] = useState(value ? String(value) : '')
  useEffect(() => {
    // follow outside changes (sliders, undo), but don't fight the person typing
    setText(t => (parseMoney(t) === (value || 0) ? t : value ? String(value) : ''))
  }, [value])
  return (
    <label className={cn(
      'group flex items-center rounded-xl border border-slate-900/10 bg-white/70 transition focus-within:border-emerald-400/70 focus-within:ring-4 focus-within:ring-emerald-400/15 dark:border-white/10 dark:bg-black/20',
      size === 'lg' ? 'px-4 py-3' : 'px-3 py-2', className)}>
      <span className={cn('text-slate-400', size === 'lg' ? 'text-2xl font-semibold' : 'text-base')}>$</span>
      <input
        type="text" inputMode="decimal" autoComplete="off"
        value={text}
        placeholder="0"
        onChange={e => { const t = cleanMoney(e.target.value); setText(t); onChange(parseMoney(t)) }}
        onBlur={e => { setText(value ? String(value) : ''); onBlur?.(e) }}
        className={cn('tabular w-full min-w-0 bg-transparent pl-1 outline-none placeholder:text-slate-400/60', size === 'lg' ? 'text-3xl font-bold tracking-tight' : 'text-base font-semibold', inputClassName)}
        {...props}
      />
    </label>
  )
}

/** Day of the month (1–31). Can be cleared while typing; saves when you leave the box or press Enter. */
export function DayInput({ value, onChange, className, ...props }) {
  const [text, setText] = useState(String(value))
  useEffect(() => { setText(t => (Number(t) === value ? t : String(value))) }, [value])
  return (
    <input
      type="text" inputMode="numeric" autoComplete="off" value={text}
      onChange={e => setText(e.target.value.replace(/\D/g, '').slice(0, 2))}
      onBlur={() => {
        // save once you're done typing; an empty or impossible day puts the old one back
        const n = Number(text)
        if (text && n >= 1 && n <= 31) { if (n !== value) onChange(n) } else setText(String(value))
      }}
      onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur() }}
      className={cn('tabular rounded-xl border border-slate-900/10 bg-white/70 px-2 py-2 text-center text-base outline-none focus:border-emerald-400/70 dark:border-white/10 dark:bg-black/20', className)}
      {...props}
    />
  )
}

export function Slider({ value, min, max, step = 10, onChange, color = '#10b981', label }) {
  const p = ((value - min) / (max - min)) * 100
  return (
    <input
      type="range" className="slider" min={min} max={max} step={step} value={value} aria-label={label}
      onChange={e => onChange(Number(e.target.value))}
      style={{ '--pct': `${p}%`, '--fill': color }}
    />
  )
}
