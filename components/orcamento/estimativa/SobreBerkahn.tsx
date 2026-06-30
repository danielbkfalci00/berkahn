import { SOBRE_BERKAHN } from "@/lib/orcamento-estimativa-data"
import { EstimativaImage } from "./EstimativaImage"

export function SobreBerkahn() {
  return (
    <section className="est-secao est-secao-fundo-off">
      <div className="est-secao-header">
        <div className="est-numero-secao">02</div>
        <h2
          className="est-display"
          style={{ fontSize: "36pt", margin: "12px 0 0", lineHeight: 1.1 }}
        >
          A Construtora
        </h2>
        <div className="est-divisor-champagne" />
      </div>

      <div style={{ margin: "0 0 32px" }}>
        <EstimativaImage
          src="/images/empresa/primeira-imagem.webp"
          alt="Equipe e canteiro Berkahn"
          aspect="16:9"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 56,
          marginTop: 16,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {SOBRE_BERKAHN.paragrafos.map((p, i) => (
            <p key={i} style={{ fontSize: "11pt", lineHeight: 1.75, margin: 0 }}>
              {p}
            </p>
          ))}

          <p
            style={{
              fontSize: "11pt",
              lineHeight: 1.75,
              margin: "16px 0 0",
              fontWeight: 600,
              color: "var(--c-charcoal)",
            }}
          >
            {SOBRE_BERKAHN.compromisso}
          </p>
        </div>

        <div>
          <p
            className="est-eyebrow"
            style={{ marginBottom: 16 }}
          >
            Processos de gestão
          </p>
          <p
            style={{
              fontSize: "11pt",
              lineHeight: 1.6,
              margin: "0 0 16px",
              color: "var(--c-soft-gray)",
            }}
          >
            {SOBRE_BERKAHN.processosTitulo}
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {SOBRE_BERKAHN.processos.map((p, i) => (
              <li
                key={i}
                style={{
                  fontSize: "11pt",
                  lineHeight: 1.5,
                  paddingLeft: 24,
                  position: "relative",
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "0.7em",
                    width: 10,
                    height: 1,
                    background: "var(--c-champagne)",
                  }}
                />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
