import { ApiError, apiRequest } from './api'
import type {
  SolicitacaoCreatePayload,
  SolicitacaoDetalhe,
  SolicitacaoResumo,
  SolicitacaoUpdatePayload,
} from '@/types/solicitacao'

export async function fetchSolicitacoesPorUsuario(
  usuarioId: string,
): Promise<SolicitacaoResumo[]> {
  try {
    return await apiRequest<SolicitacaoResumo[]>(
      `/api/solicitacoes/usuario/${usuarioId}`,
    )
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return []
    }
    throw error
  }
}

export async function fetchTodasSolicitacoes(params?: {
  usuario_id?: string
  status?: string
}): Promise<SolicitacaoDetalhe[]> {
  const search = new URLSearchParams()
  if (params?.usuario_id) search.set('usuario_id', params.usuario_id)
  if (params?.status) search.set('status', params.status)
  const query = search.toString() ? `?${search.toString()}` : ''
  return apiRequest<SolicitacaoDetalhe[]>(`/api/solicitacoes/${query}`)
}

export async function fetchSolicitacaoDetalhe(
  id: string,
): Promise<SolicitacaoDetalhe> {
  return apiRequest<SolicitacaoDetalhe>(`/api/solicitacoes/${id}`)
}

export async function criarSolicitacao(
  payload: SolicitacaoCreatePayload,
): Promise<{ mensagem: string; id: string }> {
  return apiRequest<{ mensagem: string; id: string }>('/api/solicitacoes/', {
    method: 'POST',
    body: payload,
  })
}

export async function atualizarSolicitacao(
  id: string,
  payload: SolicitacaoUpdatePayload,
): Promise<{ mensagem: string }> {
  return apiRequest<{ mensagem: string }>(`/api/solicitacoes/${id}`, {
    method: 'PUT',
    body: payload,
  })
}
