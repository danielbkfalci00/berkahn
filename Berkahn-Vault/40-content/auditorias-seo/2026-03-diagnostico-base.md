---
tipo: auditoria
criado: 2026-03-19
atualizado: 2026-05-22
tags:
  - project/site
  - project/blog
  - status/active
  - source/manual
ai_summary: Diagnóstico SEO+AEO inicial março 2026 — score teórico 74/100 (substituído por v2 com dados reais GSC = 52/100). Auditoria de código + best practices 2026. Análise técnica de schemas, metadata, AEO.
status: active
projeto: seo-aeo
kpi_score_teorico: 74
projetos_relacionados:
  - seo-aeo
  - blog
  - site
data_diagnostico: 2026-03-19
substituido_por: 2026-04-diagnostico-integrado
---

> Migrado de `Docs/SEO & AEO/diagnostico-seo-aeo-berkahn.md` em 2026-05-22 (Sprint 1.6). Versão anterior — superada por [[2026-04-diagnostico-integrado]]. Hub: [[seo-aeo]].

# Diagnóstico SEO & AEO — berkahn.com.br

**Data**: 19/03/2026
**Escopo**: Auditoria completa de SEO técnico + AEO (Answer Engine Optimization)
**Método**: Análise de código + pesquisa externa de melhores práticas 2026

---

## Score Atual por Área

| Área | Score | Status |
|------|-------|--------|
| Metadata & Head Tags | 85% | Bom — 2 páginas sem metadata |
| Structured Data (Schema.org) | 70% | Regular — faltam schemas importantes |
| Sitemap & Robots | 95% | Excelente |
| SEO Técnico | 80% | Bom — faltam otimizações de performance |
| Blog/Artigos SEO | 75% | Bom — faltam sinais de AEO |
| Performance (Core Web Vitals) | 65% | Regular — sem monitoramento |
| Internal Linking | 70% | Regular — pode ser mais estratégico |
| AEO (Citação por IA) | 55% | Fraco — maior oportunidade de melhoria |
| E-E-A-T (Autoridade) | 70% | Bom — faltam credenciais profissionais |

**Score geral: 74/100** — Base sólida com oportunidades significativas em AEO.

---

## O que já está bem feito

Antes dos problemas, é importante reconhecer o que funciona:

- Sitemap dinâmico com artigos do Supabase (`app/sitemap.ts`)
- Robots.txt bloqueia crawlers de IA indesejados (CCBot) (`app/robots.ts`)
- Schema Organization + WebSite no layout global (`app/layout.tsx:94-151`)
- Schema BlogPosting completo nos artigos (`app/atualidades/[slug]/page.tsx:193-217`)
- Schema FAQPage na página de FAQ e na página LSF
- Schema BreadcrumbList em todas as páginas com breadcrumb (`components/layout/Breadcrumb.tsx:68-79`)
- Schema Service nas páginas residencial e comercial
- ISR configurado (revalidate 60s) nos artigos
- Font loading otimizado com `display: swap`
- Code splitting com dynamic imports nos componentes pesados
- Image optimization com Next.js Image (WebP, lazy loading, priority)
- GA4 configurado
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Cookie consent implementado
- Redirects 301 para URLs legadas

---

## Problemas Identificados

### PROBLEMA 1: Metadata ausente em 2 páginas
**Prioridade: P0 (Crítico)** | **Complexidade: Baixa (30 min)**

**Impacto**: Páginas sem metadata aparecem no Google com título/descrição genéricos. Reduz CTR e impede o Google de entender o conteúdo.

**Estado atual**:
- `app/servicos/page.tsx` — **NÃO TEM** export de metadata
- `app/portfolio/page.tsx` — **NÃO TEM** export de metadata
- Todas as outras páginas públicas têm metadata completo

**Ação**:
Adicionar `export const metadata: Metadata = { ... }` em ambas as páginas, seguindo o padrão de `app/empresa/page.tsx:14-35` que já está implementado. Incluir: title, description, keywords, openGraph, twitter.

**Referência**: Todas as outras páginas usam o padrão corretamente (ex: `app/lsf/page.tsx:12-33`, `app/residencial/page.tsx:36-57`).

---

### PROBLEMA 2: Canonical URLs explícitas não configuradas
**Prioridade: P1 (Alto)** | **Complexidade: Baixa (20 min)**

**Impacto**: Sem canonical explícito, o Google pode indexar versões duplicadas da mesma página (com/sem trailing slash, com query params). O Next.js infere via `metadataBase`, mas não é suficiente.

**Estado atual**:
- `app/layout.tsx:39` define `metadataBase: new URL("https://www.berkahn.com.br")` — isso ajuda mas não garante canonical em cada página
- Nenhuma página tem `alternates.canonical` explícito

**Ação**:
Adicionar `alternates: { canonical: "/pagina" }` em cada página. Next.js combina com `metadataBase` automaticamente. Exemplo:
```typescript
export const metadata: Metadata = {
  // ... existing metadata
  alternates: {
    canonical: "/servicos",
  },
};
```

**Referência**: [Next.js Metadata API — alternates](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#alternates)

---

### PROBLEMA 3: Preconnect/DNS-prefetch ausente para domínios externos
**Prioridade: P1 (Alto)** | **Complexidade: Baixa (15 min)**

**Impacto**: O browser espera até precisar do recurso para resolver DNS e abrir conexão com domínios externos. Preconnect antecipa isso, reduzindo latência em 100-300ms por domínio. Afeta Core Web Vitals (LCP).

**Estado atual**:
- Nenhum `<link rel="preconnect">` ou `<link rel="dns-prefetch">` no código
- Domínios externos usados: `sfqaknxomxwmviarpwfy.supabase.co`, `www.googletagmanager.com`, `images.unsplash.com`

**Ação**:
Adicionar no `app/layout.tsx` dentro do `<head>` (via metadata API ou `<head>` direto):
```html
<link rel="preconnect" href="https://sfqaknxomxwmviarpwfy.supabase.co" />
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="dns-prefetch" href="https://images.unsplash.com" />
```

**Referência**: [Web.dev — Preconnect](https://web.dev/articles/preconnect-and-dns-prefetch)

---

### PROBLEMA 4: Schema LocalBusiness ausente
**Prioridade: P1 (Alto)** | **Complexidade: Média (45 min)**

**Impacto**: O Google usa LocalBusiness para exibir painel lateral com endereço, horário, telefone, reviews. Sem ele, a Berkahn não aparece como negócio local no Google Maps nem no Knowledge Panel. Construtoras são buscas essencialmente locais.

**Estado atual**:
- `app/layout.tsx:99-138` tem `Organization` + `GeneralContractor` com address, geo, telefone
- Mas **NÃO TEM** `LocalBusiness` (que herda de Organization mas adiciona features locais)

**Ação**:
Alterar o `@type` de `["Organization", "GeneralContractor"]` para `["LocalBusiness", "GeneralContractor"]` e adicionar campos:
- `areaServed` (São Paulo, Grande SP)
- `hasOfferCatalog` (lista de serviços)
- `aggregateRating` (quando tiver reviews)
- `paymentAccepted`
- `currenciesAccepted: "BRL"`

**Arquivo**: `app/layout.tsx:99`

---

### PROBLEMA 5: Schema Service/Offer ausente nas páginas de serviço
**Prioridade: P1 (Alto)** | **Complexidade: Média (1h)**

**Impacto**: Páginas com schema Service + Offer aparecem nos AI Overviews do Google quando usuários pesquisam "construtora steel frame preço" ou "construção steel frame SP". Conteúdo com schema tem 2.5x mais chance de aparecer em respostas de IA (BrightEdge 2026).

**Estado atual**:
- `app/residencial/page.tsx:63-79` e `app/comercial-industrial/page.tsx:63-79` têm schema Service básico
- Faltam: `Offer` com `priceRange`, `areaServed`, `serviceType` detalhado

**Ação**:
Expandir os schemas Service existentes com:
```json
{
  "@type": "Service",
  "serviceType": "Construção Residencial em Steel Frame",
  "areaServed": { "@type": "City", "name": "São Paulo" },
  "provider": { "@id": "https://www.berkahn.com.br/#organization" },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": "Projeto e Construção Residencial" },
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "priceCurrency": "BRL",
          "unitText": "m²"
        }
      }
    ]
  }
}
```

**Arquivos**: `app/residencial/page.tsx:63-79`, `app/comercial-industrial/page.tsx:63-79`

---

### PROBLEMA 6: Artigos sem "answer paragraph" no topo (AEO)
**Prioridade: P1 (Alto)** | **Complexidade: Média (editorial + código)**

**Impacto**: **Este é o problema mais importante para AEO.** IAs extraem os primeiros 1-2 parágrafos de cada seção para determinar se o conteúdo responde à pergunta. Artigos que "enrolam" no início (ex: "Neste artigo, vamos explorar...") nunca são citados. Páginas com FAQPage schema + respostas diretas têm 3.1x mais extração por answer engines (Frase.io 2026).

**Estado atual**:
- Artigos começam com hero + excerpt genérico
- Não há "resumo executivo" ou resposta direta no topo
- O `RichPostRenderer` (`components/blog/RichPostRenderer.tsx`) processa markdown mas não tem conceito de "answer block"

**Ação (código)**:
Adicionar campo `answer_summary` na tabela `posts` do Supabase (texto de 2-3 frases com a resposta direta). Renderizar como primeiro elemento do artigo com destaque visual e schema `mainEntity.acceptedAnswer`.

**Ação (editorial)**:
Para cada artigo existente, escrever um parágrafo de resposta direta. Exemplo:
> **Ruim**: "Neste artigo, vamos analisar os custos do Steel Frame em 2026..."
> **Bom**: "O custo médio do Steel Frame em 2026 é de R$ 2.800 a R$ 4.500/m² para projetos residenciais na Grande SP. Veja a tabela completa com preços por tipo de acabamento."

**Referência**: 83% das citações de IA vêm de páginas atualizadas nos últimos 12 meses (AirOps Research 2026).

---

### PROBLEMA 7: Verificação Google Search Console / Bing ausente
**Prioridade: P1 (Alto)** | **Complexidade: Baixa (15 min)**

**Impacto**: Sem verificação, não é possível: monitorar indexação, solicitar reindex, ver queries de busca, identificar erros de crawl, enviar sitemap manualmente. É o pré-requisito para qualquer trabalho de SEO.

**Estado atual**:
- Nenhuma meta tag de verificação no código
- GA4 está configurado (`app/layout.tsx:154-165`) mas Search Console é independente

**Ação**:
1. Criar conta no [Google Search Console](https://search.google.com/search-console)
2. Verificar propriedade via meta tag HTML
3. Adicionar meta tag em `app/layout.tsx` via metadata API:
   ```typescript
   verification: {
     google: "CÓDIGO_DO_GSC",
     other: { "msvalidate.01": "CÓDIGO_BING" },
   },
   ```
4. Enviar sitemap: `https://www.berkahn.com.br/sitemap.xml`

---

### PROBLEMA 8: Author schema sem credenciais profissionais
**Prioridade: P2 (Médio)** | **Complexidade: Baixa (30 min)**

**Impacto**: Para conteúdo YMYL (Your Money Your Life) — que inclui construção civil — o Google exige sinais fortes de E-E-A-T. Autores com credenciais verificáveis (CREA, CAU) têm prioridade. IAs citam preferencialmente conteúdo de especialistas identificados.

**Estado atual**:
- `components/article/AuthorBio.tsx:11-26` define 2 autores com nome, role, bio, LinkedIn
- Schema Person inclui `name`, `jobTitle`, `description`, `worksFor` (linhas 67-80)
- **Faltam**: `hasCredential`, `alumniOf`, `sameAs` com perfis profissionais

**Ação**:
Expandir o schema Person no AuthorBio:
```json
{
  "@type": "Person",
  "name": "Daniel Falci",
  "jobTitle": "Engenheiro Civil",
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "Professional License",
    "name": "CREA-SP XXXXXX"
  },
  "alumniOf": { "@type": "CollegeOrUniversity", "name": "Nome da Universidade" },
  "sameAs": ["https://linkedin.com/in/danielfalci"]
}
```

**Arquivo**: `components/article/AuthorBio.tsx:67-80`

---

### PROBLEMA 9: SearchAction ausente no WebSite schema
**Prioridade: P2 (Médio)** | **Complexidade: Baixa (20 min)**

**Impacto**: O SearchAction no schema WebSite permite que o Google exiba uma caixa de busca diretamente nos resultados (sitelinks search box). Também ajuda IAs a descobrirem que o site tem busca interna.

**Estado atual**:
- `app/layout.tsx:140-148` tem schema WebSite mas sem `potentialAction`
- O site TEM busca na FAQ (`components/faq/FAQSearch.tsx`) mas não está declarada no schema

**Ação**:
Adicionar SearchAction ao WebSite schema:
```json
{
  "@type": "WebSite",
  "url": "https://www.berkahn.com.br",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.berkahn.com.br/perguntas-frequentes?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

**Arquivo**: `app/layout.tsx:140-148`

---

### PROBLEMA 10: Schema HowTo ausente (processo construtivo)
**Prioridade: P2 (Médio)** | **Complexidade: Média (1h)**

**Impacto**: HowTo schema é um dos tipos mais citados em AI Overviews para buscas como "como construir em steel frame" ou "etapas construção steel frame". O Google extrai steps diretamente. Sem HowTo, o conteúdo é tratado como texto genérico.

**Estado atual**:
- A página residencial tem seção de "processo construtivo" com timeline
- O artigo "Passo a Passo" cobre o tema em detalhe
- **Nenhum** tem schema HowTo

**Ação**:
Adicionar schema HowTo na página residencial (seção processo) e no artigo passo-a-passo:
```json
{
  "@type": "HowTo",
  "name": "Como construir uma casa em Steel Frame",
  "step": [
    { "@type": "HowToStep", "name": "Projeto Arquitetônico", "text": "..." },
    { "@type": "HowToStep", "name": "Fundação", "text": "..." },
    { "@type": "HowToStep", "name": "Montagem da Estrutura", "text": "..." }
  ],
  "estimatedCost": { "@type": "MonetaryAmount", "currency": "BRL", "value": "2800-4500/m²" },
  "totalTime": "PT120D"
}
```

**Arquivos**: `app/residencial/page.tsx`, `app/atualidades/[slug]/page.tsx`

---

### PROBLEMA 11: Internal linking fraco nos artigos
**Prioridade: P2 (Médio)** | **Complexidade: Média (editorial + código)**

**Impacto**: Artigos que linkam para páginas de serviço e outros artigos criam "topic clusters" — o sinal mais forte de autoridade tópica para IAs. Sites com clusters completos são citados como fonte primária vs. artigos isolados.

**Estado atual**:
- `components/article/RelatedArticlesCarousel.tsx` mostra artigos relacionados no footer — bom
- CTAs internos existem (`components/sections/CTA.tsx`)
- **Faltam**: links contextuais DENTRO do texto dos artigos (ex: "saiba mais sobre [construção residencial em Steel Frame](/residencial)")

**Ação**:
1. Adicionar campo `related_services` na tabela posts (array de slugs de páginas)
2. No `RichPostRenderer`, criar componente `[LINK:servico]` que renderiza link contextual
3. Para artigos existentes, adicionar links manualmente no conteúdo markdown

---

### PROBLEMA 12: Core Web Vitals sem monitoramento
**Prioridade: P2 (Médio)** | **Complexidade: Baixa (15 min)**

**Impacto**: Core Web Vitals (LCP, CLS, INP) são fator de ranking confirmado. Sem monitoramento, problemas de performance passam despercebidos. O Google penaliza páginas lentas especialmente em mobile.

**Estado atual**:
- Nenhum script de Speed Insights ou Web Vitals no código
- GA4 coleta CWV básico mas sem dashboard dedicado

**Ação**:
Instalar `@vercel/speed-insights` (já hospedado na Vercel):
```bash
npm install @vercel/speed-insights
```
Adicionar no `app/layout.tsx`:
```tsx
import { SpeedInsights } from "@vercel/speed-insights/next";
// ... dentro do body:
<SpeedInsights />
```

Alternativa: instalar `web-vitals` e enviar para GA4.

---

### PROBLEMA 13: Open Graph article tags ausentes
**Prioridade: P2 (Médio)** | **Complexidade: Baixa (30 min)**

**Impacto**: Sem `article:published_time`, `article:author`, `article:section` nos OG tags, redes sociais e IAs não conseguem classificar o conteúdo como artigo com data e autoria. Reduz a qualidade do preview ao compartilhar.

**Estado atual**:
- `app/atualidades/[slug]/page.tsx:70-125` tem `generateMetadata()` com openGraph básico
- Faltam: `article:published_time`, `article:modified_time`, `article:author`, `article:section`, `article:tag`

**Ação**:
Expandir o `openGraph` retornado por `generateMetadata()`:
```typescript
openGraph: {
  type: "article",
  publishedTime: post.published_at,
  modifiedTime: post.updated_at,
  authors: [post.author],
  section: post.category,
  tags: post.tags,
  // ... existing fields
}
```

**Arquivo**: `app/atualidades/[slug]/page.tsx:100-120`

---

### PROBLEMA 14: Topic clusters incompletos
**Prioridade: P3 (Nice-to-have)** | **Complexidade: Alta (editorial)**

**Impacto**: IAs favorecem sites com "cobertura completa" de um tópico. Um cluster ideal tem: 1 pillar page + 5-10 artigos de suporte interligados. A Berkahn tem artigos isolados sem estrutura de cluster explícita.

**Estado atual**:
- 20 artigos no Supabase, categorizados (GUIA, ANÁLISE, SEGURANÇA, TECNOLOGIA, etc.)
- Sem pillar pages explícitas
- Sem interligação sistemática entre artigos do mesmo cluster

**Ação** (editorial, não código):
1. Definir 3-4 clusters: "Custos Steel Frame", "Steel Frame vs. Alternativas", "Processo Construtivo", "Normas e Certificações"
2. Criar pillar page para cada cluster (artigo longo e abrangente)
3. Interligar todos os artigos do cluster com links internos bidirecionais
4. Adicionar "Leia também" sections nos artigos existentes

---

### PROBLEMA 15: PWA Manifest ausente
**Prioridade: P3 (Nice-to-have)** | **Complexidade: Baixa (30 min)**

**Impacto**: Um manifest.json permite que o site seja instalável como app no celular. Melhora o Lighthouse score e pode melhorar o engajamento repeat. Baixo impacto direto em SEO mas sinal de qualidade.

**Estado atual**:
- Nenhum `manifest.json` ou `manifest.webmanifest` encontrado
- Nenhum `<link rel="manifest">` no código

**Ação**:
Criar `public/manifest.json` com nome, ícones, cores, e display mode. Adicionar link no layout.

---

## Roadmap de Ataque (Ordem Recomendada)

### Sprint 1 — Quick Wins (1 sessão, ~2h)
| # | Problema | Tempo |
|---|----------|-------|
| 1 | Metadata em servicos + portfolio | 30 min |
| 2 | Canonical URLs em todas as páginas | 20 min |
| 3 | Preconnect/DNS-prefetch | 15 min |
| 7 | Verificação Google Search Console | 15 min |
| 12 | Speed Insights | 15 min |
| 13 | OG article tags | 30 min |

### Sprint 2 — Schema Markup (1 sessão, ~2.5h)
| # | Problema | Tempo |
|---|----------|-------|
| 4 | LocalBusiness schema | 45 min |
| 5 | Service/Offer schema expandido | 1h |
| 9 | SearchAction no WebSite | 20 min |
| 10 | HowTo schema | 30 min |

### Sprint 3 — AEO & Autoridade (1 sessão, ~2h)
| # | Problema | Tempo |
|---|----------|-------|
| 8 | Author credenciais (CREA) | 30 min |
| 6 | Answer paragraphs (campo + código) | 1h |
| 11 | Internal linking framework | 30 min |

### Sprint 4 — Conteúdo (ongoing, editorial)
| # | Problema | Tempo |
|---|----------|-------|
| 6 | Escrever answer paragraphs para 20 artigos | 2-3h |
| 11 | Adicionar links contextuais nos artigos | 2-3h |
| 14 | Estruturar topic clusters | 4-6h |

### Sprint 5 — Nice-to-have
| # | Problema | Tempo |
|---|----------|-------|
| 15 | PWA Manifest | 30 min |

---

## Fontes e Referências

### AEO / Answer Engine Optimization
- [Frase.io — Complete AEO Guide 2026](https://www.frase.io/blog/what-is-answer-engine-optimization-the-complete-guide-to-getting-cited-by-ai) — FAQPage schema = 3.1x mais extração por IAs; headings sequenciais = 2.8x mais citação
- [AirOps — AEO: How To Optimize Content](https://www.airops.com/blog/aeo-answer-engine-optimization) — 83% das citações de IA vêm de páginas atualizadas nos últimos 12 meses
- [DOJO AI — Complete 2026 AEO Guide](https://www.dojoai.com/blog/answer-engine-optimization-aeo-guide-dynamic-ai-seo) — Framework de 6 áreas: content structure, answer formatting, citation quality, schema, entity recognition, topical authority
- [Evergreen Media — AEO: AI visibility in 2026](https://www.evergreen.media/en/guide/answer-engine-optimization/) — IAs extraem primeiros 1-2 parágrafos de cada seção

### Google AI Overviews & Schema
- [Stackmatix — Structured Data for AI Search 2026](https://www.stackmatix.com/blog/structured-data-ai-search) — Conteúdo com schema tem 2.5x mais chance de aparecer em AI Overviews
- [SearchEngineLand — Schema and AI Overviews](https://searchengineland.com/schema-ai-overviews-structured-data-visibility-462353) — FAQ, HowTo, Article, Organization são os schemas mais eficazes
- [Koanthic — Google AI Overviews Optimization 2026](https://koanthic.com/en/google-ai-overviews-optimization-complete-guide-2026/) — AI summaries aparecem em 50%+ das buscas

### Next.js SEO Técnico
- [Vercel — Next.js SEO Playbook](https://vercel.com/blog/nextjs-seo-playbook) — ISR é a arquitetura preferida para SEO em 2026
- [Next.js Official — SEO Guide](https://nextjs.org/learn/seo) — Metadata API, sitemap, robots best practices
- [The HOTH — Technical SEO Checklist 2026](https://www.thehoth.com/blog/seo-technical-checklist/) — Checklist completo de SEO técnico

### Dados de Mercado
- IAs geraram 1.13 bilhão de visitas referral em junho 2025 — aumento de 357% YoY
- BrightEdge 2026: páginas com structured data recebem 30% mais cliques
- Google AI Overviews aparecem em 48%+ das consultas (dados P-10 pesquisa Brada)
