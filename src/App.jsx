import { useCallback, useEffect, useMemo, useState } from 'react'
import { Info, X } from 'lucide-react'
import Navbar from './components/Navbar'
import StatCards from './components/StatCards'
import BudgetProgress from './components/BudgetProgress'
import SetupPanel from './components/SetupPanel'
import { PlannedVsActual, CashFlowChart } from './components/Charts'
import RecentActivity from './components/RecentActivity'
import ExpenseModal from './components/ExpenseModal'
import WhatIfSimulator from './components/WhatIfSimulator'
import Toast from './components/Toast'
import Fab from './components/Fab'
import { useLocalStorage } from './hooks/useLocalStorage'
import { sampleState, blankState, summarize, newExpense, CATEGORY_META } from './lib/budget'
import { money, uid } from './lib/utils'

export default function App() {
  const [state, setState] = useLocalStorage('ledgerly.v1', sampleState)
  const [tab, setTab] = useLocalStorage('ledgerly.tab', 'overview')
  const [adding, setAdding] = useState(false)
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
      if (e.key === 'n' || e.key === 'N' || e.key === '+') { e.preventDefault(); setAdding(true) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const s = useMemo(() => summarize(state), [state])
  const update = useCallback(fn => setState(st => ({ ...fn(st), sample: false })), [setState])
  const say = (text, action) => setToast({ id: uid(), text, action })
  const closeModal = useCallback(() => setAdding(false), [])

  const recentNotes = useMemo(() => {
    const out = {}
    ;[...state.expenses].reverse().forEach(e => { if (e.note) { out[e.category] = out[e.category] || []; if (!out[e.category].includes(e.note)) out[e.category].push(e.note) } })
    return out
  }, [state.expenses])

  const saveExpense = ({ amount, category, note, date }) => {
    const e = newExpense(amount, category, note, date)
    update(st => ({ ...st, expenses: [...st.expenses, e] }))
    setLastCategory(category)
    setAdding(false)
    say(`${money(amount, true)} added to ${CATEGORY_META[category].name}`, { label: 'Undo', run: () => update(st => ({ ...st, expenses: st.expenses.filter(x => x.id !== e.id) })) })
  }
  const deleteExpense = e => {
    update(st => ({ ...st, expenses: st.expenses.filter(x => x.id !== e.id) }))
    say('Expense deleted', { label: 'Undo', run: () => update(st => ({ ...st, expenses: [...st.expenses, e] })) })
  }
  const setTarget = (id, v) => update(st => ({ ...st, targets: { ...st.targets, [id]: v } }))

  return (
    <div className="min-h-screen pb-28 md:pb-16">
      <div className="backdrop" />
      <Navbar tab={tab} onTab={t => { setTab(t); window.scrollTo({ top: 0, behavior: 'smooth' }) }} theme={dark ? 'dark' : 'light'}
        onTheme={() => setState(st => ({ ...st, theme: dark ? 'light' : 'dark' }))} monthLabel={s.mi.label}
        onSample={() => { setState({ ...sampleState(), theme: state.theme }); say('Sample month loaded') }}
        onReset={() => { const prev = state; setState(blankState(state.theme)); setTab('plan'); say('Cleared. Start with your income.', { label: 'Undo', run: () => setState(prev) }) }} />

      <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8">
        {state.sample && (
          <div className="glass mb-5 flex items-center gap-3 rounded-2xl px-4 py-3 text-[13px] animate-rise">
            <Info className="size-4 shrink-0 text-indigo-400" />
            <p className="flex-1">You're looking at a sample month. Change anything and it becomes yours, or <button type="button" className="font-semibold text-emerald-600 underline-offset-2 hover:underline dark:text-emerald-400" onClick={() => { setState(blankState(state.theme)); setTab('plan') }}>start from scratch</button>.</p>
            <button type="button" aria-label="Dismiss" onClick={() => setState(st => ({ ...st, sample: false }))} className="grid size-7 place-items-center rounded-lg text-slate-400 hover:bg-slate-900/5 dark:hover:bg-white/[.06]"><X className="size-4" /></button>
          </div>
        )}

        <div className="mb-6 animate-rise">
          <h1 className="text-[26px] font-extrabold leading-tight tracking-tight sm:text-[32px]">
            {tab === 'overview' && <>Hey there. <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">{money(s.safeToday)}</span> is safe to spend today.</>}
            {tab === 'plan' && <>Set up your month in <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">under a minute</span>.</>}
            {tab === 'whatif' && <>Play with the <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">future</span>.</>}
          </h1>
          <p className="mt-1.5 text-[15px] text-slate-500 dark:text-slate-400">
            {tab === 'overview' && (state.income > 0 ? `${s.mi.daysLeft} days left in ${s.mi.label.split(' ')[0]} · ${money(s.flexLeft)} left of your flexible budget` : 'Add your income on the Plan tab to get started.')}
            {tab === 'plan' && 'Income, fixed bills, then a target for each category. Everything saves as you type.'}
            {tab === 'whatif' && 'See how small changes today move your goal.'}
          </p>
        </div>

        {tab === 'overview' && (
          <div className="space-y-4">
            <StatCards state={state} s={s} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
              <div className="min-w-0 space-y-4">
                <CashFlowChart state={state} s={s} dark={dark} />
                <PlannedVsActual s={s} dark={dark} />
              </div>
              <div className="min-w-0 space-y-4">
                <BudgetProgress state={state} s={s} onTarget={setTarget} />
                <RecentActivity state={state} onDelete={deleteExpense} onAdd={() => setAdding(true)} />
              </div>
            </div>
          </div>
        )}
        {tab === 'plan' && (
          <div className="space-y-4">
            <SetupPanel state={state} s={s} update={update} />
            <BudgetProgress state={state} s={s} onTarget={setTarget} editable title="Spending targets" />
          </div>
        )}
        {tab === 'whatif' && <WhatIfSimulator state={state} s={s} update={update} dark={dark} />}
      </main>

      <Fab onClick={() => setAdding(true)} />
      <ExpenseModal open={adding} onClose={closeModal} onSave={saveExpense} lastCategory={lastCategory} recentNotes={recentNotes} s={s} />
      <Toast toast={toast} onDone={() => setToast(null)} />
    </div>
  )
}
