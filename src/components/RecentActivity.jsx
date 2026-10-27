import { Receipt, Trash2 } from 'lucide-react'
import { CATEGORY_META } from '../lib/budget'
import { money } from '../lib/utils'
import { Card, CardHeader } from './ui'

const dayLabel = iso => {
  const d = new Date(iso + 'T12:00:00'), t = new Date(), y = new Date(); y.setDate(t.getDate() - 1)
  if (d.toDateString() === t.toDateString()) return 'Today'
  if (d.toDateString() === y.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function RecentActivity({ state, onDelete, onAdd }) {
  const items = [...state.expenses].sort((a, b) => b.date.localeCompare(a.date) || 0).slice(0, 8)
  const groups = []
  items.forEach(e => { const g = groups.find(x => x.date === e.date); if (g) g.items.push(e); else groups.push({ date: e.date, items: [e] }) })
  return (
    <Card>
      <CardHeader icon={Receipt} title="Recent spending" subtitle={`${state.expenses.length} expense${state.expenses.length === 1 ? '' : 's'} logged`} />
      {groups.length === 0 ? (
        <button type="button" onClick={onAdd} className="w-full rounded-2xl border border-dashed border-slate-900/15 p-6 text-center text-sm text-slate-500 transition hover:border-emerald-400 hover:text-emerald-500 dark:border-white/15">
          Nothing logged yet. Tap <b>+</b> to add your first expense.
        </button>
      ) : (
        <div className="space-y-4">
          {groups.map(g => (
            <div key={g.date}>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">{dayLabel(g.date)}</p>
              <ul>
                {g.items.map(e => {
                  const m = CATEGORY_META[e.category]
                  return (
                    <li key={e.id} className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-900/[.03] dark:hover:bg-white/[.03]">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl" style={{ background: `${m.color}22`, color: m.color }}><m.icon className="size-4" /></span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold">{e.note || m.name}</p>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400">{m.name}</p>
                      </div>
                      <p className="tabular text-[14px] font-bold">−{money(e.amount, true)}</p>
                      <button type="button" aria-label={`Delete ${e.note || m.name}`} onClick={() => onDelete(e)}
                        className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-500 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100">
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
