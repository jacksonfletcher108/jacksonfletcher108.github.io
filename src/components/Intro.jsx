import { Nfc } from 'lucide-react'

/** Hand-drawn arrow, kept as one short path. */
const Arrow = props => (
  <svg viewBox="0 0 90 70" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 8 C 40 4, 70 18, 66 56" /><path d="M54 46 L 66 58 L 77 44" />
  </svg>
)

export default function Intro({ count, onNfc }) {
  return (
    <section className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 pb-6 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
      <div className="animate-pop">
        <p className="hand text-[26px] leading-none text-pencil">hey there,</p>
        <h1 className="mt-2 font-display text-[46px] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-[72px]">
          I'm <span className="squiggle">Jackson</span>.<br />I make little apps.
        </h1>
        <p className="mt-6 max-w-[54ch] text-[17px] leading-relaxed text-pencil sm:text-[18px]">
          They're for the stuff that actually comes up in my life: figuring out a date night, deciding what's for dinner,
          and keeping an eye on money. Everything here works on your phone, and none of it needs an account.
        </p>
        <p className="mt-4 text-[15px] font-semibold text-ink">
          {count} apps so far <span className="mx-1.5 text-pencil/50">·</span> made in Charleston, SC
        </p>
      </div>

      {/* sticky note */}
      <div className="relative hidden rotate-2 lg:block">
        <div className="paper relative rounded-sm p-5 pt-6 [--card-paper:#fff3a8]">
          <span className="tape" />
          <p className="hand text-[25px] leading-tight text-ink">Tap any of these to try it right here.</p>
          <p className="hand mt-2 text-[21px] leading-tight text-pencil">Bonus: Mise opens with a tap on the fridge.</p>
          <button type="button" onClick={onNfc} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[13px] font-semibold text-white transition hover:-rotate-2">
            <Nfc className="size-4" />Show me how
          </button>
        </div>
        <Arrow className="absolute -bottom-16 left-6 w-20 rotate-12 text-ink/70" aria-hidden="true" />
      </div>
    </section>
  )
}
