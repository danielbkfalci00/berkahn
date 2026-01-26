'use client';

import { useMemo } from 'react';
import type { Post, PostComponents } from '@/types/admin';
import { StatsGrid } from '@/components/article/StatHighlight';
import { DataTable } from '@/components/article/DataTable';
import { ChartSection } from '@/components/article/ChartSection';
import { MythBuster } from '@/components/article/MythBuster';
import { ComparisonTabs } from '@/components/article/ComparisonTabs';
import { DecisionGuideSection } from '@/components/article/DecisionGuideSection';
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
 * Main RichPostRenderer component
 * Renders markdown content with embedded rich components
 */
export function RichPostRenderer({ post, className = '' }: RichPostRendererProps) {
  const { content, components } = post;

  // Parse markdown to HTML
  const htmlContent = useMemo(() => renderMarkdown(content), [content]);

  // Check if components exist and have data
  const hasComponents = components && Object.keys(components).length > 0;

  return (
    <article className={`prose prose-neutral max-w-none ${className}`}>
      {/* Main markdown content */}
      <div
        className="mb-8"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Rich components */}
      {hasComponents && (
        <div className="not-prose">
          {/* Stats Grid */}
          {components.stats && components.stats.length > 0 && (
            <RevealOnScroll>
              <div className="my-8">
                <StatsGrid stats={components.stats} />
              </div>
            </RevealOnScroll>
          )}

          {/* Data Tables */}
          {components.tables?.map((table) => (
            <RevealOnScroll key={table.id}>
              <DataTable table={table} className="my-8" />
            </RevealOnScroll>
          ))}

          {/* Charts */}
          {components.charts?.map((chart) => (
            <RevealOnScroll key={chart.id}>
              <ChartSection chart={chart} className="my-8" />
            </RevealOnScroll>
          ))}

          {/* Myths */}
          {components.myths && components.myths.length > 0 && (
            <RevealOnScroll>
              <div className="my-8">
                <h3 className="text-xl font-semibold mb-4">Mitos e Verdades</h3>
                <MythBuster myths={components.myths} variant="cards" />
              </div>
            </RevealOnScroll>
          )}

          {/* Tab Comparisons */}
          {components.tabComparisons?.map((comparison) => (
            <RevealOnScroll key={comparison.id}>
              <ComparisonTabs comparison={comparison} className="my-8" />
            </RevealOnScroll>
          ))}

          {/* Decision Guide */}
          {components.decisionGuide && (
            <RevealOnScroll>
              <DecisionGuideSection guide={components.decisionGuide} className="my-8" />
            </RevealOnScroll>
          )}

          {/* Process Steps */}
          {components.process && components.process.length > 0 && (
            <ProcessSection process={components.process} />
          )}

          {/* Norms */}
          {components.norms && components.norms.length > 0 && (
            <NormsSection norms={components.norms} />
          )}

          {/* Checklist */}
          {components.checklist && (
            <ChecklistSection checklist={components.checklist} />
          )}

          {/* Gallery */}
          {components.gallery && (
            <GallerySection gallery={components.gallery} />
          )}
        </div>
      )}
    </article>
  );
}

export default RichPostRenderer;
