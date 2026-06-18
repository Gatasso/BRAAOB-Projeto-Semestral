const AUTH_KEY = 'arrumaif_auth'

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === 'true'
}

export function login(): void {
  localStorage.setItem(AUTH_KEY, 'true')
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY)
}
