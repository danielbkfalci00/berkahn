import type { ContentBlock, ProcessStep } from "@/lib/types";

export type { ContentBlock, ProcessStep };

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
    src: "/images/Residencial/construcao-nova.webp",
    benefits:
      "Construa sua casa com velocidade, precisão milimétrica e zero desperdício. Obra limpa do início ao fim.",
  },
  {
    title: "Reformas",
    src: "/images/Residencial/reformas.webp",
    benefits:
      "Reforma leve, limpa e rápida — o morador pode continuar no imóvel durante a obra. Menos entulho, menos barulho e prazo definido desde o início.",
  },
  {
    title: "Ampliações",
    src: "/images/Residencial/ampliacoes.webp",
    benefits:
      "Estrutura até 15× mais leve que alvenaria: amplie sobre lajes existentes sem reforço de fundação. Máximo aproveitamento do espaço que você já tem.",
  },
  {
    title: "Investimento",
    src: "/images/Services/projetos-prontos/vila-serrana/vila-serrana-exterior-completo.webp",
    benefits:
      "Projetos prontos com retorno rápido. Construção acelerada significa ocupação antecipada e receita mais cedo.",
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
    image: "/images/Residencial/obra-rapida.webp",
  },
  {
    title: "Previsibilidade orçamentária.",
    description:
      "Peças fabricadas sob medida, desperdício abaixo de 5%. Na Berkahn, o orçamento apresentado é o orçamento entregue.",
    image: "/images/Residencial/previsibilidade.webp",
  },
  {
    title: "Isolamento que faz diferença no dia a dia.",
    description:
      "Isolamento termoacústico multicamadas: ambientes mais frescos no verão, aquecidos no inverno e até 40% de economia em climatização.",
    image: "/images/Residencial/isolamento.webp",
  },
  {
    title: "Precisão milimétrica em cada parede.",
    description:
      "Tolerância de ±1 a 2mm contra ±10 a 20mm da alvenaria. Paredes alinhadas, esquadrias perfeitas, pisos nivelados sem correção.",
    image: "/images/Services/servicos-finished.webp",
  },
  {
    title: "Durável, reciclável, sustentável.",
    description:
      "Aço galvanizado com vida útil superior a 150 anos, imune a cupins e umidade. Obra a seco com economia de 99% no consumo de água e aço 100% reciclável.",
    image: "/images/apresentacao/estrutura-1.webp",
  },
  {
    title: "Versatilidade com materiais premium.",
    description:
      "Do minimalismo a fachadas com curvas complexas. Perfis de aço galvanizado, isolamento em lã de rocha, placas OSB e cimentícias: cada camada cumpre uma função e o conjunto se adapta a qualquer linguagem arquitetônica.",
    image: "/images/Residencial/versatilidade-01.webp",
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
// Section 8: Processo — 5 steps (textos reduzidos)
// ---------------------------------------------------------------------------
export const RESIDENCIAL_PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: "Conversa inicial",
    description: "Entendemos o que você precisa, o terreno e o orçamento. Sem compromisso.",
    image: "/images/Services/Como-trabalhamos/consulta-inicial-1.webp",
  },
  {
    step: 2,
    title: "Projeto e planejamento",
    description: "Projeto executável com nossas arquitetas parceiras. Layout, instalações, acabamentos, cronograma e orçamento definitivo.",
    image: "/images/Services/Como-trabalhamos/desenvolvimento-de-projetos-1.webp",
  },
  {
    step: 3,
    title: "Fabricação",
    description: "Perfis fabricados sob medida com precisão milimétrica enquanto o canteiro avança na fundação.",
    image: "/images/Services/Execução-de-obras/Estrutura/estrutura-1.webp",
  },
  {
    step: 4,
    title: "Montagem e execução",
    description: "Estrutura montada com velocidade e limpeza. Cronograma acompanhado etapa a etapa.",
    image: "/images/Services/Execução-de-obras/Estrutura/estrutura-2.webp",
  },
  {
    step: 5,
    title: "Acabamento e entrega",
    description: "Instalações finais, acabamentos e inspeção de qualidade. Entrega no prazo e no orçamento.",
    image: "/images/Services/Como-trabalhamos/entrega-e-garantia-1.webp",
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
// Gallery images for DomeGallery
// ---------------------------------------------------------------------------
export const GALLERY_IMAGES_PROJECTS: GalleryImage[] = [
  { src: "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-fachada-frontal.webp", alt: "Projeto Casa Laranjeiras - Fachada frontal" },
  { src: "/images/apresentacao/casa-laranjeiras/casa-laranjeiras-piscina.webp", alt: "Projeto Casa Laranjeiras - Área de piscina" },
  { src: "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-cover.webp", alt: "Projeto Casa Santa Cristina" },
  { src: "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-03.webp", alt: "Projeto Casa Santa Cristina - Interior" },
  { src: "/images/galeria/projeto-30.webp", alt: "Projeto residencial - Fachada" },
  { src: "/images/galeria/projeto-35.webp", alt: "Projeto residencial - Acabamento" },
  { src: "/images/Residencial/versatilidade-02.webp", alt: "Casa contemporânea com linhas limpas" },
  { src: "/images/Residencial/versatilidade-04.webp", alt: "Fachada com revestimento em madeira" },
  { src: "/images/Residencial/versatilidade-05.webp", alt: "Residência com design diferenciado" },
];
