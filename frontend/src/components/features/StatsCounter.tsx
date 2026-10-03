"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/lib/site";

// ⚠️ Correction : accepter RefObject<T | null> pour React 19
function useInView<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);

  return inView;
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsCounter() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-olive">
            <Counter value={s.value} suffix={s.suffix} />
          </div>
          <p className="mt-3 text-sm sm:text-base text-sky/90 tracking-wide uppercase">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}