import { Settings, ShieldHalf } from 'lucide-react'
import { Logo } from './Onboarding'

export default function Header({ onSettings, onHold }) {
  return (
    <header className="flex items-center gap-3 pt-[calc(16px+var(--sat))]">
      <Logo />
      <span className="text-[17px] font-extrabold tracking-tight">Habit Saver</span>
      <div className="ml-auto flex items-center gap-1.5">
        <button type="button" onClick={onHold}
          className="hidden items-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 px-4 py-2.5 text-[14px] font-extrabold text-emerald-950 shadow-lg shadow-emerald-500/20 transition hover:brightness-105 active:scale-[.98] sm:inline-flex">
          <ShieldHalf className="size-4" /> Craving? Hold the line
        </button>
        <button type="button" onClick={onSettings} aria-label="Settings" className="grid size-11 place-items-center rounded-2xl text-slate-400 transition hover:bg-white/[.07] hover:text-white"><Settings className="size-5" /></button>
      </div>
    </header>
  )
}
