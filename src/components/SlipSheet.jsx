import { useEffect, useState } from 'react'
import { Button, Modal, MoneyInput } from './ui'
import { nameOf } from '../lib/habits'
import { habitStats, money } from '../lib/money'

/** Logging a slip, without the guilt trip. Past savings stay banked; only the streak restarts. */
export default function SlipSheet({ habit, habits, onClose, onConfirm }) {
  const [id, setId] = useState(habit?.id)
  const [spent, setSpent] = useState(0)
  const h = habits.find(x => x.id === id) || habit
  useEffect(() => { if (habit) { setId(habit.id); setSpent(Math.round(habitStats(habit, Date.now()).perDay)) } }, [habit])
  if (!h) return null
  const s = habitStats(h, Date.now())
  return (
    <Modal open={!!habit} onClose={onClose} title="It happens. Let's reset.">
      <p className="text-[15px] leading-relaxed text-slate-300">
        A slip doesn't erase the work. {s.streakDays > 0 && <>Those <b className="text-white">{s.streakDays} {s.streakDays === 1 ? 'day' : 'days'}</b> still count, and </>}
        the <b className="text-emerald-300">{money(Math.max(0, s.saved - spent))}</b> you saved from it stays in your fund. Only the streak counter starts over.
      </p>
      {habits.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {habits.map(x => <button key={x.id} type="button" onClick={() => setId(x.id)} aria-pressed={x.id === id} className={'rounded-full border px-3.5 py-1.5 text-[14px] font-semibold ' + (x.id === id ? 'border-emerald-400/50 bg-emerald-400/10' : 'border-white/10 text-slate-400')}>{nameOf(x)}</button>)}
        </div>
      )}
      <p className="mb-2 mt-5 text-[13px] font-semibold text-slate-400">Roughly what did it cost? (comes out of your fund)</p>
      <MoneyInput value={spent} onChange={setSpent} aria-label="Amount spent" />
      <p className="mt-4 rounded-2xl bg-white/[.04] p-4 text-[14px] leading-relaxed text-slate-400">Worth a thought: what was going on right before? Tired, stressed, bored, around certain people? Knowing the trigger makes the next one easier to see coming.</p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button variant="ghost" onClick={onClose}>Never mind</Button>
        <Button onClick={() => onConfirm(h, spent)}>Start a new streak</Button>
      </div>
    </Modal>
  )
}
