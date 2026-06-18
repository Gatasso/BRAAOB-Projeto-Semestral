import { useState } from 'react'
import { PageLayout } from '@/components/layouts/PageLayout'
import { ChamadoDetalhesModal } from '@/components/ChamadoDetalhesModal'
import { EquipamentoCard, FilterButton, Logo } from '@/components/ui'
import { CHAMADOS, type Chamado } from '@/data/chamados'

export function HomePage() {
  const [selectedChamado, setSelectedChamado] = useState<Chamado | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const openChamado = (chamado: Chamado) => {
    setSelectedChamado(chamado)
    setModalOpen(true)
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

        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-[32px] font-bold text-text">Seus chamados:</h2>
          <FilterButton />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {CHAMADOS.map((chamado) => (
            <EquipamentoCard
              key={chamado.id}
              title={chamado.titulo}
              imageSrc={chamado.imagem}
              onClick={() => openChamado(chamado)}
            />
          ))}
        </div>
      </div>

      <ChamadoDetalhesModal
        chamado={selectedChamado}
        open={modalOpen}
        onClose={closeModal}
      />
    </PageLayout>
  )
}
