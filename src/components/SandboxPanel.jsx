import { useEffect, useState } from 'react'
import { Hammer, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { cn } from '../lib/cn'

const SEED = [
  { id: 'grocery', text: 'A shopping list that fills itself from Supper recipes', votes: 3, stage: 'Sketching' },
  { id: 'split', text: 'Splitting shared bills', votes: 2, stage: 'Idea' },
  { id: 'pantry', text: 'A pantry tracker that flags what to use up', votes: 2, stage: 'Idea' },
  { id: 'habits', text: 'A simple habit tracker for the home screen', votes: 1, stage: 'Idea' },
]
const STAGES = ['Idea', 'Sketching', 'Prototype']
const load = () => { try { return JSON.parse(localStorage.getItem('hub.ideas.v2')) || SEED } catch { return SEED } }

/** "Next up": a small idea board for picking what to build next. */
export default function SandboxPanel() {
  const [ideas, setIdeas] = useState(load)
  const [draft, setDraft] = useState('')
  const [voted, setVoted] = useState(() => { try { return JSON.parse(localStorage.getItem('hub.voted')) || [] } catch { return [] } })
  useEffect(() => { try { localStorage.setItem('hub.ideas.v2', JSON.stringify(ideas)); localStorage.setItem('hub.voted', JSON.stringify(voted)) } catch { /* storage blocked */ } }, [ideas, voted])

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
          <span className="grid size-12 place-items-center rounded-2xl bg-[#a993f5]/15 text-[#a993f5] text-fg"><Hammer className="size-6" /></span>
          <div>
            <p className="text-[13.5px] font-semibold text-[#a993f5]">Next up</p>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">What should I build next?</h2>
          </div>
        </div>
        <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-muted">
          Here's what I'm considering building next. Upvote the ones you'd actually use, or add your own idea. Votes are saved on your device.
        </p>

        <ul className="mt-8 space-y-2.5">
          {sorted.map((i, n) => (
            <li key={i.id} className="group flex items-center gap-3 rounded-2xl border border-white/[.07] bg-white/[.03] p-3 transition hover:border-white/15 animate-rise" style={{ animationDelay: `${n * 50}ms` }}>
              <button type="button" onClick={() => vote(i.id)} aria-pressed={voted.includes(i.id)} aria-label={`Upvote: ${i.text}`}
                className={cn('flex w-12 shrink-0 flex-col items-center rounded-xl py-1.5 transition active:scale-95',
                  voted.includes(i.id) ? 'bg-[#a993f5]/20 text-[#cbbdfb]' : 'bg-white/[.04] text-muted hover:text-fg')}>
                <ChevronUp className="size-4" strokeWidth={2.6} /><span className="tabular text-[13px] font-semibold">{i.votes}</span>
              </button>
              <p className="min-w-0 flex-1 text-[15px] leading-snug text-fg">{i.text}</p>
              <button type="button" onClick={() => cycle(i.id)} title="Move to the next stage"
                className={cn('shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold transition',
                  i.stage === 'Prototype' ? 'bg-emerald-400/15 text-emerald-300' : i.stage === 'Sketching' ? 'bg-amber-400/15 text-amber-300' : 'bg-white/[.06] text-muted')}>
                {i.stage}
              </button>
              <button type="button" onClick={() => setIdeas(list => list.filter(x => x.id !== i.id))} aria-label={`Remove: ${i.text}`}
                className="grid size-8 shrink-0 place-items-center rounded-lg text-faint transition hover:bg-rose-400/10 hover:text-rose-300 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100">
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={add} className="mt-4 flex gap-2">
          <label htmlFor="idea" className="sr-only">New idea</label>
          <input id="idea" value={draft} onChange={e => setDraft(e.target.value)} placeholder="Add an idea…"
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-[15px] text-fg outline-none transition placeholder:text-faint focus:border-violet-300/50 focus:ring-4 focus:ring-violet-400/15" />
          <button type="submit" disabled={!draft.trim()} className="inline-flex items-center gap-1.5 rounded-2xl bg-white px-4 font-semibold text-bg transition disabled:opacity-30">
            <Plus className="size-4" />Add
          </button>
        </form>
      </div>
    </div>
  )
}
