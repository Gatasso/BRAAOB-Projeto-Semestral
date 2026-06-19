export interface Usuario {
  id: string
  prontuario: string
  nome: string
  tipo: string
}

export interface LoginRequest {
  prontuario: string
  senha: string
}

export interface LoginResponse {
  mensagem: string
  usuario: Usuario
}

export interface UsuarioDetalhe extends Usuario {
  email: string
  ativo: boolean
  criado_em: string
}

export interface ApiErrorBody {
  erro?: string
  mensagem?: string
  detalhes?: string
}
