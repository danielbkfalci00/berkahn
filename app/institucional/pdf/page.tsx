import { CapaPDF } from "@/components/institucional/pdf/CapaPDF";
import { QuemSomosPDF } from "@/components/institucional/pdf/QuemSomosPDF";
import { OQueFazemosPDF } from "@/components/institucional/pdf/OQueFazemosPDF";
import { SistemasConstrutivosPDF } from "@/components/institucional/pdf/SistemasConstrutivosPDF";
import { ModelosContratacaoPDF } from "@/components/institucional/pdf/ModelosContratacaoPDF";
import { ComoTrabalhamosPDF } from "@/components/institucional/pdf/ComoTrabalhamosPDF";
import { PortfolioPDF } from "@/components/institucional/pdf/PortfolioPDF";
import { FundadoresParceirosPDF } from "@/components/institucional/pdf/FundadoresParceirosPDF";
import { ContatoPDF } from "@/components/institucional/pdf/ContatoPDF";

// Documento institucional A4 (renderizado pelo Puppeteer via /api/institucional/pdf).
// Cada <section className="h-screen"> vira uma página: o viewport 794×1123 da rota
// API é o que pagina o PDF (794×1123px ≈ 210×297mm @96dpi).
// Wrapper <div> (não <main>): a regra global `@media print main { padding: 1.5cm }`
// do globals.css inflaria o layout na renderização de impressão.
// v4 — porte fiel do design aprovado no Claude Design ("Berkahn Institucional.dc.html").
// Tipografia: Manrope, reaproveitada da global (--font-manrope em app/layout.tsx).

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
    <div
      className="relative"
      style={{ fontFamily: "var(--font-manrope), sans-serif", background: "#1A1A1A" }}
    >
      {PAGINAS.map((Pagina, index) => (
        <section key={index} className="h-screen overflow-hidden">
          <Pagina />
        </section>
      ))}
    </div>
  );
}
