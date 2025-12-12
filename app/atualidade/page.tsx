// Atualidades - Blog da Berkahn
import { Metadata } from "next";
import { AtualidadeContent } from "./AtualidadeContent";

export const metadata: Metadata = {
  title: "Atualidades | Berkahn Steel Frame",
  description:
    "Insights, tendências e conteúdos exclusivos sobre construção industrializada em Light Steel Frame. Descubra o futuro da construção civil.",
  keywords: [
    "steel frame notícias",
    "construção industrializada",
    "light steel frame",
    "inovação construção",
    "blog berkahn",
    "atualidades",
    "tendências construção",
  ],
  openGraph: {
    title: "Atualidades | Berkahn Steel Frame",
    description:
      "Insights, tendências e conteúdos exclusivos sobre construção industrializada em Light Steel Frame.",
    type: "website",
  },
};

export default function AtualidadePage() {
  return <AtualidadeContent />;
}
