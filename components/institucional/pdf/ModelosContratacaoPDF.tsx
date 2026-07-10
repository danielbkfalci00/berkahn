import { MODELOS_CONTRATACAO, optImg } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

const MODELO_IMG = [
  "/images/Services/servicos-finished.webp",
  "/images/Lsf/lsf-hero-structure.webp",
];

// Página 5 — Modelos de contratação. Dois blocos + foto por modelo.
export function ModelosContratacaoPDF() {
  const m = MODELOS_CONTRATACAO;

  return (
    <div className={`${styles.page} ${styles.light}`}>
      <span className={`${styles.corner} ${styles.cTL}`} />
      <span className={`${styles.corner} ${styles.cBR}`} />
      <div className={styles.frame}>
        <div className={styles.runHead}>
          <span className={styles.mono} style={{ fontWeight: 700 }}>BERKAHN — MODELOS DE CONTRATAÇÃO</span>
          <span className={styles.mono}>FOLHA 05/09</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, paddingTop: 24 }}>
          <div>
            <span className={styles.sectionTag} style={{ marginBottom: 14 }}>
              <span className={styles.tagBox}>S.05</span> MODELOS DE CONTRATAÇÃO
            </span>
            <h2 className={styles.display} style={{ fontSize: 44, marginTop: 12 }}>
              Dois jeitos<br />de trabalhar
            </h2>
          </div>
          <p className={styles.body} style={{ maxWidth: 240, flexShrink: 0 }}>{m.intro}</p>
        </div>

        <div className={styles.barThick} style={{ marginTop: 20 }} />

        <div className={styles.grow} style={{ display: "flex", gap: 36, paddingTop: 22 }}>
          {m.modelos.map((mod, i) => (
            <div key={mod.title} style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
              {i === 1 && (
                <div style={{ position: "absolute", left: -18, top: 0, bottom: 0, width: 3, background: "var(--ink)" }} />
              )}
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
                <span className={styles.huge} style={{ fontSize: 56, color: mod.destaque ? "var(--blueprint-line)" : "var(--ink)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.mono} style={{ fontWeight: 700 }}>{mod.badge}</span>
              </div>
              <h3 className={styles.h2} style={{ fontSize: 23, marginBottom: 10 }}>{mod.title}</h3>
              <p className={`${styles.body} ${styles.bodyMute}`} style={{ marginBottom: 14, fontSize: 10.5 }}>{mod.description}</p>
              <ul className={styles.specList}>
                {mod.items.map((it) => (
                  <li key={it} className={styles.specItem} style={{ fontSize: 10.5 }}>{it}</li>
                ))}
              </ul>
              <figure style={{ margin: 0, marginTop: "auto", width: "100%", height: 360, position: "relative", overflow: "hidden" }}>
                <span className={styles.mono} style={{ position: "absolute", bottom: 8, left: 8, zIndex: 2, background: "var(--ink)", color: "var(--paper)", padding: "2px 7px", fontSize: 8 }}>
                  {mod.destaque ? "OBRA CONCLUÍDA" : "ESTRUTURA LSF"}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={optImg(MODELO_IMG[i], 640)} alt={mod.title} className={styles.imgCover} style={{ position: "absolute", inset: 0 }} />
              </figure>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
