import {
  FilePlus,
  Home,
  LogOut,
  PlusCircle,
  User,
  Circle,
  type LucideIcon,
} from 'lucide-react'
import { type NavItem, type NavItemId } from './UserNavBar'

const admNavItems: NavItem[] = [
  { id: 'home', icon: Home, label: 'Início', href: '/admin' },
  { id: 'new', icon: PlusCircle, label: 'Novo chamado' },
  { id: 'info', icon: FilePlus, label: 'Gerenciar' },
  { id: 'profile', icon: User, label: 'Perfil' },
  { id: 'logout', icon: LogOut, label: 'Sair', href: '/admin/login' },
]

export interface AdmNavBarProps {
  activeId?: NavItemId
  onNavigate?: (id: NavItemId) => void
  className?: string
}

export function AdmNavBar({
  activeId = 'home',
  onNavigate,
  className = '',
}: AdmNavBarProps) {
  return (
    <nav
      className={`shrink-0 w-[74px] h-[min(905px,calc(100vh-3rem))] flex flex-col items-center py-6 gap-5 relative ${className}`}
      aria-label="Navegação administrativa"
    >
      <div className="absolute inset-0 bg-primary rounded-[113px]" />

      <button
        type="button"
        onClick={() => onNavigate?.('brand')}
        className="relative z-10 w-12 h-12 flex items-center justify-center text-white/90 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
        aria-label="Marca"
      >
        <Circle size={48} strokeWidth={1.5} />
      </button>

      {admNavItems.map((item) => {
        const Icon = item.icon as LucideIcon
        const isActive = item.id === activeId

        return (
          <button
            key={item.id}
            type="button"
            title={item.label}
            onClick={() => onNavigate?.(item.id)}
            className={`relative z-10 w-11 h-11 flex items-center justify-center rounded-full transition-colors cursor-pointer bg-transparent border-0 ${
              isActive ? 'text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            <Icon size={45} strokeWidth={1.5} />
          </button>
        )
      })}
    </nav>
  )
}
