import { MODELOS_CONTRATACAO } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Página 5 — Modelos de contratação. Dois blocos editoriais lado a lado.
export function ModelosContratacaoPDF() {
  const m = MODELOS_CONTRATACAO;

  return (
    <div className={`${styles.page} ${styles.light}`}>
      <div className={styles.frame}>
        <div className={styles.runHead}>
          <span className={styles.eyebrow}>Berkahn · Apresentação Institucional</span>
          <span className={styles.eyebrow}>05 / 09</span>
        </div>

        {/* Cabeçalho */}
        <div style={{ paddingTop: 30, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 14 }}>
              <span className={styles.numeralKicker}>05</span>
              <span className={styles.eyebrow}>{m.label}</span>
            </div>
            <h2 className={styles.h2} style={{ maxWidth: 420 }}>{m.headline}</h2>
          </div>
          <p className={styles.lead} style={{ maxWidth: 260, flexShrink: 0 }}>{m.intro}</p>
        </div>

        {/* Dois modelos */}
        <div className={styles.grow} style={{ display: "flex", gap: 48, paddingTop: 34 }}>
          {m.modelos.map((mod, i) => (
            <div key={mod.title} style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
              {i === 1 && (
                <div style={{ position: "absolute", left: -24, top: 6, bottom: 6, width: 1, background: "var(--hairline)" }} />
              )}
              <div style={{ height: 3, width: 46, background: "var(--ink)", opacity: mod.destaque ? 1 : 0.25, marginBottom: 20 }} />
              <span className={styles.eyebrow} style={{ marginBottom: 10 }}>{mod.badge}</span>
              <h3 className={styles.display} style={{ fontSize: 30, marginBottom: 14 }}>{mod.title}</h3>
              <p className={styles.body} style={{ marginBottom: 20 }}>{mod.description}</p>
              <ul className={styles.tickList} style={{ marginTop: 26 }}>
                {mod.items.map((it) => (
                  <li key={it} className={styles.tickItem}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
