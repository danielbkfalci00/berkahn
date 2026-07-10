import { PORTFOLIO_INSTITUCIONAL, presentationProjects, optImg } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Página 7 — Portfólio. Galeria editorial escura de 3 obras.
export function PortfolioPDF() {
  const p = PORTFOLIO_INSTITUCIONAL;

  return (
    <div className={`${styles.page} ${styles.dark}`}>
      <div className={styles.frame}>
        <div className={styles.runHead}>
          <span className={styles.eyebrow}>Berkahn · Apresentação Institucional</span>
          <span className={styles.eyebrow}>07 / 09</span>
        </div>

        {/* Cabeçalho */}
        <div style={{ paddingTop: 26, paddingBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 12 }}>
            <span className={styles.numeralKicker}>07</span>
            <span className={styles.eyebrow}>{p.label}</span>
          </div>
          <h2 className={styles.h2}>{p.headline}</h2>
        </div>

        {/* 3 obras */}
        <div className={styles.grow} style={{ display: "flex", flexDirection: "column", paddingTop: 12 }}>
          {presentationProjects.map((proj, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={proj.number}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: reversed ? "row-reverse" : "row",
                  gap: 30,
                  alignItems: "center",
                  borderTop: i === 0 ? "none" : "1px solid var(--hairline-dark)",
                  paddingTop: 16,
                  paddingBottom: 16,
                }}
              >
                <figure style={{ margin: 0, flex: "0 0 44%", height: "100%", minHeight: 150, position: "relative", overflow: "hidden", borderRadius: 2 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={optImg(proj.images[0], 828)} alt={proj.title} className={styles.imgCover} style={{ position: "absolute", inset: 0 }} />
                </figure>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
                    <span className={styles.numeralKicker} style={{ fontSize: 22 }}>{proj.number}</span>
                    <h3 className={styles.h3} style={{ fontSize: 24 }}>{proj.title}</h3>
                  </div>
                  <p className={styles.eyebrow} style={{ marginBottom: 12, lineHeight: 1.5 }}>
                    {proj.location} · {proj.year} · {proj.area} · {proj.system}
                  </p>
                  <p
                    className={`${styles.body} ${styles.bodySoft}`}
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {proj.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
