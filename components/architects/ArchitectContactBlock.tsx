"use client";

import { motion } from "motion/react";
import { Globe, Instagram, Mail, MessageCircle, ArrowUpRight } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import type { Architect } from "@/lib/architects-data";
import { trackEvent } from "@/lib/analytics";
import { TrackedWhatsAppLink } from "@/components/layout/WhatsAppButton";

interface Props {
  architect: Architect;
}

const BERKAHN_WHATSAPP = "5511966415742"; // WhatsApp oficial Berkahn (mesmo do site / UnifiedCTA)
const BERKAHN_WHATSAPP_DISPLAY = "+55 (11) 96641-5742";

export function ArchitectContactBlock({ architect }: Props) {
  const whatsappMessage = encodeURIComponent(
    `Olá Berkahn! Gostaria de conhecer melhor o trabalho de ${architect.studioName} e estruturar meu projeto.`
  );

  const phoneClean = architect.contact.phone.replace(/\D/g, "");
  const architectWhatsappMessage = encodeURIComponent(
    `Oi ${architect.contactGreeting ?? architect.architectName}, tudo bem? Vim pela parceria com a Berkahn e gostaria de saber mais sobre os seus projetos.`
  );

  return (
    <section className="relative w-full bg-off-white py-24 lg:py-36 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
          className="mb-14 lg:mb-20 text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-black-50 mb-3">
            Próximo passo
          </p>
          <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-black">
            Vamos conversar.
          </h3>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* CARD 1 — Contato direto com o arquiteto */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
            className="bg-white p-8 lg:p-12 border border-black-5"
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-black-50 mb-6">
              Falar direto com o escritório
            </p>
            <h4 className="font-heading text-2xl md:text-3xl font-light tracking-tight text-black mb-8">
              {architect.studioName}
            </h4>

            <div className="space-y-1">
              <ContactLink
                href={architect.contact.website}
                icon={<Globe className="w-4 h-4" />}
                label="Website"
                value={architect.contact.website.replace(/^https?:\/\/(www\.)?/, "")}
                onClick={() =>
                  trackEvent("architect_contact_click", {
                    architect: architect.slug,
                    channel: "website",
                  })
                }
                external
              />
              <ContactLink
                href={`https://instagram.com/${architect.contact.instagram.replace("@", "")}`}
                icon={<Instagram className="w-4 h-4" />}
                label="Instagram"
                value={architect.contact.instagram}
                onClick={() =>
                  trackEvent("architect_contact_click", {
                    architect: architect.slug,
                    channel: "instagram",
                  })
                }
                external
              />
              <ContactLink
                href={`https://wa.me/${phoneClean}?text=${architectWhatsappMessage}`}
                icon={<MessageCircle className="w-4 h-4" />}
                label="WhatsApp"
                value={architect.contact.phone}
                external
                onClick={() =>
                  trackEvent("architect_contact_click", {
                    architect: architect.slug,
                    channel: "whatsapp",
                  })
                }
              />
              {architect.contact.email && (
                <ContactLink
                  href={`mailto:${architect.contact.email}`}
                  icon={<Mail className="w-4 h-4" />}
                  label="E-mail"
                  value={architect.contact.email}
                  onClick={() =>
                    trackEvent("architect_contact_click", {
                      architect: architect.slug,
                      channel: "email",
                    })
                  }
                />
              )}
            </div>
          </motion.div>

          {/* CARD 2 — CTA Berkahn */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="bg-black text-white p-8 lg:p-12 flex flex-col justify-between"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/50 mb-6">
                Estruturar projeto com Berkahn
              </p>
              <h4 className="font-heading text-2xl md:text-3xl font-light tracking-tight mb-6">
                Quer este arquiteto no seu projeto?
              </h4>
              <p className="text-white/70 leading-relaxed font-light">
                A Berkahn intermedia o contato, alinha briefing técnico e
                coordena execução em steel frame. Você fala com um único
                interlocutor.
              </p>
            </div>

            <div className="mt-12 space-y-3">
              <MagneticButton intensity={12}>
                <TrackedWhatsAppLink
                  href={`https://wa.me/${BERKAHN_WHATSAPP}?text=${whatsappMessage}`}
                  ctaLocation="curadoria_arquiteto_berkahn"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("architect_berkahn_whatsapp", {
                      architect: architect.slug,
                    })
                  }
                  className="group inline-flex items-center justify-between w-full px-6 py-4 bg-white text-black hover:bg-white/90 transition-colors"
                >
                  <span className="inline-flex items-center gap-3">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm uppercase tracking-[0.2em]">
                      Falar via WhatsApp
                    </span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-500 ease-expo group-hover:translate-x-1 group-hover:-translate-y-1" />
                </TrackedWhatsAppLink>
              </MagneticButton>
              <p className="text-xs text-white/50 px-2">
                Berkahn · {BERKAHN_WHATSAPP_DISPLAY}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactLink({
  href,
  icon,
  label,
  value,
  external = false,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  external?: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-center gap-4 py-3 border-b border-black-5 last:border-b-0 hover:bg-black-5/40 -mx-2 px-2 transition-colors"
    >
      <span className="text-black-50 group-hover:text-black transition-colors">
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-[10px] uppercase tracking-[0.25em] text-black-30">
          {label}
        </p>
        <p className="text-sm text-black font-light truncate">{value}</p>
      </div>
      <ArrowUpRight className="w-3.5 h-3.5 text-black-30 group-hover:text-black transition-all duration-500 ease-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}
