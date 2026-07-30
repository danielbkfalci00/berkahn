---
tipo: context
criado: 2026-04-13
atualizado: 2026-07-08
tags:
  - ai/context
  - project/blog
  - domain/lsf
ai_summary: Pipeline técnico de artigos do blog Berkahn — 4 etapas (/brainstorm, /pesquisa, /criacao, /artigo), arquivos em Docs/publicados, 19 componentes interativos via placeholders, schema Supabase posts.
status: active
escopo: berkahn
---

# Pipeline de Artigos — Blog Berkahn

Documenta o fluxo completo de criação e publicação de artigos em `/atualidades`.

## Fluxo de Trabalho (4 etapas)

```
1. /brainstorm → Gerar ideias priorizadas por impacto
2. /pesquisa  → Pesquisar e escrever artigo completo sobre tema escolhido
3. /criacao   → Escrever artigo final com regras rígidas de qualidade
4. /artigo    → Implementar com componentes interativos + publicar no Supabase
```

Após publicação: `/linkedin` para criar post de divulgação.

Workflow editorial em [[workflow-conteudo]]. Regras de copy em [[copy-sem-travessao]] e [[berkahn-brand]].

## Arquivo de Publicações

Todo conteúdo publicado é arquivado em `Berkahn-Vault/40-content/blog/publicados/` (após Fase 8 da migração; antes ficava em `Docs/Conteúdo/publicados/blog/`).

```
40-content/
  blog/
    publicados/
      [slug].md          ← markdown final do artigo (com frontmatter)
    drafts/
      [slug].md          ← rascunho ativo
    ideias/
      ideas-YYYY-MM.md   ← saída de /brainstorm
    pesquisa/
      YYYY-MM-DD-tema.md ← saída de /pesquisa
  linkedin/
    YYYY-MM-DD-tema/
      post.md            ← texto pronto + hashtags
      briefing-imagem.md ← briefing visual para Canva
      imagem-final.png   ← exportada do Canva (manual)
```

Capas vivem em `public/images/img_blog/[slug]/cover.webp` (consumido pelo Next.js — fora do vault).

### Passos obrigatórios no /artigo
1. Salvar markdown final em `40-content/blog/publicados/[slug].md`
2. Converter imagem de capa para WebP
3. Copiar WebP para `public/images/img_blog/[slug]/cover.webp`
4. Criar script `scripts/articles/add-article-[slug].mjs` e inserir no Supabase

### Passos obrigatórios no /linkedin
1. Salvar texto em `40-content/linkedin/YYYY-MM-DD-tema/post.md`
2. Salvar briefing em `40-content/linkedin/YYYY-MM-DD-tema/briefing-imagem.md`
3. Informar Bruno para exportar Canva como `imagem-final.png` na mesma pasta

## Onde mora cada coisa

| O quê | Onde |
|-------|------|
| Markdown publicado | `Berkahn-Vault/40-content/blog/publicados/` |
| LinkedIn arquivado | `Berkahn-Vault/40-content/linkedin/` |
| Scripts de inserção | `scripts/articles/add-article-[slug].mjs` (gitignored) |
| Metadados dos posts | `data/posts.ts` |
| Componentes de artigo | `components/article/` (25 componentes) |
| Renderizador principal | `app/atualidades/[slug]/page.tsx` |
| Tipos TypeScript | `types/article.ts`, `types/blog.ts` |
| Capas (live) | `public/images/img_blog/[slug]/cover.webp` |

## Banco de Dados (Supabase)

Detalhes em [[supabase-config]].

- **Tabela**: `posts`
- **INSERT**: `POST /rest/v1/posts` com `Prefer: return=representation` → 201
- **UPDATE**: `PATCH /rest/v1/posts?id=eq.{ID}` com `Prefer: return=minimal` → 204

### Schema do post
```typescript
{
  id: uuid,
  title: string,
  slug: string,
  excerpt: string,              // 150-200 chars
  content: string,              // Markdown com placeholders
  cover_image: string,          // /images/img_blog/[slug]/cover.webp
  category: string,
  tags: string[],
  author: "Berkahn",
  status: "published",
  published_at: timestamptz,
  read_time: number,
  featured: boolean,
  meta_title: string,           // max 60 chars, keyword no início
  meta_description: string,     // 150-160 chars
  components: jsonb             // Objeto com arrays nomeados
}
```

## Sistema de Componentes Interativos

### Componentes disponíveis
1. **StatsGrid** — Números e estatísticas em destaque (ícones Lucide)
2. **DataTable** — Comparações lado a lado (colunas customizáveis)
3. **ChartSection** — Gráficos (bar, line, radar, pie) via Recharts
4. **MythBuster** — Mito vs Verdade (ícones X e Check)
5. **ChecklistSection** — Listas de verificação com checkmark
6. **Gallery** — Grid responsivo com lightbox
7. **NormsSection** — Normas técnicas em accordion
8. **ArticleImage** — Imagem única otimizada
9. **VideoEmbed** — Embed de vídeo (YouTube, Vimeo)
10. **BeforeAfterSlider** — Comparação visual antes/depois
11. **TimelineSection** — Linha do tempo de cronograma
12. **FAQSection** — Perguntas frequentes (com schema.org)
13. **DynamicCalculator** / **FinancingCalculator** — Calculadoras interativas
14. **CertificationBadges** — Badges de certificações
15. **TestimonialCard** — Depoimentos de clientes
16. **ResourceDownload** — Biblioteca de downloads
17. **Comparison3DMatrix** — Comparação multidimensional com radar
18. **SpecificationSheet** — Ficha técnica de materiais
19. **CTA** — Call-to-Action (OBRIGATÓRIO em todo artigo)

### Sistema de Placeholders

Componentes são intercalados no texto via placeholders no markdown:

```markdown
Texto explicativo sobre custos...

[CHART:anatomia-preco]

Mais texto após o gráfico...

[TABLE:tabela-comparativa]

[CTA:cta-orcamento]
```

**Placeholders disponíveis**:
`[STATS:id]`, `[TABLE:id]`, `[CHART:id]`, `[CHECKLIST:id]`, `[MYTHS:id]`, `[GALLERY:id]`, `[IMAGE:id]`, `[NORMS:id]`, `[VIDEO:id]`, `[BEFOREAFTER:id]`, `[TIMELINE:id]`, `[FAQ:id]`, `[CALCULATOR:id]`, `[CERTIFICATIONS:id]`, `[TESTIMONIAL:id]`, `[RESOURCES:id]`, `[COMPARISON3D:id]`, `[SPECSHEET:id]`, `[CTA:id]`

**Regras**:
- O `id` no placeholder DEVE corresponder ao `id` no JSONB
- Placeholders em linhas separadas (não inline)
- Sem placeholder = renderizado no final automaticamente
- Todo artigo DEVE ter `[CTA:id]` ao final

### CTA (Call-to-Action)

- **Obrigatório** em todo artigo
- Dois modos: `dialog` (abre formulário de contato) ou `link` (navega para página)
- `defaultSegment`: pré-seleciona "residencial" ou "comercial"
- Copy deve ser contextual ao tema (não genérico)

### Estrutura JSONB dos componentes

```json
{
  "stats": [{ "id": "...", "title": "...", "stats": [...] }],
  "charts": [{ "id": "...", "title": "...", "type": "bar", "data": [...] }],
  "tables": [{ "id": "...", "title": "...", "headers": [...], "rows": [...] }],
  "ctas": [{ "id": "...", "label": "...", "title": "...", "actionType": "dialog", ... }]
}
```

### Gotchas de implementação (verificados em produção)

Aprendizados confirmados contra o código real — evitam bugs silenciosos no `/artigo`:

- **O corpo NÃO deve começar com o H1 (`# Título`).** `renderMarkdown` converte `# ` em `<h2>` (`RichPostRenderer.tsx:273`) e a página já renderiza `post.title` como hero `<h1>` (`app/atualidades/[slug]/page.tsx:219`), então incluir o H1 no `content` duplica o título visualmente (hero + h2 grande). Comece o corpo no parágrafo lead. Convenção dos artigos novos (`steel-frame-aguenta-vento-forte`, `steel-frame-laje-de-concreto`); ~32 artigos antigos ainda repetem o título e podem ser corrigidos aos poucos.

- **`StatHighlight` (STATS) NÃO suporta decimais.** O componente chama `<CountUp end={value} />` sem passar `decimals` (`components/article/StatHighlight.tsx`), então `CountUp` usa `Math.floor` (`components/animations/CountUp.tsx`) e trunca: `value: 2.6` renderiza **"2"**. Para números fracionados (ex.: limites em metros), use `[TABLE:]` com a string exata (`"2,60 m"`) em vez de STATS. Reserve STATS para valores **inteiros** (percentuais, contagens).
- **`NormsSection` (NORMS) tem título fixo "Normas e Certificações".** O componente hardcoda `<CardTitle>Normas e Certificações</CardTitle>` (`RichPostRenderer.tsx:342`), sem prop para sobrescrever. Serve para NBRs, mas fica semanticamente errado sobre legislação e incentivos fiscais (Lei, Decreto, IPTU Verde). Para marco legal ou incentivos, use `[TABLE:]` com `caption` própria em vez de `[NORMS:]`. Verificado no artigo `energia-solar-residencial` (tabela `incentivos-fiscais` no lugar de NORMS).
- **Wikilinks `[[...]]` no corpo vazam para o Supabase.** O script de inserção só remove frontmatter e o rodapé `<!-- vault-rodape-v1 -->`; o corpo vai verbatim para o `content`, e o renderer não interpreta wikilinks (apareceriam como texto literal). No corpo use **só links markdown** (`[texto](/atualidades/slug)` internos; URLs externas abrem em nova aba). Wikilinks de vault ficam **só no rodapé** (`[[lsf-normas-nbr]]`, contextos) e em `contextos_aplicados`.
- **Conteúdo renderiza 2× no DOM (responsivo).** Há variante mobile/desktop; uma fica `display:none`. Ao verificar via DOM, filtre por `offsetParent !== null` — `tables`/`h1` aparecem em dobro mas só metade é visível (não é bug).
- **`next/image` em dev**: `naturalWidth` pode ser `0` por lazy-load no momento do eval, e `preview_screenshot` pode dar timeout. Confirme a capa pela **rede** (`/_next/image?...→200`) ou decodificando a imagem no contexto da página, não pelo screenshot.

## Artigos Publicados

Registro atualizado em [[artigos-publicados]]. Para queries estruturadas (status, SEO, datas), ver [[artigos.base]].

## Imagens

- Formato: WebP (quality 80, max width 1200px)
- Conversão: `sharp` via scripts em `scripts/images/` (gitignored)
- Caminho: `/images/img_blog/[slug]/` para imagens do artigo
- Cover: `/images/img_blog/[slug]/cover.webp` (1200x800px, aspect 3:2)
- Alt text descritivo em todas as imagens

## Referências

- Estratégia SEO/AEO: [[seo-aeo-strategy]]
- Brand: [[berkahn-brand]]
- Domínio técnico: [[steel-frame-domain]]
- Workflow editorial: [[workflow-conteudo]]
- Pipeline técnico (caminhos): [[blog-pipeline]]
