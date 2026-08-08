import { FUNDADORES, PARCEIROS, optImg } from "@/lib/institucional-data";
import { RunHead, Eyebrow, Footer, PHOTO_BG } from "@/components/institucional/pdf/chrome";

// Página 8 — Fundadores + marcas parceiras. Três retratos + faixa de logos.
export function FundadoresParceirosPDF() {
  // "Brand 01" é placeholder; exibimos as marcas reais (Lumen, Knauf, Aquapanel).
  const marcas = PARCEIROS.filter((m) => m.name !== "Brand 01");

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
      <RunHead label="Fundadores" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "14mm 0" }}>
        <Eyebrow>Fundadores</Eyebrow>
        <h2 style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.02, color: "#1A1A1A", margin: "0 0 44px" }}>
          Experiência que constrói confiança
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 30 }}>
          {FUNDADORES.map((f) => (
            <div key={f.name}>
              <figure style={{ margin: "0 0 20px", aspectRatio: "4 / 5", background: PHOTO_BG, position: "relative", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={optImg(f.image, 640)}
                  alt={f.name}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                />
              </figure>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px" }}>{f.name}</h3>
              <div style={{ fontSize: 9.5, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#666", marginBottom: 16 }}>
                {f.role}
              </div>
              <p style={{ fontSize: 11, lineHeight: 1.6, color: "#666", margin: 0 }}>{f.bio}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid #e2e0d8", paddingTop: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#666", marginBottom: 16 }}>
          Marcas parceiras
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
          {marcas.map((m) => (
            <div key={m.name} style={{ height: 56, background: PHOTO_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={optImg(m.logo, 256)}
                alt={m.name}
                style={{ maxHeight: 30, maxWidth: "68%", width: "auto", objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      </div>

      <Footer page="08 / 09" />
    </div>
  );
}
