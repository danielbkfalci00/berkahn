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
3. **Arquivar o artigo no vault:**
   - Pasta: `Berkahn-Vault/40-content/blog/publicados/`
   - Salvar markdown final em `Berkahn-Vault/40-content/blog/publicados/[slug].md` (com frontmatter completo: tipo, slug, supabase_id, publicado_em, seo_title, seo_description, palavras_chave, ai_summary, tags)
   - Imagens de capa continuam em `public/images/img_blog/[slug]/cover.webp` (consumidas pelo Next.js)
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
5. Crie o script em `scripts/articles/add-article-[slug].mjs` (use `process.env.SUPABASE_SERVICE_KEY` — NÃO hardcodar)
6. Execute o script no Supabase
7. Valide a inserção e confirme a URL
8. **Pós-publicação (lembrete para Bruno):** Acessar Google Search Console → Inspeção de URL → colar `https://www.berkahn.com.br/atualidades/[slug]` → "Solicitar indexação"

Use Frontend Designer Skill e shadcn/ui via MCP para qualidade visual excepcional.

$ARGUMENTS
