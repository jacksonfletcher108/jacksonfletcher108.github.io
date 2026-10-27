import { ArrowUpRight, Nfc } from 'lucide-react'
import { cn } from '../lib/cn'

const SHORTLIST = ['A shopping list that fills itself from Supper recipes', 'Splitting shared bills', 'A pantry tracker that flags what to use up']

/** One app: what it does and why on one side, a real screenshot on the other. */
export default function AppRow({ app, flip, up, onOpen, onNfc }) {
  const Icon = app.icon
  const live = app.status === 'live'
  return (
    <article id={app.id} className="scroll-mt-8 border-t border-line py-14 sm:py-20">
      <div className={cn('grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16', flip && 'lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]')}>
        <div className={cn('min-w-0', flip && 'lg:order-2')}>
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-[13px]" style={{ background: `${app.color}1f`, color: app.color }}>
              <Icon className="size-[22px]" strokeWidth={2} />
            </span>
            <div>
              <h2 className="font-display text-[30px] font-bold leading-none tracking-tight sm:text-[34px]">{app.name}</h2>
              <p className="mt-1.5 flex items-center gap-2 text-[14px] text-muted">
                {app.kind}
                {live && <><span className="text-faint">·</span><span className="inline-flex items-center gap-1.5"><span className={cn('size-1.5 rounded-full', up === false ? 'bg-red-400' : 'bg-emerald-400')} />{up === false ? 'Offline right now' : 'Live'}</span></>}
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-[54ch] text-[17px] leading-[1.65] text-fg/90">{app.summary}</p>
          <p className="mt-4 max-w-[54ch] text-[15.5px] leading-relaxed text-muted">
            <span className="text-faint">Why I built it: </span>{app.why}
          </p>

          {app.details.length > 0 && (
            <ul className="mt-6 space-y-2.5">
              {app.details.map(d => (
                <li key={d} className="flex gap-3 text-[15px] text-muted">
                  <span className="mt-[9px] h-px w-3 shrink-0" style={{ background: app.color }} />{d}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <button type="button" onClick={() => onOpen(app.id)}
              className="rounded-full px-5 py-2.5 text-[15px] font-semibold text-[#111112] transition-transform hover:-translate-y-px active:translate-y-0"
              style={{ background: app.color }}>
              {live ? `Open ${app.name}` : 'See the shortlist'}
            </button>
            {live && (
              <a href={app.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[14.5px] text-muted transition-colors hover:text-fg">
                Open in a new tab<ArrowUpRight className="size-4" />
              </a>
            )}
            {app.nfc && (
              <button type="button" onClick={onNfc} className="inline-flex items-center gap-1.5 text-[14.5px] text-muted transition-colors hover:text-fg">
                <Nfc className="size-4" />Fridge tag setup
              </button>
            )}
          </div>
        </div>

        {/* visual */}
        <div className={cn('relative', flip && 'lg:order-1')}>
          {live ? (
            <button type="button" onClick={() => onOpen(app.id)} aria-label={`Open ${app.name}`}
              className="group relative mx-auto block w-full max-w-[420px] overflow-hidden rounded-[28px] px-10 pt-10 sm:px-16"
              style={{ background: `linear-gradient(160deg, ${app.color}30, ${app.color}0d 60%, transparent)` }}>
              <div className="phone relative mx-auto -mb-24 max-w-[270px] transition-transform duration-500 ease-out group-hover:-translate-y-2">
                <img src={app.shot} alt={`${app.name} on a phone`} width="390" height="844" loading="lazy" />
              </div>
            </button>
          ) : (
            <div className="mx-auto w-full max-w-[420px] rounded-[28px] border border-dashed border-line p-7">
              <p className="text-[13.5px] font-semibold" style={{ color: app.color }}>The shortlist</p>
              <ol className="mt-4 space-y-3">
                {SHORTLIST.map((s, i) => (
                  <li key={s} className="flex gap-3 text-[15.5px] leading-snug">
                    <span className="tabular w-4 shrink-0 text-faint">{i + 1}</span>{s}
                  </li>
                ))}
              </ol>
              <button type="button" onClick={() => onOpen(app.id)} className="mt-6 text-[14.5px] text-muted underline decoration-line underline-offset-4 transition-colors hover:text-fg">
                Vote or add an idea
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
