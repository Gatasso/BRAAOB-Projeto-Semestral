import { type ReactNode } from 'react'
import { Button } from './Button'

export interface DialogProps {
  open: boolean
  title?: string
  children?: ReactNode
  onClose?: () => void
  onConfirm?: () => void
  confirmLabel?: string
  cancelLabel?: string
  className?: string
}

export function Dialog({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = 'Salvar',
  cancelLabel = 'Voltar',
  className = '',
}: DialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay">
      <div
        className={`bg-white rounded-2xl shadow-lg w-full max-w-[466px] p-6 flex flex-col gap-4 ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {title && <h2 className="text-lg font-semibold text-text">{title}</h2>}
        {children && <div className="text-base text-text-secondary">{children}</div>}
        <div className="flex justify-end gap-3 mt-2">
          <Button variant="neutral" className="h-14 px-6" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant="primary-hug" className="h-14 px-6" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
