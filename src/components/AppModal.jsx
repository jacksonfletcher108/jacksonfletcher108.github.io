import { useEffect, useState } from 'react'
import { X, RotateCw, ArrowUpRight } from 'lucide-react'
import { APPS } from '../data/apps'
import { cn } from '../lib/cn'
import { useModalBehavior } from '../hooks/useModalBehavior'
import SandboxPanel from './SandboxPanel'

/** Runs an app right on the page. The tabs along the top hop between apps without closing. */
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
  const separate = app.url && new URL(app.url).origin !== window.location.origin

  return (
    <div ref={ref} className="fixed inset-0 z-50 flex items-stretch justify-center sm:p-5 lg:p-8" role="dialog" aria-modal="true" aria-label={app.name}>
      <div className="absolute inset-0 bg-[#1f2b26]/45 backdrop-blur-[3px] animate-fade" onClick={onClose} />
      <div className="relative flex w-full max-w-[1400px] flex-col overflow-hidden bg-paper shadow-[0_40px_90px_-30px_rgb(31_43_38/.7)] animate-pop sm:rounded-[18px]">
        <div className="flex items-center gap-2 border-b-2 border-ink/[.07] px-2.5 pb-2 pt-[calc(8px+env(safe-area-inset-top))] sm:px-3 sm:pt-2">
          <nav className="flex min-w-0 gap-1 overflow-x-auto [scrollbar-width:none]" aria-label="Switch app">
            {APPS.map(a => (
              <button key={a.id} type="button" onClick={() => onSwitch(a.id)} aria-current={a.id === app.id ? 'page' : undefined}
                className={cn('flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-[14px] font-semibold transition',
                  a.id === app.id ? 'text-white' : 'text-pencil hover:bg-ink/[.05] hover:text-ink')}
                style={a.id === app.id ? { background: a.color } : undefined}>
                <span className="grid size-6 place-items-center rounded-full" style={{ background: a.id === app.id ? 'rgb(255 255 255 / .22)' : a.color }}>
                  <a.icon className="size-3.5 text-white" />
                </span>
                <span className={cn(a.id !== app.id && 'hidden sm:inline')}>{a.short}</span>
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            {app.url && <>
              <button type="button" onClick={() => setNonce(n => n + 1)} aria-label="Reload" title="Reload"
                className="grid size-9 place-items-center rounded-full text-pencil transition hover:bg-ink/[.06] hover:text-ink"><RotateCw className="size-4" /></button>
              <a href={app.url} target="_blank" rel="noreferrer" aria-label="Open in its own tab" title="Open in its own tab"
                className="grid size-9 place-items-center rounded-full text-pencil transition hover:bg-ink/[.06] hover:text-ink"><ArrowUpRight className="size-4" /></a>
            </>}
            <button type="button" data-autofocus onClick={onClose} title="Back to all apps (Esc)"
              className="flex items-center gap-1.5 rounded-full bg-ink/[.06] py-2 pl-2.5 pr-3 text-[13px] font-semibold text-ink transition hover:bg-ink/[.1]">
              <X className="size-4" /><span className="hidden sm:inline">Back to all apps</span><span className="sr-only sm:hidden">Back to all apps</span>
            </button>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 bg-white">
          {app.url ? (
            <>
              <iframe key={`${app.id}-${nonce}`} src={app.url} title={app.name} onLoad={() => setLoaded(true)}
                className={cn('absolute inset-0 size-full border-0 transition-opacity duration-500', loaded ? 'opacity-100' : 'opacity-0')}
                allow="clipboard-write; screen-wake-lock; geolocation" />
              {!loaded && (
                <div className="absolute inset-0 grid place-items-center bg-paper">
                  <div className="flex flex-col items-center text-center">
                    <span className="grid size-16 animate-bounce place-items-center rounded-2xl text-white" style={{ background: app.color }}>
                      <Icon className="size-8" />
                    </span>
                    <p className="hand mt-4 text-[26px] text-ink">opening {app.short}…</p>
                    {slow && (
                      <p className="mt-1 max-w-xs text-[14px] text-pencil">
                        This is taking a while. <a className="font-semibold text-ink underline underline-offset-4" href={app.url} target="_blank" rel="noreferrer">Open it in its own tab</a> instead.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : <SandboxPanel />}
        </div>
        {separate && (
          <p className="border-t border-ink/[.07] px-4 py-2 pb-[calc(8px+env(safe-area-inset-bottom))] text-center text-[12px] text-pencil">
            Opened from a preview, so anything you save here stays separate from the regular app.
          </p>
        )}
      </div>
    </div>
  )
}
