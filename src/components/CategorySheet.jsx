import { useEffect } from 'react'
import { X, Plus } from 'lucide-react'
import { money } from '../lib/utils'
import { ProgressBar } from './ui'

/** Tap a category on Today: what's left, what went where, and a shortcut to add more. */
export default function CategorySheet({ cat, s, onClose, onAdd, onEdit, onBudget }) {
  useEffect(() => {
    if (!cat) return
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.documentElement.style.overflow = '' }
  }, [cat, onClose])
  if (!cat) return null
  const c = s.byCat[cat]
  const budget = c.budget, left = budget - c.logged
  const items = s.monthExpenses.filter(e => e.category === cat).sort((a, b) => b.date.localeCompare(a.date))
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="cat-title">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm animate-fade" onClick={onClose} />
      <div className="relative flex max-h-[85dvh] w-full max-w-md flex-col rounded-t-[28px] border border-slate-900/10 bg-white p-5 pb-[calc(20px+var(--sab))] shadow-2xl animate-pop sm:rounded-[28px] sm:pb-5 dark:border-white/10 dark:bg-[#121522]">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl" style={{ background: `${c.color}22`, color: c.color }}><c.icon className="size-5" /></span>
          <div className="min-w-0 flex-1">
            <h2 id="cat-title" className="text-[18px] font-bold">{c.name}</h2>
            <p className="text-[13.5px] text-slate-500 dark:text-slate-400">{s.mi.label.split(' ')[0]}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-10 place-items-center rounded-xl text-slate-400 hover:bg-slate-900/5 dark:hover:bg-white/[.07]"><X className="size-5" /></button>
        </div>
        <p className="tabular mt-5 text-[30px] font-extrabold leading-none tracking-tight">{left >= 0 ? money(left) : `${money(-left)} over`}<span className="ml-2 text-[15px] font-semibold text-slate-500">{left >= 0 ? 'left' : ''}</span></p>
        <ProgressBar value={c.logged} max={budget || 1} color={c.color} className="mt-3" glow={false} />
        <p className="mt-2 text-[13.5px] text-slate-500 dark:text-slate-400">
          {money(c.logged)} spent of {money(budget)}{c.fixed > 0 ? `, not counting ${money(c.fixed)} in bills` : ''}.{' '}
          <button type="button" onClick={onBudget} className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400">Change</button>
        </p>
        <ul className="-mx-2 mt-4 min-h-0 flex-1 overflow-y-auto">
          {items.length === 0 && <li className="px-2 py-3 text-[14.5px] text-slate-500">Nothing spent here yet this month.</li>}
          {items.map(e => (
            <li key={e.id}>
              <button type="button" onClick={() => onEdit(e)} className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-slate-900/[.03] dark:hover:bg-white/[.04]">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14.5px] font-semibold">{e.note || c.name}</span>
                  <span className="block text-[12.5px] text-slate-500">{new Date(e.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </span>
                <span className="tabular text-[14.5px] font-semibold">{money(e.amount, true)}</span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={onAdd} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-[15px] font-bold text-white">
          <Plus className="size-5" />Add to {c.name}
        </button>
      </div>
    </div>
  )
}
