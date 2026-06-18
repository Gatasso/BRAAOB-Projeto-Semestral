import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '@/components/layouts/PageLayout'
import {
  Button,
  CheckboxGroup,
  Dialog,
  Input,
  Textarea,
} from '@/components/ui'

const SALAS_POR_ANDAR: Record<string, string[]> = {
  'Andar 1': ['A101', 'A102', 'A103', 'A104'],
  'Andar 2': ['B201', 'B202', 'B203', 'B204', 'B205', 'B206', 'B207'],
  'Andar 3': ['C301'],
  'Andar 4': ['A401', 'A402', 'A403', 'A404', 'A405', 'A406', 'A407', 'A408', 'A409'],
  'Andar 5': ['D501', 'D502', 'D503', 'D504', 'D505', 'D506', 'D507', 'D508', 'D509'],
}

const EQUIPAMENTOS = ['Monitor', 'Teclado', 'Mouse', 'Projetor', 'Computador']
const MOBILIA = ['Cadeira', 'Mesa', 'Armário', 'Prateleira', 'Quadro']
const DEFEITOS_EQUIP = [
  'Não liga',
  'Tela quebrada',
  'Falha mecânica',
  'Sem imagem',
  'Superaquecimento',
  'Barulho anormal',
  'Conexão instável',
  'Outro',
]
const DEFEITOS_MOBILIA = [
  'Instabilidade',
  'Quebrado',
  'Desgaste',
  'Falta de parafusos',
  'Roda danificada',
  'Outro',
]

type TipoMaterial = 'equipamento' | 'mobilia' | null

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
  const [computadorFoto, setComputadorFoto] = useState<File | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const titulos = [
    'Abertura de Chamado - Passo 1',
    'Abertura de Chamado - Passo 2',
    'Abertura de Chamado - Passo 3',
    'Abertura de Chamado - Passo 4',
    'Abertura de Chamado - Final',
  ]

  const canGoNext =
    step === 1
      ? sala.length > 0
      : step === 2
      ? tipo !== null
      : step === 3
      ? item.length > 0 && codigoPatrimonio.trim().length > 0
      : step === 4
      ? defeito.length > 0
      : true

  const handleConfirm = () => {
    if (!canGoNext) return

    if (step < 5) {
      setStep(step + 1)
    } else {
      navigate('/')
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      navigate('/')
    }
  }

  return (
    <PageLayout activeNav="new" showBack onBack={handleBack}>
      <div className="px-10 py-8 max-w-6xl mx-auto min-h-[calc(100vh-10rem)] flex flex-col justify-center">
        <h1 className="text-[32px] font-bold text-text text-center mb-4">
          {titulos[step - 1]}
        </h1>

        {step === 1 && (
          <>
            <p className="text-xl text-text text-center mb-8">
              Selecione uma sala de aula ou laboratório
            </p>
            <div className="bg-search-bg rounded-2xl p-8 flex flex-wrap gap-8 justify-center mb-8">
              {Object.entries(SALAS_POR_ANDAR).map(([andar, salas]) => (
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
                  setStep(3)
                }}
              >
                Equipamento
              </Button>
              <Button
                variant="mobilia"
                onClick={() => {
                  setTipo('mobilia')
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
              <CheckboxGroup
                options={tipo === 'mobilia' ? MOBILIA : EQUIPAMENTOS}
                selected={item}
                onChange={setItem}
                singleSelection
              />
            </div>
            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto mb-8">
              <Input
                label="Código de patrimônio"
                value={codigoPatrimonio}
                onChange={(e) => setCodigoPatrimonio(e.target.value)}
                placeholder="Digite o código do equipamento"
              />
            </div>
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
              <CheckboxGroup
                options={tipo === 'mobilia' ? DEFEITOS_MOBILIA : DEFEITOS_EQUIP}
                selected={defeito}
                onChange={setDefeito}
                singleSelection
              />
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
                  {item[0] ?? 'Item'} - {defeito[0] ?? 'Defeito'}
                </h2>
                <div className="bg-input-bg rounded-2xl p-6 flex flex-col items-start gap-4">
                  <p className="text-base text-text-secondary">
                    Selecione a foto do computador para enviar junto ao chamado.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setComputadorFoto(event.target.files?.[0] ?? null)
                    }
                    className="w-full text-sm text-text"
                  />
                  {computadorFoto && (
                    <p className="text-sm text-text-secondary">
                      Arquivo selecionado: {computadorFoto.name}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex-1 bg-search-bg rounded-2xl p-6 flex flex-col gap-6">
                <p className="text-base text-text-secondary">
                  Localização: Sala {sala[0] ?? '—'} · IFSP Bragança Paulista
                </p>
                <p className="text-base text-text-secondary">
                  Material: {item[0] ?? '—'}
                </p>
                <Textarea
                  placeholder="Especifique aqui o problema"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="min-h-[280px]"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                variant="salvar-chamado"
                onClick={() => navigate('/')}
                className="w-full max-w-[340px]"
              >
                Abrir Chamado
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
