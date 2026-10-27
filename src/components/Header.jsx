import { Layers } from 'lucide-react'
import { useClock } from '../hooks/useClock'

export default function Header({ liveCount, buildingCount, onStack }) {
  const now = useClock()
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })
  const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  return (
    <header className="sticky top-0 z-30 pt-[env(safe-area-inset-top)]">
      <div className="mx-auto mt-3 flex max-w-6xl items-center gap-3 px-4 sm:px-6">
        <div className="glass flex w-full items-center gap-3 rounded-2xl py-2 pl-2.5 pr-2 sm:gap-4">
          <a href="#" className="flex items-center gap-2.5 rounded-xl pr-1" aria-label="App Hub home">
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="size-9 rounded-xl" />
            <span className="hidden leading-none sm:block">
              <span className="block font-display text-[15px] font-bold tracking-tight text-white">Jackson Fletcher</span>
              <span className="mt-1 block text-[11.5px] font-medium text-slate-400">Apps</span>
            </span>
          </a>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="hidden text-right leading-none md:block" aria-label="Current time">
              <p className="tabular text-[13.5px] font-semibold text-white">{time}</p>
              <p className="mt-1 text-[11px] text-slate-400">{date}</p>
            </div>
            <p className="tabular text-[13.5px] font-semibold text-white md:hidden">{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
            <span className="hidden h-7 w-px bg-white/10 sm:block" />
            <span className="flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[12px] font-semibold text-emerald-300">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              {liveCount} live<span className="hidden text-emerald-300/60 sm:inline"> · {buildingCount} in progress</span>
            </span>
            <button type="button" onClick={onStack}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-semibold text-slate-300 transition hover:bg-white/[.07] hover:text-white">
              <Layers className="size-4" /><span className="hidden sm:inline">How they're built</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
