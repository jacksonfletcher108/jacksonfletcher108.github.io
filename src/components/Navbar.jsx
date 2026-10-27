import { useEffect, useRef, useState } from 'react'
import { LayoutDashboard, SlidersHorizontal, FlaskConical, Moon, Sun, MoreHorizontal, RotateCcw, Eraser, Plus } from 'lucide-react'
import { cn } from '../lib/utils'

export const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'plan', label: 'Plan', icon: SlidersHorizontal },
  { id: 'whatif', label: 'What-If', icon: FlaskConical },
]

export default function Navbar({ tab, onTab, theme, onTheme, monthLabel, onReset, onSample, onAdd }) {
  const [menu, setMenu] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!menu) return
    const close = e => { if (!ref.current?.contains(e.target)) setMenu(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [menu])

  return (
    <>
      <header className="sticky top-0 z-30 pt-[var(--sat)] border-b border-slate-900/[.06] bg-slate-50/70 backdrop-blur-xl dark:border-white/[.06] dark:bg-[#0b0d14]/70">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="size-8 rounded-[10px] shadow-lg shadow-indigo-500/20" />
            <div className="leading-none">
              <p className="text-[17px] font-extrabold tracking-tight">Tally</p>
              <p className="mt-1 text-[12px] font-medium text-slate-500 dark:text-slate-400">{monthLabel}</p>
            </div>
          </div>

          <nav className="mx-auto hidden rounded-2xl border border-slate-900/[.07] bg-white/60 p-1 md:flex dark:border-white/[.07] dark:bg-white/[.03]" aria-label="Sections">
            {TABS.map(t => (
              <button key={t.id} type="button" onClick={() => onTab(t.id)} aria-current={tab === t.id ? 'page' : undefined}
                className={cn('flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                  tab === t.id ? 'bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white')}>
                <t.icon className="size-4" />{t.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 md:ml-0">
            <button type="button" onClick={onTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="grid size-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[.07] dark:hover:text-white">
              {theme === 'dark' ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
            </button>
            <div className="relative" ref={ref}>
              <button type="button" onClick={() => setMenu(m => !m)} aria-label="More options" aria-expanded={menu}
                className="grid size-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[.07] dark:hover:text-white">
                <MoreHorizontal className="size-[18px]" />
              </button>
              {menu && (
                <div className="glass absolute right-0 top-12 z-40 w-56 rounded-2xl p-1.5 animate-pop bg-white/95 dark:bg-[#151826]/95">
                  <button type="button" onClick={() => { setMenu(false); onSample() }} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-slate-900/5 dark:hover:bg-white/[.06]">
                    <RotateCcw className="size-4 text-slate-400" />Load sample month
                  </button>
                  <button type="button" onClick={() => { setMenu(false); onReset() }} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-500 hover:bg-rose-500/10">
                    <Eraser className="size-4" />Start fresh
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* phone tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-900/[.06] bg-white/80 pb-[var(--sab)] backdrop-blur-xl md:hidden dark:border-white/[.06] dark:bg-[#0b0d14]/80" aria-label="Sections">
        <div className="mx-auto grid max-w-md grid-cols-4">
          {TABS.map(t => (
            <button key={t.id} type="button" onClick={() => onTab(t.id)} aria-current={tab === t.id ? 'page' : undefined}
              className={cn('flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition', tab === t.id ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400')}>
              <t.icon className="size-5" strokeWidth={tab === t.id ? 2.4 : 2} />{t.label}
            </button>
          ))}
          <button type="button" onClick={onAdd} className="flex flex-col items-center gap-1 py-2 text-[11px] font-semibold text-slate-500 dark:text-slate-300">
            <span className="grid size-7 place-items-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/30"><Plus className="size-4" strokeWidth={2.8} /></span>Add
          </button>
        </div>
      </nav>
    </>
  )
}
