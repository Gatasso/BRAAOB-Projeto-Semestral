export type SolicitacaoStatus =
  | 'Registrada'
  | 'Visualizada'
  | 'Andamento'
  | 'Aguardo'
  | 'Concluída'
  | 'Concluída sem Intervenção'
  | 'Contestada'

export interface SolicitacaoResumo {
  id: string
  cod_sala: string
  material: string
  status: SolicitacaoStatus | string
  criado_em: string
}

export interface HistoricoItem {
  usuario_id: string
  status_anterior: string | null
  status_novo: string
  data_alteracao: string
}

export interface SolicitacaoDetalhe {
  id: string
  usuario_id: string
  cod_sala: string
  cod_patrimonio: string | null
  mobiliario_id: number | null
  componente_id: number | null
  id_defeito: number
  descricao_defeito: string | null
  id_solucao: number | null
  status: SolicitacaoStatus | string
  url_foto_anexo: string | null
  criado_em: string
  historico: HistoricoItem[]
}

export interface SolicitacaoCreatePayload {
  usuario_id: string
  cod_sala: string
  id_defeito: number
  cod_patrimonio?: string
  mobiliario_id?: number
  componente_id?: number
  descricao_defeito?: string
  url_foto_anexo?: string
}

export interface SolicitacaoUpdatePayload {
  usuario_id: string
  cod_sala?: string
  id_defeito?: number
  descricao_defeito?: string
  url_foto_anexo?: string
}

export interface ChamadoUI {
  id: string
  titulo: string
  localizacao: string
  data: string
  descricao: string
  equipamento: string
  numero: string
  status: string
  imagem: string
  historico: string
}
