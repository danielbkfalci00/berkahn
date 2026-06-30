interface Props {
  valorMin: number
  valorMax: number
  valorM2Min: number
  valorM2Max: number
}

function formatarMoeda(valor: number, abreviado = false): string {
  if (abreviado && valor >= 1_000_000) {
    return `R$ ${(valor / 1_000_000).toLocaleString("pt-BR", {
      maximumFractionDigits: 2,
    })}M`
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor)
}

export function EstimativaInvestimento({
  valorMin,
  valorMax,
  valorM2Min,
  valorM2Max,
}: Props) {
  const width = 700
  const height = 180
  const padding = 60
  const trackY = 110
  const trackHeight = 14

  return (
    <section className="est-secao">
      <div className="est-numero-secao">05</div>
      <h2
        className="est-display"
        style={{ fontSize: "36pt", margin: "12px 0 0", lineHeight: 1.1 }}
      >
        Estimativa de Custos
      </h2>
      <div className="est-divisor-champagne" />

      <p
        style={{
          fontSize: "11pt",
          lineHeight: 1.7,
          margin: "0 0 40px",
          maxWidth: 620,
          color: "var(--c-soft-gray)",
        }}
      >
        A faixa de valores foi elaborada a partir da análise das características
        do empreendimento: área construída, padrão de acabamento, tipologia
        arquitetônica, localização e parâmetros atuais do mercado da construção
        civil. Representa uma estimativa técnica de investimento, sujeita a
        revisão após o orçamento analítico.
      </p>

      <div
        className="est-eyebrow"
        style={{ marginBottom: 12, color: "var(--c-soft-gray)" }}
      >
        Custo estimado de obra
      </div>

      <div
        style={{
          background: "var(--c-off-white)",
          padding: "40px 48px",
          borderRadius: 2,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 24,
            marginBottom: 8,
          }}
        >
          <div
            className="est-display"
            style={{ fontSize: "32pt", fontWeight: 700, lineHeight: 1 }}
          >
            {formatarMoeda(valorMin)}
          </div>
          <div
            className="est-display"
            style={{
              fontSize: "16pt",
              fontWeight: 400,
              color: "var(--c-soft-gray)",
            }}
          >
            até
          </div>
          <div
            className="est-display"
            style={{ fontSize: "32pt", fontWeight: 700, lineHeight: 1 }}
          >
            {formatarMoeda(valorMax)}
          </div>
        </div>

        {/* Range bar SVG */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height={height}
          style={{ marginTop: 24, display: "block" }}
        >
          {/* Background track */}
          <rect
            x={padding}
            y={trackY}
            width={width - padding * 2}
            height={trackHeight}
            rx={trackHeight / 2}
            fill="rgba(0,0,0,0.06)"
          />
          {/* Active segment champagne */}
          <rect
            x={padding}
            y={trackY}
            width={width - padding * 2}
            height={trackHeight}
            rx={trackHeight / 2}
            fill="var(--c-champagne)"
          />
          {/* Ticks */}
          <circle
            cx={padding}
            cy={trackY + trackHeight / 2}
            r={10}
            fill="#fff"
            stroke="var(--c-charcoal)"
            strokeWidth={2}
          />
          <circle
            cx={width - padding}
            cy={trackY + trackHeight / 2}
            r={10}
            fill="#fff"
            stroke="var(--c-charcoal)"
            strokeWidth={2}
          />
          {/* Bottom labels */}
          <text
            x={padding}
            y={trackY + 44}
            textAnchor="middle"
            fontSize="11"
            fontFamily="var(--font-manrope), sans-serif"
            fontWeight="600"
            fill="var(--c-charcoal)"
          >
            mín.
          </text>
          <text
            x={width - padding}
            y={trackY + 44}
            textAnchor="middle"
            fontSize="11"
            fontFamily="var(--font-manrope), sans-serif"
            fontWeight="600"
            fill="var(--c-charcoal)"
          >
            máx.
          </text>
        </svg>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 16,
            fontSize: "9.5pt",
            color: "var(--c-soft-gray)",
          }}
        >
          <span>
            aprox.{" "}
            <strong style={{ color: "var(--c-charcoal)" }}>
              {formatarMoeda(valorM2Min)}/m²
            </strong>
          </span>
          <span>
            aprox.{" "}
            <strong style={{ color: "var(--c-charcoal)" }}>
              {formatarMoeda(valorM2Max)}/m²
            </strong>
          </span>
        </div>
      </div>

      <p
        style={{
          fontSize: "9.5pt",
          lineHeight: 1.6,
          color: "var(--c-soft-gray)",
          margin: 0,
          fontStyle: "italic",
        }}
      >
        Refere-se ao custo de obra. No regime de Administração, somam-se as
        taxas da seção 8. Em Preço Fechado e PMG, a remuneração da construtora
        já está embutida na proposta definitiva. Não inclui itens da seção 7.
        Sujeito a revisão após orçamento analítico.
      </p>
    </section>
  )
}
