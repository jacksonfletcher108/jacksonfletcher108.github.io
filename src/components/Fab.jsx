import { Plus } from 'lucide-react'

export default function Fab({ onClick }) {
  return (
    <button type="button" onClick={onClick} aria-label="Log an expense (N)" title="Log an expense (N)"
      className="group fixed bottom-[calc(80px+env(safe-area-inset-bottom))] right-5 z-40 grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-emerald-950 shadow-[0_12px_32px_-8px_rgb(16_185_129/.7)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-8px_rgb(16_185_129/.8)] active:scale-95 md:bottom-8 md:right-8 md:size-16">
      <span className="absolute inset-0 rounded-2xl bg-emerald-400/40 opacity-0 transition group-hover:animate-ping group-hover:opacity-100 motion-reduce:hidden" style={{ animationIterationCount: 1 }} />
      <Plus className="relative size-7 transition-transform duration-300 group-hover:rotate-90" strokeWidth={2.6} />
    </button>
  )
}
