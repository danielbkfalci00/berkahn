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
    title: "Casa Santa Cristina",
    location: "Jardim Paulistano - São Paulo, SP",
    year: "2024",
    area: "376 m²",
    system: "Steel Frame + Concreto",
    description:
      "Residência sofisticada no Jardim Paulistano que maximiza 376m² em três pavimentos harmoniosamente integrados. Arquitetura sóbria e elegante com paleta de cores e acabamentos internos que criam uma atmosfera acolhedora e atemporal. Programa completo sem comprometer conforto e distribuição.",
    features: [
      "Três pavimentos integrados (garagem/jardim, dormitórios, terraço)",
      "Arquitetura sóbria com acabamentos premium",
      "Paleta de cores aconchegante e atemporal",
      "Programa completo com máximo aproveitamento de espaço",
    ],
    images: [
      "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-cover.webp",
      "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-01.webp",
      "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-02.webp",
      "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-03.webp",
      "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-04.webp",
      "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-05.webp",
      "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-06.webp",
      "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-07.webp",
      "/images/apresentacao/casa-santa-cristina/casa-santa-cristina-08.webp",
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
