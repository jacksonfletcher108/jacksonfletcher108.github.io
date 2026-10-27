import { useEffect, useState } from 'react'

/**
 * Pings each live app once and reports whether it answered and how fast.
 * Uses no-cors, so we only learn "reachable or not", which is all a status dot needs.
 */
export function useAppStatus(apps) {
  const [status, setStatus] = useState({})
  useEffect(() => {
    let alive = true
    apps.filter(a => a.url).forEach(async a => {
      const t0 = performance.now()
      try {
        await fetch(a.url + '?ping=' + Date.now(), { mode: 'no-cors', cache: 'no-store' })
        if (alive) setStatus(s => ({ ...s, [a.id]: { up: true, ms: Math.round(performance.now() - t0) } }))
      } catch {
        if (alive) setStatus(s => ({ ...s, [a.id]: { up: false } }))
      }
    })
    return () => { alive = false }
  }, [apps])
  return status
}
