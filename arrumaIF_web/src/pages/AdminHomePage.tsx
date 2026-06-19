import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '@/components/layouts/PageLayout'
import { EquipamentoCard, FilterButton, Logo } from '@/components/ui'
import { fetchTodasSolicitacoes } from '@/services/solicitacaoService'
import type { ChamadoUI, SolicitacaoStatus } from '@/types/solicitacao'
import { detalheToChamadoUI } from '@/utils/chamadoMappers'
import { ApiError } from '@/services/api'

export function AdminHomePage() {
  const navigate = useNavigate()
  const [chamados, setChamados] = useState<ChamadoUI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<SolicitacaoStatus | 'Todos'>('Todos')
  const [filterOpen, setFilterOpen] = useState(false)

  const loadChamados = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchTodasSolicitacoes()
      setChamados(data.map((s) => detalheToChamadoUI(s)))
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Erro ao carregar chamados.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadChamados()
  }, [loadChamados])

  const filteredChamados =
    statusFilter === 'Todos'
      ? chamados
      : chamados.filter((c) => c.status === statusFilter)

  return (
    <PageLayout variant="admin" activeNav="home">
      <div className="px-10 py-6">
        <header className="text-center mb-10">
          <p className="text-[28px] font-bold text-text mb-2">Sejam Bem-Vindos ao</p>
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <p className="text-base text-text-secondary">
            Painel administrativo — IFSP-BRA
          </p>
        </header>

        <div className="flex items-center gap-4 mb-8 relative">
          <h2 className="text-[32px] font-bold text-text">Seus chamados:</h2>
          <FilterButton onClick={() => setFilterOpen((v) => !v)} />
          {filterOpen && (
            <div className="absolute top-full left-48 mt-2 bg-white border border-border rounded-xl shadow-lg p-3 z-10 min-w-[220px]">
              {(['Todos', 'Registrada', 'Andamento', 'Aguardo', 'Concluída', 'Contestada'] as const).map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setStatusFilter(status)
                      setFilterOpen(false)
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer border-0 ${
                      statusFilter === status
                        ? 'bg-primary text-white'
                        : 'bg-transparent text-text hover:bg-input-bg'
                    }`}
                  >
                    {status}
                  </button>
                ),
              )}
            </div>
          )}
        </div>

        {loading && (
          <p className="text-center text-text-secondary py-12">Carregando chamados...</p>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-alert mb-4">{error}</p>
            <button
              type="button"
              onClick={loadChamados}
              className="text-primary underline bg-transparent border-0 cursor-pointer"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && filteredChamados.length === 0 && (
          <p className="text-center text-text-secondary py-12">Nenhum chamado encontrado.</p>
        )}

        {!loading && !error && filteredChamados.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {filteredChamados.map((chamado) => (
              <EquipamentoCard
                key={chamado.id}
                title={chamado.titulo}
                imageSrc={chamado.imagem}
                onClick={() => navigate(`/admin/chamado/${chamado.id}/editar`)}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
