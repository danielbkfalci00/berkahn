import { CapaPDF } from "@/components/institucional/pdf/CapaPDF";
import { QuemSomosPDF } from "@/components/institucional/pdf/QuemSomosPDF";
import { OQueFazemosPDF } from "@/components/institucional/pdf/OQueFazemosPDF";
import { SistemasConstrutivosPDF } from "@/components/institucional/pdf/SistemasConstrutivosPDF";
import { ModelosContratacaoPDF } from "@/components/institucional/pdf/ModelosContratacaoPDF";
import { ComoTrabalhamosPDF } from "@/components/institucional/pdf/ComoTrabalhamosPDF";
import { PortfolioPDF } from "@/components/institucional/pdf/PortfolioPDF";
import { FundadoresParceirosPDF } from "@/components/institucional/pdf/FundadoresParceirosPDF";
import { ContatoPDF } from "@/components/institucional/pdf/ContatoPDF";
import styles from "@/app/institucional/pdf/institucional.module.css";

// Documento institucional em formato A4 (renderizado pelo Puppeteer via
// /api/institucional/pdf). Cada <section className="h-screen"> vira uma página:
// o viewport 794×1123 da rota API é o que pagina o PDF.
// Wrapper <div> (não <main>): a regra global `@media print main { padding: 1.5cm }`
// do globals.css inflaria o layout na renderização de impressão.
// Sistema visual "Monografia editorial" em institucional.module.css (.root cascateia
// as CSS vars de fonte/paleta para todos os componentes).

const PAGINAS = [
  CapaPDF,
  QuemSomosPDF,
  OQueFazemosPDF,
  SistemasConstrutivosPDF,
  ModelosContratacaoPDF,
  ComoTrabalhamosPDF,
  PortfolioPDF,
  FundadoresParceirosPDF,
  ContatoPDF,
];

export default function InstitucionalPDFPage() {
  return (
    <div className={`${styles.root} relative`} style={{ background: "#1a1a1a" }}>
      {PAGINAS.map((Pagina, index) => (
        <section key={index} className="h-screen overflow-hidden">
          <Pagina />
        </section>
      ))}
    </div>
  );
}
