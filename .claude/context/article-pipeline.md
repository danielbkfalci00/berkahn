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

## Arquivo de Publicações

Todo conteúdo publicado é arquivado localmente em `Docs/publicados/`:

```
Docs/publicados/
  blog/
    [slug]/
      artigo.md          ← markdown final do artigo
      capa.webp          ← imagem de capa convertida para WebP
  linkedin/
    [YYYY-MM-DD]-[tema]/
      post.md            ← texto pronto + hashtags
      briefing-imagem.md ← briefing visual para Canva
      imagem-final.png   ← exportada do Canva pelo Bruno (passo manual)
```

### Passos obrigatórios no /artigo
1. Salvar markdown final em `Docs/publicados/blog/[slug]/artigo.md`
2. Converter imagem de capa para WebP e salvar em `Docs/publicados/blog/[slug]/capa.webp`
3. Copiar WebP para `public/images/img_blog/[slug]/cover.webp` (caminho do site)
4. Criar script e inserir no Supabase

### Passos obrigatórios no /linkedin
1. Salvar texto em `Docs/publicados/linkedin/[YYYY-MM-DD]-[tema]/post.md`
2. Salvar briefing em `Docs/publicados/linkedin/[YYYY-MM-DD]-[tema]/briefing-imagem.md`
3. Informar o Bruno para exportar a imagem do Canva como `imagem-final.png` na mesma pasta

## Onde mora cada coisa

| O quê | Onde |
|-------|------|
| Arquivo de artigos publicados | `Docs/publicados/blog/[slug]/` |
| Arquivo de posts LinkedIn | `Docs/publicados/linkedin/[data]-[tema]/` |
| Markdown dos artigos (legacy) | `Docs/blog/publicados/` |
| Scripts de inserção | `scripts/articles/add-article-[slug].mjs` |
| Dados estáticos (legacy) | `data/articles/*.ts` |
| Metadados dos posts | `data/posts.ts` |
| Componentes de artigo | `components/article/` (25 componentes) |
| Renderizador principal | Componente em `app/atualidades/[slug]/page.tsx` |
| Tipos TypeScript | `types/article.ts`, `types/blog.ts` |

## Banco de Dados (Supabase)

- **Tabela**: `posts`
- **INSERT**: `POST /rest/v1/posts` com `Prefer: return=representation` → status 201
- **UPDATE**: `PATCH /rest/v1/posts?id=eq.{ID}` com `Prefer: return=minimal` → status 204

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

## Artigos Publicados (Supabase)

| Slug | ID Supabase |
|------|-------------|
| `drywall-st-ru-rf` | `f03921da-0daf-4375-8e13-aa1fc6ad75ac` |
| `protecao-contra-quedas-construcao-civil` | `2a1a81da-84df-461c-85c4-80ce0072319c` |
| `steel-frame-terremoto-teste-cfs10` | `fa5f253b-2ac1-4647-8a3a-4c66cc809bce` |

(+ outros posts no Supabase — verificar com `node scripts/articles/check-posts.mjs`)

## Imagens

- Formato: WebP (quality 80, max width 1200px)
- Conversão: `sharp` via scripts em `scripts/images/`
- Caminho: `/images/img_blog/[slug]/` para imagens do artigo
- Cover: `/images/img_blog/[slug]/cover.webp` (1200x800px, aspect 3:2)
- Alt text descritivo em todas as imagens
