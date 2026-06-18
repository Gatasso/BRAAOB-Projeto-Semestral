import { Filter } from 'lucide-react'

export interface FilterButtonProps {
  onClick?: () => void
  className?: string
}

export function FilterButton({ onClick, className = '' }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 bg-white py-1 px-2 cursor-pointer hover:opacity-80 transition-opacity ${className}`}
    >
      <Filter size={22} className="text-primary" strokeWidth={1.5} />
      <span className="text-lg font-medium text-primary leading-none">Filtros</span>
    </button>
  )
}
