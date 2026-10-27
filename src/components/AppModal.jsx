import { useEffect, useState } from 'react'
import { X, RotateCw, ArrowUpRight } from 'lucide-react'
import { APPS } from '../data/apps'
import { cn } from '../lib/cn'
import { useModalBehavior } from '../hooks/useModalBehavior'
import SandboxPanel from './SandboxPanel'

/** Runs an app right on the page. The tabs along the top switch apps without closing. */
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
  const separate = app.url && new URL(app.url).origin !== window.location.origin

  return (
    <div ref={ref} className="fixed inset-0 z-50 flex items-stretch justify-center sm:p-5 lg:p-8" role="dialog" aria-modal="true" aria-label={app.name}>
      <div className="absolute inset-0 bg-black/70 animate-fade" onClick={onClose} />
      <div className="relative flex w-full max-w-[1400px] flex-col overflow-hidden bg-raised shadow-2xl animate-pop sm:rounded-[20px] sm:border sm:border-line">
        <div className="flex items-center gap-2 border-b border-line px-2.5 pb-2 pt-[calc(8px+env(safe-area-inset-top))] sm:px-3 sm:pt-2">
          <nav className="flex min-w-0 gap-1 overflow-x-auto [scrollbar-width:none]" aria-label="Switch app">
            {APPS.map(a => {
              const on = a.id === app.id
              return (
                <button key={a.id} type="button" onClick={() => onSwitch(a.id)} aria-current={on ? 'page' : undefined}
                  className={cn('flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-2 pr-3 text-[14px] font-medium transition-colors',
                    on ? 'bg-white/[.08] text-fg' : 'text-muted hover:text-fg')}>
                  <a.icon className="size-4" style={{ color: a.color }} />
                  <span className={cn(!on && 'hidden sm:inline')}>{a.name}</span>
                </button>
              )
            })}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            {app.url && <>
              <button type="button" onClick={() => setNonce(n => n + 1)} aria-label="Reload" title="Reload"
                className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-white/[.06] hover:text-fg"><RotateCw className="size-4" /></button>
              <a href={app.url} target="_blank" rel="noreferrer" aria-label="Open in a new tab" title="Open in a new tab"
                className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-white/[.06] hover:text-fg"><ArrowUpRight className="size-4" /></a>
            </>}
            <button type="button" data-autofocus onClick={onClose} aria-label="Close" title="Close (Esc)"
              className="grid size-9 place-items-center rounded-full text-fg transition-colors hover:bg-white/[.08]"><X className="size-5" /></button>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 bg-bg">
          {app.url ? (
            <>
              <iframe key={`${app.id}-${nonce}`} src={app.url} title={app.name} onLoad={() => setLoaded(true)}
                className={cn('absolute inset-0 size-full border-0 transition-opacity duration-300', loaded ? 'opacity-100' : 'opacity-0')}
                allow="clipboard-write; screen-wake-lock; geolocation" />
              {!loaded && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <app.icon className="mx-auto size-8 animate-pulse" style={{ color: app.color }} />
                    <p className="mt-3 text-[15px] text-muted">Opening {app.name}…</p>
                    {slow && <p className="mt-1 text-[14px] text-faint">Taking a while. <a className="text-fg underline underline-offset-4" href={app.url} target="_blank" rel="noreferrer">Open it in a new tab</a>.</p>}
                  </div>
                </div>
              )}
            </>
          ) : <SandboxPanel />}
        </div>
        {separate && <p className="border-t border-line px-4 py-2 text-center text-[12px] text-faint">Preview copy: anything you save here stays separate from the regular app.</p>}
      </div>
    </div>
  )
}
