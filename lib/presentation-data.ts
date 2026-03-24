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
    title: "Residência Monteiro",
    location: "São Roque - SP",
    year: "2026",
    area: "520 m²",
    system: "Steel Frame + Estrutura Metálica",
    description:
      "Residência contemporânea em São Roque que maximiza 520m² em dois pavimentos integrados com a paisagem natural. Arquitetura arrojada com estrutura metálica aparente, amplos painéis de vidro e integração total entre ambientes internos e externos. Programa completo com garagem, jardim, dormitórios e áreas de convívio em meio à vegetação tropical.",
    features: [
      "Dois pavimentos integrados (garagem/jardim, dormitórios)",
      "Estrutura metálica aparente com grandes vãos envidraçados",
      "Forro em madeira natural com iluminação embutida",
      "Integração indoor-outdoor com paisagismo tropical",
      "Acabamentos premium em madeira e pedra",
    ],
    images: [
      "/images/apresentacao/Vila-da-mata/vila-da-mata-1.webp",
      "/images/apresentacao/Vila-da-mata/vila-da-mata-2.webp",
      "/images/apresentacao/Vila-da-mata/vila-da-mata-3.webp",
    ],
    dark: true,
    reversed: false,
  },
];
