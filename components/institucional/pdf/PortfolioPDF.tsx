import { PORTFOLIO_INSTITUCIONAL, presentationProjects, optImg } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Página 7 — Portfólio. Página BLUEPRINT, grid duro, captions tabulares.
export function PortfolioPDF() {
  const p = PORTFOLIO_INSTITUCIONAL;

  return (
    <div className={`${styles.page} ${styles.blue}`}>
      <div className={styles.gridLines} />
      <span className={`${styles.corner} ${styles.cTL}`} />
      <span className={`${styles.corner} ${styles.cBR}`} />
      <div className={styles.frame}>
        <div className={styles.runHead}>
          <span className={styles.mono} style={{ fontWeight: 700 }}>BERKAHN — PORTFÓLIO</span>
          <span className={styles.mono}>FOLHA 07/09</span>
        </div>

        <div style={{ paddingTop: 22, paddingBottom: 6 }}>
          <span className={styles.sectionTag} style={{ marginBottom: 12 }}>
            <span className={styles.tagBox}>S.07</span> PORTFÓLIO
          </span>
          <h2 className={styles.display} style={{ fontSize: 40, marginTop: 12 }}>Obras gerenciadas<br />pelos sócios</h2>
        </div>

        <div className={styles.grow} style={{ display: "flex", flexDirection: "column", paddingTop: 8 }}>
          {presentationProjects.map((proj, i) => (
            <div
              key={proj.number}
              style={{ flex: 1, display: "flex", gap: 26, alignItems: "stretch", paddingTop: 14, paddingBottom: 14, borderTop: "1.5px solid rgba(238,241,244,0.35)" }}
            >
              <figure style={{ margin: 0, flex: "0 0 42%", minHeight: 140, position: "relative", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={optImg(proj.images[0], 640)} alt={proj.title} className={styles.imgCover} style={{ position: "absolute", inset: 0 }} />
              </figure>
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
                  <span className={styles.huge} style={{ fontSize: 30 }}>{proj.number}</span>
                  <h3 className={styles.h2} style={{ fontSize: 22 }}>{proj.title}</h3>
                </div>
                {/* spec table tabular */}
                <div style={{ display: "flex", gap: 18, marginBottom: 10, flexWrap: "wrap" }}>
                  {[["LOCAL", proj.location], ["ANO", proj.year], ["ÁREA", proj.area], ["SISTEMA", proj.system]].map(([k, v]) => (
                    <div key={k}>
                      <div className={`${styles.mono} ${styles.monoMute}`} style={{ fontSize: 8 }}>{k}</div>
                      <div className={styles.mono} style={{ fontWeight: 700, fontSize: 9.5 }}>{v}</div>
                    </div>
                  ))}
                </div>
                <p
                  className={`${styles.body} ${styles.bodyMute}`}
                  style={{ fontSize: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                >
                  {proj.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
