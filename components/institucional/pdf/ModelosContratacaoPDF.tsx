import { MODELOS_CONTRATACAO } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Página 5 — Modelos de contratação. Dois blocos com números gigantes.
export function ModelosContratacaoPDF() {
  const m = MODELOS_CONTRATACAO;

  return (
    <div className={`${styles.page} ${styles.light}`}>
      <div className={styles.frame}>
        <div className={styles.runHead}>
          <span className={styles.mono} style={{ fontWeight: 700 }}>BERKAHN — MODELOS DE CONTRATAÇÃO</span>
          <span className={styles.mono}>FOLHA 05/09</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, paddingTop: 26 }}>
          <div>
            <span className={styles.sectionTag} style={{ marginBottom: 14 }}>
              <span className={styles.tagBox}>S.05</span> MODELOS DE CONTRATAÇÃO
            </span>
            <h2 className={styles.display} style={{ fontSize: 46, marginTop: 14 }}>
              Dois jeitos<br />de trabalhar
            </h2>
          </div>
          <p className={styles.body} style={{ maxWidth: 250, flexShrink: 0 }}>{m.intro}</p>
        </div>

        <div className={styles.barThick} style={{ marginTop: 22 }} />

        <div className={styles.grow} style={{ display: "flex", gap: 40, paddingTop: 26 }}>
          {m.modelos.map((mod, i) => (
            <div key={mod.title} style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
              {i === 1 && (
                <div style={{ position: "absolute", left: -20, top: 0, bottom: 0, width: 3, background: "var(--ink)" }} />
              )}
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 12 }}>
                <span className={styles.huge} style={{ fontSize: 64, color: mod.destaque ? "var(--blueprint-line)" : "var(--ink)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.mono} style={{ fontWeight: 700 }}>{mod.badge}</span>
              </div>
              <h3 className={styles.h2} style={{ fontSize: 26, marginBottom: 12 }}>{mod.title}</h3>
              <p className={`${styles.body} ${styles.bodyMute}`} style={{ marginBottom: 18 }}>{mod.description}</p>
              <ul className={styles.specList}>
                {mod.items.map((it) => (
                  <li key={it} className={styles.specItem}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
