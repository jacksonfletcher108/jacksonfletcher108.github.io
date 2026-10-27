import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Check, CalendarDays, Trash2 } from 'lucide-react'
import { CATEGORY_IDS, CATEGORY_META } from '../lib/budget'
import { money, todayISO, cn } from '../lib/utils'

const QUICK = [5, 10, 20, 50]

/** Bottom sheet on phones, centered dialog on desktop. Amount → category → done. */
export default function ExpenseModal({ open, onClose, onSave, onDelete, editing, presetCategory, lastCategory, recentNotes, s }) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(lastCategory || 'food')
  const [note, setNote] = useState('')
  const [when, setWhen] = useState('today')
  const [date, setDate] = useState(todayISO())
  const amountRef = useRef(null)

  useEffect(() => {
    if (!open) return
    if (editing) {
      const y = new Date(); y.setDate(y.getDate() - 1)
      const yISO = new Date(y.getTime() - y.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
      setAmount(String(editing.amount)); setNote(editing.note || ''); setCategory(editing.category); setDate(editing.date)
      setWhen(editing.date === todayISO() ? 'today' : editing.date === yISO ? 'yesterday' : 'other')
    } else {
      setAmount(''); setNote(''); setWhen('today'); setDate(todayISO()); setCategory(presetCategory || lastCategory || 'food')
    }
    const t = setTimeout(() => amountRef.current?.focus(), 60)
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); document.documentElement.style.overflow = '' }
  }, [open, lastCategory, presetCategory, editing, onClose])

  const value = parseFloat(amount) || 0
  const c = s.byCat[category]
  // spending money left in a category (bills don't count), giving back this entry's old amount when editing
  const leftIn = id => { const x = s.byCat[id]; return x.budget - x.logged + (editing && editing.category === id ? editing.amount : 0) }
  const leftAfter = leftIn(category) - value
  const suggestions = useMemo(() => (recentNotes[category] || []).slice(0, 4), [recentNotes, category])

  if (!open) return null

  const pickDate = () => {
    if (when === 'today') return todayISO()
    if (when === 'yesterday') { const d = new Date(); d.setDate(d.getDate() - 1); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10) }
    return date
  }
  const submit = e => {
    e?.preventDefault()
    if (value <= 0) { amountRef.current?.focus(); return }
    onSave({ amount: Math.round(value * 100) / 100, category, note: note.trim(), date: pickDate() })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="add-title">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm animate-fade" onClick={onClose} />
      <form onSubmit={submit} onKeyDown={e => { if (e.key === 'Enter' && e.target.type !== 'date' && !e.target.closest('[aria-label="Close"]')) { e.preventDefault(); submit() } }}
        className="relative w-full max-w-md rounded-t-[28px] border border-slate-900/10 bg-white/95 p-5 pb-[calc(20px+var(--sab))] shadow-2xl backdrop-blur-2xl animate-pop sm:rounded-[28px] sm:pb-5 dark:border-white/10 dark:bg-[#121522]/95">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-900/15 sm:hidden dark:bg-white/15" />
        <div className="flex items-center justify-between">
          <h2 id="add-title" className="text-[17px] font-bold">{editing ? 'Edit spending' : 'Add spending'}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-900/5 hover:text-slate-900 dark:hover:bg-white/[.07] dark:hover:text-white"><X className="size-5" /></button>
        </div>

        {/* amount */}
        <label className="mt-4 flex items-center justify-center gap-1 py-2">
          <span className="text-4xl font-bold text-slate-400" aria-hidden="true">$</span>
          <input ref={amountRef} type="number" inputMode="decimal" step="0.01" min="0" placeholder="0" value={amount} aria-label="Amount"
            onChange={e => setAmount(e.target.value)}
            style={{ width: `${Math.min(9, Math.max(1, amount.length)) + 0.6}ch` }}
            className="tabular min-w-0 bg-transparent text-left text-5xl font-extrabold tracking-tight outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600" />
        </label>
        <div className="flex justify-center gap-2">
          {QUICK.map(q => (
            <button key={q} type="button" onClick={() => setAmount(a => String(Math.round(((parseFloat(a) || 0) + q) * 100) / 100))}
              className="tabular rounded-full border border-slate-900/10 px-3 py-1 text-[13px] font-semibold text-slate-600 transition hover:border-emerald-400 hover:text-emerald-600 active:scale-95 dark:border-white/10 dark:text-slate-300 dark:hover:text-emerald-400">+{q}</button>
          ))}
        </div>

        {/* category */}
        <div className="mt-5 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Category">
          {CATEGORY_IDS.map(id => {
            const m = CATEGORY_META[id], on = category === id
            return (
              <button key={id} type="button" role="radio" aria-checked={on} onClick={() => setCategory(id)}
                className={cn('flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-[12px] font-semibold transition active:scale-95',
                  on ? 'shadow-lg' : 'border-slate-900/[.07] text-slate-500 hover:border-slate-900/20 dark:border-white/[.07] dark:text-slate-400 dark:hover:border-white/20')}
                style={on ? { borderColor: m.color, background: `${m.color}1f`, color: m.color, boxShadow: `0 8px 24px -10px ${m.color}` } : undefined}>
                <m.icon className="size-5" />{m.name}
                <span className="tabular -mt-1 text-[11px] font-medium opacity-70">{id === 'savings' ? 'put aside' : s.byCat[id].budget === 0 && s.byCat[id].logged === 0 ? 'bills only' : leftIn(id) >= 0 ? `${money(leftIn(id))} left` : `${money(-leftIn(id))} over`}</span>
              </button>
            )
          })}
        </div>

        {/* note + date */}
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="What was it? (optional)" aria-label="Note"
          className="mt-4 w-full rounded-xl border border-slate-900/10 bg-white/70 px-3.5 py-2.5 text-base outline-none transition focus:border-emerald-400/70 focus:ring-4 focus:ring-emerald-400/15 dark:border-white/10 dark:bg-black/20" />
        {suggestions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {suggestions.map(n => <button key={n} type="button" onClick={() => setNote(n)} className="rounded-full bg-slate-900/5 px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:bg-slate-900/10 dark:bg-white/[.06] dark:text-slate-300 dark:hover:bg-white/[.1]">{n}</button>)}
          </div>
        )}
        <div className="mt-3 flex items-center gap-1.5">
          <CalendarDays className="mr-1 size-4 text-slate-400" />
          {['today', 'yesterday', 'other'].map(w => (
            <button key={w} type="button" onClick={() => setWhen(w)} aria-pressed={when === w}
              className={cn('rounded-full px-3 py-1 text-[12px] font-semibold capitalize transition', when === w ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:bg-slate-900/5 dark:text-slate-400 dark:hover:bg-white/[.06]')}>{w === 'other' ? 'Pick date' : w}</button>
          ))}
          {when === 'other' && <input type="date" value={date} max={todayISO()} onChange={e => setDate(e.target.value)} aria-label="Date"
            className="ml-auto rounded-lg border border-slate-900/10 bg-transparent px-2 py-1 text-base dark:border-white/10" />}
        </div>

        <p className={cn('mt-4 text-center text-[13px]', leftAfter < 0 && category !== 'savings' ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400')}>
          {category === 'savings' ? `This also counts toward your goal.`
            : leftAfter >= 0 ? `${money(leftAfter)} left in ${c.name} after this` : `This puts ${c.name} ${money(-leftAfter)} over budget`}
        </p>
        <button type="submit" disabled={value <= 0}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 py-3.5 text-[15px] font-bold text-emerald-950 shadow-lg shadow-emerald-500/25 transition active:scale-[.98] disabled:opacity-40">
          <Check className="size-5" />{value <= 0 ? 'Enter an amount' : editing ? 'Save changes' : category === 'savings' ? `Put ${money(value, true)} in savings` : `Add ${money(value, true)} to ${c.name}`}
        </button>
        {editing && (
          <button type="button" onClick={() => onDelete(editing)} className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-[15px] font-semibold text-rose-500 transition hover:bg-rose-500/10">
            <Trash2 className="size-4" />Delete
          </button>
        )}
      </form>
    </div>
  )
}
