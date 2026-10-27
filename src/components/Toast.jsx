import { useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'

export default function Toast({ toast, onDone }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onDone, toast.action ? 5000 : 2600)
    return () => clearTimeout(t)
  }, [toast, onDone])
  if (!toast) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(88px+env(safe-area-inset-bottom))] z-[60] flex justify-center px-4 md:bottom-8" role="status" aria-live="polite">
      <div key={toast.id} className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-slate-900 py-2.5 pl-4 pr-2.5 text-sm font-medium text-white shadow-2xl animate-pop dark:bg-white dark:text-slate-900">
        <CheckCircle2 className="size-4 text-emerald-400 dark:text-emerald-600" />
        {toast.text}
        {toast.action && (
          <button type="button" onClick={() => { toast.action.run(); onDone() }} className="rounded-lg px-2.5 py-1 font-bold text-emerald-400 hover:bg-white/10 dark:text-emerald-600 dark:hover:bg-slate-900/5">
            {toast.action.label}
          </button>
        )}
      </div>
    </div>
  )
}
