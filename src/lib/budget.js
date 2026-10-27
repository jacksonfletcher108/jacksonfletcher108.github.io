import { Home, UtensilsCrossed, Clapperboard, PiggyBank, Zap, Sparkles } from 'lucide-react'
import { todayISO, uid } from './utils'

export const CATEGORY_META = {
  housing: { name: 'Housing', icon: Home, color: '#818cf8' },
  food: { name: 'Food', icon: UtensilsCrossed, color: '#fb923c' },
  entertainment: { name: 'Entertainment', icon: Clapperboard, color: '#f472b6' },
  savings: { name: 'Savings', icon: PiggyBank, color: '#34d399' },
  utilities: { name: 'Utilities', icon: Zap, color: '#facc15' },
  personal: { name: 'Personal', icon: Sparkles, color: '#38bdf8' },
}
export const CATEGORY_IDS = Object.keys(CATEGORY_META)

const isoDay = day => { const d = new Date(); d.setDate(day); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10) }

/** A believable starter month so the dashboard isn't empty on first open. */
export function sampleState() {
  const today = new Date().getDate()
  const spend = [
    [1, 'food', 64.2, 'Groceries'], [2, 'entertainment', 15.99, 'Streaming'], [3, 'food', 23.5, 'Lunch out'], [4, 'personal', 42, 'Haircut'],
    [6, 'food', 88.4, 'Groceries'], [7, 'entertainment', 34, 'Movie night'], [8, 'food', 18.75, 'Coffee + bagel'], [10, 'personal', 29.99, 'Gym'],
    [11, 'food', 52.1, 'Dinner out'], [13, 'food', 71.3, 'Groceries'], [14, 'entertainment', 60, 'Concert'], [16, 'food', 31.6, 'Takeout'],
    [18, 'personal', 24.5, 'Pharmacy'], [19, 'food', 77.9, 'Groceries'], [21, 'entertainment', 22, 'Bowling'], [23, 'food', 41.25, 'Brunch'],
    [25, 'food', 68, 'Groceries'], [26, 'personal', 55, 'Clothes'], [28, 'food', 26.4, 'Pizza'],
  ]
  return {
    version: 1,
    theme: 'dark',
    sample: true,
    income: 5200,
    targets: { housing: 1650, food: 650, entertainment: 220, savings: 900, utilities: 260, personal: 300 },
    fixed: [
      { id: uid(), name: 'Rent', amount: 1550, category: 'housing', day: 1 },
      { id: uid(), name: 'Renters insurance', amount: 18, category: 'housing', day: 1 },
      { id: uid(), name: 'Electric', amount: 110, category: 'utilities', day: 12 },
      { id: uid(), name: 'Internet', amount: 65, category: 'utilities', day: 15 },
      { id: uid(), name: 'Phone', amount: 55, category: 'utilities', day: 20 },
      { id: uid(), name: 'Auto-transfer to savings', amount: 600, category: 'savings', day: 2 },
    ],
    expenses: spend.filter(([d]) => d <= today).map(([d, category, amount, note]) => ({ id: uid(), date: isoDay(d), category, amount, note })),
    goal: { name: 'Emergency fund', target: 12000, saved: 4300 },
  }
}

export function blankState(theme = 'dark') {
  return {
    version: 1, theme, sample: false, income: 0,
    targets: { housing: 0, food: 0, entertainment: 0, savings: 0, utilities: 0, personal: 0 },
    fixed: [], expenses: [],
    goal: { name: 'Emergency fund', target: 10000, saved: 0 },
  }
}

export function newExpense(amount, category, note = '', date = todayISO()) {
  return { id: uid(), amount, category, note, date }
}

/* ------------------------------------------------------------------ */
/* Month math                                                          */
/* ------------------------------------------------------------------ */
export function monthInfo(now = new Date()) {
  const y = now.getFullYear(), m = now.getMonth()
  const days = new Date(y, m + 1, 0).getDate()
  const day = now.getDate()
  return { y, m, days, day, daysLeft: days - day + 1, label: now.toLocaleString('en-US', { month: 'long', year: 'numeric' }) }
}

const inMonth = (iso, { y, m }) => { const [yy, mm] = iso.split('-').map(Number); return yy === y && mm - 1 === m }

/** Everything the dashboard needs, derived from saved state. */
export function summarize(state, now = new Date()) {
  const mi = monthInfo(now)
  const monthExpenses = state.expenses.filter(e => inMonth(e.date, mi))
  const fixedTotal = state.fixed.reduce((s, f) => s + f.amount, 0)
  const fixedPosted = state.fixed.filter(f => f.day <= mi.day)

  const byCat = Object.fromEntries(CATEGORY_IDS.map(id => {
    const fixed = state.fixed.filter(f => f.category === id).reduce((s, f) => s + f.amount, 0)
    const logged = monthExpenses.filter(e => e.category === id).reduce((s, e) => s + e.amount, 0)
    const target = state.targets[id] || 0
    return [id, { id, ...CATEGORY_META[id], target, fixed, logged, actual: fixed + logged, planned: Math.max(target, fixed) }]
  }))

  const allocated = CATEGORY_IDS.reduce((s, id) => s + Math.max(byCat[id].target, byCat[id].fixed), 0)
  const loggedTotal = monthExpenses.reduce((s, e) => s + e.amount, 0)
  const spentSoFar = loggedTotal + fixedPosted.reduce((s, f) => s + f.amount, 0)

  // flexible = everything that isn't savings and isn't already locked in as a fixed bill
  const flexIds = CATEGORY_IDS.filter(id => id !== 'savings')
  const flexBudget = flexIds.reduce((s, id) => s + Math.max(0, byCat[id].target - byCat[id].fixed), 0)
  const flexSpent = flexIds.reduce((s, id) => s + byCat[id].logged, 0)
  const flexLeft = flexBudget - flexSpent
  const safeToday = Math.max(0, flexLeft / mi.daysLeft)
  const plannedDaily = flexBudget / mi.days
  const paceDaily = mi.day > 0 ? flexSpent / mi.day : 0

  const plannedSavings = Math.max(byCat.savings.target, byCat.savings.fixed)
  const projectedSpend = fixedTotal - byCat.savings.fixed + paceDaily * mi.days
  const projectedLeftover = state.income - projectedSpend - plannedSavings

  return {
    mi, monthExpenses, byCat, fixedTotal, allocated, unallocated: state.income - allocated,
    loggedTotal, spentSoFar, flexBudget, flexSpent, flexLeft, safeToday, plannedDaily, paceDaily,
    plannedSavings, projectedLeftover, balance: state.income - spentSoFar,
  }
}

/** Day-by-day balance: actual so far, then projected at the current pace, vs the planned pace. */
export function cashFlowSeries(state, s) {
  const { mi } = s
  const out = []
  let actual = state.income, projected = null, planned = state.income
  const fixedByDay = {}
  state.fixed.forEach(f => { const d = Math.min(Math.max(1, f.day), mi.days); fixedByDay[d] = (fixedByDay[d] || 0) + f.amount })
  const loggedByDay = {}
  s.monthExpenses.forEach(e => { const d = Number(e.date.slice(8, 10)); loggedByDay[d] = (loggedByDay[d] || 0) + e.amount })
  for (let d = 1; d <= mi.days; d++) {
    const fixed = fixedByDay[d] || 0
    planned -= fixed + s.plannedDaily
    if (d <= mi.day) {
      actual -= fixed + (loggedByDay[d] || 0)
      if (d === mi.day) projected = actual
      out.push({ day: d, actual: Math.round(actual), projected: d === mi.day ? Math.round(actual) : null, planned: Math.round(planned) })
    } else {
      projected -= fixed + s.paceDaily
      out.push({ day: d, actual: null, projected: Math.round(projected), planned: Math.round(planned) })
    }
  }
  return out
}

/** Month-by-month goal growth for the what-if tool. */
export function goalSeries(goal, monthlyBase, monthlyScenario, months = 24) {
  const rows = []
  for (let i = 0; i <= months; i++) {
    rows.push({ month: i, base: Math.round(goal.saved + monthlyBase * i), scenario: Math.round(goal.saved + monthlyScenario * i) })
  }
  return rows
}

export const monthsTo = (goal, monthly) => {
  const left = goal.target - goal.saved
  if (left <= 0) return 0
  if (monthly <= 0) return Infinity
  return Math.ceil(left / monthly)
}

export function goalDate(months) {
  if (!Number.isFinite(months)) return 'Never at this rate'
  if (months === 0) return 'Reached'
  const d = new Date(); d.setMonth(d.getMonth() + months)
  return d.toLocaleString('en-US', { month: 'short', year: 'numeric' })
}
