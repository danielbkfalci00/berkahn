import { REGIMES_COMERCIAIS } from "@/lib/orcamento-estimativa-data"
import type { RegimeRecomendado } from "@/types/orcamento-estimativa"

interface Props {
  regimeRecomendado: RegimeRecomendado
}

export function RegimesComerciais({ regimeRecomendado }: Props) {
  return (
    <section className="est-secao est-secao-fundo-off" style={{ minHeight: "297mm" }}>
      <div className="est-numero-secao">08</div>
      <h2
        className="est-display"
        style={{ fontSize: "36pt", margin: "12px 0 0", lineHeight: 1.1 }}
      >
        Condições Comerciais
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
        A obra pode ser executada em um dos três regimes a seguir, a definir em
        negociação. O regime escolhido determina como a remuneração da
        construtora se aplica sobre o custo de obra estimado na seção 5.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        {REGIMES_COMERCIAIS.map((r) => {
          const ativo = r.id === regimeRecomendado
          return (
            <div
              key={r.id}
              style={{
                background: "#fff",
                padding: "28px 24px",
                borderRadius: 2,
                borderTop: ativo
                  ? "3px solid var(--c-champagne)"
                  : "3px solid var(--c-divider)",
                boxShadow: ativo
                  ? "0 12px 32px rgba(217,176,97,0.18)"
                  : "0 1px 2px rgba(0,0,0,0.04)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                minHeight: 320,
              }}
            >
              {ativo && (
                <span
                  className="est-eyebrow"
                  style={{
                    color: "var(--c-champagne)",
                    fontSize: "8.5pt",
                    letterSpacing: "0.2em",
                  }}
                >
                  Recomendado
                </span>
              )}
              <h3
                className="est-display"
                style={{
                  fontSize: "20pt",
                  fontWeight: 700,
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                {r.nome}
              </h3>
              <p
                style={{
                  fontSize: "10pt",
                  lineHeight: 1.55,
                  margin: 0,
                  color: "var(--c-soft-gray)",
                }}
              >
                {r.resumo}
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "8px 0 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {r.caracteristicas.map((c, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "9.5pt",
                      lineHeight: 1.5,
                      paddingLeft: 16,
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "0.65em",
                        width: 8,
                        height: 1,
                        background: ativo
                          ? "var(--c-champagne)"
                          : "var(--c-soft-gray)",
                      }}
                    />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <p
        style={{
          fontSize: "9.5pt",
          lineHeight: 1.6,
          color: "var(--c-soft-gray)",
          margin: "32px 0 0",
          fontStyle: "italic",
        }}
      >
        Alterações de escopo solicitadas após o fechamento são gerenciadas,
        orçadas e registradas formalmente com impacto em custo e prazo.
        Procedimento detalhado em contrato.
      </p>
    </section>
  )
}
