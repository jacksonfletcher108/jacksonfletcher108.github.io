import { useEffect } from 'react'

export default function Toast({ toast, onDone }) {
  useEffect(() => { if (!toast) return; const t = setTimeout(onDone, toast.action ? 5000 : 2800); return () => clearTimeout(t) }, [toast, onDone])
  if (!toast) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(96px+var(--sab))] z-[60] flex justify-center px-4 md:bottom-8" role="status" aria-live="polite">
      <div key={toast.id} className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-white py-2.5 pl-4 pr-2.5 text-[14px] font-semibold text-emerald-950 shadow-2xl animate-pop">
        {toast.text}
        {toast.action && <button type="button" onClick={() => { toast.action.run(); onDone() }} className="rounded-lg px-2.5 py-1 font-extrabold text-emerald-700 hover:bg-emerald-50">{toast.action.label}</button>}
      </div>
    </div>
  )
}
