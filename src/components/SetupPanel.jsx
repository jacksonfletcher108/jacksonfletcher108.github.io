import { useState } from 'react'
import { Banknote, CalendarClock, Plus, Trash2, Wand2 } from 'lucide-react'
import { CATEGORY_IDS, CATEGORY_META } from '../lib/budget'
import { money, pct, uid, cn } from '../lib/utils'
import { Card, CardHeader, MoneyInput, Button } from './ui'

/** 50/30/20-style split, used by the "Suggest targets" button. */
const SPLIT = { housing: 0.30, food: 0.12, entertainment: 0.05, savings: 0.20, utilities: 0.06, personal: 0.07 }

export default function SetupPanel({ state, s, update }) {
  const [draft, setDraft] = useState({ name: '', amount: 0, category: 'housing', day: 1 })
  const allocP = pct(s.allocated, state.income)
  const over = s.allocated > state.income && state.income > 0

  const addFixed = () => {
    if (!draft.name.trim() || draft.amount <= 0) return
    update(st => ({ ...st, fixed: [...st.fixed, { ...draft, id: uid(), name: draft.name.trim() }] }))
    setDraft(d => ({ ...d, name: '', amount: 0 }))
  }
  const suggest = () => update(st => ({
    ...st,
    targets: Object.fromEntries(CATEGORY_IDS.map(id => {
      const fixed = st.fixed.filter(f => f.category === id).reduce((a, f) => a + f.amount, 0)
      return [id, Math.max(fixed, Math.round((st.income * SPLIT[id]) / 10) * 10)]
    })),
  }))

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader icon={Banknote} title="Monthly income" subtitle="Take-home pay after taxes" />
        <MoneyInput size="lg" value={state.income} onChange={v => update(st => ({ ...st, income: v }))} aria-label="Monthly income" />

        <div className="mt-6">
          <div className="flex items-baseline justify-between">
            <p className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">Allocated</p>
            <p className={cn('tabular text-[13px] font-bold', over ? 'text-rose-500' : 'text-slate-900 dark:text-white')}>
              {allocP}% allocated
            </p>
          </div>
          {/* stacked allocation bar */}
          <div className="mt-2 flex h-3.5 w-full overflow-hidden rounded-full bg-slate-900/[.07] dark:bg-white/[.07]">
            {CATEGORY_IDS.map(id => {
              const w = state.income > 0 ? (s.byCat[id].planned / Math.max(state.income, s.allocated)) * 100 : 0
              return <div key={id} title={`${CATEGORY_META[id].name}: ${money(s.byCat[id].planned)}`} className="h-full transition-[width] duration-700 first:rounded-l-full"
                style={{ width: `${w}%`, background: CATEGORY_META[id].color }} />
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {CATEGORY_IDS.map(id => (
              <span key={id} className="flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400">
                <span className="size-2 rounded-full" style={{ background: CATEGORY_META[id].color }} />{CATEGORY_META[id].name}
                <span className="tabular font-semibold text-slate-700 dark:text-slate-200">{pct(s.byCat[id].planned, state.income)}%</span>
              </span>
            ))}
          </div>
          <div className={cn('mt-5 flex items-center justify-between gap-3 rounded-2xl p-4', over ? 'bg-rose-500/10' : 'bg-emerald-500/10')}>
            <div>
              <p className="text-[13px] font-medium text-slate-600 dark:text-slate-300">{over ? 'Over-allocated by' : 'Unallocated'}</p>
              <p className={cn('tabular text-xl font-extrabold', over ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400')}>{money(Math.abs(s.unallocated))}</p>
            </div>
            <Button variant="ghost" onClick={suggest} disabled={state.income <= 0}><Wand2 className="size-4" />Suggest targets</Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader icon={CalendarClock} title="Fixed expenses" subtitle={`${money(s.fixedTotal)}/mo · bills that never change`} />
        <ul className="space-y-1.5">
          {state.fixed.length === 0 && <li className="rounded-2xl border border-dashed border-slate-900/10 p-4 text-center text-sm text-slate-500 dark:border-white/10">Add rent, phone, subscriptions… anything with the same amount every month.</li>}
          {state.fixed.map(f => {
            const m = CATEGORY_META[f.category]
            return (
              <li key={f.id} className="group flex items-center gap-3 rounded-2xl p-2.5 transition hover:bg-slate-900/[.03] dark:hover:bg-white/[.03]">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl" style={{ background: `${m.color}22`, color: m.color }}><m.icon className="size-4" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold">{f.name}</p>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400">{m.name} · due the {ordinal(f.day)}</p>
                </div>
                <p className="tabular text-[14px] font-bold">{money(f.amount)}</p>
                <button type="button" aria-label={`Remove ${f.name}`} onClick={() => update(st => ({ ...st, fixed: st.fixed.filter(x => x.id !== f.id) }))}
                  className="grid size-8 place-items-center rounded-lg text-slate-400 opacity-100 transition hover:bg-rose-500/10 hover:text-rose-500 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100">
                  <Trash2 className="size-4" />
                </button>
              </li>
            )
          })}
        </ul>

        <form className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-slate-900/[.03] p-3 sm:grid-cols-[1fr_110px_auto] dark:bg-white/[.03]"
          onSubmit={e => { e.preventDefault(); addFixed() }}>
          <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="e.g. Car payment" aria-label="Expense name"
            className="col-span-2 rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-base outline-none transition focus:border-emerald-400/70 focus:ring-4 focus:ring-emerald-400/15 sm:col-span-1 dark:border-white/10 dark:bg-black/20" />
          <MoneyInput value={draft.amount} onChange={v => setDraft(d => ({ ...d, amount: v }))} aria-label="Amount" />
          <Button type="submit" disabled={!draft.name.trim() || draft.amount <= 0} className="sm:row-span-1"><Plus className="size-4" />Add</Button>
          <div className="col-span-2 flex flex-wrap items-center gap-1.5 sm:col-span-3">
            {CATEGORY_IDS.map(id => (
              <button key={id} type="button" onClick={() => setDraft(d => ({ ...d, category: id }))} aria-pressed={draft.category === id}
                className={cn('rounded-full border px-2.5 py-1 text-[12px] font-semibold transition',
                  draft.category === id ? 'border-transparent text-slate-900' : 'border-slate-900/10 text-slate-500 hover:text-slate-900 dark:border-white/10 dark:text-slate-400 dark:hover:text-white')}
                style={draft.category === id ? { background: CATEGORY_META[id].color } : undefined}>
                {CATEGORY_META[id].name}
              </button>
            ))}
            <label className="ml-auto flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400">
              Due day
              <input type="number" min="1" max="31" value={draft.day} onChange={e => setDraft(d => ({ ...d, day: Math.min(31, Math.max(1, parseInt(e.target.value) || 1)) }))}
                className="tabular w-14 rounded-lg border border-slate-900/10 bg-white/70 px-2 py-1 text-center text-base font-semibold outline-none dark:border-white/10 dark:bg-black/20" />
            </label>
          </div>
        </form>
      </Card>
    </div>
  )
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
