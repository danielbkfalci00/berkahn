import { CONTATO_INSTITUCIONAL } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Página 9 — Contato. Fecho BLUEPRINT, título gigante + bloco mono.
export function ContatoPDF() {
  const c = CONTATO_INSTITUCIONAL;

  const canais = [
    { k: "E-MAIL", v: c.email },
    { k: "TELEFONE", v: c.phone },
    { k: "SITE", v: c.website },
    { k: "LINKEDIN", v: c.linkedin },
  ];

  return (
    <div className={`${styles.page} ${styles.blue}`}>
      <div className={styles.gridLines} />
      <div className={styles.frame} style={{ justifyContent: "space-between" }}>
        <div className={styles.runHead}>
          <span className={styles.mono} style={{ fontWeight: 700 }}>BERKAHN — CONTATO</span>
          <span className={styles.mono}>FOLHA 09/09</span>
        </div>

        {/* Centro */}
        <div>
          <span className={styles.sectionTag} style={{ marginBottom: 20 }}>
            <span className={styles.tagBox}>S.09</span> CONTATO
          </span>
          <h2 className={styles.display} style={{ fontSize: 74, marginTop: 16 }}>
            Vamos<br />construir<br />juntos?
          </h2>
          <p className={styles.body} style={{ maxWidth: 380, marginTop: 20, fontSize: 12 }}>{c.subtitle}</p>
        </div>

        {/* Canais */}
        <div>
          <div className={styles.barThick} style={{ marginBottom: 18 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 40px", maxWidth: 640 }}>
            {canais.map((ch) => (
              <div key={ch.k}>
                <div className={`${styles.mono} ${styles.monoMute}`} style={{ marginBottom: 5 }}>{ch.k}</div>
                <div className={styles.monoBig} style={{ fontWeight: 700, wordBreak: "break-word" }}>{ch.v}</div>
              </div>
            ))}
          </div>

          {/* Title-block */}
          <div className={styles.titleBlock} style={{ marginTop: 22 }}>
            <div className={styles.tbCell}><span className={styles.tbKey}>Empresa</span>Berkahn Construtora</div>
            <div className={styles.tbCell}><span className={styles.tbKey}>CNPJ</span>{c.cnpj}</div>
            <div className={styles.tbCell}><span className={styles.tbKey}>Sede</span>{c.local}</div>
            <div className={styles.tbCell} style={{ marginLeft: "auto" }}><span className={styles.tbKey}>Lema</span>Erguendo o amanhã</div>
          </div>
        </div>
      </div>
    </div>
  );
}
