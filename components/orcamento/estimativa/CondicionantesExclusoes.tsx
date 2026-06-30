import {
  CONDICIONANTES_DEFAULT,
  EXCLUSOES_DEFAULT,
} from "@/lib/orcamento-estimativa-data"
import type {
  CondicionanteExtra,
  ExclusaoExtra,
} from "@/types/orcamento-estimativa"

interface Props {
  condicionantesExtras: CondicionanteExtra[]
  exclusoesExtras: ExclusaoExtra[]
}

interface ListaProps {
  titulo: string
  sub: string
  itens: string[]
}

function Lista({ titulo, sub, itens }: ListaProps) {
  return (
    <div>
      <div className="est-eyebrow" style={{ marginBottom: 12 }}>
        {titulo}
      </div>
      <p
        style={{
          fontSize: "10pt",
          lineHeight: 1.55,
          color: "var(--c-soft-gray)",
          margin: "0 0 20px",
        }}
      >
        {sub}
      </p>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {itens.map((item, i) => (
          <li
            key={i}
            style={{
              fontSize: "10.5pt",
              lineHeight: 1.6,
              paddingLeft: 22,
              position: "relative",
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
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CondicionantesExclusoes({
  condicionantesExtras,
  exclusoesExtras,
}: Props) {
  const condicionantes = [
    ...CONDICIONANTES_DEFAULT,
    ...condicionantesExtras.map((c) => c.texto),
  ]
  const exclusoes = [
    ...EXCLUSOES_DEFAULT,
    ...exclusoesExtras.map((e) => e.texto),
  ]

  return (
    <section className="est-secao">
      <div className="est-numero-secao">07</div>
      <h2
        className="est-display"
        style={{ fontSize: "36pt", margin: "12px 0 0", lineHeight: 1.1 }}
      >
        Condicionantes & Exclusões
      </h2>
      <div className="est-divisor-champagne" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 56,
          marginTop: 32,
        }}
      >
        <Lista
          titulo="7.1 — Condicionantes"
          sub="Dependem de informação técnica ainda não disponível. Não estão na faixa e, se necessários, serão orçados à parte."
          itens={condicionantes}
        />
        <Lista
          titulo="7.2 — Exclusões"
          sub="Não fazem parte do escopo desta estimativa e, se desejados, são contratados separadamente."
          itens={exclusoes}
        />
      </div>
    </section>
  )
}
