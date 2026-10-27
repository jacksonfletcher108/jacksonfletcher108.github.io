import { useMemo, useState } from 'react'
import { ArrowLeft, X, Wand2, Check } from 'lucide-react'
import { autoPlan, DEFAULT_PREFS } from '../lib/autoplan'
import { money } from '../lib/utils'
import { PlanQuestions, PlanResult, withNudges } from './AutoPlan'

/** "Plan it for me" from the Budget tab: answer a few questions, review the plan, use it. */
export default function AutoPlanSheet({ state, onApply, onClose }) {
  const [step, setStep] = useState(0)
  const [prefs, setPrefs] = useState(() => ({ ...DEFAULT_PREFS, ...(state.prefs || {}) }))
  const [nudges, setNudges] = useState({})
  const result = useMemo(() => autoPlan(state, prefs), [state, prefs])
  const bills = state.fixed.filter(f => f.category !== 'savings').reduce((a, f) => a + f.amount, 0)
  const preview = result.lines.filter(l => l.id !== 'savings').reduce((a, l) => a + l.amount, 0) / 30

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50 dark:bg-[#0b0d14]" role="dialog" aria-modal="true" aria-labelledby="ap-title">
      <div className="mx-auto flex min-h-full max-w-lg flex-col px-5 pb-[calc(24px+var(--sab))] pt-[calc(16px+var(--sat))]">
        <div className="flex items-center gap-2">
          {step === 1
            ? <button type="button" onClick={() => setStep(0)} aria-label="Back to questions" className="grid size-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-900/5 dark:hover:bg-white/[.07]"><ArrowLeft className="size-5" /></button>
            : <span className="grid size-10 place-items-center text-emerald-500"><Wand2 className="size-5" /></span>}
          <h2 id="ap-title" className="flex-1 text-[17px] font-bold">{step === 0 ? 'Plan it for me' : 'Your new plan'}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-900/5 dark:hover:bg-white/[.07]"><X className="size-5" /></button>
        </div>

        <div key={step} className="mt-5 flex-1 animate-rise">
          {step === 0 ? <>
            <p className="mb-6 text-[15px] text-slate-500 dark:text-slate-400">
              A few questions, and I'll split your {money(state.income - bills)} after bills between everyday spending and savings. Your bills stay as they are.
            </p>
            <PlanQuestions prefs={prefs} setPrefs={p => { setPrefs(p); setNudges({}) }} goal={state.goal} />
          </> : (
            <PlanResult result={result} nudges={nudges} setNudges={setNudges} bills={bills} income={state.income} />
          )}
        </div>

        <div className="sticky bottom-0 -mx-5 mt-8 border-t border-slate-900/[.06] bg-slate-50/90 px-5 pb-[calc(12px+var(--sab))] pt-3 backdrop-blur dark:border-white/[.06] dark:bg-[#0b0d14]/90">
          {step === 0 ? <>
            <p className="mb-2 text-center text-[13.5px] text-slate-500 dark:text-slate-400">So far: about <b className="text-slate-900 dark:text-white">{money(preview)}</b> a day to spend, <b className="text-slate-900 dark:text-white">{money(result.savings)}</b> a month saved</p>
            <button type="button" onClick={() => setStep(1)} className="w-full rounded-2xl bg-emerald-500 py-3.5 text-[16px] font-bold text-white shadow-lg shadow-emerald-500/25 active:scale-[.99]">See my plan</button>
          </> : (
            <button type="button" onClick={() => onApply(withNudges(result.targets, nudges), prefs)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-[16px] font-bold text-white shadow-lg shadow-emerald-500/25 active:scale-[.99]">
              <Check className="size-5" />Use this plan
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
