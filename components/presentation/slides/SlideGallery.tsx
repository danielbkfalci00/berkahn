"use client";

import { SlideSection } from "../ui/SlideSection";
import { DomeGallery } from "../DomeGallery";

const SUPABASE_STORAGE = "https://sfqaknxomxwmviarpwfy.supabase.co/storage/v1/object/public/galeria";

// Helper para gerar entrada de imagem por número (alt opcional para descrição rica)
const img = (n: number, alt?: string) => ({
  src: `/images/galeria/projeto-${String(n).padStart(2, "0")}.webp`,
  alt: alt ?? `Projeto BERKAHN ${n}`,
});

// Ordem otimizada para o dome:
// - Índices 0-9 = coluna frontal (visível sem girar) → interiores acabados em destaque + fachadas nobres
// - Índices 10-13 e 36-41 = colunas laterais imediatas
// - Vídeos espaçados em 14, 28, 40 para distribuição uniforme na esfera
// - Fundo (índices 23-35) = bloco "obra em LSF": chalés A-frame (mantidos 3) + detalhes estruturais
const galleryImages = [
  // ── Frente central (visível ao abrir o slide) — interiores acabados em destaque ──
  img(35), // 0  • sala ampla com lareira de cimento queimado
  img(43, "Suíte acabada com teto em vigas de madeira e saída para varanda — residência em Light Steel Frame"), // 1 ⭐ NOVO
  img(40), // 2  ⭐ fachada pedra + vidro + metal (centro absoluto)
  img(44, "Suíte integrada ao banheiro com acabamento em madeira — residência Berkahn"), // 3 ⭐ NOVO
  img(37), // 4  • cozinha bancada granito preto
  img(45, "Banheiro acabado com pastilha verde e bancada de madeira — residência Berkahn"), // 5 • NOVO
  img(41), // 6  • escada moderna metal preto + madeira + vidro
  img(36), // 7  • parede ripado madeira nobre (acabamento)
  img(39), // 8  • banheiro porcelanato cinza
  img(30), // 9  • janelas pretas com céu (frame moderno)

  // ── Lateral direita imediata ─────────────────────────────────
  img(38), // 10 • fachada comercial pedra cinza
  img(13), // 11 • steel frame estrutural vertical (metal)
  img(46, "Banheiro com box de vidro e revestimento em pastilha — residência Berkahn"), // 12 • NOVO
  img(26), // 13 • viga metálica + porta de aço (industrial)
  { src: `${SUPABASE_STORAGE}/obra-sem-dor-de-cabeca.mp4`, alt: "Obra sem dor de cabeça" }, // 14 • VÍDEO 1

  // ── Meio (visível só ao girar) ───────────────────────────────
  img(14), // 15 • estrutura em obra com pessoa
  img(17), // 16 • escada metálica estrutural
  img(27), // 17 • estrutura interior com céu
  img(28), // 18 • estrutura + instalações
  img(18), // 19 • estrutura interna com vão
  img(33), // 20 • poço/janela com estrutura
  img(24), // 21 • escada concreto pré-fabricada
  img(23), // 22 • interior estrutura

  // ── Fundo do globo — bloco "obra em LSF": chalés (3 mantidos) + detalhes ──
  img(8, "Chalé A-frame em Light Steel Frame com cobertura metálica e revestimento em madeira"), // 23 • chalé (mantido)
  img(4, "Chalé A-frame em Light Steel Frame, vista lateral ao entardecer"), // 24 • chalé (mantido)
  img(47, "Detalhe estrutural em Light Steel Frame (perfil galvanizado SMART G90) durante a obra"), // 25 • NOVO
  img(42), // 26 • vista aérea da estrutura na cidade
  img(31), // 27 • garagem com forro estrutural
  { src: `${SUPABASE_STORAGE}/expansao-jardim-europa.mp4`, alt: "Expansão Jardim Europa" }, // 28 • VÍDEO 2
  img(1, "Chalé A-frame em Light Steel Frame com fechamento em madeira e estrutura aparente"), // 29 • chalé (mantido)
  img(48, "Beiral em madeira sobre estrutura de aço galvanizado — execução em Light Steel Frame"), // 30 • NOVO
  img(19), // 31 • interior drywall
  img(21), // 32 • drywall interior
  img(29), // 33 • lã de vidro isolamento
  img(32), // 34 • drywall com pessoa
  img(20), // 35 • lã de vidro isolamento

  // ── Lateral esquerda imediata ────────────────────────────────
  img(34), // 36 • interior estrutura escada
  img(25), // 37 • forro estrutural
  img(22), // 38 • forro estrutura
  img(16), // 39 • viga industrial
  { src: `${SUPABASE_STORAGE}/video-whatsapp-obra.mp4`, alt: "Obra em andamento" }, // 40 • VÍDEO 3
  img(15), // 41 • painel interno metálico
];

export function SlideGallery() {
  return (
    <SlideSection dark className="relative overflow-hidden !min-h-[120dvh]">
      <div className="absolute inset-0 flex flex-col">
        {/* Header */}
        <div className="text-center pt-8 pb-4 z-10 relative">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/40 mb-2">
            Portfólio
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            Galeria de Projetos
          </h2>
        </div>

        {/* Gallery Container */}
        <div className="flex-1 relative min-h-0">
          <DomeGallery
            images={galleryImages}
            fit={0.85}
            minRadius={700}
            maxVerticalRotationDeg={3}
            segments={26}
            dragDampening={1.2}
            grayscale={false}
            overlayBlurColor="#0a0a0a"
            imageBorderRadius="16px"
            padFactor={0.08}
          />
        </div>

        {/* Instruction */}
        <div className="text-center pt-2 pb-6 z-10 relative">
          <p className="text-xs text-white/40">
            Arraste para explorar • Clique para ampliar
          </p>
        </div>
      </div>
    </SlideSection>
  );
}
