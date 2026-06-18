import { useNavigate } from 'react-router-dom'
import { PageLayout } from '@/components/layouts/PageLayout'
import { EquipamentoCard, FilterButton, Logo } from '@/components/ui'

const CHAMADOS = [
  { id: '1', title: 'Projetor Quebrado', image: '/assets/projetor.png' },
  { id: '2', title: 'Computador com Defeito', image: '/assets/computador.png' },
  { id: '3', title: 'Ventilador Parado', image: '/assets/ventilador.png' },
  { id: '4', title: 'Monitor Quebrado', image: '/assets/monitor-quebrado.png' },
]

export function AdminHomePage() {
  const navigate = useNavigate()

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

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[32px] font-bold text-text">Seus chamados:</h2>
          <FilterButton />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {CHAMADOS.map((chamado) => (
            <EquipamentoCard
              key={chamado.id}
              title={chamado.title}
              imageSrc={chamado.image}
              onClick={() => navigate(`/admin/chamado/${chamado.id}/editar`)}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
