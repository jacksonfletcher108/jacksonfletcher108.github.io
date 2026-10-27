import { useEffect, useState } from 'react'

/** The current time, refreshed every `ms` (animation-frame smooth when ms is small). */
export function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    let raf, t
    if (ms < 100) {
      const loop = () => { setNow(Date.now()); raf = requestAnimationFrame(loop) }
      raf = requestAnimationFrame(loop)
    } else t = setInterval(() => setNow(Date.now()), ms)
    return () => { cancelAnimationFrame(raf); clearInterval(t) }
  }, [ms])
  return now
}
