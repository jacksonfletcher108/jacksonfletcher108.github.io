import { CalendarCheck, Clock, PiggyBank, ShieldCheck } from 'lucide-react'
import { Card } from './ui'
import { useNow } from '../hooks/useNow'
import { money, totals } from '../lib/money'

/** The savings number, redrawn every frame so you can watch the cents roll. */
function LiveTicker({ state }) {
  const now = useNow(50)
  const { saved } = totals(state, now)
  const [whole, frac = '00'] = money(saved, true).split('.')
  const tail = (saved % 0.01 * 10000).toFixed(0).padStart(2, '0').slice(0, 2)
  return (
    <p className="tabular mt-2 flex items-baseline font-extrabold tracking-tight" aria-live="off">
      <span className="text-[44px] leading-none sm:text-[64px]">{whole}</span>
      <span className="text-[30px] leading-none text-emerald-300 sm:text-[44px]">.{frac}</span>
      <span className="ml-0.5 text-[16px] leading-none text-emerald-300/40 sm:text-[20px]" aria-hidden="true">{tail}</span>
    </p>
  )
}

const plural = (n, w) => `${n.toLocaleString()} ${w}${n === 1 ? '' : 's'}`

export default function HeroStats({ state, t }) {
  const single = state.habits.length === 1
  const since = single ? new Date(state.habits[0].start) : null
  const fullDays = t.hours / 24
  return (
    <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <p className="flex items-center gap-2 text-[14px] font-semibold text-emerald-200/80"><PiggyBank className="size-4" /> Money saved</p>
        <LiveTicker state={state} />
        <p className="mt-3 text-[14px] text-slate-400">
          Growing <b className="tabular text-slate-200">{money(t.perDay / 24, true)}</b> an hour · <b className="tabular text-slate-200">{money(t.perDay * 365)}</b> a year
          {t.spentOnWishes > 0 && <> · <span className="text-slate-500">{money(t.spentOnWishes)} already spent on goals</span></>}
        </p>
      </Card>
      <div className="grid grid-cols-2 gap-3">
        <Card className="[animation-delay:60ms]">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-slate-400"><CalendarCheck className="size-4 text-emerald-300" /> Days clean</p>
          <p className="tabular mt-2 text-[40px] font-extrabold leading-none tracking-tight">{t.bestStreak.toLocaleString()}</p>
          <p className="mt-2 text-[13px] text-slate-500">{since ? `since ${since.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: since.getFullYear() === new Date().getFullYear() ? undefined : 'numeric' })}` : 'longest current streak'}</p>
        </Card>
        <Card className="[animation-delay:120ms]">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-slate-400"><Clock className="size-4 text-teal-300" /> Hours back</p>
          <p className="tabular mt-2 text-[40px] font-extrabold leading-none tracking-tight">{Math.floor(t.hours).toLocaleString()}</p>
          <p className="mt-2 text-[13px] text-slate-500">{fullDays >= 1 ? `${plural(Math.floor(fullDays), 'full day')} of life` : 'and counting'}</p>
        </Card>
        {state.urgesBeaten > 0 && (
          <div className="col-span-2 flex items-center gap-2.5 rounded-2xl border border-emerald-400/15 bg-emerald-400/[.06] px-4 py-3 text-[14px] text-emerald-100 animate-rise">
            <ShieldCheck className="size-5 shrink-0 text-emerald-300" />
            <span><b>{plural(state.urgesBeaten, 'craving')}</b> beaten. Every one of them counts.</span>
          </div>
        )}
      </div>
    </div>
  )
}
