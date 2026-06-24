import { PADROES_ACABAMENTO, REGIMES_COMERCIAIS } from "@/lib/orcamento-estimativa-data"
import type {
  PadraoAcabamento,
  RegimeRecomendado,
} from "@/types/orcamento-estimativa"

interface Props {
  areaM2: number
  pavimentos: number
  padrao: PadraoAcabamento
  regime: RegimeRecomendado
  dataCotacao: string
  validadeDias: number
  cidade: string
  piscina: string | null
  obraReferencia: string | null
}

function formatarData(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1).toLocaleDateString("pt-BR")
}

export function Premissas({
  areaM2,
  pavimentos,
  padrao,
  regime,
  dataCotacao,
  validadeDias,
  cidade,
  piscina,
  obraReferencia,
}: Props) {
  const padraoNome = PADROES_ACABAMENTO.find((p) => p.id === padrao)?.nome ?? padrao
  const regimeNome =
    regime === "indefinido"
      ? "A definir (ver seção 8)"
      : REGIMES_COMERCIAIS.find((r) => r.id === regime)?.nome ?? regime

  const premissas: { item: string; valor: string }[] = [
    { item: "Área construída", valor: `${areaM2.toLocaleString("pt-BR")} m²` },
    { item: "Localização", valor: cidade },
    { item: "Pavimentos", valor: String(pavimentos) },
    { item: "Piscina", valor: piscina ?? "Não" },
    { item: "Padrão de acabamento", valor: padraoNome },
    {
      item: "Estrutura",
      valor:
        "Assume estrutura convencional de concreto armado. Estrutura especial, se exigida pelo projeto estrutural, altera o valor.",
    },
    {
      item: "Terreno e fundação",
      valor:
        "Assume terreno plano, sem contenção, e fundação convencional. Condições reais dependem de sondagem (SPT) — ver seção 7.",
    },
    { item: "Regime de execução", valor: regimeNome },
    { item: "Data de cotação", valor: formatarData(dataCotacao) },
    { item: "Validade", valor: `${validadeDias} dias corridos` },
  ]

  if (obraReferencia) {
    premissas.unshift({ item: "Referência do projeto", valor: obraReferencia })
  }

  return (
    <section className="est-secao est-secao-fundo-off" style={{ minHeight: "297mm" }}>
      <div className="est-numero-secao">06</div>
      <h2
        className="est-display"
        style={{ fontSize: "36pt", margin: "12px 0 0", lineHeight: 1.1 }}
      >
        Premissas Consideradas
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
        Esta estimativa foi construída sobre as premissas abaixo. Qualquer
        alteração nelas altera o valor estimado.
      </p>

      <div
        style={{
          background: "#fff",
          border: "1px solid var(--c-divider)",
          borderRadius: 2,
        }}
      >
        {premissas.map((p, idx) => (
          <div
            key={p.item}
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              padding: "18px 28px",
              gap: 24,
              borderTop: idx === 0 ? "none" : "1px solid var(--c-divider)",
            }}
          >
            <div
              className="est-eyebrow"
              style={{ fontSize: "9pt", color: "var(--c-soft-gray)" }}
            >
              {p.item}
            </div>
            <div
              style={{
                fontSize: "10.5pt",
                lineHeight: 1.55,
                color: "var(--c-charcoal)",
              }}
            >
              {p.valor}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
