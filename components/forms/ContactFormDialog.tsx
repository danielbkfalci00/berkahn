"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import type { Segment } from "./ContactForm";
import { trackEvent } from "@/lib/analytics";

const ContactForm = dynamic(
  () => import("./ContactForm").then((module) => module.ContactForm),
  {
    loading: () => (
      <p className="p-8 text-center text-sm text-black-50" role="status">
        Carregando formulário…
      </p>
    ),
  }
);

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
        {/*
          Nome acessível do diálogo. Precisa ser filho DIRETO do DialogContent, e
          não pode viver dentro do ContactForm, por dois motivos:

          1. ContactForm é next/dynamic. Enquanto o chunk carrega, o content já
             montou e o título ainda não existe no DOM. É nessa janela que o foco
             entra no diálogo, e é nela que o Radix acusa
             "DialogContent requires a DialogTitle".
          2. Depois do envio, o ContactForm troca para o ramo de sucesso, que não
             renderiza o `header`. O título desmontava e o diálogo ficava sem nome
             pelo resto da sessão.

          Fica oculto porque o cabeçalho visível continua dentro do formulário,
          junto do padding dele. Mover o visível para cá mudaria o desenho do
          estado de sucesso, que hoje é um painel limpo sem cabeçalho.
        */}
        <VisuallyHidden>
          <DialogTitle>Fale Conosco</DialogTitle>
          <DialogDescription>
            Formulário de contato. Retornaremos em até 24 horas.
          </DialogDescription>
        </VisuallyHidden>
        <ContactForm
          defaultSegment={defaultSegment}
          ctaLocation={ctaLocation}
          // As classes abaixo reproduzem o que DialogHeader e DialogTitle
          // injetavam por padrão (`flex flex-col space-y-1.5 text-center
          // sm:text-left` e `leading-none`). Sem elas o cabeçalho deixaria de
          // ser centralizado no mobile.
          header={
            <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-5">
              <h2 className="text-lg font-heading font-semibold leading-none tracking-tight">
                Fale Conosco
              </h2>
              <p className="text-xs text-black-70 mt-1">
                Retornaremos em até 24 horas.
              </p>
            </div>
          }
        />
      </DialogContent>
    </Dialog>
  );
}
