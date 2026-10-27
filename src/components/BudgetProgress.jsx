import { useState } from 'react'
import { LayoutGrid, Pencil, Check, Lock } from 'lucide-react'
import { CATEGORY_IDS } from '../lib/budget'
import { money, pct, cn } from '../lib/utils'
import { Card, CardHeader, ProgressBar, MoneyInput, Slider } from './ui'

/** One row per category: spent vs target, with an inline target editor. */
export default function BudgetProgress({ state, s, onTarget, editable = false, title = 'Budget by category' }) {
  const [editing, setEditing] = useState(null)
  return (
    <Card>
      <CardHeader icon={LayoutGrid} title={title}
        subtitle={editable ? 'Tap a target to change it' : `${money(s.spentSoFar)} spent of ${money(s.allocated)} planned`} />
      <ul className="space-y-1">
        {CATEGORY_IDS.map(id => {
          const c = s.byCat[id]
          const Icon = c.icon
          const isSavings = id === 'savings'
          const left = c.planned - c.actual
          const open = editing === id
          return (
            <li key={id} className={cn('rounded-2xl p-3 transition-colors', open ? 'bg-slate-900/[.04] dark:bg-white/[.04]' : 'hover:bg-slate-900/[.025] dark:hover:bg-white/[.025]')}>
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl" style={{ background: `${c.color}22`, color: c.color }}>
                  <Icon className="size-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-[14px] font-semibold">{c.name}</p>
                    <button type="button" disabled={!editable} onClick={() => setEditing(open ? null : id)}
                      className={cn('tabular flex items-center gap-1.5 text-[13px] text-slate-500 dark:text-slate-400', editable && 'rounded-lg px-1.5 py-0.5 hover:bg-slate-900/5 hover:text-slate-900 dark:hover:bg-white/[.07] dark:hover:text-white')}>
                      <span className="font-semibold text-slate-900 dark:text-white">{money(c.actual)}</span> / {money(c.target)}
                      {editable && (open ? <Check className="size-3.5" /> : <Pencil className="size-3" />)}
                    </button>
                  </div>
                  <ProgressBar value={c.actual} max={c.planned || 1} color={c.color} className="mt-2" />
                  <p className={cn('mt-1.5 text-[12px]', left < 0 && !isSavings ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400')}>
                    {isSavings
                      ? (c.actual >= c.planned && c.planned > 0 ? 'Savings target met this month' : `${money(Math.max(0, left))} still to set aside`)
                      : left >= 0 ? `${money(left)} left · ${pct(c.actual, c.planned)}% used` : `${money(-left)} over budget`}
                    {c.fixed > 0 && <span className="ml-1.5 inline-flex items-center gap-1 text-slate-400"><Lock className="size-3" />{money(c.fixed)} fixed</span>}
                  </p>
                </div>
              </div>
              {open && (
                <div className="mt-3 grid gap-3 pl-[52px] animate-fade sm:grid-cols-[140px_1fr] sm:items-center">
                  <MoneyInput value={c.target} onChange={v => onTarget(id, v)} aria-label={`${c.name} target`} autoFocus
                    onKeyDown={e => e.key === 'Enter' && setEditing(null)} />
                  <Slider value={Math.min(c.target, Math.max(state.income, 500))} min={0} max={Math.max(state.income, 500)} step={10} color={c.color}
                    onChange={v => onTarget(id, v)} label={`${c.name} target slider`} />
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
