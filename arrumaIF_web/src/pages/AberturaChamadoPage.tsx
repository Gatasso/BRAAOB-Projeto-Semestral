import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '@/components/layouts/PageLayout'
import {
  Button,
  CheckboxGroup,
  Dialog,
  Input,
  Textarea,
} from '@/components/ui'
import { getUser } from '@/lib/auth'
import {
  fetchDefeitos,
  fetchEquipamentos,
  fetchLocais,
  fetchMobiliarios,
} from '@/services/catalogoService'
import { criarSolicitacao } from '@/services/solicitacaoService'
import type { DefeitoCatalogo, Equipamento, Mobiliario } from '@/types/catalogo'
import { groupLocaisPorAndar } from '@/utils/chamadoMappers'
import { ApiError } from '@/services/api'

type TipoMaterial = 'equipamento' | 'mobilia' | null

const CATEGORIA_POR_TIPO: Record<Exclude<TipoMaterial, null>, 'Equipamento' | 'Mobília'> = {
  equipamento: 'Equipamento',
  mobilia: 'Mobília',
}

export function AberturaChamadoPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [tipo, setTipo] = useState<TipoMaterial>(null)
  const [sala, setSala] = useState<string[]>([])
  const [item, setItem] = useState<string[]>([])
  const [defeito, setDefeito] = useState<string[]>([])
  const [descricao, setDescricao] = useState('')
  const [codigoSala, setCodigoSala] = useState('')
  const [codigoPatrimonio, setCodigoPatrimonio] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const [locaisLoading, setLocaisLoading] = useState(true)
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [salasPorAndar, setSalasPorAndar] = useState<Record<string, string[]>>({})

  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [mobiliarios, setMobiliarios] = useState<Mobiliario[]>([])
  const [defeitos, setDefeitos] = useState<DefeitoCatalogo[]>([])
  const [catalogLoading, setCatalogLoading] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const titulos = [
    'Abertura de Chamado - Passo 1',
    'Abertura de Chamado - Passo 2',
    'Abertura de Chamado - Passo 3',
    'Abertura de Chamado - Passo 4',
    'Abertura de Chamado - Final',
  ]

  useEffect(() => {
    fetchLocais()
      .then((locais) => setSalasPorAndar(groupLocaisPorAndar(locais)))
      .catch(() => setCatalogError('Não foi possível carregar as salas.'))
      .finally(() => setLocaisLoading(false))
  }, [])

  useEffect(() => {
    if (step !== 3 || !tipo || sala.length === 0) return

    setCatalogLoading(true)
    setCatalogError(null)

    const load = async () => {
      try {
        if (tipo === 'equipamento') {
          const data = await fetchEquipamentos(sala[0])
          setEquipamentos(data)
        } else {
          const data = await fetchMobiliarios()
          setMobiliarios(data)
        }
      } catch {
        setCatalogError('Erro ao carregar materiais.')
      } finally {
        setCatalogLoading(false)
      }
    }

    load()
  }, [step, tipo, sala])

  useEffect(() => {
    if (step !== 4 || !tipo) return

    const categoria = CATEGORIA_POR_TIPO[tipo]
    setCatalogLoading(true)
    setDefeitos([])
    fetchDefeitos(categoria)
      .then(setDefeitos)
      .catch(() => setCatalogError('Erro ao carregar defeitos.'))
      .finally(() => setCatalogLoading(false))
  }, [step, tipo])

  const equipamentoOptions = useMemo(
    () =>
      equipamentos.map((e) => ({
        value: e.cod_patrimonio,
        label: `${e.nome} (${e.cod_patrimonio})`,
      })),
    [equipamentos],
  )

  const mobiliaOptions = useMemo(
    () =>
      mobiliarios.map((m) => ({
        value: String(m.id),
        label: m.nome,
      })),
    [mobiliarios],
  )

  const defeitoOptions = useMemo(
    () =>
      defeitos.map((d) => ({
        value: String(d.id_defeito),
        label: d.titulo,
      })),
    [defeitos],
  )

  const selectedEquipamentoLabel =
    equipamentos.find((e) => e.cod_patrimonio === item[0])?.nome ?? item[0]
  const selectedMobiliaLabel =
    mobiliarios.find((m) => String(m.id) === item[0])?.nome ?? item[0]
  const selectedDefeitoLabel =
    defeitos.find((d) => String(d.id_defeito) === defeito[0])?.titulo ?? defeito[0]

  const canGoNext =
    step === 1
      ? sala.length > 0
      : step === 2
        ? tipo !== null
        : step === 3
          ? tipo === 'mobilia'
            ? item.length > 0
            : item.length > 0 || codigoPatrimonio.trim().length > 0
          : step === 4
            ? defeito.length > 0
            : true

  const handleItemChange = (selected: string[]) => {
    setItem(selected)
    if (tipo === 'equipamento' && selected[0]) {
      setCodigoPatrimonio(selected[0])
    }
  }

  const handleConfirm = () => {
    if (!canGoNext) return
    if (step < 5) setStep(step + 1)
  }

  const handleSubmit = async () => {
    const user = getUser()
    if (!user || !sala[0] || !defeito[0] || !tipo) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      await criarSolicitacao({
        usuario_id: user.id,
        cod_sala: sala[0],
        id_defeito: Number(defeito[0]),
        descricao_defeito: descricao || undefined,
        ...(tipo === 'equipamento'
          ? { cod_patrimonio: codigoPatrimonio.trim() || item[0] }
          : { mobiliario_id: Number(item[0]) }),
      })
      navigate('/')
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : 'Erro ao abrir chamado. Tente novamente.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
    else navigate('/')
  }

  return (
    <PageLayout activeNav="new" showBack onBack={handleBack}>
      <div className="px-10 py-8 max-w-6xl mx-auto min-h-[calc(100vh-10rem)] flex flex-col justify-center">
        <h1 className="text-[32px] font-bold text-text text-center mb-4">
          {titulos[step - 1]}
        </h1>

        {catalogError && (
          <p className="text-center text-alert mb-4" role="alert">
            {catalogError}
          </p>
        )}

        {step === 1 && (
          <>
            <p className="text-xl text-text text-center mb-8">
              Selecione uma sala de aula ou laboratório
            </p>
            {locaisLoading ? (
              <p className="text-center text-text-secondary py-8">Carregando salas...</p>
            ) : (
              <div className="bg-search-bg rounded-2xl p-8 flex flex-wrap gap-8 justify-center mb-8">
                {Object.entries(salasPorAndar).map(([andar, salas]) => (
                  <div key={andar} className="min-w-[100px]">
                    <h3 className="text-xl font-bold text-text mb-4">{andar}</h3>
                    <CheckboxGroup
                      options={salas}
                      selected={sala}
                      onChange={setSala}
                      singleSelection
                    />
                  </div>
                ))}
              </div>
            )}
            <p className="text-center text-text-secondary mb-8">
              Em caso de uma sala não estiver cadastrada,{' '}
              <button
                type="button"
                className="text-primary underline bg-transparent border-0 cursor-pointer"
                onClick={() => setDialogOpen(true)}
              >
                clique aqui
              </button>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-2xl text-text text-center mb-12">
              Escolha uma classe de materiais
            </p>
            <div className="flex justify-center gap-8">
              <Button
                variant="equipamento"
                onClick={() => {
                  setTipo('equipamento')
                  setItem([])
                  setStep(3)
                }}
              >
                Equipamento
              </Button>
              <Button
                variant="mobilia"
                onClick={() => {
                  setTipo('mobilia')
                  setItem([])
                  setCodigoPatrimonio('')
                  setStep(3)
                }}
              >
                Mobilia
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-xl text-text text-center mb-8">
              {tipo === 'mobilia'
                ? 'Selecione uma Mobília'
                : 'Selecione um Equipamento'}
            </p>
            <div className="bg-search-bg rounded-2xl p-8 max-w-md mx-auto mb-8">
              <h3 className="text-xl font-bold text-text mb-4 text-center">
                {tipo === 'mobilia' ? 'Mobília' : 'Equipamentos'}
              </h3>
              {catalogLoading ? (
                <p className="text-center text-text-secondary">Carregando...</p>
              ) : (
                <CheckboxGroup
                  options={tipo === 'mobilia' ? mobiliaOptions : equipamentoOptions}
                  selected={item}
                  onChange={handleItemChange}
                  singleSelection
                />
              )}
            </div>
            {tipo === 'equipamento' && (
              <div className="grid grid-cols-1 gap-4 max-w-md mx-auto mb-8">
                <Input
                  label="Código de patrimônio"
                  value={codigoPatrimonio}
                  onChange={(e) => setCodigoPatrimonio(e.target.value)}
                  placeholder="Digite ou selecione acima"
                />
              </div>
            )}
            <p className="text-center text-text-secondary mb-8">
              Em caso de um{' '}
              {tipo === 'mobilia' ? 'mobília' : 'equipamento'} não estiver cadastrado,{' '}
              <button
                type="button"
                className="text-primary underline bg-transparent border-0 cursor-pointer"
                onClick={() => setDialogOpen(true)}
              >
                clique aqui
              </button>
            </p>
          </>
        )}

        {step === 4 && (
          <>
            <p className="text-xl text-text text-center mb-8">Selecione um Defeito</p>
            <div className="bg-search-bg rounded-2xl p-8 max-w-md mx-auto mb-8">
              {catalogLoading ? (
                <p className="text-center text-text-secondary">Carregando...</p>
              ) : (
                <CheckboxGroup
                  options={defeitoOptions}
                  selected={defeito}
                  onChange={setDefeito}
                  singleSelection
                />
              )}
            </div>
            <p className="text-center text-text-secondary mb-8">
              Em caso de um defeito não estiver cadastrado,{' '}
              <button
                type="button"
                className="text-primary underline bg-transparent border-0 cursor-pointer"
                onClick={() => setDialogOpen(true)}
              >
                clique aqui
              </button>
            </p>
          </>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.9fr] gap-6 items-start">
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-text mb-2 text-center xl:text-left">
                  {(tipo === 'mobilia' ? selectedMobiliaLabel : selectedEquipamentoLabel) ??
                    'Item'}{' '}
                  - {selectedDefeitoLabel ?? 'Defeito'}
                </h2>
                <div className="bg-input-bg rounded-2xl p-6 flex flex-col items-start gap-4">
                  <p className="text-base text-text-secondary">
                    Upload de foto será habilitado em breve. Por enquanto, o chamado será
                    registrado sem anexo.
                  </p>
                </div>
              </div>
              <div className="flex-1 bg-search-bg rounded-2xl p-6 flex flex-col gap-6">
                <p className="text-base text-text-secondary">
                  Localização: Sala {sala[0] ?? '—'} · IFSP Bragança Paulista
                </p>
                <p className="text-base text-text-secondary">
                  Material:{' '}
                  {tipo === 'mobilia' ? selectedMobiliaLabel : selectedEquipamentoLabel}
                </p>
                <Textarea
                  placeholder="Especifique aqui o problema"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="min-h-[280px]"
                />
              </div>
            </div>
            {submitError && (
              <p className="text-center text-alert" role="alert">
                {submitError}
              </p>
            )}
            <div className="flex justify-center">
              <Button
                variant="salvar-chamado"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full max-w-[340px]"
              >
                {submitting ? 'Abrindo...' : 'Abrir Chamado'}
              </Button>
            </div>
          </div>
        )}

        {step < 5 && step !== 2 && (
          <div className="flex justify-center">
            <Button variant="confirm" onClick={handleConfirm} disabled={!canGoNext}>
              Confirmar
            </Button>
          </div>
        )}
      </div>

      <Dialog
        open={dialogOpen}
        title="Cadastrar novo item"
        onClose={() => setDialogOpen(false)}
        onConfirm={() => setDialogOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <p>Informe os dados do item não cadastrado para que a equipe possa avaliar.</p>
          <Input
            label="Código da sala"
            value={codigoSala}
            onChange={(e) => setCodigoSala(e.target.value)}
            placeholder="Ex: A101"
          />
        </div>
      </Dialog>
    </PageLayout>
  )
}
