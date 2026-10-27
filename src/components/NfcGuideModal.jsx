import { X, Nfc } from 'lucide-react'
import { useModalBehavior } from '../hooks/useModalBehavior'
import NfcGuide from './NfcGuide'

export default function NfcGuideModal({ open, onClose, onLaunch }) {
  const ref = useModalBehavior(open, onClose)
  if (!open) return null
  return (
    <div ref={ref} className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="nfc-title">
      <div className="absolute inset-0 bg-[#1f2b26]/45 backdrop-blur-[3px] animate-fade" onClick={onClose} />
      <div className="paper relative max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-[22px] p-6 pb-[calc(24px+env(safe-area-inset-bottom))] animate-pop sm:rounded-[14px] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#e8962e] text-white"><Nfc className="size-6" /></span>
            <div>
              <p className="hand text-[21px] leading-none text-[#b4690f]">the fridge trick</p>
              <h2 id="nfc-title" className="mt-1 font-display text-[24px] font-extrabold tracking-tight">Tap the fridge, open Mise</h2>
            </div>
          </div>
          <button type="button" data-autofocus onClick={onClose} aria-label="Close" className="grid size-10 shrink-0 place-items-center rounded-full text-pencil transition hover:bg-ink/[.06] hover:text-ink"><X className="size-5" /></button>
        </div>
        <p className="mt-4 text-[15.5px] leading-relaxed text-pencil">One cheap sticker on the fridge door, and your phone opens straight to dinner ideas. Takes about two minutes to set up.</p>
        <div className="mt-5"><NfcGuide /></div>
        <button type="button" onClick={onLaunch} className="mt-6 w-full rounded-full bg-[#e8962e] px-4 py-3 font-bold text-white shadow-[inset_0_-3px_0_rgb(0_0_0/.15)]">Try Mise now</button>
      </div>
    </div>
  )
}
