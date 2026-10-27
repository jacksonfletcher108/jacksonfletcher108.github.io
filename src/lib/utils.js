import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs) => twMerge(clsx(inputs))

const usd0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const usd2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** $1,234 (or $12.50 when cents matter) */
export const money = (n, cents = false) => (cents ? usd2 : usd0).format(Number.isFinite(n) ? n : 0)
export const compact = n => (Math.abs(n) >= 1000 ? `$${(n / 1000).toFixed(Math.abs(n) >= 10000 ? 0 : 1)}k` : money(n))
export const pct = (part, whole) => (whole > 0 ? Math.round((part / whole) * 100) : 0)
export const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n))
export const uid = () => Math.random().toString(36).slice(2, 10)
export const toNum = v => { const n = parseFloat(String(v).replace(/[^0-9.-]/g, '')); return Number.isFinite(n) ? n : 0 }
export const todayISO = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10) }
