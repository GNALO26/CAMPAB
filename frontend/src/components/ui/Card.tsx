// src/components/ui/Card.tsx
import type { CSSProperties, ReactNode } from 'react'

type Variant = 'default' | 'navy' | 'olive' | 'sky'
type Padding = 'sm' | 'md' | 'lg'

interface Props {
  children: ReactNode
  variant?: Variant
  padding?: Padding
  hover?: boolean
  className?: string
  style?: CSSProperties
}

const variantClass: Record<Variant, string> = {
  default: '',
  navy: 'card--navy',
  olive: 'card--olive',
  sky: 'card--sky',
}

const paddingClass: Record<Padding, string> = {
  sm: 'card--pad-sm',
  md: 'card--pad-md',
  lg: 'card--pad-lg',
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  style,
}: Props) {
  const classes = [
    'card',
    variantClass[variant],
    paddingClass[padding],
    hover ? 'card--hover' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  )
}