"use client";

import { SlideProject } from "./SlideProject";

const projectData = {
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
