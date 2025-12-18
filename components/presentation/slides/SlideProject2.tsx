"use client";

import { SlideProject } from "./SlideProject";

const projectData = {
  number: "02",
  title: "Loft Urbano",
  location: "São Paulo - SP",
  year: "2023",
  area: "180 m²",
  system: "Steel Frame + Concreto",
  description:
    "Espaço contemporâneo no coração da cidade, projetado para profissionais que valorizam design e funcionalidade. A integração de Steel Frame com elementos de concreto aparente cria uma estética industrial sofisticada.",
  features: [
    "Pé-direito duplo de 5,8 metros",
    "Mezanino com estrutura em aço aparente",
    "Iluminação natural zenital",
    "Terraço privativo com jardim vertical",
  ],
  images: [
    "/images/Services/Projetos prontos/loft/loft-urbano.webp",
    "/images/Services/Projetos prontos/loft/loft-urbano_1.webp",
    "/images/Services/Projetos prontos/loft/loft-urbano_2.webp",
    "/images/Services/Projetos prontos/loft/loft-urbano_3.webp",
    "/images/Services/Projetos prontos/loft/loft-urbano_4.webp",
    "/images/Services/Projetos prontos/loft/loft-urbano_5.webp",
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
