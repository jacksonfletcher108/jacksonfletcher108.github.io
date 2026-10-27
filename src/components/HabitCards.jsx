import { Flag, RotateCcw } from 'lucide-react'
import { Card, Progress } from './ui'
import { meta, nameOf } from '../lib/habits'
import { money } from '../lib/money'

const MILESTONES = [1, 3, 7, 14, 30, 60, 90, 180, 365, 730, 1095, 1825]
const nextMilestone = d => MILESTONES.find(m => m > d) || Math.ceil((d + 1) / 365) * 365
const label = d => (d % 365 === 0 ? `${d / 365} year${d === 365 ? '' : 's'}` : `${d} day${d === 1 ? '' : 's'}`)

function clock(ms) {
  const s = Math.floor(ms / 1000) % 86400
  return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map(n => String(n).padStart(2, '0')).join(':')
}

export default function HabitCards({ habits, t, onSlip }) {
  return (
    <div className={habits.length > 1 ? 'grid gap-3 md:grid-cols-2' : ''}>
      {habits.map((h, i) => {
        const m = meta(h), s = t.per.find(p => p.id === h.id), Icon = m.icon
        const goal = nextMilestone(s.streakDays)
        const prev = [...MILESTONES].reverse().find(x => x <= s.streakDays) || 0
        const toGo = goal - s.streakMs / 86400000
        return (
          <Card key={h.id} style={{ animationDelay: `${160 + i * 60}ms` }}>
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl" style={{ background: `${m.color}1f`, color: m.color }}><Icon className="size-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[16px] font-bold">{nameOf(h)}</p>
                <p className="tabular text-[13px] text-slate-400">{s.streakDays.toLocaleString()} {s.streakDays === 1 ? 'day' : 'days'} <span className="text-slate-500">{clock(s.streakMs)}</span></p>
              </div>
              <div className="text-right">
                <p className="tabular text-[16px] font-bold text-emerald-300">{money(s.saved)}</p>
                <p className="text-[12px] text-slate-500">saved</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-[13px]">
              <span className="flex items-center gap-1.5 font-semibold text-slate-300"><Flag className="size-3.5 text-emerald-300" /> Next: {label(goal)}</span>
              <span className="tabular text-slate-500">{toGo < 1 ? `${Math.max(1, Math.ceil(toGo * 24))}h to go` : `${Math.ceil(toGo)} days to go`}</span>
            </div>
            <Progress className="mt-2" height="h-2" value={(s.streakMs / 86400000 - prev) / (goal - prev)} />
            <div className="mt-4 flex items-center justify-between gap-2 text-[13px] text-slate-500">
              <span>{s.longest > s.streakDays ? `Longest streak: ${label(s.longest)}` : (h.slips?.length ? 'This is your longest streak yet' : `${money(s.perDay, true)} a day`)}</span>
              <button type="button" onClick={() => onSlip(h)} className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-semibold text-slate-400 transition hover:bg-white/[.06] hover:text-white"><RotateCcw className="size-3.5" /> I slipped</button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
