import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { AlertCircle, Box, Tag } from 'lucide-react'
import { AlertBanner, InfoRow, TabBar } from '@/components/ui'
import type { ChamadoUI } from '@/types/solicitacao'

const PANEL_BG = 'bg-[#1a3d22]'

export interface ChamadoDetalhesModalProps {
  chamado: ChamadoUI | null
  open: boolean
  onClose: () => void
  loading?: boolean
}

export function ChamadoDetalhesModal({
  chamado,
  open,
  onClose,
  loading = false,
}: ChamadoDetalhesModalProps) {
  const [activeTab, setActiveTab] = useState('Detalhes')

  useEffect(() => {
    if (open) {
      setActiveTab('Detalhes')
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.55)] px-6 py-10"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`relative w-full max-w-[1400px] max-h-[calc(100vh-5rem)] overflow-y-auto rounded-3xl ${PANEL_BG} p-8 pt-14`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chamado-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 z-10 inline-flex items-center justify-center gap-2 bg-primary text-white w-12 h-12 rounded-full cursor-pointer border-0 hover:bg-primary-active transition-colors shadow-md"
          aria-label="Fechar"
        >
          <X size={22} />
        </button>

        {loading && (
          <p className="text-white text-center py-20">Carregando detalhes...</p>
        )}

        {!loading && chamado && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className={`flex-1 ${PANEL_BG} rounded-2xl p-4`}>
              <div className="w-full h-[480px] rounded-2xl overflow-hidden mb-8 bg-[#0f2914]">
                <img
                  src={chamado.imagem}
                  alt={chamado.titulo}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-6">
                Informações da Demanda
              </h2>
              <InfoRow
                icon={Box}
                label={`Equipamento: ${chamado.equipamento}`}
                className="mb-4"
                onDark
              />
              <InfoRow
                icon={Tag}
                label={`Número do Equipamento: ${chamado.numero}`}
                className="mb-4"
                onDark
              />
              <AlertBanner message={chamado.status} icon={AlertCircle} onDark />
            </div>

            <div className={`flex-1 ${PANEL_BG} rounded-2xl p-4`}>
              <p className="text-base text-white/75 text-center mb-2">
                Reportado em {chamado.data}
              </p>
              <h1
                id="chamado-modal-title"
                className="text-[32px] font-bold text-white text-center mb-4"
              >
                {chamado.titulo}
              </h1>
              <p className="text-base text-white/75 text-center mb-6">
                Localização: {chamado.localizacao}
              </p>

              <TabBar
                tabs={['Detalhes', 'Histórico']}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                className="mb-8"
                onDark
              />

              {activeTab === 'Detalhes' ? (
                <div className="bg-white/10 rounded-xl p-6 min-h-[220px]">
                  <p className="text-base text-white leading-relaxed">
                    {chamado.descricao}
                  </p>
                </div>
              ) : (
                <div className="bg-white/10 rounded-xl p-6 min-h-[220px]">
                  <p className="text-base text-white leading-relaxed whitespace-pre-line">
                    {chamado.historico}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
