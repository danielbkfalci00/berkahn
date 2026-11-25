import { ProjectSlideProps } from "@/components/presentation/slides/SlideProject";

/**
 * Dados centralizados dos projetos para a apresentação executiva
 * Consolida SlideProject1, SlideProject2, SlideProject3 em um único arquivo
 */

export const presentationProjects: (ProjectSlideProps & {
  dark: boolean;
  reversed: boolean;
})[] = [
  {
    number: "01",
    title: "Residencial Bandeira",
    location: "Jardim Europa - São Paulo, SP",
    year: "2026",
    area: "480 m²",
    system: "Aço Laminado + Alvenaria + Light Steel Frame",
    description:
      "Residência contemporânea no Jardim Europa, com 480 m² e três suítes, onde a arquitetura se abre para a vegetação. A execução foi feita com aço laminado, trechos em alvenaria (muro de arrimo) e Light Steel Frame, combinação que permitiu vencer o desnível do terreno e criar volumes leves e precisos. Brises e ripados de madeira filtram a luz, a cobertura verde acompanha a mata ao redor e os ambientes internos ganham aconchego com iluminação indireta, tons terrosos e marcenaria sob medida. Jardins, terraço e grandes esquadrias deslizantes aproximam o morar do verde, criando uma casa serena e acolhedora.",
    features: [
      "Execução em aço laminado, alvenaria (muro de arrimo) e Light Steel Frame",
      "Banheiro com bancada em pedra, cuba dupla, espelho amplo e parede em pedra natural",
      "Iluminação indireta e embutida em forros, sancas e marcenaria",
    ],
    images: [
      "/images/apresentacao/residencial-bandeira/residencial-bandeira-01.webp",
      "/images/apresentacao/residencial-bandeira/residencial-bandeira-02.webp",
      "/images/apresentacao/residencial-bandeira/residencial-bandeira-03.webp",
      "/images/apresentacao/residencial-bandeira/residencial-bandeira-04.webp",
      "/images/apresentacao/residencial-bandeira/residencial-bandeira-05.webp",
    ],
    dark: true,
    reversed: false,
  },
  {
    number: "02",
    title: "Vila Serrana Boutique",
    location: "San Martin de los Andes, Argentina",
    year: "2023",
    area: "55 m²/unidade",
    system: "Steel Frame 100%",
    description:
      "Empreendimento hoteleiro boutique em San Martin de los Andes, com mini chalés em steel frame que demonstram a versatilidade do sistema em projetos comerciais de alto padrão. Acabamento premium em madeira, pé-direito duplo com vigas aparentes e integração perfeita com a paisagem da Patagônia Argentina.",
    features: [
      "Acabamento hoteleiro premium",
      "Revestimento em madeira natural",
      "Pé-direito duplo com vigas aparentes",
      "Varanda integrada à paisagem",
      "Isolamento termo-acústico superior",
      "Construção rápida (60 dias)",
    ],
    images: [
      "/images/Services/projetos-prontos/vila-serrana/vila-serrana-exterior-completo.webp",
      "/images/Services/projetos-prontos/vila-serrana/vila-serrana-fachada-detalhe.webp",
      "/images/Services/projetos-prontos/vila-serrana/vila-serrana-interior-suite.webp",
      "/images/Services/projetos-prontos/vila-serrana/vila-serrana-construcao.webp",
    ],
    dark: false,
    reversed: true,
  },
  {
    number: "03",
    title: "Ampliação Vila Juquehy",
    location: "Juquehy - São Sebastião, SP",
    year: "2026",
    area: "90 m²",
    system: "Light Steel Frame + Madeira Engenheirada (MLC)",
    description:
      "Projeto de ampliação em madeira engenheirada com Light Steel Frame, desenvolvido para dialogar com a construção existente. São 90 m² construídos, entre três suítes com varandas e área comum, que mantêm o padrão da residência original, com ambientes aconchegantes e amplos. A madeira aparente está presente em toda a obra: nos beirais, nas esquadrias e na escada, que tem degraus em balanço e guarda-corpo com cabos de aço. O resultado é uma ampliação leve e integrada. A fachada combina pedra, madeira e paisagismo tropical, e os espaços internos recebem bastante luz natural.",
    features: [
      "Estrutura em Light Steel Frame combinada com madeira engenheirada (MLC)",
      "Fachada em pedra, madeira e venezianas, com iluminação cênica noturna",
      "Ambientes amplos e aconchegantes, com boa entrada de luz natural",
      "Acabamentos premium em madeira e pedra",
    ],
    images: [
      "/images/apresentacao/vila-juquehy/vila-juquehy-01.webp",
      "/images/apresentacao/vila-juquehy/vila-juquehy-02.webp",
      "/images/apresentacao/vila-juquehy/vila-juquehy-03.webp",
      "/images/apresentacao/vila-juquehy/vila-juquehy-04.webp",
      "/images/apresentacao/vila-juquehy/vila-juquehy-05.webp",
      "/images/apresentacao/vila-juquehy/vila-juquehy-06.webp",
      "/images/apresentacao/vila-juquehy/vila-juquehy-07.webp",
      "/images/apresentacao/vila-juquehy/vila-juquehy-08.webp",
    ],
    dark: true,
    reversed: false,
  },
];
