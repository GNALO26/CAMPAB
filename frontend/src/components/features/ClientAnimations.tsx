// src/components/features/ClientAnimations.tsx
'use client'

import { useEffect } from 'react'

export default function ClientAnimations() {
  useEffect(() => {
    // Respecter les préférences de mouvement réduit
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (prefersReducedMotion.matches) {
      document.querySelectorAll('[data-reveal], [data-stagger]').forEach((el) => {
        el.classList.add('is-revealed')
      })
      return
    }

    // ============================================================
    // 1. SCROLL REVEAL
    // ============================================================
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            revealObserver.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    document.querySelectorAll('[data-reveal], [data-stagger]').forEach((el) => {
      revealObserver.observe(el)
    })

    // ============================================================
    // 2. COMPTEURS ANIMÉS
    // ============================================================
    function easeOut(t: number): number {
      return 1 - Math.pow(1 - t, 3)
    }

    function animateCounter(element: HTMLElement) {
      const target = parseFloat(element.dataset.counter || '0')
      const suffix = element.dataset.suffix || ''
      const prefix = element.dataset.prefix || ''
      const duration = parseInt(element.dataset.duration || '2000')
      const decimals = parseInt(element.dataset.decimals || '0')
      const startTime = performance.now()

      function tick(now: number) {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const value = easeOut(progress) * target
        element.textContent = prefix + value.toFixed(decimals) + suffix
        if (progress < 1) {
          requestAnimationFrame(tick)
        }
      }
      requestAnimationFrame(tick)
    }

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target as HTMLElement)
            counterObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )

    document.querySelectorAll('[data-counter]').forEach((el) => {
      counterObserver.observe(el)
    })

    // ============================================================
    // 3. BARRES DE COMPÉTENCES
    // ============================================================
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-bar__fill').forEach((bar) => {
              const width = (bar as HTMLElement).dataset.width || '0%'
              requestAnimationFrame(() => {
                ;(bar as HTMLElement).style.width = width
              })
            })
            skillObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.25 }
    )

    document.querySelectorAll('.skills-grid, .skill-group').forEach((el) => {
      skillObserver.observe(el)
    })

    // ============================================================
    // 4. BOUTON RETOUR EN HAUT
    // ============================================================
    const backTop = document.querySelector('.back-top') as HTMLElement | null
    let handleScroll: (() => void) | null = null

    if (backTop) {
      handleScroll = () => {
        backTop.classList.toggle('is-visible', window.scrollY > 500)
      }
      window.addEventListener('scroll', handleScroll, { passive: true })

      backTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    }

    // ============================================================
    // 5. NETTOYAGE
    // ============================================================
    return () => {
      revealObserver.disconnect()
      counterObserver.disconnect()
      skillObserver.disconnect()
      if (handleScroll) {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  return null
}