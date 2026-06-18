import { AlertCircle, type LucideIcon } from 'lucide-react'

export interface AlertBannerProps {
  message: string
  icon?: LucideIcon
  className?: string
  onDark?: boolean
}

export function AlertBanner({
  message,
  icon: Icon = AlertCircle,
  className = '',
  onDark = false,
}: AlertBannerProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Icon
        size={40}
        className={`shrink-0 ${onDark ? 'text-white' : 'text-primary'}`}
      />
      <p
        className={`text-xl leading-snug ${onDark ? 'text-white' : 'text-text'}`}
      >
        {message}
      </p>
    </div>
  )
}

export interface InfoRowProps {
  icon: LucideIcon
  label: string
  className?: string
  onDark?: boolean
}

export function InfoRow({
  icon: Icon,
  label,
  className = '',
  onDark = false,
}: InfoRowProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Icon
        size={40}
        className={`shrink-0 ${onDark ? 'text-white' : 'text-primary'}`}
      />
      <p
        className={`text-xl leading-snug ${onDark ? 'text-white' : 'text-text'}`}
      >
        {label}
      </p>
    </div>
  )
}
