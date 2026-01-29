const INDICE_ITEMS = [
  { numero: "01", titulo: "Apresentação construtora" },
  { numero: "02", titulo: "Premissas adotadas para o orçamento" },
  { numero: "03", titulo: "Descrição analítica dos Materiais" },
  { numero: "04", titulo: "Planilha Orçamentária" },
  { numero: "05", titulo: "Plano de Gerenciamento Berkahn" },
  { numero: "06", titulo: "Pagamento" },
];

export function IndiceSectionPDF() {
  return (
    <section className="py-16 bg-[#F4F2EC] w-full">
      <div className="container max-w-3xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-black/40 mb-2">
            Sumário
          </span>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight text-black">
            ÍNDICE
          </h2>
        </div>

        {/* Items */}
        <div className="space-y-0">
          {INDICE_ITEMS.map((item) => (
            <div
              key={item.numero}
              className="flex items-center gap-4 py-4 border-b border-black/10"
            >
              <span className="font-mono text-xl lg:text-2xl font-bold text-black w-10 lg:w-12 shrink-0">
                {item.numero}
              </span>
              <div className="flex-1 h-px bg-black/20" />
              <span className="text-sm lg:text-base text-black/70 text-right">
                {item.titulo}
              </span>
            </div>
          ))}
        </div>

        {/* Footer decorativo */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <div className="w-8 h-px bg-black/20" />
          <div className="w-1.5 h-1.5 rotate-45 bg-black/20" />
          <div className="w-8 h-px bg-black/20" />
        </div>
      </div>
    </section>
  );
}
