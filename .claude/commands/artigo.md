---
description: Implementar artigo no blog com componentes interativos e publicar no Supabase
---

Leia os seguintes arquivos de contexto:
- `.claude/context/article-pipeline.md` — pipeline completo, componentes disponíveis, e regras de arquivo
- `.claude/context/seo-aeo-strategy.md` — regras de SEO
- `.claude/prompts/article-implementation-prompt.md` — prompt de produção completo

Execute o pipeline de implementação completo:

1. Analise o conteúdo markdown e identifique componentes interativos
2. Crie o objeto JSONB completo com placeholders
3. **Arquivar o artigo localmente:**
   - Pasta de conteúdo: `Docs/Conteúdo/publicados/blog/`
   - Salvar markdown final em `Docs/Conteúdo/publicados/blog/[slug].md` (se ainda não existir)
   - Imagens de capa: já ficam em `public/images/img_blog/[slug]/cover.webp`
   - Se houver imagem de capa PNG/JPG avulsa, converter para WebP com sharp (quality 80, max 1200px) e salvar em `public/images/img_blog/[slug]/cover.webp`
4. **VALIDAÇÃO SEO/AEO obrigatória antes do INSERT:**
   - `meta_title`: ≤60 chars, keyword nos primeiros 30 chars
   - `meta_description`: 150-160 chars
   - `answer_summary`: 80-120 palavras, assertivo, com dado quantitativo, sem hedging (pode/talvez/depende)
   - `tags`: 3-5 tags preenchidas
   - `category`: uma de [Tecnologia, Sustentabilidade, Projetos, Mercado, Guias]
   - `faqs`: presente no components com mínimo 3 perguntas
   - Links internos: 3-5 links para `/atualidades/[outros-slugs]` no markdown
   - Se algum campo falhar, preencher ANTES de criar o script
5. Crie o script em `scripts/articles/add-article-[slug].mjs`
6. Execute o script no Supabase
7. Valide a inserção e confirme a URL
8. **Pós-publicação (lembrete para Bruno):** Acessar Google Search Console → Inspeção de URL → colar `https://www.berkahn.com.br/atualidades/[slug]` → "Solicitar indexação". Sem indexação, o artigo é invisível para ChatGPT e Google AI Overviews.

Use Frontend Designer Skill e shadcn/ui via MCP para qualidade visual excepcional.

$ARGUMENTS
