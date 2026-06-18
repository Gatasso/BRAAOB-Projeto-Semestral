export interface Chamado {
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

export const CHAMADOS: Chamado[] = [
  {
    id: '1',
    titulo: 'Projetor Quebrado',
    localizacao: 'Sala B101 · IFSP Bragança Paulista',
    data: '06/04/2026',
    descricao:
      'O projetor não liga de forma consistente e a imagem fica com falhas, impactando as aulas de apresentação',
    equipamento: 'Monitor',
    numero: '547663',
    status: 'O reparo já está agendado pela equipe',
    imagem: '/assets/projetor.png',
    historico:
      'Abertura do Chamado - 06/05/2026 - Jonnas\nEntrada na fila de Prioridade Alta - 06/05/2026 - Jonnas\nAvaliação primária - 08/05/2026 - Jonnas\nColeta do Equipamento para Reparo - 08/05/2026 - Jonnas\nReparo agendado pelo time técnico - Previsão: 22/05/2026',
  },
  {
    id: '2',
    titulo: 'Computador com Defeito',
    localizacao: 'Sala A407 · IFSP Bragança Paulista',
    data: '10/04/2026',
    descricao: 'O computador não inicializa o sistema operacional.',
    equipamento: 'Computador',
    numero: '123456',
    status: 'Aguardando avaliação técnica',
    imagem: '/assets/computador.png',
    historico: 'Abertura do Chamado - 10/04/2026',
  },
  {
    id: '3',
    titulo: 'Ventilador Parado',
    localizacao: 'Sala C201 · IFSP Bragança Paulista',
    data: '12/04/2026',
    descricao: 'Ventilador não liga e a sala está muito quente.',
    equipamento: 'Ventilador',
    numero: '789012',
    status: 'Em análise',
    imagem: '/assets/ventilador.png',
    historico: 'Abertura do Chamado - 12/04/2026',
  },
  {
    id: '4',
    titulo: 'Monitor Quebrado',
    localizacao: 'Sala B101 · IFSP Bragança Paulista',
    data: '06/04/2026',
    descricao:
      'O projetor não liga de forma consistente e a imagem fica com falhas, impactando as aulas de apresentação',
    equipamento: 'Monitor',
    numero: '547663',
    status: 'O reparo já está agendado pela equipe',
    imagem: '/assets/monitor-quebrado.png',
    historico:
      'Abertura do Chamado - 06/05/2026 - Jonnas\nReparo agendado pelo time técnico - Previsão: 22/05/2026',
  },
]

export function getChamadoById(id: string): Chamado {
  return CHAMADOS.find((c) => c.id === id) ?? CHAMADOS[0]
}
