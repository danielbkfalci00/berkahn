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
  title: "Construtora Berkahn",
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
    title: "Construtora Berkahn",
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
        alt: "Construtora Berkahn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Construtora Berkahn",
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

        {/* Structured data — Organization + WebSite for Google Knowledge Panel & sitelinks */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://www.berkahn.com.br/#organization",
                name: "Construtora Berkahn",
                url: "https://www.berkahn.com.br",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.berkahn.com.br/images/logo/berkahn-logo.webp",
                },
                description:
                  "Construtora especializada em Light Steel Frame para projetos residenciais e comerciais em São Paulo.",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "São Paulo",
                  addressRegion: "SP",
                  addressCountry: "BR",
                },
                telephone: "+5511966415742",
                email: "contato.berkahn@gmail.com",
                taxID: "39.455.932/0001-64",
                sameAs: [
                  "https://www.linkedin.com/company/construtora-berkahn/",
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+5511966415742",
                  contactType: "sales",
                  availableLanguage: "Portuguese",
                },
              },
              {
                "@type": "WebSite",
                "@id": "https://www.berkahn.com.br/#website",
                name: "Construtora Berkahn",
                url: "https://www.berkahn.com.br",
                publisher: {
                  "@id": "https://www.berkahn.com.br/#organization",
                },
              },
            ],
          })}
        </script>

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
