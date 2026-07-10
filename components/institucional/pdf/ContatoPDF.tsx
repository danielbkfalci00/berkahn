import { CONTATO_INSTITUCIONAL } from "@/lib/institucional-data";
import { RunHead, Eyebrow } from "@/components/institucional/pdf/chrome";

// Página 9 — Contato (fecho preto). Título grande + canais + carimbo institucional.
export function ContatoPDF() {
  const c = CONTATO_INSTITUCIONAL;

  const canais: [string, string][] = [
    ["E-mail", c.email],
    ["Telefone", c.phone],
    ["Site", c.website],
    ["LinkedIn", c.linkedin],
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#000000",
        padding: "18mm 20mm",
        display: "flex",
        flexDirection: "column",
        color: "#fff",
      }}
    >
      <RunHead label="Contato" dark />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "14mm 0" }}>
        <Eyebrow dark>Contato</Eyebrow>
        <div style={{ width: 52, height: 1.5, background: "#fff", marginBottom: 26 }} />
        <h2 style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.0, color: "#fff", margin: "0 0 22px" }}>
          {c.headline}
        </h2>
        <p style={{ fontSize: 17, fontWeight: 300, lineHeight: 1.5, color: "#cfcdc6", margin: "0 0 56px", maxWidth: "44ch" }}>
          {c.subtitle}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid #333" }}>
          {canais.map(([k, v], i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            return (
              <div
                key={k}
                style={{
                  padding: col === 0 ? "22px 24px 22px 0" : "22px 0 22px 24px",
                  borderRight: col === 0 ? "1px solid #333" : undefined,
                  borderBottom: row === 0 ? "1px solid #333" : undefined,
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", marginBottom: 8 }}>
                  {k}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", wordBreak: "break-word" }}>{v}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ borderTop: "1px solid #333", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ fontSize: 10, fontWeight: 400, color: "#888", lineHeight: 1.7 }}>
          <span style={{ fontWeight: 800, letterSpacing: "0.18em", color: "#fff", fontSize: 12 }}>BERKAHN</span>
          <br />
          CNPJ {c.cnpj}
          <br />
          {c.local}
        </div>
        <span style={{ fontSize: 17, fontWeight: 300, color: "#cfcdc6" }}>Erguendo o amanhã</span>
      </div>
    </div>
  );
}
