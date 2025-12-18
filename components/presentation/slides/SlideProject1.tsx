"use client";

import { SlideProject } from "./SlideProject";

const projectData = {
  number: "01",
  title: "Casa de Campo Moderna",
  location: "Interior de São Paulo",
  year: "2024",
  area: "320 m²",
  system: "Steel Frame",
  description:
    "Residência de alto padrão que integra arquitetura contemporânea à natureza exuberante do interior paulista. Projeto que equilibra conforto térmico excepcional com linhas minimalistas e amplas aberturas para a paisagem.",
  features: [
    "Varanda panorâmica com vista para o vale",
    "Sistema de automação residencial completo",
    "Piscina com borda infinita",
    "Eficiência energética otimizada",
  ],
  images: [
    "/images/Services/Projetos prontos/casa_campo/casa-campo-moderna.webp",
    "/images/Services/Projetos prontos/casa_campo/casa-campo-moderna-2.webp",
  ],
};

export function SlideProject1() {
  return (
    <SlideProject
      {...projectData}
      dark={true}
      reversed={false}
    />
  );
}
