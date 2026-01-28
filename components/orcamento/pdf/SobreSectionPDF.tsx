import { Award, Lightbulb, Target } from "lucide-react";

/**
 * SobreSectionPDF - Versão compacta sem imagens
 * Otimizada para caber em um slide de apresentação
 */
export function SobreSectionPDF() {
  return (
    <section className="py-16 bg-white w-full">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-black/40 mb-3">
            Apresentação Construtora
          </p>
          <h2 className="text-4xl font-bold text-black mb-4">
            Mestres em construir
          </h2>
          <p className="text-lg text-black/60">
            Líderes em Light Steel Frame
          </p>
        </div>

        {/* Narrative */}
        <div className="bg-[#F4F2EC] rounded-xl p-8 mb-8 text-center">
          <p className="text-lg text-black/80 leading-relaxed max-w-3xl mx-auto">
            Nascemos da experiência de quem conhece construção de verdade.
            São <strong className="text-black">20 anos somados</strong> em projetos
            industrializados que nos ensinaram uma coisa: a melhor surpresa
            é não ter surpresa nenhuma.
          </p>
        </div>

        {/* Values Grid - 3 columns */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Excelência */}
          <div className="bg-white border border-black/10 rounded-xl p-6 text-center">
            <Award className="w-8 h-8 text-black/40 mx-auto mb-3" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold text-black mb-1">Excelência</h3>
            <p className="text-sm text-black/60">
              Compromisso com qualidade e precisão
            </p>
          </div>

          {/* Inovação */}
          <div className="bg-white border border-black/10 rounded-xl p-6 text-center">
            <Lightbulb className="w-8 h-8 text-black/40 mx-auto mb-3" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold text-black mb-1">Inovação</h3>
            <p className="text-sm text-black/60">
              Tecnologia e métodos modernos
            </p>
          </div>

          {/* Precisão */}
          <div className="bg-white border border-black/10 rounded-xl p-6 text-center">
            <Target className="w-8 h-8 text-black/40 mx-auto mb-3" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold text-black mb-1">Precisão</h3>
            <p className="text-sm text-black/60">
              Tolerância de ±1mm em cada peça
            </p>
          </div>
        </div>

        {/* Bottom Stats Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* 20+ Anos */}
          <div className="bg-black text-white rounded-xl p-6 flex items-center justify-center gap-4">
            <span className="text-5xl font-bold">20+</span>
            <p className="text-sm text-white/70">
              anos de experiência<br />combinada
            </p>
          </div>

          {/* 50% mais rápido */}
          <div className="bg-black text-white rounded-xl p-6">
            <p className="text-sm text-white/60 mb-1">Tempo de obra</p>
            <p className="text-3xl font-bold">50% mais rápido</p>
          </div>
        </div>
      </div>
    </section>
  );
}
