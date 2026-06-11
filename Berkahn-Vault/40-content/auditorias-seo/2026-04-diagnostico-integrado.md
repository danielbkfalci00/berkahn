---
tipo: auditoria
criado: 2026-04-13
atualizado: 2026-05-22
tags:
  - project/site
  - project/blog
  - status/active
  - source/manual
ai_summary: Diagnóstico SEO+AEO integrado abril 2026 — score real 52/100 (vs 74 anterior teórico). Indexação CRÍTICA 6/44 (14%). 9 posts sem meta_title, 3 sem answer_summary, bug SearchAction, 12 categorias fragmentadas. Roadmap P0/P1/P2 com 20+ ações executáveis.
status: active
projeto: seo-aeo
kpi_posts_sem_answer_summary: 3
kpi_score: 52
kpi_paginas_indexadas: 6
kpi_paginas_total: 44
kpi_posts_sem_meta_title: 9
projetos_relacionados:
  - seo-aeo
  - blog
  - site
data_diagnostico: 2026-04-13
substitui: 2026-03-diagnostico-base
---

> Migrado de `Docs/SEO & AEO/diagnostico-integrado-v2.md` em 2026-05-22 (Sprint 1.6 reorganização vault). Hub: [[seo-aeo]]. Substitui [[2026-03-diagnostico-base]].

# Diagnóstico Integrado SEO + AEO — Berkahn Steel Frame

**Data:** 13 de abril de 2026
**URL:** https://www.berkahn.com.br
**Stack:** Next.js 15 (App Router) + Supabase + Vercel
**Domínio ativo desde:** ~Janeiro 2026 (~3 meses)

---

## 1. Executive Summary

### Score Geral: 52/100

> O diagnóstico anterior (19/03/2026) estimou 74/100. Esse score era baseado na qualidade do **código** — schemas, metadata, componentes. Com os dados reais do Google Search Console, a realidade é outra: **86% do site não está indexado** e o tráfego orgânico é quase zero.

### A verdade em números

| Métrica | Valor | Contexto |
|---------|-------|----------|
| Páginas indexadas | **6 de 44** | 14% de indexação (meta: >90%) |
| Blog posts indexados | **1 de 23** | Apenas `steel-frame-no-mundo` |
| Queries com cliques | **7** | Todas branded ("berkahn"), zero informacionais |
| Cliques orgânicos (90d) | **41** | Praticamente todo o tráfego é busca direta pela marca |
| CWV field data | **Insuficiente** | Tráfego real abaixo do threshold do CrUX |
| Posts com `answer_summary` | **20/23** (86%) | Bom, mas inútil sem indexação |
| Posts com `meta_title` | **14/23** (60%) | 9 posts antigos sem SEO title |

### Top 5 Problemas Reais (por impacto)

1. **INDEXAÇÃO: 31 páginas "detectada mas não indexada" — Google nunca rastreou o conteúdo.** Sem isso, NADA funciona.
2. **AUTORIDADE: Domínio novo (~3 meses) sem backlinks nem menções externas.** Google não confia no site.
3. **METADATA INCOMPLETA: 9/23 posts sem `meta_title` / `meta_description`.** Mesmo se indexados, apareceriam com title genérico no SERP.
4. **FRAGMENTAÇÃO DE CATEGORIAS: 12 categorias para 23 posts** — impossibilita topic clusters e confunde a hierarquia temática.
5. **AEO BLOQUEADO PELA INDEXAÇÃO:** `answer_summary` existe em 86% dos posts, schemas estão implementados, mas IAs que usam Google Search (ChatGPT, Perplexity) não encontram o conteúdo porque não está indexado.

### Top 5 Conquistas Já Realizadas

1. **Código SEO técnico sólido:** metadata em todas as páginas, canonicals explícitos, OpenGraph + Twitter completos
2. **Schema.org extensivo:** `@graph` com LocalBusiness + GeneralContractor + WebSite + SearchAction + BlogPosting + FAQPage + Service + HowTo + BreadcrumbList
3. **Infraestrutura AEO pronta:** campo `answer_summary` + componente AnswerSummary + AuthorBio com CREA + 19 tipos de placeholder no RichPostRenderer
4. **Sitemap dinâmico:** puxa posts Supabase + legacy + projetos com deduplicação
5. **Performance base:** ISR 60s, code splitting, lazy loading below-fold, font swap, preconnect, LCP preload, Speed Insights ativo

---

## 2. Reconciliação do Diagnóstico Anterior (19/03/2026)

O diagnóstico anterior listou 15 problemas. Comparação com o código atual:

### Itens Resolvidos (11/15)

| # | Problema | Evidência de Resolução |
|---|----------|----------------------|
| 1 | Metadata falta em /servicos e /portfolio | `app/servicos/page.tsx:25` e `app/portfolio/page.tsx` — metadata completa com OG, Twitter, canonical |
| 2 | Canonical URLs explícitas | Todas as páginas com `alternates: { canonical: "..." }` |
| 3 | Preconnect/DNS-prefetch | `app/layout.tsx:91-93` — Supabase, GTM, Unsplash |
| 4 | LocalBusiness schema | `app/layout.tsx:104-182` — LocalBusiness + GeneralContractor com geo, areaServed, openingHours |
| 5 | Service/Offer expandido | `app/residencial/page.tsx:64-103` e `app/comercial-industrial/page.tsx:64-80` — Service + OfferCatalog |
| 6 | Answer paragraphs (campo + componente) | `answer_summary` no Post type + AnswerSummary em `app/atualidades/[slug]/page.tsx:228-230` |
| 8 | Author schema com CREA | `components/article/AuthorBio.tsx:81-100` — hasCredential, sameAs, jobTitle, alumniOf |
| 9 | SearchAction | `app/layout.tsx:167-179` — WebSite + SearchAction apontando para /perguntas-frequentes |
| 10 | HowTo schema | `app/servicos/page.tsx:77-80` |
| 12 | Speed Insights | `app/layout.tsx:197` — Vercel SpeedInsights ativo |
| 15 | PWA Manifest | `public/manifest.json` completo com icons, lang pt-BR, categories |

### Itens Parcialmente Resolvidos (3/15)

| # | Problema | Estado | O que falta |
|---|----------|--------|------------|
| 11 | Internal linking contextual | ⚠️ Parcial | `RelatedArticlesCarousel` existe para legacy articles (`components/article/RelatedArticlesCarousel.tsx:1-88`) mas **NÃO está integrado** no `RichPostRenderer` (posts Supabase). O `[SERVICELINK:slug]` existe para links de serviço, mas não há linking cruzado entre artigos. |
| 13 | OG article tags | ✅ Código OK, ⚠️ dados incompletos | `app/atualidades/[slug]/page.tsx:85-90` tem `type: "article"`, publishedTime, authors, section, tags. **MAS** depende dos dados do Supabase: 9 posts sem meta_title e 1 post sem tags. |
| 14 | Topic clusters | ⚠️ Parcial | Campos `category` e `tags` existem. Mas: (a) categorias fragmentadas (12 para 23 posts), (b) nenhuma pillar page 3K+ palavras, (c) sem linking estruturado cluster→pillar. |

### Item Aberto (1/15)

| # | Problema | Estado | Impacto |
|---|----------|--------|---------|
| 7 | Google Search Console verification tags | ❌ Aberto | Nenhuma tag de verificação em `app/layout.tsx` metadata, nenhum arquivo `google*.html` em `public/`. **NOTA:** O GSC aparenta estar verificado (Bruno confirmou e dados existem), provavelmente via DNS ou upload de arquivo no servidor. Não é bloqueador de indexação, mas vale adicionar a tag HTML como backup. |

### Problemas Novos Identificados

| # | Problema | Severidade | Detalhe |
|---|----------|-----------|---------|
| N1 | hreflang pt-BR auto-referencial ausente | Baixa | Nenhuma página tem `alternates.languages` — benefício marginal para site monolíngue mas é best practice |
| N3 | robots.ts — controle granular de AI bots | Média | `app/robots.ts:13-14` só bloqueia CCBot. Faltam: GPTBot, ClaudeBot, Google-Extended (training). Faltam permitir explicitamente: OAI-SearchBot, Claude-SearchBot, PerplexityBot (search) |
| N4 | Sitemap sem lastModified em static pages | Baixa | `app/sitemap.ts:10-22` — apenas homepage tem `lastModified`. As outras 10 static pages não têm data |
| N6 | `updated_at` artificial em todos os posts | Média | Todos os 23 posts mostram `updated_at = 2026-03-23` (bulk update). Sinal de freshness falso que pode ser penalizado se Google detectar |
| N7 | 1 post sem `published_at` | Média | `quanto-custa-construir-steel-frame-precos-m2-2026` tem `published_at = NULL`. Possível draft exposto publicamente |
| N8 | SearchAction gerando URL crawlável inválida | Média | `/perguntas-frequentes?q={search_term_string}` aparece no GSC como "rastreada mas não indexada". Google está tentando crawlar o placeholder literal do schema |

---

## 3. Google Search Console — Snapshot Completo (Abril 2026)

### 3.1 Indexação

**Resumo: 6 indexadas / 38 não indexadas**

#### Páginas Indexadas (6)

| URL | Último rastreamento |
|-----|-------------------|
| `/` (home) | 6 abr 2026 |
| `/atualidades` (listagem) | 9 abr 2026 |
| `/perguntas-frequentes` | 9 abr 2026 |
| `/atualidades/steel-frame-no-mundo` | 6 abr 2026 |
| `/empresa` | 1 abr 2026 |
| `/atualidade` (redirect → /atualidades) | 23 fev 2026 |

**Observação:** Apenas **1 de 23 posts** está indexado (`steel-frame-no-mundo`, publicado 05/04/2026 — o mais recente). As 5 páginas de serviço fundamentais (`/residencial`, `/comercial-industrial`, `/lsf`, `/servicos`, `/portfolio`) **não estão indexadas**.

#### Detectada, Mas Não Indexada (31 páginas)

Status: "Não foi iniciado" — Google detectou via sitemap mas **nunca rastreou** (todas com "N/D" no último rastreamento).

**21 posts do blog:**
- `/atualidades/5-vantagens-decisivas-light-steel-frame`
- `/atualidades/certificacoes-steel-frame`
- `/atualidades/construir-ou-comprar-pronto-numeros-grande-sp`
- `/atualidades/custo-steel-frame-m2-2026`
- `/atualidades/drywall-st-ru-rf`
- `/atualidades/financiamento-construcao-steel-frame`
- `/atualidades/financiar-construcao-light-steel-frame`
- `/atualidades/fissuras-steel-frame`
- `/atualidades/guia-definitivo-steel-frame-brasil`
- `/atualidades/isolamento-termico-acustico-steel-frame`
- `/atualidades/passo-passo-construcao-steel-frame`
- `/atualidades/protecao-contra-quedas-construcao-civil`
- `/atualidades/quanto-custa-construir-steel-frame-precos-m2-2026`
- `/atualidades/steel-frame-fogo-incendio`
- `/atualidades/steel-frame-futuro-construcao`
- `/atualidades/steel-frame-terremoto-teste-cfs10`
- `/atualidades/steel-frame-vantagens-desvantagens`
- `/atualidades/steel-frame-vs-alvenaria`
- `/atualidades/steel-frame-vs-wood-frame`
- `/atualidades/sustentabilidade-construcao-industrializada`
- `/atualidades/tendencias-construcao-modular-2025`

**5 páginas de serviço:**
- `/comercial-industrial`
- `/lsf`
- `/portfolio`
- `/residencial`
- `/servicos`

**2 legais:**
- `/privacidade`
- `/termos-de-uso`

**3 projetos:**
- `/projetos/casa-de-campo`
- `/projetos/chale`
- `/projetos/loft`

#### Rastreada, Mas Não Indexada (3 páginas)

Google rastreou o conteúdo e decidiu NÃO indexar:

| URL | Último rastreamento | Análise |
|-----|-------------------|---------|
| `/atualidades/iluminacao-led-residencial` | 23 mar 2026 | Post fora do core temático (LED residencial ≠ steel frame). Google pode ter considerado off-topic para o domínio. Também é 1 dos 3 posts SEM `answer_summary`. |
| `/perguntas-frequentes?q={search_term_string}` | 23 mar 2026 | **Bug:** URL gerada pelo SearchAction schema com placeholder literal. Não é uma página real. |
| *(1 URL adicional não identificada nos prints)* | — | — |

#### Páginas com Redirecionamento (2)

| URL | Análise |
|-----|---------|
| `http://berkahn.com.br/` | HTTP → HTTPS redirect. Normal. |
| `https://berkahn.com.br/` | non-www → www redirect. Normal. |

Validação iniciada em 12/04/2026. Sem ação necessária.

#### Erros 404 (2)

| URL | Último rastreamento | Análise |
|-----|-------------------|---------|
| `/$` | 23 mar 2026 | URL malformada — provavelmente bot ou link quebrado com caractere especial |
| `/&` | 23 mar 2026 | Idem |

Baixa prioridade. Podem ser ignorados ou respondidos com 404 limpo (que já é o caso).

### 3.2 Performance de Busca (últimos 90 dias)

| Query | Cliques | Impressões | CTR estimado |
|-------|---------|------------|-------------|
| berkahn | 39 | 69 | ~57% |
| construtora steel frame sp | 1 | 2 | 50% |
| construtora morumbi | 1 | 1 | 100% |
| www.berkahn.com.br | 0 | 5 | 0% |
| frame construtora | 0 | 2 | 0% |
| construção steel frame | 0 | 1 | 0% |
| aquapanel residential | 0 | 1 | 0% |

**Total: 41 cliques, ~81 impressões, 7 queries.**

**Análise:**
- **100% do tráfego é branded** — apenas "berkahn" gera cliques significativos
- **Zero tráfego de keywords informacionais** — nenhuma busca tipo "custo steel frame", "vantagens steel frame", "como construir steel frame" está gerando impressões
- **Os 23 artigos do blog geram zero tráfego orgânico**
- CTR da query branded é excelente (57%), mas o volume é mínimo

### 3.3 Core Web Vitals

"Não há dados de uso suficientes nos últimos 90 dias para este tipo de dispositivo" — tanto celular quanto computador.

**Implicação:** O site tem menos de ~1.000 pageviews/mês no CrUX (Chrome User Experience Report). Sem CWV field data, o Google não aplica o filtro de CWV no ranking — mas isso também confirma que o tráfego real é muito baixo.

---

## 4. Auditoria de Conteúdo — Supabase (23 posts)

### 4.1 Completude dos Campos SEO/AEO

| Campo | Preenchido | % | Impacto |
|-------|-----------|---|---------|
| `cover_image` | 23/23 | 100% | ✅ Perfeito — OG image sempre disponível |
| `tags` | 22/23 | 95% | ⚠️ 1 post sem tags: `quanto-custa-construir-steel-frame-precos-m2-2026` |
| `answer_summary` | 20/23 | 86% | ⚠️ 3 posts sem: `steel-frame-no-mundo`, `financiar-construcao-light-steel-frame`, `iluminacao-led-residencial` |
| `meta_title` | **14/23** | **60%** | ❌ **9 posts antigos sem SEO title** — no SERP, Google gera title genérico |
| `meta_description` | **14/23** | **60%** | ❌ **9 posts antigos sem description** — snippet gerado automaticamente |

### 4.2 Posts sem meta_title / meta_description (os 9 gaps)

Todos publicados entre set/2024 e jan/2025 — os mais antigos do blog:

| Slug | Publicado | Categoria | answer_summary |
|------|-----------|-----------|---------------|
| `certificacoes-steel-frame` | 18/01/2025 | Segurança | ✅ |
| `guia-definitivo-steel-frame-brasil` | 15/01/2025 | Guia | ✅ |
| `steel-frame-futuro-construcao` | 01/12/2024 | Tecnologia | ✅ |
| `5-vantagens-decisivas-light-steel-frame` | 25/11/2024 | Guia | ✅ |
| `passo-passo-construcao-steel-frame` | 18/11/2024 | Educação | ✅ |
| `sustentabilidade-construcao-industrializada` | 01/11/2024 | Meio Ambiente | ✅ |
| `tendencias-construcao-modular-2025` | 25/10/2024 | Mercado | ✅ |
| `isolamento-termico-acustico-steel-frame` | 28/09/2024 | Tecnologia | ✅ |
| `financiamento-construcao-steel-frame` | 20/09/2024 | Guia | ✅ |

**Ação:** Preencher `meta_title` (~60 chars) e `meta_description` (~155 chars) para esses 9 posts no painel admin. Quick win de 30 minutos.

### 4.3 Fragmentação de Categorias

| Categoria | Posts | Problema |
|-----------|-------|---------|
| Guia | 4 | — |
| Mercado | 4 | — |
| Tecnologia | 3 | Confunde com "Tecnologia e Inovação" |
| Guia Técnico | 3 | Confunde com "Guia" e "Guias" |
| Análise | 2 | — |
| Guias | 1 | Deveria ser "Guia" |
| Arquitetura e Tecnologia | 1 | Deveria ser "Tecnologia" |
| Tecnologia e Inovação | 1 | Deveria ser "Tecnologia" |
| Segurança e Normas | 1 | Deveria ser "Segurança" |
| Segurança | 1 | — |
| Educação | 1 | Poderia ser "Guia" |
| Meio Ambiente | 1 | Poderia ser "Sustentabilidade" |

**12 categorias para 23 posts = impossível criar topic clusters.**

**Proposta de normalização (5 categorias):**

| Categoria Proposta | Posts Incluídos | Qtd |
|---|---|---|
| **Guias e Tutoriais** | Guia + Guias + Guia Técnico + Educação | 9 |
| **Tecnologia e Inovação** | Tecnologia + Tecnologia e Inovação + Arquitetura e Tecnologia | 5 |
| **Mercado e Custos** | Mercado + Análise | 6 |
| **Segurança e Normas** | Segurança + Segurança e Normas | 2 |
| **Sustentabilidade** | Meio Ambiente | 1 |

### 4.4 Freshness / updated_at

Todos os 23 posts mostram `updated_at = 2026-03-23` — indica um bulk update em massa. Isso é um problema:

- Google e IAs interpretam `dateModified` como indicador de conteúdo atualizado
- 23 artigos "atualizados" no mesmo dia sem mudança real de conteúdo pode ser interpretado como manipulação de freshness
- **Recomendação:** Ao atualizar posts no futuro, fazer updates reais e individuais (editar conteúdo, adicionar dados novos, expandir seções)

### 4.5 Post Potencialmente Draft

`quanto-custa-construir-steel-frame-precos-m2-2026` tem `published_at = NULL`. Verificar:
- Se está acessível publicamente (aparece na sitemap?)
- Se é rascunho, remover da sitemap
- Se é publicado, definir `published_at` corretamente

---

## 5. Fundação Técnica Compartilhada (SEO + AEO)

### 5.1 Arquitetura — Estado Atual

| Aspecto | Status | Referência |
|---------|--------|-----------|
| SSR/ISR | ✅ Sólido | Next.js 15 App Router, `revalidate: 60` nos posts |
| Metadata root | ✅ Completo | `app/layout.tsx:26-81` — title, description, keywords, OG, Twitter, icons, manifest, robots |
| metadataBase | ✅ Correto | `https://www.berkahn.com.br` em `app/layout.tsx:39` |
| Canonical por página | ✅ Todas | `alternates.canonical` em cada page.tsx |
| Redirects 301 | ✅ | `/atualidade` → `/atualidades` em `next.config.ts` |
| Security headers | ✅ | X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| Font loading | ✅ | Manrope + Caveat com `display: "swap"` em `app/layout.tsx:12-24` |
| Preconnect | ✅ | Supabase + GTM + Unsplash em `app/layout.tsx:91-93` |
| Image optimization | ✅ | `next/image` com WebP, lazy loading, LCP preload em hero pages |

### 5.2 Structured Data — Mapa Completo

| Schema Type | Localização | Status | Notas |
|---|---|---|---|
| `@graph` (container) | `app/layout.tsx:107` | ✅ | Conecta Organization + WebSite via `@id` |
| `LocalBusiness` + `GeneralContractor` | `app/layout.tsx:109-165` | ✅ | Geo, address, telephone, taxID, areaServed, openingHours, sameAs |
| `WebSite` + `SearchAction` | `app/layout.tsx:167-179` | ✅ ⚠️ | SearchAction funciona mas gera URL crawlável inválida no GSC |
| `BlogPosting` | `app/atualidades/[slug]/page.tsx:200-223` | ✅ | datePublished, dateModified, author, wordCount, timeRequired |
| `FAQPage` (LSF) | `app/lsf/page.tsx:306-322` | ✅ | ~25 perguntas LSF |
| `FAQPage` (Hub) | `app/perguntas-frequentes/page.tsx:151-167` | ✅ | Todas as FAQs |
| `FAQPage` (artigos) | `components/article/FAQSection.tsx:107-123` | ✅ | FAQ inline via `[FAQ:id]` placeholder |
| `Service` + `OfferCatalog` | `app/residencial/page.tsx:64-103` | ✅ | 3 offers + areaServed + provider |
| `Service` + `OfferCatalog` | `app/comercial-industrial/page.tsx:64-80` | ✅ | Idem |
| `HowTo` | `app/servicos/page.tsx:77-80` | ✅ | Processo construtivo |
| `BreadcrumbList` | `components/layout/Breadcrumb.tsx:20-31, 68-79` | ✅ | Ubíquo em todas as páginas internas |
| `Person` (Author) | `components/article/AuthorBio.tsx:81-100` | ✅ | hasCredential CREA, sameAs, jobTitle, alumniOf |

**Gaps de schema identificados:**
- ❌ `AggregateRating` / `Review` — nenhum schema de avaliação (Google Business reviews não refletidos)
- ❌ `ItemList` para listagem de posts — `/atualidades` não emite schema de lista
- ⚠️ `SearchAction` gera URL inválida no crawler — ver bug N8

### 5.3 Sitemap e Robots

**Sitemap (`app/sitemap.ts:1-54`):**
- ✅ 11 static pages + Supabase posts + legacy articles + projetos
- ✅ Deduplicação de slugs via Set
- ✅ Priority e changeFrequency definidos (home=1.0, serviços=0.9, blog=0.7)
- ⚠️ `lastModified` apenas na homepage e nos posts Supabase (falta em static pages e legacy)

**Robots (`app/robots.ts:1-19`):**
- ✅ Allow `/` para todos os bots
- ✅ Disallow `/admin/`, `/orcamento/pdf`, `/apresentacao-executiva/`
- ⚠️ Bloqueia apenas CCBot — faltam GPTBot, ClaudeBot, Google-Extended (training bots)
- ⚠️ Não permite explicitamente OAI-SearchBot, Claude-SearchBot, PerplexityBot (search bots)

### 5.4 E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

| Sinal | Status | Detalhe |
|-------|--------|--------|
| Author com credenciais | ✅ | Person schema com CREA, jobTitle, sameAs LinkedIn |
| Organization com CNPJ | ✅ | `taxID: "39.455.932/0001-64"` no LocalBusiness |
| Endereço e telefone | ✅ | São Paulo, +5511966415742 |
| Google Business Profile | ❓ | Não verificado se existe GBP ativo linkando para o site |
| Menções de terceiros | ❌ | Sem evidência de menções em jornais, listas, diretórios CREA/Sinduscon |
| Backlinks | ❌ | Domínio novo sem perfil de backlinks |
| Reviews/testimonials schema | ❌ | Sem AggregateRating, sem Review schema |

---

## 6. SEO Técnico — Problemas Específicos

### 6.1 Problema Principal: Indexação

**Diagnóstico:** O Google descobriu 44 URLs via sitemap mas indexou apenas 6. As 31 "detectada, mas não indexada" têm "N/D" (nunca rastreadas). Isso significa que o Google **nem gastou crawl budget** para ler o conteúdo dessas páginas.

**Causas prováveis (em ordem de impacto):**

1. **Domínio sem autoridade** — berkahn.com.br tem ~3 meses, sem backlinks significativos, sem menções externas. Google não vê razão para investir crawl budget num site desconhecido.

2. **Muitas URLs submetidas para um site novo** — 44 URLs na sitemap para um domínio sem histórico. Google prefere indexar incrementalmente.

3. **Ausência de sinais externos** — sem links de parceiros, diretórios de construção, CREA-SP, Sinduscon-SP, Google Business Profile (se existir) apontando para o site.

4. **Internal linking fraco** — as 6 páginas indexadas (home, blog listing, FAQ, empresa, 1 post) são as mais interligadas. As 31 não indexadas (posts individuais, páginas de serviço) podem ter poucos links internos apontando para elas.

### 6.2 URLs 404

- `/$` e `/&` — URLs malformadas detectadas pelo crawler. Provavelmente originadas de um link quebrado em JavaScript ou de bots testando URLs. **Ação:** Nenhuma necessária — o 404 é a resposta correta.

### 6.3 Redirects

- `http://berkahn.com.br/` → `https://www.berkahn.com.br/` ✅
- `https://berkahn.com.br/` → `https://www.berkahn.com.br/` ✅
- Validação iniciada 12/04/2026. Comportamento correto.

### 6.4 Metadata Gaps nos Posts

9 posts publicados entre set/2024 e jan/2025 não têm `meta_title` nem `meta_description` no Supabase. Quando indexados, o Google gerará:
- **Title:** Pode usar o `<title>` do HTML (que Next.js gera a partir de `post.title`) — aceitável mas não otimizado
- **Description:** Google extrai automaticamente do conteúdo — mas perde controle sobre o que aparece

**Impacto:** Moderado. O fallback do Next.js (`post.title` → `meta.title`) funciona, mas títulos SEO otimizados convertem melhor no SERP.

---

## 7. AEO Específico — Estado e Gaps

### 7.1 Contexto: AEO Depende da Indexação

Os AI search engines que mais importam para a Berkahn funcionam assim:

| Plataforma | Como encontra conteúdo | Implicação para Berkahn |
|---|---|---|
| **ChatGPT** (70% mercado) | Usa índice do Google via SerpAPI | Se não está indexado no Google, ChatGPT não encontra |
| **Google AI Overviews** | Usa índice do Google | Idem |
| **Perplexity** | Crawler próprio (PerplexityBot) | Pode encontrar via sitemap se não estiver bloqueado |
| **Claude** | Brave Search | Pode funcionar independente do Google |

**Conclusão:** Resolver indexação no Google é pré-requisito para 70-80% da visibilidade AEO.

### 7.2 Answer-First Content Pattern

**Campo `answer_summary`:**
- 20/23 posts têm answer_summary preenchido (86%)
- Componente `AnswerSummary` renderiza como primeiro bloco do artigo
- **3 posts sem:** `steel-frame-no-mundo`, `financiar-construcao-light-steel-frame`, `iluminacao-led-residencial`

**"Ski ramp" pattern (primeiros 30% = 44.2% das citações):**
- Não auditado em detalhe (requer leitura do conteúdo markdown de cada post)
- O `answer_summary` serve como "ski ramp" se for o primeiro parágrafo visible
- **Recomendação:** auditar se o `answer_summary` é renderizado ANTES do conteúdo principal ou se fica buried

### 7.3 Passage Extractability

**Fatores positivos:**
- Hierarquia H1→H2→H3 correta (`components/sections/Hero.tsx`, `components/atualidade/HeroEditorial.tsx`)
- FAQ components (`FAQSection`, FAQ hub) geram passages Q&A naturais
- Tabelas de comparação (`[TABLE:id]`, `[COMPARISON:id]`) — +32.5% citações segundo pesquisa
- Answer summary como passage standalone de 50-150 palavras

**Fatores negativos (não verificados):**
- Links internos DENTRO de parágrafos podem fragmentar passages (91% citações = 0 internal links no parágrafo)
- Comprimento dos artigos não verificado (meta: 20K+ chars = 10.18 citações médias)

### 7.4 robots.txt para AI Bots

**Estado atual** (`app/robots.ts`):
```
Bloqueado: CCBot apenas
Permitido: todos os demais (incluindo training bots)
```

**Estado recomendado:**
```
Bloquear (training): GPTBot, ClaudeBot, Google-Extended
Permitir (search): OAI-SearchBot, Claude-SearchBot, PerplexityBot
Manter bloqueado: CCBot
```

### 7.5 FAQPage Coverage

| Localização | Schema | Quantidade | Topic |
|---|---|---|---|
| `/lsf` | FAQPage | ~25 perguntas | Steel Frame técnico |
| `/perguntas-frequentes` | FAQPage | 80+ perguntas | Todas as categorias |
| Artigos com `[FAQ:id]` | FAQPage (inline) | Variável | Por artigo |

**Gap:** Não há `FAQPage` schema nas páginas de serviço (`/residencial`, `/comercial-industrial`). Se essas páginas tiverem seções FAQ visuais sem schema, é uma oportunidade perdida.

---

## 8. Editorial / Conteúdo

### 8.1 Inventário de Posts

**23 posts no Supabase**, publicados entre set/2024 e abr/2026:

| Período | Posts | Ritmo |
|---------|-------|-------|
| Set-Nov 2024 | 7 | ~2/mês |
| Dez 2024 - Jan 2025 | 3 | ~1.5/mês |
| Fev 2025 - Fev 2026 | 0 | Pausa de 13 meses |
| Mar 2026 | 11 | Sprint intenso |
| Abr 2026 | 2 | Retorno ao ritmo |

**Observação:** Houve uma pausa de ~13 meses (fev/2025 a fev/2026). Os 11 posts de março 2026 parecem ter sido publicados em sprint. Isso pode ter contribuído para o Google "desconfiar" do volume repentino.

### 8.2 Topic Clusters — Estado Atual vs. Proposta

**Estado atual: SEM clusters definidos.** As 12 categorias fragmentadas impedem clustering.

**Proposta de 4 clusters (após normalização de categorias):**

**Cluster 1: "Guia Completo Steel Frame" (Pillar + 9 posts)**
- Pillar: `/lsf` (expandir para 3K+ palavras)
- Posts: `guia-definitivo-steel-frame-brasil`, `passo-passo-construcao-steel-frame`, `5-vantagens-decisivas-light-steel-frame`, `steel-frame-vantagens-desvantagens`, `fissuras-steel-frame`, `isolamento-termico-acustico-steel-frame`, `certificacoes-steel-frame`, `drywall-st-ru-rf`, `steel-frame-fogo-incendio`

**Cluster 2: "Custos e Comparações" (Pillar + 5 posts)**
- Pillar: criar novo (`/atualidades/custo-completo-steel-frame-2026` ou expandir `custo-steel-frame-m2-2026`)
- Posts: `custo-steel-frame-m2-2026`, `quanto-custa-construir-steel-frame-precos-m2-2026`, `construir-ou-comprar-pronto-numeros-grande-sp`, `steel-frame-vs-alvenaria`, `steel-frame-vs-wood-frame`

**Cluster 3: "Futuro e Sustentabilidade" (Pillar + 4 posts)**
- Pillar: expandir `steel-frame-futuro-construcao` ou criar novo
- Posts: `steel-frame-futuro-construcao`, `sustentabilidade-construcao-industrializada`, `tendencias-construcao-modular-2025`, `steel-frame-no-mundo`

**Cluster 4: "Financiamento e Processo" (3 posts)**
- Posts: `financiamento-construcao-steel-frame`, `financiar-construcao-light-steel-frame`, `protecao-contra-quedas-construcao-civil`

**Posts fora de cluster (temática periférica):**
- `iluminacao-led-residencial` — off-topic para steel frame, considerar remover ou reposicionar
- `steel-frame-terremoto-teste-cfs10` — pode entrar no Cluster 1 (segurança estrutural)

### 8.3 Internal Linking — Gap Crítico

**Estado atual:**
- Legacy articles (`ArticleContent.tsx`) → `RelatedArticlesCarousel` ✅
- Supabase posts (`RichPostRenderer.tsx`) → **SEM related articles** ❌
- `[SERVICELINK:slug]` placeholder existe para 7 links de serviço ✅
- Links contextuais dentro de parágrafos → não estruturado

**Impacto na indexação:** O Google usa internal links para descobrir e priorizar páginas. Se os 22 posts não indexados têm poucos links apontando para eles (apenas a listagem `/atualidades`), o Google vê esses posts como "folhas" de baixa importância.

---

## 9. Roadmap Executável

### Prioridade 0 — Desbloqueio de Indexação (URGENTE)

Sem resolver isso, nenhuma outra otimização tem efeito.

| # | Ação | Responsável | Tempo | Arquivo/Local | Critério de Aceitação |
|---|------|-------------|-------|--------------|----------------------|
| P0.1 | **Solicitar indexação manual** no GSC para as 10 páginas mais importantes: `/residencial`, `/comercial-industrial`, `/lsf`, `/servicos`, `/portfolio` + top 5 posts (`guia-definitivo`, `steel-frame-vantagens-desvantagens`, `custo-steel-frame-m2-2026`, `steel-frame-vs-alvenaria`, `passo-passo-construcao-steel-frame`) | Bruno | 30min | Google Search Console → Inspeção de URL → "Solicitar indexação" | URLs aparecem como "Enviado e indexado" no GSC em 1-7 dias |
| P0.2 | **Criar/ativar Google Business Profile** e linkar para o site — link externo autoritativo | Bruno | 1h | Google Business Profile | GBP publicado com link para berkahn.com.br |
| P0.3 | **Preencher meta_title e meta_description** dos 9 posts antigos | Bruno | 30min | Painel admin Supabase → editar cada post | 23/23 posts com meta_title e meta_description preenchidos |
| P0.4 | **Preencher answer_summary** dos 3 posts faltantes | Bruno | 20min | Painel admin Supabase | 23/23 posts com answer_summary |
| P0.5 | **Verificar post draft** `quanto-custa-construir-steel-frame-precos-m2-2026` — definir `published_at` ou remover da sitemap | Bruno/Claude | 10min | Supabase → posts → filtrar por slug | Post com published_at definido OU removido da sitemap |
| P0.6 | **Corrigir bug SearchAction** — Google está crawlando `/perguntas-frequentes?q={search_term_string}` literalmente | Claude | 15min | `app/layout.tsx:174-177` | URL placeholder não aparece mais no GSC como "rastreada" |

### Prioridade 1 — Aceleradores de Indexação e Autoridade (1-2 semanas)

| # | Ação | Responsável | Tempo | Arquivo/Local | Critério de Aceitação |
|---|------|-------------|-------|--------------|----------------------|
| P1.1 | **Integrar RelatedArticlesCarousel** no RichPostRenderer para posts Supabase | Claude | 1h | `components/blog/RichPostRenderer.tsx` | Cada post Supabase exibe 3-4 artigos relacionados no final |
| P1.2 | **Normalizar categorias** de 12 → 5 no Supabase | Bruno/Claude | 30min | Supabase → tabela posts → UPDATE category | Categorias normalizadas conforme proposta Seção 8.2 |
| P1.3 | **Adicionar lastModified** a static pages no sitemap | Claude | 15min | `app/sitemap.ts:10-22` | Todas as static pages com lastModified |
| P1.4 | **Expandir robots.ts** com regras granulares de AI bots | Claude | 15min | `app/robots.ts` | Training bots bloqueados, search bots permitidos explicitamente |
| P1.5 | **Cadastrar berkahn.com.br** em diretórios brasileiros de construção | Bruno | 2h | Apontador, Habitissimo, CREA-SP, Sinduscon-SP, GuiaMais | 5+ citações NAP consistentes publicadas |
| P1.6 | **Compartilhar 5 posts** nas redes sociais (LinkedIn, Instagram) com links | Bruno | 1h | Redes sociais | 5 posts publicados com links para berkahn.com.br/atualidades/* |

### Prioridade 2 — Qualidade de Conteúdo e AEO (2-4 semanas)

| # | Ação | Responsável | Tempo | Arquivo/Local | Critério de Aceitação |
|---|------|-------------|-------|--------------|----------------------|
| P2.1 | **Estruturar internal linking** dentro dos posts (links contextuais entre artigos do mesmo cluster) | Bruno/Claude | 3h editorial | Conteúdo markdown dos posts no Supabase | Cada post tem 2-3 links internos para posts relacionados do mesmo cluster |
| P2.2 | **Expandir `/lsf` como pillar page** do Cluster 1 (3K+ palavras com links para 9 posts) | Claude | 2h | `app/lsf/page.tsx` | Página com 3K+ palavras e 9 links para posts do cluster |
| P2.3 | **Atualizar `updated_at` individualmente** nos posts que foram realmente editados (não bulk) | Bruno | ongoing | Supabase → posts | Posts editados têm `updated_at` individual, não batch |
| P2.4 | **Adicionar hreflang pt-BR** auto-referencial em todas as páginas | Claude | 20min | Padrão em `app/layout.tsx` ou por página | `alternates.languages` definido com pt-BR |
| P2.5 | **Avaliar remoção ou reposicionamento** de `iluminacao-led-residencial` | Bruno | 15min decisão | — | Decisão documentada: manter (reposicionar categoria) ou despublicar |

### Prioridade 3 — Nice-to-Have

| # | Ação | Responsável | Tempo |
|---|------|-------------|-------|
| P3.1 | Adicionar `AggregateRating` / `Review` schema se houver reviews do GBP | Claude | 30min |
| P3.2 | Adicionar `ItemList` schema na listagem `/atualidades` | Claude | 30min |
| P3.3 | Adicionar tag de verificação HTML do GSC como backup | Claude | 5min |
| P3.4 | RSS feed para blog (LLMs consomem RSS) | Claude | 1h |
| P3.5 | Criar page `/sobre-o-autor` com schema Person expandido e credenciais | Bruno/Claude | 1h |

---

## 10. Monitoramento e Governance

### 10.1 Métricas a Acompanhar

| Métrica | Ferramenta | Meta 30 dias | Meta 90 dias |
|---------|-----------|-------------|-------------|
| Páginas indexadas | GSC → Indexação | 15+ | 35+ |
| Queries com impressões | GSC → Performance | 20+ | 50+ |
| Cliques orgânicos/mês | GSC → Performance | 100+ | 500+ |
| Posts com meta_title completo | Supabase | 23/23 | 23/23 |
| CWV field data disponível | GSC → CWV | Pode não ter dados | Primeiros dados |
| Citações em AI | Manual (testar perguntas no ChatGPT/Perplexity) | 1+ menção | 5+ menções |

### 10.2 Cadência de Revisão

- **Semanal (primeiros 2 meses):** Verificar indexação no GSC — quantas das 31 páginas foram indexadas?
- **Quinzenal:** Testar queries informacionais no Google e em AI search engines
- **Mensal:** Revisar performance report completo, ajustar prioridades
- **Trimestral:** Re-auditar structured data, atualizar conteúdo dos posts mais antigos

### 10.3 Ferramentas Recomendadas

| Ferramenta | Uso | Status |
|-----------|-----|--------|
| Google Search Console | Indexação, queries, CWV | ✅ Verificado |
| Google Analytics 4 | Tráfego, comportamento | ✅ Configurado |
| Vercel Speed Insights | CWV (lab data) | ✅ Ativo |
| Google Business Profile | Local SEO, reviews | ❓ Verificar se existe |
| PageSpeed Insights | CWV detalhado (análise futura separada) | Pendente |
| Ahrefs / SEMrush (free tier) | Backlinks, domain authority | Recomendado |

---

## Anexo A — Arquivos de Referência para Implementação

| Categoria | Arquivo | Linhas Relevantes |
|-----------|---------|-------------------|
| Metadata root | `app/layout.tsx` | 26-81 (metadata), 91-93 (preconnect), 104-182 (schemas) |
| Robots | `app/robots.ts` | 1-19 |
| Sitemap | `app/sitemap.ts` | 1-54 |
| Blog post renderer | `app/atualidades/[slug]/page.tsx` | 71-130 (metadata), 200-223 (BlogPosting schema), 228-230 (AnswerSummary) |
| Rich content | `components/blog/RichPostRenderer.tsx` | 67-97 (placeholders), 597-633 (SERVICELINK) |
| Legacy renderer | `app/atualidades/[slug]/ArticleContent.tsx` | — |
| Related articles | `components/article/RelatedArticlesCarousel.tsx` | 1-88 |
| Author schema | `components/article/AuthorBio.tsx` | 81-100 |
| FAQ schema | `components/article/FAQSection.tsx` | 107-123 |
| FAQ hub | `app/perguntas-frequentes/page.tsx` | 37 (metadata), 151-167 (FAQPage schema) |
| LSF page | `app/lsf/page.tsx` | 33 (metadata), 306-322 (FAQ schema) |
| Residencial | `app/residencial/page.tsx` | 57 (metadata), 64-103 (Service schema) |
| Comercial | `app/comercial-industrial/page.tsx` | 57 (metadata), 64-80 (Service schema) |
| Serviços | `app/servicos/page.tsx` | 25 (metadata), 77-80 (HowTo schema) |
| Breadcrumbs | `components/layout/Breadcrumb.tsx` | 20-31, 68-79 |
| Config | `next.config.ts` | Redirects, headers, image config |
| FAQ data | `lib/faq-data.ts` | getAllFAQItems() |
| LSF FAQ | `lib/lsf-data.ts` | LSF_FAQ array |

## Anexo B — Fontes de Pesquisa Base

- `Docs/SEO & AEO/research_SEO_AEO.md` — Blueprint SEO+AEO 2026 (fev/2026)
- `Docs/SEO & AEO/diagnostico-seo-aeo-berkahn.md` — Diagnóstico v1 (19/03/2026, score 74/100, **substituído por este documento**)
- Google Search Console — Dados reais coletados abr/2026
- Supabase REST API — Auditoria de 23 posts (abr/2026)
