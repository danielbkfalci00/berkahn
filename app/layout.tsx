import type { Metadata } from "next";
import { Manrope, Caveat, Playfair_Display, Archivo, Space_Mono } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { CookieConsentProvider } from "@/components/providers/CookieConsentProvider";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CONSENT_STORAGE_KEY, CONSENT_VERSION } from "@/lib/consent";
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

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

// Fonte variável (eixo completo de peso) — display da home "luxo de engenharia"
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-space-mono",
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
  verification: {
    google: "Kb1EMhoRQmezUUffRNIlRcd_C-cyyepqzLpiexr71f4",
  },
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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  other: {
    "theme-color": "#000000",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${caveat.variable} ${playfair.variable} ${archivo.variable} ${spaceMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://sfqaknxomxwmviarpwfy.supabase.co" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="alternate" type="application/rss+xml" title="Blog Berkahn - Atualidades" href="/feed.xml" />
      </head>
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
                "@type": ["LocalBusiness", "GeneralContractor"],
                "@id": "https://www.berkahn.com.br/#organization",
                name: "Construtora Berkahn",
                url: "https://www.berkahn.com.br",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.berkahn.com.br/images/logo/berkahn-logo.webp",
                },
                image: "https://www.berkahn.com.br/images/logo/berkahn-logo.webp",
                description:
                  "Construtora especializada em Light Steel Frame para projetos residenciais e comerciais em São Paulo.",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "São Paulo",
                  addressRegion: "SP",
                  addressCountry: "BR",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: -23.5505,
                  longitude: -46.6333,
                },
                telephone: "+5511966415742",
                email: "contato.berkahn@gmail.com",
                taxID: "39.455.932/0001-64",
                priceRange: "$$$$",
                currenciesAccepted: "BRL",
                paymentAccepted: "Transferência bancária, Financiamento",
                areaServed: [
                  { "@type": "State", name: "São Paulo" },
                  { "@type": "City", name: "São Paulo" },
                ],
                hasOfferCatalog: {
                  "@type": "OfferCatalog",
                  name: "Serviços de Construção",
                  itemListElement: [
                    { "@type": "OfferCatalog", name: "Construção Residencial" },
                    { "@type": "OfferCatalog", name: "Construção Comercial & Industrial" },
                    { "@type": "OfferCatalog", name: "Reformas e Ampliações" },
                  ],
                },
                sameAs: [
                  "https://www.linkedin.com/company/construtora-berkahn/",
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+5511966415742",
                  contactType: "sales",
                  availableLanguage: "Portuguese",
                },
                openingHoursSpecification: {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "08:00",
                  closes: "18:00",
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
                // Sem potentialAction/SearchAction: o template apontava para
                // /perguntas-frequentes?q=, mas aquela página ignora `q` e
                // devolve a FAQ inteira. Declarar uma busca que não existe é
                // dívida sem contrapartida — o sitelinks searchbox foi
                // descontinuado pelo Google em nov/2024. Se a busca interna
                // virar recurso de produto, o bloco volta com a página
                // filtrando de fato.
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

            // LGPD: nada é coletado antes da escolha do usuário. O 'default'
            // TEM que vir antes do 'config' — o gtag.js processa a dataLayer
            // na ordem em que foi empilhada, e sem esta linha o primeiro
            // page_view saía com consentimento implicitamente concedido.
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });

            // Restaura a escolha de visitas anteriores. Sem isto, o 'update'
            // só acontecia no clique do banner: quem já tinha aceitado voltava
            // ao site e não era medido, e quem tinha recusado era medido assim
            // mesmo (o provider fazia setConsent e retornava sem chamar gtag).
            try {
              var salvo = JSON.parse(
                localStorage.getItem('${CONSENT_STORAGE_KEY}') || 'null'
              );
              if (salvo && salvo.version === '${CONSENT_VERSION}' && salvo.level === 'all') {
                gtag('consent', 'update', {
                  analytics_storage: 'granted',
                  ad_storage: 'granted',
                  ad_user_data: 'granted',
                  ad_personalization: 'granted'
                });
              }
            } catch (e) {}

            gtag('js', new Date());
            gtag('config', 'G-RBQJ1D6JHW');
          `}
        </Script>
        <SpeedInsights />
      </body>
    </html>
  );
}
