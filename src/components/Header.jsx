import { useClock } from '../hooks/useClock'

export default function Header() {
  const now = useClock()
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' })
  return (
    <header className="mx-auto flex max-w-6xl items-center gap-6 px-5 pb-2 pt-[calc(20px+env(safe-area-inset-top))] sm:px-8">
      <a href="#top" className="font-display text-[17px] font-bold tracking-tight">Jackson Fletcher</a>
      <nav className="ml-auto flex items-center gap-5 text-[14.5px] text-muted" aria-label="Page">
        <a href="#apps" className="transition-colors hover:text-fg">Apps</a>
        <a href="#about" className="transition-colors hover:text-fg">About</a>
        <span className="tabular hidden text-faint sm:inline" title="My local time">{time} in Charleston</span>
      </nav>
    </header>
  )
}
