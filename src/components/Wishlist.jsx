import { useState } from 'react'
import { ChevronDown, ChevronUp, Lock, PartyPopper, Plus, ShoppingBag, Trash2, Unlock } from 'lucide-react'
import { Button, Card, field, Modal, MoneyInput, Progress } from './ui'
import { allocate, money } from '../lib/money'
import { newWish } from '../lib/state'
import { wishIcon } from '../lib/wishIcon'
import { cn } from '../lib/cn'

function eta(days) {
  if (!Number.isFinite(days)) return 'add a cost to see when'
  if (days < 1) return 'later today'
  if (days < 2) return 'tomorrow'
  if (days < 45) return `in about ${Math.ceil(days)} days`
  if (days < 540) return `in about ${Math.round(days / 30.4)} months`
  return `in about ${(days / 365).toFixed(1)} years`
}

export default function Wishlist({ wishes, pool, perDay, onChange, onBought, onDelete }) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [showBought, setShowBought] = useState(false)
  const list = allocate(wishes, pool, perDay)
  const bought = wishes.filter(w => w.boughtAt)
  const active = wishes.filter(w => !w.boughtAt)

  const move = (id, dir) => {
    const ids = active.map(w => w.id), i = ids.indexOf(id), j = i + dir
    if (j < 0 || j >= ids.length) return
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
    onChange([...ids.map(x => wishes.find(w => w.id === x)), ...bought])
  }
  const save = e => {
    e.preventDefault()
    if (!name.trim() || !(price > 0)) return
    onChange([...active, newWish(name, price), ...bought])
    setName(''); setPrice(0); setAdding(false)
  }

  return (
    <Card className="[animation-delay:200ms]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[19px] font-extrabold tracking-tight">Wishlist</h2>
          <p className="text-[13px] text-slate-400">Your savings fill these from the top down.</p>
        </div>
        <Button variant="ghost" className="py-2.5" onClick={() => setAdding(true)}><Plus className="size-4" /> Add</Button>
      </div>

      {!list.length && (
        <button type="button" onClick={() => setAdding(true)} className="mt-5 flex w-full flex-col items-center gap-2 rounded-2xl border border-dashed border-white/15 p-8 text-center text-slate-400 transition hover:bg-white/[.03]">
          <ShoppingBag className="size-6 text-emerald-300" />
          <span className="font-semibold text-slate-200">What would you rather spend it on?</span>
          <span className="text-[14px]">A trip, a phone, paying something off. Add a goal and watch it unlock.</span>
        </button>
      )}

      <ul className="mt-5 space-y-3">
        {list.map((w, i) => {
          const Icon = wishIcon(w.name)
          return (
            <li key={w.id} className={cn('rounded-2xl border p-4 transition', w.unlocked ? 'border-emerald-400/40 bg-emerald-400/[.07]' : 'border-white/[.07] bg-black/15')}>
              <div className="flex items-center gap-3">
                <span className={cn('grid size-11 shrink-0 place-items-center rounded-2xl', w.unlocked ? 'bg-emerald-400 text-emerald-950' : 'bg-white/[.06] text-emerald-300')}><Icon className="size-5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{w.name}</p>
                  <p className="tabular text-[13px] text-slate-400">{money(w.got)} <span className="text-slate-500">of {money(w.price)}</span></p>
                </div>
                <div className="text-right">
                  <p className={cn('tabular text-[18px] font-extrabold', w.unlocked ? 'text-emerald-300' : 'text-white')}>{Math.floor(w.pct * 100)}%</p>
                  <p className="text-[12px] text-slate-500">unlocked</p>
                </div>
              </div>
              <Progress className="mt-3" value={w.pct} />
              <div className="mt-3 flex items-center gap-1">
                <p className="flex min-w-0 flex-1 items-center gap-1.5 text-[13px] text-slate-400">
                  {w.unlocked
                    ? <><Unlock className="size-3.5 text-emerald-300" /><span className="font-semibold text-emerald-200">Unlocked. You earned this.</span></>
                    : <><Lock className="size-3.5" /><span className="truncate">Yours {eta(w.daysToGo)}</span></>}
                </p>
                {w.unlocked && <Button className="mr-1 px-3 py-1.5 text-[13px]" onClick={() => onBought(w)}><PartyPopper className="size-4" /> I bought it</Button>}
                <IconBtn label={`Move ${w.name} up`} disabled={i === 0} onClick={() => move(w.id, -1)}><ChevronUp className="size-4" /></IconBtn>
                <IconBtn label={`Move ${w.name} down`} disabled={i === list.length - 1} onClick={() => move(w.id, 1)}><ChevronDown className="size-4" /></IconBtn>
                <IconBtn label={`Delete ${w.name}`} onClick={() => onDelete(w)}><Trash2 className="size-4" /></IconBtn>
              </div>
            </li>
          )
        })}
      </ul>

      {bought.length > 0 && (
        <div className="mt-4">
          <button type="button" onClick={() => setShowBought(v => !v)} className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-400 hover:text-white" aria-expanded={showBought}>
            {showBought ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />} Bought with your savings ({bought.length})
          </button>
          {showBought && (
            <ul className="mt-2 space-y-1.5 animate-rise">
              {bought.map(w => (
                <li key={w.id} className="flex items-center gap-3 rounded-xl px-3 py-2 text-[14px] text-slate-300">
                  <PartyPopper className="size-4 shrink-0 text-amber-300" />
                  <span className="min-w-0 flex-1 truncate">{w.name}</span>
                  <span className="tabular text-slate-400">{money(w.price)}</span>
                  <span className="text-[12px] text-slate-500">{new Date(w.boughtAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Modal open={adding} onClose={() => setAdding(false)} title="Add a goal">
        <form onSubmit={save} className="space-y-3">
          <input className={field} placeholder="What do you want?" value={name} onChange={e => setName(e.target.value)} aria-label="Goal name" />
          <MoneyInput big value={price} onChange={setPrice} aria-label="Price" />
          {price > 0 && perDay > 0 && <p className="text-[13px] text-emerald-300/90">That's about {Math.ceil(price / perDay)} days of not spending.</p>}
          <Button type="submit" className="w-full" disabled={!name.trim() || !(price > 0)}>Add to wishlist</Button>
        </form>
      </Modal>
    </Card>
  )
}

function IconBtn({ label, children, ...props }) {
  return <button type="button" aria-label={label} title={label} className="grid size-8 place-items-center rounded-lg text-slate-500 transition hover:bg-white/[.07] hover:text-white disabled:opacity-25 disabled:hover:bg-transparent" {...props}>{children}</button>
}
