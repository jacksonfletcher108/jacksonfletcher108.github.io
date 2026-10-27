import { useState } from 'react'
import { Wand2, Plus, Trash2, ChevronDown } from 'lucide-react'
import { CATEGORY_META, COMMON_BILLS, SPEND_IDS, suggestTargets } from '../lib/budget'
import { money, pct, uid, cn } from '../lib/utils'
import { Card, MoneyInput } from './ui'

const ordinal = n => n + (['th', 'st', 'nd', 'rd'][(n % 100 - 20) % 10] || ['th', 'st', 'nd', 'rd'][n % 100] || 'th')

/** One screen for the whole plan: pay → bills → spending money → savings, with what's left to plan on top. */
export default function BudgetView({ state, s, update, say }) {
  const [openBill, setOpenBill] = useState(null)
  const [draft, setDraft] = useState({ name: '', amount: 0, category: 'personal', day: 1 })
  const bills = state.fixed.filter(f => f.category !== 'savings').reduce((a, f) => a + f.amount, 0)
  const savings = s.plannedSavings
  const spending = SPEND_IDS.reduce((a, id) => a + Math.max(0, s.byCat[id].target - s.byCat[id].fixed), 0)
  const leftToPlan = state.income - bills - savings - spending
  const W = v => (state.income > 0 ? `${Math.min(100, (v / Math.max(state.income, bills + savings + spending)) * 100)}%` : '0%')

  const setTarget = (id, v) => update(st => ({ ...st, targets: { ...st.targets, [id]: v } }))
  const setBill = (id, patch) => update(st => ({ ...st, fixed: st.fixed.map(f => (f.id === id ? { ...f, ...patch } : f)) }))
  const removeBill = f => {
    update(st => ({ ...st, fixed: st.fixed.filter(x => x.id !== f.id) }))
    say(`${f.name} removed`, { label: 'Undo', run: () => update(st => ({ ...st, fixed: [...st.fixed, f] })) })
  }
  const addBill = b => {
    // a new bill grows its category's budget so the spending money there stays the same
    update(st => ({ ...st, fixed: [...st.fixed, { ...b, id: uid() }], targets: { ...st.targets, [b.category]: (st.targets[b.category] || 0) + b.amount } }))
    setDraft({ name: '', amount: 0, category: 'personal', day: 1 })
  }
  const split = () => {
    const prev = state.targets
    update(st => ({ ...st, targets: suggestTargets(st.income, st.fixed, st.targets.savings) }))
    say('Spending money split for you', { label: 'Undo', run: () => update(st => ({ ...st, targets: prev })) })
  }
  const unusedCommon = COMMON_BILLS.filter(c => !state.fixed.some(f => f.name.toLowerCase() === c.name.toLowerCase())).slice(0, 5)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
      <div className="min-w-0 space-y-4">
        {/* pay + summary */}
        <Card>
          <h2 className="text-[16px] font-bold">Take-home pay</h2>
          <p className="text-[13.5px] text-slate-500 dark:text-slate-400">What lands in your account each month, after taxes.</p>
          <MoneyInput size="lg" value={state.income} onChange={v => update(st => ({ ...st, income: v }))} className="mt-3" aria-label="Monthly take-home pay" />

          <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-slate-900/[.07] dark:bg-white/[.07]">
            <span className="h-full bg-indigo-400 transition-[width] duration-500" style={{ width: W(bills) }} />
            <span className="h-full bg-emerald-400 transition-[width] duration-500" style={{ width: W(savings) }} />
            <span className="h-full bg-orange-400 transition-[width] duration-500" style={{ width: W(spending) }} />
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[14px] sm:grid-cols-4">
            <Legend color="bg-indigo-400" label="Bills" value={bills} />
            <Legend color="bg-emerald-400" label="Savings" value={savings} />
            <Legend color="bg-orange-400" label="Spending" value={spending} />
            <Legend color="bg-slate-400/40" label="Left to plan" value={Math.max(0, leftToPlan)} />
          </dl>
          <div className={cn('mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-3.5', leftToPlan < 0 ? 'bg-rose-500/10' : leftToPlan > 0 ? 'bg-amber-500/10' : 'bg-emerald-500/10')}>
            <p className="text-[14.5px]">
              {leftToPlan < 0 ? <>You've planned <b className="text-rose-500">{money(-leftToPlan)}</b> more than you make.</>
                : leftToPlan > 0 ? <><b>{money(leftToPlan)}</b> isn't planned yet.</>
                : <>Every dollar is planned.</>}
            </p>
            {leftToPlan !== 0 && state.income > 0 && (
              <button type="button" onClick={split} className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-[13.5px] font-semibold text-white dark:bg-white dark:text-slate-900">
                <Wand2 className="size-4" />Split it for me
              </button>
            )}
          </div>
        </Card>

        {/* bills */}
        <Card>
          <h2 className="text-[16px] font-bold">Bills</h2>
          <p className="text-[13.5px] text-slate-500 dark:text-slate-400">Same amount every month. Tap one to change it.</p>
          <ul className="mt-3 divide-y divide-slate-900/[.06] dark:divide-white/[.06]">
            {state.fixed.length === 0 && <li className="py-3 text-[15px] text-slate-500">No bills yet.</li>}
            {[...state.fixed].sort((a, b) => a.day - b.day).map(f => {
              const m = CATEGORY_META[f.category], open = openBill === f.id
              return (
                <li key={f.id} className="py-1">
                  <button type="button" onClick={() => setOpenBill(open ? null : f.id)} aria-expanded={open} className="flex w-full items-center gap-3 py-2 text-left">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl" style={{ background: `${m.color}22`, color: m.color }}><m.icon className="size-4" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold">{f.name}</span>
                      <span className="block text-[12.5px] text-slate-500 dark:text-slate-400">{m.name} · due the {ordinal(f.day)}</span>
                    </span>
                    <span className="tabular text-[15px] font-semibold">{money(f.amount)}</span>
                    <ChevronDown className={cn('size-4 text-slate-400 transition-transform', open && 'rotate-180')} />
                  </button>
                  {open && (
                    <div className="mb-2 grid grid-cols-[1fr_auto_auto] items-end gap-2 animate-fade">
                      <label className="text-[12.5px] text-slate-500">Amount<MoneyInput value={f.amount} onChange={v => setBill(f.id, { amount: v })} className="mt-1" /></label>
                      <label className="text-[12.5px] text-slate-500">Due day
                        <input type="number" inputMode="numeric" min="1" max="31" value={f.day} onChange={e => setBill(f.id, { day: Math.min(31, Math.max(1, parseInt(e.target.value) || 1)) })}
                          className="tabular mt-1 block w-16 rounded-xl border border-slate-900/10 bg-white/70 px-2 py-2 text-center text-base outline-none dark:border-white/10 dark:bg-black/20" />
                      </label>
                      <button type="button" onClick={() => removeBill(f)} aria-label={`Remove ${f.name}`} className="grid size-11 place-items-center rounded-xl text-rose-500 hover:bg-rose-500/10"><Trash2 className="size-4" /></button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
          <form onSubmit={e => { e.preventDefault(); if (draft.name.trim() && draft.amount > 0) addBill({ ...draft, name: draft.name.trim() }) }}
            className="mt-3 rounded-2xl bg-slate-900/[.03] p-3 dark:bg-white/[.03]">
            {unusedCommon.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {unusedCommon.map(c => (
                  <button key={c.name} type="button" onClick={() => setDraft(d => ({ ...d, name: c.name, category: c.category, day: c.day }))}
                    className="rounded-full border border-slate-900/10 px-2.5 py-1 text-[12.5px] font-semibold text-slate-600 hover:border-emerald-400 dark:border-white/10 dark:text-slate-300">+ {c.name}</button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="Add a bill" aria-label="Bill name"
                className="min-w-0 flex-1 rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-base outline-none focus:border-emerald-400/70 dark:border-white/10 dark:bg-black/20" />
              <MoneyInput value={draft.amount} onChange={v => setDraft(d => ({ ...d, amount: v }))} className="w-28" aria-label="Bill amount" />
              <button type="submit" disabled={!draft.name.trim() || draft.amount <= 0} aria-label="Add bill" className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-500 text-white disabled:opacity-30"><Plus className="size-5" /></button>
            </div>
            {draft.name && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SPEND_IDS.map(id => (
                  <button key={id} type="button" onClick={() => setDraft(d => ({ ...d, category: id }))} aria-pressed={draft.category === id}
                    className={cn('rounded-full px-2.5 py-1 text-[12.5px] font-semibold', draft.category === id ? 'text-slate-900' : 'text-slate-500 dark:text-slate-400')}
                    style={draft.category === id ? { background: CATEGORY_META[id].color } : undefined}>{CATEGORY_META[id].name}</button>
                ))}
              </div>
            )}
          </form>
        </Card>
      </div>

      <div className="min-w-0 space-y-4">
        {/* spending money */}
        <Card>
          <h2 className="text-[16px] font-bold">Spending money</h2>
          <p className="text-[13.5px] text-slate-500 dark:text-slate-400">How much you want to spend each month on everyday things, on top of bills.</p>
          <ul className="mt-3 space-y-2">
            {SPEND_IDS.map(id => {
              const c = s.byCat[id], extra = Math.max(0, c.target - c.fixed)
              return (
                <li key={id} className="flex items-center gap-3 rounded-2xl p-2">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl" style={{ background: `${c.color}22`, color: c.color }}><c.icon className="size-[18px]" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold">{c.name}</span>
                    <span className="block text-[12.5px] text-slate-500 dark:text-slate-400">{c.logged > 0 ? `${money(c.logged)} spent so far` : 'Nothing spent yet'}{c.fixed > 0 ? ` · plus ${money(c.fixed)} in bills` : ''}</span>
                  </span>
                  <MoneyInput value={extra} onChange={v => setTarget(id, c.fixed + v)} className="w-28" aria-label={`${c.name} spending money`} />
                </li>
              )
            })}
          </ul>
        </Card>

        {/* savings */}
        <Card>
          <h2 className="text-[16px] font-bold">Savings</h2>
          <p className="text-[13.5px] text-slate-500 dark:text-slate-400">What you set aside each month{state.income > 0 && savings > 0 ? `, about ${pct(savings, state.income)}% of your pay` : ''}.</p>
          <MoneyInput size="lg" value={state.targets.savings} onChange={v => setTarget('savings', v)} className="mt-3" aria-label="Monthly savings" />
          {s.byCat.savings.fixed > state.targets.savings && <p className="mt-2 text-[13.5px] text-slate-500">Your automatic transfers already add up to {money(s.byCat.savings.fixed)}.</p>}
        </Card>
      </div>
    </div>
  )
}

function Legend({ color, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn('size-2.5 shrink-0 rounded-full', color)} />
      <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="tabular ml-auto font-semibold sm:ml-0">{money(value)}</dd>
    </div>
  )
}
