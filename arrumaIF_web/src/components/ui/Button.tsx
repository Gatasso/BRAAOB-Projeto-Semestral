import { type ButtonHTMLAttributes, type ReactNode } from 'react'

export type ButtonVariant =
  | 'primary-full'
  | 'primary-hug'
  | 'confirm'
  | 'salvar-chamado'
  | 'equipamento'
  | 'mobilia'
  | 'upload'
  | 'neutral'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  'primary-full':
    'w-full max-w-[360px] h-12 rounded-xl bg-primary text-white text-base font-normal hover:bg-primary-active transition-colors',
  'primary-hug':
    'h-12 px-6 rounded-xl bg-primary text-white text-base font-normal hover:bg-primary-active transition-colors',
  confirm:
    'w-[227px] h-14 rounded-xl bg-primary text-white text-[30px] font-normal hover:bg-primary-active transition-colors',
  'salvar-chamado':
    'w-[302px] h-[66px] rounded-xl bg-primary text-[#f5f5f5] text-[30px] font-normal hover:bg-primary-active transition-colors',
  equipamento:
    'w-[303px] h-[65px] rounded-xl bg-primary text-[#f5f5f5] text-[30px] font-normal hover:bg-primary-active transition-colors',
  mobilia:
    'w-[303px] h-[65px] rounded-xl bg-primary text-[#f5f5f5] text-[30px] font-normal hover:bg-primary-active transition-colors',
  upload:
    'w-[175px] h-[46px] rounded-xl bg-primary text-white text-base font-normal hover:bg-primary-active transition-colors',
  neutral:
    'h-10 px-4 rounded-lg bg-search-bg text-text border border-border text-sm font-medium hover:bg-input-bg transition-colors',
}

export function Button({
  variant = 'primary-hug',
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
