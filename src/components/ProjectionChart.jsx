import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { TrendingUp } from 'lucide-react'
import { Card, Segmented, Toggle } from './ui'
import { compact, dayLabel, HORIZONS, money, projection } from '../lib/money'

// checked with the dataviz validator against the card surface: both in band, CVD-separable
const CASH = '#7c86e8'
const INVESTED = '#13a37a'

function Tip({ active, payload, invest }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1814]/95 px-3.5 py-2.5 text-[13px] shadow-xl backdrop-blur">
      <p className="mb-1 font-semibold text-slate-300">{dayLabel(p.t)}</p>
      <Row color={CASH} dashed label="Kept as cash" value={money(p.cash)} />
      {invest && <Row color={INVESTED} label="Invested at 7%" value={money(p.invested)} />}
    </div>
  )
}
const Row = ({ color, label, value, dashed }) => (
  <p className="flex items-center gap-2 text-slate-400">
    <svg width="14" height="4" aria-hidden="true"><line x1="0" y1="2" x2="14" y2="2" stroke={color} strokeWidth="2.5" strokeDasharray={dashed ? '4 3' : undefined} /></svg>
    {label} <b className="tabular ml-auto pl-3 text-white">{value}</b>
  </p>
)

export default function ProjectionChart({ pool, perDay, wishes, horizon, invest, onHorizon, onInvest }) {
  const h = HORIZONS.find(x => x.id === horizon) || HORIZONS[2]
  const data = projection(pool, perDay, h.days)
  const end = data[data.length - 1]
  const max = invest ? end.invested : end.cash

  // goals stack on top of each other, so each line sits at the running total
  let run = 0
  const goals = wishes.filter(w => !w.boughtAt).map(w => ({ ...w, at: (run += w.price) })).filter(g => g.at > pool && g.at <= max).slice(0, 3)
  // skip a label when it would sit on top of the one below it
  let lastLabel = -Infinity
  for (const g of goals) { g.showLabel = g.at - lastLabel > max * 0.1; if (g.showLabel) lastLabel = g.at }

  return (
    <Card className="[animation-delay:260ms]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[19px] font-extrabold tracking-tight">Where this is heading</h2>
          <p className="text-[13px] text-slate-400">If you keep going at {money(perDay, true)} a day.</p>
        </div>
        <label className="flex items-center gap-2.5 text-[14px] font-semibold text-slate-300">
          <TrendingUp className="size-4 text-emerald-300" /> If invested at 7%
          <Toggle on={invest} onChange={onInvest} label="Show invested at 7% return" />
        </label>
      </div>

      <Segmented className="mt-4" label="Time range" options={HORIZONS.map(x => [x.id, x.short])} value={h.id} onChange={onHorizon} />

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-black/20 p-3.5">
          <p className="flex items-center gap-2 text-[12px] font-semibold text-slate-400"><svg width="14" height="4" aria-hidden="true"><line x1="0" y1="2" x2="14" y2="2" stroke={CASH} strokeWidth="2.5" strokeDasharray="4 3" /></svg>Kept as cash</p>
          <p className="tabular mt-1 text-[22px] font-extrabold tracking-tight">{money(end.cash)}</p>
        </div>
        <div className={'rounded-2xl p-3.5 transition ' + (invest ? 'bg-emerald-400/[.08]' : 'bg-black/20 opacity-50')}>
          <p className="flex items-center gap-2 text-[12px] font-semibold text-slate-400"><svg width="14" height="4" aria-hidden="true"><line x1="0" y1="2" x2="14" y2="2" stroke={INVESTED} strokeWidth="2.5" /></svg>Invested</p>
          <p className="tabular mt-1 text-[22px] font-extrabold tracking-tight">{money(end.invested)}</p>
          {invest && end.invested - end.cash >= 1 && <p className="tabular text-[12px] text-emerald-300">+{money(end.invested - end.cash)} from growth</p>}
        </div>
      </div>

      <div className="-mx-2 mt-4 h-60 sm:h-72" role="img" aria-label={`Projected savings over ${h.label}: ${money(end.cash)} as cash${invest ? `, ${money(end.invested)} invested` : ''}.`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="rgb(255 255 255 / .06)" />
            <XAxis dataKey="t" type="number" domain={[0, h.days]} tickFormatter={dayLabel} ticks={[0, Math.round(h.days / 2), h.days]} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={compact} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} width={52} />
            <Tooltip content={<Tip invest={invest} />} cursor={{ stroke: 'rgb(255 255 255 / .2)', strokeWidth: 1 }} />
            {goals.map(g => (
              <ReferenceLine key={g.id} y={g.at} stroke="rgb(255 255 255 / .18)" strokeDasharray="2 4"
                label={g.showLabel ? { value: g.name, position: 'insideTopLeft', fill: '#94a3b8', fontSize: 11 } : undefined} />
            ))}
            <Line type="monotone" dataKey="cash" stroke={CASH} strokeWidth={2} strokeDasharray="6 4" dot={false} activeDot={{ r: 5, stroke: '#0b1814', strokeWidth: 2 }} isAnimationActive />
            {invest && <Line type="monotone" dataKey="invested" stroke={INVESTED} strokeWidth={2.5} dot={false} activeDot={{ r: 5, stroke: '#0b1814', strokeWidth: 2 }} isAnimationActive />}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-slate-500">Starts from the {money(pool)} in your fund now. 7% is roughly the stock market's long-run average after inflation. It's not guaranteed, and real years swing up and down.</p>
    </Card>
  )
}
