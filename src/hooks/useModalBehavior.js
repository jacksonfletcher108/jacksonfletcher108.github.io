import { useEffect, useRef } from 'react'

/** Escape to close, lock page scroll, and move focus into the dialog (then back out). */
export function useModalBehavior(open, onClose) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    const t = setTimeout(() => ref.current?.querySelector('[data-autofocus]')?.focus(), 30)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      if (prev && prev.focus) prev.focus({ preventScroll: true })
    }
  }, [open, onClose])
  return ref
}
