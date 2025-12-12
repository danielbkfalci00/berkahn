"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { ArrowRight, Check, Mail } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <section className="py-2xl bg-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Decorative Lines */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
        className="absolute top-0 left-0 right-0 h-px bg-white/10 origin-left"
      />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <RevealOnScroll>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 mx-auto mb-8 rounded-full border border-white/20 flex items-center justify-center"
            >
              <Mail className="w-6 h-6 text-white/60" />
            </motion.div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <p className="label-text text-white/50 mb-4">Newsletter</p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <h2 className="headline-md mb-6">
              Fique por Dentro das
              <br />
              <span className="text-white/70">Novidades em Steel Frame</span>
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={0.3}>
            <p className="body-md text-white/60 mb-12 max-w-lg mx-auto">
              Receba insights exclusivos, tendências de mercado e novidades
              sobre construção industrializada diretamente no seu e-mail.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.4}>
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-3 text-white"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-lg">Obrigado por se inscrever!</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                  <div className="flex-1 relative">
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 px-6 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 focus:ring-offset-0"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="h-14 px-8 bg-white text-black hover:bg-white/90 font-medium uppercase tracking-wider text-sm disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full"
                      />
                    ) : (
                      <>
                        Inscrever-se
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Privacy Note */}
                <p className="mt-6 text-xs text-white/40">
                  Respeitamos sua privacidade. Cancele a inscrição a qualquer momento.
                </p>
              </form>
            )}
          </RevealOnScroll>

          {/* Stats */}
          <RevealOnScroll delay={0.5}>
            <div className="mt-16 pt-16 border-t border-white/10">
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-3xl font-heading font-semibold mb-1">2.5k+</p>
                  <p className="text-xs text-white/50 uppercase tracking-wider">Inscritos</p>
                </div>
                <div>
                  <p className="text-3xl font-heading font-semibold mb-1">50+</p>
                  <p className="text-xs text-white/50 uppercase tracking-wider">Artigos</p>
                </div>
                <div>
                  <p className="text-3xl font-heading font-semibold mb-1">98%</p>
                  <p className="text-xs text-white/50 uppercase tracking-wider">Satisfação</p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

// Alternative compact newsletter banner
export function NewsletterBanner() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-8 bg-black-5 border-y border-black-10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-heading font-semibold">Receba novidades</p>
              <p className="text-sm text-black-50">Insights semanais sobre Steel Frame</p>
            </div>
          </div>

          <form className="flex gap-3 w-full md:w-auto">
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full md:w-64 bg-white border-black-10"
            />
            <Button
              type="submit"
              className="h-12 px-6 bg-black text-white hover:bg-black/90"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
