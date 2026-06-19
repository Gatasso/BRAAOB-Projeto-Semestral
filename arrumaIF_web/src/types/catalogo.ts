export interface LocalSuporte {
  cod_sala: string
  descricao: string | null
  tipo: string
}

export interface Equipamento {
  cod_patrimonio: string
  nome: string
  descricao: string | null
  cod_sala: string | null
  criado_em?: string
}

export interface Mobiliario {
  id: number
  nome: string
  descricao: string | null
}

export interface DefeitoCatalogo {
  id_defeito: number
  titulo: string
  descricao: string | null
}

export interface SolucaoCatalogo {
  id_solucao: number
  titulo: string
  descricao: string | null
}
