"use client";

import { SlideProject } from "./SlideProject";

const projectData = {
  number: "03",
  title: "Casa Laranjeiras",
  location: "Curitiba - PR",
  year: "2021",
  area: "399 m²",
  system: "Light Steel Frame",
  description:
    "Residência contemporânea que integra arquitetura minimalista com a natureza. Volumes brancos puros com detalhes em madeira natural, telhado colonial em cerâmica e árvore preservada atravessando a estrutura. Ampla área de lazer com piscina, jardins tropicais e integração perfeita entre ambientes internos e externos.",
  features: [
    "Arquitetura minimalista com volumetria contemporânea",
    "Árvore integrada à estrutura principal",
    "Ampla área de lazer com piscina de 27m²",
    "Integração indoor-outdoor com jardins tropicais",
    "Acabamentos premium em madeira natural",
    "Telhado colonial em cerâmica (influência mediterrânea)",
  ],
  images: [
    "/images/Apresentação/Casa Laranjeiras/casa-laranjeiras-entrada-principal.webp",
    "/images/Apresentação/Casa Laranjeiras/casa-laranjeiras-piscina.webp",
    "/images/Apresentação/Casa Laranjeiras/casa-laranjeiras-living.webp",
    "/images/Apresentação/Casa Laranjeiras/casa-laranjeiras-jantar.webp",
    "/images/Apresentação/Casa Laranjeiras/casa-laranjeiras-lateral-piscina.webp",
    "/images/Apresentação/Casa Laranjeiras/casa-laranjeiras-pergola.webp",
    "/images/Apresentação/Casa Laranjeiras/casa-laranjeiras-fachada-lateral.webp",
    "/images/Apresentação/Casa Laranjeiras/casa-laranjeiras-fachada-frontal.webp",
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
