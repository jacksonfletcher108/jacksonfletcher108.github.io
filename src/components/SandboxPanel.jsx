import { useEffect, useState } from 'react'
import { Hammer, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { cn } from '../lib/cn'

const SEED = [
  { id: 'grocery', text: 'Shopping list that fills itself from Mise recipes', votes: 3, stage: 'Sketching' },
  { id: 'split', text: 'Split shared bills and see who owes what', votes: 2, stage: 'Idea' },
  { id: 'pantry', text: 'Pantry tracker with "use it up" reminders', votes: 2, stage: 'Idea' },
  { id: 'habits', text: 'Tiny habit tracker that lives on the home screen', votes: 1, stage: 'Idea' },
]
const STAGES = ['Idea', 'Sketching', 'Prototype']
const load = () => { try { return JSON.parse(localStorage.getItem('hub.ideas')) || SEED } catch { return SEED } }

/** "Next up": a small idea board for picking what to build next. */
export default function SandboxPanel() {
  const [ideas, setIdeas] = useState(load)
  const [draft, setDraft] = useState('')
  const [voted, setVoted] = useState(() => { try { return JSON.parse(localStorage.getItem('hub.voted')) || [] } catch { return [] } })
  useEffect(() => { try { localStorage.setItem('hub.ideas', JSON.stringify(ideas)); localStorage.setItem('hub.voted', JSON.stringify(voted)) } catch { /* storage blocked */ } }, [ideas, voted])

  const sorted = [...ideas].sort((a, b) => b.votes - a.votes)
  const vote = id => {
    const on = voted.includes(id)
    setVoted(v => (on ? v.filter(x => x !== id) : [...v, id]))
    setIdeas(list => list.map(i => (i.id === id ? { ...i, votes: i.votes + (on ? -1 : 1) } : i)))
  }
  const cycle = id => setIdeas(list => list.map(i => (i.id === id ? { ...i, stage: STAGES[(STAGES.indexOf(i.stage) + 1) % STAGES.length] } : i)))
  const add = e => {
    e.preventDefault()
    const text = draft.trim(); if (!text) return
    setIdeas(list => [...list, { id: Math.random().toString(36).slice(2, 9), text, votes: 0, stage: 'Idea' }])
    setDraft('')
  }

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-5 py-10 sm:py-14">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-400 to-pink-400 text-white"><Hammer className="size-6" /></span>
          <div>
            <p className="text-[13.5px] font-semibold text-violet-300">Next up</p>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white">What should I build next?</h2>
          </div>
        </div>
        <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-slate-400">
          Here's what I'm considering building next. Upvote the ones you'd actually use, or add your own idea. Votes are saved on your device.
        </p>

        <ul className="mt-8 space-y-2.5">
          {sorted.map((i, n) => (
            <li key={i.id} className="group flex items-center gap-3 rounded-2xl border border-white/[.07] bg-white/[.03] p-3 transition hover:border-white/15 animate-rise" style={{ animationDelay: `${n * 50}ms` }}>
              <button type="button" onClick={() => vote(i.id)} aria-pressed={voted.includes(i.id)} aria-label={`Upvote: ${i.text}`}
                className={cn('flex w-12 shrink-0 flex-col items-center rounded-xl py-1.5 transition active:scale-95',
                  voted.includes(i.id) ? 'bg-violet-400/20 text-violet-200' : 'bg-white/[.04] text-slate-400 hover:text-white')}>
                <ChevronUp className="size-4" strokeWidth={2.6} /><span className="tabular text-[13px] font-semibold">{i.votes}</span>
              </button>
              <p className="min-w-0 flex-1 text-[15px] leading-snug text-slate-200">{i.text}</p>
              <button type="button" onClick={() => cycle(i.id)} title="Move to the next stage"
                className={cn('shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold transition',
                  i.stage === 'Prototype' ? 'bg-emerald-400/15 text-emerald-300' : i.stage === 'Sketching' ? 'bg-amber-400/15 text-amber-300' : 'bg-white/[.06] text-slate-400')}>
                {i.stage}
              </button>
              <button type="button" onClick={() => setIdeas(list => list.filter(x => x.id !== i.id))} aria-label={`Remove: ${i.text}`}
                className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-rose-400/10 hover:text-rose-300 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100">
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={add} className="mt-4 flex gap-2">
          <label htmlFor="idea" className="sr-only">New idea</label>
          <input id="idea" value={draft} onChange={e => setDraft(e.target.value)} placeholder="Add an idea…"
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-[15px] text-white outline-none transition placeholder:text-slate-500 focus:border-violet-300/50 focus:ring-4 focus:ring-violet-400/15" />
          <button type="submit" disabled={!draft.trim()} className="inline-flex items-center gap-1.5 rounded-2xl bg-white px-4 font-semibold text-slate-900 transition disabled:opacity-30">
            <Plus className="size-4" />Add
          </button>
        </form>
      </div>
    </div>
  )
}
