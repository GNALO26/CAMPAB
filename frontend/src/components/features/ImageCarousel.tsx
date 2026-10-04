// src/components/features/ImageCarousel.tsx
'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface CarouselSlide {
  src: string
  alt: string
}

interface Props {
  slides: CarouselSlide[]
  /** Durée en ms entre deux transitions automatiques. 0 pour désactiver. */
  autoPlayMs?: number
}

export default function ImageCarousel({ slides, autoPlayMs = 6500 }: Props) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const count = slides.length

  const goTo = useCallback((next: number) => {
    setIndex(((next % count) + count) % count)
  }, [count])

  const goNext = useCallback(() => goTo(index + 1), [goTo, index])
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index])

  /* Rotation automatique */
  useEffect(() => {
    if (autoPlayMs <= 0 || paused || count <= 1) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    timerRef.current = setInterval(goNext, autoPlayMs)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [autoPlayMs, paused, count, goNext])

  /* Navigation clavier */
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); goPrev() }
    if (event.key === 'ArrowRight') { event.preventDefault(); goNext() }
  }

  if (count === 0) return null

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carrousel"
      aria-label="Portraits de la juriste"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="carousel__viewport">
        <div
          className="carousel__track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.src}
              className="carousel__slide"
              role="group"
              aria-roledescription="diapositive"
              aria-label={`${i + 1} sur ${count}`}
              aria-hidden={i !== index}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              className="carousel__arrow carousel__arrow--prev"
              onClick={goPrev}
              aria-label="Image précédente"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="carousel__arrow carousel__arrow--next"
              onClick={goNext}
              aria-label="Image suivante"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>

            <div className="carousel__dots" role="tablist" aria-label="Sélection de l’image">
              {slides.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  role="tab"
                  className={`carousel__dot ${i === index ? 'is-active' : ''}`}
                  aria-selected={i === index}
                  aria-label={`Aller à l’image ${i + 1}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}