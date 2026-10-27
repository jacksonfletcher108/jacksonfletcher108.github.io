import { X, Nfc, ArrowUpRight } from 'lucide-react'
import { SITE } from '../data/apps'
import { useModalBehavior } from '../hooks/useModalBehavior'
import NfcGuide from './NfcGuide'

export default function NfcGuideModal({ open, onClose, onLaunch }) {
  const ref = useModalBehavior(open, onClose)
  if (!open) return null
  return (
    <div ref={ref} className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="nfc-title">
      <div className="absolute inset-0 bg-black/70 animate-fade" onClick={onClose} />
      <div className="relative max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-[28px] border border-line bg-raised p-6 pb-[calc(24px+env(safe-area-inset-bottom))] shadow-2xl  animate-pop sm:rounded-[28px] sm:p-7">
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#e9a23b] text-bg"><Nfc className="size-6" /></span>
            <div>
              <p className="text-[13.5px] font-semibold text-amber-300">For Supper</p>
              <h2 id="nfc-title" className="font-display text-[22px] font-semibold tracking-tight text-fg">Tap the fridge, open Supper</h2>
            </div>
          </div>
          <button type="button" data-autofocus onClick={onClose} aria-label="Close" className="grid size-10 shrink-0 place-items-center rounded-xl text-muted transition hover:bg-white/[.08] hover:text-fg"><X className="size-5" /></button>
        </div>
        <p className="relative mt-4 text-[15px] leading-relaxed text-muted">A cheap sticker on the fridge door turns your phone into a one-tap shortcut to tonight's dinner idea. Setup takes about two minutes.</p>
        <div className="relative mt-5"><NfcGuide /></div>
        <div className="relative mt-6 flex flex-wrap gap-2">
          <button type="button" onClick={onLaunch} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#e9a23b] px-4 py-3 font-semibold text-bg">Try Supper now</button>
          <a href={`${SITE}/mise/`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-2xl border border-line px-4 py-3 font-semibold text-fg transition hover:bg-white/[.06]">
            New tab<ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
