import {
  Home,
  Info,
  LogOut,
  PlusCircle,
  User,
  ChevronLeft,
  type LucideIcon,
} from 'lucide-react'

export type NavItemId =
  | 'back'
  | 'home'
  | 'new'
  | 'info'
  | 'profile'
  | 'logout'
  | 'brand'

export interface NavItem {
  id: NavItemId
  icon: LucideIcon
  label: string
  href?: string
}

const topNavItems: NavItem[] = [
  { id: 'back', icon: ChevronLeft, label: 'Voltar' },
  { id: 'home', icon: Home, label: 'Início', href: '/' },
  { id: 'new', icon: PlusCircle, label: 'Novo chamado', href: '/chamado/novo' },
  { id: 'info', icon: Info, label: 'Informativo', href: '/informativo' },
]

const bottomNavItems: NavItem[] = [
  { id: 'profile', icon: User, label: 'Perfil' },
  { id: 'logout', icon: LogOut, label: 'Sair', href: '/login' },
]

export interface UserNavBarProps {
  activeId?: NavItemId
  onNavigate?: (id: NavItemId) => void
  onBack?: () => void
  showBack?: boolean
  className?: string
}

function NavIconButton({
  item,
  isActive,
  onNavigate,
}: {
  item: NavItem
  isActive: boolean
  onNavigate?: (id: NavItemId) => void
}) {
  const Icon = item.icon

  return (
    <button
      type="button"
      title={item.label}
      onClick={() => onNavigate?.(item.id)}
      className={`relative z-10 w-11 h-11 flex items-center justify-center rounded-full transition-colors cursor-pointer bg-transparent border-0 ${
        isActive ? 'text-white' : 'text-white/70 hover:text-white'
      }`}
    >
      <Icon size={item.id === 'back' ? 46 : 45} strokeWidth={1.5} />
    </button>
  )
}

export function UserNavBar({
  activeId = 'home',
  onNavigate,
  onBack,
  showBack = false,
  className = '',
}: UserNavBarProps) {
  const mainItems = topNavItems.filter((item) => item.id !== 'back')

  return (
    <nav
      className={`shrink-0 w-[74px] h-full flex flex-col items-center py-6 relative ${className}`}
      aria-label="Navegação principal"
    >
      <div className="absolute inset-0 bg-primary rounded-[113px]" />

      <button
        type="button"
        onClick={() => (showBack ? onBack?.() : onNavigate?.('brand'))}
        className="relative z-10 w-14 h-14 rounded-full bg-alert shrink-0 cursor-pointer border-0 hover:opacity-90 transition-opacity flex items-center justify-center"
        aria-label={showBack ? 'Voltar' : 'Marca'}
      >
        {showBack ? <ChevronLeft size={28} strokeWidth={1.5} className="text-white" /> : null}
      </button>

      <div className="relative z-10 flex flex-col items-center gap-6 mt-6">
        {mainItems.map((item) => (
          <NavIconButton
            key={item.id}
            item={item}
            isActive={item.id === activeId}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      <div className="flex-1" />

      <div className="relative z-10 flex flex-col items-center gap-6 mb-2">
        {bottomNavItems.map((item) => (
          <NavIconButton
            key={item.id}
            item={item}
            isActive={item.id === activeId}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </nav>
  )
}
