import type { Metadata } from "next";
import { Caveat, Playfair_Display } from "next/font/google";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Orçamento Steel Frame | Berkahn Construtora",
  description:
    "Solicite seu orçamento para construção em Light Steel Frame. Projetos residenciais, comerciais e industriais com garantia e qualidade premium.",
  robots: "noindex, nofollow", // Pagina personalizada por cliente
};

export default function OrcamentoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${caveat.variable} ${playfair.variable}`}>
      {children}
    </div>
  );
}
