// src/components/ui/Button.tsx
import Link from 'next/link'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'olive' | 'outline' | 'outline-white' | 'ghost'
type Size = 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  children: ReactNode
  variant?: Variant
  size?: Size
  href?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
  external?: boolean
  fullWidth?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  className?: string
  'aria-label'?: string
}

const variantClass: Record<Variant, string> = {
  primary: 'btn--primary',
  olive: 'btn--olive',
  outline: 'btn--outline',
  'outline-white': 'btn--outline-white',
  ghost: 'btn--ghost',
}

const sizeClass: Record<Size, string> = {
  sm: 'btn--sm',
  md: 'btn--md',
  lg: 'btn--lg',
  xl: 'btn--xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  type = 'button',
  onClick,
  disabled = false,
  external = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  className = '',
  'aria-label': ariaLabel,
}: Props) {
  const classes = [
    'btn',
    variantClass[variant],
    sizeClass[size],
    fullWidth ? 'btn--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {iconLeft && <span className="btn__icon" aria-hidden="true">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && (
        <span className="btn__icon btn__icon--right" aria-hidden="true">
          {iconRight}
        </span>
      )}
    </>
  )

  /* Lien externe ou protocole spécial (mailto, tel) */
  if (href && (external || /^(https?:|mailto:|tel:)/.test(href))) {
    return (
      <a
        href={href}
        className={classes}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    )
  }

  /* Lien interne Next.js */
  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} aria-label={ariaLabel}>
        {content}
      </Link>
    )
  }

  /* Bouton natif */
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  )
}