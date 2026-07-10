import { SISTEMAS_CONSTRUTIVOS, optImg } from "@/lib/institucional-data";
import { RunHead, Eyebrow, Footer, PHOTO_BG } from "@/components/institucional/pdf/chrome";

// Página 4 — Sistemas construtivos (página escura). 3 blocos + diagrama LSF + NBRs.
export function SistemasConstrutivosPDF() {
  const s = SISTEMAS_CONSTRUTIVOS;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#1A1A1A",
        padding: "18mm 20mm",
        display: "flex",
        flexDirection: "column",
        color: "#fff",
      }}
    >
      <RunHead label="Sistemas Construtivos" dark />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "12mm 0" }}>
        <Eyebrow dark>Sistemas Construtivos</Eyebrow>
        <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.05, color: "#fff", margin: "0 0 20px", maxWidth: "22ch" }}>
          {s.headline}
        </h2>
        <p style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.6, color: "#b8b6ae", margin: "0 0 20px", maxWidth: "70ch" }}>
          {s.intro}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 36, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #3a3a3a" }}>
            {s.blocos.map((b, i) => (
              <div key={b.title} style={{ padding: "20px 0", borderBottom: "1px solid #3a3a3a" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", margin: 0 }}>{b.title}</h3>
                  {i === 0 ? (
                    <span
                      style={{
                        fontSize: 8.5,
                        fontWeight: 500,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "#fff",
                        border: "1px solid #555",
                        padding: "3px 8px",
                      }}
                    >
                      {b.subtitle}
                    </span>
                  ) : (
                    <span style={{ fontSize: 8.5, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#999" }}>
                      {b.subtitle}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 11.5, lineHeight: 1.55, color: "#999", margin: 0 }}>{b.description}</p>
              </div>
            ))}
          </div>

          <figure style={{ margin: 0, aspectRatio: "3 / 4", background: PHOTO_BG, position: "relative", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={optImg(s.image, 640)}
              alt={s.imageAlt}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          </figure>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, borderTop: "1px solid #3a3a3a", paddingTop: 16, marginBottom: 16 }}>
        {s.normas.map((n) => (
          <div key={n.norma}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", color: "#fff", marginBottom: 5 }}>{n.norma}</div>
            <div style={{ fontSize: 10, lineHeight: 1.5, color: "#999" }}>{n.descricao}.</div>
          </div>
        ))}
      </div>

      <Footer page="04 / 09" dark />
    </div>
  );
}
