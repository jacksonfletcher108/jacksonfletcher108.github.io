import { Wrench } from 'lucide-react'
import { useClock } from '../hooks/useClock'

/** Top strip: my name tag, a fridge-style clock display, and how many apps are up. */
export default function Header({ liveCount, onTools }) {
  const now = useClock()
  const h = now.getHours() % 12 || 12, m = String(now.getMinutes()).padStart(2, '0')
  const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  return (
    <header className="relative z-20 mx-auto flex max-w-6xl items-center gap-3 px-4 pt-[calc(16px+env(safe-area-inset-top))] sm:px-6">
      <a href="#" className="group flex items-center gap-2.5" aria-label="Jackson's Apps, home">
        <span className="grid size-10 place-items-center rounded-full bg-[#e5484d] font-display text-[15px] font-extrabold text-white shadow-[inset_0_-3px_4px_rgb(0_0_0/.25),0_4px_8px_rgb(31_43_38/.3)] transition-transform group-hover:-rotate-12">JF</span>
        <span className="font-display text-[19px] font-extrabold tracking-tight">jackson's apps</span>
      </a>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* looks like the little display on a fridge door */}
        <div className="flex items-center gap-2.5 rounded-xl border border-black/20 bg-[#17201c] px-3 py-1.5 shadow-[inset_0_2px_6px_rgb(0_0_0/.5)]" aria-label={`It's ${h}:${m}, ${date}`}>
          <span className="tabular font-mono text-[17px] font-semibold leading-none tracking-wider text-[#8ff0c4] [text-shadow:0_0_8px_rgb(143_240_196/.6)]">
            {h}<span className="animate-pulse">:</span>{m}
          </span>
          <span className="hidden font-mono text-[10.5px] uppercase leading-none tracking-wider text-[#8ff0c4]/60 sm:block">{date}</span>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[13px] font-semibold text-ink shadow-sm sm:flex">
          <span className="size-2 rounded-full bg-[#2f8f6f]" />{liveCount} apps up and running
        </span>
        <button type="button" onClick={onTools} aria-label="How I build these"
          className="grid size-10 place-items-center rounded-full bg-white/70 text-ink shadow-sm transition hover:-rotate-12 hover:bg-white sm:size-auto sm:px-3.5 sm:py-2 sm:text-[13px] sm:font-semibold">
          <Wrench className="size-4 sm:hidden" /><span className="hidden sm:inline">How I build these</span>
        </button>
      </div>
    </header>
  )
}
