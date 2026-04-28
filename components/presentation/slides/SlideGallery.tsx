"use client";

import { SlideSection } from "../ui/SlideSection";
import { DomeGallery } from "../DomeGallery";

const SUPABASE_STORAGE = "https://sfqaknxomxwmviarpwfy.supabase.co/storage/v1/object/public/galeria";

// Helper para gerar entrada de imagem por número
const img = (n: number) => ({
  src: `/images/galeria/projeto-${String(n).padStart(2, "0")}.webp`,
  alt: `Projeto BERKAHN ${n}`,
});

// Ordem otimizada para o dome:
// - Índices 0-9 ocupam a coluna frontal (visível sem girar) → fachadas nobres + metal
// - Índices 10-14 e 40-44 ocupam as colunas laterais imediatas
// - Vídeos espaçados em 14, 28, 42 para distribuição uniforme na esfera
// - Chalés concentrados no fundo do globo (índices 23-39)
const galleryImages = [
  // ── Frente central (visível ao abrir o slide) ─────────────────
  img(36), // 0  • parede ripado madeira nobre (acabamento)
  img(13), // 1  • steel frame estrutural vertical (metal)
  img(40), // 2  ⭐ fachada pedra + vidro + metal (centro absoluto)
  img(35), // 3  • sala ampla com lareira de cimento queimado
  img(37), // 4  • cozinha bancada granito preto
  img(41), // 5  • escada moderna metal preto + madeira + vidro
  img(30), // 6  • janelas pretas com céu (frame moderno)
  img(26), // 7  • viga metálica + porta de aço (industrial)
  img(39), // 8  • banheiro porcelanato cinza
  img(42), // 9  • vista aérea da estrutura na cidade

  // ── Lateral direita imediata ─────────────────────────────────
  img(38), // 10 • fachada comercial pedra cinza
  img(14), // 11 • estrutura em obra com pessoa
  img(17), // 12 • escada metálica estrutural
  img(27), // 13 • estrutura interior com céu
  { src: `${SUPABASE_STORAGE}/obra-sem-dor-de-cabeca.mp4`, alt: "Obra sem dor de cabeça" }, // 14 • VÍDEO 1

  // ── Meio (visível só ao girar) ───────────────────────────────
  img(28), // 15 • estrutura + instalações
  img(18), // 16 • estrutura interna com vão
  img(33), // 17 • poço/janela com estrutura
  img(24), // 18 • escada concreto pré-fabricada
  img(23), // 19 • interior estrutura
  img(31), // 20 • garagem com forro estrutural
  img(19), // 21 • interior drywall
  img(34), // 22 • interior estrutura escada

  // ── Fundo do globo (chalés começam aqui) ─────────────────────
  img(8),  // 23 • chalé acabamento (mais visualmente interessante)
  img(4),  // 24 • chalé madeira + metal
  img(21), // 25 • drywall interior
  img(29), // 26 • lã de vidro isolamento
  img(32), // 27 • drywall com pessoa
  { src: `${SUPABASE_STORAGE}/expansao-jardim-europa.mp4`, alt: "Expansão Jardim Europa" }, // 28 • VÍDEO 2
  img(1),  // 29 • chalé com sol
  img(3),  // 30 • chalé madeira
  img(20), // 31 • lã de vidro isolamento
  img(2),  // 32 • chalé madeira alta
  img(5),  // 33 • chalé
  img(6),  // 34 • chalé estrutura
  img(7),  // 35 • chalé estrutura
  img(11), // 36 • chalé estrutura
  img(9),  // 37 • chalé estrutura
  img(12), // 38 • chalé estrutura
  img(10), // 39 • chalé estrutura

  // ── Lateral esquerda imediata ────────────────────────────────
  img(25), // 40 • forro estrutural
  img(22), // 41 • forro estrutura
  { src: `${SUPABASE_STORAGE}/video-whatsapp-obra.mp4`, alt: "Obra em andamento" }, // 42 • VÍDEO 3
  img(16), // 43 • viga industrial
  img(15), // 44 • painel interno metálico
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
