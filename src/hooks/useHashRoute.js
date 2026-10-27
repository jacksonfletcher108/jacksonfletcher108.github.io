import { useCallback, useEffect, useState } from 'react'

/** Tiny router: #app/budget opens that app, #nfc opens the NFC guide, empty hash is the hub. */
const read = () => {
  const h = window.location.hash.replace(/^#\/?/, '')
  const [view, id] = h.split('/')
  return { view: view || 'hub', id: id || null }
}

export function useHashRoute() {
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const on = () => setRoute(read())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const go = useCallback(hash => {
    if (!hash) {
      // closing: step back if we opened it, so the browser back button stays in sync
      if (history.state?.hub) history.back()
      else history.replaceState(null, '', window.location.pathname + window.location.search)
      setRoute(read())
      return
    }
    const next = '#' + hash
    if (window.location.hash === next) return
    const from = read()
    if (from.view === 'hub') history.pushState({ hub: true }, '', next)
    else history.replaceState({ hub: true }, '', next)
    setRoute(read())
  }, [])
  return [route, go]
}
