import { NATUREZA_DOCUMENTO } from "@/lib/orcamento-estimativa-data"

export function NaturezaDocumento() {
  return (
    <section className="est-secao">
      <div className="est-secao-header">
        <div className="est-numero-secao">01</div>
        <h2
          className="est-display"
          style={{ fontSize: "36pt", margin: "12px 0 0", lineHeight: 1.1 }}
        >
          Natureza deste documento
        </h2>
        <div className="est-divisor-champagne" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 620, marginTop: 32 }}>
        {NATUREZA_DOCUMENTO.intro.map((p, i) => (
          <p key={i} style={{ fontSize: "11pt", lineHeight: 1.7, margin: 0 }}>
            {p}
          </p>
        ))}
      </div>

      <div style={{ marginTop: 40 }}>
        <p
          style={{
            fontSize: "11pt",
            fontWeight: 600,
            margin: "0 0 16px",
            color: "var(--c-charcoal)",
          }}
        >
          {NATUREZA_DOCUMENTO.consolidacaoTitulo}
        </p>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {NATUREZA_DOCUMENTO.consolidacaoItens.map((item, i) => (
            <li
              key={i}
              style={{
                fontSize: "11pt",
                lineHeight: 1.6,
                paddingLeft: 24,
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "0.75em",
                  width: 8,
                  height: 1,
                  background: "var(--c-champagne)",
                }}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p
        style={{
          fontSize: "11pt",
          lineHeight: 1.7,
          margin: "40px 0 0",
          maxWidth: 620,
          fontStyle: "italic",
          color: "var(--c-soft-gray)",
        }}
      >
        {NATUREZA_DOCUMENTO.fechamento}
      </p>
    </section>
  )
}
