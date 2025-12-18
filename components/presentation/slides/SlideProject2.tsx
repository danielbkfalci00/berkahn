"use client";

import { SlideProject } from "./SlideProject";

const projectData = {
  number: "02",
  title: "Vila Serrana Boutique",
  location: "Canela - RS",
  year: "2023",
  area: "55 m²/unidade",
  system: "Steel Frame 100%",
  description:
    "Empreendimento hoteleiro boutique em Canela, com mini chalés em steel frame que demonstram a versatilidade do sistema em projetos comerciais de alto padrão. Acabamento premium em madeira, pé-direito duplo com vigas aparentes e integração perfeita com a natureza da serra gaúcha.",
  features: [
    "Acabamento hoteleiro premium",
    "Revestimento em madeira natural",
    "Pé-direito duplo com vigas aparentes",
    "Varanda integrada à paisagem",
    "Isolamento termo-acústico superior",
    "Construção rápida (60 dias)",
  ],
  images: [
    "/images/services/projetos-prontos/vila-serrana/vila-serrana-exterior-completo.webp",
    "/images/services/projetos-prontos/vila-serrana/vila-serrana-fachada-detalhe.webp",
    "/images/services/projetos-prontos/vila-serrana/vila-serrana-interior-suite.webp",
    "/images/services/projetos-prontos/vila-serrana/vila-serrana-construcao.webp",
  ],
};

export function SlideProject2() {
  return (
    <SlideProject
      {...projectData}
      dark={false}
      reversed={true}
    />
  );
}
