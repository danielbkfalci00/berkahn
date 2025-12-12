import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
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
    <html lang="pt-BR" className={manrope.variable}>
      <body>
        <ClientLayout>{children}</ClientLayout>
        <Footer />
      </body>
    </html>
  );
}
