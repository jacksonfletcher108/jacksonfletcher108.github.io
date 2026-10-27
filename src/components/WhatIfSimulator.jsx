import { useMemo, useState } from 'react'
import { FlaskConical, UtensilsCrossed, Clapperboard, PiggyBank, BadgeDollarSign, Target, RotateCcw, ArrowRight, Sparkles } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'
import { goalSeries, monthsTo, goalDate } from '../lib/budget'
import { money, compact, cn } from '../lib/utils'
import { Card, CardHeader, Slider, MoneyInput } from './ui'
import { ChartTooltip, chartTheme } from './Charts'

const ZERO = { dining: 0, fun: 0, extra: 0, income: 0 }
const PRESETS = [
  { label: 'Cut dining out by $150', set: { dining: 150 } },
  { label: 'Put an extra $200 toward savings', set: { extra: 200 } },
  { label: 'Get a $300/mo raise', set: { income: 300 } },
  { label: 'Go all in', set: { dining: 200, fun: 100, extra: 250 } },
]

export default function WhatIfSimulator({ state, s, update, dark }) {
  const [sc, setSc] = useState(ZERO)
  const [routeToGoal, setRouteToGoal] = useState(true)
  const g = state.goal
  const t = chartTheme(dark)

  const food = s.byCat.food, fun = s.byCat.entertainment
  const maxDining = Math.max(50, Math.round(Math.max(0, food.planned - food.fixed) / 10) * 10)
  const maxFun = Math.max(50, Math.round(Math.max(0, fun.planned - fun.fixed) / 10) * 10)
  const set = patch => setSc(x => ({ ...x, ...patch }))

  const r = useMemo(() => {
    const cuts = Math.min(sc.dining, maxDining) + Math.min(sc.fun, maxFun)
    const baseMonthly = s.plannedSavings
    const baseCushion = s.unallocated
    const freed = cuts + sc.income
    const scenMonthly = Math.max(0, baseMonthly + sc.extra + (routeToGoal ? Math.max(0, freed) : 0))
    const scenCushion = baseCushion + freed - sc.extra - (routeToGoal ? Math.max(0, freed) : 0)
    const baseMonths = monthsTo(g, baseMonthly), scenMonths = monthsTo(g, scenMonthly)
    const horizon = Math.min(36, Math.max(12, Number.isFinite(baseMonths) ? baseMonths + 2 : 24))
    return {
      cuts, baseMonthly, scenMonthly, baseCushion, scenCushion, baseMonths, scenMonths,
      baseYear: baseMonthly * 12, scenYear: scenMonthly * 12,
      baseSafe: s.flexBudget / s.mi.days, scenSafe: Math.max(0, s.flexBudget - cuts) / s.mi.days,
      series: goalSeries(g, baseMonthly, scenMonthly, horizon),
    }
  }, [sc, routeToGoal, s, g, maxDining, maxFun])

  const changed = sc.dining || sc.fun || sc.extra || sc.income
  const sooner = Number.isFinite(r.baseMonths) && Number.isFinite(r.scenMonths) ? r.baseMonths - r.scenMonths : null

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="space-y-4">
        <Card>
          <CardHeader icon={FlaskConical} title="What if…" subtitle="Drag the sliders. Nothing changes your real budget."
            action={changed ? <button type="button" onClick={() => setSc(ZERO)} className="flex items-center gap-1 rounded-lg px-2 py-1 text-[12px] font-semibold text-slate-500 hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[.06] dark:hover:text-white"><RotateCcw className="size-3.5" />Reset</button> : null} />
          <div className="mb-5 flex flex-wrap gap-1.5">
            {PRESETS.map(p => (
              <button key={p.label} type="button" onClick={() => setSc({ ...ZERO, ...p.set })}
                className="rounded-full border border-slate-900/10 bg-white/50 px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:-translate-y-px hover:border-emerald-400 hover:text-emerald-600 dark:border-white/10 dark:bg-white/[.03] dark:text-slate-300 dark:hover:text-emerald-400">
                {p.label}
              </button>
            ))}
          </div>
          <div className="space-y-6">
            <Lever icon={UtensilsCrossed} color="#fb923c" label="Cut dining & food" value={sc.dining} max={maxDining} onChange={v => set({ dining: v })} prefix="−" />
            <Lever icon={Clapperboard} color="#f472b6" label="Cut entertainment" value={sc.fun} max={maxFun} onChange={v => set({ fun: v })} prefix="−" />
            <Lever icon={PiggyBank} color="#34d399" label="Extra toward savings" value={sc.extra} max={1000} step={25} onChange={v => set({ extra: v })} prefix="+" />
            <Lever icon={BadgeDollarSign} color="#818cf8" label="Income change" value={sc.income} min={-1500} max={2000} step={50} onChange={v => set({ income: v })} signed />
          </div>
          <label className="mt-6 flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-slate-900/[.03] p-3.5 dark:bg-white/[.03]">
            <span className="text-[13px] font-medium">Send freed-up money to my goal</span>
            <button type="button" role="switch" aria-checked={routeToGoal} onClick={() => setRouteToGoal(v => !v)}
              className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', routeToGoal ? 'bg-emerald-500' : 'bg-slate-400/40')}>
              <span className={cn('absolute top-0.5 size-5 rounded-full bg-white shadow transition-all', routeToGoal ? 'left-[22px]' : 'left-0.5')} />
            </button>
          </label>
        </Card>

        <Card>
          <CardHeader icon={Target} title="Your goal" subtitle="What you're saving toward" />
          <div className="grid grid-cols-2 gap-2">
            <input value={g.name} onChange={e => update(st => ({ ...st, goal: { ...st.goal, name: e.target.value } }))} aria-label="Goal name"
              className="col-span-2 rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-base font-semibold outline-none focus:border-emerald-400/70 focus:ring-4 focus:ring-emerald-400/15 dark:border-white/10 dark:bg-black/20" />
            <div><p className="mb-1 text-[12px] text-slate-500 dark:text-slate-400">Target</p><MoneyInput value={g.target} onChange={v => update(st => ({ ...st, goal: { ...st.goal, target: v } }))} aria-label="Goal target" /></div>
            <div><p className="mb-1 text-[12px] text-slate-500 dark:text-slate-400">Saved so far</p><MoneyInput value={g.saved} onChange={v => update(st => ({ ...st, goal: { ...st.goal, saved: v } }))} aria-label="Saved so far" /></div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="glass relative overflow-hidden p-6 animate-rise">
          <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-emerald-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-10 size-56 rounded-full bg-indigo-500/20 blur-3xl" />
          <p className="relative flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"><Sparkles className="size-3.5" />Impact</p>
          <p className="relative mt-2 text-2xl font-extrabold leading-tight tracking-tight sm:text-[28px]">
            {!changed ? <>Reach <span className="text-emerald-600 dark:text-emerald-400">{g.name || 'your goal'}</span> by {goalDate(r.baseMonths)}</>
              : sooner > 0 ? <>Reach {g.name || 'your goal'} <span className="text-emerald-600 dark:text-emerald-400">{sooner} month{sooner > 1 ? 's' : ''} sooner</span></>
              : sooner < 0 ? <>Your goal slips <span className="text-rose-500">{-sooner} month{-sooner > 1 ? 's' : ''}</span></>
              : r.scenCushion > r.baseCushion ? <>Keeps <span className="text-emerald-600 dark:text-emerald-400">{money(r.scenCushion - r.baseCushion)}/mo</span> more breathing room</>
              : <>Same goal date, {money(Math.abs(r.scenCushion - r.baseCushion))}/mo {r.scenCushion < r.baseCushion ? 'less' : 'more'} cushion</>}
          </p>
          <div className="relative mt-5 grid grid-cols-2 gap-2.5">
            <Compare label="To goal each month" a={money(r.baseMonthly)} b={money(r.scenMonthly)} good={r.scenMonthly >= r.baseMonthly} changed={r.scenMonthly !== r.baseMonthly} />
            <Compare label="Goal reached" a={goalDate(r.baseMonths)} b={goalDate(r.scenMonths)} good={r.scenMonths <= r.baseMonths} changed={r.scenMonths !== r.baseMonths} />
            <Compare label="Saved in 12 months" a={compact(r.baseYear)} b={compact(r.scenYear)} good={r.scenYear >= r.baseYear} changed={r.scenYear !== r.baseYear} />
            <Compare label="Daily spending budget" a={money(r.baseSafe)} b={money(r.scenSafe)} good={r.scenSafe >= r.baseSafe} changed={Math.round(r.scenSafe) !== Math.round(r.baseSafe)} />
          </div>
          {r.scenCushion < 0 && <p className="relative mt-3 rounded-xl bg-rose-500/10 px-3 py-2 text-[13px] font-medium text-rose-500">Heads up: this plan spends {money(-r.scenCushion)}/mo more than you bring in.</p>}
        </div>

        <Card>
          <CardHeader icon={PiggyBank} title="Goal growth" subtitle={`${g.name || 'Goal'}: ${money(g.target)}`}
            action={<div className="hidden items-center gap-3 text-[12px] text-slate-500 sm:flex dark:text-slate-400">
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded bg-slate-400" />Today's plan</span>
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded bg-emerald-400" />What-if</span>
            </div>} />
          <div className="-ml-2 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={r.series}>
                <defs>
                  <linearGradient id="gScen" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34d399" stopOpacity={0.4} /><stop offset="100%" stopColor="#34d399" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={t.grid} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: t.axis, fontSize: 11 }} tickFormatter={m => (m === 0 ? 'Now' : `${m}mo`)} interval="preserveStartEnd" minTickGap={22} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: t.axis, fontSize: 11 }} tickFormatter={compact} width={48} />
                <Tooltip content={<ChartTooltip dark={dark} labelFormat={m => (m === 0 ? 'Today' : `In ${m} month${m > 1 ? 's' : ''}`)} />} cursor={{ stroke: t.axis, strokeDasharray: '3 3' }} />
                <ReferenceLine y={g.target} stroke="#34d399" strokeDasharray="5 5" strokeOpacity={0.7} label={{ value: 'Goal', position: 'insideTopLeft', fill: '#34d399', fontSize: 11 }} />
                <Area type="monotone" dataKey="base" name="Today's plan" stroke={dark ? '#7c8599' : '#94a3b8'} strokeWidth={2} fill="transparent" dot={false} isAnimationActive={false} />
                <Area type="monotone" dataKey="scenario" name="What-if" stroke="#34d399" strokeWidth={2.5} fill="url(#gScen)" dot={false} animationDuration={500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}

function Lever({ icon: Icon, color, label, value, min = 0, max, step = 10, onChange, prefix = '', signed }) {
  const shown = signed ? `${value > 0 ? '+' : value < 0 ? '−' : ''}${money(Math.abs(value))}` : `${value ? prefix : ''}${money(value)}`
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-[14px] font-semibold">
          <span className="grid size-7 place-items-center rounded-lg" style={{ background: `${color}22`, color }}><Icon className="size-4" /></span>{label}
        </span>
        <span className="tabular rounded-lg px-2 py-0.5 text-[14px] font-bold transition-colors" style={value ? { background: `${color}22`, color } : undefined}>{shown}<span className="text-[11px] font-medium opacity-70">/mo</span></span>
      </div>
      <Slider value={value} min={min} max={max} step={step} onChange={onChange} color={color} label={label} />
    </div>
  )
}

function Compare({ label, a, b, good, changed }) {
  return (
    <div className="rounded-2xl border border-slate-900/[.06] bg-white/50 p-3 dark:border-white/[.06] dark:bg-white/[.03]">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5">
        {changed && <><span className="tabular text-[13px] text-slate-400 line-through decoration-slate-400/50">{a}</span><ArrowRight className="size-3.5 text-slate-400" /></>}
        <span className={cn('tabular text-[17px] font-extrabold', changed && (good ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'))}>{changed ? b : a}</span>
      </div>
    </div>
  )
}
