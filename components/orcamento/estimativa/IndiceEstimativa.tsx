import type { SecaoIndice } from "@/lib/orcamento-estimativa-data"

interface Props {
  secoes: SecaoIndice[]
}

export function IndiceEstimativa({ secoes }: Props) {
  return (
    <section className="est-secao est-secao-fundo-off" style={{ minHeight: "297mm" }}>
      <div className="est-eyebrow">Índice</div>
      <h2
        className="est-display"
        style={{ fontSize: "40pt", margin: "8px 0 0", lineHeight: 1.1 }}
      >
        O que você vai encontrar
      </h2>
      <div className="est-divisor-champagne" />

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "48px 0 0",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: 520,
        }}
      >
        {secoes.map((s) => (
          <li
            key={s.numero}
            style={{
              display: "flex",
              alignItems: "baseline",
              borderBottom: "1px solid var(--c-divider)",
              paddingBottom: 14,
              gap: 24,
            }}
          >
            <span className="est-numero-secao" style={{ minWidth: 36 }}>
              {String(s.numero).padStart(2, "0")}
            </span>
            <span
              style={{
                fontSize: "12pt",
                fontWeight: 500,
                letterSpacing: "0.01em",
              }}
            >
              {s.titulo}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
