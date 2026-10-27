import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, Line, ReferenceLine, Cell } from 'recharts'
import { BarChart3, LineChart } from 'lucide-react'
import { CATEGORY_IDS } from '../lib/budget'
import { cashFlowSeries } from '../lib/budget'
import { money, compact } from '../lib/utils'
import { Card, CardHeader } from './ui'

export const chartTheme = dark => ({
  grid: dark ? 'rgba(255,255,255,.06)' : 'rgba(15,23,42,.07)',
  axis: dark ? '#7c8599' : '#94a3b8',
  cursor: dark ? 'rgba(255,255,255,.05)' : 'rgba(15,23,42,.04)',
})

export function ChartTooltip({ active, payload, label, labelFormat, dark }) {
  if (!active || !payload?.length) return null
  const rows = payload.filter(p => p.value != null)
  if (!rows.length) return null
  return (
    <div className={`rounded-xl border px-3 py-2 text-[12px] shadow-xl backdrop-blur-xl ${dark ? 'border-white/10 bg-[#151826]/90 text-slate-100' : 'border-slate-900/10 bg-white/95 text-slate-900'}`}>
      <p className="mb-1 font-semibold">{labelFormat ? labelFormat(label) : label}</p>
      {rows.map(p => (
        <p key={p.dataKey} className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ background: p.color || p.payload.color }} />
          <span className="opacity-70">{p.name}</span>
          <span className="tabular ml-auto pl-3 font-semibold">{money(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

export function PlannedVsActual({ s, dark }) {
  const t = chartTheme(dark)
  const data = CATEGORY_IDS.map(id => ({ name: s.byCat[id].name, planned: s.byCat[id].planned, actual: s.byCat[id].actual, color: s.byCat[id].color }))
  return (
    <Card>
      <CardHeader icon={BarChart3} title="Planned vs. actual" subtitle="This month, by category"
        action={<div className="hidden items-center gap-3 text-[12px] text-slate-500 sm:flex dark:text-slate-400">
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-slate-400/40" />Planned</span>
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-400" />Actual</span>
        </div>} />
      <div className="-ml-2 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} barCategoryGap="22%">
            <CartesianGrid vertical={false} stroke={t.grid} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: t.axis, fontSize: 11 }} interval={0} tickFormatter={n => (n.length > 7 ? n.slice(0, 6) + '…' : n)} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: t.axis, fontSize: 11 }} tickFormatter={compact} width={48} />
            <Tooltip cursor={{ fill: t.cursor }} content={<ChartTooltip dark={dark} />} />
            <Bar dataKey="planned" name="Planned" radius={[6, 6, 2, 2]} fill={dark ? 'rgba(255,255,255,.12)' : 'rgba(15,23,42,.10)'} animationDuration={700} />
            <Bar dataKey="actual" name="Actual" radius={[6, 6, 2, 2]} animationDuration={900}>
              {data.map(d => <Cell key={d.name} fill={d.actual > d.planned ? '#f43f5e' : d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export function CashFlowChart({ state, s, dark }) {
  const t = chartTheme(dark)
  const data = cashFlowSeries(state, s)
  const end = data[data.length - 1]
  const short = end.projected != null && end.projected < 0
  return (
    <Card>
      <CardHeader icon={LineChart} title="Cash flow projection"
        subtitle={<>At this pace you'll end the month with <b className={short ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}>{money(end.projected ?? end.actual)}</b></>}
        action={<div className="hidden items-center gap-3 text-[12px] text-slate-500 sm:flex dark:text-slate-400">
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded bg-emerald-400" />Actual</span>
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded border-t-2 border-dashed border-indigo-400" />Projected</span>
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded bg-slate-400/50" />Plan</span>
        </div>} />
      <div className="-ml-2 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gActual" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34d399" stopOpacity={0.35} /><stop offset="100%" stopColor="#34d399" stopOpacity={0} /></linearGradient>
              <linearGradient id="gProj" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8" stopOpacity={0.22} /><stop offset="100%" stopColor="#818cf8" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={t.grid} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: t.axis, fontSize: 11 }} interval="preserveStartEnd" minTickGap={18} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: t.axis, fontSize: 11 }} tickFormatter={compact} width={48} />
            <Tooltip content={<ChartTooltip dark={dark} labelFormat={d => `Day ${d}`} />} cursor={{ stroke: t.axis, strokeDasharray: '3 3' }} />
            <ReferenceLine y={0} stroke="#f43f5e" strokeOpacity={0.5} strokeDasharray="4 4" />
            <ReferenceLine x={s.mi.day} stroke={t.axis} strokeOpacity={0.4} label={{ value: 'Today', position: 'insideTopRight', fill: t.axis, fontSize: 11 }} />
            <Line type="monotone" dataKey="planned" name="Plan" stroke={dark ? 'rgba(255,255,255,.25)' : 'rgba(15,23,42,.25)'} strokeWidth={1.5} dot={false} isAnimationActive={false} />
            <Area type="monotone" dataKey="projected" name="Projected" stroke="#818cf8" strokeWidth={2} strokeDasharray="5 4" fill="url(#gProj)" dot={false} connectNulls={false} animationDuration={900} />
            <Area type="monotone" dataKey="actual" name="Actual" stroke="#34d399" strokeWidth={2.5} fill="url(#gActual)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} animationDuration={900} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
