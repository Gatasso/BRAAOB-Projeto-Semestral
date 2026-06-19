import type { DefeitoCatalogo } from '@/types/catalogo'
import type {
  ChamadoUI,
  HistoricoItem,
  SolicitacaoDetalhe,
  SolicitacaoResumo,
} from '@/types/solicitacao'

const GENERIC_IMAGES = [
  '/assets/projetor.png',
  '/assets/computador.png',
  '/assets/ventilador.png',
  '/assets/monitor-quebrado.png',
]

export function getGenericImage(seed: string, material?: string): string {
  const text = `${seed}-${material ?? ''}`.toLowerCase()

  if (text.includes('projetor')) return '/assets/projetor.png'
  if (text.includes('computador') || text.includes('pc')) return '/assets/computador.png'
  if (text.includes('ventilador')) return '/assets/ventilador.png'
  if (text.includes('monitor') || text.includes('tela')) return '/assets/monitor-quebrado.png'
  if (text.includes('cadeira') || text.includes('mobil')) return '/assets/computador.png'

  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash + text.charCodeAt(i)) % GENERIC_IMAGES.length
  }
  return GENERIC_IMAGES[hash]
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR')
  } catch {
    return iso
  }
}

export function formatHistorico(historico: HistoricoItem[]): string {
  if (!historico.length) return 'Nenhum registro no histórico.'

  return historico
    .map((item) => {
      const de = item.status_anterior ?? '—'
      const data = formatDate(item.data_alteracao)
      return `${de} → ${item.status_novo} (${data})`
    })
    .join('\n')
}

export function resumoToChamadoUI(resumo: SolicitacaoResumo): ChamadoUI {
  return {
    id: resumo.id,
    titulo: resumo.material,
    localizacao: `Sala ${resumo.cod_sala} · IFSP Bragança Paulista`,
    data: formatDate(resumo.criado_em),
    descricao: '',
    equipamento: resumo.material,
    numero: '—',
    status: resumo.status,
    imagem: getGenericImage(resumo.id, resumo.material),
    historico: '',
  }
}

export function detalheToChamadoUI(
  detalhe: SolicitacaoDetalhe,
  defeitoTitulo?: string,
): ChamadoUI {
  const material =
    detalhe.cod_patrimonio ??
    (detalhe.mobiliario_id ? `Mobiliário #${detalhe.mobiliario_id}` : null) ??
    (detalhe.componente_id ? `Componente #${detalhe.componente_id}` : null) ??
    'Material'

  const titulo = defeitoTitulo ?? material

  return {
    id: detalhe.id,
    titulo,
    localizacao: `Sala ${detalhe.cod_sala} · IFSP Bragança Paulista`,
    data: formatDate(detalhe.criado_em),
    descricao: detalhe.descricao_defeito ?? 'Sem descrição adicional.',
    equipamento: material,
    numero: detalhe.cod_patrimonio ?? String(detalhe.mobiliario_id ?? detalhe.componente_id ?? '—'),
    status: detalhe.status,
    imagem: getGenericImage(detalhe.id, material),
    historico: formatHistorico(detalhe.historico),
  }
}

export function findDefeitoTitulo(
  defeitos: DefeitoCatalogo[],
  idDefeito: number,
): string | undefined {
  return defeitos.find((d) => d.id_defeito === idDefeito)?.titulo
}

export function groupLocaisPorAndar(
  locais: { cod_sala: string }[],
): Record<string, string[]> {
  const groups: Record<string, string[]> = {}

  for (const local of locais) {
    const match = local.cod_sala.match(/^[A-Za-z]*(\d)/)
    const andar = match ? `Andar ${match[1]}` : 'Outros'
    if (!groups[andar]) groups[andar] = []
    groups[andar].push(local.cod_sala)
  }

  return Object.fromEntries(
    Object.entries(groups).sort(([a], [b]) => a.localeCompare(b, 'pt-BR')),
  )
}
