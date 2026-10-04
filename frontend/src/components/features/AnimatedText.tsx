// src/components/features/AnimatedText.tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

interface Props {
  words: string[]
  className?: string
  typingSpeed?: number
  deletingSpeed?: number
  pause?: number
  ariaLabel?: string
}

export default function AnimatedText({
  words,
  className = '',
  typingSpeed = 70,
  deletingSpeed = 35,
  pause = 1800,
  ariaLabel,
}: Props) {
  const safeWords = useMemo(
    () => (Array.isArray(words) ? words.filter((w) => typeof w === 'string' && w.length > 0) : []),
    [words],
  )

  const [index, setIndex] = useState(0)
  const [display, setDisplay] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* Respect de prefers-reduced-motion */
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (safeWords.length === 0) return

    /* Si l'utilisateur a désactivé les animations,
       on affiche directement le mot complet suivant en boucle. */
    if (reducedMotion) {
      setDisplay(safeWords[index % safeWords.length])
      const id = setTimeout(() => {
        setIndex((i) => (i + 1) % safeWords.length)
      }, pause)
      return () => clearTimeout(id)
    }

    const current = safeWords[index % safeWords.length]

    if (!deleting && display === current) {
      timeoutRef.current = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && display === '') {
      setDeleting(false)
      setIndex((i) => (i + 1) % safeWords.length)
    } else {
      const speed = deleting ? deletingSpeed : typingSpeed
      timeoutRef.current = setTimeout(() => {
        setDisplay((prev) =>
          deleting
            ? current.substring(0, prev.length - 1)
            : current.substring(0, prev.length + 1),
        )
      }, speed)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [display, deleting, index, safeWords, typingSpeed, deletingSpeed, pause, reducedMotion])

  /* Texte complet pour les lecteurs d'écran */
  const accessibleText = ariaLabel ?? safeWords.join(', ')

  return (
    <span className={className}>
      {/* Version visuelle, masquée aux lecteurs d'écran */}
      <span className="typewriter" aria-hidden="true">
        {display}
        <span className="typewriter__cursor" />
      </span>

      {/* Version accessible, lisible en entier */}
      <span className="sr-only">{accessibleText}</span>
    </span>
  )
}