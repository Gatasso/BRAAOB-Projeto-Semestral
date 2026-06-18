import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageLayout } from '@/components/layouts/PageLayout'
import {
  Button,
  ImageUploadArea,
  SelectInput,
  TabBar,
  Textarea,
} from '@/components/ui'

export function AdminEditChamadoPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Detalhes')
  const [localizacao, setLocalizacao] = useState('Sala A407')
  const [equipamento, setEquipamento] = useState('Teclado')
  const [numero, setNumero] = useState('547663')
  const [descricao, setDescricao] = useState('Teclado com teclas travando.')

  return (
    <PageLayout variant="admin" activeNav="home">
      <div className="px-10 py-8">
        <h1 className="text-[32px] font-bold text-text text-center mb-8">
          Editando Chamado #{id}
        </h1>

        <div className="flex gap-6">
          <div className="flex-1 bg-search-bg rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-text mb-6">Teclado com Falha</h2>

            <SelectInput
              label="Localização:"
              value={localizacao}
              onChange={setLocalizacao}
              options={[
                { value: 'Sala A407', label: 'Sala A407' },
                { value: 'Sala B101', label: 'Sala B101' },
                { value: 'Sala C201', label: 'Sala C201' },
              ]}
              className="mb-6"
            />

            <p className="text-base text-text-secondary mb-2">Imagem anexada:</p>
            <ImageUploadArea className="min-h-[246px]" />

            <div className="mt-6">
              <Button
                variant="salvar-chamado"
                onClick={() => navigate('/admin')}
              >
                Salvar Chamado
              </Button>
            </div>
          </div>

          <div className="flex-1 bg-search-bg rounded-2xl p-6">
            <SelectInput
              label="Equipamento:"
              value={equipamento}
              onChange={setEquipamento}
              options={[
                { value: 'Teclado', label: 'Teclado' },
                { value: 'Monitor', label: 'Monitor' },
                { value: 'Projetor', label: 'Projetor' },
              ]}
              className="mb-4"
            />

            <SelectInput
              label="Número Equipamento:"
              value={numero}
              onChange={setNumero}
              options={[
                { value: '547663', label: '547663' },
                { value: '123456', label: '123456' },
              ]}
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
                <p className="text-base text-text-secondary">
                  Histórico do chamado será exibido aqui.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
