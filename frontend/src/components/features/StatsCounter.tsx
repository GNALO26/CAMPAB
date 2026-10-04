// src/components/features/StatsCounter.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { stats } from '@/lib/site'

function useInView<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([entry]) => entry.isIntersecting && setInView(true), { threshold: 0.3 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref])
  return inView
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref)

  useEffect(() => {
    if (!inView) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value)
      return
    }
    let start = 0
    const duration = 1800
    let raf = 0
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setCount(Math.floor(p * value))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

export default function StatsCounter() {
  return (
    <div className="stats-band__grid">
      {stats.map((s) => (
        <div key={s.label} className="stat-card">
          <div className="stat-card__num">
            <Counter value={s.value} suffix={s.suffix} />
          </div>
          <p className="stat-card__label">{s.label}</p>
        </div>
      ))}
    </div>
  )
}