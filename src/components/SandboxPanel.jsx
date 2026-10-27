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

/** The sandbox's placeholder: a small idea board that decides what gets built next. */
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
    <div className="absolute inset-0 overflow-y-auto bg-[#fbfaf5]">
      <div className="mx-auto max-w-2xl px-5 py-10 sm:py-14">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-[#7c5cd6] text-white"><Hammer className="size-6" /></span>
          <div>
            <p className="hand text-[22px] leading-none text-[#7c5cd6]">on the workbench</p>
            <h2 className="mt-1 font-display text-[28px] font-extrabold tracking-tight text-ink">What should I make next?</h2>
          </div>
        </div>
        <p className="mt-4 max-w-[56ch] text-[16px] leading-relaxed text-pencil">
          Here's my short list. Upvote the ones you'd actually use, or add your own idea. Votes stay on your phone.
        </p>

        <ul className="mt-8 space-y-2.5">
          {sorted.map((i, n) => (
            <li key={i.id} className="group flex items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_1px_2px_rgb(31_43_38/.08),0_6px_16px_-10px_rgb(31_43_38/.3)] transition hover:-translate-y-px animate-pop" style={{ animationDelay: `${n * 50}ms` }}>
              <button type="button" onClick={() => vote(i.id)} aria-pressed={voted.includes(i.id)} aria-label={`Upvote: ${i.text}`}
                className={cn('flex w-12 shrink-0 flex-col items-center rounded-xl py-1.5 transition active:scale-95',
                  voted.includes(i.id) ? 'bg-[#7c5cd6] text-white' : 'bg-ink/[.05] text-pencil hover:text-ink')}>
                <ChevronUp className="size-4" strokeWidth={2.6} /><span className="tabular text-[14px] font-bold">{i.votes}</span>
              </button>
              <p className="min-w-0 flex-1 text-[15.5px] leading-snug text-ink">{i.text}</p>
              <button type="button" onClick={() => cycle(i.id)} title="Move to the next stage"
                className={cn('hand shrink-0 rounded-full px-2.5 py-0.5 text-[18px] leading-tight transition',
                  i.stage === 'Prototype' ? 'bg-[#2f8f6f]/12 text-[#226b53]' : i.stage === 'Sketching' ? 'bg-[#e8962e]/15 text-[#a3610f]' : 'bg-ink/[.05] text-pencil')}>
                {i.stage}
              </button>
              <button type="button" onClick={() => setIdeas(list => list.filter(x => x.id !== i.id))} aria-label={`Remove: ${i.text}`}
                className="grid size-8 shrink-0 place-items-center rounded-lg text-pencil/60 transition hover:bg-rose-500/10 hover:text-rose-600 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100">
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={add} className="mt-4 flex gap-2">
          <label htmlFor="idea" className="sr-only">New idea</label>
          <input id="idea" value={draft} onChange={e => setDraft(e.target.value)} placeholder="Add an idea…"
            className="min-w-0 flex-1 rounded-full border-2 border-ink/10 bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-pencil/60 focus:border-[#7c5cd6]/60 focus:ring-4 focus:ring-[#7c5cd6]/15" />
          <button type="submit" disabled={!draft.trim()} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 font-semibold text-white transition disabled:opacity-30">
            <Plus className="size-4" />Add
          </button>
        </form>
      </div>
    </div>
  )
}
