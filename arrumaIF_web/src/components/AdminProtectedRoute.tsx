import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getUser, isAuthenticated } from '@/lib/auth'

interface AdminProtectedRouteProps {
  children: ReactNode
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }

  const user = getUser()
  if (user?.tipo !== 'TI' && user?.tipo !== 'Admin') {
    return <Navigate to="/" replace />
  }

  return children
}
