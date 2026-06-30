import { CircleDot } from "lucide-react"
import { PROXIMOS_PASSOS_DEFAULT } from "@/lib/orcamento-estimativa-data"

export function ProximosPassos() {
  return (
    <section className="est-secao">
      <div className="est-secao-header">
        <div className="est-numero-secao">09</div>
        <h2
          className="est-display"
          style={{ fontSize: "36pt", margin: "12px 0 0", lineHeight: 1.1 }}
        >
          Próximos Passos
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
        Para elaborar o orçamento analítico detalhado e firmar o contrato de
        construção, precisamos dos seguintes documentos e definições:
      </p>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          maxWidth: 620,
        }}
      >
        {PROXIMOS_PASSOS_DEFAULT.map((p, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
              padding: "16px 0",
              borderBottom: "1px solid var(--c-divider)",
            }}
          >
            <CircleDot
              size={20}
              strokeWidth={1.5}
              color="var(--c-champagne)"
              style={{ flexShrink: 0, marginTop: 2 }}
            />
            <span
              style={{
                fontSize: "11pt",
                lineHeight: 1.55,
                color: "var(--c-charcoal)",
                fontWeight: 500,
              }}
            >
              {p}
            </span>
          </li>
        ))}
      </ul>

      <p
        style={{
          fontSize: "10.5pt",
          lineHeight: 1.65,
          color: "var(--c-soft-gray)",
          margin: "40px 0 0",
          maxWidth: 620,
          fontStyle: "italic",
        }}
      >
        Permanecemos à disposição para esclarecer qualquer ponto e avançar para
        a próxima etapa.
      </p>
    </section>
  )
}
