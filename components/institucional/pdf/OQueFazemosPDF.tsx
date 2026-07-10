import { O_QUE_FAZEMOS } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Página 3 — O que fazemos. Lista editorial dos 4 serviços com numerais e fios.
export function OQueFazemosPDF() {
  const s = O_QUE_FAZEMOS;

  return (
    <div className={`${styles.page} ${styles.light}`}>
      <div className={styles.frame}>
        <div className={styles.runHead}>
          <span className={styles.eyebrow}>Berkahn · Apresentação Institucional</span>
          <span className={styles.eyebrow}>03 / 09</span>
        </div>

        {/* Cabeçalho de seção */}
        <div style={{ paddingTop: 30, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 14 }}>
              <span className={styles.numeralKicker}>03</span>
              <span className={styles.eyebrow}>{s.label}</span>
            </div>
            <h2 className={styles.h2}>{s.headline}</h2>
          </div>
          <p className={styles.lead} style={{ maxWidth: 250, flexShrink: 0 }}>{s.intro}</p>
        </div>

        <div className={styles.hairline} style={{ marginTop: 26 }} />

        {/* Lista editorial */}
        <div className={styles.grow} style={{ display: "flex", flexDirection: "column" }}>
          {s.servicos.map((serv) => (
            <div
              key={serv.numero}
              style={{
                flex: 1,
                display: "flex",
                gap: 32,
                alignItems: "flex-start",
                paddingTop: 22,
                paddingBottom: 22,
                borderBottom: "1px solid var(--hairline)",
              }}
            >
              <span
                className={styles.display}
                style={{ fontSize: 42, flexShrink: 0, width: 66, lineHeight: 1 }}
              >
                {serv.numero}
              </span>
              <div style={{ display: "flex", gap: 40, flex: 1 }}>
                <h3 className={styles.h3} style={{ flex: "0 0 34%", paddingTop: 4 }}>{serv.title}</h3>
                <p className={styles.body} style={{ flex: 1, paddingTop: 5 }}>{serv.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
