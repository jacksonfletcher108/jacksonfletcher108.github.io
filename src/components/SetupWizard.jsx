import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Plus, X } from 'lucide-react'
import { CATEGORY_META, COMMON_BILLS, PAY_FREQ, SPEND_IDS, suggestTargets } from '../lib/budget'
import { money, uid, cn } from '../lib/utils'
import { MoneyInput } from './ui'

const STEPS = ['Pay', 'Bills', 'Savings', 'Your plan']
const SAVE_PCTS = [0, 5, 10, 15, 20]

/** First-run setup, also reachable later from the menu. Three questions, then the plan it builds. */
export default function SetupWizard({ initial, onFinish, onCancel, onSample, canCancel }) {
  const [step, setStep] = useState(0)
  const [freq, setFreq] = useState('monthly')
  const [paycheck, setPaycheck] = useState(initial?.income || 0)
  const [bills, setBills] = useState(() => (initial?.fixed || []).map(f => ({ ...f })))
  const [savePct, setSavePct] = useState(null)
  const [saveAmt, setSaveAmt] = useState(() => initial?.targets?.savings || 0)
  const [goal, setGoal] = useState(() => initial?.goal || { name: 'Emergency fund', target: 5000, saved: 0 })
  const [draft, setDraft] = useState({ name: '', amount: 0, category: 'personal' })

  const income = Math.round(paycheck * PAY_FREQ.find(f => f.id === freq).mult)
  const save = savePct != null ? Math.round((income * savePct) / 100 / 10) * 10 : saveAmt
  const billTotal = bills.filter(b => b.category !== 'savings').reduce((a, b) => a + (b.amount || 0), 0)
  const plan = useMemo(() => suggestTargets(income, bills.filter(b => b.amount > 0), save), [income, bills, save])
  const spending = SPEND_IDS.reduce((a, id) => a + plan[id], 0) - billTotal
  const daily = spending / 30

  const hasBill = name => bills.some(b => b.name === name)
  const toggleCommon = c => setBills(list => (hasBill(c.name) ? list.filter(b => b.name !== c.name) : [...list, { id: uid(), ...c, amount: 0 }]))
  const setBill = (id, patch) => setBills(list => list.map(b => (b.id === id ? { ...b, ...patch } : b)))
  const addDraft = () => {
    if (!draft.name.trim()) return
    setBills(list => [...list, { id: uid(), name: draft.name.trim(), amount: draft.amount, category: draft.category, day: 1 }])
    setDraft({ name: '', amount: 0, category: 'personal' })
  }

  const canNext = step === 0 ? income > 0 : step === 2 ? save <= income - billTotal : true
  const finish = () => onFinish({
    income,
    fixed: bills.filter(b => b.amount > 0).map(({ id, name, amount, category, day }) => ({ id, name, amount, category, day: day || 1 })),
    targets: plan,
    goal: { name: goal.name.trim() || 'Savings goal', target: goal.target || 0, saved: goal.saved || 0 },
  })

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50 dark:bg-[#0b0d14]" role="dialog" aria-modal="true" aria-labelledby="setup-title">
      <div className="mx-auto flex min-h-full max-w-lg flex-col px-5 pb-[calc(24px+var(--sab))] pt-[calc(20px+var(--sat))]">
        {/* progress */}
        <div className="flex items-center gap-3">
          {step > 0
            ? <button type="button" onClick={() => setStep(s => s - 1)} aria-label="Back" className="grid size-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-900/5 dark:hover:bg-white/[.07]"><ArrowLeft className="size-5" /></button>
            : <span className="size-10" />}
          <div className="flex flex-1 gap-1.5" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
            {STEPS.map((s, i) => <span key={s} className={cn('h-1.5 flex-1 rounded-full transition-colors', i <= step ? 'bg-emerald-500' : 'bg-slate-900/10 dark:bg-white/10')} />)}
          </div>
          {canCancel
            ? <button type="button" onClick={onCancel} aria-label="Close setup" className="grid size-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-900/5 dark:hover:bg-white/[.07]"><X className="size-5" /></button>
            : <span className="size-10" />}
        </div>

        <div key={step} className="mt-8 flex-1 animate-rise">
          {step === 0 && <>
            <p className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400">Step 1 of 3</p>
            <h1 id="setup-title" className="mt-1 text-[28px] font-extrabold leading-tight tracking-tight">How much do you take home?</h1>
            <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400">Your pay after taxes. A rough number is fine; you can change it anytime.</p>
            <p className="mt-6 text-[13px] font-semibold text-slate-500 dark:text-slate-400">I get paid</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {PAY_FREQ.map(f => (
                <button key={f.id} type="button" onClick={() => setFreq(f.id)} aria-pressed={freq === f.id}
                  className={cn('rounded-xl border px-3 py-2.5 text-[14px] font-semibold transition', freq === f.id ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-slate-900/10 text-slate-600 dark:border-white/10 dark:text-slate-300')}>
                  {f.label}
                </button>
              ))}
            </div>
            <p className="mt-5 text-[13px] font-semibold text-slate-500 dark:text-slate-400">{freq === 'monthly' ? 'Each month' : 'Each paycheck'}</p>
            <MoneyInput size="lg" value={paycheck} onChange={setPaycheck} className="mt-2" aria-label={freq === 'monthly' ? 'Monthly take-home pay' : 'Take-home pay per paycheck'} autoFocus />
            {freq !== 'monthly' && paycheck > 0 && <p className="mt-3 text-[15px]">That's about <b>{money(income)}</b> a month.</p>}
          </>}

          {step === 1 && <>
            <p className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400">Step 2 of 3</p>
            <h1 id="setup-title" className="mt-1 text-[28px] font-extrabold leading-tight tracking-tight">What bills do you pay every month?</h1>
            <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400">Things that cost about the same each month. Tap to add, then fill in the amount.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {COMMON_BILLS.map(c => (
                <button key={c.name} type="button" onClick={() => toggleCommon(c)} aria-pressed={hasBill(c.name)}
                  className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[14px] font-semibold transition',
                    hasBill(c.name) ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-slate-900/10 text-slate-600 dark:border-white/10 dark:text-slate-300')}>
                  {hasBill(c.name) ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}{c.name}
                </button>
              ))}
            </div>
            {bills.length > 0 && (
              <ul className="mt-5 space-y-2">
                {bills.map(b => {
                  const m = CATEGORY_META[b.category]
                  return (
                    <li key={b.id} className="flex items-center gap-3 rounded-2xl border border-slate-900/[.07] bg-white/70 p-2.5 pl-3 dark:border-white/[.07] dark:bg-white/[.03]">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg" style={{ background: `${m.color}22`, color: m.color }}><m.icon className="size-4" /></span>
                      <span className="min-w-0 flex-1 truncate text-[15px] font-semibold">{b.name}</span>
                      <MoneyInput value={b.amount} onChange={v => setBill(b.id, { amount: v })} className="w-32" aria-label={`${b.name} amount`} />
                      <button type="button" onClick={() => setBills(list => list.filter(x => x.id !== b.id))} aria-label={`Remove ${b.name}`} className="grid size-8 place-items-center rounded-lg text-slate-400 hover:text-rose-500"><X className="size-4" /></button>
                    </li>
                  )
                })}
              </ul>
            )}
            <form onSubmit={e => { e.preventDefault(); addDraft() }} className="mt-4 rounded-2xl border border-dashed border-slate-900/15 p-3 dark:border-white/15">
              <div className="flex gap-2">
                <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="Something else?" aria-label="Bill name"
                  className="min-w-0 flex-1 rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-base outline-none focus:border-emerald-400/70 dark:border-white/10 dark:bg-black/20" />
                <MoneyInput value={draft.amount} onChange={v => setDraft(d => ({ ...d, amount: v }))} className="w-28" aria-label="Amount" />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {SPEND_IDS.map(id => (
                  <button key={id} type="button" onClick={() => setDraft(d => ({ ...d, category: id }))} aria-pressed={draft.category === id}
                    className={cn('rounded-full px-2.5 py-1 text-[12.5px] font-semibold transition', draft.category === id ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white')}
                    style={draft.category === id ? { background: CATEGORY_META[id].color } : undefined}>{CATEGORY_META[id].name}</button>
                ))}
                <button type="submit" disabled={!draft.name.trim()} className="ml-auto rounded-full bg-slate-900 px-3 py-1 text-[13px] font-semibold text-white disabled:opacity-30 dark:bg-white dark:text-slate-900">Add</button>
              </div>
            </form>
            <p className="mt-4 text-[15px]">Bills come to <b>{money(billTotal)}</b> a month{income > 0 && <>, leaving <b>{money(income - billTotal)}</b>.</>}</p>
          </>}

          {step === 2 && <>
            <p className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400">Step 3 of 3</p>
            <h1 id="setup-title" className="mt-1 text-[28px] font-extrabold leading-tight tracking-tight">How much do you want to save each month?</h1>
            <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400">Pick a share of your pay, or type an amount. Even a little adds up.</p>
            <div className="mt-5 grid grid-cols-5 gap-2">
              {SAVE_PCTS.map(p => (
                <button key={p} type="button" onClick={() => setSavePct(p)} aria-pressed={savePct === p}
                  className={cn('rounded-xl border py-2.5 text-[14px] font-semibold transition', savePct === p ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-slate-900/10 text-slate-600 dark:border-white/10 dark:text-slate-300')}>
                  {p === 0 ? 'None' : `${p}%`}
                </button>
              ))}
            </div>
            <MoneyInput size="lg" value={save} onChange={v => { setSavePct(null); setSaveAmt(v) }} className="mt-3" aria-label="Monthly savings amount" />
            {save > income - billTotal && <p className="mt-2 text-[14px] text-rose-500">That's more than what's left after bills ({money(income - billTotal)}).</p>}

            <div className="mt-8 rounded-2xl border border-slate-900/[.07] bg-white/70 p-4 dark:border-white/[.07] dark:bg-white/[.03]">
              <p className="text-[15px] font-semibold">Saving for something? <span className="font-normal text-slate-500 dark:text-slate-400">(optional)</span></p>
              <input value={goal.name} onChange={e => setGoal(g => ({ ...g, name: e.target.value }))} aria-label="Goal name"
                className="mt-3 w-full rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-base outline-none focus:border-emerald-400/70 dark:border-white/10 dark:bg-black/20" />
              <div className="mt-2 grid grid-cols-2 gap-2">
                <label className="text-[13px] text-slate-500 dark:text-slate-400">Goal<MoneyInput value={goal.target} onChange={v => setGoal(g => ({ ...g, target: v }))} className="mt-1" /></label>
                <label className="text-[13px] text-slate-500 dark:text-slate-400">Saved so far<MoneyInput value={goal.saved} onChange={v => setGoal(g => ({ ...g, saved: v }))} className="mt-1" /></label>
              </div>
            </div>
          </>}

          {step === 3 && <>
            <h1 id="setup-title" className="text-[28px] font-extrabold leading-tight tracking-tight">Here's your plan</h1>
            <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400">You can change any of these later on the Budget tab.</p>
            <div className="mt-6 rounded-3xl bg-emerald-500/10 p-5">
              <p className="text-[14px] text-slate-600 dark:text-slate-300">You can spend about</p>
              <p className="tabular text-[40px] font-extrabold leading-tight tracking-tight text-emerald-600 dark:text-emerald-400">{money(daily)}<span className="text-[18px] font-semibold text-slate-500"> a day</span></p>
              <p className="mt-1 text-[14px] text-slate-600 dark:text-slate-300">on everyday things, after bills and savings.</p>
            </div>
            <ul className="mt-5 divide-y divide-slate-900/[.07] dark:divide-white/[.07]">
              <PlanLine label="Take-home pay" value={income} strong />
              <PlanLine label="Bills" value={-billTotal} />
              <PlanLine label="Savings" value={-plan.savings} />
              {['food', 'personal', 'entertainment'].map(id => (
                <PlanLine key={id} label={CATEGORY_META[id].name} sub="spending money" value={-(plan[id] - bills.filter(b => b.category === id && b.amount > 0).reduce((a, b) => a + b.amount, 0))} color={CATEGORY_META[id].color} />
              ))}
              {income - SPEND_IDS.reduce((a, id) => a + plan[id], 0) - plan.savings !== 0 && <PlanLine label="Left over" value={income - SPEND_IDS.reduce((a, id) => a + plan[id], 0) - plan.savings} strong />}
            </ul>
          </>}
        </div>

        <div className="mt-8 space-y-2">
          {step < 3
            ? <button type="button" disabled={!canNext} onClick={() => setStep(s => s + 1)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-[16px] font-bold text-white shadow-lg shadow-emerald-500/25 transition active:scale-[.99] disabled:opacity-40">
                {step === 1 && bills.length === 0 ? 'Skip for now' : 'Next'}<ArrowRight className="size-5" />
              </button>
            : <button type="button" onClick={finish} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-[16px] font-bold text-white shadow-lg shadow-emerald-500/25 transition active:scale-[.99]">
                <Check className="size-5" />Start using Tally
              </button>}
          {step === 0 && onSample && <button type="button" onClick={onSample} className="w-full py-2 text-[14px] font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Just looking? Try it with example numbers</button>}
        </div>
      </div>
    </div>
  )
}

function PlanLine({ label, sub, value, strong, color }) {
  return (
    <li className="flex items-center gap-3 py-3">
      {color && <span className="size-2.5 rounded-full" style={{ background: color }} />}
      <span className={cn('flex-1 text-[15px]', strong && 'font-semibold')}>{label}{sub && <span className="text-slate-500 dark:text-slate-400"> · {sub}</span>}</span>
      <span className={cn('tabular text-[15px]', strong ? 'font-bold' : 'text-slate-600 dark:text-slate-300')}>{value < 0 ? '−' : ''}{money(Math.abs(value))}</span>
    </li>
  )
}
