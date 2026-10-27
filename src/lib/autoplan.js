import { CATEGORY_IDS, monthsTo, goalDate } from './budget'
import { money } from './utils'

/**
 * Builds a monthly plan from pay, bills, a few answers, and (when there is any) real logged spending.
 * Every number comes with a one-line reason so the plan never feels like a black box.
 */

export const DEFAULT_PREFS = {
  household: 1,          // people the budget feeds: 1, 2, 3, 4 (4 = "4 or more")
  eatOut: 'sometimes',   // rarely | sometimes | often
  style: 'balanced',     // save | balanced | enjoy
  car: false,
  pet: false,
  cushion: true,         // leave a little unplanned for surprises
  goalMonths: null,      // reach the goal in N months, or null for "no rush"
  priorities: { food: 'normal', entertainment: 'normal', personal: 'normal' },
}

// Monthly costs, checked against published data (October 2026):
// - Groceries: USDA food plans, Sept 2026. One adult 20-50 is $304-$383 on the Thrifty plan (with the
//   one-person adjustment) and ~$400-$480 on Moderate; a family of four is $1,024 Thrifty, $1,127 Low-Cost.
//   We sit near Low-Cost: $370 for one, +$260 per extra person (4 people ≈ $1,150).
// - Eating out, fun, personal care + clothes: BLS Consumer Expenditure Survey 2024, per household
//   (avg 2.5 people): food away $329/mo, entertainment $301/mo (incl. pets/hobbies), personal care $82
//   + apparel $167. "Sometimes" eating out is the average household, scaled by √people.
// - Car: AAA Your Driving Costs 2025, fuel ~13¢/mi + maintenance/tires ~11¢/mi; ~12-15k miles a year.
// - Pet: Rover 2025 averages ~$280/mo (dog) and ~$165/mo (cat); ASPCA basics (food, routine vet) run lower.
// - Utilities: EIA-based SC electric bills ~$140-$165/mo, plus typical water and internet.
const GROCERIES_FIRST = 370          // one adult
const GROCERIES_EACH_EXTRA = 260     // each extra person shares staples, so it costs less
const EAT_OUT = { rarely: 70, sometimes: 200, often: 380 }   // one person; more people scale by √n
const PERSONAL = 150, FUN = 140
const CAR = 250, PET = 125
const UTIL = { power: h => 130 + 20 * h, water: h => 35 + 15 * h, internet: () => 75 }
const UTIL_MATCH = { power: /electric|power|energy|duke|dominion|santee|light|gas bill|natural gas/i, water: /water|sewer|trash/i, internet: /internet|wi-?fi|comcast|xfinity|spectrum|fiber|broadband|wow|starlink/i }
const WEIGHT = { less: 0.7, normal: 1, more: 1.35 }
const SAVE_SHARE = { save: 0.2, balanced: 0.12, enjoy: 0.06 }       // of take-home pay (the 50/30/20 rule's 20% for "saving more")
const SURPLUS_TO_SAVE = { save: 0.7, balanced: 0.4, enjoy: 0.2 }   // where extra money goes
// how far each want can grow past its estimate when there's extra money. Eating out barely moves,
// because the person already told us how often they go; anything the wants can't use goes to savings.
const WANT_CAP = {
  eatOut: { save: 1.1, balanced: 1.25, enjoy: 1.4 },
  personal: { save: 1.2, balanced: 1.5, enjoy: 2 },
  fun: { save: 1.3, balanced: 2.1, enjoy: 2.8 },
}
const EAT_OUT_LABEL = { rarely: 'now and then', sometimes: 'a few times a month', often: 'often' }

const r10 = n => Math.max(0, Math.round(n / 10) * 10)
const billsIn = (fixed, id) => fixed.filter(f => f.category === id).reduce((a, f) => a + f.amount, 0)
const UTIL_NAME = { power: 'power', water: 'water', internet: 'internet' }
const listParts = parts => {
  const xs = Object.entries(parts).map(([k, v]) => `${UTIL_NAME[k]} (about ${money(Math.round(v / 5) * 5)})`)
  return xs.length > 1 ? xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1] : xs[0]
}
const who = n => (n === 1 ? 'one person' : n >= 4 ? 'four or more people' : `${n} people`)

/** Average monthly spending per category from what's actually been logged (needs about a week of data). */
export function observedMonthly(expenses, now = new Date()) {
  const byMonth = {}
  expenses.forEach(e => { const k = e.date.slice(0, 7); (byMonth[k] = byMonth[k] || []).push(e) })
  const thisKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const months = Object.keys(byMonth).sort().reverse().slice(0, 3)
  const totals = {}, used = []
  months.forEach(k => {
    const list = byMonth[k]
    let factor = 1
    if (k === thisKey) {
      const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
      const first = Math.min(...list.map(e => Number(e.date.slice(8, 10))))
      const elapsed = now.getDate() - first + 1
      if (elapsed < 7) return                       // too early in the month to say anything
      factor = days / elapsed
    }
    used.push(k)
    list.forEach(e => { totals[e.category] = (totals[e.category] || 0) + e.amount * factor })
  })
  if (!used.length) return null
  return Object.fromEntries(Object.entries(totals).map(([k, v]) => [k, v / used.length]))
}

export function autoPlan({ income, fixed, goal, expenses = [] }, prefsIn) {
  const p = { ...DEFAULT_PREFS, ...prefsIn, priorities: { ...DEFAULT_PREFS.priorities, ...(prefsIn?.priorities || {}) } }
  const warnings = []
  const bills = fixed.filter(f => f.category !== 'savings').reduce((a, f) => a + f.amount, 0)
  const savingsBills = billsIn(fixed, 'savings')
  const available = income - bills

  // 1. What everyday life probably costs for this household
  const hh = p.household
  const w = id => WEIGHT[p.priorities[id] || 'normal']
  let groceries = (GROCERIES_FIRST + GROCERIES_EACH_EXTRA * (hh - 1)) * Math.sqrt(w('food'))   // a need: priority moves it less
  let eatOut = EAT_OUT[p.eatOut] * Math.sqrt(hh) * w('food')
  let personal = PERSONAL * Math.pow(hh, 0.6) * w('personal')
  const fixedPersonal = (p.car ? CAR : 0) + (p.pet ? PET : 0)    // gas and pet food are needs, never trimmed
  let fun = FUN * Math.sqrt(hh) * w('entertainment')
  // utilities: set aside money only for the ones that aren't already listed as bills
  const missingUtil = Object.keys(UTIL).filter(k => !fixed.some(f => UTIL_MATCH[k].test(f.name)))
  const utilParts = Object.fromEntries(missingUtil.map(k => [k, UTIL[k](hh)]))
  let utilities = Object.values(utilParts).reduce((a, v) => a + v, 0)
  if (!billsIn(fixed, 'housing')) warnings.push('No rent or mortgage is listed. If you pay one, add it as a bill so the plan accounts for it.')

  // 2. Blend in what's actually been spent, when there's enough to go on
  const obs = observedMonthly(expenses)
  const seen = {}
  if (obs) {
    const blend = (est, o) => (o > 0 ? est * 0.45 + o * 0.55 : est)
    if (obs.food) { const total = groceries + eatOut, b = blend(total, obs.food); groceries *= b / total; eatOut *= b / total; seen.food = obs.food }
    if (obs.personal) { personal = blend(personal, obs.personal); seen.personal = obs.personal }
    if (obs.entertainment) { fun = blend(fun, obs.entertainment); seen.entertainment = obs.entertainment }
  }

  // 3. Savings: a share of what's left after bills, or whatever the goal date needs, whichever is more
  const goalLeft = goal && goal.target > goal.saved ? goal.target - goal.saved : 0
  const goalNeed = p.goalMonths && goalLeft ? goalLeft / p.goalMonths : 0
  const floorSave = Math.max(savingsBills, available * 0.03)
  let save = Math.max(Math.min(income * SAVE_SHARE[p.style], available * 0.35), goalNeed, savingsBills)
  let cushion = p.cushion ? available * 0.04 : 0

  if (available <= 0) {
    warnings.unshift(`Your bills (${money(bills)}) are more than your pay (${money(income)}). Start by trimming a bill or double-checking your pay.`)
    return finish({ groceries: 0, eatOut: 0, personal: 0, fun: 0, utilities: 0, save: savingsBills, cushion: 0 })
  }

  // 4. Fit it all into the pay
  let pool = available - save - cushion
  const wants = () => eatOut + personal + fun
  const needs = () => groceries + utilities + fixedPersonal
  const total = needs() + wants()
  if (total <= pool) {
    // extra money: some to savings, the rest to the things that matter most
    const surplus = pool - total
    const toSave = surplus * SURPLUS_TO_SAVE[p.style]
    save += toSave
    let rest = surplus - toSave
    // spread the rest over the wants, weighted by what matters, without letting any balloon
    const wantList = [['eatOut', eatOut, w('food')], ['personal', personal, w('personal')], ['fun', fun, w('entertainment')]]
    const capOf = k => WANT_CAP[k][p.style]
    const grown = Object.fromEntries(wantList.map(([k, v]) => [k, v]))
    for (let pass = 0; pass < 3 && rest > 1; pass++) {
      const open = wantList.filter(([k, v, wt]) => grown[k] < v * capOf(k) * wt)
      const sum = open.reduce((a, [, v, wt]) => a + v * wt, 0)
      if (!sum) break
      let given = 0
      open.forEach(([k, v, wt]) => { const add = Math.min(rest * (v * wt) / sum, v * capOf(k) * wt - grown[k]); grown[k] += add; given += add })
      rest -= given
    }
    eatOut = grown.eatOut; personal = grown.personal; fun = grown.fun
    save += rest                                    // whatever the wants couldn't use
  } else {
    // short on money: trim wants first, then the cushion, then savings, then needs
    let short = total - pool
    const cutWants = Math.min(short, wants() * 0.7)
    if (cutWants > 0) { const k = 1 - cutWants / wants(); eatOut *= k; personal *= k; fun *= k; short -= cutWants }
    if (short > 0 && cushion > 0) { const c = Math.min(cushion, short); cushion -= c; short -= c }
    if (short > 0 && save > floorSave) {
      const c = Math.min(save - floorSave, short); save -= c; short -= c
      if (goalNeed && save < goalNeed) warnings.push(`Reaching ${goal.name || 'your goal'} in ${p.goalMonths} months needs ${money(goalNeed)} a month, which doesn't fit right now. I saved as much as I could.`)
    }
    if (short > 0) { const trimmable = groceries + utilities, k = Math.max(0.8, 1 - short / trimmable); short -= trimmable * (1 - k); groceries *= k; utilities *= k }
    if (short > 1) warnings.unshift(`Money is tight: even trimmed, everyday costs run about ${money(short)} over. Consider lowering a bill or saving less for now.`)
    if (cutWants > 0) warnings.push('Eating out, fun and personal spending were trimmed to make everything fit.')
  }
  return finish({ groceries, eatOut, personal, fun, utilities, save, cushion })

  function finish(v) {
    const none = available <= 0
    const food = r10(v.groceries + v.eatOut), pers = r10(v.personal + (none ? 0 : fixedPersonal)), ent = r10(v.fun), util = r10(v.utilities)
    let sav = r10(v.save)
    // rounding leftovers go to savings unless the person wants a cushion
    const planned = bills + food + pers + ent + util + sav
    if (planned > income && planned - income <= 60) sav = Math.max(0, sav - (planned - income))   // rounding overshoot
    const cushionAmt = Math.max(0, income - (bills + food + pers + ent + util + sav))
    if (!p.cushion && cushionAmt > 0) sav += cushionAmt
    const targets = Object.fromEntries(CATEGORY_IDS.map(id => [id, billsIn(fixed, id)]))
    targets.food += food; targets.personal += pers; targets.entertainment += ent; targets.utilities += util; targets.savings = Math.max(sav, savingsBills)
    const months = monthsTo(goal || { target: 0, saved: 0 }, targets.savings)
    const extras = [p.car && `gas and upkeep for the car (about ${money(CAR)})`, p.pet && `pet food, supplies and routine vet visits (about ${money(PET)})`].filter(Boolean)
    const lines = none ? [{ id: 'savings', amount: targets.savings, reason: 'Nothing is left after bills, so there\'s nothing to plan yet.' }] : [
      { id: 'food', amount: food, reason: `Groceries for ${who(hh)} (about ${money(r10(v.groceries))}) plus eating out ${EAT_OUT_LABEL[p.eatOut]} (about ${money(r10(v.eatOut))}).${seen.food ? ` You've been spending around ${money(seen.food)} a month here.` : ''}` },
      { id: 'personal', amount: pers, reason: `Toiletries, clothes, haircuts and the like${extras.length ? `, plus ${extras.join(' and ')}` : ''}.${seen.personal ? ` You've averaged about ${money(seen.personal)}.` : ''}` },
      { id: 'entertainment', amount: ent, reason: `Movies, outings and subscriptions${p.style === 'enjoy' ? ', with extra room since enjoying it is the priority' : ''}.${seen.entertainment ? ` You've averaged about ${money(seen.entertainment)}.` : ''}` },
      ...(util ? [{ id: 'utilities', amount: util, reason: `For ${listParts(utilParts)}, since ${missingUtil.length > 1 ? "they aren't listed as bills" : "it isn't listed as a bill"}.` }] : []),
      { id: 'savings', amount: targets.savings, reason: goalLeft && Number.isFinite(months)
          ? `Gets you to ${goal.name || 'your goal'} (${money(goal.target)}) by ${goalDate(months)}.`
          : `About ${Math.round((targets.savings / Math.max(1, income)) * 100)}% of your pay.` },
    ]
    const spending = food + pers + ent + util
    return {
      targets, lines, warnings, cushion: p.cushion ? cushionAmt : 0,
      daily: spending / 30, savings: targets.savings, usedHistory: !!obs,
    }
  }
}
