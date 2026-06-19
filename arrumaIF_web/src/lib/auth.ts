import type { Usuario } from '@/types/auth'

const AUTH_USER_KEY = 'arrumaif_user'

export function getUser(): Usuario | null {
  const raw = localStorage.getItem(AUTH_USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Usuario
  } catch {
    return null
  }
}

export function setUser(user: Usuario): void {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function isAuthenticated(): boolean {
  return getUser() !== null
}

export function isAdminUser(): boolean {
  const user = getUser()
  return user?.tipo === 'TI' || user?.tipo === 'Admin'
}

export function logout(): void {
  localStorage.removeItem(AUTH_USER_KEY)
}
