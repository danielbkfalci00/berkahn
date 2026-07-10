import { MODELOS_CONTRATACAO } from "@/lib/institucional-data";
import { RunHead, Eyebrow, Footer } from "@/components/institucional/pdf/chrome";

// Página 5 — Modelos de contratação. Dois blocos (obra completa em destaque + time LSF).
export function ModelosContratacaoPDF() {
  const m = MODELOS_CONTRATACAO;

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
      <RunHead label="Modelos de Contratação" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "16mm 0" }}>
        <Eyebrow>Modelos de Contratação</Eyebrow>
        <h2 style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.02, color: "#1A1A1A", margin: "0 0 20px" }}>
          {m.headline}
        </h2>
        <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.55, color: "#666", margin: "0 0 44px", maxWidth: "62ch" }}>
          {m.intro}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid #e2e0d8" }}>
          {m.modelos.map((mod) => {
            const dark = mod.destaque;
            return (
              <div
                key={mod.badge}
                style={{
                  padding: "34px 34px",
                  borderRight: dark ? "1px solid #e2e0d8" : undefined,
                  background: dark ? "#1A1A1A" : "#fff",
                  color: dark ? "#fff" : undefined,
                }}
              >
                <div
                  style={{
                    fontSize: 9.5,
                    fontWeight: 500,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: dark ? "#888" : "#999",
                    marginBottom: 12,
                  }}
                >
                  {mod.badge}
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: dark ? "#fff" : "#1A1A1A", margin: "0 0 16px" }}>
                  {mod.title}
                </h3>
                <p style={{ fontSize: 12.5, lineHeight: 1.6, color: dark ? "#b8b6ae" : "#666", margin: "0 0 26px" }}>{mod.description}</p>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {mod.items.map((it) => (
                    <li
                      key={it}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: dark ? "#fff" : "#1A1A1A",
                        padding: "11px 0",
                        borderTop: `1px solid ${dark ? "#3a3a3a" : "#e2e0d8"}`,
                      }}
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <Footer page="05 / 09" />
    </div>
  );
}
