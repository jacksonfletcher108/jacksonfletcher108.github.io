import { useState } from 'react'
import { Copy, Check, Smartphone, Tag, PenLine, Refrigerator, Zap, TriangleAlert, Workflow } from 'lucide-react'
import { SITE } from '../data/apps'
import { cn } from '../lib/cn'

const URL = `${SITE}/mise/`

const SIMPLE = [
  { icon: Tag, title: 'Get an on-metal NFC sticker', body: 'Buy NTAG215 tags labeled "anti-metal" or "on-metal". A fridge door is steel, and regular stickers usually won\'t read on metal.' },
  { icon: PenLine, title: 'Write the link to the tag', body: 'Install the free NFC Tools app. Tap Write → Add a record → URL, paste the link below, then tap Write and hold the top of your phone against the sticker until it confirms.' },
  { icon: Refrigerator, title: 'Stick it on the fridge', body: 'Put it at chest height on the door, where your phone naturally reaches. Keep it away from the magnets on the gasket.' },
  { icon: Zap, title: 'Tap to open', body: 'Unlock your phone and touch its top edge to the sticker. A banner pops up; tap it and Supper opens.' },
]
const SHORTCUT = [
  { title: 'Open Shortcuts → Automation', body: 'Tap + (or New Automation) and choose NFC.' },
  { title: 'Scan the sticker', body: 'Tap Scan, hold your phone to the tag, and give it a name like "Fridge".' },
  { title: 'Choose "Run Immediately"', body: 'Then add the action Open URLs and paste the link below.' },
  { title: 'Done', body: 'Now a tap opens Supper right away, with no banner to confirm. The tag doesn\'t even need anything written to it.' },
]

/** Content of the NFC guide, used in both the modal and the stack drawer. */
export default function NfcGuide({ compact = false }) {
  const [mode, setMode] = useState('simple')
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(URL); setCopied(true); setTimeout(() => setCopied(false), 1600) } catch { /* select fallback below */ }
  }
  const steps = mode === 'simple' ? SIMPLE : SHORTCUT
  return (
    <div>
      <div className="flex items-center gap-2 rounded-2xl border border-amber-300/20 bg-amber-300/[.07] p-2 pl-3">
        <span className="min-w-0 flex-1 select-all truncate text-[13.5px] text-amber-100">{URL}</span>
        <button type="button" onClick={copy} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-300 px-3 py-1.5 text-[13px] font-semibold text-amber-950 transition active:scale-95">
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}{copied ? 'Copied' : 'Copy link'}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl bg-white/[.04] p-1" role="tablist" aria-label="Setup method">
        {[['simple', 'Sticker + any phone', Smartphone], ['shortcut', 'iPhone Shortcut', Workflow]].map(([id, label, Icon]) => (
          <button key={id} type="button" role="tab" aria-selected={mode === id} onClick={() => setMode(id)}
            className={cn('flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-[13px] font-semibold transition',
              mode === id ? 'bg-white text-bg' : 'text-muted hover:text-fg')}>
            <Icon className="size-4" />{label}
          </button>
        ))}
      </div>

      <ol className={cn('mt-5 space-y-3', compact && 'space-y-2.5')}>
        {steps.map((st, i) => (
          <li key={st.title} className="flex gap-3.5 animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/[.06] text-[13px] font-bold text-amber-200">{i + 1}</span>
            <div className="min-w-0 pt-0.5">
              <p className="text-[15px] font-semibold text-fg">{st.title}</p>
              <p className="mt-0.5 text-[14px] leading-relaxed text-muted">{st.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-5 flex gap-2.5 rounded-2xl bg-white/[.03] p-3.5 text-[13px] leading-relaxed text-muted">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-300" />
        <span>iPhone XS or newer reads tags without opening an app. On Android, turn NFC on in Settings. A phone case thicker than a few millimeters can block the read.</span>
      </p>
    </div>
  )
}
