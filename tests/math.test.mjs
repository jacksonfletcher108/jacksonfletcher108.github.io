// Run: node tests/math.test.mjs   (checks Tally's money math with exact, worked-out answers)
import { createServer } from 'vite'
const vs = await createServer({ root: new URL('..', import.meta.url).pathname, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const B = await vs.ssrLoadModule('/src/lib/budget.js')
const A = await vs.ssrLoadModule('/src/lib/autoplan.js')
let pass = 0, fail = 0
const eq = (name, got, want, tol = 0.01) => {
  const ok = Object.is(got, want) || (typeof want === 'number' ? Math.abs(got - want) <= tol : JSON.stringify(got) === JSON.stringify(want))
  ok ? pass++ : (fail++, console.log(`✗ ${name}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`))
}
const ok = (name, cond, info = '') => (cond ? pass++ : (fail++, console.log(`✗ ${name} ${info}`)))

// --- pay frequency → monthly
const mult = id => B.PAY_FREQ.find(f => f.id === id).mult
eq('biweekly 1800 → 3900/mo', 1800 * mult('biweekly'), 3900)
eq('weekly 900 → 3900/mo', 900 * mult('weekly'), 3900)
eq('twice a month 1950 → 3900/mo', 1950 * mult('twice'), 3900)
eq('monthly 3900', 3900 * mult('monthly'), 3900)

// --- a month with known numbers: Oct 27, 2026 (31 days, 5 days left including today)
const now = new Date(2026, 9, 27, 15, 0)
const base = {
  income: 3900, expenses: [], goal: { name: 'Trip', target: 5000, saved: 500 },
  targets: { housing: 1200, food: 600, entertainment: 200, personal: 300, utilities: 60, savings: 400 },
  fixed: [{ id: 'r', name: 'Rent', amount: 1200, category: 'housing', day: 1 }, { id: 'p', name: 'Phone', amount: 60, category: 'utilities', day: 20 }],
}
const exp = (d, cat, amt) => ({ id: `${d}${cat}${amt}`, date: `2026-10-${String(d).padStart(2, '0')}`, category: cat, amount: amt })
let s = B.summarize({ ...base, expenses: [exp(10, 'food', 30), exp(27, 'food', 20), exp(27, 'savings', 100), exp(3, 'personal', 0)] }, now)
eq('days left (incl. today)', s.mi.daysLeft, 5)
eq('spending money = targets minus bills', s.flexBudget, 1100)
eq('spent (savings not counted)', s.flexSpent, 50)
eq('left this month', s.flexLeft, 1050)
eq('spent today', s.spentToday, 20)
eq("today's budget = (left + today's spending) / days left", s.todayBudget, 1070 / 5)
eq('can still spend today', s.safeToday, 1070 / 5 - 20)
eq('daily plan = 1100 / 31', s.plannedDaily, 1100 / 31)
eq('pace = 50 / 27 days', s.paceDaily, 50 / 27)
eq('planned savings', s.plannedSavings, 400)
eq('status on track', B.paceStatus(s).id, 'ok')
eq('food row left', B.spendingRows(s).find(r => r.id === 'food').left, 550)

// overspending flips the status
s = B.summarize({ ...base, expenses: [exp(5, 'food', 900), exp(6, 'entertainment', 300)] }, now)
eq('over budget status', B.paceStatus(s).id, 'over')
eq('nothing safe to spend when over', s.safeToday, 0)
s = B.summarize({ ...base, expenses: [exp(5, 'food', 1060)] }, now)   // ahead of plan: 1060 vs 1100*27/31 ≈ 958
eq('fast status', B.paceStatus(s).id, 'fast')

// first month counts only from the start date
s = B.summarize({ ...base, since: '2026-10-27' }, now)
eq('prorated food budget 600 × 5/31', s.byCat.food.budget, Math.round(600 * 5 / 31))
eq('prorated spending money', s.flexBudget, Math.round(600 * 5 / 31) + Math.round(200 * 5 / 31) + Math.round(300 * 5 / 31))
eq('prorated daily plan ≈ full-month daily plan', s.plannedDaily, 1100 / 31, 0.5)
eq('prorated: today = all of it / 5 days', s.safeToday, s.flexBudget / 5)
s = B.summarize({ ...base, since: '2026-09-15' }, now)
eq('started last month: no proration', s.flexBudget, 1100)

// bills split into paid / upcoming by due day
const bt = B.billsTimeline(base, B.summarize(base, new Date(2026, 9, 15)))
eq('paid by the 15th', bt.paid.map(b => b.name), ['Rent'])
eq('still to come', bt.upcoming.map(b => b.name), ['Phone'])

// goal timing
eq('months to goal: 4500 / 590 → 8', B.monthsTo({ target: 5000, saved: 500 }, 590), 8)
eq('months to goal exact: 4500 / 450 → 10', B.monthsTo({ target: 5000, saved: 500 }, 450), 10)
eq('no savings → never', B.monthsTo({ target: 5000, saved: 500 }, 0), Infinity)
eq('already there', B.monthsTo({ target: 5000, saved: 5000 }, 100), 0)

// what-if → real budget
const applied = B.applyScenario(base, { dining: 150, fun: 50, extra: 100, income: 300 }, true, 150 + 50 + 300)
eq('what-if food', applied.targets.food, 450)
eq('what-if fun', applied.targets.entertainment, 150)
eq('what-if savings = 400 + 100 + freed 500', applied.targets.savings, 1000)
eq('what-if income', applied.income, 4200)

// logging savings moves the goal; never below zero
eq('goal up', B.nudgeGoal(base, 50).goal.saved, 550)
eq('goal floor', B.nudgeGoal(base, -9999).goal.saved, 0)

// --- automatic plan: invariants over many households
const billsBy = (f, id) => f.filter(x => x.category === id).reduce((a, x) => a + x.amount, 0)
let plans = 0
for (const income of [1500, 2400, 3200, 3900, 5200, 7500, 11000])
  for (const rent of [0, 900, 1400, 2200])
    for (const hh of [1, 2, 3, 4])
      for (const style of ['save', 'balanced', 'enjoy'])
        for (const extras of [{}, { car: true, pet: true, cushion: false }, { eatOut: 'often', goalMonths: 12 }, { eatOut: 'rarely', goalMonths: 6, priorities: { food: 'more', entertainment: 'less', personal: 'more' } }]) {
          const fixed = [...(rent ? [{ name: 'Rent', amount: rent, category: 'housing' }] : []), { name: 'Phone', amount: 60, category: 'utilities' }, { name: 'Electric', amount: 140, category: 'utilities' }]
          const st = { income, fixed, goal: { name: 'Fund', target: 6000, saved: 1000 } }
          const r = A.autoPlan(st, { household: hh, style, ...extras })
          plans++
          const tag = `${income}/${rent}/${hh}/${style}/${JSON.stringify(extras)}`
          const total = Object.values(r.targets).reduce((a, v) => a + v, 0)
          const tight = r.warnings.some(w => /tight|more than your pay/.test(w))
          if (!tight) ok('fits in pay', total <= income + 0.5, tag + ` total ${total}`)
          ok('cushion = pay − plan', !extras.cushion === false || Math.abs(income - total - r.cushion) < 0.5 || tight, tag)
          for (const id of Object.keys(r.targets)) ok('never below bills', r.targets[id] >= billsBy(fixed, id), `${tag} ${id}`)
          for (const l of r.lines.filter(l => l.id !== 'savings')) ok('line = target − bills', l.amount === r.targets[l.id] - billsBy(fixed, l.id), `${tag} ${l.id}`)
          ok('daily = spending / 30', Math.abs(r.daily - r.lines.filter(l => l.id !== 'savings').reduce((a, l) => a + l.amount, 0) / 30) < 0.01, tag)
          ok('no NaN', !/NaN|undefined|Infinity/.test(JSON.stringify(r)), tag)
          const need = (6000 - 1000) / extras.goalMonths
          if (extras.goalMonths && !tight && !r.warnings.some(w => /doesn't fit/.test(w))) ok('goal date met', r.targets.savings >= need - 10, `${tag} saves ${r.targets.savings} needs ${need}`)
          // the food explanation adds up to the food amount
          const fl = r.lines.find(l => l.id === 'food')
          if (fl) { const m = fl.reason.match(/about \$([\d,]+)\).*?about \$([\d,]+)\)/); if (m) ok('food reason adds up', Math.abs(+m[1].replace(',', '') + +m[2].replace(',', '') - fl.amount) <= 20, `${tag} ${fl.reason}`) }
        }
// styles rank sensibly when money isn't tight
for (const hh of [1, 2]) {
  const st = { income: 5200, fixed: [{ name: 'Rent', amount: 1400, category: 'housing' }, { name: 'Electric', amount: 140, category: 'utilities' }], goal: { target: 0, saved: 0 } }
  const sv = ['save', 'balanced', 'enjoy'].map(style => A.autoPlan(st, { household: hh, style }).targets.savings)
  ok('save ≥ balanced ≥ enjoy', sv[0] >= sv[1] && sv[1] >= sv[2], JSON.stringify(sv))
}
// utilities are only estimated when missing
const u1 = A.autoPlan({ income: 3900, fixed: [{ name: 'Phone', amount: 60, category: 'utilities' }], goal: { target: 0, saved: 0 } }, {})
ok('phone-only still plans power, water, internet', /power.*water.*internet/.test(u1.lines.find(l => l.id === 'utilities')?.reason || ''), JSON.stringify(u1.lines))
const u2 = A.autoPlan({ income: 3900, fixed: [{ name: 'Electric', amount: 140, category: 'utilities' }, { name: 'Internet', amount: 70, category: 'utilities' }], goal: { target: 0, saved: 0 } }, {})
ok('only water left to estimate', /water/.test(u2.lines.find(l => l.id === 'utilities')?.reason || '') && !/power|internet \(/.test(u2.lines.find(l => l.id === 'utilities')?.reason || ''), JSON.stringify(u2.lines.find(l => l.id === 'utilities')))
// groceries follow USDA-based figures for an ordinary balanced single and a family of four
const g1 = A.autoPlan({ income: 3900, fixed: [{ name: 'Rent', amount: 1200, category: 'housing' }, { name: 'Electric', amount: 140, category: 'utilities' }, { name: 'Water', amount: 50, category: 'utilities' }, { name: 'Internet', amount: 70, category: 'utilities' }], goal: { target: 0, saved: 0 } }, { household: 1 })
ok('single groceries ≈ $370', /Groceries for one person \(about \$370\)/.test(g1.lines[0].reason), g1.lines[0].reason)
const g4 = A.autoPlan({ income: 9000, fixed: [{ name: 'Rent', amount: 2000, category: 'housing' }, { name: 'Electric', amount: 200, category: 'utilities' }, { name: 'Water', amount: 90, category: 'utilities' }, { name: 'Internet', amount: 70, category: 'utilities' }], goal: { target: 0, saved: 0 } }, { household: 4 })
ok('family of 4 groceries ≈ $1,150', /about \$1,150\)/.test(g4.lines[0].reason), g4.lines[0].reason)

console.log(`\n${pass} passed, ${fail} failed (${plans} automatic plans checked)`)
await vs.close()
process.exit(fail ? 1 : 0)
