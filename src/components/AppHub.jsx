import { useCallback, useMemo, useState } from 'react'
import { Layers, Nfc, ArrowRight } from 'lucide-react'
import { APPS, TECH } from '../data/apps'
import { useHashRoute } from '../hooks/useHashRoute'
import { useAppStatus } from '../hooks/useAppStatus'
import Header from './Header'
import Hero from './Hero'
import AppCard from './AppCard'
import AppModal from './AppModal'
import NfcGuideModal from './NfcGuideModal'
import TechDrawer from './TechDrawer'
import NfcGuide from './NfcGuide'
import { cn } from '../lib/cn'

export default function AppHub() {
  const [route, go] = useHashRoute()
  const status = useAppStatus(APPS)
  const [drawer, setDrawer] = useState(null)   // null | { tech } | { nfc: true }
  const [nfcInline, setNfcInline] = useState(false)

  const live = APPS.filter(a => a.status === 'live')
  const stats = useMemo(() => [
    { label: 'Apps live', value: live.length },
    { label: 'In progress', value: APPS.length - live.length },
    { label: 'Accounts needed', value: 0 },
    { label: 'Cost to use', value: 'Free' },
  ], [live.length])

  const close = useCallback(() => go(null), [go])

  return (
    <div className="min-h-dvh">
      <div className="mesh" aria-hidden="true"><i /><i /><i /></div>

      <Header liveCount={live.length} buildingCount={APPS.length - live.length} onStack={() => setDrawer({})} />

      <main>
        <Hero stats={stats} onNfc={() => go('nfc')} />

        <section id="apps" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-[28px] font-semibold tracking-tight text-white sm:text-[34px]">The apps</h2>
              <p className="mt-1 text-[15px] text-slate-400">Each one opens right on this page.</p>
            </div>
            <p className="text-[13px] text-slate-500">Press <kbd className="rounded-md border border-white/15 bg-white/[.05] px-1.5 py-0.5 font-mono text-[11px] text-slate-300">Esc</kbd> to come back</p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {APPS.map((a, i) => <AppCard key={a.id} app={a} index={i} status={status} onLaunch={id => go(`app/${id}`)} onNfc={() => go('nfc')} />)}
          </div>
        </section>

        {/* under the hood */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <div className="glass rounded-[28px] p-6 sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-[22px] font-semibold tracking-tight text-white">How they're built</h2>
                  <p className="mt-1 text-[14px] text-slate-400">Plain websites I write and host myself.</p>
                </div>
                <button type="button" onClick={() => setDrawer({})} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-cyan-200 transition hover:bg-white/[.06]">
                  <Layers className="size-4" />Details<ArrowRight className="size-3.5" />
                </button>
              </div>
              <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {TECH.map(t => (
                  <li key={t.id}>
                    <button type="button" onClick={() => setDrawer({ tech: t.id })}
                      className="group flex w-full flex-col items-start rounded-2xl border border-white/[.06] bg-white/[.02] p-3.5 text-left transition hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[.05]">
                      <span className="flex items-center gap-2 text-[14.5px] font-semibold text-white">
                        <span className="size-2 rounded-full" style={{ background: t.color, boxShadow: `0 0 10px ${t.color}` }} />{t.name}
                      </span>
                      <span className="mt-1 text-[12.5px] leading-snug text-slate-400">{t.role}</span>
                      <span className="mt-3 flex w-full gap-1">
                        {['datenight', 'kitchen', 'budget', 'next', 'hub'].map(p => (
                          <span key={p} className="h-1 flex-1 rounded-full" style={{ background: t.used.includes(p) ? t.color : 'rgb(255 255 255 / .07)' }} />
                        ))}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass relative overflow-hidden rounded-[28px] p-6 sm:p-7">
              <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-amber-400/15 blur-3xl" />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13.5px] font-semibold text-amber-300/90">For Mise</p>
                  <h2 className="mt-1 font-display text-[22px] font-semibold tracking-tight text-white">Fridge tag setup</h2>
                </div>
                <Nfc className="size-7 text-amber-300" />
              </div>
              <p className="relative mt-3 text-[14.5px] leading-relaxed text-slate-400">Put an NFC sticker on the fridge, and tapping it with your phone opens Mise.</p>
              <label className="relative mt-5 flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-white/[.04] p-3.5">
                <span className="text-[14px] font-semibold text-white">Show setup guide</span>
                <button type="button" role="switch" aria-checked={nfcInline} onClick={() => setNfcInline(v => !v)}
                  className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', nfcInline ? 'bg-amber-400' : 'bg-white/15')}>
                  <span className={cn('absolute top-0.5 size-5 rounded-full bg-white shadow transition-all', nfcInline ? 'left-[22px]' : 'left-0.5')} />
                </button>
              </label>
              {nfcInline && <div className="relative mt-5 animate-fade"><NfcGuide compact /></div>}
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-white/[.06] px-4 py-8 pb-[calc(32px+env(safe-area-inset-bottom))] text-[13px] text-slate-500 sm:px-6">
        <p className="text-slate-400">Designed and built by Jackson Fletcher.</p>
        <p>Charleston, SC · {new Date().getFullYear()}</p>
      </footer>

      <AppModal appId={route.view === 'app' ? route.id : null} onClose={close} onSwitch={id => go(`app/${id}`)} />
      <NfcGuideModal open={route.view === 'nfc'} onClose={close} onLaunch={() => go('app/kitchen')} />
      {drawer && <TechDrawer open onClose={() => setDrawer(null)} initialTech={drawer.tech} initialNfc={drawer.nfc} />}
    </div>
  )
}
