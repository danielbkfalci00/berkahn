---
tipo: context
criado: 2026-04-13
atualizado: 2026-05-21
tags:
  - ai/context
  - project/site
  - project/blog
ai_summary: Estratégia SEO + AEO Berkahn (abril 2026, score 52/100). Padrões Passage-Level + Ski Ramp (44.2% citações AI nos primeiros 30%). Hierarquia headings, schema.org, robots.txt seletivo. P0: indexação (6/44 páginas).
status: active
escopo: berkahn
---

# Estratégia SEO & AEO — Berkahn

Regras destiladas das pesquisas em `Docs/SEO & AEO/` para guiar toda criação de conteúdo. Aplica em [[article-pipeline]] e [[workflow-conteudo]].

## Estado Atual (abril 2026)

- **Score geral**: 52/100
- **Indexação**: 6 de 44 páginas (14%) — problema crítico
- **Tráfego orgânico**: 41 cliques em 90 dias, 100% branded ("berkahn")
- **Domínio**: ~3 meses de idade, sem backlinks
- **Infraestrutura técnica**: sólida (schema.org, meta tags, ISR, canonicals)
- **Problema real**: Google detecta mas não indexa a maioria das páginas

## Regras para Conteúdo (SEO + AEO)

### Passage-Level Optimization

- Cada passagem de 50-150 palavras deve ser autocontida
- Um parágrafo = uma ideia completa = citável por IA
- Se um AI copiar apenas aquele parágrafo, ele deve fazer sentido sozinho

### Padrão "Ski Ramp"

- 44.2% das citações de IA vêm dos primeiros 30% do conteúdo
- Resposta primeiro, contexto depois
- Abertura do artigo deve entregar valor imediato (hook com dado concreto)
- Não "construir suspense" — entregar logo

### Hierarquia de Headings

- H1: título do artigo (1 por página)
- H2: seções principais (incluir keyword quando natural)
- H3: subseções
- Nunca pular níveis (H1 → H3 sem H2)
- Heading deve funcionar como pergunta respondida pelo conteúdo abaixo

### Keywords

- Densidade natural (~1-1.5%) — se parecer forçado, está errado
- Keyword principal no H1, primeiro parágrafo, e pelo menos 2 H2s
- Keywords secundárias distribuídas naturalmente
- Keywords Berkahn: Light Steel Frame, LSF, construção industrializada, construção a seco
- Primeira menção de LSF deve explicar o que é brevemente (ver [[steel-frame-domain]])

### Structured Data (JSON-LD)

O site já tem: LocalBusiness, GeneralContractor, BlogPosting, FAQPage, Service, HowTo, BreadcrumbList.

- Todo artigo com FAQ deve ter schema FAQPage
- ArticleSchema com author, datePublished, dateModified
- HowTo para artigos de processo/passo-a-passo

### Meta Tags

- `meta_title`: max 60 caracteres, keyword no início
- `meta_description`: 150-160 caracteres, CTA implícito
- OG tags (og:title, og:description, og:image) para compartilhamento social
- **9 posts ainda sem meta_title/meta_description** — preencher é prioridade

### Internal Linking

- Todo artigo deve ter 3-5 links internos para outros artigos
- Texto âncora descritivo (não "clique aqui")
- Artigos relacionados via RelatedArticlesCarousel
- Topic clusters: artigos agrupados por tema com pillar page

### Performance (Core Web Vitals)

- **LCP** < 2.5s (imagem de capa otimizada, WebP)
- **FID** < 100ms (componentes leves)
- **CLS** < 0.1 (sem layout shifts)
- ISR com revalidação a cada 60s
- Imagens lazy-loaded, code splitting

## Regras para AEO (AI Engine Optimization)

### Como IAs citam conteúdo

- ChatGPT, Perplexity, Google AI Overviews, Claude — cada um extrai diferente
- Todos priorizam: passagens autocontidas, dados com fonte, expertise demonstrada
- Fator E-E-A-T é universal: Experience, Expertise, Authoritativeness, Trustworthiness

### O que maximiza citações por IA

- Respostas diretas nas primeiras linhas de cada seção
- Dados quantitativos com fonte (estatísticas, comparativos)
- Expertise demonstrada (normas, experiência prática)
- Linguagem assertiva e específica (evitar "pode ser", "talvez", "geralmente")
- answer_summary no banco de dados (campo específico para IA)

### robots.txt

- Permitir Googlebot, Bingbot, DuckDuckBot
- Bloquear bots de treinamento: GPTBot, ClaudeBot, CCBot, anthropic-ai
- Permitir bots de busca AI: ChatGPT-User, PerplexityBot

## Prioridades Atuais

### P0 — Indexação (urgente)
1. Solicitar indexação manual no GSC para 10 páginas críticas
2. Criar/ativar Google Business Profile
3. Preencher meta_title/meta_description nos 9 posts faltantes
4. Preencher answer_summary nos 3 posts faltantes
5. Corrigir bug de SearchAction gerando URL inválida

### P1 — 1-2 semanas
1. Normalizar 12 categorias para 5
2. Adicionar lastModified a páginas estáticas no sitemap
3. Registrar em diretórios de construção brasileiros
4. Compartilhar 5 posts em redes sociais

### P2 — 2-4 semanas
1. Estruturar internal linking entre posts
2. Expandir /lsf como pillar page (3K+ palavras)
3. Adicionar hreflang pt-BR auto-referencial

## Referências

- Pipeline de artigos: [[article-pipeline]]
- Brand: [[berkahn-brand]]
- Domínio LSF: [[steel-frame-domain]]
- Workflow editorial: [[workflow-conteudo]]
- Auditorias SEO realizadas: `Berkahn-Vault/40-content/auditorias-seo/`
