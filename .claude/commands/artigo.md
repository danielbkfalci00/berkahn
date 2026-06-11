---
description: Implementar artigo no blog com componentes interativos e publicar no Supabase
---

Leia os seguintes arquivos de contexto (vault Obsidian):
- `Berkahn-Vault/20-context/article-pipeline.md` — pipeline completo, componentes disponíveis, regras de arquivo
- `Berkahn-Vault/20-context/seo-aeo-strategy.md` — regras de SEO
- `Berkahn-Vault/30-prompts/article-implementation-prompt.md` — prompt de produção completo (LOCKED — executar fielmente)

Execute o pipeline de implementação completo:

1. Analise o conteúdo markdown e identifique componentes interativos
2. Crie o objeto JSONB completo com placeholders
3. **Arquivar o artigo no vault** (frontmatter expandido pós-Sprint 2):
   - Pasta: `Berkahn-Vault/40-content/blog/publicados/`
   - Salvar markdown final em `Berkahn-Vault/40-content/blog/publicados/[slug].md` com frontmatter completo (ordem canônica do linter):
     ```yaml
     ---
     tipo: draft-content
     criado: YYYY-MM-DD
     atualizado: YYYY-MM-DD
     tags:
       - project/blog
       - status/published
       - domain/<lsf|steel-frame|drywall|normas|financiamento|sustentabilidade>
     ai_summary: "1-3 linhas TL;DR para Claude SKIM (diferente de answer_summary do Supabase)"
     status: published
     projeto: blog
     slug: <kebab-case do filename>
     data_publicacao: YYYY-MM-DD
     seo_title: "<= 60 chars, keyword nos primeiros 30"
     seo_description: "150-160 chars"
     palavras_chave: [array de keywords]
     supabase_id: <UUID retornado pelo INSERT>
     url_final: "https://www.berkahn.com.br/atualidades/<slug>"
     linkedin_slug: <slug ou null>
     material_visual_slug: <nome-arquivo.webp ou null>
     answer_summary: "80-120 palavras, AEO-optimized, assertivo, com dado quantitativo, sem hedging"
     contextos_aplicados:
       - berkahn-brand
       - seo-aeo-strategy
       - article-pipeline
     ---
     ```
   - **CRÍTICO**: `ai_summary` (vault, 1-3 linhas) ≠ `answer_summary` (Supabase, 80-120 palavras). São CAMPOS DIFERENTES.
   - Imagens de capa continuam em `public/images/img_blog/[slug]/cover.webp` (consumidas pelo Next.js)
   - Se houver imagem de capa PNG/JPG avulsa, converter para WebP com sharp (quality 80, max 1200px) e salvar em `public/images/img_blog/[slug]/cover.webp`
   - **Slug authority = filename**. Se renomear, fazer PATCH Supabase atomicamente + 301 redirect em `next.config.js`
4. **VALIDAÇÃO SEO/AEO obrigatória antes do INSERT:**
   - `meta_title` (Supabase) / `seo_title` (vault frontmatter): ≤60 chars, keyword nos primeiros 30 chars
   - `meta_description` (Supabase) / `seo_description` (vault): 150-160 chars
   - `answer_summary` (Supabase + vault frontmatter): 80-120 palavras, assertivo, com dado quantitativo, sem hedging (pode/talvez/depende)
   - `ai_summary` (vault frontmatter ONLY, não vai para Supabase): 1-3 linhas TL;DR para Claude SKIM
   - `tags` (Supabase) / `palavras_chave` (vault): 3-5 keywords
   - `category` (Supabase): uma de [Tecnologia, Sustentabilidade, Projetos, Mercado, Guias]
   - `components.faqs` (Supabase JSONB): mínimo 3 perguntas
   - Wikilinks vault (corpo): 2-3 links para atomic notes em [[70-knowledge/]]
   - Links internos Supabase (markdown): 3-5 links para `/atualidades/[outros-slugs]`
   - Rodapé padrão (vault): `**Contexto aplicado**: [[berkahn-brand]] · [[seo-aeo-strategy]] · [[article-pipeline]] · [[steel-frame-domain]]`
   - Se algum campo falhar, preencher ANTES de criar o script
5. Crie o script em `scripts/articles/add-article-[slug].mjs` (use `process.env.SUPABASE_SERVICE_KEY` — NÃO hardcodar)
6. Execute o script no Supabase
7. Valide a inserção e confirme a URL
8. **Pós-publicação (lembrete para Bruno):** Acessar Google Search Console → Inspeção de URL → colar `https://www.berkahn.com.br/atualidades/[slug]` → "Solicitar indexação"

Use Frontend Designer Skill e shadcn/ui via MCP para qualidade visual excepcional.

$ARGUMENTS
