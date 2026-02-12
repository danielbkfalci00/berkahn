"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
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
import { COMERCIAL_FORM_PROJECT_TYPES } from "@/lib/comercial-data";

interface FormData {
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  projectType: string;
  description: string;
}

// State machine pattern from ResidencialContactForm.tsx:28
type FormStatus = "idle" | "loading" | "success" | "error";

export function CorporateContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    company: "",
    role: "",
    email: "",
    phone: "",
    projectType: "",
    description: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation pattern from ResidencialContactForm.tsx:42-59
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    if (!formData.company.trim()) {
      newErrors.company = "Empresa é obrigatória";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submission pattern from ResidencialContactForm.tsx:62-101
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus("loading");
    setErrors({});

    try {
      const projectLabel = COMERCIAL_FORM_PROJECT_TYPES.find(
        (t) => t.value === formData.projectType
      )?.label;

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbx7CBwOaj7Vn1HtXlAy-OLINEmxuVXgSYMIsUmqzYp6JJbjv_lENeTI56IP3Z8sVwuJ/exec",
        {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: `[Comercial/Industrial] [${projectLabel || "Não informado"}] Empresa: ${formData.company}${formData.role ? ` | Cargo: ${formData.role}` : ""} | ${formData.description}`,
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
    setFormData({
      name: "",
      company: "",
      role: "",
      email: "",
      phone: "",
      projectType: "",
      description: "",
    });
    setErrors({});
    setStatus("idle");
  };

  // Field styling pattern from ResidencialContactForm.tsx:110
  const inputClasses =
    "h-10 text-sm bg-white border border-black-10 placeholder:text-black-30 focus:border-black-30 focus:ring-0 transition-colors";

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        // Success state pattern from ResidencialContactForm.tsx:117-154
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          className="text-center py-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-14 h-14 mx-auto mb-5 rounded-full bg-black flex items-center justify-center"
          >
            <Check className="w-6 h-6 text-white" strokeWidth={2} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h3 className="text-xl font-heading font-semibold mb-2 tracking-tight">
              Mensagem Enviada!
            </h3>
            <p className="text-sm text-black-70 mb-6 leading-relaxed">
              Obrigado pelo contato. Nossa equipe retornará em breve com uma
              análise técnica inicial para o seu projeto corporativo.
            </p>
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
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Row 1: Nome + Empresa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nome */}
            <div className="space-y-1.5">
              <Label htmlFor="corp-name" className="text-xs text-black-70 font-medium">
                Nome completo
              </Label>
              <Input
                id="corp-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome"
                required
                disabled={status === "loading"}
                className={inputClasses}
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

            {/* Empresa */}
            <div className="space-y-1.5">
              <Label htmlFor="corp-company" className="text-xs text-black-70 font-medium">
                Empresa
              </Label>
              <Input
                id="corp-company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Nome da empresa"
                required
                disabled={status === "loading"}
                className={inputClasses}
              />
              <AnimatePresence>
                {errors.company && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-red-600"
                  >
                    {errors.company}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Row 2: Cargo + Telefone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Cargo */}
            <div className="space-y-1.5">
              <Label htmlFor="corp-role" className="text-xs text-black-70 font-medium">
                Cargo{" "}
                <span className="text-[10px] text-black-30">(Opcional)</span>
              </Label>
              <Input
                id="corp-role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Seu cargo"
                disabled={status === "loading"}
                className={inputClasses}
              />
            </div>

            {/* Telefone */}
            <div className="space-y-1.5">
              <Label htmlFor="corp-phone" className="text-xs text-black-70 font-medium">
                Telefone (WhatsApp)
              </Label>
              <Input
                id="corp-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                required
                disabled={status === "loading"}
                className={inputClasses}
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
          </div>

          {/* Row 3: Email + Tipo de projeto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="corp-email" className="text-xs text-black-70 font-medium">
                E-mail
              </Label>
              <Input
                id="corp-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                required
                disabled={status === "loading"}
                className={inputClasses}
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

            {/* Tipo de projeto */}
            <div className="space-y-1.5">
              <Label className="text-xs text-black-70 font-medium">
                Tipo de projeto
              </Label>
              <Select
                value={formData.projectType}
                onValueChange={(value) =>
                  setFormData({ ...formData, projectType: value })
                }
                disabled={status === "loading"}
              >
                <SelectTrigger className={inputClasses}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {COMERCIAL_FORM_PROJECT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description (full-width) */}
          <div className="space-y-1.5">
            <Label htmlFor="corp-description" className="text-xs text-black-70 font-medium">
              Descrição do projeto{" "}
              <span className="text-[10px] text-black-30">(Opcional)</span>
            </Label>
            <Textarea
              id="corp-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Conte-nos sobre o projeto: tipo de operação, área estimada, prazo, necessidades específicas..."
              rows={4}
              disabled={status === "loading"}
              className="text-sm bg-white border border-black-10 placeholder:text-black-30 focus:border-black-30 focus:ring-0 transition-colors resize-none min-h-[100px]"
            />
          </div>

          {/* Submit */}
          <div>
            <Button
              type="submit"
              className="w-full md:w-auto h-11 px-12 bg-black text-white hover:bg-black-90 transition-colors text-xs uppercase tracking-wider font-medium"
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </span>
              ) : (
                "Solicitar Consultoria"
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
          <p className="text-[10px] text-black-30">
            Seus dados estão protegidos conforme nossa{" "}
            <a href="/privacidade" className="underline hover:text-black-50 transition-colors">
              Política de Privacidade
            </a>
            .
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
