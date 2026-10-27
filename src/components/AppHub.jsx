import { useCallback } from 'react'
import { Nfc } from 'lucide-react'
import { APPS, TOOLS } from '../data/apps'
import { useHashRoute } from '../hooks/useHashRoute'
import { useAppStatus } from '../hooks/useAppStatus'
import Header from './Header'
import Hero from './Hero'
import AppRow from './AppRow'
import AppModal from './AppModal'
import NfcGuideModal from './NfcGuideModal'

export default function AppHub() {
  const [route, go] = useHashRoute()
  const status = useAppStatus(APPS)
  const close = useCallback(() => go(null), [go])

  return (
    <div className="min-h-dvh overflow-x-clip">
      <Header />
      <main>
        <Hero />

        <section id="apps" aria-label="Apps" className="mx-auto max-w-6xl scroll-mt-4 px-5 sm:px-8">
          {APPS.map((a, i) => (
            <AppRow key={a.id} app={a} flip={i % 2 === 1} up={status[a.id]?.up} onOpen={id => go(`app/${id}`)} onNfc={() => go('nfc')} />
          ))}
        </section>

        <section id="about" className="mx-auto max-w-6xl scroll-mt-8 px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-12 border-t border-line py-16 sm:py-20 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-display text-[28px] font-bold tracking-tight">About</h2>
              <div className="mt-5 max-w-[52ch] space-y-4 text-[16.5px] leading-[1.7] text-muted">
                <p>I'm Jackson Fletcher, and I live in the Charleston area. I take each of these from the first idea to the version that ends up on someone's phone.</p>
                <p>Most of them start with a small annoyance: going back and forth on plans, staring into the fridge, or not knowing where the money went. If one of them gets something wrong, or you have an idea for the next one, add it to the Next up shortlist.</p>
              </div>
            </div>
            <div>
              <h2 className="font-display text-[28px] font-bold tracking-tight">How they're built</h2>
              <p className="mt-5 max-w-[52ch] text-[16.5px] leading-[1.7] text-muted">They're plain websites, so they open instantly, keep working offline, and can sit on your home screen like any other app.</p>
              <dl className="mt-6 divide-y divide-line border-y border-line">
                {TOOLS.map(t => (
                  <div key={t.name} className="grid grid-cols-[130px_minmax(0,1fr)] gap-4 py-3 text-[15px]">
                    <dt className="font-semibold text-fg">{t.name}</dt>
                    <dd className="text-muted">{t.what}</dd>
                  </div>
                ))}
              </dl>
              <button type="button" onClick={() => go('nfc')} className="mt-6 inline-flex items-center gap-2 text-[15px] text-muted transition-colors hover:text-fg">
                <Nfc className="size-4 text-[#e9a23b]" />How to open Supper with a tap on the fridge
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-5 pb-[calc(40px+env(safe-area-inset-bottom))] sm:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line pt-8 text-[14px] text-faint">
          <p><span className="text-muted">Designed and built by Jackson Fletcher.</span> Charleston, SC.</p>
          <p className="tabular">{new Date().getFullYear()}</p>
        </div>
      </footer>

      <AppModal appId={route.view === 'app' ? route.id : null} onClose={close} onSwitch={id => go(`app/${id}`)} />
      <NfcGuideModal open={route.view === 'nfc'} onClose={close} onLaunch={() => go('app/supper')} />
    </div>
  )
}
