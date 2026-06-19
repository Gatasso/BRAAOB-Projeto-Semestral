import { apiRequest } from './api'
import type { UsuarioDetalhe } from '@/types/auth'

export async function fetchUsuario(id: string): Promise<UsuarioDetalhe> {
  return apiRequest<UsuarioDetalhe>(`/api/usuarios/${id}`)
}
