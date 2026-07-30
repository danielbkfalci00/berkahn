"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ContactForm, type Segment } from "./ContactForm";

interface ContactFormDialogProps {
  children: React.ReactNode;
  defaultSegment?: Segment;
}

/**
 * Modal de contato. O formulário em si mora em ContactForm — é o mesmo
 * componente renderizado em /contato, que é a versão indexável e linkável.
 */
export function ContactFormDialog({ children, defaultSegment = "" }: ContactFormDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[360px] p-0 rounded-none sm:rounded-lg bg-white max-h-[90vh] overflow-y-auto">
        <ContactForm
          defaultSegment={defaultSegment}
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
