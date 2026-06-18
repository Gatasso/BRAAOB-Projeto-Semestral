export interface EquipamentoCardProps {
  title: string
  imageSrc: string
  onClick?: () => void
  className?: string
}

export function EquipamentoCard({
  title,
  imageSrc,
  onClick,
  className = '',
}: EquipamentoCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full max-w-[707px] h-[239px] rounded-3xl overflow-hidden cursor-pointer border-0 p-0 text-left group ${className}`}
    >
      <img
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.6)] to-transparent flex items-end p-4">
        <span className="text-lg font-bold text-white leading-7">{title}</span>
      </div>
    </button>
  )
}
