import { useEffect, useState } from 'react'
import { X, RotateCw, ArrowUpRight, Lock, Info } from 'lucide-react'
import { APPS } from '../data/apps'
import { cn } from '../lib/cn'
import { useModalBehavior } from '../hooks/useModalBehavior'
import SandboxPanel from './SandboxPanel'

/** A browser-style window that runs any app inside the hub. Tabs switch apps without closing. */
export default function AppModal({ appId, onClose, onSwitch }) {
  const app = APPS.find(a => a.id === appId)
  const ref = useModalBehavior(!!app, onClose)
  const [loaded, setLoaded] = useState(false)
  const [slow, setSlow] = useState(false)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    setLoaded(false); setSlow(false)
    if (!app?.url) return
    const t = setTimeout(() => setSlow(true), 9000)
    return () => clearTimeout(t)
  }, [appId, nonce, app?.url])

  if (!app) return null
  const Icon = app.icon
  const host = app.url ? app.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'local · sandbox'

  return (
    <div ref={ref} className="fixed inset-0 z-50 flex items-stretch justify-center sm:p-5 lg:p-8" role="dialog" aria-modal="true" aria-label={app.name}>
      <div className="absolute inset-0 bg-[#05060a]/75 backdrop-blur-md animate-fade" onClick={onClose} />
      <div className="relative flex w-full max-w-[1400px] flex-col overflow-hidden border-white/10 bg-[#0d0f17] shadow-[0_50px_120px_-30px_rgb(0_0_0/.9)] animate-pop sm:rounded-[26px] sm:border"
        style={{ '--glow': app.glow }}>
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-white/[.07] bg-white/[.025] px-3 pb-2.5 pt-[calc(10px+env(safe-area-inset-top))] sm:px-4 sm:pt-2.5">
          <div className="mr-1 hidden gap-1.5 lg:flex" aria-hidden="true">
            <span className="size-3 rounded-full bg-[#ff5f57]" /><span className="size-3 rounded-full bg-[#febc2e]" /><span className="size-3 rounded-full bg-[#28c840]" />
          </div>
          {/* app tabs */}
          <nav className="flex min-w-0 gap-1 overflow-x-auto [scrollbar-width:none]" aria-label="Switch app">
            {APPS.map(a => (
              <button key={a.id} type="button" onClick={() => onSwitch(a.id)} aria-current={a.id === app.id ? 'page' : undefined}
                className={cn('flex shrink-0 items-center gap-2 rounded-xl px-2.5 py-1.5 text-[13px] font-semibold transition',
                  a.id === app.id ? 'bg-white/[.09] text-white' : 'text-slate-400 hover:bg-white/[.05] hover:text-slate-200')}>
                <span className="grid size-5 place-items-center rounded-md" style={{ background: `linear-gradient(135deg, ${a.accent}, ${a.accent2})` }}>
                  <a.icon className="size-3 text-white" />
                </span>
                <span className={cn(a.id !== app.id && 'hidden sm:inline')}>{a.short}</span>
              </button>
            ))}
          </nav>
          {/* address */}
          <div className="mx-2 hidden min-w-0 flex-1 items-center justify-center md:flex">
            <span className="flex min-w-0 max-w-md items-center gap-2 truncate rounded-xl bg-black/30 px-3 py-1.5 font-mono text-[12px] text-slate-400">
              <Lock className="size-3 shrink-0 text-emerald-400" /><span className="truncate">{host}</span>
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            {app.url && <>
              <button type="button" onClick={() => setNonce(n => n + 1)} aria-label="Reload app" title="Reload"
                className="grid size-9 place-items-center rounded-xl text-slate-400 transition hover:bg-white/[.07] hover:text-white"><RotateCw className="size-4" /></button>
              <a href={app.url} target="_blank" rel="noreferrer" aria-label="Open in a new tab" title="Open in a new tab"
                className="grid size-9 place-items-center rounded-xl text-slate-400 transition hover:bg-white/[.07] hover:text-white"><ArrowUpRight className="size-4" /></a>
            </>}
            <button type="button" data-autofocus onClick={onClose} aria-label="Close and return to the hub" title="Close (Esc)"
              className="grid size-9 place-items-center rounded-xl text-slate-300 transition hover:bg-white/[.1] hover:text-white"><X className="size-5" /></button>
          </div>
        </div>

        {/* body */}
        <div className="relative min-h-0 flex-1 bg-[#0b0d14]">
          {app.url ? (
            <>
              <iframe key={`${app.id}-${nonce}`} src={app.url} title={app.name} onLoad={() => setLoaded(true)}
                className={cn('absolute inset-0 size-full border-0 bg-white transition-opacity duration-500', loaded ? 'opacity-100' : 'opacity-0')}
                allow="clipboard-write; screen-wake-lock; geolocation" />
              {!loaded && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="flex flex-col items-center text-center">
                    <span className="relative grid size-16 place-items-center rounded-2xl text-white" style={{ background: `linear-gradient(135deg, ${app.accent}, ${app.accent2})` }}>
                      <span className="absolute inset-0 animate-ping rounded-2xl opacity-30" style={{ background: app.accent }} />
                      <Icon className="relative size-8" strokeWidth={1.8} />
                    </span>
                    <p className="mt-5 font-display text-lg font-semibold text-white">Opening {app.name}…</p>
                    {slow && (
                      <p className="mt-2 max-w-xs text-[14px] text-slate-400">
                        Taking longer than usual. <a className="font-semibold text-white underline underline-offset-4" href={app.url} target="_blank" rel="noreferrer">Open it in a new tab</a> instead.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <SandboxPanel />
          )}
        </div>
        {app.url && new URL(app.url).origin !== window.location.origin && (
          <p className="flex items-center justify-center gap-1.5 border-t border-white/[.06] px-4 py-2 pb-[calc(8px+env(safe-area-inset-bottom))] text-center text-[11.5px] text-slate-500">
            <Info className="size-3 shrink-0" />Running inside the hub. Data saved here stays separate from the full-page version.
          </p>
        )}
      </div>
    </div>
  )
}
