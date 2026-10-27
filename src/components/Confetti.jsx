import { useMemo } from 'react'

/** A small burst of paper, for wins. Renders nothing for people who prefer less motion. */
export default function Confetti({ burst }) {
  const bits = useMemo(() => Array.from({ length: 28 }, (_, i) => ({
    left: 50 + (Math.random() - 0.5) * 70, delay: Math.random() * 0.15, dur: 0.9 + Math.random() * 0.7,
    color: ['#34d399', '#2dd4bf', '#fbbf24', '#f472b6', '#a78bfa'][i % 5], size: 6 + Math.random() * 6,
  })), [burst]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!burst) return null
  return (
    <div key={burst} className="pointer-events-none fixed inset-x-0 top-[22%] z-[70] h-0 motion-reduce:hidden" aria-hidden="true">
      {bits.map((b, i) => (
        <span key={i} className="absolute rounded-[2px]" style={{ left: `${b.left}%`, width: b.size, height: b.size * 0.5, background: b.color, animation: `confetti ${b.dur}s ${b.delay}s ease-out both` }} />
      ))}
    </div>
  )
}
