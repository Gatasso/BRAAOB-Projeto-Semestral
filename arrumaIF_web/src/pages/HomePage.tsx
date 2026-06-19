import { useCallback, useEffect, useState } from 'react'
import { PageLayout } from '@/components/layouts/PageLayout'
import { ChamadoDetalhesModal } from '@/components/ChamadoDetalhesModal'
import { EquipamentoCard, FilterButton, Logo } from '@/components/ui'
import { getUser } from '@/lib/auth'
import { fetchDefeitos, fetchEquipamentos, fetchMobiliarios } from '@/services/catalogoService'
import { fetchUsuario } from '@/services/usuarioService'
import {
  fetchSolicitacaoDetalhe,
  fetchSolicitacoesPorUsuario,
} from '@/services/solicitacaoService'
import type { ChamadoUI, SolicitacaoStatus } from '@/types/solicitacao'
import {
  detalheToChamadoUI,
  findDefeitoTitulo,
  resumoToChamadoUI,
} from '@/utils/chamadoMappers'
import { ApiError } from '@/services/api'

const STATUS_OPTIONS: (SolicitacaoStatus | 'Todos')[] = [
  'Todos',
  'Registrada',
  'Visualizada',
  'Andamento',
  'Aguardo',
  'Concluída',
  'Concluída sem Intervenção',
  'Contestada',
]

export function HomePage() {
  const [chamados, setChamados] = useState<ChamadoUI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<SolicitacaoStatus | 'Todos'>('Todos')
  const [filterOpen, setFilterOpen] = useState(false)

  const [selectedChamado, setSelectedChamado] = useState<ChamadoUI | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

  const loadChamados = useCallback(async () => {
    const user = getUser()
    if (!user) return

    setLoading(true)
    setError(null)
    try {
      const resumos = await fetchSolicitacoesPorUsuario(user.id)
      setChamados(resumos.map(resumoToChamadoUI))
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Erro ao carregar seus chamados.',
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

  const openChamado = async (chamado: ChamadoUI) => {
    setModalOpen(true)
    setDetailLoading(true)
    setSelectedChamado(chamado)
    try {
      const [detalhe, defeitos] = await Promise.all([
        fetchSolicitacaoDetalhe(chamado.id),
        fetchDefeitos(),
      ])

      const titulo = findDefeitoTitulo(defeitos, detalhe.id_defeito)

      const materialPromise = (async () => {
        if (detalhe.cod_patrimonio) {
          // const equipamentos = await fetchEquipamentos(detalhe.cod_sala)
          // return (
          //   equipamentos.find((e) => e.cod_patrimonio === detalhe.cod_patrimonio)
          //     ?.nome ?? detalhe.cod_patrimonio
          // )
          try {
            const equipamentos = await fetchEquipamentos(detalhe.cod_sala)
            const equipamentoEncontrado = equipamentos.find(
              (e) => String(e.cod_patrimonio).trim() === String(detalhe.cod_patrimonio).trim()
            )
            
            // 💡 A MÁGICA AQUI: Se não achar na API de equipamentos, 
            // usa o chamado.equipamento que a Home já tinha e sabe que está certo!
            return equipamentoEncontrado?.nome ?? chamado.equipamento ?? 'Equipamento'
          } catch {
            return chamado.equipamento ?? 'Equipamento'
          }
        }
        if (detalhe.mobiliario_id) {
          const mobiliarios = await fetchMobiliarios()
          return (
            mobiliarios.find((m) => m.id === detalhe.mobiliario_id)?.nome ??
            `Mobiliário #${detalhe.mobiliario_id}`
          )
        }
        if (detalhe.componente_id) {
          return `Componente #${detalhe.componente_id}`
        }
        return 'Material'
      })()

      const numeroPromise = (async () => {
        if (detalhe.cod_patrimonio) return detalhe.cod_patrimonio
        if (detalhe.mobiliario_id) return '-'
        if (detalhe.componente_id) return String(detalhe.componente_id)
        return '—'
      })()

      const historicoPromise = (async () => {
        const ids = Array.from(
          new Set(detalhe.historico.map((item) => item.usuario_id).filter(Boolean)),
        )
        const lookup = new Map<string, string>()
        await Promise.all(
          ids.map(async (id) => {
            try {
              const user = await fetchUsuario(id)
              lookup.set(id, user.nome)
            } catch {
              // ignore lookup failures
            }
          }),
        )
        return detalhe.historico.map((item) => ({
          ...item,
          usuario_nome: lookup.get(item.usuario_id) ?? item.usuario_id,
        }))
      })()

      const [material, numero, historico] = await Promise.all([
        materialPromise,
        numeroPromise,
        historicoPromise,
      ])

      setSelectedChamado(
        detalheToChamadoUI(detalhe, titulo, material, numero, historico),
      )
    } catch {
      setSelectedChamado(chamado)
    } finally {
      setDetailLoading(false)
    }
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedChamado(null)
  }

  return (
    <PageLayout activeNav="home" showBack={false}>
      <div className="px-10 pt-20 pb-10">
        <header className="text-center mb-14">
          <p className="text-[28px] font-bold text-text mb-5">Sejam Bem-Vindos ao</p>
          <div className="flex justify-center mb-6 overflow-visible">
            <Logo size="large" />
          </div>
          <p className="text-3xl font-medium text-primary max-w-3xl mx-auto">
            Seu sistema de reporte para reparos no IFSP-BRA
          </p>
        </header>

        <div className="flex items-center gap-4 mb-8 relative">
          <h2 className="text-[32px] font-bold text-text">Seus chamados:</h2>
          <FilterButton onClick={() => setFilterOpen((v) => !v)} />
          {filterOpen && (
            <div className="absolute top-full left-48 mt-2 bg-white border border-border rounded-xl shadow-lg p-3 z-10 min-w-[220px]">
              {STATUS_OPTIONS.map((status) => (
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
              ))}
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
          <p className="text-center text-text-secondary py-12">
            Nenhum chamado encontrado.
          </p>
        )}

        {!loading && !error && filteredChamados.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            {filteredChamados.map((chamado) => (
              <EquipamentoCard
                key={chamado.id}
                title={chamado.titulo}
                imageSrc={chamado.imagem}
                onClick={() => openChamado(chamado)}
              />
            ))}
          </div>
        )}
      </div>

      <ChamadoDetalhesModal
        chamado={selectedChamado}
        open={modalOpen}
        onClose={closeModal}
        loading={detailLoading}
      />
    </PageLayout>
  )
}
