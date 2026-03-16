"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
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
import { ChartSection } from "@/components/article/ChartSection";
import { ComparisonTabs } from "@/components/article/ComparisonTabs";
import { DecisionGuideSection } from "@/components/article/DecisionGuideSection";
import { FinancingCalculator } from "@/components/article/FinancingCalculator";
import { MythBuster } from "@/components/article/MythBuster";
import { MarketGrowthChart } from "@/components/article/MarketGrowthChart";
import { ViabilityMatrix } from "@/components/article/ViabilityMatrix";
import { CaseStudyCard } from "@/components/article/CaseStudyCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
                href="/atualidades"
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-16">
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

                  {/* Insert Market Growth Charts after contexto-mercado */}
                  {section.id === "contexto-mercado" && article.charts && (
                    <div className="mt-12">
                      <MarketGrowthChart
                        charts={article.charts.filter(c =>
                          c.id.includes('adoption') || c.id.includes('3d-printing') || c.id.includes('market-growth')
                        )}
                      />
                    </div>
                  )}

                  {/* Insert Tables after analise-financeira */}
                  {section.id === "analise-financeira" && article.tables && (
                    <div className="mt-12 space-y-8">
                      <p className="label-text text-black-50 mb-6">
                        Análise de Custos
                      </p>
                      {article.tables.map((table) => (
                        <RevealOnScroll key={table.id}>
                          <DataTable table={table} />
                        </RevealOnScroll>
                      ))}
                    </div>
                  )}

                  {/* Insert Tab Comparisons and Viability Matrix after analise-financeira */}
                  {section.id === "analise-financeira" && article.tabComparisons && (
                    <div className="mt-12">
                      <p className="label-text text-black-50 mb-6">
                        Avaliador de Viabilidade
                      </p>
                      <ViabilityMatrix scenarios={article.tabComparisons} />
                    </div>
                  )}

                  {/* Insert Tech Adoption Charts after tendencias-tecnologicas */}
                  {section.id === "tendencias-tecnologicas" && article.charts && (
                    <div className="mt-12 space-y-8">
                      <RevealOnScroll>
                        {article.charts
                          .filter(c => c.id.includes('tech-adoption') || c.id.includes('3d-printing'))
                          .map(chart => (
                            <ChartSection key={chart.id} chart={chart} />
                          ))}
                      </RevealOnScroll>
                    </div>
                  )}

                  {/* Insert Case Study Cards after casos-estudo */}
                  {section.id === "casos-estudo" && article.gallery && (
                    <div className="mt-12">
                      <p className="label-text text-black-50 mb-8">
                        Galeria de Projetos
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {article.gallery.images.map((img, idx) => (
                          <CaseStudyCard
                            key={idx}
                            title={img.caption || img.alt}
                            image={img.url}
                            alt={img.alt}
                            description={img.alt}
                            delay={idx * 0.1}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Insert MythBuster after mitos-realidade */}
                  {section.id === "mitos-realidade" && article.myths && (
                    <div className="mt-12">
                      <MythBuster myths={article.myths} variant="accordion" />
                    </div>
                  )}

                  {/* Insert Charts after tempo-construcao */}
                  {section.id === "tempo-construcao" && article.charts && (
                    <div className="mt-12 space-y-8">
                      {article.charts
                        .filter(chart => chart.id.includes('timeline'))
                        .map(chart => (
                          <ChartSection key={chart.id} chart={chart} />
                        ))}
                    </div>
                  )}

                  {/* Insert Tab Comparisons and Charts after custo-total */}
                  {section.id === "custo-total" && article.tabComparisons && (
                    <div className="mt-12">
                      {article.tabComparisons
                        .filter(comp => comp.id.includes('cost'))
                        .map(comp => (
                          <ComparisonTabs key={comp.id} comparison={comp} />
                        ))}
                    </div>
                  )}

                  {section.id === "custo-total" && article.charts && (
                    <div className="mt-12">
                      {article.charts
                        .filter(chart => chart.id.includes('cost'))
                        .map(chart => (
                          <ChartSection key={chart.id} chart={chart} />
                        ))}
                    </div>
                  )}

                  {/* Insert Charts after sustentabilidade */}
                  {section.id === "sustentabilidade" && article.charts && (
                    <div className="mt-12">
                      {article.charts
                        .filter(chart => chart.type === 'radar' || chart.id.includes('sustainability'))
                        .map(chart => (
                          <ChartSection key={chart.id} chart={chart} />
                        ))}
                    </div>
                  )}

                  {/* Insert Charts after desempenho-termico */}
                  {section.id === "desempenho-termico" && article.charts && (
                    <div className="mt-12">
                      {article.charts
                        .filter(chart => chart.id.includes('thermal') || chart.id.includes('desempenho'))
                        .map(chart => (
                          <ChartSection key={chart.id} chart={chart} />
                        ))}
                    </div>
                  )}

                  {/* Insert Charts after aceitacao-mercado */}
                  {section.id === "aceitacao-mercado" && article.charts && (
                    <div className="mt-12">
                      {article.charts
                        .filter(chart => chart.type === 'pie' || chart.id.includes('market'))
                        .map(chart => (
                          <ChartSection key={chart.id} chart={chart} />
                        ))}
                    </div>
                  )}

                  {/* Insert Decision Guide after guia-decisao */}
                  {section.id === "guia-decisao" && article.decisionGuide && (
                    <div className="mt-8">
                      <DecisionGuideSection guide={article.decisionGuide} />
                    </div>
                  )}

                  {/* Insert Financing Calculator after custos-comparativo */}
                  {section.id === "custos-comparativo" && (
                    <div className="mt-12">
                      <RevealOnScroll>
                        <p className="label-text text-black-50 mb-6">
                          Simule seu Financiamento
                        </p>
                        <FinancingCalculator />
                      </RevealOnScroll>
                    </div>
                  )}

                  {/* Insert Tab Comparisons after opcoes-2026 */}
                  {section.id === "opcoes-2026" && article.tabComparisons && (
                    <div className="mt-12">
                      {article.tabComparisons.map((comparison) => (
                        <ComparisonTabs key={comparison.id} comparison={comparison} />
                      ))}
                    </div>
                  )}

                  {/* Insert Charts after mercado-perspectivas */}
                  {section.id === "mercado-perspectivas" && article.charts && (
                    <div className="mt-12 space-y-12">
                      {article.charts.map((chart) => (
                        <RevealOnScroll key={chart.id}>
                          <ChartSection chart={chart} />
                        </RevealOnScroll>
                      ))}
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

                  {/* Gallery Carousel - Insert after arquitetura section */}
                  {section.id === "arquitetura" && article.gallery && (
                    <div className="mt-12">
                      <RevealOnScroll>
                        <p className="label-text text-black-50 mb-6 uppercase tracking-wider">
                          {article.gallery.title || "Projetos"}
                        </p>
                        <Carousel opts={{ align: "start", loop: true }}>
                          <CarouselContent>
                            {article.gallery.images.map((img, i) => (
                              <CarouselItem key={i} className="basis-full md:basis-1/2 lg:basis-1/3">
                                <div className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                                  <Image
                                    src={img.url}
                                    alt={img.alt}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                  {img.caption && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white p-6">
                                      <p className="text-sm font-medium">{img.caption}</p>
                                    </div>
                                  )}
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <div className="flex gap-2 mt-6 justify-end">
                            <CarouselPrevious className="static translate-y-0" />
                            <CarouselNext className="static translate-y-0" />
                          </div>
                        </Carousel>
                      </RevealOnScroll>
                    </div>
                  )}

                  {/* Checklist Cards - Insert after guia-pratico section */}
                  {section.id === "guia-pratico" && article.checklist && (
                    <div className="mt-12">
                      <RevealOnScroll>
                        <div className="bg-black-5 rounded-lg p-8 md:p-10">
                          <h3 className="headline-sm mb-8">{article.checklist.title}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {article.checklist.items.map((item, i) => (
                              <motion.div
                                key={i}
                                className="flex items-start gap-3 bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                  delay: i * 0.08,
                                  duration: 0.5,
                                  ease: [0.19, 1, 0.22, 1]
                                }}
                              >
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-semibold text-black mb-1">{item.label}</p>
                                  <p className="text-sm text-black-60 leading-relaxed">{item.description}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
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
    </>
  );
}
