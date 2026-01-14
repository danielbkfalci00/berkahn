import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Construtora Berkahn | Construção de Alto Padrão",
  description:
    "Erguendo o amanhã. Construtora especializada em projetos de alto padrão.",
  keywords: [
    "construtora",
    "construção",
    "alto padrão",
    "steel frame",
    "light steel frame",
    "berkahn",
    "são paulo",
  ],
  authors: [{ name: "Berkahn" }],
  metadataBase: new URL("https://www.berkahn.com.br"),
  openGraph: {
    title: "Construtora Berkahn | Construção de Alto Padrão",
    description: "Erguendo o amanhã. Construtora especializada em projetos de alto padrão.",
    siteName: "Construtora Berkahn",
    url: "https://www.berkahn.com.br",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Construtora Berkahn - Construção de Alto Padrão",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Construtora Berkahn | Construção de Alto Padrão",
    description: "Erguendo o amanhã. Construtora especializada em projetos de alto padrão.",
    images: ["/og-image.png"],
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
        <ConditionalFooter />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RBQJ1D6JHW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RBQJ1D6JHW');
          `}
        </Script>
      </body>
    </html>
  );
}
