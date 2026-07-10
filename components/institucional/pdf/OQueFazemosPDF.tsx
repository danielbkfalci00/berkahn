import { O_QUE_FAZEMOS } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Página 3 — O que fazemos. Spec-list numerada com barras grossas.
export function OQueFazemosPDF() {
  const s = O_QUE_FAZEMOS;

  return (
    <div className={`${styles.page} ${styles.light}`}>
      <div className={styles.frame}>
        <div className={styles.runHead}>
          <span className={styles.mono} style={{ fontWeight: 700 }}>BERKAHN — O QUE FAZEMOS</span>
          <span className={styles.mono}>FOLHA 03/09</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, paddingTop: 26 }}>
          <div>
            <span className={styles.sectionTag} style={{ marginBottom: 14 }}>
              <span className={styles.tagBox}>S.03</span> O QUE FAZEMOS
            </span>
            <h2 className={styles.display} style={{ fontSize: 50, marginTop: 14 }}>
              Da prancheta<br />ao canteiro
            </h2>
          </div>
          <p className={styles.body} style={{ maxWidth: 230, flexShrink: 0 }}>{s.intro}</p>
        </div>

        <div className={styles.barThick} style={{ marginTop: 24 }} />

        {/* 4 serviços */}
        <div className={styles.grow} style={{ display: "flex", flexDirection: "column" }}>
          {s.servicos.map((serv) => (
            <div
              key={serv.numero}
              style={{
                flex: 1,
                display: "flex",
                gap: 28,
                alignItems: "flex-start",
                paddingTop: 20,
                paddingBottom: 20,
                borderBottom: "1.5px solid var(--ink)",
              }}
            >
              <span className={styles.huge} style={{ fontSize: 56, width: 96, flexShrink: 0, color: "var(--blueprint-line)" }}>
                {serv.numero}
              </span>
              <div style={{ display: "flex", gap: 36, flex: 1 }}>
                <h3 className={styles.h2} style={{ flex: "0 0 36%", fontSize: 21 }}>{serv.title}</h3>
                <p className={`${styles.body} ${styles.bodyMute}`} style={{ flex: 1 }}>{serv.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
