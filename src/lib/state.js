import { uid } from './money'

export const STORAGE_KEY = 'habitsaver.v1'

export const emptyState = () => ({
  version: 1, onboarded: false, habits: [], wishes: [], why: '',
  urgesBeaten: 0, urgeLog: [], invest: true, horizon: '1y', celebrated: [],
})

export const newHabit = type => ({
  id: uid(), type, name: '', cost: 0, period: 'week', hoursPerDay: 0,
  start: new Date().toISOString(), banked: 0, bankedHours: 0, longestDays: 0, slips: [],
})

export const newWish = (name, price) => ({ id: uid(), name: name.trim(), price: Number(price) || 0, createdAt: new Date().toISOString() })

/** yyyy-mm-dd for a date input, in local time. */
export const toDateInput = iso => { const d = new Date(iso); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
export const todayInput = () => toDateInput(new Date().toISOString())

/** Picking today means "starting right now"; an earlier day means since that morning. */
export const fromDateInput = v => {
  if (!v || v >= todayInput()) return new Date().toISOString()
  const [y, m, d] = v.split('-').map(Number)
  return new Date(y, m - 1, d).toISOString()
}

export const WISH_IDEAS = [
  ['Weekend getaway', 400], ['Concert tickets', 180], ['New phone', 900], ['Emergency fund', 1000],
  ['Nice dinner out', 120], ['New sneakers', 150], ['Pay off a card', 500], ['Gym membership (year)', 480],
]
