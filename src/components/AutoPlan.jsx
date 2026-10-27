import { useState } from 'react'
import { Minus, Plus, TriangleAlert, ChevronDown, History } from 'lucide-react'
import { CATEGORY_META } from '../lib/budget'
import { money, cn } from '../lib/utils'

const Chip = ({ on, onClick, children, className }) => (
  <button type="button" onClick={onClick} aria-pressed={on}
    className={cn('rounded-xl border px-3 py-2.5 text-[14px] font-semibold transition', on ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-slate-900/10 text-slate-600 hover:border-slate-900/25 dark:border-white/10 dark:text-slate-300 dark:hover:border-white/25', className)}>
    {children}
  </button>
)
const Q = ({ title, hint, children }) => (
  <section className="mt-7 first:mt-0">
    <h3 className="text-[16px] font-bold">{title}</h3>
    {hint && <p className="mt-0.5 text-[13.5px] text-slate-500 dark:text-slate-400">{hint}</p>}
    <div className="mt-3">{children}</div>
  </section>
)

/** The handful of questions the plan is built from. */
export function PlanQuestions({ prefs, setPrefs, goal }) {
  const [tune, setTune] = useState(false)
  const set = patch => setPrefs(p => ({ ...p, ...patch }))
  const setPri = (id, v) => setPrefs(p => ({ ...p, priorities: { ...p.priorities, [id]: v } }))
  const goalLeft = goal && goal.target > goal.saved
  return (
    <div>
      <Q title="Who does this budget cover?">
        <div className="grid grid-cols-4 gap-2">
          {[[1, 'Just me'], [2, '2'], [3, '3'], [4, '4+']].map(([n, l]) => <Chip key={n} on={prefs.household === n} onClick={() => set({ household: n })}>{l}</Chip>)}
        </div>
      </Q>
      <Q title="How often do you eat out or order in?">
        <div className="grid grid-cols-3 gap-2">
          {[['rarely', 'Rarely'], ['sometimes', 'Sometimes'], ['often', 'A lot']].map(([v, l]) => <Chip key={v} on={prefs.eatOut === v} onClick={() => set({ eatOut: v })}>{l}</Chip>)}
        </div>
      </Q>
      <Q title="What matters most right now?">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[['save', 'Saving more', 'Spend lean, save the extra'], ['balanced', 'A balance', 'Some of both'], ['enjoy', 'Enjoying it', 'More room to spend']].map(([v, l, sub]) => (
            <Chip key={v} on={prefs.style === v} onClick={() => set({ style: v })} className="text-left">
              <span className="block">{l}</span><span className="block text-[12.5px] font-medium opacity-70">{sub}</span>
            </Chip>
          ))}
        </div>
      </Q>
      <Q title="Anything else?" hint="Tap any that apply.">
        <div className="flex flex-wrap gap-2">
          <Chip on={prefs.car} onClick={() => set({ car: !prefs.car })}>I drive (gas, upkeep)</Chip>
          <Chip on={prefs.pet} onClick={() => set({ pet: !prefs.pet })}>I have a pet</Chip>
          <Chip on={prefs.cushion} onClick={() => set({ cushion: !prefs.cushion })}>Keep a cushion for surprises</Chip>
        </div>
      </Q>
      {goalLeft && (
        <Q title={`When do you want to reach ${goal.name || 'your goal'}?`} hint={`${money(goal.target - goal.saved)} to go.`}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[[6, '6 months'], [12, '1 year'], [24, '2 years'], [null, 'No rush']].map(([m, l]) => <Chip key={l} on={prefs.goalMonths === m} onClick={() => set({ goalMonths: m })}>{l}</Chip>)}
          </div>
        </Q>
      )}
      <button type="button" onClick={() => setTune(t => !t)} aria-expanded={tune} className="mt-7 flex items-center gap-1.5 text-[14.5px] font-semibold text-emerald-600 dark:text-emerald-400">
        Fine-tune what matters<ChevronDown className={cn('size-4 transition-transform', tune && 'rotate-180')} />
      </button>
      {tune && (
        <div className="mt-3 space-y-2.5 animate-fade">
          {['food', 'entertainment', 'personal'].map(id => (
            <div key={id} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-[14.5px] font-semibold">{id === 'entertainment' ? 'Fun' : CATEGORY_META[id].name}</span>
              <div className="grid flex-1 grid-cols-3 gap-1.5">
                {['less', 'normal', 'more'].map(v => <Chip key={v} on={prefs.priorities[id] === v} onClick={() => setPri(id, v)} className="px-2 py-2 text-[13px] capitalize">{v}</Chip>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/** Moves money between a category and savings. Returns adjusted targets. */
export function withNudges(targets, nudges) {
  const t = { ...targets }
  Object.entries(nudges).forEach(([id, d]) => { t[id] = Math.max(0, t[id] + d); t.savings = Math.max(0, t.savings - d) })
  return t
}

/** The plan, line by line, with why and a quick way to nudge each one. */
export function PlanResult({ result, nudges, setNudges, bills, income }) {
  const t = withNudges(result.targets, nudges)
  const step = 25
  const nudge = (id, dir) => setNudges(n => {
    const cur = n[id] || 0
    const line = result.lines.find(l => l.id === id)
    if (dir > 0 && t.savings < step) return n
    if (dir < 0 && line.amount + cur < step) return n
    return { ...n, [id]: cur + dir * step }
  })
  const daily = Math.max(0, result.lines.filter(l => l.id !== 'savings').reduce((a, l) => a + l.amount + (nudges[l.id] || 0), 0)) / 30
  return (
    <div>
      <div className="rounded-3xl bg-emerald-500/10 p-5">
        <p className="text-[14px] text-slate-600 dark:text-slate-300">You can spend about</p>
        <p className="tabular text-[40px] font-extrabold leading-tight tracking-tight text-emerald-600 dark:text-emerald-400">{money(daily)}<span className="text-[18px] font-semibold text-slate-500"> a day</span></p>
        <p className="mt-1 text-[14px] text-slate-600 dark:text-slate-300">and save <b>{money(t.savings)}</b> a month{result.cushion > 0 ? <>, with <b>{money(result.cushion)}</b> left as a cushion</> : ''}.</p>
        {result.usedHistory && <p className="mt-2 flex items-center gap-1.5 text-[13px] text-slate-500 dark:text-slate-400"><History className="size-3.5" />Based partly on what you've actually spent.</p>}
      </div>
      {result.warnings.length > 0 && (
        <ul className="mt-4 space-y-2">
          {result.warnings.map(w => <li key={w} className="flex gap-2.5 rounded-2xl bg-amber-500/10 p-3 text-[14px] leading-snug text-amber-800 dark:text-amber-200"><TriangleAlert className="mt-0.5 size-4 shrink-0" />{w}</li>)}
        </ul>
      )}
      <ul className="mt-5 divide-y divide-slate-900/[.07] dark:divide-white/[.07]">
        <li className="flex items-center justify-between py-3 text-[15px]"><span className="font-semibold">Take-home pay</span><span className="tabular font-bold">{money(income)}</span></li>
        <li className="flex items-center justify-between py-3 text-[15px]"><span>Bills</span><span className="tabular text-slate-600 dark:text-slate-300">−{money(bills)}</span></li>
        {result.lines.map(l => {
          const m = CATEGORY_META[l.id], amt = l.id === 'savings' ? t.savings : l.amount + (nudges[l.id] || 0)
          return (
            <li key={l.id} className="py-3.5">
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl" style={{ background: `${m.color}22`, color: m.color }}><m.icon className="size-4" /></span>
                <span className="flex-1 text-[15px] font-semibold">{l.id === 'entertainment' ? 'Fun' : m.name}</span>
                {l.id !== 'savings' && (
                  <span className="flex items-center gap-1">
                    <button type="button" onClick={() => nudge(l.id, -1)} aria-label={`Less for ${m.name}`} className="grid size-8 place-items-center rounded-lg border border-slate-900/10 text-slate-500 hover:text-slate-900 dark:border-white/10 dark:hover:text-white"><Minus className="size-3.5" /></button>
                    <button type="button" onClick={() => nudge(l.id, 1)} aria-label={`More for ${m.name}`} className="grid size-8 place-items-center rounded-lg border border-slate-900/10 text-slate-500 hover:text-slate-900 dark:border-white/10 dark:hover:text-white"><Plus className="size-3.5" /></button>
                  </span>
                )}
                <span className="tabular w-20 text-right text-[15px] font-bold">{money(amt)}</span>
              </div>
              <p className="mt-1.5 pl-12 text-[13.5px] leading-snug text-slate-500 dark:text-slate-400">{l.reason}</p>
            </li>
          )
        })}
      </ul>
      <p className="mt-2 text-[13px] text-slate-500 dark:text-slate-400">Use − and + to move money between a category and savings.</p>
    </div>
  )
}
