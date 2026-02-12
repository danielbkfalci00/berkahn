import type { ComparisonItem } from "@/lib/lsf-data";
export type { ComparisonItem };

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface ContentBlock {
  title: string;
  description: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

// ---------------------------------------------------------------------------
// Section 3: "O que o Steel Frame muda na prática" — 6 benefit blocks
// ---------------------------------------------------------------------------
export const RESIDENCIAL_BENEFITS: ContentBlock[] = [
  {
    title: "Velocidade real, comprovada.",
    description:
      "Uma casa em LSF fica pronta em 3 a 6 meses, comparada aos 8 a 12 meses da construção convencional. Isso representa uma redução de 50% a 70% no tempo de obra. Na prática, são meses a menos convivendo com canteiro, barulho, poeira e a logística de uma construção. Para quem está alugando enquanto constrói, é dinheiro que deixa de sair. Para quem está reformando enquanto mora, é tranquilidade que volta mais rápido.",
  },
  {
    title: "Previsibilidade orçamentária.",
    description:
      "Na construção tradicional, desperdícios de 25% a 30% dos materiais e retrabalhos constantes fazem o custo final desviar do que foi previsto. No LSF, as peças são fabricadas sob medida em ambiente industrial e chegam ao canteiro prontas para montagem. O desperdício fica abaixo de 5%. Isso muda a natureza do orçamento: ele deixa de ser uma estimativa otimista e passa a ser um compromisso real. Na Berkahn, o orçamento que a gente apresenta é o que a gente entrega.",
  },
  {
    title: "Conforto que se sente.",
    description:
      "O isolamento térmico do Steel Frame é superior ao da alvenaria. As paredes são compostas por camadas que incluem isolantes termoacústicos, o que resulta em ambientes mais frescos no verão, mais aquecidos no inverno e significativamente mais silenciosos. Em termos mensuráveis, a economia em climatização pode chegar a 40% comparada a uma construção convencional. No dia a dia, isso é uma casa onde você desliga o ar-condicionado mais cedo e deixa de ouvir o vizinho.",
  },
  {
    title: "Precisão industrial.",
    description:
      "A tolerância dimensional do LSF é de ±1 a 2 milímetros, contra ±10 a 20 milímetros da alvenaria. Essa precisão aparece nos acabamentos: paredes perfeitamente alinhadas, esquadrias que fecham sem folga, pisos nivelados sem correções. É a diferença entre um acabamento artesanal e um acabamento industrial, e ela se vê no resultado final.",
  },
  {
    title: "Durabilidade comprovada.",
    description:
      "A vida útil de uma estrutura em aço galvanizado supera 150 anos. Os perfis são protegidos contra corrosão pelo processo de galvanização, e a estrutura se mantém intacta diante de cupins, umidade e degradação biológica. Uma construção pensada para durar gerações.",
  },
  {
    title: "Sustentabilidade concreta.",
    description:
      "O aço é 100% reciclável e pode ser reprocessado inúmeras vezes sem perder qualidade. A construção a seco consome água apenas na fundação, gerando uma economia de mais de 99% comparada à construção convencional. O canteiro de obra é limpo, sem montanhas de entulho. Para quem se preocupa com o impacto ambiental do que constrói, o LSF é a resposta mais honesta que a engenharia oferece hoje.",
  },
];

// ---------------------------------------------------------------------------
// Section 5: "Transparência antes de tudo" — 4 transparency blocks
// ---------------------------------------------------------------------------
export const RESIDENCIAL_TRANSPARENCY_BLOCKS: ContentBlock[] = [
  {
    title: "Revestimentos pesados exigem atenção.",
    description:
      "Pedras naturais, cerâmicas de alta densidade e revestimentos muito pesados precisam de soluções de distribuição de carga especificadas desde o projeto para serem aplicados sobre a estrutura LSF. Na Berkahn, esse tipo de decisão é tratado na fase de planejamento, garantindo que o acabamento que você quer seja tecnicamente viável desde o primeiro dia.",
  },
  {
    title: "O planejamento precisa ser detalhado.",
    description:
      "O LSF funciona com precisão industrial, e essa precisão exige que as decisões estejam tomadas antes da fabricação das peças. Na alvenaria tradicional, é comum decidir durante a obra que uma parede vai mudar de lugar ou que um ponto elétrico precisa ser adicionado. No Steel Frame, essas definições entram no projeto desde o início. O resultado: obras sem surpresas e sem custos inesperados.",
  },
  {
    title: "A sensação tátil da parede é diferente.",
    description:
      "Quem bate na parede de uma casa em Steel Frame nota que o som é diferente do de uma parede de alvenaria. Isso acontece porque a composição das paredes é diferente (perfis de aço + isolante + placas). O sistema atende integralmente à NBR 15575 (Norma de Desempenho), que estabelece requisitos mínimos de segurança, resistência e conforto para edificações habitacionais. A parede de LSF é projetada para ser leve, eficiente e segura, e cumpre todas as exigências normativas de desempenho estrutural, térmico e acústico.",
  },
  {
    title: "Versatilidade com sistemas híbridos.",
    description:
      "Para situações onde o LSF puro encontra alguma limitação, como vãos muito grandes ou cargas especialmente pesadas, a Berkahn trabalha com sistemas híbridos que combinam Steel Frame com concreto armado, aço laminado e madeira. Isso amplia significativamente o leque de possibilidades sem abrir mão das vantagens do processo industrializado. Na prática, o cliente conta com a engenharia combinando o melhor de cada sistema para o melhor resultado possível.",
  },
];

// ---------------------------------------------------------------------------
// Section 7: "Os números falam" — Comparison table (10 rows)
// ---------------------------------------------------------------------------
export const RESIDENCIAL_COMPARISON_DATA: ComparisonItem[] = [
  {
    category: "Tempo de obra",
    lsf: "3 a 6 meses",
    traditional: "8 a 12 meses",
    winner: "lsf",
  },
  {
    category: "Desperdício de material",
    lsf: "Menos de 5%",
    traditional: "25% a 30%",
    winner: "lsf",
  },
  {
    category: "Precisão dimensional",
    lsf: "±1 a 2mm",
    traditional: "±10 a 20mm",
    winner: "lsf",
  },
  {
    category: "Peso estrutural",
    lsf: "60 a 100 kg/m²",
    traditional: "1.200 a 1.500 kg/m²",
    winner: "lsf",
  },
  {
    category: "Conforto térmico",
    lsf: "Superior (isolamento multicamadas)",
    traditional: "Limitado",
    winner: "lsf",
  },
  {
    category: "Conforto acústico",
    lsf: "Superior",
    traditional: "Depende da espessura",
    winner: "lsf",
  },
  {
    category: "Economia em climatização",
    lsf: "Até 40%",
    traditional: "Referência",
    winner: "lsf",
  },
  {
    category: "Previsibilidade de custo",
    lsf: "Alta (processo industrial)",
    traditional: "Baixa (variáveis no canteiro)",
    winner: "lsf",
  },
  {
    category: "Durabilidade",
    lsf: "+150 anos",
    traditional: "Variável",
    winner: "lsf",
  },
  {
    category: "Sustentabilidade",
    lsf: "Aço 100% reciclável, obra a seco",
    traditional: "Alto consumo de água e resíduos",
    winner: "lsf",
  },
];

// ---------------------------------------------------------------------------
// Section 8: "Do primeiro contato à entrega das chaves" — 5 process steps
// ---------------------------------------------------------------------------
export const RESIDENCIAL_PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: "Conversa inicial",
    description:
      "Entendemos o que você precisa, o terreno que tem e o orçamento que imagina. Sem compromisso, sem pressão. É uma conversa para saber se faz sentido seguir juntos.",
  },
  {
    step: 2,
    title: "Projeto e planejamento",
    description:
      "Com apoio das nossas arquitetas parceiras, desenvolvemos o projeto que traduz o que você quer em engenharia executável. Cada detalhe é definido antes de qualquer fabricação: layout, instalações, acabamentos, cronograma e orçamento definitivo.",
  },
  {
    step: 3,
    title: "Fabricação",
    description:
      "Os perfis e componentes são fabricados sob medida em ambiente industrial, com precisão milimétrica. Enquanto isso, o canteiro avança na fundação e nas preparações iniciais.",
  },
  {
    step: 4,
    title: "Montagem e execução",
    description:
      "A estrutura é montada no canteiro com velocidade e limpeza. Sem entulho, sem poeira excessiva, sem surpresas. O cronograma definido na etapa de planejamento é seguido com a previsibilidade que só o processo industrializado permite.",
  },
  {
    step: 5,
    title: "Acabamento e entrega",
    description:
      "Instalações finais, acabamentos e inspeção de qualidade. A casa é entregue pronta, no prazo combinado e dentro do orçamento apresentado.",
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
// Gallery images for sections 3 and 4 (Unsplash placeholders)
// ---------------------------------------------------------------------------
export const GALLERY_IMAGES_STYLES: GalleryImage[] = [
  { src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", alt: "Residência moderna com fachada minimalista" },
  { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", alt: "Casa de campo com varanda integrada" },
  { src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80", alt: "Sobrado contemporâneo com linhas retas" },
  { src: "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?auto=format&fit=crop&w=800&q=80", alt: "Fachada com revestimento em pedra e madeira" },
  { src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80", alt: "Residência rústica com materiais naturais" },
  { src: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=800&q=80", alt: "Interior minimalista com amplas janelas" },
];

export const GALLERY_IMAGES_PROJECTS: GalleryImage[] = [
  { src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80", alt: "Projeto residencial com piscina" },
  { src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", alt: "Casa de alto padrão com paisagismo" },
  { src: "https://images.unsplash.com/photo-1600585153490-76fb20a32601?auto=format&fit=crop&w=800&q=80", alt: "Residência com integração interior-exterior" },
  { src: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80", alt: "Fachada moderna com iluminação noturna" },
  { src: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=800&q=80", alt: "Casa com telhado aparente e jardim frontal" },
  { src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80", alt: "Projeto com acabamento em madeira e vidro" },
];
