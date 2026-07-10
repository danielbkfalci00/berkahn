import { INSTITUCIONAL_CAPA, optImg } from "@/lib/institucional-data";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Página 1 — Capa. Grotesca gigante flush-left sobre foto crua + title-block.
export function CapaPDF() {
  const c = INSTITUCIONAL_CAPA;

  return (
    <div className={`${styles.page} ${styles.blue}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={optImg(c.heroImage, 1080)} alt="" className={`${styles.imgCover} ${styles.fill} ${styles.dim}`} />
      <span className={`${styles.corner} ${styles.cTL}`} />
      <span className={`${styles.corner} ${styles.cTR}`} />
      <span className={`${styles.corner} ${styles.cBL}`} />
      <span className={`${styles.corner} ${styles.cBR}`} />
      <div className={`${styles.coverGradient} ${styles.fill}`} />

      <div className={styles.frame} style={{ justifyContent: "space-between" }}>
        {/* Cabeçalho técnico */}
        <div className={styles.runHead}>
          <span className={styles.mono} style={{ fontWeight: 700 }}>BERKAHN — CONSTRUTORA</span>
          <span className={styles.mono}>DOC. INSTITUCIONAL / FOLHA 01/09</span>
        </div>

        {/* Título gigante */}
        <div>
          <span className={styles.mono} style={{ display: "block", marginBottom: 18 }}>
            ///// LIGHT STEEL FRAME
          </span>
          <h1 className={styles.display} style={{ fontSize: 88 }}>
            Do conceito<br />à entrega<br />das chaves
          </h1>
          <div className={styles.barThick} style={{ margin: "26px 0 18px", width: 120, height: 4 }} />
          <p className={styles.body} style={{ maxWidth: 420, fontSize: 12.5 }}>
            {c.subtitle}
          </p>
        </div>

        {/* Title-block / carimbo */}
        <div className={styles.titleBlock}>
          <div className={styles.tbCell}>
            <span className={styles.tbKey}>Empresa</span>Berkahn Construtora
          </div>
          <div className={styles.tbCell}>
            <span className={styles.tbKey}>Documento</span>Apresentação Institucional
          </div>
          <div className={styles.tbCell}>
            <span className={styles.tbKey}>Local</span>São Paulo · BR
          </div>
          <div className={styles.tbCell} style={{ marginLeft: "auto" }}>
            <span className={styles.tbKey}>Lema</span>{c.tagline}
          </div>
        </div>
      </div>
    </div>
  );
}
