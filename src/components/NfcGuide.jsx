import { useState } from 'react'
import { Copy, Check, Smartphone, Workflow, TriangleAlert } from 'lucide-react'
import { SITE } from '../data/apps'
import { cn } from '../lib/cn'

const URL = `${SITE}/mise/`

const SIMPLE = [
  ['Get an on-metal NFC sticker', 'Look for NTAG215 tags labeled "anti-metal" or "on-metal". A fridge door is steel, and regular stickers usually won\'t read on it.'],
  ['Put the link on the sticker', 'Get the free NFC Tools app. Tap Write → Add a record → URL, paste the link above, then tap Write and hold the top of your phone on the sticker until it says done.'],
  ['Stick it on the fridge', 'Around chest height on the door, where your phone naturally lands.'],
  ['Tap it', 'Unlock your phone and touch the top edge to the sticker. Tap the banner that pops up and Mise opens.'],
]
const SHORTCUT = [
  ['Open Shortcuts → Automation', 'Tap + (or New Automation) and pick NFC.'],
  ['Scan the sticker', 'Tap Scan, hold your phone to the sticker, and name it something like "Fridge".'],
  ['Pick "Run Immediately"', 'Then add the action Open URLs and paste the link above.'],
  ['That\'s it', 'Now one tap opens Mise with no banner. The sticker doesn\'t even need anything written on it.'],
]

/** The fridge-tag how-to. Shown in its own popup and inside the tools drawer. */
export default function NfcGuide() {
  const [mode, setMode] = useState('simple')
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(URL); setCopied(true); setTimeout(() => setCopied(false), 1600) } catch { /* the link text is selectable */ }
  }
  const steps = mode === 'simple' ? SIMPLE : SHORTCUT
  return (
    <div>
      <div className="flex items-center gap-2 rounded-full bg-ink/[.05] p-1.5 pl-4">
        <span className="min-w-0 flex-1 select-all truncate text-[14px] font-medium text-ink">{URL.replace('https://', '')}</span>
        <button type="button" onClick={copy} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#e8962e] px-3.5 py-1.5 text-[13px] font-bold text-white transition active:translate-y-px">
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}{copied ? 'Copied' : 'Copy link'}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-1 rounded-full bg-ink/[.05] p-1" role="tablist" aria-label="Setup method">
        {[['simple', 'Sticker, any phone', Smartphone], ['shortcut', 'iPhone Shortcut', Workflow]].map(([id, label, Icon]) => (
          <button key={id} type="button" role="tab" aria-selected={mode === id} onClick={() => setMode(id)}
            className={cn('flex items-center justify-center gap-2 rounded-full px-3 py-2 text-[13.5px] font-semibold transition',
              mode === id ? 'bg-white text-ink shadow-sm' : 'text-pencil hover:text-ink')}>
            <Icon className="size-4" />{label}
          </button>
        ))}
      </div>

      <ol className="mt-5 space-y-4">
        {steps.map(([title, body], i) => (
          <li key={title} className="flex gap-3.5 animate-pop" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="hand grid size-9 shrink-0 place-items-center rounded-full border-2 border-[#e8962e]/50 text-[22px] font-bold leading-none text-[#b4690f]">{i + 1}</span>
            <div className="min-w-0 pt-0.5">
              <p className="text-[15.5px] font-bold text-ink">{title}</p>
              <p className="mt-0.5 text-[14.5px] leading-relaxed text-pencil">{body}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-5 flex gap-2.5 rounded-xl bg-[#fff3a8]/70 p-3.5 text-[13.5px] leading-relaxed text-ink/80">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-[#b4690f]" />
        <span>iPhone XS or newer reads these without opening an app. On Android, turn on NFC in Settings. A really thick phone case can block it.</span>
      </p>
    </div>
  )
}
