import { useCallback, useEffect, useMemo, useState } from 'react'
import { Info } from 'lucide-react'
import Navbar from './components/Navbar'
import TodayView from './components/TodayView'
import BudgetView from './components/BudgetView'
import WhatIfSimulator from './components/WhatIfSimulator'
import SetupWizard from './components/SetupWizard'
import CategorySheet from './components/CategorySheet'
import ExpenseModal from './components/ExpenseModal'
import Toast from './components/Toast'
import { useLocalStorage } from './hooks/useLocalStorage'
import { sampleState, blankState, summarize, newExpense, applyScenario, isSetUp, CATEGORY_META } from './lib/budget'
import { money, uid, todayISO } from './lib/utils'

const OLD_TABS = { overview: 'today', plan: 'budget', whatif: 'goal' }
const TITLES = { today: 'Today', budget: 'Budget', goal: 'Goal' }
const nudgeGoal = (st, delta) => ({ ...st, goal: { ...st.goal, saved: Math.max(0, Math.round((st.goal.saved + delta) * 100) / 100) } })

export default function App() {
  // brand-new visitors start blank and go straight into setup
  const [state, setState] = useLocalStorage('ledgerly.v1', () => blankState('dark'))
  const [rawTab, setTab] = useLocalStorage('ledgerly.tab', 'today')
  const tab = OLD_TABS[rawTab] || rawTab
  const [sheet, setSheet] = useState(null)          // null | { mode: 'add', category? } | { mode: 'edit', expense }
  const [cat, setCat] = useState(null)
  const [setup, setSetup] = useState(() => !isSetUp(state) && !state.sample)
  const [toast, setToast] = useState(null)
  const [lastCategory, setLastCategory] = useLocalStorage('ledgerly.lastCategory', 'food')

  const dark = state.theme !== 'light'
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0b0d14' : '#f8fafc')
  }, [dark])

  // "n" anywhere (outside a text field) opens quick-add
  useEffect(() => {
    const onKey = e => {
      if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea|select/i.test(e.target.tagName)) return
      if (e.key === 'n' || e.key === 'N' || e.key === '+') { e.preventDefault(); setSheet({ mode: 'add' }) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const s = useMemo(() => summarize(state), [state])
  const update = useCallback(fn => setState(st => ({ ...fn(st), sample: false })), [setState])
  const say = useCallback((text, action) => setToast({ id: uid(), text, action }), [])
  const closeSheet = useCallback(() => setSheet(null), [])
  useEffect(() => { if (sheet || cat) setToast(null) }, [sheet, cat])
  const closeCat = useCallback(() => setCat(null), [])
  const goTab = t => { setTab(t); setToast(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const recentNotes = useMemo(() => {
    const out = {}
    ;[...state.expenses].reverse().forEach(e => { if (e.note) { out[e.category] = out[e.category] || []; if (!out[e.category].includes(e.note)) out[e.category].push(e.note) } })
    return out
  }, [state.expenses])

  const saveExpense = ({ amount, category, note, date }) => {
    if (sheet?.mode === 'edit') {
      const old = sheet.expense, next = { ...old, amount, category, note, date }
      const delta = (category === 'savings' ? amount : 0) - (old.category === 'savings' ? old.amount : 0)
      update(st => nudgeGoal({ ...st, expenses: st.expenses.map(x => (x.id === old.id ? next : x)) }, delta))
      say('Changes saved', { label: 'Undo', run: () => update(st => nudgeGoal({ ...st, expenses: st.expenses.map(x => (x.id === old.id ? old : x)) }, -delta)) })
    } else {
      const e = newExpense(amount, category, note, date)
      const delta = category === 'savings' ? amount : 0
      update(st => nudgeGoal({ ...st, expenses: [...st.expenses, e] }, delta))
      setLastCategory(category)
      say(category === 'savings' ? `${money(amount, true)} put in savings` : `${money(amount, true)} added to ${CATEGORY_META[category].name}`,
        { label: 'Undo', run: () => update(st => nudgeGoal({ ...st, expenses: st.expenses.filter(x => x.id !== e.id) }, -delta)) })
    }
    setSheet(null)
  }
  const deleteExpense = e => {
    const delta = e.category === 'savings' ? -e.amount : 0
    update(st => nudgeGoal({ ...st, expenses: st.expenses.filter(x => x.id !== e.id) }, delta))
    setSheet(null)
    say('Deleted', { label: 'Undo', run: () => update(st => nudgeGoal({ ...st, expenses: [...st.expenses, e] }, -delta)) })
  }
  const finishSetup = plan => {
    setState(st => ({ ...st, ...plan, sample: false, expenses: st.sample ? [] : st.expenses, since: st.since && isSetUp(st) ? st.since : todayISO() }))
    setSetup(false); setTab('today')
    say('All set. Tap Add whenever you spend something.')
  }
  const applyChange = (sc, route, freed) => {
    const prev = state
    update(st => applyScenario(st, sc, route, freed))
    say('Budget updated', { label: 'Undo', run: () => setState(prev) })
  }

  if (setup) {
    return (
      <>
        <div className="backdrop" />
        <SetupWizard initial={isSetUp(state) ? state : null} canCancel={isSetUp(state) || state.sample}
          onCancel={() => setSetup(false)} onFinish={finishSetup}
          onSample={!isSetUp(state) ? () => { setState({ ...sampleState(), theme: state.theme }); setSetup(false); setTab('today') } : null} />
      </>
    )
  }

  return (
    <div className="min-h-screen overflow-x-clip pb-28 md:pb-16">
      <div className="backdrop" />
      <Navbar tab={tab} onTab={goTab} theme={dark ? 'dark' : 'light'} monthLabel={s.mi.label}
        onAdd={() => setSheet({ mode: 'add' })} onSetup={() => setSetup(true)}
        onTheme={() => setState(st => ({ ...st, theme: dark ? 'light' : 'dark' }))}
        onSample={() => { const prev = state; setState({ ...sampleState(), theme: state.theme }); say('Showing example numbers', { label: 'Undo', run: () => setState(prev) }) }}
        onReset={() => { const prev = state; setState(blankState(state.theme)); setSetup(true); say('Erased', { label: 'Undo', run: () => { setState(prev); setSetup(false) } }) }} />

      <main className="mx-auto max-w-6xl px-4 pt-5 sm:px-6 sm:pt-7">
        {state.sample && (
          <div className="glass mb-5 flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3 text-[14px] animate-rise">
            <Info className="size-4 shrink-0 text-indigo-400" />
            <p className="flex-1">These are example numbers so you can look around.</p>
            <button type="button" onClick={() => setSetup(true)} className="rounded-xl bg-emerald-500 px-3.5 py-2 text-[13.5px] font-bold text-white">Set up mine</button>
          </div>
        )}

        <h1 key={tab} className="mb-4 text-[24px] font-extrabold tracking-tight animate-rise sm:text-[28px]">{TITLES[tab]}</h1>

        {tab === 'today' && (
          <TodayView state={state} s={s} dark={dark} onTab={goTab} onCategory={setCat}
            onAdd={() => setSheet({ mode: 'add' })} onEdit={e => setSheet({ mode: 'edit', expense: e })} />
        )}
        {tab === 'budget' && <BudgetView state={state} s={s} update={update} say={say} />}
        {tab === 'goal' && <WhatIfSimulator state={state} s={s} update={update} dark={dark} onApply={applyChange} />}
      </main>

      <CategorySheet cat={cat} s={s} onClose={closeCat}
        onAdd={() => { setSheet({ mode: 'add', category: cat }); setCat(null) }}
        onEdit={e => { setSheet({ mode: 'edit', expense: e }); setCat(null) }}
        onBudget={() => { setCat(null); goTab('budget') }} />
      <ExpenseModal open={!!sheet} onClose={closeSheet} onSave={saveExpense} onDelete={deleteExpense}
        editing={sheet?.mode === 'edit' ? sheet.expense : null} presetCategory={sheet?.category}
        lastCategory={lastCategory} recentNotes={recentNotes} s={s} />
      <Toast toast={toast} onDone={() => setToast(null)} />
    </div>
  )
}
