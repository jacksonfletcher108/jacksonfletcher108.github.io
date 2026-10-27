import { money } from '../lib/utils'

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
