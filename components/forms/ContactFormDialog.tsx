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
import { CONTACT_FORM_PROJECT_TYPES } from "@/lib/residencial-data";
import { COMERCIAL_FORM_PROJECT_TYPES } from "@/lib/comercial-data";

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
  projectType: string;
  message: string;
}

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactFormDialog({ children, defaultSegment = "" }: ContactFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    segment: defaultSegment,
    projectType: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.segment) {
      newErrors.segment = "Selecione o segmento";
    }
    if (formData.segment && !formData.projectType) {
      newErrors.projectType = "Selecione o tipo de projeto";
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
            tipo: (formData.segment === "residencial"
              ? CONTACT_FORM_PROJECT_TYPES
              : COMERCIAL_FORM_PROJECT_TYPES
            ).find(t => t.value === formData.projectType)?.label || "",
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
    setFormData({ name: "", email: "", phone: "", segment: defaultSegment, projectType: "", message: "" });
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
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="seu@email.com"
                    required
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

                {/* Phone Field (Optional) */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="text-xs text-black-70 font-medium"
                  >
                    Telefone <span className="text-[10px] text-black-30">(Opcional)</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="(00) 00000-0000"
                    disabled={status === "loading"}
                    className="h-10 text-sm bg-white border border-black-10 placeholder:text-black-30 focus:border-black-30 focus:ring-0 transition-colors"
                  />
                </div>

                {/* Segment Field */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-black-70 font-medium">
                    Segmento
                  </Label>
                  <Select
                    value={formData.segment || undefined}
                    onValueChange={(value) =>
                      setFormData({ ...formData, segment: value, projectType: "" })
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

                {/* Project Type Field (conditional) */}
                {formData.segment && (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-black-70 font-medium">
                      Tipo de Projeto
                    </Label>
                    <Select
                      value={formData.projectType || undefined}
                      onValueChange={(value) =>
                        setFormData({ ...formData, projectType: value })
                      }
                      disabled={status === "loading"}
                    >
                      <SelectTrigger className="h-10 text-sm bg-white border border-black-10 rounded-md px-3 py-2 shadow-none focus:border-black-30 focus:ring-0 transition-colors data-[placeholder]:text-black-30">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent portal={false} className="bg-white border border-black-10 shadow-luxury-md">
                        {(formData.segment === "residencial"
                          ? CONTACT_FORM_PROJECT_TYPES
                          : COMERCIAL_FORM_PROJECT_TYPES
                        ).map((type) => (
                          <SelectItem key={type.value} value={type.value} className="focus:bg-black-5 focus:text-black">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <AnimatePresence>
                      {errors.projectType && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-xs text-red-600"
                        >
                          {errors.projectType}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                )}

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
                    rows={3}
                    required
                    disabled={status === "loading"}
                    className="text-sm bg-white border border-black-10 placeholder:text-black-30 focus:border-black-30 focus:ring-0 transition-colors resize-none min-h-[80px]"
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
