import { User, Lock } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'

export interface LoginFormProps {
  onSubmit?: (data: { prontuario: string; senha: string }) => void | Promise<void>
  loading?: boolean
  error?: string | null
  className?: string
}

export function LoginForm({
  onSubmit,
  loading = false,
  error = null,
  className = '',
}: LoginFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    await onSubmit?.({
      prontuario: String(form.get('prontuario') ?? ''),
      senha: String(form.get('senha') ?? ''),
    })
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] w-full max-w-[520px] p-6 flex flex-col items-center ${className}`}
    >
      <div className="mb-6 flex items-center justify-center w-full">
        <img
          src="/assets/ifsp-bra.png"
          alt="IFSP Bragança Paulista"
          className="h-[156px] w-auto object-contain"
        />
      </div>

      <h2 className="text-xl text-[rgba(0,0,0,0.87)] text-center mb-6">
        Bem-vindo ao ArrumaÍF
      </h2>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        <Input
          name="prontuario"
          icon={User}
          placeholder="Prontuário"
          required
        />
        <Input
          name="senha"
          type="password"
          icon={Lock}
          placeholder="Senha"
          required
        />
        <Button
          variant="primary-full"
          type="submit"
          className="max-w-full w-full"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
        {error && (
          <p className="text-sm text-alert text-center" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  )
}
