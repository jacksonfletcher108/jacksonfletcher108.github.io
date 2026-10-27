import { useEffect, useState } from 'react'

/** State that survives closing the browser. Fails quietly if storage is blocked (private mode). */
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw) } catch { /* ignore */ }
    return typeof initial === 'function' ? initial() : initial
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ } }, [key, value])
  return [value, setValue]
}
