import { useEffect, useState } from 'react'

export function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    // tick on the second boundary so the display never drifts
    let t
    const tick = () => { setNow(new Date()); t = setTimeout(tick, 1000 - (Date.now() % 1000)) }
    t = setTimeout(tick, 1000 - (Date.now() % 1000))
    return () => clearTimeout(t)
  }, [])
  return now
}
