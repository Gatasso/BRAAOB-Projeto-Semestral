import { useEffect, useState } from 'react'
import { PageLayout } from '@/components/layouts/PageLayout'
import { getUser } from '@/lib/auth'
import { fetchUsuario } from '@/services/usuarioService'
import { ApiError } from '@/services/api'
import type { UsuarioDetalhe } from '@/types/auth'

function formatDate(iso?: string) {
  if (!iso) return 'Não disponível'
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export function PerfilPage() {
  const localUser = getUser()
  const [user, setUser] = useState<UsuarioDetalhe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!localUser) {
      setError('Usuário não autenticado.')
      setLoading(false)
      return
    }

    fetchUsuario(localUser.id)
      .then(setUser)
      .catch((err) => {
        setError(
          err instanceof ApiError
            ? err.message
            : 'Não foi possível carregar os dados do perfil.',
        )
        setUser({
          ...localUser,
          email: 'Não disponível',
          ativo: true,
          criado_em: '',
        })
      })
      .finally(() => setLoading(false))
  }, [localUser])

  const profile = user ?? localUser

  if (!profile) {
    return (
      <PageLayout activeNav="profile">
        <div className="px-10 py-20 text-center">
          <p className="text-alert">Usuário não encontrado.</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout activeNav="profile">
      <div className="px-10 py-8 max-w-5xl mx-auto">
        <h1 className="text-[32px] font-bold text-text mb-4">Perfil do Usuário</h1>
        <p className="text-base text-text-secondary mb-10">
          Informações carregadas da API de usuário e do login.
        </p>

        {loading && (
          <p className="text-text-secondary">Carregando informações do perfil...</p>
        )}

        {error && (
          <div className="bg-alert/10 border border-alert rounded-2xl p-6 mb-8">
            <p className="text-alert">{error}</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-search-bg rounded-3xl p-8">
              <p className="text-sm uppercase tracking-[0.24em] text-text-secondary mb-3">
                Identificação
              </p>
              <p className="text-lg font-semibold text-text mb-4">{profile.nome}</p>
              <p className="text-sm text-text-secondary">Prontuário</p>
              <p className="text-base text-text mb-4">{profile.prontuario}</p>
              <p className="text-sm text-text-secondary">Tipo de usuário</p>
              <p className="text-base text-text mb-4">{profile.tipo}</p>
              <p className="text-sm text-text-secondary">Status</p>
              <p className="text-base text-text">{profile.ativo ? 'Ativo' : 'Inativo'}</p>
            </div>

            <div className="bg-search-bg rounded-3xl p-8">
              <p className="text-sm uppercase tracking-[0.24em] text-text-secondary mb-3">
                Contato e origem
              </p>
              <p className="text-sm text-text-secondary">Email</p>
              <p className="text-base text-text mb-4">{profile.email ?? 'Não disponível'}</p>
              <p className="text-sm text-text-secondary">ID do usuário</p>
              <p className="text-base text-text mb-4 break-all">{profile.id}</p>
              <p className="text-sm text-text-secondary">Registro</p>
              <p className="text-base text-text">
                {formatDate(profile.criado_em)}
              </p>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
