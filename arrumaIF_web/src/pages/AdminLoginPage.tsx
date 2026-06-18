import { useNavigate, Navigate } from 'react-router-dom'
import { LoginForm } from '@/components/ui'
import { LoginCarousel } from '@/components/layouts/LoginCarousel'
import { isAuthenticated, login } from '@/lib/auth'

export function AdminLoginPage() {
  const navigate = useNavigate()

  if (isAuthenticated()) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 shrink-0 hidden lg:block">
        <LoginCarousel />
      </div>
      <div className="w-full lg:w-1/2 bg-login-bg flex items-center justify-center p-8">
        <LoginForm
          onSubmit={() => {
            login()
            navigate('/admin')
          }}
        />
      </div>
    </div>
  )
}
