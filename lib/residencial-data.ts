import type { ComparisonItem } from "@/lib/lsf-data";
import type { ContentBlock, ProcessStep } from "@/lib/types";

export type { ComparisonItem, ContentBlock, ProcessStep };

export interface GalleryImage {
  src: string;
  alt: string;
}

// ---------------------------------------------------------------------------
// Section 2: "O que fazemos" — Focus Cards data
// ---------------------------------------------------------------------------
export const RESIDENCIAL_SERVICES = [
  {
    title: "Construção Nova",
    src: "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-fachada-frontal.webp",
  },
  {
    title: "Reformas",
    src: "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-cover.webp",
  },
  {
    title: "Ampliações",
    src: "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-lateral-piscina.webp",
  },
];

// ---------------------------------------------------------------------------
// Section 4: "Por que Steel Frame" — Sticky Scroll Reveal (textos reduzidos)
// ---------------------------------------------------------------------------
export const RESIDENCIAL_BENEFITS_SCROLL = [
  {
    title: "Obra pronta em metade do tempo.",
    description:
      "Casa pronta em 3 a 6 meses, até 70% mais rápido que a construção convencional. Menos tempo de obra e menos custo com aluguel provisório.",
    image: "/images/Services/servicos-structure.webp",
  },
  {
    title: "Previsibilidade orçamentária.",
    description:
      "Peças fabricadas sob medida, desperdício abaixo de 5%. Na Berkahn, o orçamento apresentado é o orçamento entregue.",
    image: "/images/Services/servicos-foundations.webp",
  },
  {
    title: "Isolamento que faz diferença no dia a dia.",
    description:
      "Isolamento termoacústico multicamadas: ambientes mais frescos no verão, aquecidos no inverno e até 40% de economia em climatização.",
    image: "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-living.webp",
  },
  {
    title: "Precisão milimétrica em cada parede.",
    description:
      "Tolerância de ±1 a 2mm contra ±10 a 20mm da alvenaria. Paredes alinhadas, esquadrias perfeitas, pisos nivelados sem correção.",
    image: "/images/Services/servicos-finished.webp",
  },
  {
    title: "Estrutura com vida útil acima de 150 anos.",
    description:
      "Aço galvanizado com vida útil superior a 150 anos. Imune a cupins, umidade e degradação biológica.",
    image: "/images/Apresentação/estrutura-1.webp",
  },
  {
    title: "Obra a seco, aço 100% reciclável.",
    description:
      "Aço 100% reciclável, obra a seco com economia de 99% no consumo de água e canteiro limpo.",
    image: "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-01.webp",
  },
];

// ---------------------------------------------------------------------------
// Section 5: "Transparência" — Accordion data (textos reduzidos)
// ---------------------------------------------------------------------------
export const RESIDENCIAL_TRANSPARENCY_BLOCKS: ContentBlock[] = [
  {
    title: "Revestimentos pesados exigem atenção.",
    description:
      "Pedras naturais e cerâmicas de alta densidade precisam de soluções de distribuição de carga previstas no projeto. Na Berkahn, tratamos isso na fase de planejamento.",
  },
  {
    title: "O planejamento precisa ser detalhado.",
    description:
      "Todas as decisões de projeto são definidas antes da fabricação. A precisão industrial exige isso, e o resultado é uma obra que cumpre o orçamento.",
  },
  {
    title: "A sensação tátil da parede é diferente.",
    description:
      "O som ao bater na parede é diferente da alvenaria. O sistema atende integralmente à NBR 15575, cumprindo todas as exigências de desempenho estrutural, térmico e acústico.",
  },
  {
    title: "Versatilidade com sistemas híbridos.",
    description:
      "Para vãos grandes ou cargas pesadas, combinamos Steel Frame com concreto armado, aço laminado e madeira. O melhor de cada sistema para o melhor resultado.",
  },
];

// ---------------------------------------------------------------------------
// Section 7: Comparativo LSF vs. Tradicional — 10 rows (mantido)
// ---------------------------------------------------------------------------
export const RESIDENCIAL_COMPARISON_DATA: ComparisonItem[] = [
  { category: "Tempo de obra", lsf: "3 a 6 meses", traditional: "8 a 12 meses", winner: "lsf" },
  { category: "Desperdício de material", lsf: "Menos de 5%", traditional: "25% a 30%", winner: "lsf" },
  { category: "Precisão dimensional", lsf: "±1 a 2mm", traditional: "±10 a 20mm", winner: "lsf" },
  { category: "Peso estrutural", lsf: "60 a 100 kg/m²", traditional: "1.200 a 1.500 kg/m²", winner: "lsf" },
  { category: "Conforto térmico", lsf: "Superior (isolamento multicamadas)", traditional: "Limitado", winner: "lsf" },
  { category: "Conforto acústico", lsf: "Superior", traditional: "Depende da espessura", winner: "lsf" },
  { category: "Economia em climatização", lsf: "Até 40%", traditional: "Referência", winner: "lsf" },
  { category: "Previsibilidade de custo", lsf: "Alta (processo industrial)", traditional: "Baixa (variáveis no canteiro)", winner: "lsf" },
  { category: "Durabilidade", lsf: "+150 anos", traditional: "Variável", winner: "lsf" },
  { category: "Sustentabilidade", lsf: "Aço 100% reciclável, obra a seco", traditional: "Alto consumo de água e resíduos", winner: "lsf" },
];

// ---------------------------------------------------------------------------
// Section 7 (v2): Comparativo — Progress Bars animadas
// ---------------------------------------------------------------------------
export interface ComparisonBarItem {
  category: string;
  lsfValue: string;
  traditionalValue: string;
  lsfPercent: number;
  traditionalPercent: number;
  lsfNumeric?: number;
  traditionalNumeric?: number;
  numericPrefix?: string;
  numericSuffix?: string;
}

export const RESIDENCIAL_COMPARISON_BARS: ComparisonBarItem[] = [
  {
    category: "Tempo de obra",
    lsfValue: "6 meses",
    traditionalValue: "12 meses",
    lsfPercent: 30,
    traditionalPercent: 85,
    lsfNumeric: 6,
    traditionalNumeric: 12,
    numericSuffix: " meses",
  },
  {
    category: "Desperdício de material",
    lsfValue: "< 5%",
    traditionalValue: "25 a 30%",
    lsfPercent: 15,
    traditionalPercent: 85,
    lsfNumeric: 5,
    traditionalNumeric: 30,
    numericSuffix: "%",
  },
  {
    category: "Precisão dimensional",
    lsfValue: "±2mm",
    traditionalValue: "±20mm",
    lsfPercent: 12,
    traditionalPercent: 90,
    lsfNumeric: 2,
    traditionalNumeric: 20,
    numericPrefix: "±",
    numericSuffix: "mm",
  },
  {
    category: "Peso estrutural",
    lsfValue: "100 kg/m²",
    traditionalValue: "1.500 kg/m²",
    lsfPercent: 8,
    traditionalPercent: 95,
  },
  {
    category: "Conforto térmico",
    lsfValue: "Superior (multicamadas)",
    traditionalValue: "Limitado",
    lsfPercent: 92,
    traditionalPercent: 35,
  },
  {
    category: "Conforto acústico",
    lsfValue: "Superior",
    traditionalValue: "Depende da espessura",
    lsfPercent: 88,
    traditionalPercent: 40,
  },
  {
    category: "Economia em climatização",
    lsfValue: "Até 40%",
    traditionalValue: "Referência",
    lsfPercent: 90,
    traditionalPercent: 50,
    lsfNumeric: 40,
    numericSuffix: "%",
  },
  {
    category: "Previsibilidade de custo",
    lsfValue: "Alta (processo industrial)",
    traditionalValue: "Baixa (variáveis no canteiro)",
    lsfPercent: 95,
    traditionalPercent: 30,
  },
  {
    category: "Durabilidade",
    lsfValue: "+150 anos",
    traditionalValue: "Variável",
    lsfPercent: 95,
    traditionalPercent: 40,
    lsfNumeric: 150,
    numericPrefix: "+",
    numericSuffix: " anos",
  },
  {
    category: "Sustentabilidade",
    lsfValue: "Aço 100% reciclável",
    traditionalValue: "Alto consumo e resíduos",
    lsfPercent: 95,
    traditionalPercent: 25,
  },
];

// ---------------------------------------------------------------------------
// Section 8: Processo — 5 steps (textos reduzidos)
// ---------------------------------------------------------------------------
export const RESIDENCIAL_PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: "Conversa inicial",
    description: "Entendemos o que você precisa, o terreno e o orçamento. Sem compromisso.",
  },
  {
    step: 2,
    title: "Projeto e planejamento",
    description: "Projeto executável com nossas arquitetas parceiras. Layout, instalações, acabamentos, cronograma e orçamento definitivo.",
  },
  {
    step: 3,
    title: "Fabricação",
    description: "Perfis fabricados sob medida com precisão milimétrica enquanto o canteiro avança na fundação.",
  },
  {
    step: 4,
    title: "Montagem e execução",
    description: "Estrutura montada com velocidade e limpeza. Cronograma acompanhado etapa a etapa.",
  },
  {
    step: 5,
    title: "Acabamento e entrega",
    description: "Instalações finais, acabamentos e inspeção de qualidade. Entrega no prazo e no orçamento.",
  },
];

// ---------------------------------------------------------------------------
// Section 9: Contact form project types
// ---------------------------------------------------------------------------
export const CONTACT_FORM_PROJECT_TYPES = [
  { value: "construcao-nova", label: "Construção nova" },
  { value: "reforma", label: "Reforma" },
  { value: "ampliacao", label: "Ampliação" },
] as const;

// ---------------------------------------------------------------------------
// Gallery images for DomeGallery sections (imagens reais)
// ---------------------------------------------------------------------------
export const GALLERY_IMAGES_STYLES: GalleryImage[] = [
  { src: "/images/galeria/projeto-01.webp", alt: "Residência moderna com fachada minimalista" },
  { src: "/images/galeria/projeto-05.webp", alt: "Casa de campo com varanda integrada" },
  { src: "/images/galeria/projeto-10.webp", alt: "Sobrado contemporâneo com linhas retas" },
  { src: "/images/galeria/projeto-15.webp", alt: "Fachada com revestimento em pedra e madeira" },
  { src: "/images/galeria/projeto-20.webp", alt: "Residência rústica com materiais naturais" },
  { src: "/images/galeria/projeto-25.webp", alt: "Interior minimalista com amplas janelas" },
];

// ---------------------------------------------------------------------------
// Masonry Grid — "Versatilidade arquitetônica" section
// ---------------------------------------------------------------------------
export const GALLERY_MASONRY_ITEMS = [
  { id: "m1",  img: "/images/galeria/projeto-01.webp", alt: "Residência moderna com fachada minimalista", height: 400 },
  { id: "m2",  img: "/images/galeria/projeto-03.webp", alt: "Casa contemporânea com linhas limpas", height: 300 },
  { id: "m3",  img: "/images/galeria/projeto-06.webp", alt: "Projeto residencial com jardim integrado", height: 500 },
  { id: "m4",  img: "/images/galeria/projeto-08.webp", alt: "Fachada com revestimento em madeira", height: 350 },
  { id: "m5",  img: "/images/galeria/projeto-10.webp", alt: "Sobrado contemporâneo com linhas retas", height: 450 },
  { id: "m6",  img: "/images/galeria/projeto-14.webp", alt: "Casa térrea com varanda ampla", height: 280 },
  { id: "m7",  img: "/images/galeria/projeto-18.webp", alt: "Residência com pé-direito duplo", height: 500 },
  { id: "m8",  img: "/images/galeria/projeto-22.webp", alt: "Fachada com vidro e concreto aparente", height: 320 },
  { id: "m9",  img: "/images/galeria/projeto-25.webp", alt: "Interior minimalista com amplas janelas", height: 400 },
  { id: "m10", img: "/images/galeria/projeto-30.webp", alt: "Projeto com acabamento em pedra natural", height: 350 },
  { id: "m11", img: "/images/galeria/projeto-35.webp", alt: "Residência com telhado verde", height: 450 },
  { id: "m12", img: "/images/galeria/projeto-40.webp", alt: "Casa com fachada mista em steel frame", height: 300 },
];

export const GALLERY_IMAGES_PROJECTS: GalleryImage[] = [
  { src: "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-fachada-frontal.webp", alt: "Projeto Casa Laranjeiras - Fachada frontal" },
  { src: "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-piscina.webp", alt: "Projeto Casa Laranjeiras - Área de piscina" },
  { src: "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-cover.webp", alt: "Projeto Casa Santa Cristina" },
  { src: "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-03.webp", alt: "Projeto Casa Santa Cristina - Interior" },
  { src: "/images/galeria/projeto-30.webp", alt: "Projeto residencial - Fachada" },
  { src: "/images/galeria/projeto-35.webp", alt: "Projeto residencial - Acabamento" },
];

// ---------------------------------------------------------------------------
// 3D Marquee — Gallery Images (Section 12)
// ---------------------------------------------------------------------------

export const RESIDENCIAL_3D_GALLERY: string[] = [
  "https://picsum.photos/seed/res01/600/430",
  "https://picsum.photos/seed/res02/600/430",
  "https://picsum.photos/seed/res03/600/430",
  "https://picsum.photos/seed/res04/600/430",
  "https://picsum.photos/seed/res05/600/430",
  "https://picsum.photos/seed/res06/600/430",
  "https://picsum.photos/seed/res07/600/430",
  "https://picsum.photos/seed/res08/600/430",
  "https://picsum.photos/seed/res09/600/430",
  "https://picsum.photos/seed/res10/600/430",
  "https://picsum.photos/seed/res11/600/430",
  "https://picsum.photos/seed/res12/600/430",
  "https://picsum.photos/seed/res13/600/430",
  "https://picsum.photos/seed/res14/600/430",
  "https://picsum.photos/seed/res15/600/430",
  "https://picsum.photos/seed/res16/600/430",
  "https://picsum.photos/seed/res17/600/430",
  "https://picsum.photos/seed/res18/600/430",
  "https://picsum.photos/seed/res19/600/430",
  "https://picsum.photos/seed/res20/600/430",
  "https://picsum.photos/seed/res21/600/430",
  "https://picsum.photos/seed/res22/600/430",
  "https://picsum.photos/seed/res23/600/430",
  "https://picsum.photos/seed/res24/600/430",
  "https://picsum.photos/seed/res25/600/430",
  "https://picsum.photos/seed/res26/600/430",
  "https://picsum.photos/seed/res27/600/430",
  "https://picsum.photos/seed/res28/600/430",
];
