'use client';

import { useMemo, Fragment } from 'react';
import type { Post, PostComponents } from '@/types/admin';
import { StatsGrid } from '@/components/article/StatHighlight';
import { DataTable } from '@/components/article/DataTable';
import { ChartSection } from '@/components/article/ChartSection';
import { MythBuster } from '@/components/article/MythBuster';
import { ComparisonTabs } from '@/components/article/ComparisonTabs';
import { DecisionGuideSection } from '@/components/article/DecisionGuideSection';
import { VideoEmbed } from '@/components/article/VideoEmbed';
import { BeforeAfterSlider } from '@/components/article/BeforeAfterSlider';
import { TimelineSection } from '@/components/article/TimelineSection';
import { FAQSection } from '@/components/article/FAQSection';
import { DynamicCalculator } from '@/components/article/DynamicCalculator';
import { CertificationBadges } from '@/components/article/CertificationBadges';
import { TestimonialCard } from '@/components/article/TestimonialCard';
import { ResourceDownload } from '@/components/article/ResourceDownload';
import { Comparison3DMatrix } from '@/components/article/Comparison3DMatrix';
import { SpecificationSheet } from '@/components/article/SpecificationSheet';
import { ArticleImage } from '@/components/article/ArticleImage';
import { CTA } from '@/components/sections/CTA';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle } from 'lucide-react';

interface RichPostRendererProps {
  post: Post;
  className?: string;
}

/**
 * Placeholder patterns for component intercalation
 * Format: [COMPONENT_TYPE:component-id]
 */
const PLACEHOLDER_PATTERNS = {
  CHART: /\[CHART:([^\]]+)\]/g,
  TABLE: /\[TABLE:([^\]]+)\]/g,
  STATS: /\[STATS:([^\]]+)\]/g,
  CHECKLIST: /\[CHECKLIST:([^\]]+)\]/g,
  MYTHS: /\[MYTHS:([^\]]+)\]/g,
  GALLERY: /\[GALLERY:([^\]]+)\]/g,
  NORMS: /\[NORMS:([^\]]+)\]/g,
  PROCESS: /\[PROCESS:([^\]]+)\]/g,
  COMPARISON: /\[COMPARISON:([^\]]+)\]/g,
  GUIDE: /\[GUIDE:([^\]]+)\]/g,
  // Fase 1: Quick Wins
  VIDEO: /\[VIDEO:([^\]]+)\]/g,
  BEFOREAFTER: /\[BEFOREAFTER:([^\]]+)\]/g,
  TIMELINE: /\[TIMELINE:([^\]]+)\]/g,
  FAQ: /\[FAQ:([^\]]+)\]/g,
  // Fase 2: Engajamento Interativo
  CALCULATOR: /\[CALCULATOR:([^\]]+)\]/g,
  CERTIFICATIONS: /\[CERTIFICATIONS:([^\]]+)\]/g,
  TESTIMONIAL: /\[TESTIMONIAL:([^\]]+)\]/g,
  RESOURCES: /\[RESOURCES:([^\]]+)\]/g,
  // Fase 3: Componentes Avançados
  COMPARISON3D: /\[COMPARISON3D:([^\]]+)\]/g,
  SPECSHEET: /\[SPECSHEET:([^\]]+)\]/g,
  // Imagens Contextuais
  IMAGE: /\[IMAGE:([^\]]+)\]/g,
  // CTAs Customizáveis
  CTA: /\[CTA:([^\]]+)\]/g,
};

/**
 * Identifies and extracts placeholders from markdown content
 * Returns array of content segments with their types (text or component)
 */
function extractPlaceholders(content: string, components: PostComponents | null) {
  if (!components) return [{ type: 'text' as const, content }];

  const segments: Array<{
    type: 'text' | 'component';
    content?: string;
    componentType?: string;
    componentId?: string;
    componentData?: any;
  }> = [];

  let lastIndex = 0;
  const placeholderMatches: Array<{
    index: number;
    match: string;
    type: string;
    id: string;
  }> = [];

  // Find all placeholders in content
  Object.entries(PLACEHOLDER_PATTERNS).forEach(([type, pattern]) => {
    const matches = [...content.matchAll(pattern)];
    matches.forEach((match) => {
      placeholderMatches.push({
        index: match.index!,
        match: match[0],
        type,
        id: match[1],
      });
    });
  });

  // Sort by position in content
  placeholderMatches.sort((a, b) => a.index - b.index);

  // Track which components were used
  const usedComponents = new Set<string>();

  // Split content by placeholders
  placeholderMatches.forEach((placeholder) => {
    // Add text before placeholder
    if (placeholder.index > lastIndex) {
      segments.push({
        type: 'text',
        content: content.substring(lastIndex, placeholder.index),
      });
    }

    // Find matching component
    let componentData = null;
    const { type, id } = placeholder;

    switch (type) {
      case 'CHART':
        componentData = components.charts?.find((c) => c.id === id);
        break;
      case 'TABLE':
        componentData = components.tables?.find((t) => t.id === id);
        break;
      case 'STATS':
        // Stats doesn't have individual IDs in current structure
        componentData = components.stats;
        break;
      case 'CHECKLIST':
        // Checklist is a single object
        componentData = components.checklist;
        break;
      case 'MYTHS':
        componentData = components.myths;
        break;
      case 'GALLERY':
        componentData = components.gallery;
        break;
      case 'NORMS':
        componentData = components.norms;
        break;
      case 'PROCESS':
        componentData = components.process;
        break;
      case 'COMPARISON':
        componentData = components.tabComparisons?.find((c) => c.id === id);
        break;
      case 'GUIDE':
        componentData = components.decisionGuide;
        break;
      // Fase 1: Quick Wins
      case 'VIDEO':
        componentData = components.videos?.find((v) => v.id === id);
        break;
      case 'BEFOREAFTER':
        componentData = components.beforeAfters?.find((b) => b.id === id);
        break;
      case 'TIMELINE':
        componentData = components.timelines?.find((t) => t.id === id);
        break;
      case 'FAQ':
        componentData = components.faqs?.find((f) => f.id === id);
        break;
      // Fase 2: Engajamento Interativo
      case 'CALCULATOR':
        componentData = components.calculators?.find((c) => c.id === id);
        break;
      case 'CERTIFICATIONS':
        componentData = components.certifications?.find((c) => c.id === id);
        break;
      case 'TESTIMONIAL':
        componentData = components.testimonials?.find((t) => t.id === id);
        break;
      case 'RESOURCES':
        componentData = components.resources?.find((r) => r.id === id);
        break;
      // Fase 3: Componentes Avançados
      case 'COMPARISON3D':
        componentData = components.comparison3D?.find((c) => c.id === id);
        break;
      case 'SPECSHEET':
        componentData = components.specSheets?.find((s) => s.id === id);
        break;
      // Imagens Contextuais
      case 'IMAGE':
        componentData = components.images?.find((img) => img.id === id);
        break;
      // CTAs Customizáveis
      case 'CTA':
        componentData = components.ctas?.find((cta) => cta.id === id);
        break;
    }

    if (componentData) {
      segments.push({
        type: 'component',
        componentType: type,
        componentId: id,
        componentData,
      });
      usedComponents.add(`${type}:${id}`);
    }

    lastIndex = placeholder.index + placeholder.match.length;
  });

  // Add remaining text
  if (lastIndex < content.length) {
    segments.push({
      type: 'text',
      content: content.substring(lastIndex),
    });
  }

  return segments;
}

/**
 * Renders markdown content to HTML
 * Simple markdown parser for basic formatting
 */
function renderMarkdown(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-8 mb-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-5">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-12 mb-6">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/gim, '<code class="bg-neutral-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-neutral-900 underline hover:text-neutral-600" target="_blank" rel="noopener noreferrer">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<figure class="my-8"><img src="$2" alt="$1" class="rounded-lg w-full" loading="lazy" /><figcaption class="text-sm text-neutral-500 mt-2 text-center">$1</figcaption></figure>')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-neutral-300 pl-4 my-4 text-neutral-600 italic">$1</blockquote>')
    // Unordered lists
    .replace(/^\s*[-*]\s(.*)$/gim, '<li class="ml-4">$1</li>')
    // Ordered lists
    .replace(/^\s*\d+\.\s(.*)$/gim, '<li class="ml-4 list-decimal">$1</li>')
    // Wrap lists
    .replace(/(<li class="ml-4">.*<\/li>\n?)+/gim, '<ul class="list-disc my-4 space-y-2">$&</ul>')
    .replace(/(<li class="ml-4 list-decimal">.*<\/li>\n?)+/gim, '<ol class="list-decimal my-4 space-y-2">$&</ol>')
    // Paragraphs
    .replace(/\n\n/gim, '</p><p class="mb-4">')
    .replace(/^(.+)$/gim, '<p class="mb-4 leading-relaxed">$1</p>')
    // Clean up empty paragraphs
    .replace(/<p class="mb-4 leading-relaxed"><\/p>/gim, '')
    .replace(/<p class="mb-4 leading-relaxed">(<h[123])/gim, '$1')
    .replace(/(<\/h[123]>)<\/p>/gim, '$1');
}

/**
 * Renders a checklist component
 */
function ChecklistSection({ checklist }: { checklist: NonNullable<PostComponents['checklist']> }) {
  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle>{checklist.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {checklist.items.map((item, index) => (
            <li key={index} className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">{item.label}</span>
                {item.description && (
                  <p className="text-sm text-neutral-600 mt-1">{item.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

/**
 * Renders norms/standards component
 */
function NormsSection({ norms }: { norms: NonNullable<PostComponents['norms']> }) {
  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle>Normas e Certificações</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {norms.map((norm, index) => (
            <AccordionItem key={index} value={`norm-${index}`}>
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    {norm.code}
                  </Badge>
                  <span>{norm.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-neutral-600">{norm.description}</p>
                {norm.year && (
                  <p className="text-sm text-neutral-500 mt-2">Ano: {norm.year}</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

/**
 * Renders process steps component
 */
function ProcessSection({ process }: { process: NonNullable<PostComponents['process']> }) {
  return (
    <div className="my-8 space-y-4">
      <h3 className="text-xl font-semibold mb-6">Processo de Construção</h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-neutral-200" />

        {process.map((step, index) => (
          <RevealOnScroll key={index} delay={index * 0.1}>
            <div className="relative flex gap-6 pb-8">
              {/* Step number */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-lg z-10">
                {step.number}
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-lg">{step.title}</h4>
                  {step.duration && (
                    <Badge variant="secondary">{step.duration}</Badge>
                  )}
                </div>
                <p className="text-neutral-600">{step.description}</p>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}

/**
 * Renders gallery component
 */
function GallerySection({ gallery }: { gallery: NonNullable<PostComponents['gallery']> }) {
  if (!gallery.images || gallery.images.length === 0) return null;

  return (
    <div className="my-8">
      {gallery.title && (
        <h3 className="text-xl font-semibold mb-4">{gallery.title}</h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.images.map((image, index) => (
          <figure key={index} className="relative aspect-video overflow-hidden rounded-lg">
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform hover:scale-105"
              loading="lazy"
            />
            {image.caption && (
              <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white text-sm">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}

/**
 * Renders a single component based on type and data
 */
function renderComponent(type: string, data: any, key: string | number) {
  switch (type) {
    case 'CHART':
      return (
        <RevealOnScroll key={key}>
          <ChartSection chart={data} className="my-8" />
        </RevealOnScroll>
      );
    case 'TABLE':
      return (
        <RevealOnScroll key={key}>
          <DataTable table={data} className="my-8" />
        </RevealOnScroll>
      );
    case 'STATS':
      return (
        <RevealOnScroll key={key}>
          <div className="my-8">
            <StatsGrid stats={data} />
          </div>
        </RevealOnScroll>
      );
    case 'CHECKLIST':
      return (
        <RevealOnScroll key={key}>
          <ChecklistSection checklist={data} />
        </RevealOnScroll>
      );
    case 'MYTHS':
      return (
        <RevealOnScroll key={key}>
          <div className="my-8">
            <h3 className="text-xl font-semibold mb-4">Mitos e Verdades</h3>
            <MythBuster myths={data} variant="cards" />
          </div>
        </RevealOnScroll>
      );
    case 'GALLERY':
      return (
        <RevealOnScroll key={key}>
          <GallerySection gallery={data} />
        </RevealOnScroll>
      );
    case 'NORMS':
      return (
        <RevealOnScroll key={key}>
          <NormsSection norms={data} />
        </RevealOnScroll>
      );
    case 'PROCESS':
      return (
        <RevealOnScroll key={key}>
          <ProcessSection process={data} />
        </RevealOnScroll>
      );
    case 'COMPARISON':
      return (
        <RevealOnScroll key={key}>
          <ComparisonTabs comparison={data} className="my-8" />
        </RevealOnScroll>
      );
    case 'GUIDE':
      return (
        <RevealOnScroll key={key}>
          <DecisionGuideSection guide={data} className="my-8" />
        </RevealOnScroll>
      );
    // Fase 1: Quick Wins
    case 'VIDEO':
      return (
        <RevealOnScroll key={key}>
          <VideoEmbed video={data} className="my-8" />
        </RevealOnScroll>
      );
    case 'BEFOREAFTER':
      return (
        <RevealOnScroll key={key}>
          <BeforeAfterSlider comparison={data} className="my-8" />
        </RevealOnScroll>
      );
    case 'TIMELINE':
      return (
        <RevealOnScroll key={key}>
          <TimelineSection timeline={data} className="my-8" />
        </RevealOnScroll>
      );
    case 'FAQ':
      return (
        <RevealOnScroll key={key}>
          <FAQSection faq={data} className="my-8" />
        </RevealOnScroll>
      );
    // Fase 2: Engajamento Interativo
    case 'CALCULATOR':
      return (
        <RevealOnScroll key={key}>
          <DynamicCalculator calculator={data} className="my-8" />
        </RevealOnScroll>
      );
    case 'CERTIFICATIONS':
      return (
        <RevealOnScroll key={key}>
          <CertificationBadges certifications={data} className="my-8" />
        </RevealOnScroll>
      );
    case 'TESTIMONIAL':
      return (
        <RevealOnScroll key={key}>
          <TestimonialCard testimonial={data} className="my-8" />
        </RevealOnScroll>
      );
    case 'RESOURCES':
      return (
        <RevealOnScroll key={key}>
          <ResourceDownload resources={data} className="my-8" />
        </RevealOnScroll>
      );
    // Fase 3: Componentes Avançados
    case 'COMPARISON3D':
      return (
        <RevealOnScroll key={key}>
          <Comparison3DMatrix matrix={data} className="my-8" />
        </RevealOnScroll>
      );
    case 'SPECSHEET':
      return (
        <RevealOnScroll key={key}>
          <SpecificationSheet specSheet={data} className="my-8" />
        </RevealOnScroll>
      );
    // Imagens Contextuais
    case 'IMAGE':
      return (
        <RevealOnScroll key={key}>
          <ArticleImage image={data} className="my-8" />
        </RevealOnScroll>
      );
    // CTAs Customizáveis
    case 'CTA':
      return (
        <RevealOnScroll key={key}>
          <CTA
            label={data.label}
            title={data.title}
            description={data.description}
            actionType={data.actionType}
            actionText={data.actionText}
            actionHref={data.actionHref}
            defaultSegment={data.defaultSegment}
          />
        </RevealOnScroll>
      );
    default:
      return null;
  }
}

/**
 * Main RichPostRenderer component
 * Renders markdown content with embedded rich components via placeholders
 */
export function RichPostRenderer({ post, className = '' }: RichPostRendererProps) {
  const { content, components } = post;

  // Extract content segments with placeholders
  const segments = useMemo(
    () => extractPlaceholders(content, components || null),
    [content, components]
  );

  // Track which components were used via placeholders
  const usedComponentKeys = useMemo(() => {
    const keys = new Set<string>();
    const types = new Set<string>(); // Track component types used (for single-object components)
    segments.forEach((segment) => {
      if (segment.type === 'component' && segment.componentType && segment.componentId) {
        keys.add(`${segment.componentType}:${segment.componentId}`);
        types.add(segment.componentType); // Track the type was used
      }
    });
    return { keys, types };
  }, [segments]);

  // Check if components exist
  const hasComponents = components && Object.keys(components).length > 0;

  return (
    <article className={`prose prose-neutral max-w-none ${className}`}>
      {/* Render content segments with intercalated components */}
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          const html = renderMarkdown(segment.content || '');
          return (
            <div
              key={`text-${index}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } else if (segment.type === 'component') {
          return (
            <div key={`component-${index}`} className="not-prose">
              {renderComponent(
                segment.componentType!,
                segment.componentData,
                `${segment.componentType}-${segment.componentId}-${index}`
              )}
            </div>
          );
        }
        return null;
      })}

      {/* Fallback: Render unused components at the end */}
      {hasComponents && (
        <div className="not-prose">
          {/* Tables not used via placeholder */}
          {components.tables?.map((table) => {
            if (usedComponentKeys.keys.has(`TABLE:${table.id}`)) return null;
            return (
              <RevealOnScroll key={`fallback-table-${table.id}`}>
                <DataTable table={table} className="my-8" />
              </RevealOnScroll>
            );
          })}

          {/* Charts not used via placeholder */}
          {components.charts?.map((chart) => {
            if (usedComponentKeys.keys.has(`CHART:${chart.id}`)) return null;
            return (
              <RevealOnScroll key={`fallback-chart-${chart.id}`}>
                <ChartSection chart={chart} className="my-8" />
              </RevealOnScroll>
            );
          })}

          {/* Tab Comparisons not used via placeholder */}
          {components.tabComparisons?.map((comparison) => {
            if (usedComponentKeys.keys.has(`COMPARISON:${comparison.id}`)) return null;
            return (
              <RevealOnScroll key={`fallback-comparison-${comparison.id}`}>
                <ComparisonTabs comparison={comparison} className="my-8" />
              </RevealOnScroll>
            );
          })}

          {/* Stats (single object, no ID) */}
          {components.stats && !usedComponentKeys.types.has('STATS') && (
            <RevealOnScroll>
              <div className="my-8">
                <StatsGrid stats={components.stats} />
              </div>
            </RevealOnScroll>
          )}

          {/* Myths (single array, no ID) */}
          {components.myths && !usedComponentKeys.types.has('MYTHS') && (
            <RevealOnScroll>
              <div className="my-8">
                <h3 className="text-xl font-semibold mb-4">Mitos e Verdades</h3>
                <MythBuster myths={components.myths} variant="cards" />
              </div>
            </RevealOnScroll>
          )}

          {/* Decision Guide (single object) */}
          {components.decisionGuide && !usedComponentKeys.types.has('GUIDE') && (
            <RevealOnScroll>
              <DecisionGuideSection guide={components.decisionGuide} className="my-8" />
            </RevealOnScroll>
          )}

          {/* Process (single array) */}
          {components.process && !usedComponentKeys.types.has('PROCESS') && (
            <ProcessSection process={components.process} />
          )}

          {/* Norms (single array) */}
          {components.norms && !usedComponentKeys.types.has('NORMS') && (
            <NormsSection norms={components.norms} />
          )}

          {/* Checklist (single object) */}
          {components.checklist && !usedComponentKeys.types.has('CHECKLIST') && (
            <ChecklistSection checklist={components.checklist} />
          )}

          {/* Gallery (single object) */}
          {components.gallery && !usedComponentKeys.types.has('GALLERY') && (
            <GallerySection gallery={components.gallery} />
          )}

          {/* Fase 1: Quick Wins - Videos not used via placeholder */}
          {components.videos?.map((video) => {
            if (usedComponentKeys.keys.has(`VIDEO:${video.id}`)) return null;
            return (
              <RevealOnScroll key={`fallback-video-${video.id}`}>
                <VideoEmbed video={video} className="my-8" />
              </RevealOnScroll>
            );
          })}

          {/* Fase 1: Before/After Comparisons not used via placeholder */}
          {components.beforeAfters?.map((comparison) => {
            if (usedComponentKeys.keys.has(`BEFOREAFTER:${comparison.id}`)) return null;
            return (
              <RevealOnScroll key={`fallback-beforeafter-${comparison.id}`}>
                <BeforeAfterSlider comparison={comparison} className="my-8" />
              </RevealOnScroll>
            );
          })}

          {/* Fase 1: Timelines not used via placeholder */}
          {components.timelines?.map((timeline) => {
            if (usedComponentKeys.keys.has(`TIMELINE:${timeline.id}`)) return null;
            return (
              <RevealOnScroll key={`fallback-timeline-${timeline.id}`}>
                <TimelineSection timeline={timeline} className="my-8" />
              </RevealOnScroll>
            );
          })}

          {/* Fase 1: FAQs not used via placeholder */}
          {components.faqs?.map((faq) => {
            if (usedComponentKeys.keys.has(`FAQ:${faq.id}`)) return null;
            return (
              <RevealOnScroll key={`fallback-faq-${faq.id}`}>
                <FAQSection faq={faq} className="my-8" />
              </RevealOnScroll>
            );
          })}

          {/* Fase 2: Calculators not used via placeholder */}
          {components.calculators?.map((calculator) => {
            if (usedComponentKeys.keys.has(`CALCULATOR:${calculator.id}`)) return null;
            return (
              <RevealOnScroll key={`fallback-calculator-${calculator.id}`}>
                <DynamicCalculator calculator={calculator} className="my-8" />
              </RevealOnScroll>
            );
          })}

          {/* Fase 2: Certifications not used via placeholder */}
          {components.certifications?.map((cert) => {
            if (usedComponentKeys.keys.has(`CERTIFICATIONS:${cert.id}`)) return null;
            return (
              <RevealOnScroll key={`fallback-cert-${cert.id}`}>
                <CertificationBadges certifications={cert} className="my-8" />
              </RevealOnScroll>
            );
          })}

          {/* Fase 2: Testimonials not used via placeholder */}
          {components.testimonials?.map((testimonial) => {
            if (usedComponentKeys.keys.has(`TESTIMONIAL:${testimonial.id}`)) return null;
            return (
              <RevealOnScroll key={`fallback-testimonial-${testimonial.id}`}>
                <TestimonialCard testimonial={testimonial} className="my-8" />
              </RevealOnScroll>
            );
          })}

          {/* Fase 2: Resources not used via placeholder */}
          {components.resources?.map((resource) => {
            if (usedComponentKeys.keys.has(`RESOURCES:${resource.id}`)) return null;
            return (
              <RevealOnScroll key={`fallback-resource-${resource.id}`}>
                <ResourceDownload resources={resource} className="my-8" />
              </RevealOnScroll>
            );
          })}

          {/* Fase 3: 3D Comparisons not used via placeholder */}
          {components.comparison3D?.map((comparison) => {
            if (usedComponentKeys.keys.has(`COMPARISON3D:${comparison.id}`)) return null;
            return (
              <RevealOnScroll key={`fallback-comparison3d-${comparison.id}`}>
                <Comparison3DMatrix matrix={comparison} className="my-8" />
              </RevealOnScroll>
            );
          })}

          {/* Fase 3: Spec Sheets not used via placeholder */}
          {components.specSheets?.map((specSheet) => {
            if (usedComponentKeys.keys.has(`SPECSHEET:${specSheet.id}`)) return null;
            return (
              <RevealOnScroll key={`fallback-specsheet-${specSheet.id}`}>
                <SpecificationSheet specSheet={specSheet} className="my-8" />
              </RevealOnScroll>
            );
          })}

          {/* Images not used via placeholder */}
          {components.images?.map((image) => {
            if (usedComponentKeys.keys.has(`IMAGE:${image.id}`)) return null;
            return (
              <RevealOnScroll key={`fallback-image-${image.id}`}>
                <ArticleImage image={image} className="my-8" />
              </RevealOnScroll>
            );
          })}
        </div>
      )}
    </article>
  );
}

export default RichPostRenderer;
