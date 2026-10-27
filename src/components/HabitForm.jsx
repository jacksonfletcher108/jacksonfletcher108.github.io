import { field, MoneyInput, NumberInput, Segmented } from './ui'
import { meta, nameOf } from '../lib/habits'
import { money, perDay } from '../lib/money'
import { fromDateInput, toDateInput, todayInput } from '../lib/state'

const PERIODS = [['day', 'per day'], ['week', 'per week'], ['month', 'per month']]

/** The four things we need to know about a habit. Used in setup and in settings. */
export default function HabitForm({ habit, onChange, showStart = true }) {
  const m = meta(habit)
  const Icon = m.icon
  const set = patch => onChange({ ...habit, ...patch })
  const yearly = perDay(habit) * 365
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl" style={{ background: `${m.color}1f`, color: m.color }}><Icon className="size-5" /></span>
        {habit.type === 'custom'
          ? <input className={field} value={habit.name} placeholder={m.placeholder} aria-label="What are you quitting?" onChange={e => set({ name: e.target.value })} />
          : <p className="text-[17px] font-bold">{nameOf(habit)}</p>}
      </div>

      <div>
        <p className="mb-2 text-[13px] font-semibold text-slate-400">About how much did it cost you?</p>
        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <MoneyInput value={habit.cost} onChange={cost => set({ cost })} aria-label="Cost" />
          <Segmented label="How often" options={PERIODS} value={habit.period} onChange={period => set({ period })} className="sm:w-72" />
        </div>
        {yearly > 0 && <p className="mt-2 text-[13px] text-emerald-300/90">That's about <b className="tabular">{money(yearly)}</b> a year back in your pocket.</p>}
      </div>

      <div className={showStart ? 'grid gap-3 sm:grid-cols-2' : ''}>
        <div>
          <p className="mb-2 text-[13px] font-semibold text-slate-400">Hours a day it took up</p>
          <NumberInput value={habit.hoursPerDay} onChange={hoursPerDay => set({ hoursPerDay })} suffix="hrs / day" aria-label="Hours per day" />
        </div>
        {showStart && (
          <div>
            <p className="mb-2 text-[13px] font-semibold text-slate-400">Quit date</p>
            <input type="date" className={field + ' [color-scheme:dark]'} max={todayInput()} value={toDateInput(habit.start)}
              onChange={e => set({ start: fromDateInput(e.target.value) })} aria-label="Quit date" />
          </div>
        )}
      </div>
    </div>
  )
}
