import { useCallback, useEffect, useState } from 'react'
import { ShieldHalf } from 'lucide-react'
import Onboarding from './components/Onboarding'
import Header from './components/Header'
import HeroStats from './components/HeroStats'
import HabitCards from './components/HabitCards'
import Wishlist from './components/Wishlist'
import ProjectionChart from './components/ProjectionChart'
import HoldTheLine from './components/HoldTheLine'
import SlipSheet from './components/SlipSheet'
import Settings from './components/Settings'
import Confetti from './components/Confetti'
import Toast from './components/Toast'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useNow } from './hooks/useNow'
import { allocate, money, slip, totals } from './lib/money'
import { emptyState, STORAGE_KEY } from './lib/state'

export default function App() {
  const [state, setState] = useLocalStorage(STORAGE_KEY, emptyState)
  const now = useNow(1000)
  const [holding, setHolding] = useState(false)
  const [slipping, setSlipping] = useState(null)
  const [settings, setSettings] = useState(false)
  const [toast, setToast] = useState(null)
  const [burst, setBurst] = useState(0)
  const say = useCallback((text, action) => setToast({ id: Date.now(), text, action }), [])
  const party = () => setBurst(Date.now())

  const t = state.onboarded ? totals(state, now) : null

  // celebrate each goal once, the moment the fund covers it
  const fresh = t ? allocate(state.wishes, t.pool, t.perDay).filter(w => w.unlocked && !(state.celebrated || []).includes(w.id)) : []
  const freshKey = fresh.map(w => w.id).join()
  useEffect(() => {
    if (!freshKey) return
    setState(s => ({ ...s, celebrated: [...(s.celebrated || []), ...fresh.map(w => w.id)] }))
    setBurst(Date.now())
    setToast({ id: Date.now(), text: `Unlocked: ${fresh[0].name}` })
  }, [freshKey]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!state.onboarded) {
    return (
      <>
        <div className="aurora" />
        <Onboarding onDone={d => setState(s => ({ ...s, ...d, onboarded: true, celebrated: [] }))} />
      </>
    )
  }

  const confirmSlip = (h, spent) => {
    setState(s => ({ ...s, habits: s.habits.map(x => (x.id === h.id ? slip(x, Date.now(), spent) : x)) }))
    setSlipping(null)
    setHolding(false)
    say('New streak started. Day one counts.')
  }
  const beaten = () => {
    setState(s => ({ ...s, urgesBeaten: (s.urgesBeaten || 0) + 1, urgeLog: [...(s.urgeLog || []), new Date().toISOString()].slice(-200) }))
    setHolding(false)
    party()
    say('That one passed. Proud of you.')
  }
  const deleteWish = w => {
    const before = state.wishes
    setState(s => ({ ...s, wishes: s.wishes.filter(x => x.id !== w.id) }))
    say(`Removed ${w.name}`, { label: 'Undo', run: () => setState(s => ({ ...s, wishes: before })) })
  }
  const buyWish = w => {
    setState(s => ({ ...s, wishes: s.wishes.map(x => (x.id === w.id ? { ...x, boughtAt: new Date().toISOString() } : x)) }))
    party()
    say(`Enjoy it. ${money(w.price)} well spent.`, { label: 'Undo', run: () => setState(s => ({ ...s, wishes: s.wishes.map(x => (x.id === w.id ? { ...x, boughtAt: undefined } : x)) })) })
  }

  return (
    <>
      <div className="aurora" />
      <div className="mx-auto w-full max-w-5xl px-4 pb-[calc(112px+var(--sab))] sm:px-6 sm:pb-12">
        <Header onSettings={() => setSettings(true)} onHold={() => setHolding(true)} />
        <main className="mt-6 space-y-3">
          <HeroStats state={state} t={t} />
          <HabitCards habits={state.habits} t={t} onSlip={setSlipping} />
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:items-start [&>*]:min-w-0">
            <Wishlist wishes={state.wishes} pool={t.pool} perDay={t.perDay} onChange={wishes => setState(s => ({ ...s, wishes }))} onBought={buyWish} onDelete={deleteWish} />
            <ProjectionChart pool={t.pool} perDay={t.perDay} wishes={state.wishes} horizon={state.horizon} invest={state.invest}
              onHorizon={horizon => setState(s => ({ ...s, horizon }))} onInvest={invest => setState(s => ({ ...s, invest }))} />
          </div>
        </main>
      </div>

      {/* on phones the craving button is always under your thumb */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-ink via-ink/90 to-transparent px-4 pb-[calc(14px+var(--sab))] pt-6 sm:hidden">
        <button type="button" onClick={() => setHolding(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 py-4 text-[16px] font-extrabold text-emerald-950 shadow-xl shadow-emerald-500/25 active:scale-[.98]">
          <ShieldHalf className="size-5" /> Craving? Hold the line
        </button>
      </div>

      <HoldTheLine open={holding} onClose={() => setHolding(false)} state={state} t={t} onBeaten={beaten}
        onSlipped={() => { setHolding(false); setSlipping(state.habits[0]) }} />
      <SlipSheet habit={slipping} habits={state.habits} onClose={() => setSlipping(null)} onConfirm={confirmSlip} />
      <Settings open={settings} onClose={() => setSettings(false)} state={state} setState={setState}
        onReset={() => { setState(emptyState()); setSettings(false) }} />
      <Confetti burst={burst} />
      <Toast toast={toast} onDone={() => setToast(null)} />
    </>
  )
}
