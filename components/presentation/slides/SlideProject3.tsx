"use client";

import { SlideProject } from "./SlideProject";

const projectData = {
  number: "03",
  title: "Chalé Rústico",
  location: "Campos do Jordão - SP",
  year: "2024",
  area: "240 m²",
  system: "Steel Frame + Madeira",
  description:
    "Refúgio de montanha que combina a rusticidade da madeira com a eficiência do Steel Frame. O isolamento térmico superior garante conforto mesmo nas temperaturas mais baixas da Serra da Mantiqueira.",
  features: [
    "Lareira central de pedra natural",
    "Vista panorâmica para a serra",
    "Isolamento térmico de alta performance",
    "Deck suspenso em madeira de reflorestamento",
  ],
  images: [
    "/images/Services/Projetos prontos/chale/chale-rustico.webp",
    "/images/Services/Projetos prontos/chale/chale_interior_1.webp",
    "/images/Services/Projetos prontos/chale/chale_interior_2.webp",
    "/images/Services/Projetos prontos/chale/chale_interior_3.webp",
    "/images/Services/Projetos prontos/chale/chale_interior_4.webp",
  ],
};

export function SlideProject3() {
  return (
    <SlideProject
      {...projectData}
      dark={true}
      reversed={false}
    />
  );
}
