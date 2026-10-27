import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Plus, X } from 'lucide-react'
import { Button, Card, field, MoneyInput } from './ui'
import HabitForm from './HabitForm'
import { HABITS, nameOf } from '../lib/habits'
import { money, perDay } from '../lib/money'
import { newHabit, newWish, WISH_IDEAS } from '../lib/state'
import { wishIcon } from '../lib/wishIcon'
import { cn } from '../lib/cn'

const STEPS = ['Habit', 'Cost', 'Goals', 'Why']

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0)
  const [habits, setHabits] = useState([])
  const [wishes, setWishes] = useState([])
  const [why, setWhy] = useState('')
  const [wName, setWName] = useState('')
  const [wPrice, setWPrice] = useState(0)

  const toggle = type => setHabits(hs => {
    if (type !== 'custom' && hs.some(h => h.type === type)) return hs.filter(h => h.type !== type)
    return [...hs, newHabit(type)]
  })
  const update = h => setHabits(hs => hs.map(x => (x.id === h.id ? h : x)))
  const addWish = (name, price) => { if (!name.trim() || !(price > 0)) return; setWishes(ws => [...ws, newWish(name, price)]); setWName(''); setWPrice(0) }

  const canNext = step === 0 ? habits.length > 0 : step === 1 ? habits.every(h => h.cost > 0 && (h.type !== 'custom' || h.name.trim())) : true
  const daily = habits.reduce((a, h) => a + perDay(h), 0)
  const finish = () => onDone({ habits: habits.map(h => ({ ...h, name: h.name.trim() })), wishes, why: why.trim() })

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 pb-[calc(24px+var(--sab))] pt-[calc(28px+var(--sat))]">
      <div className="mb-6 flex items-center gap-3">
        <Logo />
        <span className="text-[17px] font-extrabold tracking-tight">Habit Saver</span>
        <ol className="ml-auto flex gap-1.5" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
          {STEPS.map((s, i) => <li key={s} className={cn('h-1.5 rounded-full transition-all', i === step ? 'w-6 bg-emerald-400' : i < step ? 'w-3 bg-emerald-400/50' : 'w-3 bg-white/15')} />)}
        </ol>
      </div>

      <div key={step} className="flex-1 animate-rise">
        {step === 0 && (
          <>
            <h1 className="font-serif text-[34px] font-bold leading-[1.1] tracking-tight sm:text-[40px]">Every day you don't, <span className="text-emerald-300">you get paid.</span></h1>
            <p className="mt-3 text-[16px] leading-relaxed text-slate-300">Track the money and time you're taking back, then spend it on things that actually matter to you. What are you quitting?</p>
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {Object.entries(HABITS).map(([type, m]) => {
                const count = habits.filter(h => h.type === type).length
                const Icon = m.icon
                return (
                  <button key={type} type="button" onClick={() => toggle(type)} aria-pressed={count > 0}
                    className={cn('flex items-center gap-3 rounded-2xl border p-4 text-left transition', count ? 'border-emerald-400/50 bg-emerald-400/10' : 'border-white/10 bg-white/[.03] hover:bg-white/[.06]')}>
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl" style={{ background: `${m.color}1f`, color: m.color }}><Icon className="size-5" /></span>
                    <span className="flex-1 text-[15px] font-bold">{m.label}</span>
                    {type === 'custom' ? <Plus className="size-5 text-slate-400" /> : count > 0 && <Check className="size-5 text-emerald-300" />}
                  </button>
                )
              })}
            </div>
            {habits.some(h => h.type === 'custom') && <p className="mt-3 text-[13px] text-slate-400">You'll name {habits.filter(h => h.type === 'custom').length > 1 ? 'them' : 'it'} on the next step. Tap "Something else" again to add another.</p>}
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="text-[26px] font-extrabold tracking-tight">What was it costing you?</h1>
            <p className="mt-2 text-[15px] text-slate-400">Your best guess is fine, and you can change it later.</p>
            <div className="mt-5 space-y-3">
              {habits.map(h => (
                <Card key={h.id} className="relative">
                  {habits.length > 1 && <button type="button" onClick={() => setHabits(hs => hs.filter(x => x.id !== h.id))} aria-label={`Remove ${nameOf(h)}`} className="absolute right-3 top-3 grid size-9 place-items-center rounded-xl text-slate-500 hover:bg-white/[.07] hover:text-white"><X className="size-4" /></button>}
                  <HabitForm habit={h} onChange={update} />
                </Card>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-[26px] font-extrabold tracking-tight">What would you rather have?</h1>
            <p className="mt-2 text-[15px] text-slate-400">{daily > 0 ? <>At about <b className="text-emerald-300">{money(daily, true)}</b> a day, these come faster than you'd think.</> : 'Pick a few goals to put your savings toward.'} Optional.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {WISH_IDEAS.filter(([n]) => !wishes.some(w => w.name === n)).map(([n, p]) => {
                const Icon = wishIcon(n)
                return <button key={n} type="button" onClick={() => addWish(n, p)} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3.5 py-2 text-[14px] font-semibold hover:bg-white/[.08]"><Icon className="size-4 text-emerald-300" />{n} <span className="text-slate-500">{money(p)}</span></button>
              })}
            </div>
            <form className="mt-4 grid grid-cols-[1fr_8rem_auto] gap-2" onSubmit={e => { e.preventDefault(); addWish(wName, wPrice) }}>
              <input className={field} placeholder="Something else…" value={wName} onChange={e => setWName(e.target.value)} aria-label="Goal name" />
              <MoneyInput value={wPrice} onChange={setWPrice} aria-label="Goal price" />
              <Button type="submit" variant="ghost" className="px-3.5" aria-label="Add goal" disabled={!wName.trim() || !(wPrice > 0)}><Plus className="size-5" /></Button>
            </form>
            {wishes.length > 0 && (
              <ul className="mt-5 space-y-2">
                {wishes.map(w => {
                  const Icon = wishIcon(w.name)
                  return (
                    <li key={w.id} className="flex items-center gap-3 rounded-2xl border border-white/[.08] bg-white/[.03] p-3 animate-pop">
                      <span className="grid size-9 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300"><Icon className="size-4" /></span>
                      <span className="min-w-0 flex-1 truncate font-semibold">{w.name}</span>
                      <span className="tabular text-slate-300">{money(w.price)}</span>
                      {daily > 0 && <span className="hidden text-[13px] text-slate-500 sm:inline">~{Math.ceil(w.price / daily)} days</span>}
                      <button type="button" onClick={() => setWishes(ws => ws.filter(x => x.id !== w.id))} aria-label={`Remove ${w.name}`} className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-white/[.07] hover:text-white"><X className="size-4" /></button>
                    </li>
                  )
                })}
              </ul>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-[26px] font-extrabold tracking-tight">Why are you doing this?</h1>
            <p className="mt-2 text-[15px] text-slate-400">Write it to yourself. When a craving hits, this is what you'll see first.</p>
            <textarea className={field + ' mt-5 min-h-36 resize-none leading-relaxed'} maxLength={280} value={why} onChange={e => setWhy(e.target.value)}
              placeholder="I want to wake up clear-headed. I want my money to go somewhere I can see it." aria-label="Your reason" />
            <p className="mt-1.5 text-right text-[12px] text-slate-500">{why.length}/280</p>
          </>
        )}
      </div>

      <div className="mt-8 flex gap-2">
        {step > 0 && <Button variant="ghost" onClick={() => setStep(s => s - 1)} aria-label="Back" className="px-4"><ArrowLeft className="size-5" /></Button>}
        {step < STEPS.length - 1
          ? <Button className="flex-1" disabled={!canNext} onClick={() => setStep(s => s + 1)}>{step === 2 && !wishes.length ? 'Skip for now' : 'Continue'} <ArrowRight className="size-5" /></Button>
          : <Button className="flex-1" onClick={finish}>Start saving <ArrowRight className="size-5" /></Button>}
      </div>
    </main>
  )
}

export function Logo({ className }) {
  return (
    <svg viewBox="0 0 32 32" className={cn('size-8', className)} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#0d211b" />
      <path d="M7 22c4 0 5-7 9-7s4 3 9-6" fill="none" stroke="url(#lg)" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="25" cy="9" r="2.4" fill="#5eead4" />
      <defs><linearGradient id="lg" x1="0" x2="1"><stop offset="0" stopColor="#34d399" /><stop offset="1" stopColor="#2dd4bf" /></linearGradient></defs>
    </svg>
  )
}
