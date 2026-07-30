import { QUEM_SOMOS } from "@/lib/institucional-data";
import { RunHead, Eyebrow, Footer } from "@/components/institucional/pdf/chrome";

// Página 2 — Quem somos. Construtora × empreiteira, números, comparativo.
export function QuemSomosPDF() {
  const q = QUEM_SOMOS;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#FFFFFF",
        padding: "18mm 20mm",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <RunHead label="Quem Somos" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "14mm 0 8mm" }}>
        <Eyebrow>Quem Somos</Eyebrow>
        <h2 style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.02, color: "#1A1A1A", margin: "0 0 26px" }}>
          {q.headline}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 34, marginBottom: 34 }}>
          <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.5, color: "#1A1A1A", margin: 0 }}>{q.intro}</p>
          <p style={{ fontSize: 12.5, fontWeight: 400, lineHeight: 1.6, color: "#666", margin: 0 }}>{q.historia}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid #1A1A1A", borderBottom: "1px solid #e2e0d8" }}>
          {q.stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: i === 0 ? "20px 0" : "20px 22px",
                borderRight: i < 2 ? "1px solid #e2e0d8" : undefined,
              }}
            >
              <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.03em", color: "#1A1A1A", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 400, color: "#666", marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5, color: "#1A1A1A", margin: "30px 0 16px" }}>
          {q.comparativo.subtitulo}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid #e2e0d8" }}>
          <div style={{ padding: "22px 24px", background: "#F4F2EC", borderRight: "1px solid #e2e0d8" }}>
            <div style={{ fontSize: 9.5, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#1A1A1A", marginBottom: 16 }}>
              Construtora Berkahn
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {q.comparativo.construtora.map((it) => (
                <li key={it} style={{ fontSize: 11.5, lineHeight: 1.45, color: "#333", padding: "7px 0", borderTop: "1px solid #e2e0d8" }}>
                  {it}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ padding: "22px 24px", background: "#fff" }}>
            <div style={{ fontSize: 9.5, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999", marginBottom: 16 }}>
              Empreiteira
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {q.comparativo.empreiteira.map((it) => (
                <li key={it} style={{ fontSize: 11.5, lineHeight: 1.45, color: "#666", padding: "7px 0", borderTop: "1px solid #eee" }}>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Footer page="02 / 09" />
    </div>
  );
}
