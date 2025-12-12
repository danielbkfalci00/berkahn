"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Clock,
  Calendar,
  User,
  ArrowLeft,
  XCircle,
  CheckCircle,
  FileText,
  ChevronRight,
} from "lucide-react";

import { RichArticle } from "@/types/article";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { StatsGrid } from "@/components/article/StatHighlight";
import { DataTable } from "@/components/article/DataTable";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { RelatedArticlesCarousel } from "@/components/article/RelatedArticlesCarousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CTA } from "@/components/sections/CTA";

interface ArticleContentProps {
  article: RichArticle;
}

export function ArticleContent({ article }: ArticleContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <ReadingProgress />

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image
            src={article.heroImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90" />
        </motion.div>

        {/* Content */}
        <motion.div
          className="relative z-10 h-full flex flex-col justify-end pb-16 px-6 lg:px-16"
          style={{ opacity: heroOpacity }}
        >
          <div className="max-w-4xl">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Link
                href="/atualidade"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Voltar para Atualidade</span>
              </Link>
            </motion.div>

            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Badge className="bg-white text-black hover:bg-white/90 mb-4">
                {article.category}
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            >
              {article.title}
            </motion.h1>

            {/* Subtitle */}
            {article.subtitle && (
              <motion.p
                className="text-xl text-white/80 mb-8 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {article.subtitle}
              </motion.p>
            )}

            {/* Meta info */}
            <motion.div
              className="flex flex-wrap items-center gap-6 text-white/70 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {article.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(article.publishDate)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {article.readTime} min de leitura
              </span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <div className="py-lg lg:py-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1">
            {/* Article Content */}
            <article className="max-w-4xl mx-auto">
              {/* Sections */}
              {article.sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="mb-12 scroll-mt-28"
                >
                  <RevealOnScroll delay={index * 0.05}>
                    {section.level === 2 ? (
                      <h2 className="headline-md mb-6">{section.title}</h2>
                    ) : (
                      <h3 className="headline-sm mb-4">{section.title}</h3>
                    )}
                    <div className="body-lg text-black-80 leading-relaxed">
                      {section.content}
                    </div>
                  </RevealOnScroll>

                  {/* Insert Stats after introduction */}
                  {section.id === "introducao" && article.stats && (
                    <div className="mt-12">
                      <RevealOnScroll>
                        <p className="label-text text-black-50 mb-6">
                          Principais Indicadores
                        </p>
                        <StatsGrid stats={article.stats} />
                      </RevealOnScroll>
                    </div>
                  )}

                  {/* Insert Tables after costs section */}
                  {section.id === "custos" && article.tables && (
                    <div className="mt-12 space-y-12">
                      {article.tables.map((table) => (
                        <RevealOnScroll key={table.id}>
                          <DataTable table={table} />
                        </RevealOnScroll>
                      ))}
                    </div>
                  )}

                  {/* Insert Myths Accordion */}
                  {section.id === "mitos" && article.myths && (
                    <div className="mt-8">
                      <RevealOnScroll>
                        <Accordion type="multiple" className="space-y-3">
                          {article.myths.map((item, i) => (
                            <AccordionItem
                              key={i}
                              value={`myth-${i}`}
                              className="border border-black-10 rounded-lg overflow-hidden bg-white"
                            >
                              <AccordionTrigger className="px-6 py-4 hover:bg-black-5 hover:no-underline">
                                <span className="flex items-center gap-3 text-left">
                                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                  <span className="font-medium">{item.myth}</span>
                                </span>
                              </AccordionTrigger>
                              <AccordionContent className="px-6 pb-4 pt-0">
                                <div className="flex gap-3 bg-black-5 rounded-lg p-4 mt-2">
                                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                  <p className="text-black-80">{item.truth}</p>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </RevealOnScroll>
                    </div>
                  )}

                  {/* Insert Process Timeline */}
                  {section.id === "processo" && article.process && (
                    <div className="mt-12">
                      <RevealOnScroll>
                        <div className="relative">
                          {/* Timeline line */}
                          <div className="absolute left-6 top-0 bottom-0 w-px bg-black-10 hidden md:block" />

                          <div className="space-y-8">
                            {article.process.map((step, i) => (
                              <motion.div
                                key={step.number}
                                className="flex gap-6 items-start relative"
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{
                                  delay: i * 0.1,
                                  duration: 0.5,
                                  ease: [0.19, 1, 0.22, 1],
                                }}
                              >
                                {/* Number circle */}
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-heading text-xl font-medium z-10">
                                  {step.number}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-4">
                                  <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h4 className="font-heading text-xl font-medium">
                                      {step.title}
                                    </h4>
                                    {step.duration && (
                                      <Badge variant="outline" className="text-xs">
                                        {step.duration}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-black-70">{step.description}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </RevealOnScroll>
                    </div>
                  )}

                  {/* Insert Norms Cards */}
                  {section.id === "como-funciona" && article.norms && (
                    <div className="mt-12">
                      <RevealOnScroll>
                        <p className="label-text text-black-50 mb-6">
                          Normas Técnicas Aplicáveis
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {article.norms.map((norm, i) => (
                            <motion.div
                              key={norm.code}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{
                                delay: i * 0.1,
                                duration: 0.5,
                                ease: [0.19, 1, 0.22, 1],
                              }}
                            >
                              <Card className="h-full hover:shadow-luxury-md transition-shadow">
                                <CardHeader className="pb-2">
                                  <div className="flex items-center justify-between">
                                    <Badge variant="secondary" className="font-mono text-xs">
                                      {norm.code}
                                    </Badge>
                                    {norm.year && (
                                      <span className="text-xs text-black-50">
                                        {norm.year}
                                      </span>
                                    )}
                                  </div>
                                  <CardTitle className="text-base font-medium mt-2">
                                    {norm.title}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-black-60">
                                    {norm.description}
                                  </p>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </RevealOnScroll>
                    </div>
                  )}
                </section>
              ))}

              {/* Related Articles Carousel */}
              <RelatedArticlesCarousel
                currentSlug={article.slug}
                currentCategory={article.category}
              />
            </article>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <CTA />
    </>
  );
}
