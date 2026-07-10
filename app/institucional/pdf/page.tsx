// Documento institucional em formato A4 (renderizado pelo Puppeteer via
// /api/institucional/pdf). Cada <section className="h-screen"> vira uma página:
// o viewport 794×1123 da rota API é o que pagina o PDF.
// Wrapper <div> (não <main>): a regra global `@media print main { padding: 1.5cm }`
// do globals.css inflaria o layout na renderização de impressão.

const PAGINAS = [
  "Capa",
  "Quem somos",
  "O que fazemos",
  "Sistemas construtivos",
  "Modelos de contratação",
  "Como trabalhamos",
  "Portfólio",
  "Fundadores e parceiros",
  "Contato",
];

export default function InstitucionalPDFPage() {
  return (
    <div className="relative bg-white">
      {PAGINAS.map((titulo) => (
        <section
          key={titulo}
          className="h-screen flex flex-col justify-center overflow-hidden"
        >
          <p className="text-center text-black/40 text-sm uppercase tracking-[0.3em]">
            {titulo}
          </p>
        </section>
      ))}
    </div>
  );
}
