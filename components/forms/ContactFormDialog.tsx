"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePathname } from "next/navigation";
import { ContactForm, type Segment } from "./ContactForm";
import { trackEvent } from "@/lib/analytics";

interface ContactFormDialogProps {
  children: React.ReactNode;
  defaultSegment?: Segment;
  /** De onde o modal foi aberto. Vai para o GA4 como `cta_location`. */
  ctaLocation?: string;
}

/**
 * Modal de contato. O formulário em si mora em ContactForm — é o mesmo
 * componente renderizado em /contato, que é a versão indexável e linkável.
 */
export function ContactFormDialog({
  children,
  defaultSegment = "",
  ctaLocation = "modal",
}: ContactFormDialogProps) {
  // `cta_location` diz QUAL gatilho; `page_path` diz ONDE. Sem os dois, um
  // gatilho global como o do header vira uma linha única no relatório e não
  // responde "qual página gera lead".
  const pathname = usePathname();

  // O cta_click sai na abertura, não no clique do botão. Assim ele cobre todo
  // ponto de entrada do modal de uma vez, e os CTAs continuam podendo ser
  // Server Components (o de components/sections/CTA.tsx é).
  const aoAbrir = (aberto: boolean) => {
    if (aberto) {
      trackEvent("cta_click", {
        cta_location: ctaLocation,
        segment: defaultSegment || undefined,
        page_path: pathname ?? undefined,
      });
    }
  };

  return (
    <Dialog onOpenChange={aoAbrir}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        data-lenis-prevent
        className="w-[calc(100%-2rem)] sm:max-w-[360px] p-0 rounded-none sm:rounded-lg bg-white max-h-[90vh] overflow-y-auto"
      >
        <ContactForm
          defaultSegment={defaultSegment}
          ctaLocation={ctaLocation}
          header={
            <DialogHeader className="mb-5">
              <DialogTitle className="text-lg font-heading font-semibold tracking-tight">
                Fale Conosco
              </DialogTitle>
              <DialogDescription className="text-xs text-black-70 mt-1">
                Retornaremos em até 24 horas.
              </DialogDescription>
            </DialogHeader>
          }
        />
      </DialogContent>
    </Dialog>
  );
}
