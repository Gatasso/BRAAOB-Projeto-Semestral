import { apiRequest } from './api'
import type {
  DefeitoCatalogo,
  Equipamento,
  LocalSuporte,
  Mobiliario,
  SolucaoCatalogo,
} from '@/types/catalogo'

export async function fetchLocais(): Promise<LocalSuporte[]> {
  return apiRequest<LocalSuporte[]>('/api/suporte/locais')
}

export async function fetchDefeitos(categoria?: 'Equipamento' | 'Mobília'): Promise<DefeitoCatalogo[]> {
  const params = new URLSearchParams()
  if (categoria) params.set('categoria', categoria)
  return apiRequest<DefeitoCatalogo[]>(`/api/suporte/defeitos${params.toString() ? `?${params.toString()}` : ''}`)
}

export async function fetchSolucoes(categoria?: 'Equipamento' | 'Mobília'): Promise<SolucaoCatalogo[]> {
  const params = new URLSearchParams()
  if (categoria) params.set('categoria', categoria)
  return apiRequest<SolucaoCatalogo[]>(`/api/suporte/solucoes${params.toString() ? `?${params.toString()}` : ''}`)
}

export async function fetchEquipamentos(codSala?: string): Promise<Equipamento[]> {
  const query = codSala ? `?cod_sala=${encodeURIComponent(codSala)}` : ''
  return apiRequest<Equipamento[]>(`/api/equipamentos/${query || ''}`)
}

export async function fetchMobiliarios(): Promise<Mobiliario[]> {
  return apiRequest<Mobiliario[]>('/api/mobiliarios/')
}
