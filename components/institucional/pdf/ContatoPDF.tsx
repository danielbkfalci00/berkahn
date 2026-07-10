import { CONTATO_INSTITUCIONAL, optImg } from "@/lib/institucional-data";
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
      <span className={`${styles.corner} ${styles.cTL}`} />
      <span className={`${styles.corner} ${styles.cBR}`} />
      <div className={styles.frame} style={{ justifyContent: "space-between" }}>
        <div>
          <div className={styles.runHead}>
            <span className={styles.mono} style={{ fontWeight: 700 }}>BERKAHN — CONTATO</span>
            <span className={styles.mono}>FOLHA 09/09</span>
          </div>
          {/* Banda de foto — obra assinatura */}
          <figure className={styles.bleedX} style={{ margin: 0, marginTop: 24, height: 250, position: "relative", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={optImg("/images/Home/hero-4.webp", 828)} alt="Obra Berkahn" className={`${styles.imgCover} ${styles.dim}`} style={{ position: "absolute", inset: 0 }} />
            <span className={styles.mono} style={{ position: "absolute", bottom: 12, left: "var(--edge)" }}>ERGUENDO O AMANHÃ · LIGHT STEEL FRAME</span>
          </figure>
        </div>

        {/* Centro */}
        <div>
          <span className={styles.sectionTag} style={{ marginBottom: 20 }}>
            <span className={styles.tagBox}>S.09</span> CONTATO
          </span>
          <h2 className={styles.display} style={{ fontSize: 62, marginTop: 14 }}>
            Vamos construir<br />juntos?
          </h2>
          <p className={styles.body} style={{ maxWidth: 380, marginTop: 16, fontSize: 12 }}>{c.subtitle}</p>
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
