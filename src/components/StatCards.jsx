import { Wallet, Gauge, Receipt, PiggyBank, TrendingDown, TrendingUp } from 'lucide-react'
import { money, pct, cn } from '../lib/utils'
import { Ring, ProgressBar } from './ui'

function Stat({ icon: Icon, label, value, sub, accent, children, footer, delay = 0 }) {
  return (
    <div className="glass group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl animate-rise" style={{ animationDelay: `${delay}ms` }}>
      <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-60" style={{ background: accent }} />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Icon className="size-3.5" />{label}
          </p>
          <p className="tabular mt-2 text-[28px] font-extrabold leading-none tracking-tight">{value}</p>
          <p className="mt-2 text-[13px] text-slate-500 dark:text-slate-400">{sub}</p>
        </div>
        {children}
      </div>
      {footer && <div className="relative mt-4">{footer}</div>}
    </div>
  )
}

export default function StatCards({ state, s }) {
  const g = state.goal
  const onPace = s.paceDaily <= s.plannedDaily
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat icon={Gauge} label="Safe to spend today" value={money(s.safeToday)} accent="#10b981"
        sub={<>{money(s.flexLeft)} left for {s.mi.daysLeft} day{s.mi.daysLeft > 1 ? 's' : ''}</>}>
        <Ring value={s.flexLeft} max={s.flexBudget} color={s.flexLeft < 0 ? '#f43f5e' : '#10b981'}>
          <span className="tabular text-[12px] font-bold">{pct(Math.max(0, s.flexLeft), s.flexBudget)}%</span>
        </Ring>
      </Stat>
      <Stat icon={Wallet} label="Left this month" value={money(s.balance)} accent="#6366f1" delay={60}
        sub={<>of {money(state.income)} income</>}>
        <Ring value={s.balance} max={state.income} color="#818cf8">
          <span className="tabular text-[12px] font-bold">{pct(Math.max(0, s.balance), state.income)}%</span>
        </Ring>
      </Stat>
      <Stat icon={Receipt} label="Daily pace" value={money(s.paceDaily)} accent={onPace ? '#38bdf8' : '#f43f5e'} delay={120}
        sub={<span className={cn('inline-flex items-center gap-1 font-medium', onPace ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500')}>
          {onPace ? <TrendingDown className="size-3.5" /> : <TrendingUp className="size-3.5" />}
          {onPace ? `${money(s.plannedDaily - s.paceDaily)}/day under plan` : `${money(s.paceDaily - s.plannedDaily)}/day over plan`}
        </span>} />
      <Stat icon={PiggyBank} label={g.name} value={money(g.saved)} accent="#34d399" delay={180}
        sub={<>{pct(g.saved, g.target)}% of {money(g.target)} goal</>}
        footer={<ProgressBar value={g.saved} max={g.target} color="#34d399" />} />
    </div>
  )
}
