"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Loader2, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONTACT_FORM_PROJECT_TYPES } from "@/lib/residencial-data";

/* ─── Types ─── */

interface FormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  description: string;
}

type FormStatus = "idle" | "loading" | "success" | "error";

/* ─── Aceternity-style BottomGradient ─── */

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-black-50 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-black-30 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

/* ─── LabelInputContainer ─── */

function LabelInputContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex w-full flex-col space-y-1.5 ${className || ""}`}>
      {children}
    </div>
  );
}

/* ─── Component ─── */

export function ResidencialContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    description: "",
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
    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
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
      const projectLabel = CONTACT_FORM_PROJECT_TYPES.find(
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
            message: `[Residencial] [${projectLabel || "Não informado"}] ${formData.description}`,
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
    setFormData({ name: "", email: "", phone: "", projectType: "", description: "" });
    setErrors({});
    setStatus("idle");
  };

  /* ─── Shared styles ─── */

  const inputClasses =
    "flex h-11 w-full rounded-md border-none bg-black-5 px-3.5 py-2 text-sm shadow-input placeholder:text-black-30 focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-black/20 transition-all duration-200";

  const labelClasses =
    "font-heading text-sm font-semibold text-black tracking-tight";

  const ease = [0.19, 1, 0.22, 1] as const;

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease }}
          className="text-center py-16"
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
            <p className="text-sm text-black-70 mb-6 leading-relaxed max-w-xs mx-auto">
              Nossa equipe retornará em breve com uma análise técnica inicial
              para o seu projeto.
            </p>
            <button
              onClick={resetForm}
              className="group/btn relative inline-flex h-10 items-center px-6 rounded-md bg-black-5 text-xs uppercase tracking-wider font-medium text-black hover:bg-black-10 transition-colors"
            >
              Enviar Nova Mensagem
              <BottomGradient />
            </button>
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
          {/* Row 1: Nome + Telefone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelInputContainer>
              <label htmlFor="res-name" className={labelClasses}>
                Nome completo
              </label>
              <input
                id="res-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome"
                required
                disabled={status === "loading"}
                className={inputClasses}
              />
              <ErrorMessage message={errors.name} />
            </LabelInputContainer>

            <LabelInputContainer>
              <label htmlFor="res-phone" className={labelClasses}>
                Telefone (WhatsApp)
              </label>
              <input
                id="res-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                required
                disabled={status === "loading"}
                className={inputClasses}
              />
              <ErrorMessage message={errors.phone} />
            </LabelInputContainer>
          </div>

          {/* Row 2: Email (full width) */}
          <LabelInputContainer>
            <label htmlFor="res-email" className={labelClasses}>
              E-mail
            </label>
            <input
              id="res-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="seu@email.com"
              required
              disabled={status === "loading"}
              className={inputClasses}
            />
            <ErrorMessage message={errors.email} />
          </LabelInputContainer>

          {/* Row 3: Tipo de projeto (full width) */}
          <LabelInputContainer>
            <label className={labelClasses}>Tipo de projeto</label>
            <Select
              value={formData.projectType}
              onValueChange={(value) =>
                setFormData({ ...formData, projectType: value })
              }
              disabled={status === "loading"}
            >
              <SelectTrigger className={inputClasses}>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-black-10 shadow-luxury-md">
                {CONTACT_FORM_PROJECT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="focus:bg-black-5 focus:text-black">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </LabelInputContainer>

          {/* Row 4: Descrição (full width) */}
          <LabelInputContainer>
            <label htmlFor="res-description" className={labelClasses}>
              Descrição do projeto{" "}
              <span className="text-[10px] text-black-30 font-normal">(Opcional)</span>
            </label>
            <textarea
              id="res-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Conte-nos o que você tem em mente: tipo de projeto, terreno, metragem estimada..."
              rows={4}
              disabled={status === "loading"}
              className="flex w-full rounded-md border-none bg-black-5 px-3.5 py-3 text-sm shadow-input placeholder:text-black-30 focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-black/20 transition-all duration-200 resize-none min-h-[100px]"
            />
          </LabelInputContainer>

          {/* Submit button with BottomGradient */}
          <button
            type="submit"
            className="group/btn relative flex h-12 w-full items-center justify-center rounded-md bg-black px-8 text-white text-xs uppercase tracking-wider font-medium transition-colors hover:bg-black-90 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Fale com a Berkahn
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
            <BottomGradient />
          </button>

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
          <p className="text-[10px] text-black-30 text-center pt-2">
            Seus dados estão protegidos conforme nossa{" "}
            <a
              href="/privacidade"
              className="underline hover:text-black-50 transition-colors"
            >
              Política de Privacidade
            </a>
            .
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

/* ─── ErrorMessage helper ─── */

function ErrorMessage({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-xs text-red-600"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
