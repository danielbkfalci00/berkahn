import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Berkahn Steel Frame | Construção em Aço de Qualidade",
  description:
    "Especialistas em Light Steel Frame. 25 anos de experiência, 500 projetos concluídos. Erguendo o amanhã com construção em aço de qualidade.",
  keywords: [
    "steel frame",
    "light steel frame",
    "construção",
    "aço",
    "berkahn",
    "são paulo",
  ],
  authors: [{ name: "Berkahn" }],
  openGraph: {
    title: "Berkahn Steel Frame",
    description: "Erguendo o amanhã com construção em aço de qualidade.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <Header />
        <Sidebar />
        <main className="pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
