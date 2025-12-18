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
    "/images/Apresentação/Casa Santa Cristina/Design sem nome (22).png",
    "/images/Apresentação/Casa Santa Cristina/SaveVid.Net_587379553_18380889520148668_779568923638485866_n.jpg",
    "/images/Apresentação/Casa Santa Cristina/SaveVid.Net_588499645_18380889550148668_5353205993247780315_n.jpg",
    "/images/Apresentação/Casa Santa Cristina/SaveVid.Net_588536635_18380889511148668_6372752225111305327_n.jpg",
    "/images/Apresentação/Casa Santa Cristina/SaveVid.Net_588711014_18380889499148668_5132124174209708687_n.jpg",
    "/images/Apresentação/Casa Santa Cristina/SaveVid.Net_589736357_18380889502148668_8066289590598348812_n.jpg",
    "/images/Apresentação/Casa Santa Cristina/SaveVid.Net_590536168_18380889484148668_6434358501176523636_n.jpg",
    "/images/Apresentação/Casa Santa Cristina/SaveVid.Net_590716822_18380889532148668_2696496738659974536_n.jpg",
    "/images/Apresentação/Casa Santa Cristina/SaveVid.Net_591026954_18380889481148668_7732553679879526227_n.jpg",
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
