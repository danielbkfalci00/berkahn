import { ReactNode } from "react";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, User } from "lucide-react";

interface LegalSubSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface LegalSection {
  number: number;
  title: string;
  content: ReactNode;
  subSections?: LegalSubSection[];
}

interface LegalContactInfo {
  role?: string;
  name?: string;
  email: string;
  phone: string;
  introText: string;
}

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  introContent: ReactNode;
  sections: LegalSection[];
  contactSection: {
    sectionNumber: number;
    title: string;
    contact: LegalContactInfo;
  };
}

export function LegalPageLayout({
  title,
  lastUpdated,
  introContent,
  sections,
  contactSection,
}: LegalPageLayoutProps) {
  const allSections = [
    ...sections,
    { number: contactSection.sectionNumber, title: contactSection.title },
  ];

  return (
    <main>
      {/* Zone 1 — Header */}
      <section className="pt-40 pb-16 bg-black-5">
        <div className="container max-w-4xl">
          <RevealOnScroll>
            <p className="label-text text-black-50 mb-4">DOCUMENTO LEGAL</p>
            <h1 className="headline-md">{title}</h1>
            <p className="body-sm text-black-50 mt-3">
              Última atualização: {lastUpdated}
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Zone 2 — Índice */}
      <nav
        className="bg-white border-b border-black-10"
        aria-label="Índice do documento"
      >
        <div className="container max-w-4xl py-6">
          <p className="label-text text-black-50 mb-4">ÍNDICE</p>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {allSections.map((section) => (
              <li key={section.number}>
                <a
                  href={`#secao-${section.number}`}
                  className="body-sm text-black-70 hover:text-black transition-colors inline-flex items-baseline gap-2"
                >
                  <span className="text-black-50 font-medium tabular-nums">
                    {String(section.number).padStart(2, "0")}
                  </span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* Zone 3 — Introdução */}
      <section className="py-lg">
        <div className="container max-w-4xl">
          <div className="body-lg text-black-70 space-y-4">{introContent}</div>
        </div>
      </section>

      {/* Zone 4 — Seções numeradas */}
      {sections.map((section, index) => (
        <section
          key={section.number}
          id={`secao-${section.number}`}
          className={`py-lg scroll-mt-32 ${
            index % 2 === 1 ? "bg-black-5" : "bg-white"
          }`}
        >
          <div className="container max-w-4xl">
            {/* Section heading */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl md:text-5xl font-heading font-extralight text-black-10 leading-none select-none tabular-nums">
                {String(section.number).padStart(2, "0")}
              </span>
              <h2 className="headline-sm">{section.title}</h2>
            </div>

            <Separator className="mb-8 bg-black-10" />

            {/* Section body */}
            <div className="body-md text-black-70 space-y-4 pl-0 md:pl-16">
              {section.content}
            </div>

            {/* Sub-sections */}
            {section.subSections?.map((sub) => (
              <div key={sub.id} className="mt-8 pl-0 md:pl-16">
                <h3 className="text-lg font-semibold mb-3 text-black">
                  {sub.id} {sub.title}
                </h3>
                <div className="body-md text-black-70 space-y-4">
                  {sub.content}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Zone 5 — Contato */}
      <section
        id={`secao-${contactSection.sectionNumber}`}
        className="py-lg bg-black-5 scroll-mt-32"
      >
        <div className="container max-w-4xl">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-4xl md:text-5xl font-heading font-extralight text-black-10 leading-none select-none tabular-nums">
              {String(contactSection.sectionNumber).padStart(2, "0")}
            </span>
            <h2 className="headline-sm">{contactSection.title}</h2>
          </div>

          <Separator className="mb-8 bg-black-10" />

          <p className="body-md text-black-70 mb-8 pl-0 md:pl-16">
            {contactSection.contact.introText}
          </p>

          <div className="pl-0 md:pl-16">
            <RevealOnScroll>
              <Card className="shadow-luxury-md border-black-10 max-w-lg">
                <CardContent className="p-8 space-y-4">
                  {contactSection.contact.role &&
                    contactSection.contact.name && (
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-black-50 flex-shrink-0" />
                        <div>
                          <p className="body-sm text-black-50">
                            {contactSection.contact.role}
                          </p>
                          <p className="body-md font-medium text-black">
                            {contactSection.contact.name}
                          </p>
                        </div>
                      </div>
                    )}
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-black-50 flex-shrink-0" />
                    <a
                      href={`mailto:${contactSection.contact.email}`}
                      className="body-md text-black hover:text-black-70 transition-colors underline underline-offset-2"
                    >
                      {contactSection.contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-black-50 flex-shrink-0" />
                    <a
                      href={`tel:${contactSection.contact.phone.replace(/\D/g, "")}`}
                      className="body-md text-black hover:text-black-70 transition-colors underline underline-offset-2"
                    >
                      {contactSection.contact.phone}
                    </a>
                  </div>
                </CardContent>
              </Card>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Zone 6 — Footer do documento */}
      <section className="py-lg border-t border-black-10">
        <div className="container max-w-4xl">
          <div className="body-sm text-black-50 space-y-1 pl-0 md:pl-16">
            <p>
              <strong className="font-semibold text-black-70">
                Construtora Berkahn
              </strong>
            </p>
            <p>CNPJ: 39.455.932/0001-64</p>
            <p>São Paulo, SP — Brasil</p>
            <p>berkahn.com.br</p>
            <p className="mt-4">
              © 2026 Berkahn. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
