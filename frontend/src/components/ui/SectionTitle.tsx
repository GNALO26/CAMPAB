// src/components/ui/SectionTitle.tsx
type HeadingLevel = 'h1' | 'h2' | 'h3'
type Align = 'left' | 'center'

interface Props {
  label?: string
  title: string
  subtitle?: string
  align?: Align
  light?: boolean
  as?: HeadingLevel
  id?: string
  className?: string
}

export default function SectionTitle({
  label,
  title,
  subtitle,
  align = 'center',
  light = false,
  as: Heading = 'h2',
  id,
  className = '',
}: Props) {
  const classes = [
    'section-title',
    align === 'center' ? 'section-title--center' : 'section-title--left',
    light ? 'section-title--light' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      {label && <span className="section-title__label">{label}</span>}
      <Heading id={id} className="section-title__heading">
        {title}
      </Heading>
      {subtitle && <p className="section-title__subtitle">{subtitle}</p>}
    </div>
  )
}