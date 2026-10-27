import { useCallback, useState } from 'react'
import { Nfc, ChevronDown } from 'lucide-react'
import { APPS, TOOLS } from '../data/apps'
import { useHashRoute } from '../hooks/useHashRoute'
import { useAppStatus } from '../hooks/useAppStatus'
import Header from './Header'
import Intro from './Intro'
import AppCard from './AppCard'
import AppModal from './AppModal'
import NfcGuideModal from './NfcGuideModal'
import TechDrawer from './TechDrawer'
import NfcGuide from './NfcGuide'
import { cn } from '../lib/cn'

export default function AppHub() {
  const [route, go] = useHashRoute()
  const status = useAppStatus(APPS)
  const [drawer, setDrawer] = useState(null)   // null | { tool } | { nfc: true }
  const [trickOpen, setTrickOpen] = useState(false)
  const live = APPS.filter(a => a.status === 'live')
  const close = useCallback(() => go(null), [go])

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <div className="door-handle" aria-hidden="true" />
      <Header liveCount={live.length} onTools={() => setDrawer({})} />

      <main>
        <Intro count={live.length} onNfc={() => go('nfc')} />

        <section id="apps" aria-labelledby="apps-title" className="mx-auto max-w-6xl scroll-mt-6 px-4 pb-16 pt-10 sm:px-6">
          <h2 id="apps-title" className="hand mb-8 text-[30px] leading-none text-pencil">stuck on the fridge right now:</h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
            {APPS.map((a, i) => (
              <AppCard key={a.id} app={a} index={i} up={status[a.id]?.up} onOpen={id => go(`app/${id}`)} onNfc={() => go('nfc')} />
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-x-8 gap-y-12 px-4 pb-20 sm:px-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          {/* index card with ruled lines */}
          <div className="paper relative -rotate-[0.6deg] rounded-[4px] p-6 pt-8 sm:p-8 sm:pt-9"
            style={{ backgroundImage: 'linear-gradient(transparent 0 38px, #e5484d55 38px 40px, transparent 40px), repeating-linear-gradient(transparent 0 31px, #8fb3cf55 31px 32px)', backgroundPosition: '0 24px, 0 72px' }}>
            <span className="magnet" style={{ '--pin': '#3e6fd8' }} aria-hidden="true" />
            <h2 className="font-display text-[26px] font-extrabold tracking-tight">How I build these</h2>
            <p className="mt-3 max-w-[54ch] text-[16px] leading-[32px] text-ink/85">
              They're all plain websites I write and host myself, so they open instantly, work offline, and can sit on your home screen like a real app.
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {TOOLS.map(t => (
                <li key={t.id}>
                  <button type="button" onClick={() => setDrawer({ tool: t.id })}
                    className="rounded-full border-2 border-ink/10 bg-white px-3 py-1 text-[14px] font-semibold transition hover:-rotate-2 hover:border-ink/30">{t.name}</button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => setDrawer({})} className="hand mt-5 text-[22px] text-[#3e6fd8] underline decoration-2 underline-offset-4">see what goes into each one →</button>
          </div>

          {/* yellow sticky note */}
          <div className="paper relative rotate-[1.2deg] rounded-[3px] p-6 pt-8 [--card-paper:#fff3a8] sm:p-7 sm:pt-9">
            <span className="tape" aria-hidden="true" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="hand text-[22px] leading-none text-[#b4690f]">the fridge trick</p>
                <h2 className="mt-1 font-display text-[24px] font-extrabold tracking-tight">Tap the fridge, get dinner ideas</h2>
              </div>
              <Nfc className="size-8 shrink-0 text-[#b4690f]" />
            </div>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink/80">Put an NFC sticker on the fridge door and tapping it with your phone opens Mise.</p>
            <button type="button" onClick={() => setTrickOpen(v => !v)} aria-expanded={trickOpen}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[14px] font-semibold text-white">
              {trickOpen ? 'Hide the steps' : 'Show me how'}<ChevronDown className={cn('size-4 transition-transform', trickOpen && 'rotate-180')} />
            </button>
            {trickOpen && <div className="mt-5 animate-fade"><NfcGuide /></div>}
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-[calc(40px+env(safe-area-inset-bottom))] sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-t-2 border-dashed border-ink/15 pt-8">
          <div>
            <p className="text-[15px] text-pencil">Thanks for stopping by. Everything here was designed and built by me.</p>
            <p className="hand mt-1 -rotate-2 text-[40px] leading-none text-ink">Jackson Fletcher</p>
          </div>
          <p className="text-[13px] text-pencil">Charleston, SC · {new Date().getFullYear()}</p>
        </div>
      </footer>

      <AppModal appId={route.view === 'app' ? route.id : null} onClose={close} onSwitch={id => go(`app/${id}`)} />
      <NfcGuideModal open={route.view === 'nfc'} onClose={close} onLaunch={() => go('app/kitchen')} />
      {drawer && <TechDrawer open onClose={() => setDrawer(null)} initialTool={drawer.tool} initialNfc={drawer.nfc} />}
    </div>
  )
}
