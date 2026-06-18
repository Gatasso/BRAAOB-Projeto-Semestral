import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserNavBar,
  AdmNavBar,
  type NavItemId,
} from '@/components/ui'
import { logout } from '@/lib/auth'

export interface PageLayoutProps {
  children: ReactNode
  variant?: 'user' | 'admin'
  activeNav?: NavItemId
  showBack?: boolean
  onBack?: () => void
  className?: string
}

const userRoutes: Partial<Record<NavItemId, string>> = {
  home: '/',
  new: '/chamado/novo',
  info: '/informativo',
  logout: '/login',
  back: '-1',
}

const adminRoutes: Partial<Record<NavItemId, string>> = {
  home: '/admin',
  logout: '/admin/login',
}

export function PageLayout({
  children,
  variant = 'user',
  activeNav = 'home',
  showBack = false,
  onBack,
  className = '',
}: PageLayoutProps) {
  const navigate = useNavigate()
  const routes = variant === 'admin' ? adminRoutes : userRoutes

  const handleNavigate = (id: NavItemId) => {
    if (id === 'logout') {
      logout()
    }

    const route = routes[id]
    if (route === '-1') {
      navigate(-1)
      return
    }
    if (route) navigate(route)
  }

  return (
    <div className={`min-h-screen flex bg-white ${className}`}>
      <aside className="shrink-0 pl-10 pr-6 pt-6 pb-6 flex h-screen sticky top-0 self-start overflow-y-auto">
        {variant === 'admin' ? (
          <AdmNavBar activeId={activeNav} onNavigate={handleNavigate} />
        ) : (
          <UserNavBar
            activeId={activeNav}
            onNavigate={handleNavigate}
            onBack={onBack}
            showBack={showBack}
            className="min-h-[calc(100vh-3rem)]"
          />
        )}
      </aside>
      <main className="flex-1 min-w-0 overflow-auto pl-4">{children}</main>
    </div>
  )
}
