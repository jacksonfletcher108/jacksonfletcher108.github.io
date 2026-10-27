import { useState } from 'react'
import { X, Nfc } from 'lucide-react'
import { APPS, TOOLS } from '../data/apps'
import { cn } from '../lib/cn'
import { useModalBehavior } from '../hooks/useModalBehavior'
import NfcGuide from './NfcGuide'

const WHERE = [...APPS.filter(a => a.status === 'live').map(a => ({ id: a.id, name: a.short, color: a.color })), { id: 'hub', name: 'This page', color: '#1f2b26' }]

/** Slide-over: what I use to make these, plus a switch to the fridge-tag guide. */
export default function TechDrawer({ open, onClose, initialTool, initialNfc = false }) {
  const ref = useModalBehavior(open, onClose)
  const [filter, setFilter] = useState('all')
  const [nfc, setNfc] = useState(initialNfc)
  if (!open) return null
  const rows = TOOLS.filter(t => filter === 'all' || t.used.includes(filter))
  return (
    <div ref={ref} className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="tools-title">
      <div className="absolute inset-0 bg-[#1f2b26]/40 backdrop-blur-[2px] animate-fade" onClick={onClose} />
      <aside className="paper absolute inset-y-0 right-0 flex w-full max-w-md flex-col [animation:slide_.4s_cubic-bezier(.2,1,.3,1)_both]">
        <style>{'@keyframes slide{from{transform:translateX(100%)}to{transform:none}}'}</style>
        <div className="flex items-center gap-3 px-6 pb-3 pt-[calc(20px+env(safe-area-inset-top))]">
          <div className="min-w-0 flex-1">
            <p className="hand text-[22px] leading-none text-pencil">behind the scenes</p>
            <h2 id="tools-title" className="mt-1 font-display text-[26px] font-extrabold tracking-tight">How I build these</h2>
          </div>
          <button type="button" data-autofocus onClick={onClose} aria-label="Close" className="grid size-10 place-items-center rounded-full text-pencil transition hover:bg-ink/[.06] hover:text-ink"><X className="size-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-[calc(24px+env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3 rounded-2xl bg-[#e8962e]/10 p-3.5">
            <Nfc className="size-5 text-[#b4690f]" />
            <span id="nfc-switch" className="flex-1 text-[14.5px] font-semibold">Show the fridge-tag guide</span>
            <button type="button" role="switch" aria-checked={nfc} aria-labelledby="nfc-switch" onClick={() => setNfc(v => !v)}
              className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors', nfc ? 'bg-[#e8962e]' : 'bg-ink/15')}>
              <span className={cn('absolute top-0.5 size-6 rounded-full bg-white shadow transition-all', nfc ? 'left-[22px]' : 'left-0.5')} />
            </button>
          </div>

          {nfc ? <div className="mt-5 animate-fade"><NfcGuide /></div> : (
            <div className="animate-fade">
              <p className="mt-5 text-[15px] leading-relaxed text-pencil">
                Everything here is a plain website: no app store, no accounts, no servers to pay for. Here's what goes into them.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Show tools for">
                {[{ id: 'all', name: 'Everything', color: '#1f2b26' }, ...WHERE].map(p => (
                  <button key={p.id} type="button" onClick={() => setFilter(p.id)} aria-pressed={filter === p.id}
                    className={cn('rounded-full px-3 py-1.5 text-[13px] font-semibold transition', filter === p.id ? 'text-white' : 'bg-ink/[.05] text-pencil hover:text-ink')}
                    style={filter === p.id ? { background: p.color } : undefined}>{p.name}</button>
                ))}
              </div>
              <ul className="mt-4 space-y-2.5">
                {rows.map(t => (
                  <li key={t.id} className={cn('rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgb(31_43_38/.08)] animate-pop', initialTool === t.id && 'ring-2 ring-[#e5484d]/50')}>
                    <p className="text-[16px] font-bold">{t.name}</p>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-pencil">{t.what}</p>
                    <p className="mt-2.5 flex flex-wrap gap-1.5">
                      {WHERE.filter(w => t.used.includes(w.id)).map(w => (
                        <span key={w.id} className="hand rounded-full px-2 text-[18px] leading-snug" style={{ color: w.color, background: `${w.color}14` }}>{w.name}</span>
                      ))}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
