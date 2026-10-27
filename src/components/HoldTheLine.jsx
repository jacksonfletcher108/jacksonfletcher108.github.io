import { useEffect, useState } from 'react'
import { ExternalLink, Pause, Phone, Play, RotateCcw, Wind, Timer, LifeBuoy, Quote } from 'lucide-react'
import { Button, Modal, Progress } from './ui'
import { CRISIS, HELPLINES } from '../lib/habits'
import { allocate, money } from '../lib/money'
import { wishIcon } from '../lib/wishIcon'
import { cn } from '../lib/cn'

const TABS = [['breathe', 'Breathe', Wind], ['wait', 'Wait it out', Timer], ['help', 'Get help', LifeBuoy]]

export default function HoldTheLine({ open, onClose, state, t, onBeaten, onSlipped }) {
  const [tab, setTab] = useState('breathe')
  useEffect(() => { if (open) setTab('breathe') }, [open])
  if (!open) return null

  const slipCost = t.perDay // a slip costs about one day's worth
  const goals = allocate(state.wishes, t.pool, t.perDay).filter(w => !w.unlocked)
  const next = goals[0]
  const after = next && Math.max(0, next.got - slipCost)

  return (
    <Modal open={open} onClose={onClose} title="Hold the line." wide>
      <p className="-mt-2 text-[15px] leading-relaxed text-slate-300">Cravings come in waves. They build, peak, and pass, usually within 15 to 20 minutes. You don't have to beat it forever. Just this one.</p>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <Stat value={t.bestStreak.toLocaleString()} label={t.bestStreak === 1 ? 'day clean' : 'days clean'} />
        <Stat value={money(t.saved)} label="saved" accent />
        <Stat value={Math.floor(t.hours).toLocaleString()} label="hours back" />
      </div>

      {next ? (
        <div className="mt-3 rounded-2xl border border-amber-300/20 bg-amber-300/[.06] p-4">
          <div className="flex items-center gap-3">
            {(() => { const I = wishIcon(next.name); return <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-300/15 text-amber-200"><I className="size-5" /></span> })()}
            <p className="text-[14px] leading-snug text-amber-50/90">
              You're <b className="text-white">{Math.floor(next.pct * 100)}%</b> of the way to <b className="text-white">{next.name}</b>.
              One slip costs about <b className="tabular text-white">{money(slipCost)}</b>, pushes it back <b className="text-white">about a day</b> (often more), and resets your streak.
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[12px] text-slate-400">
            <span className="w-20 shrink-0">Now</span><Progress height="h-2" value={next.pct} className="flex-1" />
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-[12px] text-slate-400">
            <span className="w-20 shrink-0">If you slip</span><Progress height="h-2" value={after / next.price} color="from-amber-400 to-rose-400" className="flex-1" />
          </div>
          {goals.length > 1 && <p className="mt-2.5 text-[12px] text-slate-500">And behind it: {goals.slice(1, 4).map(g => g.name).join(', ')}.</p>}
        </div>
      ) : (
        <p className="mt-3 rounded-2xl bg-white/[.04] p-4 text-[14px] text-slate-300">One slip costs about <b className="text-white">{money(slipCost)}</b> and resets a <b className="text-white">{t.bestStreak}-day</b> streak. That's not worth it.</p>
      )}

      {state.why && (
        <blockquote className="mt-3 flex gap-3 rounded-2xl bg-emerald-400/[.06] p-4">
          <Quote className="size-5 shrink-0 text-emerald-300" />
          <div><p className="font-serif text-[17px] leading-snug text-white">{state.why}</p><p className="mt-1 text-[12px] text-slate-500">You wrote this for right now.</p></div>
        </blockquote>
      )}

      <div role="tablist" aria-label="Ways to get through it" className="mt-5 grid grid-cols-3 gap-1 rounded-2xl bg-black/25 p-1">
        {TABS.map(([id, label, I]) => (
          <button key={id} role="tab" type="button" aria-selected={tab === id} onClick={() => setTab(id)}
            className={cn('flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[13px] font-bold transition sm:text-[14px]', tab === id ? 'bg-white/[.12] text-white' : 'text-slate-400 hover:text-white')}>
            <I className="size-4 shrink-0" /> {label}
          </button>
        ))}
      </div>
      <div className="mt-3 min-h-64 rounded-2xl bg-black/15 p-4">
        {tab === 'breathe' && <Breathe />}
        {tab === 'wait' && <WaitItOut />}
        {tab === 'help' && <Help types={[...new Set(state.habits.map(h => h.type))]} />}
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
        <Button onClick={onBeaten} className="py-3.5 text-[16px]">I made it through</Button>
        <Button variant="quiet" onClick={onSlipped}>I slipped</Button>
      </div>
    </Modal>
  )
}

const Stat = ({ value, label, accent }) => (
  <div className="rounded-2xl bg-white/[.05] p-3 text-center">
    <p className={cn('tabular truncate text-[20px] font-extrabold tracking-tight sm:text-[24px]', accent && 'text-emerald-300')}>{value}</p>
    <p className="text-[12px] text-slate-400">{label}</p>
  </div>
)

/** Box breathing: in, hold, out, hold, four seconds each. */
const PHASES = [['Breathe in', 1], ['Hold', 1], ['Breathe out', 0.62], ['Hold', 0.62]]
function Breathe() {
  const [i, setI] = useState(-1)
  const [rounds, setRounds] = useState(0)
  useEffect(() => {
    const first = setTimeout(() => setI(0), 50)
    const iv = setInterval(() => setI(x => { if (x === 3) setRounds(r => r + 1); return (x + 1) % 4 }), 4000)
    return () => { clearTimeout(first); clearInterval(iv) }
  }, [])
  const [word, scale] = PHASES[Math.max(0, i)]
  return (
    <div className="flex flex-col items-center py-2 text-center">
      <div className="relative grid size-44 place-items-center">
        <div className="absolute inset-0 rounded-full border border-emerald-300/15" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/40 to-teal-500/30 shadow-[0_0_60px_-10px] shadow-emerald-400/50 transition-transform duration-[4000ms] ease-in-out"
          style={{ transform: `scale(${i < 0 ? 0.62 : scale})` }} />
        <p className="relative text-[18px] font-extrabold" aria-live="polite">{i < 0 ? 'Ready' : word}</p>
      </div>
      <p className="mt-4 text-[14px] text-slate-400">Follow the circle. Four seconds each way.{rounds > 0 && <> <b className="text-slate-200">{rounds} {rounds === 1 ? 'round' : 'rounds'}</b> done.</>}</p>
    </div>
  )
}

const WAIT = 15 * 60
const IDEAS = ['Drink a full glass of cold water', 'Walk around the block, or just outside', 'Text someone. Anything, it doesn\'t have to be about this', 'Change rooms. Cravings stick to places', 'Eat something, even small', 'Shower, or splash your face with cold water']
function WaitItOut() {
  const [left, setLeft] = useState(WAIT)
  const [running, setRunning] = useState(true)
  useEffect(() => {
    if (!running || left <= 0) return
    const end = Date.now() + left * 1000
    const iv = setInterval(() => setLeft(Math.max(0, Math.round((end - Date.now()) / 1000))), 250)
    return () => clearInterval(iv)
  }, [running]) // eslint-disable-line react-hooks/exhaustive-deps
  const done = left === 0
  const r = 52, c = 2 * Math.PI * r
  return (
    <div className="grid items-center gap-5 sm:grid-cols-[auto_1fr]">
      <div className="mx-auto flex flex-col items-center">
        <div className="relative size-36">
          <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r={r} fill="none" stroke="rgb(255 255 255 / .08)" strokeWidth="8" />
            <circle cx="60" cy="60" r={r} fill="none" stroke="url(#wg)" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (left / WAIT)} className="transition-[stroke-dashoffset] duration-300" />
            <defs><linearGradient id="wg"><stop offset="0" stopColor="#34d399" /><stop offset="1" stopColor="#2dd4bf" /></linearGradient></defs>
          </svg>
          <p className="tabular absolute inset-0 grid place-items-center text-[28px] font-extrabold" role="timer">{done ? 'Done' : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`}</p>
        </div>
        <div className="mt-3 flex gap-1.5">
          {!done && <Button variant="ghost" className="px-3 py-2 text-[13px]" onClick={() => setRunning(v => !v)}>{running ? <><Pause className="size-4" /> Pause</> : <><Play className="size-4" /> Resume</>}</Button>}
          <Button variant="quiet" className="px-3 py-2 text-[13px]" onClick={() => { setLeft(WAIT); setRunning(false); setTimeout(() => setRunning(true), 0) }}><RotateCcw className="size-4" /> Restart</Button>
        </div>
      </div>
      <div>
        <p className="text-[14px] font-semibold text-slate-200">{done ? 'You outlasted it. How do you feel?' : 'Give it 15 minutes before you decide anything. Meanwhile:'}</p>
        <ul className="mt-2 space-y-1.5 text-[14px] text-slate-400">
          {IDEAS.map(x => <li key={x} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-400/70" />{x}</li>)}
        </ul>
      </div>
    </div>
  )
}

function Help({ types }) {
  const seen = new Set()
  const lines = types.flatMap(t => HELPLINES[t] || HELPLINES.custom).filter(l => !seen.has(l.phone) && seen.add(l.phone))
  return (
    <div className="space-y-2">
      <p className="text-[14px] text-slate-400">Talking to someone helps more than willpower. These are free and confidential.</p>
      {[...lines, CRISIS].map(l => (
        <div key={l.phone} className="flex items-center gap-3 rounded-2xl bg-white/[.04] p-3.5">
          <div className="min-w-0 flex-1">
            <p className="font-bold">{l.name}</p>
            <p className="text-[13px] text-slate-400">{l.detail}</p>
          </div>
          {l.url && <a href={l.url} target="_blank" rel="noreferrer" aria-label={`${l.name} website`} className="grid size-10 shrink-0 place-items-center rounded-xl text-slate-400 hover:bg-white/[.07] hover:text-white"><ExternalLink className="size-4" /></a>}
          <a href={`tel:${l.phone.replace(/[^0-9]/g, '')}`} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-400/15 px-3 py-2 text-[14px] font-bold text-emerald-200 hover:bg-emerald-400/25"><Phone className="size-4" /> {l.display}</a>
        </div>
      ))}
    </div>
  )
}
