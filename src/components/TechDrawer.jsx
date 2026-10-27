import { useState } from 'react'
import { X, Layers, ChevronDown, Nfc } from 'lucide-react'
import { APPS, TECH } from '../data/apps'
import { cn } from '../lib/cn'
import { useModalBehavior } from '../hooks/useModalBehavior'
import NfcGuide from './NfcGuide'

const PROJECTS = [...APPS.filter(a => a.status === 'live').map(a => ({ id: a.id, name: a.short, color: a.accent })), { id: 'hub', name: 'This page', color: '#67e8f9' }]

export default function TechDrawer({ open, onClose, initialTech, initialNfc = false }) {
  const ref = useModalBehavior(open, onClose)
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(initialTech || 'react')
  const [nfc, setNfc] = useState(initialNfc)
  if (!open) return null
  const rows = TECH.filter(t => filter === 'all' || t.used.includes(filter))

  return (
    <div ref={ref} className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="stack-title">
      <div className="absolute inset-0 bg-[#05060a]/60 backdrop-blur-sm animate-fade" onClick={onClose} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-white/10 bg-[#0d0f17]/95 shadow-2xl backdrop-blur-2xl [animation:slide_.45s_cubic-bezier(.16,1,.3,1)_both]">
        <style>{'@keyframes slide{from{transform:translateX(100%)}to{transform:none}}'}</style>
        <div className="flex items-center gap-3 border-b border-white/[.07] px-5 pb-4 pt-[calc(16px+env(safe-area-inset-top))]">
          <span className="grid size-10 place-items-center rounded-xl bg-white/[.06] text-cyan-200"><Layers className="size-5" /></span>
          <div className="min-w-0 flex-1">
            <h2 id="stack-title" className="font-display text-[18px] font-semibold text-white">How they're built</h2>
            <p className="text-[13px] text-slate-400">The tools behind each app</p>
          </div>
          <button type="button" data-autofocus onClick={onClose} aria-label="Close" className="grid size-10 place-items-center rounded-xl text-slate-400 transition hover:bg-white/[.08] hover:text-white"><X className="size-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 pb-[calc(20px+env(safe-area-inset-bottom))]">
          {/* NFC quick toggle */}
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-amber-300/15 bg-amber-300/[.05] p-3.5">
            <Nfc className="size-5 text-amber-300" />
            <span className="flex-1 text-[14px] font-semibold text-white">Show the fridge tag guide</span>
            <button type="button" role="switch" aria-checked={nfc} onClick={() => setNfc(v => !v)}
              className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', nfc ? 'bg-amber-400' : 'bg-white/15')}>
              <span className={cn('absolute top-0.5 size-5 rounded-full bg-white shadow transition-all', nfc ? 'left-[22px]' : 'left-0.5')} />
            </button>
          </label>

          {nfc ? (
            <div className="mt-5 animate-fade"><NfcGuide compact /></div>
          ) : (
            <div className="animate-fade">
              <div className="mt-5 flex flex-wrap gap-1.5" role="group" aria-label="Filter by project">
                {[{ id: 'all', name: 'All', color: '#e2e8f0' }, ...PROJECTS].map(p => (
                  <button key={p.id} type="button" onClick={() => setFilter(p.id)} aria-pressed={filter === p.id}
                    className={cn('rounded-full border px-3 py-1 text-[12.5px] font-semibold transition',
                      filter === p.id ? 'border-transparent text-slate-900' : 'border-white/10 text-slate-400 hover:text-white')}
                    style={filter === p.id ? { background: p.color } : undefined}>{p.name}</button>
                ))}
              </div>

              <ul className="mt-4 space-y-2">
                {rows.map(t => {
                  const open = expanded === t.id
                  return (
                    <li key={t.id} className={cn('overflow-hidden rounded-2xl border transition-colors', open ? 'border-white/15 bg-white/[.05]' : 'border-white/[.06] bg-white/[.02] hover:border-white/12')}>
                      <button type="button" onClick={() => setExpanded(open ? null : t.id)} aria-expanded={open} className="flex w-full items-center gap-3 p-3.5 text-left">
                        <span className="size-2.5 shrink-0 rounded-full" style={{ background: t.color, boxShadow: `0 0 12px ${t.color}` }} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15px] font-semibold text-white">{t.name}</span>
                          <span className="block text-[12.5px] text-slate-400">{t.role}</span>
                        </span>
                        <span className="tabular text-[12px] text-slate-500">{t.used.length}/{PROJECTS.length}</span>
                        <ChevronDown className={cn('size-4 text-slate-500 transition-transform', open && 'rotate-180')} />
                      </button>
                      {open && (
                        <div className="px-3.5 pb-4 animate-fade">
                          <p className="text-[14px] leading-relaxed text-slate-300">{t.detail}</p>
                          {/* usage bar: one segment per project */}
                          <div className="mt-3 flex gap-1">
                            {PROJECTS.map(p => (
                              <span key={p.id} title={p.name} className="h-1.5 flex-1 rounded-full transition-colors"
                                style={{ background: t.used.includes(p.id) ? p.color : 'rgb(255 255 255 / .08)' }} />
                            ))}
                          </div>
                          <p className="mt-2 flex flex-wrap gap-x-3 text-[12px] text-slate-500">
                            {PROJECTS.filter(p => t.used.includes(p.id)).map(p => <span key={p.id}>{p.name}</span>)}
                          </p>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
