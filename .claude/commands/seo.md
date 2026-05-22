---
description: Auditar SEO e AEO de uma pagina do site
---

Leia os seguintes arquivos de contexto (vault Obsidian):
- `Berkahn-Vault/20-context/seo-aeo-strategy.md` — estratégia e regras de SEO/AEO
- `Berkahn-Vault/30-prompts/seo-page-audit.md` — prompt de auditoria

Pergunte ao usuário qual página auditar (ex: /residencial, /servicos, /atualidades/[slug]).

Execute a auditoria completa:
1. Leia o código da página (page.tsx, componentes, metadata)
2. Verifique meta tags, structured data, headings, conteúdo AEO
3. Verifique performance, internal linking, acessibilidade
4. Entregue relatório com score, problemas e ações imediatas

**Arquivar a auditoria no vault:**
Salvar em `Berkahn-Vault/40-content/auditorias-seo/[YYYY-MM-DD]-[pagina-slug].md` com frontmatter (tipo: meta, tags: project/site, project/blog, source/manual, ai_summary). Score + ações imediatas + recomendações de melhoria. Cruzável com analytics para track de progresso.

$ARGUMENTS
