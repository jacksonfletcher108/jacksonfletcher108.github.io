const DAY = 86400000
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const usd2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const money = (n, cents = false) => (cents ? usd2 : usd).format(Number.isFinite(n) ? n : 0)
export const compact = n => (Math.abs(n) >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : Math.abs(n) >= 1000 ? `$${(n / 1000).toFixed(n >= 1e4 ? 0 : 1)}k` : money(n))
export const uid = () => Math.random().toString(36).slice(2, 10)

/** What the habit cost per day, whatever period the person entered it in. */
export function perDay(h) {
  const c = Number(h.cost) || 0
  return h.period === 'week' ? c / 7 : h.period === 'month' ? (c * 12) / 365 : c
}

/** Live numbers for one habit at time `now` (ms). Earlier streaks are "banked" so a slip never erases them. */
export function habitStats(h, now) {
  const start = new Date(h.start).getTime()
  const ms = Math.max(0, now - start)
  const days = ms / DAY
  return {
    id: h.id, perDay: perDay(h),
    saved: (h.banked || 0) + perDay(h) * days,
    hours: (h.bankedHours || 0) + (Number(h.hoursPerDay) || 0) * days,
    streakDays: Math.floor(days),
    streakMs: ms,
    longest: Math.max(h.longestDays || 0, Math.floor(days)),
  }
}

/** Everything the dashboard needs at one moment. */
export function totals(state, now) {
  const per = state.habits.map(h => habitStats(h, now))
  const saved = per.reduce((a, p) => a + p.saved, 0)
  const spentOnWishes = state.wishes.filter(w => w.boughtAt).reduce((a, w) => a + w.price, 0)
  return {
    per,
    saved,
    pool: Math.max(0, saved - spentOnWishes),
    spentOnWishes,
    hours: per.reduce((a, p) => a + p.hours, 0),
    perDay: per.reduce((a, p) => a + p.perDay, 0),
    bestStreak: per.reduce((a, p) => Math.max(a, p.streakDays), 0),
  }
}

/**
 * Wishes fill in list order: the first one gets money until it's fully unlocked, then the next.
 * Bought wishes are already paid for and sit out.
 */
export function allocate(wishes, pool, perDayRate) {
  let left = pool, ahead = 0
  return wishes.filter(w => !w.boughtAt).map(w => {
    const got = Math.min(w.price, Math.max(0, left))
    left -= got
    ahead += w.price
    // still needed before this wish is fully unlocked = everything up to and including it, minus the pool
    const need = Math.max(0, ahead - pool)
    return { ...w, got, pct: w.price > 0 ? got / w.price : 0, unlocked: got >= w.price, daysToGo: need === 0 ? 0 : perDayRate > 0 ? need / perDayRate : Infinity }
  })
}

/** A slip: bank what this streak earned (minus what the slip cost), then start counting again. */
export function slip(h, now, spent) {
  const s = habitStats(h, now)
  const thisStreak = s.saved - (h.banked || 0)
  return {
    ...h,
    banked: Math.max(0, (h.banked || 0) + thisStreak - (Number(spent) || 0)),
    bankedHours: s.hours,
    longestDays: s.longest,
    start: new Date(now).toISOString(),
    slips: [...(h.slips || []), { at: new Date(now).toISOString(), spent: Number(spent) || 0, streakDays: s.streakDays }],
  }
}

export const HORIZONS = [
  { id: '1m', label: '1 month', short: '1 mo', days: 30 },
  { id: '6m', label: '6 months', short: '6 mo', days: 182 },
  { id: '1y', label: '1 year', short: '1 yr', days: 365 },
  { id: '5y', label: '5 years', short: '5 yrs', days: 1826 },
]
export const ANNUAL_RETURN = 0.07

/**
 * Savings from today forward: kept as cash vs. invested at 7% a year.
 * Investing compounds daily at the rate that equals 7% over a year; deposits arrive daily.
 */
export function projection(startAmount, perDayRate, days, points = 48) {
  const rd = Math.pow(1 + ANNUAL_RETURN, 1 / 365) - 1
  const out = []
  for (let i = 0; i <= points; i++) {
    const t = Math.round((days * i) / points)
    const growth = Math.pow(1 + rd, t)
    out.push({
      t,
      cash: startAmount + perDayRate * t,
      invested: startAmount * growth + (rd > 0 ? perDayRate * (growth - 1) / rd : perDayRate * t),
    })
  }
  return out
}

export const dayLabel = t => (t === 0 ? 'Today' : t < 60 ? `Day ${t}` : t < 730 ? `Month ${Math.round(t / 30.4)}` : `Year ${(t / 365).toFixed(t % 365 ? 1 : 0)}`)
