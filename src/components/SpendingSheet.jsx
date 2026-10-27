import { useEffect, useMemo, useState } from 'react'
import { X, ChevronLeft, ChevronRight, Check, Trash2 } from 'lucide-react'
import { CATEGORY_IDS, CATEGORY_META, nudgeGoal, savingsIn } from '../lib/budget'
import { money, todayISO, cn } from '../lib/utils'
import { MoneyInput } from './ui'

const monthKey = iso => iso.slice(0, 7)
const monthName = key => new Date(key + '-15T12:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
const dayName = iso => new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

/** Every purchase, month by month. Tap to edit in place, select several to delete, or clear a whole month. */
export default function SpendingSheet({ state, update, say, onClose }) {
  const months = useMemo(() => [...new Set([monthKey(todayISO()), ...state.expenses.map(e => monthKey(e.date))])].sort().reverse(), [state.expenses])
  const [month, setMonth] = useState(months[0])
  const [open, setOpen] = useState(null)        // id being edited
  const [draft, setDraft] = useState(null)
  const [selecting, setSelecting] = useState(false)
  const [picked, setPicked] = useState([])
  const [confirm, setConfirm] = useState(null)  // 'month' | 'all' | 'picked'

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.documentElement.style.overflow = '' }
  }, [onClose])

  const list = state.expenses.filter(e => monthKey(e.date) === month).sort((a, b) => b.date.localeCompare(a.date))
  const groups = []
  list.forEach(e => { const g = groups.find(x => x.date === e.date); if (g) g.items.push(e); else groups.push({ date: e.date, items: [e] }) })
  const total = list.filter(e => e.category !== 'savings').reduce((a, e) => a + e.amount, 0)
  const mi = months.indexOf(month)

  const startEdit = e => { if (selecting) { setPicked(p => (p.includes(e.id) ? p.filter(x => x !== e.id) : [...p, e.id])); return } setOpen(open === e.id ? null : e.id); setDraft({ ...e }) }
  const saveEdit = () => {
    const old = state.expenses.find(x => x.id === open)
    if (!old || !(draft.amount > 0)) return
    const next = { ...old, ...draft, note: (draft.note || '').trim() }
    const delta = savingsIn([next]) - savingsIn([old])
    update(st => nudgeGoal({ ...st, expenses: st.expenses.map(x => (x.id === old.id ? next : x)) }, delta))
    setOpen(null)
    say('Saved', { label: 'Undo', run: () => update(st => nudgeGoal({ ...st, expenses: st.expenses.map(x => (x.id === old.id ? old : x)) }, -delta)) })
  }
  const remove = (gone, label) => {
    if (!gone.length) return
    const ids = new Set(gone.map(e => e.id)), delta = -savingsIn(gone)
    update(st => nudgeGoal({ ...st, expenses: st.expenses.filter(x => !ids.has(x.id)) }, delta))
    setOpen(null); setPicked([]); setSelecting(false); setConfirm(null)
    say(label, { label: 'Undo', run: () => update(st => nudgeGoal({ ...st, expenses: [...st.expenses, ...gone] }, -delta)) })
  }
  const confirmText = {
    month: [`Delete all ${list.length} entr${list.length === 1 ? 'y' : 'ies'} from ${monthName(month)}?`, () => remove(list, `${monthName(month).split(' ')[0]} cleared`)],
    all: [`Delete all ${state.expenses.length} entries from every month? Your budget and bills stay.`, () => remove(state.expenses, 'All spending cleared')],
    picked: [`Delete ${picked.length} selected entr${picked.length === 1 ? 'y' : 'ies'}?`, () => remove(state.expenses.filter(e => picked.includes(e.id)), `${picked.length} deleted`)],
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 dark:bg-[#0b0d14]" role="dialog" aria-modal="true" aria-labelledby="sp-title">
      <header className="border-b border-slate-900/[.06] px-4 pb-3 pt-[calc(12px+var(--sat))] dark:border-white/[.06]">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-900/5 dark:hover:bg-white/[.07]"><X className="size-5" /></button>
          <h2 id="sp-title" className="flex-1 text-[17px] font-bold">All spending</h2>
          {list.length > 0 && (
            <button type="button" onClick={() => { setSelecting(v => !v); setPicked([]); setOpen(null); setConfirm(null) }}
              className="rounded-xl px-3 py-2 text-[14px] font-semibold text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400">{selecting ? 'Done' : 'Select'}</button>
          )}
        </div>
        <div className="mx-auto mt-2 flex max-w-2xl items-center gap-2">
          <button type="button" disabled={mi >= months.length - 1} onClick={() => setMonth(months[mi + 1])} aria-label="Earlier month" className="grid size-9 place-items-center rounded-lg text-slate-500 disabled:opacity-30"><ChevronLeft className="size-5" /></button>
          <p className="flex-1 text-center"><span className="block text-[15px] font-semibold">{monthName(month)}</span><span className="tabular block text-[13px] text-slate-500 dark:text-slate-400">{money(total, true)} spent · {list.length} entr{list.length === 1 ? 'y' : 'ies'}</span></p>
          <button type="button" disabled={mi <= 0} onClick={() => setMonth(months[mi - 1])} aria-label="Later month" className="grid size-9 place-items-center rounded-lg text-slate-500 disabled:opacity-30"><ChevronRight className="size-5" /></button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-4">
          {groups.length === 0 && <p className="py-16 text-center text-[15px] text-slate-500">Nothing logged in {monthName(month).split(' ')[0]}.</p>}
          {groups.map(g => (
            <section key={g.date} className="mb-4">
              <h3 className="mb-1 px-1 text-[12.5px] font-semibold text-slate-400">{dayName(g.date)}</h3>
              <ul className="overflow-hidden rounded-2xl border border-slate-900/[.07] bg-white/70 dark:border-white/[.07] dark:bg-white/[.03]">
                {g.items.map(e => {
                  const m = CATEGORY_META[e.category], editing = open === e.id, on = picked.includes(e.id)
                  return (
                    <li key={e.id} className="border-b border-slate-900/[.06] last:border-0 dark:border-white/[.06]">
                      <button type="button" onClick={() => startEdit(e)} aria-expanded={editing} aria-pressed={selecting ? on : undefined}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-slate-900/[.02] dark:hover:bg-white/[.02]">
                        {selecting && <span className={cn('grid size-6 shrink-0 place-items-center rounded-full border-2 transition', on ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600')}>{on && <Check className="size-3.5" strokeWidth={3} />}</span>}
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl" style={{ background: `${m.color}22`, color: m.color }}><m.icon className="size-4" /></span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-semibold">{e.note || m.name}</span>
                          <span className="block text-[12.5px] text-slate-500 dark:text-slate-400">{m.name}</span>
                        </span>
                        <span className="tabular text-[15px] font-semibold">{e.category === 'savings' ? '+' : ''}{money(e.amount, true)}</span>
                      </button>
                      {editing && draft && (
                        <div className="space-y-3 bg-slate-900/[.025] px-3 pb-3 pt-2 animate-fade dark:bg-white/[.025]">
                          <div className="grid grid-cols-[1fr_1fr] gap-2">
                            <label className="text-[12.5px] text-slate-500">Amount<MoneyInput value={draft.amount} onChange={v => setDraft(d => ({ ...d, amount: v }))} className="mt-1" autoFocus /></label>
                            <label className="text-[12.5px] text-slate-500">Date
                              <input type="date" value={draft.date} max={todayISO()} onChange={ev => ev.target.value && setDraft(d => ({ ...d, date: ev.target.value }))}
                                className="mt-1 block w-full rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-base outline-none dark:border-white/10 dark:bg-black/20" />
                            </label>
                          </div>
                          <label className="block text-[12.5px] text-slate-500">What was it?
                            <input value={draft.note || ''} onChange={ev => setDraft(d => ({ ...d, note: ev.target.value }))} placeholder={m.name}
                              className="mt-1 block w-full rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-base outline-none dark:border-white/10 dark:bg-black/20" />
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {CATEGORY_IDS.map(id => (
                              <button key={id} type="button" onClick={() => setDraft(d => ({ ...d, category: id }))} aria-pressed={draft.category === id}
                                className={cn('rounded-full px-2.5 py-1 text-[13px] font-semibold', draft.category === id ? 'text-slate-900' : 'bg-slate-900/5 text-slate-500 dark:bg-white/[.06] dark:text-slate-400')}
                                style={draft.category === id ? { background: CATEGORY_META[id].color } : undefined}>{CATEGORY_META[id].name}</button>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button type="button" onClick={saveEdit} disabled={!(draft.amount > 0)} className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-[14.5px] font-bold text-white disabled:opacity-40">Save</button>
                            <button type="button" onClick={() => remove([e], 'Deleted')} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[14.5px] font-semibold text-rose-500 hover:bg-rose-500/10"><Trash2 className="size-4" />Delete</button>
                            <button type="button" onClick={() => setOpen(null)} className="rounded-xl px-3 py-2.5 text-[14.5px] font-semibold text-slate-500">Cancel</button>
                          </div>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <footer className="border-t border-slate-900/[.06] bg-white/80 px-4 pb-[calc(12px+var(--sab))] pt-3 backdrop-blur dark:border-white/[.06] dark:bg-[#0b0d14]/80">
        <div className="mx-auto max-w-2xl">
          {confirm ? (
            <div className="animate-fade">
              <p className="text-center text-[14.5px] font-medium">{confirmText[confirm][0]}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={confirmText[confirm][1]} className="flex-1 rounded-xl bg-rose-500 py-3 text-[15px] font-bold text-white">Delete</button>
                <button type="button" onClick={() => setConfirm(null)} className="flex-1 rounded-xl bg-slate-900/5 py-3 text-[15px] font-semibold dark:bg-white/[.07]">Cancel</button>
              </div>
            </div>
          ) : selecting ? (
            <div className="flex gap-2">
              <button type="button" onClick={() => setPicked(picked.length === list.length ? [] : list.map(e => e.id))} className="rounded-xl bg-slate-900/5 px-4 py-3 text-[14.5px] font-semibold dark:bg-white/[.07]">{picked.length === list.length ? 'Select none' : 'Select all'}</button>
              <button type="button" disabled={!picked.length} onClick={() => setConfirm('picked')} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500 py-3 text-[15px] font-bold text-white disabled:opacity-30">
                <Trash2 className="size-4" />Delete{picked.length ? ` ${picked.length}` : ''}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 text-[14px]">
              <span className="hidden text-slate-500 sm:inline dark:text-slate-400">Tap an entry to change it.</span>
              <span className="ml-auto flex gap-1">
                <button type="button" disabled={!list.length} onClick={() => setConfirm('month')} className="rounded-lg px-2.5 py-2 font-semibold text-rose-500 hover:bg-rose-500/10 disabled:opacity-30">Clear month</button>
                <button type="button" disabled={!state.expenses.length} onClick={() => setConfirm('all')} className="rounded-lg px-2.5 py-2 font-semibold text-rose-500 hover:bg-rose-500/10 disabled:opacity-30">Clear all</button>
              </span>
            </div>
          )}
        </div>
      </footer>
    </div>
  )
}
