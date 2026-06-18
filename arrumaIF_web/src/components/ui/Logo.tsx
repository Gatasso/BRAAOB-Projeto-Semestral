export interface LogoProps {
  variant?: 'arrumaif' | 'ifsp'
  size?: 'default' | 'large'
  className?: string
}

export function Logo({ variant = 'arrumaif', size = 'default', className = '' }: LogoProps) {
  if (variant === 'ifsp') {
    return (
      <img
        src="/assets/ifsp-bra.png"
        alt="IFSP Bragança Paulista"
        className={`h-[59px] w-auto object-contain ${className}`}
      />
    )
  }

  if (size === 'large') {
    return (
      <img
        src="/assets/arrumaif-logo.png"
        alt="ArrumaÍF"
        className={`h-[150px] w-auto max-w-[420px] object-contain scale-110 rounded-[1.75rem] ${className}`}
      />
    )
  }

  return (
    <img
      src="/assets/arrumaif-logo.png"
      alt="ArrumaÍF"
      className={`h-[59px] w-[261px] object-contain rounded-[1.25rem] ${className}`}
    />
  )
}
