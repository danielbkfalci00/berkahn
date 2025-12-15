"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Mail, User, Phone, MessageSquare } from "lucide-react";
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

interface ContactFormDialogProps {
  children: React.ReactNode;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactFormDialog({ children }: ContactFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
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

    // Mock API call - 2 second delay
    setTimeout(() => {
      setStatus("success");
    }, 2000);
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", message: "" });
    setErrors({});
    setStatus("idle");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              className="p-12 text-center"
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
                className="w-20 h-20 mx-auto mb-8 rounded-full bg-black flex items-center justify-center"
              >
                <Check className="w-10 h-10 text-white" strokeWidth={2.5} />
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h3 className="text-2xl font-heading font-bold mb-3 tracking-tight">
                  Mensagem Enviada!
                </h3>
                <p className="text-base text-black-70 mb-8 max-w-sm mx-auto leading-relaxed">
                  Obrigado pelo contato. Nossa equipe retornará em breve.
                </p>

                {/* Divider */}
                <div className="w-16 h-px bg-black-10 mx-auto mb-8" />

                {/* Action Button */}
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="uppercase tracking-wider text-xs font-medium"
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
              className="p-8"
            >
              {/* Header */}
              <DialogHeader className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-black-5 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-black" strokeWidth={2} />
                  </div>
                  <div className="w-px h-8 bg-black-10" />
                  <DialogTitle className="text-2xl font-heading font-bold tracking-tight">
                    Fale Conosco
                  </DialogTitle>
                </div>
                <DialogDescription className="text-sm text-black-70 leading-relaxed">
                  Preencha o formulário abaixo. Retornaremos seu contato em até 24 horas.
                </DialogDescription>
              </DialogHeader>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor="name"
                    className="text-xs uppercase tracking-wider text-black-70 font-medium flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5" strokeWidth={2} />
                    Nome Completo
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
                    className="h-12 text-base bg-white border border-black-20 placeholder:text-black-40 focus:border-black-50 focus:ring-1 focus:ring-black-10 transition-all duration-300"
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
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor="email"
                    className="text-xs uppercase tracking-wider text-black-70 font-medium flex items-center gap-2"
                  >
                    <Mail className="w-3.5 h-3.5" strokeWidth={2} />
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
                    className="h-12 text-base bg-white border border-black-20 placeholder:text-black-40 focus:border-black-50 focus:ring-1 focus:ring-black-10 transition-all duration-300"
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
                </motion.div>

                {/* Phone Field (Optional) */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor="phone"
                    className="text-xs uppercase tracking-wider text-black-70 font-medium flex items-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                    Telefone
                    <span className="text-[10px] text-black-50 normal-case tracking-normal">
                      (Opcional)
                    </span>
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
                    className="h-12 text-base bg-white border border-black-20 placeholder:text-black-40 focus:border-black-50 focus:ring-1 focus:ring-black-10 transition-all duration-300"
                  />
                </motion.div>

                {/* Message Field */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor="message"
                    className="text-xs uppercase tracking-wider text-black-70 font-medium flex items-center gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5" strokeWidth={2} />
                    Mensagem
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Conte-nos sobre seu projeto..."
                    rows={4}
                    required
                    disabled={status === "loading"}
                    className="text-base bg-white border border-black-20 placeholder:text-black-40 focus:border-black-50 focus:ring-1 focus:ring-black-10 transition-all duration-300 resize-none"
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
                </motion.div>

                {/* Divider */}
                <div className="w-full h-px bg-black-10" />

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-14 bg-black text-white hover:bg-black-90 transition-colors text-sm uppercase tracking-wider font-medium"
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
                </motion.div>

                {/* Privacy Note */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="text-xs text-black-50 text-center leading-relaxed"
                >
                  Seus dados estão protegidos e serão utilizados apenas para responder seu contato.
                </motion.p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
