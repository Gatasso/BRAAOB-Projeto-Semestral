import { PageLayout } from '@/components/layouts/PageLayout'

export function InformativoPage() {
  return (
    <PageLayout activeNav="info">
      <div className="px-16 py-12 max-w-5xl mx-auto min-h-[calc(100vh-9rem)] flex flex-col justify-center items-center text-center">
        <p className="text-lg text-text leading-relaxed mb-10">
          O arrumaÍF nasce da frustração real de alunos de ADS que, muitas vezes, se
          veem impedidos de participar das aulas por problemas simples: computadores que
          não funcionam, falta de equipamentos ou a necessidade de trocar de lugar
          constantemente para conseguir acompanhar o conteúdo.
        </p>

        <p className="text-2xl font-medium text-text mb-10">
          Cansados dessa realidade, surge a iniciativa de transformar esse problema em
          solução!!!
        </p>

        <p className="text-lg text-text leading-relaxed">
          O arrumaÍF é mais do que uma ferramenta: é um canal direto entre quem precisa
          de ajuda e quem pode resolver, trazendo agilidade, organização e melhores
          condições para o aprendizado dentro do câmpus.
        </p>
      </div>
    </PageLayout>
  )
}
