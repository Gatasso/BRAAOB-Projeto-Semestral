import { FilePlus } from 'lucide-react'
import { Button } from './Button'

export interface UploadButtonProps {
  onClick?: () => void
  className?: string
}

export function UploadButton({ onClick, className = '' }: UploadButtonProps) {
  return (
    <Button variant="upload" onClick={onClick} className={`gap-2 ${className}`}>
      <FilePlus size={20} />
      Upload
    </Button>
  )
}

export interface ImageUploadAreaProps {
  onUpload?: () => void
  className?: string
}

export function ImageUploadArea({ onUpload, className = '' }: ImageUploadAreaProps) {
  return (
    <div
      className={`bg-input-bg rounded-xl p-8 flex flex-col items-center justify-center gap-6 min-h-[315px] ${className}`}
    >
      <p className="text-base text-text-secondary text-center max-w-[450px]">
        Insira uma imagem abaixo para facilitar a compreensão do técnico sobre este
        chamado
      </p>
      <UploadButton onClick={onUpload} />
    </div>
  )
}
