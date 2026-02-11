import type { Metadata } from "next";
import { Manrope, Caveat } from "next/font/google";
import Script from "next/script";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { CookieConsentProvider } from "@/components/providers/CookieConsentProvider";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Construtora Berkahn | Construção de Alto Padrão",
  description:
    "Erguendo o amanhã. Construtora especializada em projetos de Steel Frame.",
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
    description: "Erguendo o amanhã. Construtora especializada em projetos de Steel Frame.",
    siteName: "Construtora Berkahn",
    url: "https://www.berkahn.com.br",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/images/Compartilhamento/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Construtora Berkahn - Construção de Alto Padrão",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Construtora Berkahn | Construção de Alto Padrão",
    description: "Erguendo o amanhã. Construtora especializada em projetos de Steel Frame.",
    images: ["/images/Compartilhamento/og-image.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${caveat.variable}`}>
      <body>
        <CookieConsentProvider>
          <ClientLayout>{children}</ClientLayout>
          <ConditionalFooter />
          <CookieBanner />
          <WhatsAppButton />
        </CookieConsentProvider>

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
