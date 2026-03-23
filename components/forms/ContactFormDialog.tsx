"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Segment = "residencial" | "comercial" | "";

interface ContactFormDialogProps {
  children: React.ReactNode;
  defaultSegment?: Segment;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  segment: string;
  message: string;
}

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactFormDialog({ children, defaultSegment = "" }: ContactFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    segment: defaultSegment,
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.phone.replace(/\D/g, "").length || formData.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Telefone é obrigatório";
    }
    if (!formData.segment) {
      newErrors.segment = "Selecione o segmento";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Mensagem é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setStatus("loading");
    setErrors({});

    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbx7AGRX_hBuPp4z8UAv27xKQCZls0QRT4g1P2jGeGvqZ6v7IQesTDLmvijN5RwAyvAt4Q/exec',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            categoria: formData.segment === "residencial" ? "Residencial" : "Comercial/Industrial",
            message: formData.message,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrors({ submit: result.message || "Erro ao enviar mensagem" });
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      setStatus("error");
      setErrors({ submit: "Erro de conexão. Tente novamente." });
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", segment: defaultSegment, message: "" });
    setErrors({});
    setStatus("idle");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[360px] p-0 rounded-none sm:rounded-lg bg-white max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              className="p-6 sm:p-8 text-center"
            >
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.1,
                  duration: 0.5,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                className="w-12 h-12 mx-auto mb-4 rounded-full bg-black flex items-center justify-center"
              >
                <Check className="w-5 h-5 text-white" strokeWidth={2} />
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h3 className="text-lg font-heading font-semibold mb-2 tracking-tight">
                  Mensagem Enviada!
                </h3>
                <p className="text-sm text-black-70 mb-6 leading-relaxed">
                  Obrigado pelo contato. Nossa equipe retornará em breve.
                </p>

                {/* Action Button */}
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="text-xs uppercase tracking-wider font-medium h-9"
                >
                  Enviar Nova Mensagem
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-8"
            >
              {/* Header */}
              <DialogHeader className="mb-5">
                <DialogTitle className="text-lg font-heading font-semibold tracking-tight">
                  Fale Conosco
                </DialogTitle>
                <DialogDescription className="text-xs text-black-70 mt-1">
                  Retornaremos em até 24 horas.
                </DialogDescription>
              </DialogHeader>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name Field */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-xs text-black-70 font-medium"
                  >
                    Nome
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Seu nome"
                    required
                    disabled={status === "loading"}
                    className="h-10 text-sm bg-white border border-black-10 placeholder:text-black-30 focus:border-black-30 focus:ring-0 transition-colors"
                  />
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs text-red-600"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs text-black-70 font-medium"
                  >
                    Email <span className="text-[10px] text-black-30">(Opcional)</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="seu@email.com"
                    disabled={status === "loading"}
                    className="h-10 text-sm bg-white border border-black-10 placeholder:text-black-30 focus:border-black-30 focus:ring-0 transition-colors"
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs text-red-600"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Phone Field (Required) */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="text-xs text-black-70 font-medium"
                  >
                    Telefone (WhatsApp)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                      let formatted = "";
                      if (digits.length <= 2) formatted = digits.length ? `(${digits}` : "";
                      else if (digits.length <= 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
                      else formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
                      setFormData({ ...formData, phone: formatted });
                    }}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    required
                    disabled={status === "loading"}
                    className="h-10 text-sm bg-white border border-black-10 placeholder:text-black-30 focus:border-black-30 focus:ring-0 transition-colors"
                  />
                  <AnimatePresence>
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs text-red-600"
                      >
                        {errors.phone}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Segment Field */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-black-70 font-medium">
                    Segmento
                  </Label>
                  <Select
                    value={formData.segment || undefined}
                    onValueChange={(value) =>
                      setFormData({ ...formData, segment: value })
                    }
                    disabled={status === "loading"}
                  >
                    <SelectTrigger className="h-10 text-sm bg-white border border-black-10 rounded-md px-3 py-2 shadow-none focus:border-black-30 focus:ring-0 transition-colors data-[placeholder]:text-black-30">
                      <SelectValue placeholder="Selecione o segmento" />
                    </SelectTrigger>
                    <SelectContent portal={false} className="bg-white border border-black-10 shadow-luxury-md">
                      <SelectItem value="residencial" className="focus:bg-black-5 focus:text-black">Residencial</SelectItem>
                      <SelectItem value="comercial" className="focus:bg-black-5 focus:text-black">Comercial / Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                  <AnimatePresence>
                    {errors.segment && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs text-red-600"
                      >
                        {errors.segment}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Message Field */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="message"
                    className="text-xs text-black-70 font-medium"
                  >
                    Mensagem
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Conte-nos sobre seu projeto..."
                    rows={2}
                    required
                    disabled={status === "loading"}
                    className="text-sm bg-white border border-black-10 placeholder:text-black-30 focus:border-black-30 focus:ring-0 transition-colors resize-none min-h-[60px]"
                  />
                  <AnimatePresence>
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs text-red-600"
                      >
                        {errors.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <div>
                  <Button
                    type="submit"
                    className="w-full h-10 bg-black text-white hover:bg-black-90 transition-colors text-xs uppercase tracking-wider font-medium"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enviando...
                      </span>
                    ) : (
                      "Enviar Mensagem"
                    )}
                  </Button>
                </div>

                {/* WhatsApp Link */}
                <div>
                  <a
                    href="https://wa.me/5511966415742?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20Berkahn."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-10 flex items-center justify-center gap-2 border border-black-10 text-black-70 hover:bg-black-5 transition-colors text-xs uppercase tracking-wider font-medium rounded-md"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Converse pelo WhatsApp
                  </a>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {status === "error" && errors.submit && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-red-600 text-center"
                    >
                      {errors.submit}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Privacy Note */}
                <p className="text-[10px] text-black-30 text-center mt-4">
                  Seus dados estão protegidos.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
