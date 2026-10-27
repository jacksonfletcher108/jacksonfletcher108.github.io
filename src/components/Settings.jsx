import { useState } from 'react'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import { Button, field, Modal } from './ui'
import HabitForm from './HabitForm'
import { HABITS, meta, nameOf } from '../lib/habits'
import { newHabit } from '../lib/state'
import { cn } from '../lib/cn'

export default function Settings({ open, onClose, state, setState, onReset }) {
  const [openId, setOpenId] = useState(null)
  const [adding, setAdding] = useState(false)
  const [confirm, setConfirm] = useState(null) // habit id or 'reset'

  const update = h => setState(s => ({ ...s, habits: s.habits.map(x => (x.id === h.id ? h : x)) }))
  const remove = id => { setState(s => ({ ...s, habits: s.habits.filter(x => x.id !== id) })); setConfirm(null) }
  const add = type => { const h = newHabit(type); setState(s => ({ ...s, habits: [...s.habits, h] })); setOpenId(h.id); setAdding(false) }

  return (
    <Modal open={open} onClose={onClose} title="Settings" wide>
      <h3 className="mb-2 text-[13px] font-bold uppercase tracking-wider text-slate-500">What you're quitting</h3>
      <ul className="space-y-2">
        {state.habits.map(h => {
          const m = meta(h), Icon = m.icon, isOpen = openId === h.id
          return (
            <li key={h.id} className="rounded-2xl border border-white/[.08] bg-white/[.03]">
              <button type="button" onClick={() => setOpenId(isOpen ? null : h.id)} aria-expanded={isOpen} className="flex w-full items-center gap-3 p-3.5 text-left">
                <span className="grid size-9 place-items-center rounded-xl" style={{ background: `${m.color}1f`, color: m.color }}><Icon className="size-4" /></span>
                <span className="flex-1 font-bold">{nameOf(h)}</span>
                <ChevronDown className={cn('size-5 text-slate-500 transition', isOpen && 'rotate-180')} />
              </button>
              {isOpen && (
                <div className="border-t border-white/[.06] p-4 animate-rise">
                  <HabitForm habit={h} onChange={update} />
                  <p className="mt-3 text-[12px] text-slate-500">Changing the quit date or cost recalculates this streak. Money from earlier streaks stays banked.</p>
                  {state.habits.length > 1 && (confirm === h.id
                    ? <div className="mt-3 flex items-center gap-2"><span className="flex-1 text-[14px] text-rose-200">Remove it and its savings?</span><Button variant="ghost" className="py-2" onClick={() => setConfirm(null)}>Keep</Button><Button variant="danger" className="py-2" onClick={() => remove(h.id)}>Remove</Button></div>
                    : <Button variant="quiet" className="mt-2 px-2 py-2 text-[13px]" onClick={() => setConfirm(h.id)}><Trash2 className="size-4" /> Stop tracking this</Button>)}
                </div>
              )}
            </li>
          )
        })}
      </ul>
      {adding ? (
        <div className="mt-2 flex flex-wrap gap-2 animate-rise">
          {Object.entries(HABITS).filter(([type]) => type === 'custom' || !state.habits.some(h => h.type === type)).map(([type, m]) => (
            <button key={type} type="button" onClick={() => add(type)} className="rounded-full border border-white/10 bg-white/[.04] px-3.5 py-2 text-[14px] font-semibold hover:bg-white/[.08]">{m.label}</button>
          ))}
        </div>
      ) : (
        <Button variant="ghost" className="mt-2 w-full py-2.5" onClick={() => setAdding(true)}><Plus className="size-4" /> Quit something else too</Button>
      )}

      <h3 className="mb-2 mt-7 text-[13px] font-bold uppercase tracking-wider text-slate-500">Your why</h3>
      <textarea className={field + ' min-h-24 resize-none leading-relaxed'} maxLength={280} value={state.why} onChange={e => setState(s => ({ ...s, why: e.target.value }))} placeholder="Shows up when a craving hits." aria-label="Your reason" />

      <div className="mt-7 rounded-2xl bg-white/[.03] p-4 text-[13px] leading-relaxed text-slate-400">
        Everything is saved in this browser on this device. Nothing is sent anywhere.
      </div>
      <div className="mt-3">
        {confirm === 'reset'
          ? <div className="flex items-center gap-2"><span className="flex-1 text-[14px] text-rose-200">Erase everything and start over?</span><Button variant="ghost" className="py-2" onClick={() => setConfirm(null)}>Cancel</Button><Button variant="danger" className="py-2" onClick={onReset}>Erase</Button></div>
          : <Button variant="quiet" className="px-2 py-2 text-[13px] text-rose-300/80" onClick={() => setConfirm('reset')}><Trash2 className="size-4" /> Start over</Button>}
      </div>
    </Modal>
  )
}
