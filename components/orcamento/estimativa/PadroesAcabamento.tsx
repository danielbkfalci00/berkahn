import { PADROES_ACABAMENTO } from "@/lib/orcamento-estimativa-data"
import type { PadraoAcabamento } from "@/types/orcamento-estimativa"
import { EstimativaImage } from "./EstimativaImage"

interface Props {
  padraoEscolhido: PadraoAcabamento
}

// Mapa de imagem por padrão. Ajustar conforme novo portfólio.
const IMAGENS_PADRAO: Record<PadraoAcabamento, string> = {
  baixo: "/images/galeria/projeto-08.webp",
  medio: "/images/galeria/projeto-15.webp",
  alto: "/images/galeria/projeto-22.webp",
  altissimo:
    "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-living.webp",
}

export function PadroesAcabamento({ padraoEscolhido }: Props) {
  return (
    <section className="est-secao est-secao-fundo-off est-secao-quebra-antes">
      <div className="est-secao-header">
        <div className="est-numero-secao">04</div>
        <h2
          className="est-display"
          style={{ fontSize: "36pt", margin: "12px 0 0", lineHeight: 1.1 }}
        >
          Padrões de Acabamento
        </h2>
        <div className="est-divisor-champagne" />
      </div>

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
              className="est-tabela-row"
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

      <div style={{ marginTop: 32 }}>
        <p
          className="est-eyebrow"
          style={{ marginBottom: 16 }}
        >
          Referências visuais
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
          }}
        >
          {PADROES_ACABAMENTO.map((p) => {
            const ativo = p.id === padraoEscolhido
            return (
              <div
                key={p.id}
                style={{
                  borderTop: ativo
                    ? "2px solid var(--c-champagne)"
                    : "2px solid transparent",
                  paddingTop: 8,
                  opacity: ativo ? 1 : 0.55,
                }}
              >
                <EstimativaImage
                  src={IMAGENS_PADRAO[p.id]}
                  alt={`Exemplo de padrão ${p.nome}`}
                  caption={p.nome}
                  aspect="3:2"
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
