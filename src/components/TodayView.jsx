import { Plus, ChevronRight, CalendarClock, PiggyBank, Receipt } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'
import { CATEGORY_META, spendingRows, paceStatus, billsTimeline, dailySpend, monthsTo, goalDate } from '../lib/budget'
import { money, cn } from '../lib/utils'
import { Card, ProgressBar } from './ui'

const ordinal = n => n + (['th', 'st', 'nd', 'rd'][(n % 100 - 20) % 10] || ['th', 'st', 'nd', 'rd'][n % 100] || 'th')
const dayLabel = iso => {
  const d = new Date(iso + 'T12:00:00'), t = new Date(), y = new Date(); y.setDate(t.getDate() - 1)
  if (d.toDateString() === t.toDateString()) return 'Today'
  if (d.toDateString() === y.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
const STATUS_STYLE = {
  ok: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  fast: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  over: 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
  none: 'bg-slate-500/15 text-slate-600 dark:text-slate-300',
}

export default function TodayView({ state, s, dark, onAdd, onEdit, onCategory, onTab, onAll }) {
  const rows = spendingRows(s)
  const status = paceStatus(s)
  const bills = billsTimeline(state, s)
  const days = dailySpend(state, s)
  const g = state.goal
  const goalMonths = monthsTo(g, s.plannedSavings)
  const recent = [...state.expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8)
  const groups = []
  recent.forEach(e => { const grp = groups.find(x => x.date === e.date); if (grp) grp.items.push(e); else groups.push({ date: e.date, items: [e] }) })

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <div className="min-w-0 space-y-4">
        {/* the one number that matters */}
        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between gap-3">
            <span className={cn('rounded-full px-2.5 py-1 text-[12.5px] font-semibold', STATUS_STYLE[status.id])}>{status.label}</span>
            <span className="text-[13px] text-slate-500 dark:text-slate-400">{s.mi.daysLeft} day{s.mi.daysLeft > 1 ? 's' : ''} left in {s.mi.label.split(' ')[0]}</span>
          </div>
          <p className="mt-5 text-[15px] text-slate-600 dark:text-slate-300">{s.spentToday > 0 ? 'You can still spend' : 'You can spend'}</p>
          <p className="tabular text-[52px] font-extrabold leading-none tracking-tight sm:text-[60px]">{money(s.safeToday)}<span className="ml-2 text-[20px] font-semibold text-slate-500 dark:text-slate-400">today</span></p>
          {s.spentToday > 0 && <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-400">You've spent {money(s.spentToday, true)} of today's {money(s.todayBudget)}.</p>}
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
            {s.flexLeft >= 0
              ? <>You have <b className="text-slate-900 dark:text-white">{money(s.flexLeft)}</b> of spending money left for the rest of the month.</>
              : <>You're <b className="text-rose-500">{money(-s.flexLeft)}</b> over your spending money this month.</>}
          </p>
          {s.partial && <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">Since you started on the {s.startDay}{s.startDay % 10 === 1 && s.startDay !== 11 ? 'st' : s.startDay % 10 === 2 && s.startDay !== 12 ? 'nd' : s.startDay % 10 === 3 && s.startDay !== 13 ? 'rd' : 'th'}, this month only counts the days from then on.</p>}
          <ProgressBar value={s.flexSpent} max={s.flexBudget || 1} className="mt-5" height="h-2.5" glow={false} />
          <div className="mt-2 flex justify-between text-[13px] text-slate-500 dark:text-slate-400">
            <span>Spent {money(s.flexSpent)}</span><span>of {money(s.flexBudget)}</span>
          </div>
          <button type="button" onClick={onAdd}
            className="mt-5 hidden w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-[15px] font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-105 active:scale-[.99] md:flex">
            <Plus className="size-5" />Add spending
          </button>
        </Card>

        {/* categories */}
        <Card>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-[16px] font-bold">Spending money by category</h2>
            <button type="button" onClick={() => onTab('budget')} className="text-[13px] font-semibold text-emerald-600 hover:underline dark:text-emerald-400">Change</button>
          </div>
          {rows.length === 0 ? <p className="py-4 text-[15px] text-slate-500">No spending money planned yet. Set it up on the Budget tab.</p> : (
            <ul className="-mx-2">
              {rows.map(r => (
                <li key={r.id}>
                  <button type="button" onClick={() => onCategory(r.id)} className="flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left transition hover:bg-slate-900/[.03] dark:hover:bg-white/[.03]">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl" style={{ background: `${r.color}22`, color: r.color }}><r.icon className="size-[18px]" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-[15px] font-semibold">{r.name}</span>
                        <span className={cn('tabular text-[14px] font-semibold', r.left < 0 ? 'text-rose-500' : '')}>{r.left < 0 ? `${money(-r.left)} over` : `${money(r.left)} left`}</span>
                      </span>
                      <ProgressBar value={r.spent} max={r.budget || 1} color={r.color} className="mt-2" height="h-1.5" glow={false} />
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-slate-400" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* day by day */}
        <Card>
          <h2 className="text-[16px] font-bold">Day by day</h2>
          <p className="text-[13px] text-slate-500 dark:text-slate-400">Everyday spending this month. The dashed line is your daily budget ({money(s.plannedDaily)}).</p>
          <div className="-ml-3 mt-3 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={days} barCategoryGap="18%">
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: dark ? '#7c8599' : '#94a3b8', fontSize: 11 }} interval="preserveStartEnd" minTickGap={16} />
                <YAxis hide domain={[0, dataMax => Math.max(dataMax, s.plannedDaily * 1.4)]} />
                <Tooltip cursor={{ fill: dark ? 'rgba(255,255,255,.05)' : 'rgba(15,23,42,.04)' }}
                  content={({ active, payload }) => active && payload?.[0]?.value != null ? (
                    <div className={cn('rounded-lg px-2.5 py-1.5 text-[12px] font-semibold shadow-lg', dark ? 'bg-[#1a1d2b] text-white' : 'bg-white text-slate-900')}>
                      {s.mi.label.split(' ')[0]} {payload[0].payload.day}: {money(payload[0].value, true)}
                    </div>) : null} />
                <ReferenceLine y={s.plannedDaily} stroke={dark ? '#7c8599' : '#94a3b8'} strokeDasharray="4 4" />
                <Bar dataKey="spent" radius={[4, 4, 1, 1]}>
                  {days.map(d => <Cell key={d.day} fill={d.spent > s.plannedDaily ? '#fb923c' : '#34d399'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="min-w-0 space-y-4">
        {/* bills */}
        <Card>
          <div className="mb-3 flex items-center gap-2"><CalendarClock className="size-4 text-slate-400" /><h2 className="text-[16px] font-bold">Bills</h2></div>
          {state.fixed.length === 0 ? <p className="text-[15px] text-slate-500">No bills added. <button type="button" className="font-semibold text-emerald-600 dark:text-emerald-400" onClick={() => onTab('budget')}>Add one</button></p> : <>
            <p className="text-[14px] text-slate-500 dark:text-slate-400">
              {bills.paid.length} of {state.fixed.length} paid so far · {money(bills.upcoming.reduce((a, f) => a + f.amount, 0))} still to come
            </p>
            <ul className="mt-3 space-y-1">
              {[...bills.upcoming, ...bills.paid].slice(0, 5).map(f => {
                const m = CATEGORY_META[f.category], paid = f.day <= s.mi.day
                return (
                  <li key={f.id} className={cn('flex items-center gap-3 py-1.5', paid && 'opacity-50')}>
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg" style={{ background: `${m.color}22`, color: m.color }}><m.icon className="size-4" /></span>
                    <span className="min-w-0 flex-1 truncate text-[14.5px] font-medium">{f.name}</span>
                    <span className="text-[13px] text-slate-500 dark:text-slate-400">{paid ? 'Paid' : `Due the ${ordinal(f.day)}`}</span>
                    <span className="tabular w-16 text-right text-[14.5px] font-semibold">{money(f.amount)}</span>
                  </li>
                )
              })}
            </ul>
          </>}
        </Card>

        {/* goal */}
        <button type="button" onClick={() => onTab('goal')} className="glass block w-full p-5 text-left transition hover:-translate-y-0.5 sm:p-6">
          <div className="flex items-center gap-2"><PiggyBank className="size-4 text-emerald-500" /><h2 className="text-[16px] font-bold">{g.name || 'Savings goal'}</h2><ChevronRight className="ml-auto size-4 text-slate-400" /></div>
          <p className="tabular mt-3 text-[26px] font-extrabold tracking-tight">{money(g.saved)}<span className="text-[15px] font-semibold text-slate-500"> of {money(g.target)}</span></p>
          <ProgressBar value={g.saved} max={g.target || 1} color="#34d399" className="mt-3" glow={false} />
          <p className="mt-2 text-[13.5px] text-slate-500 dark:text-slate-400">
            {g.target > 0 && g.saved >= g.target ? 'You reached it.' : s.plannedSavings > 0 ? `Saving ${money(s.plannedSavings)} a month gets you there by ${goalDate(goalMonths)}.` : 'Set a monthly savings amount to see when you\'ll get there.'}
          </p>
        </button>

        {/* recent */}
        <Card>
          <div className="mb-3 flex items-center gap-2"><Receipt className="size-4 text-slate-400" /><h2 className="flex-1 text-[16px] font-bold">Recent spending</h2>
            {state.expenses.length > 0 && <button type="button" onClick={onAll} className="text-[13px] font-semibold text-emerald-600 hover:underline dark:text-emerald-400">See all</button>}</div>
          {groups.length === 0 ? (
            <button type="button" onClick={onAdd} className="w-full rounded-2xl border border-dashed border-slate-900/15 p-5 text-center text-[15px] text-slate-500 transition hover:border-emerald-400 hover:text-emerald-600 dark:border-white/15">
              Nothing yet. Tap <b>Add</b> when you buy something.
            </button>
          ) : (
            <div className="space-y-3">
              {groups.map(grp => (
                <div key={grp.date}>
                  <p className="mb-1 text-[12px] font-semibold text-slate-400">{dayLabel(grp.date)}</p>
                  <ul className="-mx-2">
                    {grp.items.map(e => {
                      const m = CATEGORY_META[e.category]
                      return (
                        <li key={e.id}>
                          <button type="button" onClick={() => onEdit(e)} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-slate-900/[.03] dark:hover:bg-white/[.03]" aria-label={`Edit ${e.note || m.name}, ${money(e.amount, true)}`}>
                            <span className="grid size-9 shrink-0 place-items-center rounded-xl" style={{ background: `${m.color}22`, color: m.color }}><m.icon className="size-4" /></span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[14.5px] font-semibold">{e.note || m.name}</span>
                              <span className="block text-[12.5px] text-slate-500 dark:text-slate-400">{m.name}</span>
                            </span>
                            <span className="tabular text-[14.5px] font-semibold">{e.category === 'savings' ? '+' : '−'}{money(e.amount, true)}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
              <button type="button" onClick={onAll} className="w-full rounded-xl bg-slate-900/[.04] py-2.5 text-[14px] font-semibold text-slate-600 transition hover:bg-slate-900/[.07] dark:bg-white/[.04] dark:text-slate-300 dark:hover:bg-white/[.08]">Edit or clear spending</button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
