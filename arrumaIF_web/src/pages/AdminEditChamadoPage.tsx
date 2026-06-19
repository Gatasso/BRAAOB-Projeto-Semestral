import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageLayout } from '@/components/layouts/PageLayout'
import {
  Button,
  ImageUploadArea,
  SelectInput,
  TabBar,
  Textarea,
} from '@/components/ui'
import { getUser } from '@/lib/auth'
import { fetchDefeitos, fetchLocais, fetchEquipamentos, fetchMobiliarios } from '@/services/catalogoService'
import { fetchUsuario } from '@/services/usuarioService'
import {
  atualizarSolicitacao,
  fetchSolicitacaoDetalhe,
} from '@/services/solicitacaoService'
import {
  detalheToChamadoUI,
  findDefeitoTitulo,
  formatHistorico,
} from '@/utils/chamadoMappers'
import { ApiError } from '@/services/api'

export function AdminEditChamadoPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Detalhes')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [titulo, setTitulo] = useState('')
  const [localizacao, setLocalizacao] = useState('')
  const [equipamento, setEquipamento] = useState('')
  const [numero, setNumero] = useState('')
  const [descricao, setDescricao] = useState('')
  const [historico, setHistorico] = useState('')
  const [idDefeito, setIdDefeito] = useState<number>(0)

  const [locaisOptions, setLocaisOptions] = useState<{ value: string; label: string }[]>([])
  const [defeitosOptions, setDefeitosOptions] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    if (!id) return

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [detalhe, locais, defeitos] = await Promise.all([
          fetchSolicitacaoDetalhe(id),
          fetchLocais(),
          fetchDefeitos(),
        ])

        const defeitoTitulo = findDefeitoTitulo(defeitos, detalhe.id_defeito)

        const materialPromise = (async () => {
          if (detalhe.cod_patrimonio) {
            const equipamentos = await fetchEquipamentos(detalhe.cod_sala)
            return (
              equipamentos.find((e) => e.cod_patrimonio === detalhe.cod_patrimonio)
                ?.nome ?? detalhe.cod_patrimonio
            )
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

        const [material, numero] = await Promise.all([materialPromise, numeroPromise])

        const ui = detalheToChamadoUI(detalhe, defeitoTitulo, material, numero)

        setTitulo(ui.titulo)
        setLocalizacao(detalhe.cod_sala)
        setEquipamento(ui.equipamento)
        setNumero(ui.numero)
        setDescricao(detalhe.descricao_defeito ?? '')
        setHistorico(formatHistorico(detalhe.historico))
        setIdDefeito(detalhe.id_defeito)

        setLocaisOptions(
          locais.map((l) => ({
            value: l.cod_sala,
            label: l.descricao ? `${l.cod_sala} — ${l.descricao}` : l.cod_sala,
          })),
        )
        setDefeitosOptions(
          defeitos.map((d) => ({
            value: String(d.id_defeito),
            label: d.titulo,
          })),
        )
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : 'Erro ao carregar chamado.',
        )
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  const handleSave = async () => {
    const user = getUser()
    if (!user || !id) return

    setSaving(true)
    setSaveError(null)
    try {
      await atualizarSolicitacao(id, {
        usuario_id: user.id,
        cod_sala: localizacao,
        id_defeito: idDefeito,
        descricao_defeito: descricao,
      })
      navigate('/admin')
    } catch (err) {
      setSaveError(
        err instanceof ApiError
          ? err.message
          : 'Erro ao salvar chamado.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <PageLayout variant="admin" activeNav="home">
        <p className="text-center text-text-secondary py-20">Carregando chamado...</p>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout variant="admin" activeNav="home">
        <div className="text-center py-20">
          <p className="text-alert mb-4">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="text-primary underline bg-transparent border-0 cursor-pointer"
          >
            Voltar
          </button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout variant="admin" activeNav="home">
      <div className="px-10 py-8">
        <h1 className="text-[32px] font-bold text-text text-center mb-8">
          Editando Chamado
        </h1>

        <div className="flex gap-6">
          <div className="flex-1 bg-search-bg rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-text mb-6">{titulo}</h2>

            <SelectInput
              label="Localização:"
              value={localizacao}
              onChange={setLocalizacao}
              options={locaisOptions}
              className="mb-6"
            />

            <p className="text-base text-text-secondary mb-2">Imagem anexada:</p>
            <ImageUploadArea className="min-h-[246px]" />

            <div className="mt-6">
              <Button
                variant="salvar-chamado"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Salvar Chamado'}
              </Button>
              {saveError && (
                <p className="text-alert mt-3 text-sm" role="alert">
                  {saveError}
                </p>
              )}
            </div>
          </div>

          <div className="flex-1 bg-search-bg rounded-2xl p-6">
            <SelectInput
              label="Equipamento:"
              value={equipamento}
              onChange={setEquipamento}
              options={[{ value: equipamento, label: equipamento }]}
              className="mb-4"
            />

            <SelectInput
              label="Número Equipamento:"
              value={numero}
              onChange={setNumero}
              options={[{ value: numero, label: numero }]}
              className="mb-4"
            />

            <SelectInput
              label="Defeito:"
              value={String(idDefeito)}
              onChange={(v) => setIdDefeito(Number(v))}
              options={defeitosOptions}
              className="mb-6"
            />

            <TabBar
              tabs={['Detalhes', 'Histórico']}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              className="mb-6"
            />

            {activeTab === 'Detalhes' ? (
              <Textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="min-h-[280px]"
              />
            ) : (
              <div className="bg-white rounded-xl p-4 min-h-[280px]">
                <p className="text-base text-text-secondary whitespace-pre-line">
                  {historico}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
