import { APPS } from '../data/apps'

/** Opening: who I am, what this is, and the live apps fanned out like phones on a table. */
export default function Hero() {
  const live = APPS.filter(a => a.status === 'live')
  return (
    <section id="top" className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-8 lg:pb-24">
      <div className="animate-in">
        <p className="text-[15px] text-muted">Hi, I'm Jackson.</p>
        <h1 className="mt-3 max-w-[15ch] font-display text-[44px] font-bold leading-[1.02] tracking-[-0.035em] sm:text-[64px]">
          I make small apps for everyday things.
        </h1>
        <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.65] text-muted">
          Each one started as something I wanted for myself. I design and build them, use them, and keep improving them.
          They run in the browser, work well on a phone, and don't need an account.
        </p>
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Jump to an app">
          {APPS.map(a => (
            <li key={a.id}>
              <a href={`#${a.id}`} className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-[14px] text-fg transition-colors hover:border-faint">
                <span className="size-2 rounded-full" style={{ background: a.status === 'live' ? a.color : 'transparent', boxShadow: a.status === 'live' ? 'none' : `inset 0 0 0 1.5px ${a.color}` }} />
                {a.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* real screenshots, overlapping */}
      <div className="relative mx-auto h-[400px] w-full max-w-[420px] sm:h-[470px]" aria-hidden="true">
        {live.map((a, i) => (
          <div key={a.id} className="phone absolute top-0 w-[38%] animate-in"
            style={{
              left: `${[0, 20, 42, 62][i]}%`, top: `${[46, 8, 0, 40][i]}px`, zIndex: [1, 3, 4, 2][i],
              rotate: `${[-9, -3, 3, 9][i]}deg`, animationDelay: `${120 + i * 90}ms`,
            }}>
            <img src={a.shot} alt="" width="390" height="844" loading="eager" />
          </div>
        ))}
      </div>
    </section>
  )
}
