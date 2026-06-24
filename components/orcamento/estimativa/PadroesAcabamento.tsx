import { PADROES_ACABAMENTO } from "@/lib/orcamento-estimativa-data"
import type { PadraoAcabamento } from "@/types/orcamento-estimativa"

interface Props {
  padraoEscolhido: PadraoAcabamento
}

export function PadroesAcabamento({ padraoEscolhido }: Props) {
  return (
    <section className="est-secao est-secao-fundo-off" style={{ minHeight: "297mm" }}>
      <div className="est-numero-secao">04</div>
      <h2
        className="est-display"
        style={{ fontSize: "36pt", margin: "12px 0 0", lineHeight: 1.1 }}
      >
        Padrões de Acabamento
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
        O padrão de acabamento é o fator que mais influencia o custo por metro
        quadrado. Para situar a estimativa, trabalhamos com quatro níveis de
        referência. A escolha de um padrão superior eleva o custo por m².
      </p>

      <div
        style={{
          background: "#fff",
          border: "1px solid var(--c-divider)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {PADROES_ACABAMENTO.map((p, idx) => {
          const ativo = p.id === padraoEscolhido
          return (
            <div
              key={p.id}
              style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr 160px",
                padding: "24px 28px",
                gap: 24,
                borderTop: idx === 0 ? "none" : "1px solid var(--c-divider)",
                background: ativo ? "rgba(217,176,97,0.08)" : "transparent",
                borderLeft: ativo
                  ? "3px solid var(--c-champagne)"
                  : "3px solid transparent",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  className="est-display"
                  style={{
                    fontSize: "18pt",
                    fontWeight: 700,
                    color: "var(--c-charcoal)",
                  }}
                >
                  {p.nome}
                </div>
              </div>
              <div
                style={{
                  fontSize: "10.5pt",
                  lineHeight: 1.6,
                  color: "var(--c-soft-gray)",
                }}
              >
                {p.descricao}
              </div>
              <div style={{ textAlign: "right" }}>
                {ativo && (
                  <span
                    className="est-eyebrow"
                    style={{
                      color: "var(--c-champagne)",
                      fontSize: "8.5pt",
                      letterSpacing: "0.2em",
                    }}
                  >
                    Adotado
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
