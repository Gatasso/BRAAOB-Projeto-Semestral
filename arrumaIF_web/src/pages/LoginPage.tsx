import { useNavigate, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { LoginForm } from '@/components/ui'
import { LoginCarousel } from '@/components/layouts/LoginCarousel'
import { getUser, isAuthenticated, setUser } from '@/lib/auth'
import { login as loginApi } from '@/services/authService'
import { ApiError } from '@/services/api'

export function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  const handleLogin = async (data: { prontuario: string; senha: string }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await loginApi(data)
      setUser(response.usuario)
      navigate('/')
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível conectar ao servidor. Tente novamente.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 shrink-0 hidden lg:block">
        <LoginCarousel />
      </div>
      <div className="w-full lg:w-1/2 bg-login-bg flex items-center justify-center p-8">
        <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
      </div>
    </div>
  )
}

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const user = getUser()
  if (user && (user.tipo === 'TI' || user.tipo === 'Admin')) {
    return <Navigate to="/admin" replace />
  }
  if (user) {
    return <Navigate to="/" replace />
  }

  const handleLogin = async (data: { prontuario: string; senha: string }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await loginApi(data)
      if (response.usuario.tipo === 'TI' || response.usuario.tipo === 'Admin') {
        setUser(response.usuario)
        navigate('/admin')
      } else {
        setError('Este login é exclusivo para usuários administrativos (TI/Admin).')
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível conectar ao servidor. Tente novamente.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 shrink-0 hidden lg:block">
        <LoginCarousel />
      </div>
      <div className="w-full lg:w-1/2 bg-login-bg flex items-center justify-center p-8">
        <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
      </div>
    </div>
  )
}
